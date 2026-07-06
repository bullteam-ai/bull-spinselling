import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Modo Foco (teleprompter):
 *   Overlay opcional que reduz a carga visual e mostra apenas o essencial
 *   da etapa atual durante uma ligação ao vivo.
 *
 * Fontes de etapas, em ordem de prioridade:
 *   1) window.__btFocusSteps (populado pela página, ex.: /ligacoes).
 *   2) window "bt:focus-steps" CustomEvent com { steps }.
 *
 * Se nenhuma etapa foi publicada para a rota atual, exibimos um estado
 * vazio explícito. NUNCA inferimos etapas a partir do DOM da página para
 * evitar misturar textos aleatórios de seções da UI.
 */

export type FocusStep = {
  id?: string;
  label: string;
  pergunta: string;
  sim?: string[];
  nao?: string[];
  transicao?: string;
};

declare global {
  interface Window {
    __btFocusSteps?: FocusStep[];
  }
}

export function FocusMode() {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState<FocusStep[]>([]);
  const router = useRouter();
  const path = router.state.location.pathname;

  const loadSteps = useCallback(() => {
    const custom = window.__btFocusSteps;
    if (custom && custom.length) {
      setSteps(custom);
      return;
    }
    setSteps([]);
  }, []);

  useEffect(() => {
    if (!active) return;
    loadSteps();
    setIndex(0);
  }, [active, path, loadSteps]);

  // Listen for external step publication
  useEffect(() => {
    const onSteps = (e: Event) => {
      const ce = e as CustomEvent<{ steps: FocusStep[] }>;
      const s = ce.detail?.steps;
      if (s && s.length) {
        window.__btFocusSteps = s;
        if (active) setSteps(s);
      } else {
        delete window.__btFocusSteps;
        if (active) loadSteps();
      }
    };
    window.addEventListener("bt:focus-steps", onSteps as EventListener);
    return () =>
      window.removeEventListener("bt:focus-steps", onSteps as EventListener);
  }, [active, loadSteps]);

  // Toggle / set events + broadcast state
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

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("bt:focus-state", { detail: { active } }),
    );
    document.documentElement.classList.toggle("focus-mode", active);
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
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
  const progress = useMemo(
    () => (total > 0 ? Math.round(((index + 1) / total) * 100) : 0),
    [index, total],
  );

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Modo Foco"
      className="fixed inset-0 z-[90] flex flex-col bg-[#050b1f]/98 backdrop-blur-md text-white overflow-y-auto"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#050b1f]/95">
        <div className="h-1 w-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-[var(--success)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success)]/15 border border-[var(--success)]/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
              🎯 Modo Foco · Ligação ao vivo
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
            aria-label="Sair do Modo Foco"
          >
            Sair ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 py-6 sm:py-10">
        {total === 0 || !current ? (
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
            <p className="text-lg font-semibold">
              Nenhuma etapa detectada nesta página.
            </p>
            <p className="mt-2 text-sm text-white/70">
              Abra um roteiro (ex.: Guia da Ligação) para usar o Modo Foco.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                Etapa {index + 1} de {total}
              </p>
              <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-[var(--success)]">
                {current.label}
              </h2>
            </div>

            <div className="rounded-3xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-[#0a1733] via-[#0f2050] to-[#122b6b] p-6 sm:p-10 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--success)]">
                Fala principal
              </p>
              <p className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold leading-snug tracking-tight">
                “{current.pergunta}”
              </p>
            </div>

            {(current.sim?.length || current.nao?.length) ? (
              <div className="grid gap-4 md:grid-cols-2">
                {current.sim?.length ? (
                  <div className="rounded-2xl border border-[var(--success)]/40 bg-[var(--success)]/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                      ✅ Se responder SIM
                    </p>
                    <ul className="mt-3 space-y-2">
                      {current.sim.map((s, i) => (
                        <li key={i} className="text-base sm:text-lg leading-snug">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {current.nao?.length ? (
                  <div className="rounded-2xl border border-[var(--danger)]/40 bg-[var(--danger)]/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--danger)]">
                      ❌ Se responder NÃO
                    </p>
                    <ul className="mt-3 space-y-2">
                      {current.nao.map((s, i) => (
                        <li key={i} className="text-base sm:text-lg leading-snug">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {current.transicao ? (
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                  🎤 Transição recomendada
                </p>
                <p className="mt-2 text-lg leading-snug">{current.transicao}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="sticky bottom-0 border-t border-white/10 bg-[#050b1f]/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base font-bold disabled:opacity-40 hover:bg-white/10"
          >
            ← Voltar
          </button>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base font-semibold hover:bg-white/10"
          >
            Sair do Modo Foco
          </button>
          <button
            type="button"
            onClick={() =>
              setIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)))
            }
            disabled={total === 0 || index >= total - 1}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--success)] px-4 py-3 text-sm sm:text-base font-extrabold text-[var(--navy)] disabled:opacity-40 hover:brightness-110"
          >
            Próxima etapa →
          </button>
        </div>
        <div className="hidden sm:block text-center text-[10px] uppercase tracking-widest text-white/40 pb-2">
          ← → para navegar · Esc para sair
        </div>
      </div>
    </div>
  );
}