import { useMemo, useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  CALL_KINDS,
  OBJECTIVES,
  buildGuidedStages,
  type CallKindId,
  type ObjectiveId,
} from "@/data/guided-call";

type Props = { open: boolean; onClose: () => void };

export function GuidedCall({ open, onClose }: Props) {
  const [step, setStep] = useState<"kind" | "objective" | "run">("kind");
  const [kind, setKind] = useState<CallKindId | null>(null);
  const [objective, setObjective] = useState<ObjectiveId | null>(null);
  const [stageIdx, setStageIdx] = useState(0);
  const [reveal, setReveal] = useState<"none" | "sim" | "nao">("none");

  useEffect(() => {
    if (!open) return;
    setStep("kind");
    setKind(null);
    setObjective(null);
    setStageIdx(0);
    setReveal("none");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const stages = useMemo(
    () => (kind && objective ? buildGuidedStages(kind, objective) : []),
    [kind, objective],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const stage = stages[stageIdx];
  const total = stages.length;
  const progress = total > 0 ? Math.round(((stageIdx + 1) / total) * 100) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[85] flex flex-col bg-[#050b1f]/98 text-white overflow-y-auto"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#050b1f]/95 backdrop-blur">
        {step === "run" ? (
          <div className="h-1 w-full bg-white/10">
            <div
              className="h-full bg-[var(--success)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
              <Sparkles className="h-3 w-3" /> Ligação Guiada
            </span>
            {step === "run" && stage ? (
              <span className="text-xs sm:text-sm font-semibold text-white/70 truncate">
                Etapa {stageIdx + 1} de {total} · {stage.label}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 py-6 sm:py-10">
        {step === "kind" ? (
          <StepWrapper title="Passo 1 · Tipo de ligação" subtitle="Escolha quem você está ligando agora.">
            <div className="grid gap-4 sm:grid-cols-2">
              {CALL_KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => {
                    setKind(k.id);
                    setStep("objective");
                  }}
                  className="rounded-3xl border-2 border-white/15 bg-white/5 p-6 sm:p-8 text-left hover:border-[var(--success)] hover:bg-white/10 transition"
                >
                  <div className="text-4xl">{k.emoji}</div>
                  <p className="mt-4 text-2xl font-extrabold">{k.label}</p>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{k.hint}</p>
                </button>
              ))}
            </div>
          </StepWrapper>
        ) : null}

        {step === "objective" ? (
          <StepWrapper
            title="Passo 2 · Objetivo principal"
            subtitle="Selecione o objetivo que vai guiar esta ligação."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OBJECTIVES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setObjective(o.id);
                    setStageIdx(0);
                    setReveal("none");
                    setStep("run");
                  }}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4 text-left hover:border-[var(--success)] hover:bg-white/10 transition flex items-start gap-3"
                >
                  <span className="text-2xl">{o.emoji}</span>
                  <span className="text-base font-bold leading-tight">
                    {o.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-start">
              <button
                type="button"
                onClick={() => setStep("kind")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </button>
            </div>
          </StepWrapper>
        ) : null}

        {step === "run" && stage ? (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                Passo 3 · Condução guiada
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--success)]">
                {stage.label}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
                {stage.objetivo}
              </p>
            </div>

            <div className="rounded-3xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-[#0a1733] via-[#0f2050] to-[#122b6b] p-6 sm:p-10 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--success)]">
                Fala principal
              </p>
              <p className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold leading-snug tracking-tight">
                “{stage.fala}”
              </p>
            </div>

            {stage.aprofundamento.length ? (
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Opções de aprofundamento
                </p>
                <ul className="mt-2 space-y-1.5">
                  {stage.aprofundamento.map((a, i) => (
                    <li key={i} className="text-sm sm:text-base leading-snug">
                      • {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* SIM / NÃO branches */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setReveal(reveal === "sim" ? "none" : "sim")}
                className={`rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                  reveal === "sim"
                    ? "border-[var(--success)] bg-[var(--success)]/15"
                    : "border-[var(--success)]/40 bg-[var(--success)]/5 hover:bg-[var(--success)]/10"
                }`}
              >
                <span className="inline-flex items-center gap-2 text-[var(--success)] text-sm">
                  <ThumbsUp className="h-4 w-4" /> Cliente respondeu bem
                </span>
              </button>
              <button
                type="button"
                onClick={() => setReveal(reveal === "nao" ? "none" : "nao")}
                className={`rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                  reveal === "nao"
                    ? "border-[var(--danger)] bg-[var(--danger)]/15"
                    : "border-[var(--danger)]/40 bg-[var(--danger)]/5 hover:bg-[var(--danger)]/10"
                }`}
              >
                <span className="inline-flex items-center gap-2 text-[var(--danger)] text-sm">
                  <ThumbsDown className="h-4 w-4" /> Cliente resistiu / respondeu fraco
                </span>
              </button>
            </div>

            {reveal === "sim" && stage.sim.length ? (
              <div className="rounded-2xl border border-[var(--success)]/40 bg-[var(--success)]/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                  ✅ Fluxo SIM
                </p>
                <ul className="mt-3 space-y-2">
                  {stage.sim.map((s, i) => (
                    <li key={i} className="text-base leading-snug">• {s}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {reveal === "nao" && stage.nao.length ? (
              <div className="rounded-2xl border border-[var(--danger)]/40 bg-[var(--danger)]/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--danger)]">
                  ❌ Fluxo NÃO
                </p>
                <ul className="mt-3 space-y-2">
                  {stage.nao.map((s, i) => (
                    <li key={i} className="text-base leading-snug">• {s}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {stage.transicao ? (
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                  🎤 Transição recomendada
                </p>
                <p className="mt-2 text-base sm:text-lg leading-snug">
                  {stage.transicao}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Footer controls (run only) */}
      {step === "run" && stage ? (
        <div className="sticky bottom-0 border-t border-white/10 bg-[#050b1f]/95 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                if (stageIdx === 0) setStep("objective");
                else {
                  setStageIdx((i) => Math.max(i - 1, 0));
                  setReveal("none");
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base font-bold hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar etapa
            </button>
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base font-semibold hover:bg-white/10"
            >
              Encerrar
            </button>
            <button
              type="button"
              onClick={() => {
                if (stageIdx >= total - 1) return;
                setStageIdx((i) => Math.min(i + 1, total - 1));
                setReveal("none");
              }}
              disabled={stageIdx >= total - 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--success)] px-4 py-3 text-sm sm:text-base font-extrabold text-[var(--navy)] disabled:opacity-40 hover:brightness-110"
            >
              Próxima etapa <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
          {title}
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">{subtitle}</h2>
      </div>
      {children}
    </div>
  );
}