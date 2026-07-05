import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  X, Send, Sparkles, Trash2, Copy, Check, Maximize2, Minimize2,
  Bot, User as UserIcon, PhoneCall, Award, RefreshCw,
} from "lucide-react";
import { runTrainerAI } from "@/lib/trainer-ai.functions";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; content: string; ts: number };
type Mode = "chat" | "simulate";

declare global {
  interface Window {
    __btTrainerContext?: string;
    __btTrainerOpen?: () => void;
  }
}

const STORAGE_KEY = "bt:trainer-ai:v1";

const SUGGESTIONS: { icon: string; label: string; prompt: string }[] = [
  { icon: "🧠", label: "Como conduzo melhor essa etapa?", prompt: "Como conduzo melhor a etapa atual em que estou?" },
  { icon: "🎯", label: "Como aumentar minha conversão?", prompt: "Como posso aumentar minha conversão nesse tipo de ligação? Me dê 3 ajustes práticos." },
  { icon: "❓", label: "E se o cliente responder isso?", prompt: "E se o cliente responder que não tem tempo agora? Como conduzir?" },
  { icon: "📞", label: "Simule um cliente comigo", prompt: "__SIMULATE__" },
  { icon: "📝", label: "Analise minha abordagem", prompt: "Vou colar aqui minha abordagem. Me diga o que melhorar, mantendo a filosofia Bull Team." },
  { icon: "💡", label: "Explique essa pergunta", prompt: "Explique a pergunta principal da etapa em que estou: por que ela existe, o erro mais comum e como um top performer faria." },
  { icon: "🚀", label: "Como um Top Performer faria?", prompt: "Como um Top Performer conduziria essa etapa? Me dê a versão boa, excelente e top performer." },
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function TrainerAI() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const runAI = useServerFn(runTrainerAI);

  // Load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
        if (parsed.mode === "simulate" || parsed.mode === "chat") setMode(parsed.mode);
      }
    } catch {}
  }, []);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, mode }));
    } catch {}
  }, [messages, mode]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, evaluation]);

  // Focus textarea on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, mode]);

  // Expose global opener + listen to event
  useEffect(() => {
    window.__btTrainerOpen = () => setOpen(true);
    const onOpen = () => setOpen(true);
    window.addEventListener("bt:trainer-open", onOpen);
    return () => {
      window.removeEventListener("bt:trainer-open", onOpen);
      delete window.__btTrainerOpen;
    };
  }, []);

  // Lock body scroll on mobile
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    if (window.matchMedia("(max-width: 767px)").matches) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const clearAll = useCallback(() => {
    setMessages([]);
    setEvaluation(null);
    setError(null);
    setMode("chat");
  }, []);

  const restartSimulation = useCallback(() => {
    setMessages([]);
    setEvaluation(null);
    setError(null);
    setMode("simulate");
    // Kick off with a system prompt inviting the AI to open the call
    void sendMessage("Comece agora como se estivesse atendendo minha ligação. Não avise nada, apenas fale como o cliente.", "simulate", true);
  }, []);

  async function sendMessage(text: string, forceMode?: Mode, silent = false) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const targetMode: Mode = forceMode ?? mode;

    // Special: user typed the end command → evaluate
    const endCmd = /^(fim da simula[cç][ãa]o|encerrar treino)\.?$/i.test(trimmed);
    if (endCmd && targetMode === "simulate") {
      setInput("");
      await evaluateSimulation();
      return;
    }

    const userMsg: Msg = silent
      ? { id: uid(), role: "user", content: "", ts: Date.now() }
      : { id: uid(), role: "user", content: trimmed, ts: Date.now() };

    const nextMessages = silent ? messages : [...messages, userMsg];
    if (!silent) setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const payload = {
        mode: targetMode,
        context: window.__btTrainerContext ?? undefined,
        messages: [
          ...nextMessages
            .filter((m) => m.content)
            .map((m) => ({ role: m.role, content: m.content })),
          ...(silent ? [{ role: "user" as const, content: trimmed }] : []),
        ],
      };
      const res: any = await runAI({ data: payload });
      const reply = res?.reply ?? "";
      if (!reply) throw new Error("Resposta vazia da IA.");
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", content: reply, ts: Date.now() },
      ]);
      if (forceMode) setMode(forceMode);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao chamar a IA.");
    } finally {
      setLoading(false);
    }
  }

  async function evaluateSimulation() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        mode: "evaluate" as const,
        context: window.__btTrainerContext ?? undefined,
        messages: messages
          .filter((m) => m.content)
          .map((m) => ({ role: m.role, content: m.content })),
      };
      const res: any = await runAI({ data: payload });
      if (res?.evaluation) {
        setEvaluation(res.evaluation);
      } else {
        setError("Não consegui gerar a avaliação. Tente novamente.");
      }
      setMode("chat");
    } catch (e: any) {
      setError(e?.message ?? "Erro ao avaliar a simulação.");
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(prompt: string) {
    if (prompt === "__SIMULATE__") {
      restartSimulation();
      return;
    }
    setInput(prompt);
    inputRef.current?.focus();
  }

  async function copyMsg(m: Msg) {
    const ok = await copyToClipboard(m.content);
    if (ok) {
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  }

  const isEmpty = messages.length === 0 && !evaluation;

  const panelClass = useMemo(() => {
    const base =
      "fixed z-[95] bg-white text-[var(--navy)] shadow-2xl flex flex-col overflow-hidden";
    if (expanded) {
      return `${base} inset-4 rounded-3xl border border-border`;
    }
    // Desktop: side panel bottom-right. Mobile: bottom sheet full-width.
    return `${base}
      inset-x-0 bottom-0 top-16 rounded-t-3xl border-t border-border
      md:inset-auto md:top-auto md:right-4 md:bottom-4 md:w-[440px] md:h-[85vh] md:max-h-[780px] md:rounded-3xl md:border`;
  }, [expanded]);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir Treinador IA"
          className="fixed z-[70] right-4 sm:right-6 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--navy)] text-white shadow-2xl shadow-[var(--brand)]/40 hover:brightness-110 transition-all"
          style={{
            bottom: "max(1rem, env(safe-area-inset-bottom))",
            padding: "0.85rem 1.15rem",
          }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-bold">
            <span className="text-lg leading-none" aria-hidden>🐂</span>
            <span className="hidden sm:inline">Treinador IA</span>
          </span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-white animate-pulse" />
        </button>
      )}

      {open && (
        <>
          {/* Backdrop (mobile) */}
          <div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-label="Treinador IA" className={panelClass}>
            {/* Header */}
            <header className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-border bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] text-white">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--success)] text-[var(--navy)] text-lg" aria-hidden>
                🐂
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--success)]">
                  Bull Team · Treinador IA
                </p>
                <p className="text-sm font-bold truncate">
                  {mode === "simulate" ? "🎧 Simulação de cliente em curso" : "Treinador comercial 24h"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="hidden md:inline-flex rounded-lg border border-white/15 bg-white/5 p-1.5 hover:bg-white/10"
                aria-label={expanded ? "Reduzir" : "Expandir"}
                title={expanded ? "Reduzir" : "Expandir"}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/15 bg-white/5 p-1.5 hover:bg-white/10"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Toolbar */}
            <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border bg-[var(--surface)]">
              <button
                type="button"
                onClick={restartSimulation}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[11px] font-bold text-[var(--navy)] hover:bg-[var(--surface)]"
                title="Iniciar / reiniciar simulação"
              >
                <PhoneCall className="h-3.5 w-3.5" /> Simular Cliente
              </button>
              {mode === "simulate" && (
                <button
                  type="button"
                  onClick={evaluateSimulation}
                  disabled={loading || messages.length < 2}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--success)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--navy)] disabled:opacity-40 hover:brightness-110"
                  title="Encerrar treino e gerar avaliação"
                >
                  <Award className="h-3.5 w-3.5" /> Encerrar treino
                </button>
              )}
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-[var(--navy)]"
                  title="Limpar conversa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-white">
              {isEmpty ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-[var(--surface)] p-4">
                    <p className="text-sm text-[var(--navy)] leading-relaxed">
                      Sou o seu treinador Bull Team. Uso <b>SPIN Selling</b> e os roteiros deste sistema para te ajudar em qualquer ligação. Comece com uma das opções abaixo ou me pergunte direto.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSuggestion(s.prompt)}
                        className="text-left rounded-xl border border-border bg-white px-3 py-2.5 hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 transition"
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)]">
                          <span aria-hidden className="text-base">{s.icon}</span>
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <MessageBubble
                      key={m.id}
                      m={m}
                      onCopy={() => copyMsg(m)}
                      copied={copiedId === m.id}
                    />
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-bounce" style={{ animationDelay: "120ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-bounce" style={{ animationDelay: "240ms" }} />
                      </span>
                      {mode === "simulate" ? "Cliente digitando..." : "Treinador pensando..."}
                    </div>
                  )}
                  {evaluation && <EvaluationCard evaluation={evaluation} onRestart={restartSimulation} />}
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="shrink-0 px-4 py-2 text-xs font-semibold text-[var(--danger)] bg-[var(--danger)]/10 border-t border-[var(--danger)]/30">
                {error}
              </div>
            )}

            {/* Composer */}
            <form
              className="shrink-0 border-t border-border bg-white p-2 flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
              style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                rows={1}
                placeholder={
                  mode === "simulate"
                    ? "Conduza a ligação... (digite 'fim da simulação' para avaliar)"
                    : "Pergunte, cole uma mensagem ou peça uma simulação..."
                }
                className="flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] min-h-[44px] max-h-32"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-md disabled:opacity-40 hover:brightness-110"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

function MessageBubble({
  m, onCopy, copied,
}: { m: Msg; onCopy: () => void; copied: boolean }) {
  const isUser = m.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white ${
          isUser ? "bg-[var(--brand)]" : "bg-[var(--navy)]"
        }`}
        aria-hidden
      >
        {isUser ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={`group max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-[var(--brand)] text-white"
          : "bg-[var(--surface)] text-[var(--navy)] border border-border"
      }`}>
        {m.content}
        {!isUser && (
          <button
            type="button"
            onClick={onCopy}
            className="mt-2 inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-[var(--navy)]"
          >
            {copied ? <><Check className="h-3 w-3 text-[var(--success)]" /> Copiado</> : <><Copy className="h-3 w-3" /> Copiar</>}
          </button>
        )}
      </div>
    </div>
  );
}

function EvaluationCard({ evaluation, onRestart }: { evaluation: any; onRestart: () => void }) {
  const criterios: [string, any][] = evaluation?.criterios
    ? Object.entries(evaluation.criterios)
    : [];
  const nota = Number(evaluation?.nota_geral ?? 0);
  return (
    <div className="rounded-2xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-5 text-white space-y-4">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--success)] text-[var(--navy)] font-black text-lg">
          {isNaN(nota) ? "-" : nota}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--success)]">
            Avaliação Bull Team
          </p>
          <p className="text-sm text-white/85">{evaluation?.resumo ?? ""}</p>
        </div>
      </div>

      {criterios.length > 0 && (
        <div className="grid gap-2">
          {criterios.map(([k, v]: any) => (
            <details key={k} className="rounded-xl border border-white/10 bg-white/5">
              <summary className="cursor-pointer list-none px-3 py-2 flex items-center justify-between text-sm">
                <span className="font-bold capitalize">{k}</span>
                <span className="rounded-md bg-[var(--success)]/20 text-[var(--success)] px-2 py-0.5 text-xs font-bold">
                  {v?.nota ?? "-"}/10
                </span>
              </summary>
              <div className="px-3 pb-3 pt-1 text-xs space-y-1.5 text-white/85">
                {v?.acertos && <p><b className="text-[var(--success)]">Acertou:</b> {v.acertos}</p>}
                {v?.perdas && <p><b className="text-[var(--warn)]">Perdeu:</b> {v.perdas}</p>}
                {v?.melhoria && <p><b className="text-[var(--brand)]">Melhorar:</b> {v.melhoria}</p>}
              </div>
            </details>
          ))}
        </div>
      )}

      {Array.isArray(evaluation?.top3_melhorias) && evaluation.top3_melhorias.length > 0 && (
        <div className="rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
            As 3 maiores melhorias para sua próxima ligação
          </p>
          <ol className="mt-2 space-y-1 text-sm text-white list-decimal list-inside">
            {evaluation.top3_melhorias.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--success)] px-3 py-2 text-xs font-bold text-[var(--navy)] hover:brightness-110"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Nova simulação
      </button>
    </div>
  );
}