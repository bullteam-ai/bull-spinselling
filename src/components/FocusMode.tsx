import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Modo Foco: durante uma videochamada, esconde tudo exceto o passo (section)
 * atual e oferece controles Prev/Next + atalhos de teclado.
 *
 * Auto-discovery: lê os filhos diretos de <main> que sejam <section id="...">.
 * Não exige marcação extra nas páginas (já existem ids para as âncoras do menu).
 */
export function FocusMode() {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState<Array<{ id: string; label: string }>>([]);
  const router = useRouter();
  const path = router.state.location.pathname;

  // Discover steps whenever the route changes (or focus mode activates)
  const discover = useCallback(() => {
    const main = document.querySelector("main");
    if (!main) return [] as Array<{ id: string; label: string; el: HTMLElement }>;
    const sections = Array.from(
      main.querySelectorAll<HTMLElement>(":scope > section[id]"),
    );
    return sections.map((el, i) => {
      const heading = el.querySelector("h1, h2, h3");
      const label =
        heading?.textContent?.trim().replace(/\s+/g, " ").slice(0, 60) ||
        el.id ||
        `Passo ${i + 1}`;
      return { id: el.id, label, el };
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    const found = discover();
    setSteps(found.map(({ id, label }) => ({ id, label })));
    // Try to resume on the section matching the URL hash
    const hash = window.location.hash.replace(/^#/, "");
    const hashIdx = found.findIndex((s) => s.id === hash);
    setIndex(hashIdx >= 0 ? hashIdx : 0);
  }, [active, path, discover]);

  // Apply / clear DOM effects when state changes
  useEffect(() => {
    const root = document.documentElement;
    if (!active) {
      root.classList.remove("focus-mode");
      const main = document.querySelector("main");
      if (main) {
        main
          .querySelectorAll<HTMLElement>(":scope > section[id]")
          .forEach((el) => el.removeAttribute("data-focus-hidden"));
      }
      return;
    }
    root.classList.add("focus-mode");
    const main = document.querySelector("main");
    if (!main || steps.length === 0) return;
    const current = steps[index]?.id;
    main
      .querySelectorAll<HTMLElement>(":scope > section[id]")
      .forEach((el) => {
        if (el.id === current) {
          el.removeAttribute("data-focus-hidden");
          // Smooth scroll into view at top
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        } else {
          el.setAttribute("data-focus-hidden", "true");
        }
      });
    // Reflect on URL hash so the journey nav stays in sync
    if (current && window.location.hash !== `#${current}`) {
      history.replaceState(null, "", `#${current}`);
    }
  }, [active, index, steps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("focus-mode");
    };
  }, []);

  // Listen for global toggle event (fired by TopNav button)
  useEffect(() => {
    const onToggle = () => setActive((a) => !a);
    const onSet = (e: Event) => {
      const ce = e as CustomEvent<{ active: boolean }>;
      if (ce.detail) setActive(!!ce.detail.active);
    };
    window.addEventListener("bt:focus-toggle", onToggle);
    window.addEventListener("bt:focus-set", onSet as EventListener);
    return () => {
      window.removeEventListener("bt:focus-toggle", onToggle);
      window.removeEventListener("bt:focus-set", onSet as EventListener);
    };
  }, []);

  // Broadcast active state so TopNav button can reflect it
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("bt:focus-state", { detail: { active } }),
    );
  }, [active]);

  // Keyboard shortcuts (only when active)
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape") {
        setActive(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, steps.length]);

  const total = steps.length;
  const current = steps[index];
  const noSteps = active && total === 0;

  const progress = useMemo(
    () => (total > 0 ? Math.round(((index + 1) / total) * 100) : 0),
    [index, total],
  );

  if (!active) return null;

  return (
    <div
      role="region"
      aria-label="Controles do Modo Foco"
      className="fixed inset-x-0 bottom-3 z-[80] flex justify-center px-3 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-[var(--success)]/40 bg-[var(--navy)]/95 text-white shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-[var(--navy)]/85">
        {noSteps ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>
              Nenhum passo detectado nesta página. Navegue até um roteiro (ex.: Guia da Ligação) para usar o Modo Foco.
            </span>
            <button
              onClick={() => setActive(false)}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20"
            >
              Sair
            </button>
          </div>
        ) : (
          <>
            <div className="h-1 w-full overflow-hidden rounded-t-2xl bg-white/10">
              <div
                className="h-full bg-[var(--success)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 sm:px-4">
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                disabled={index === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-white/10"
                aria-label="Passo anterior"
              >
                <span aria-hidden>◀</span>
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <div className="min-w-0 text-center">
                <div className="text-[10px] uppercase tracking-wider text-white/60">
                  Passo {index + 1} de {total}
                </div>
                <div className="truncate text-sm font-bold">{current?.label}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(i + 1, total - 1))}
                  disabled={index >= total - 1}
                  className="inline-flex items-center gap-1 rounded-lg bg-[var(--success)] px-3 py-2 text-sm font-bold text-[var(--navy)] disabled:opacity-40 hover:brightness-110"
                  aria-label="Próximo passo"
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <span aria-hidden>▶</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActive(false)}
                  className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-xs font-semibold hover:bg-white/10"
                  title="Sair do Modo Foco (Esc)"
                  aria-label="Sair do Modo Foco"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="hidden px-4 pb-2 text-center text-[10px] uppercase tracking-wider text-white/40 sm:block">
              ← → para navegar · Esc para sair
            </div>
          </>
        )}
      </div>
    </div>
  );
}