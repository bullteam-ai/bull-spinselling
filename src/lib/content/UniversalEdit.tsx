import { useEffect, useRef, useState } from "react";
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

  // Floating Save button state
  const [focused, setFocused] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const focusedRef = useRef<HTMLElement | null>(null);
  focusedRef.current = focused;

  // Reposition the floating button when scrolling/resizing
  useEffect(() => {
    if (!focused) { setPos(null); return; }
    const update = () => {
      const r = focused.getBoundingClientRect();
      setPos({ top: Math.max(8, r.top - 40), left: Math.min(window.innerWidth - 160, r.left) });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [focused]);

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

        let lastSaved = original;
        const readText = () => {
          // innerText converts <br> and block boundaries into \n; textContent doesn't.
          // Required to preserve line breaks the user types with Enter/Shift+Enter.
          const raw = (el as HTMLElement).innerText ?? el.textContent ?? "";
          return raw.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
        };
        const persistNow = async (): Promise<boolean> => {
          const newText = readText();
          if (!newText) { el.innerText = lastSaved; setDirty(false); return false; }
          if (newText === lastSaved) { setDirty(false); return true; }
          setSaving(true);
          try {
            await save(id, newText);
            lastSaved = newText;
            el.setAttribute("data-edit-original", newText);
            setDirty(false);
            setSavedFlash(true);
            setTimeout(() => setSavedFlash(false), 1200);
            return true;
          } catch (err: unknown) {
            const e = err as { message?: string; details?: string; hint?: string; code?: string };
            const msg = e?.message || e?.details || e?.hint || JSON.stringify(err);
            console.error("[universal-edit] save failed", err);
            alert("Erro ao salvar: " + msg + (e?.code ? ` (code ${e.code})` : ""));
            return false;
          } finally {
            setSaving(false);
          }
        };
        // Expose persist for the floating button via dataset reference
        (el as HTMLElement & { __persist?: () => Promise<boolean> }).__persist = persistNow;

        const onFocus = () => {
          el.style.outline = "2px solid rgba(59,130,246,1)";
          setFocused(el);
          setDirty(readText() !== lastSaved);
        };
        const onInput = () => {
          setDirty(readText() !== lastSaved);
        };
        const onKey = (ev: KeyboardEvent) => {
          if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
            ev.preventDefault();
            void persistNow();
          }
          if (ev.key === "Escape") {
            el.innerText = lastSaved;
            setDirty(false);
            el.blur();
          }
        };
        const onBlur = () => {
          el.style.outline = "1px dashed rgba(59,130,246,0.6)";
        };
        const onClick = (ev: MouseEvent) => {
          // Prevent navigation when editing links/buttons
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
        el.addEventListener("input", onInput);
        el.addEventListener("keydown", onKey);
        el.addEventListener("click", onClick, true);
        cleanups.push(() => {
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
          el.removeEventListener("input", onInput);
          el.removeEventListener("keydown", onKey);
          el.removeEventListener("click", onClick, true);
          el.removeAttribute("contenteditable");
          el.style.outline = "";
          el.style.outlineOffset = "";
          el.style.cursor = "";
          delete el.dataset.editActive;
          delete (el as HTMLElement & { __persist?: unknown }).__persist;
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
      setFocused(null);
    };
  }, [isAdmin, editMode, pathname, save]);

  if (!isAdmin || !editMode || !focused || !pos) return null;

  const onSaveClick = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    const target = focusedRef.current as (HTMLElement & { __persist?: () => Promise<boolean> }) | null;
    if (!target?.__persist) return;
    await target.__persist();
  };

  return (
    <div
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
      onMouseDown={(e) => e.preventDefault()} // keep focus on the editable element
    >
      <button
        type="button"
        onClick={onSaveClick}
        disabled={saving || (!dirty && !savedFlash)}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-lg transition disabled:opacity-60"
        style={{
          background: savedFlash ? "#16a34a" : dirty ? "#2563eb" : "#64748b",
          color: "white",
        }}
      >
        {saving ? "Salvando…" : savedFlash ? "✓ Salvo" : dirty ? "Salvar (Ctrl+Enter)" : "Sem alterações"}
      </button>
    </div>
  );
}