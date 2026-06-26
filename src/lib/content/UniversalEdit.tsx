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

function isLeafText(el: Element): boolean {
  // No child element with own text (only text nodes inside)
  for (const c of Array.from(el.children)) {
    if (c.matches(LEAF_SELECTOR)) return false;
  }
  const t = (el.textContent ?? "").trim();
  return t.length >= 2 && t.length <= 1500;
}

function computeId(pathname: string, el: Element, originalText: string): string {
  return `auto::${pathname}::${el.tagName.toLowerCase()}::${hash(originalText).slice(0, 10)}`;
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
      const els = root.querySelectorAll(LEAF_SELECTOR);
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
    return () => { cancelled = true; cancelAnimationFrame(r1); clearTimeout(t1); clearTimeout(t2); };
  }, [pathname, get]);

  // Toggle contentEditable when in edit mode
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isAdmin || !editMode) return;

    const cleanups: Array<() => void> = [];
    const activate = () => {
      const root = document.querySelector("main") ?? document.body;
      const els = root.querySelectorAll(LEAF_SELECTOR);
      els.forEach((node) => {
        const el = node as HTMLElement;
        if (el.dataset.editActive === "1") return;
        if (el.closest("[data-no-edit]")) return;
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
        const onBlurOrEnter = async () => {
          const newText = (el.textContent ?? "").trim();
          el.style.outline = "1px dashed rgba(59,130,246,0.6)";
          if (newText && newText !== original) {
            try { await save(id, newText); el.setAttribute("data-edit-original", newText); }
            catch { alert("Erro ao salvar. Verifique se você está logado como admin."); el.textContent = original; }
          } else if (!newText) {
            el.textContent = original;
          }
        };
        const onKey = (ev: KeyboardEvent) => {
          if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); el.blur(); }
          if (ev.key === "Escape") { el.textContent = el.getAttribute("data-edit-original") ?? ""; el.blur(); }
        };
        const onClick = (ev: MouseEvent) => {
          // Prevent navigation when editing links/buttons
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlurOrEnter);
        el.addEventListener("keydown", onKey);
        el.addEventListener("click", onClick, true);
        cleanups.push(() => {
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlurOrEnter);
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