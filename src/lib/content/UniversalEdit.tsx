import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useContent } from "./ContentContext";

// Lightweight stable hash (djb2)
function hash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

const LEAF_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,button,a,span,strong,em,td,th,blockquote,label,figcaption,summary";

const EDITABLE_TEXT_SELECTOR = `${LEAF_SELECTOR},[data-editable-text]`;

function isLeafText(el: Element): boolean {
  if (el.hasAttribute("data-editable-text")) {
    const t = (el.textContent ?? "").trim();
    return t.length >= 2 && t.length <= 5000;
  }
  // No child element with own text (only text nodes inside)
  for (const c of Array.from(el.children)) {
    if (c.matches(LEAF_SELECTOR)) return false;
  }
  const t = (el.textContent ?? "").trim();
  return t.length >= 2 && t.length <= 8000;
}

function computeId(pathname: string, el: Element, originalText: string): string {
  const scopeEl = el.closest("[data-edit-scope]");
  const scope = scopeEl?.getAttribute("data-edit-scope") ?? "";
  const scopePart = scope ? `::${scope}` : "";
  return `auto::${pathname}${scopePart}::${el.tagName.toLowerCase()}::${hash(originalText).slice(0, 10)}`;
}

export function UniversalEdit() {
  const { isAdmin, editMode, get, save } = useContent();
  const router = useRouter();
  const pathname = router.state.location.pathname;

  // Apply overrides whenever path or overrides change (runs always, not only in edit mode)
  useEffect(() => {
    if (typeof document === "undefined") return;
    let cancelled = false;
    const apply = () => {
      if (cancelled) return;
      const root = document.querySelector("main") ?? document.body;
      const els = root.querySelectorAll(EDITABLE_TEXT_SELECTOR);
      els.forEach((el) => {
        if (el.closest("[data-no-edit]")) return;
        if (!isLeafText(el)) return;
        const original = (el.getAttribute("data-edit-original") ?? el.textContent ?? "").trim();
        if (!original) return;
        const id = computeId(pathname, el, original);
        const value = get(id, original);
        if (!el.getAttribute("data-edit-original")) {
          el.setAttribute("data-edit-original", original);
        }
        el.setAttribute("data-edit-id", id);
        if (value !== el.textContent) el.textContent = value;
      });
    };
    // Run after paint and again shortly after to catch async content
    const r1 = requestAnimationFrame(apply);
    const t1 = setTimeout(apply, 250);
    const t2 = setTimeout(apply, 1000);
    // Watch for dynamically mounted nodes (expanding cards, tab switches, etc.)
    const root = document.querySelector("main") ?? document.body;
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; apply(); });
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, [pathname, get]);

  // Toggle contentEditable when in edit mode
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isAdmin || !editMode) return;

    const cleanups: Array<() => void> = [];
    const activate = () => {
      const root = document.querySelector("main") ?? document.body;
      const els = root.querySelectorAll(EDITABLE_TEXT_SELECTOR);
      els.forEach((node) => {
        const el = node as HTMLElement;
        if (el.dataset.editActive === "1") return;
        if (el.closest("[data-no-edit]")) return;
        // Skip interactive elements so their click handlers (toggle, navigate) keep working.
        // Their inner text leaves (p, span, etc.) remain editable.
        const tag = el.tagName.toLowerCase();
        if (tag === "button" || tag === "a" || tag === "summary") return;
        if (!isLeafText(el)) return;
        const original = el.getAttribute("data-edit-original") ?? (el.textContent ?? "").trim();
        if (!original) return;
        el.setAttribute("data-edit-original", original);
        const id = el.getAttribute("data-edit-id") ?? computeId(pathname, el, original);
        el.setAttribute("data-edit-id", id);
        el.dataset.editActive = "1";
        el.contentEditable = "true";
        el.spellcheck = false;
        el.style.outline = "1px dashed rgba(59,130,246,0.6)";
        el.style.outlineOffset = "2px";
        el.style.borderRadius = "4px";
        el.style.cursor = "text";

        const onFocus = () => { el.style.outline = "2px solid rgba(59,130,246,1)"; };
        let debounceTimer: ReturnType<typeof setTimeout> | null = null;
        let lastSaved = original;
        const persist = async (newText: string) => {
          if (!newText || newText === lastSaved) return;
          try {
            await save(id, newText);
            lastSaved = newText;
            el.setAttribute("data-edit-original", newText);
          } catch (err: unknown) {
            const e = err as { message?: string; details?: string; hint?: string; code?: string };
            const msg = e?.message || e?.details || e?.hint || JSON.stringify(err);
            console.error("[universal-edit] save failed", err);
            alert("Erro ao salvar: " + msg + (e?.code ? ` (code ${e.code})` : ""));
          }
        };
        const readText = () => {
          // innerText converts <br> and block boundaries into \n; textContent doesn't.
          // Required to preserve line breaks the user types with Enter/Shift+Enter.
          const raw = (el as HTMLElement).innerText ?? el.textContent ?? "";
          return raw.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
        };
        const onInput = () => {
          if (debounceTimer) clearTimeout(debounceTimer);
          const snapshot = readText();
          debounceTimer = setTimeout(() => { void persist(snapshot); }, 600);
        };
        const onBlurOrEnter = async () => {
          const newText = readText();
          el.style.outline = "1px dashed rgba(59,130,246,0.6)";
          if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
          if (newText) {
            await persist(newText);
          } else {
            el.textContent = lastSaved;
          }
        };
        const onKey = (ev: KeyboardEvent) => {
          // Allow Enter to insert line breaks (we save innerText, so they persist).
          // Use Ctrl/Cmd+Enter to commit and blur.
          if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); el.blur(); }
          if (ev.key === "Escape") { el.textContent = lastSaved; el.blur(); }
        };
        const onClick = (ev: MouseEvent) => {
          // Prevent navigation when editing links/buttons
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlurOrEnter);
        el.addEventListener("input", onInput);
        el.addEventListener("keydown", onKey);
        el.addEventListener("click", onClick, true);
        cleanups.push(() => {
          if (debounceTimer) clearTimeout(debounceTimer);
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlurOrEnter);
          el.removeEventListener("input", onInput);
          el.removeEventListener("keydown", onKey);
          el.removeEventListener("click", onClick, true);
          el.removeAttribute("contenteditable");
          el.style.outline = "";
          el.style.outlineOffset = "";
          el.style.cursor = "";
          delete el.dataset.editActive;
        });
      });
    };

    const r1 = requestAnimationFrame(activate);
    const t1 = setTimeout(activate, 300);
    const t2 = setTimeout(activate, 1200);
    // Re-scan periodically while in edit mode (handles tab switches / dynamic content)
    const interval = setInterval(activate, 2000);

    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
      cleanups.forEach((c) => c());
    };
  }, [isAdmin, editMode, pathname, save]);

  return null;
}