import { useState, useMemo, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Brain, ChevronDown, ChevronUp, Sparkles, Radar as RadarIcon,
  Shield, Target, TrendingUp, MessageCircle, Zap, XCircle, Trophy,
  Send, RotateCcw, Loader2, BookOpen, X,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { runObjecaoTrainer } from "@/lib/objecao-trainer.functions";
import { MEDOS, ESCADA, OBJECOES, RADAR, FRASES, ERROS, type Objecao } from "./data";
import { useIsMobile } from "@/hooks/use-mobile";

type ChatMsg = { role: "user" | "assistant"; content: string };
type Evaluation = {
  notas: Record<string, number>;
  nota_geral: number;
  pontos_fortes: string[];
  pontos_a_melhorar: string[];
  resposta_otimizada: string;
  exercicio_proximo_nivel: string;
};

export function CentralInteligencia() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <section id="central-inteligencia" className="mx-auto max-w-7xl px-3 sm:px-6 mt-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full group relative overflow-hidden rounded-3xl border-2 border-[var(--brand)]/40 bg-gradient-to-br from-[var(--navy)] via-[#0f1e42] to-[var(--navy)] text-white p-5 sm:p-7 text-left shadow-2xl shadow-[var(--brand)]/20 hover:border-[var(--brand)] transition"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--brand)]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 grid place-items-center h-12 w-12 rounded-2xl bg-[var(--brand)]/20 border border-[var(--brand)]/40">
            <Brain className="h-6 w-6 text-[var(--success)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--success)]">
              Central de Inteligência
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              🧠 Quando o Cliente Hesita
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl">
              Playbook completo de quebra de objeções em recomendações, medos, método,
              biblioteca de scripts, radar de pessoas, frases de bolso e simulador com IA.
            </p>
          </div>
          <div className="shrink-0 mt-1">
            {open ? (
              <ChevronUp className="h-6 w-6 text-white/70 group-hover:text-white" />
            ) : (
              <ChevronDown className="h-6 w-6 text-white/70 group-hover:text-white" />
            )}
          </div>
        </div>
      </button>

      {open && (
        <div className="mt-6 space-y-10 sm:space-y-14 pb-4">
          <Bloco1 />
          <Bloco2 />
          <Bloco3 />
          <Bloco4 />
          <Bloco5 />
          <BlocoFinal />
          <Simulador />
        </div>
      )}
    </section>
    <FloatingBiblioteca />
    </>
  );
}

/* ============================================
   BLOCO 1, Entenda a objeção
   ============================================ */
function Bloco1() {
  return (
    <div>
      <BlocoHeader
        eyebrow="Bloco 1"
        icon={<Sparkles className="h-5 w-5" />}
        title="Antes de responder, entenda a objeção"
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">Card 1</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--navy)]">Toda objeção é um sintoma</h3>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/80">
            <p>A maioria dos vendedores responde exatamente o que o cliente disse.</p>
            <p>Os especialistas fazem diferente: entendem que a frase é apenas o sintoma. O verdadeiro trabalho é descobrir qual medo existe por trás.</p>
          </div>
          <div className="mt-4 rounded-xl bg-[var(--surface)] border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exemplo</p>
            <p className="mt-2 text-sm"><strong>Cliente:</strong> “Quero pensar.”</p>
            <p className="mt-2 text-sm text-danger">Vendedor comum: responde imediatamente.</p>
            <p className="mt-1 text-sm text-[var(--brand)]"><strong>Especialista:</strong> “Ele ainda não se sente seguro.”, e passa a reduzir o risco percebido.</p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-[var(--success)]/10 to-white p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">Mensagem-chave</p>
          <p className="mt-2 text-xl sm:text-2xl font-bold text-[var(--navy)] leading-snug">
            Você não vence objeções. Você <span className="text-[var(--success)]">reduz medos</span> até
            que o cliente se sinta confortável para agir.
          </p>
          <p className="mt-4 text-sm text-foreground/70">
            Toda objeção normalmente nasce de poucos medos. Identifique qual é, o resto se torna simples.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Os 5 medos por trás das objeções
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEDOS.map((m) => (
            <div key={m.titulo} className="rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition">
              <div className="text-3xl">{m.icon}</div>
              <p className="mt-2 font-bold text-[var(--navy)]">{m.titulo}</p>
              <p className="mt-2 text-sm italic text-foreground/70">{m.frase}</p>
              <div className="mt-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">Como reduzir</p>
                <p className="mt-1 text-sm text-foreground/80">{m.comoReduzir}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   BLOCO 2, Método Elite
   ============================================ */
function Bloco2() {
  return (
    <div>
      <BlocoHeader
        eyebrow="Bloco 2"
        icon={<Target className="h-5 w-5" />}
        title="Método Elite de Contorno"
        subtitle="A escada visual para conduzir qualquer objeção com naturalidade."
      />
      <ol className="mt-6 space-y-4">
        {ESCADA.map((e, i) => (
          <li key={e.n} className="relative rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 grid place-items-center h-11 w-11 rounded-xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, var(--brand), var(--success))`,
                  opacity: 1 - i * 0.08,
                }}
              >
                {e.n}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-[var(--navy)]">{e.titulo}</h4>
                <p className="mt-1 text-sm text-foreground/70">{e.objetivo}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.exemplos.map((ex, j) => (
                    <span key={j} className="rounded-lg bg-[var(--surface)] border border-border px-3 py-1.5 text-xs text-foreground/80">
                      {ex}
                    </span>
                  ))}
                </div>
                {e.regra && (
                  <p className="mt-3 text-xs italic text-[var(--brand)] font-medium">→ {e.regra}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ============================================
   BLOCO 3, Biblioteca de Objeções
   ============================================ */
function Bloco3() {
  return (
    <div>
      <BlocoHeader
        eyebrow="Bloco 3"
        icon={<MessageCircle className="h-5 w-5" />}
        title="Biblioteca Inteligente de Objeções"
        subtitle="Clique em uma objeção para abrir o playbook completo."
      />
      <BibliotecaObjecoesLista />
    </div>
  );
}

function BibliotecaObjecoesLista() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return OBJECOES;
    return OBJECOES.filter((o) =>
      (o.frase + " " + o.significado + " " + o.resposta).toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <>
      <div className="mt-4 sticky top-0 z-10 bg-background/95 backdrop-blur pb-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar objeção… ex: pensar, LGPD, número"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--brand)]"
        />
      </div>
      <div className="mt-2 space-y-3">
        {filtered.map((o) => (
          <ObjecaoCard
            key={o.id}
            o={o}
            open={openId === o.id}
            onToggle={() => setOpenId(openId === o.id ? null : o.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma objeção encontrada para “{q}”.
          </p>
        )}
      </div>
    </>
  );
}

/* ============================================
   FLOATING, Biblioteca sempre acessível
   ============================================ */
function FloatingBiblioteca() {
  const [openSheet, setOpenSheet] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenSheet(true)}
        aria-label="Abrir biblioteca de objeções"
        aria-haspopup="dialog"
        aria-expanded={openSheet}
        aria-controls="biblioteca-objecoes-sheet"
        className="fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6 group flex items-center gap-2 rounded-full pl-3 pr-4 sm:pl-4 sm:pr-5 py-3 text-white font-semibold text-sm shadow-2xl shadow-[var(--brand)]/40 border border-white/10 bg-gradient-to-br from-[var(--brand)] via-[#2a5cff] to-[var(--success)] hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in min-h-11 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand)]/50"
      >
        <span className="grid place-items-center h-7 w-7 rounded-full bg-white/20 backdrop-blur">
          <BookOpen className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline">Biblioteca de Objeções</span>
        <span className="sm:hidden">Objeções</span>
      </button>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent
          id="biblioteca-objecoes-sheet"
          aria-labelledby="biblioteca-objecoes-title"
          aria-describedby="biblioteca-objecoes-desc"
          side={isMobile ? "bottom" : "right"}
          className={
            isMobile
              ? "h-[92vh] w-full rounded-t-3xl overflow-y-auto bg-gradient-to-b from-[var(--surface)] to-background p-0 border-t border-border"
              : "w-full sm:max-w-2xl overflow-y-auto bg-gradient-to-b from-[var(--surface)] to-background p-0"
          }
        >
          {isMobile && (
            <div className="sticky top-0 z-30 flex justify-center pt-2 pb-1 bg-gradient-to-br from-[var(--navy)] to-[#0f1e42]">
              <span className="h-1.5 w-12 rounded-full bg-white/30" />
            </div>
          )}
          <div className="sticky top-0 z-20 bg-gradient-to-br from-[var(--navy)] to-[#0f1e42] text-white px-6 py-5 border-b border-white/10">
            <SheetHeader className="text-left space-y-1 p-0">
              <div className="flex items-center gap-2">
                <div className="grid place-items-center h-9 w-9 rounded-xl bg-[var(--brand)]/30 border border-[var(--brand)]/40">
                  <BookOpen className="h-4 w-4 text-[var(--success)]" />
                </div>
                <SheetTitle id="biblioteca-objecoes-title" className="text-white text-lg font-extrabold">
                  Biblioteca de Objeções
                </SheetTitle>
              </div>
              <SheetDescription id="biblioteca-objecoes-desc" className="text-white/70 text-xs">
                Consulte respostas prontas de qualquer parte da página.
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="px-3 sm:px-6 pb-10">
            <BibliotecaObjecoesLista />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function ObjecaoCard({ o, open, onToggle }: { o: Objecao; open: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border ${open ? "border-[var(--brand)]" : "border-border"} bg-white shadow-sm overflow-hidden`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 text-left px-5 py-4 hover:bg-[var(--surface)] transition"
      >
        <span className="text-lg">❓</span>
        <span className="flex-1 font-semibold text-[var(--navy)]">{o.frase}</span>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border p-5 grid gap-4 sm:grid-cols-2">
          <MiniBox label="🧠 O que realmente significa" text={o.significado} tone="brand" />
          <MiniBox label="🎯 Objetivo do vendedor" text={o.objetivo} tone="success" />
          <div className="sm:col-span-2 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">💬 Resposta principal</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--navy)]">{o.resposta}</p>
          </div>
          <MiniBox label="⬆ Escalada" text={o.escalada} />
          <MiniBox label="🚀 Última cartada" text={o.ultimaCartada} />
          <div className="sm:col-span-2 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/30 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">⚡ Frase de bolso</p>
            <p className="mt-1 text-base font-bold text-[var(--navy)]">{o.fraseBolso}</p>
          </div>
          <div className="sm:col-span-2 rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">❌ Erro comum</p>
            <p className="mt-1 text-sm text-foreground/80">{o.erroComum}</p>
          </div>
          {o.id === "nao-lembro" && <RadarPessoas />}
        </div>
      )}
    </div>
  );
}

function MiniBox({ label, text, tone }: { label: string; text: string; tone?: "brand" | "success" }) {
  const cls =
    tone === "brand"
      ? "bg-[var(--brand)]/5 border-[var(--brand)]/20"
      : tone === "success"
        ? "bg-[var(--success)]/5 border-[var(--success)]/20"
        : "bg-[var(--surface)] border-border";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground/85">{text}</p>
    </div>
  );
}

/* Radar de pessoas, dentro da objeção "não lembro" */
function RadarPessoas() {
  const cats = Object.keys(RADAR);
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="sm:col-span-2 rounded-2xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-white to-[var(--success)]/5 p-5">
      <div className="flex items-center gap-2">
        <RadarIcon className="h-5 w-5 text-[var(--success)]" />
        <p className="text-sm font-bold text-[var(--navy)]">🔎 Radar de Pessoas</p>
      </div>
      <p className="mt-1 text-xs text-foreground/70">Clique numa categoria para acionar gatilhos de memória.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSel(sel === c ? null : c)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              sel === c
                ? "bg-[var(--success)] text-[var(--navy)] border-[var(--success)]"
                : "bg-white border-border text-foreground/80 hover:border-[var(--success)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {sel && (
        <div className="mt-4 rounded-xl bg-white border border-border p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
            Perguntas para ativar memória, {sel}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/85 list-disc pl-5">
            {RADAR[sel].map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ============================================
   BLOCO 4, Frases de bolso
   ============================================ */
function Bloco4() {
  return (
    <div>
      <BlocoHeader
        eyebrow="Bloco 4"
        icon={<Zap className="h-5 w-5" />}
        title="Biblioteca de Frases de Bolso"
        subtitle="Use na hora certa. Curtas, potentes, decoráveis."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FRASES.map((f) => (
          <div key={f.titulo} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">{f.titulo}</p>
            <ul className="mt-3 space-y-2">
              {f.itens.map((i, k) => (
                <li key={k} className="text-sm text-foreground/85 flex gap-2">
                  <span className="text-[var(--success)] font-bold">›</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   BLOCO 5, Erros
   ============================================ */
function Bloco5() {
  return (
    <div>
      <BlocoHeader
        eyebrow="Bloco 5"
        icon={<XCircle className="h-5 w-5" />}
        title="Erros que fazem perder recomendações"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ERROS.map((e) => (
          <div key={e.titulo} className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-5">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-4 w-4" />
              <p className="font-bold">{e.titulo}</p>
            </div>
            <p className="mt-2 text-sm text-foreground/80">{e.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   BLOCO FINAL, Mentalidade
   ============================================ */
function BlocoFinal() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-[var(--navy)] via-[#0f1e42] to-[var(--navy)] text-white p-6 sm:p-10 shadow-2xl">
      <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[var(--success)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-[var(--brand)]/25 blur-3xl" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--success)]">
          <Trophy className="h-3.5 w-3.5" /> Mentalidade de Elite
        </div>
        <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
          Vendedores comuns respondem objeções. Especialistas identificam medos.
        </h3>
        <p className="mt-4 max-w-3xl text-white/80 leading-relaxed">
          Depois reduzem a percepção de risco. Só então conduzem naturalmente para a ação.
          Quanto menos pressão o cliente sentir e mais segurança perceber, maior será a
          probabilidade de indicar pessoas importantes para ele.
        </p>
        <p className="mt-4 max-w-3xl text-white/70 leading-relaxed italic">
          A melhor quebra de objeção é aquela em que o cliente sente que a decisão continua
          totalmente nas mãos dele, apenas com informações suficientes para agir com confiança.
        </p>
      </div>
    </div>
  );
}

/* ============================================
   SIMULADOR IA
   ============================================ */
function Simulador() {
  const [openSim, setOpenSim] = useState(false);
  const [objId, setObjId] = useState<string>(OBJECOES[0].id);
  const [dif, setDif] = useState<"basica" | "media" | "dura">("media");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<Evaluation | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const runTrainer = useServerFn(runObjecaoTrainer);
  const obj = OBJECOES.find((o) => o.id === objId)!;

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const start = () => {
    setMessages([{ role: "assistant", content: obj.frase }]);
    setEvalResult(null);
    setError(null);
  };

  const reset = () => {
    setMessages([]);
    setEvalResult(null);
    setError(null);
    setInput("");
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await runTrainer({
        data: {
          mode: "chat",
          objecao: obj.frase,
          dificuldade: dif,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        },
      });
      setMessages((cur) => [...cur, { role: "assistant", content: res.reply ?? "…" }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao chamar IA.");
    } finally {
      setLoading(false);
    }
  };

  const evaluate = async () => {
    if (evalLoading || messages.length < 2) return;
    setEvalLoading(true);
    setError(null);
    try {
      const res = await runTrainer({
        data: {
          mode: "evaluate",
          objecao: obj.frase,
          dificuldade: dif,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        },
      });
      if (res.evaluation) setEvalResult(res.evaluation as Evaluation);
      else setError("A IA não retornou uma avaliação válida. Tente novamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao avaliar.");
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-3xl border-2 border-[var(--brand)]/40 bg-gradient-to-br from-[var(--brand)]/10 via-white to-[var(--success)]/10 p-6 sm:p-8 shadow-xl">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="shrink-0 grid place-items-center h-12 w-12 rounded-2xl bg-[var(--brand)] text-white">
            🎭
          </div>
          <div className="flex-1 min-w-[240px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand)]">
              Diferencial Premium
            </p>
            <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-[var(--navy)]">
              Treinar Quebra de Objeções com IA
            </h3>
            <p className="mt-2 text-sm text-foreground/70 max-w-xl">
              Escolha uma objeção. A IA assume o papel do cliente. Você responde como se estivesse
              em reunião real. Ao final, receba nota, pontos fortes, o que melhorar e uma resposta otimizada.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpenSim((v) => !v)}
            className="rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand)]/30 hover:brightness-110 transition"
          >
            {openSim ? "Fechar simulador" : "🎭 Abrir simulador"}
          </button>
        </div>

        {openSim && (
          <div className="mt-6 rounded-2xl border border-border bg-white overflow-hidden">
            {/* Setup */}
            <div className="border-b border-border bg-[var(--surface)] p-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Objeção</span>
                <select
                  value={objId}
                  onChange={(e) => { setObjId(e.target.value); reset(); }}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-[var(--navy)]"
                >
                  {OBJECOES.map((o) => <option key={o.id} value={o.id}>{o.frase}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Dificuldade</span>
                <select
                  value={dif}
                  onChange={(e) => setDif(e.target.value as "basica" | "media" | "dura")}
                  className="mt-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-[var(--navy)]"
                >
                  <option value="basica">Básica</option>
                  <option value="media">Média</option>
                  <option value="dura">Dura</option>
                </select>
              </label>
              <div className="flex items-end gap-2">
                {messages.length === 0 ? (
                  <button type="button" onClick={start}
                    className="rounded-lg bg-[var(--success)] px-4 py-2 text-sm font-bold text-[var(--navy)] hover:brightness-105 transition">
                    Iniciar
                  </button>
                ) : (
                  <button type="button" onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)]">
                    <RotateCcw className="h-4 w-4" /> Reiniciar
                  </button>
                )}
              </div>
            </div>

            {/* Chat */}
            <div ref={scrollerRef} className="max-h-[420px] overflow-y-auto p-4 space-y-3 bg-white">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  Escolha a objeção e clique em <strong>Iniciar</strong> para começar.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--brand)] text-white rounded-br-sm"
                      : "bg-[var(--surface)] border border-border text-foreground rounded-bl-sm"
                  }`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                      {m.role === "user" ? "Você (vendedor)" : "Cliente"}
                    </p>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cliente digitando…
                </div>
              )}
            </div>

            {/* Composer */}
            {messages.length > 0 && !evalResult && (
              <div className="border-t border-border p-3 flex gap-2 bg-white">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Responda como faria em uma reunião real…"
                  disabled={loading}
                  className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
                />
                <button type="button" onClick={send} disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50 hover:brightness-110">
                  <Send className="h-4 w-4" /> Enviar
                </button>
                <button type="button" onClick={evaluate} disabled={evalLoading || messages.length < 2}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--success)] px-4 py-2 text-sm font-bold text-[var(--navy)] disabled:opacity-50 hover:brightness-105">
                  {evalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                  Avaliar
                </button>
              </div>
            )}

            {error && (
              <div className="border-t border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {evalResult && <EvaluationView e={evalResult} onRetry={reset} />}
          </div>
        )}
      </div>
    </div>
  );
}

function EvaluationView({ e, onRetry }: { e: Evaluation; onRetry: () => void }) {
  const criterios = [
    ["empatia", "Empatia"],
    ["clareza", "Clareza"],
    ["reducao_de_risco", "Redução de risco"],
    ["naturalidade", "Naturalidade"],
    ["conducao_proximo_passo", "Condução p/ próximo passo"],
  ] as const;
  return (
    <div className="border-t border-border p-5 bg-gradient-to-br from-white to-[var(--surface)]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h4 className="text-lg font-bold text-[var(--navy)]">📊 Avaliação da simulação</h4>
        <div className="rounded-xl bg-[var(--navy)] text-white px-4 py-2 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/60">Nota geral</p>
          <p className="text-2xl font-extrabold text-[var(--success)]">{e.nota_geral}/10</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {criterios.map(([k, label]) => {
          const v = e.notas?.[k] ?? 0;
          return (
            <div key={k} className="rounded-xl border border-border bg-white p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-extrabold text-[var(--brand)]">{v}</p>
              <div className="mt-1 h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                <div className="h-full bg-[var(--brand)]" style={{ width: `${(v / 10) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">✅ Pontos fortes</p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5 text-foreground/85">
            {e.pontos_fortes?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">🎯 Pontos a melhorar</p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5 text-foreground/85">
            {e.pontos_a_melhorar?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border-2 border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">💎 Resposta otimizada</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--navy)]">{e.resposta_otimizada}</p>
      </div>

      <div className="mt-4 rounded-xl bg-[var(--navy)] text-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">🚀 Próximo nível</p>
        <p className="mt-2 text-sm text-white/90">{e.exercicio_proximo_nivel}</p>
      </div>

      <div className="mt-4">
        <button type="button" onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white hover:brightness-110">
          <RotateCcw className="h-4 w-4" /> Treinar novamente
        </button>
      </div>
    </div>
  );
}

/* ============================================
   Helpers
   ============================================ */
function BlocoHeader({
  eyebrow, icon, title, subtitle,
}: { eyebrow: string; icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 grid place-items-center h-10 w-10 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)]">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand)]">{eyebrow}</p>
        <h3 className="mt-0.5 text-xl sm:text-2xl font-extrabold text-[var(--navy)] tracking-tight">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-foreground/70">{subtitle}</p>}
      </div>
    </div>
  );
}

// silence unused import warnings without pruning icons chosen for future variants
void Shield; void TrendingUp;