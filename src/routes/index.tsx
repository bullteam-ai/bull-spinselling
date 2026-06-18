import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Target, UserRound, Home, Car, Plane, Rocket, BarChart3, HelpCircle, Handshake,
  Flame, AlertTriangle, ClipboardCopy, Check, ChevronDown, TrafficCone, ArrowRight,
  Trophy, Mic, ShieldCheck, XCircle, CheckCircle2, Thermometer, ListOrdered,
  Search, Star, Pin, Headphones, Filter, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bull Team | Agendamento de Entrevista" },
      { name: "description", content: "Guia visual SPIN Selling para consultores Bull Team conduzirem ligações e agendarem mais Entrevistas Estratégicas Financeiras." },
      { property: "og:title", content: "Bull Team | Agendamento de Entrevista" },
      { property: "og:description", content: "Faça as perguntas certas. Gere consciência. Crie urgência. Agende mais entrevistas." },
    ],
  }),
  component: Index,
});

const FLOW = [
  "Descobrir Objetivo",
  "Explorar Problema",
  "Ampliar Impacto",
  "Gerar Necessidade",
  "Agendar Entrevista",
];

const KILLER_QUESTIONS = [
  "O que acontece se isso não mudar nos próximos 5 anos?",
  "O quanto esse objetivo é importante para você hoje de 0 a 10?",
  "O que está impedindo você de chegar lá mais rápido?",
  "Você acredita que está no melhor caminho possível ou apenas no caminho que conhece?",
  "Se existisse uma forma de acelerar esse resultado, faria sentido entender como?",
];

const BUYING_SIGNALS = [
  "Nunca parei para pensar nisso.",
  "Não sei responder.",
  "Nunca calculei isso.",
  "Faz sentido.",
  "Gostaria de entender.",
  "Como funciona?",
  "É verdade.",
  "Não tinha olhado por esse lado.",
];

const TOP_QUESTIONS = [
  "O que acontece se isso não mudar nos próximos 5 anos?",
  "O que está custando para você não resolver isso hoje?",
  "Como isso impacta sua família?",
  "Se continuar exatamente como está, qual será o cenário daqui a 10 anos?",
  "Você acredita que está no melhor caminho possível ou apenas no caminho que conhece?",
];

const THERMOMETER = [
  { level: 1, color: "var(--danger)", emoji: "🔴", label: "Cliente não percebe o problema" },
  { level: 2, color: "#FF8A3D",        emoji: "🟠", label: "Cliente percebe o problema" },
  { level: 3, color: "var(--warn)",   emoji: "🟡", label: "Cliente percebe o impacto" },
  { level: 4, color: "var(--success)", emoji: "🟢", label: "Cliente quer resolver", highlight: true },
];

const TRANSITIONS = [
  { from: "Situação", to: "Problema",     text: "Entendi. Agora me ajuda a entender uma coisa…" },
  { from: "Problema", to: "Implicação",   text: "E se isso continuar exatamente como está…" },
  { from: "Implicação", to: "Necessidade", text: "Faz sentido então entender qual seria o caminho mais eficiente para resolver isso?" },
  { from: "Necessidade", to: "Agendamento", text: "Pelo que você compartilhou, acredito que valha a pena aprofundarmos isso em uma entrevista estratégica." },
];

const OBJECTIONS = [
  { objection: "Preciso pensar", answer: "Perfeito. E normalmente quando alguém me diz isso, é porque ainda não conseguiu visualizar completamente o impacto ou o caminho para resolver. O que especificamente você gostaria de analisar melhor?" },
  { objection: "Não tenho tempo", answer: "Justamente por isso faz sentido conversarmos. A entrevista existe para economizar tempo e evitar decisões no escuro." },
  { objection: "Já tenho assessor", answer: "Excelente. Inclusive é por isso que faz sentido validar se tudo continua alinhado com seus objetivos atuais." },
];

const KILLER_MISTAKES = [
  "Explicar produto cedo demais",
  "Falar de investimentos antes da dor",
  "Fazer cálculo antes da implicação",
  "Discutir rentabilidade",
  "Tentar vender durante a ligação",
];

const RIGHT_MOVES = ["Descobrir", "Explorar", "Amplificar", "Conscientizar", "Agendar"];

const IDEAL_FLOW = [
  "Descobrir Objetivo",
  "Fazer Perguntas de Situação",
  "Encontrar Problemas",
  "Amplificar Impactos",
  "Gerar Necessidade",
  "Ouvir Sinais de Compra",
  "Agendar Entrevista",
  "Não Vender Nada",
];

const SPIN_OBJECTIVES: Record<"situacao" | "problema" | "implicacao" | "necessidade", string> = {
  situacao: "Entender a realidade atual do cliente.",
  problema: "Identificar lacunas, dificuldades e ausência de planejamento.",
  implicacao: "Ampliar o impacto financeiro, emocional e familiar do problema. Esta é a etapa mais importante da metodologia.",
  necessidade: "Levar o cliente a perceber valor em buscar ajuda especializada.",
};

const SCRIPT = `Perfeito. Pelo que você compartilhou comigo, existem alguns pontos que vale a pena analisar com mais profundidade para entender exatamente onde você está hoje e qual o caminho mais eficiente para atingir esse objetivo.

O ideal é fazermos uma Entrevista Estratégica Financeira, onde conseguimos colocar tudo isso em números e construir um plano claro.

Tenho disponibilidade na terça às 19h ou quarta às 18h. Qual funciona melhor para você?`;

type Block = { situacao: string[]; problema: string[]; implicacao: string[]; necessidade: string[] };
type Goal = { id: string; icon: typeof Target; emoji: string; title: string; blocks: Block };

type Quadrant = "situacao" | "problema" | "implicacao" | "necessidade";

const QUADRANTS: { key: Quadrant; emoji: string; label: string; color: string; chip: string }[] = [
  { key: "situacao",    emoji: "🔵", label: "Situação",    color: "var(--brand)",   chip: "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/30" },
  { key: "problema",    emoji: "🟡", label: "Problema",    color: "var(--warn)",    chip: "bg-[var(--warn)]/10 text-[#8a5a00] border-[var(--warn)]/40" },
  { key: "implicacao",  emoji: "🟠", label: "Implicação",  color: "var(--danger)",  chip: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30" },
  { key: "necessidade", emoji: "🟢", label: "Necessidade", color: "var(--success)", chip: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30" },
];

const EXPLORATION: Record<Quadrant, { sim: string; nao: string; transicao: string; procurar: string }> = {
  situacao: {
    sim: "Aprofunde com números, prazos e valores específicos. Anote tudo.",
    nao: "Use a lacuna como gancho — siga direto para perguntas de Problema.",
    transicao: "Entendi. Agora me ajuda a entender uma coisa…",
    procurar: "Clareza (ou ausência dela) sobre o cenário atual.",
  },
  problema: {
    sim: "Existe dor. Avance para Implicação ampliando o impacto financeiro e emocional.",
    nao: "Reformule a pergunta. O cliente provavelmente ainda não percebeu a lacuna.",
    transicao: "E se isso continuar exatamente como está…",
    procurar: "Hesitação, 'nunca calculei', 'não sei responder' — sinais de inconsciência.",
  },
  implicacao: {
    sim: "Silêncio é ouro. Não preencha. Deixe a consciência se instalar.",
    nao: "Amplifique: traga família, tempo perdido, oportunidade que não volta.",
    transicao: "Faz sentido então entender qual seria o caminho mais eficiente para resolver isso?",
    procurar: "Mudança de tom, suspiro, 'nunca pensei nisso', 'é verdade'.",
  },
  necessidade: {
    sim: "🎯 Convide imediatamente para a Entrevista Estratégica Financeira.",
    nao: "Volte para Implicação. A dor ainda não está totalmente clara.",
    transicao: "Pelo que você compartilhou, vale a pena aprofundarmos em uma entrevista estratégica.",
    procurar: "'Faz sentido', 'gostaria de entender', 'como funciona?'",
  },
};

// Marcações de alta conversão por trecho (case-insensitive).
const HIGH_CONVERSION_MARKERS = [
  "5 anos", "10 anos", "família", "custando", "melhor caminho", "deixaria de viver",
  "trabalhar por obrigação", "trabalhar além", "padrão de vida", "juros compostos",
  "ficaram apenas na vontade", "outras pessoas executando",
];

const isHighConversion = (q: string) =>
  HIGH_CONVERSION_MARKERS.some((m) => q.toLowerCase().includes(m.toLowerCase()));

const GOALS: Goal[] = [
  {
    id: "independencia", emoji: "🎯", icon: Target, title: "Independência Financeira",
    blocks: {
      situacao: ["O que significa independência financeira para você?", "Em qual idade pretende alcançá-la?", "Quanto de renda mensal seria suficiente?", "O que mudaria na sua vida?", "O que vem fazendo hoje?"],
      problema: ["Já calculou quanto patrimônio precisa?", "Sabe quanto investir por mês?", "Tem um plano estruturado?", "Possui acompanhamento?", "Está confiante ou apenas espera chegar lá?"],
      implicacao: ["E se esse objetivo estiver 10 anos mais distante?", "O que deixaria de viver?", "Como seria trabalhar por obrigação?", "Qual impacto na família?", "O que custa perder mais 5 anos?"],
      necessidade: ["Faz sentido validar o caminho atual?", "Gostaria de saber exatamente onde está?", "Quer entender como acelerar esse processo?", "Seria útil uma projeção clara?"],
    },
  },
  {
    id: "aposentadoria", emoji: "👴", icon: UserRound, title: "Aposentadoria",
    blocks: {
      situacao: ["Com quantos anos pretende parar?", "Qual padrão de vida deseja?", "Quanto precisará por mês?", "Já possui estratégia?"],
      problema: ["Já fez projeções?", "Depende apenas do INSS?", "Tem clareza do patrimônio necessário?", "Sabe se está no caminho correto?"],
      implicacao: ["E se precisar trabalhar além do planejado?", "Como seria reduzir seu padrão de vida?", "Qual impacto para sua família?", "Quanto custa perder anos de juros compostos?"],
      necessidade: ["Faz sentido validar sua estratégia?", "Gostaria de visualizar cenários futuros?", "Quer saber quanto precisa acumular?"],
    },
  },
  {
    id: "casa", emoji: "🏠", icon: Home, title: "Compra de Casa",
    blocks: {
      situacao: ["Pretende comprar imóvel?", "Em quanto tempo?", "Qual valor?", "Quanto já possui guardado?"],
      problema: ["Sabe quanto precisa acumular?", "Tem plano definido?", "Está conseguindo poupar?"],
      implicacao: ["E se atrasar 5 anos?", "Quanto continuará pagando de aluguel?", "O que isso muda para sua família?", "Existe algum sonho ligado a essa conquista?"],
      necessidade: ["Faz sentido descobrir o caminho mais eficiente?", "Gostaria de saber o valor necessário?", "Quer validar o prazo?"],
    },
  },
  {
    id: "carro", emoji: "🚗", icon: Car, title: "Compra de Carro",
    blocks: {
      situacao: ["Qual carro pretende comprar?", "Em quanto tempo?", "Já definiu valor?"],
      problema: ["Sabe quanto precisa guardar?", "Tem planejamento?", "Seu dinheiro trabalha para esse objetivo?"],
      implicacao: ["Quanto isso pode atrasar?", "O que esse atraso gera no dia a dia?", "Como isso afeta sua rotina?"],
      necessidade: ["Faz sentido criar um plano?", "Gostaria de saber o valor necessário por mês?"],
    },
  },
  {
    id: "viagens", emoji: "✈️", icon: Plane, title: "Viagens",
    blocks: {
      situacao: ["Qual viagem gostaria de fazer?", "Quando?", "Quem irá junto?"],
      problema: ["Possui reserva específica?", "Sabe quanto custará?", "Tem estratégia para isso?"],
      implicacao: ["Quantas viagens ficaram apenas na vontade?", "O que sua família deixa de viver?", "Como seria olhar para trás e perceber que adiou experiências?"],
      necessidade: ["Faz sentido transformar isso em meta concreta?", "Gostaria de estruturar uma estratégia?"],
    },
  },
  {
    id: "empreendedorismo", emoji: "🚀", icon: Rocket, title: "Empreendedorismo",
    blocks: {
      situacao: ["Existe algum negócio que deseja abrir?", "Em quanto tempo?", "Quanto acredita precisar?"],
      problema: ["Já calculou o capital?", "Possui reserva?", "Tem planejamento financeiro?"],
      implicacao: ["Quanto tempo esse projeto está parado?", "O que deixa de ganhar?", "Como se sentiria vendo outras pessoas executando essa ideia?"],
      necessidade: ["Faz sentido construir um plano para isso?", "Gostaria de saber quanto patrimônio precisa acumular?"],
    },
  },
  {
    id: "organizacao", emoji: "📊", icon: BarChart3, title: "Organização Financeira",
    blocks: {
      situacao: ["Possui controle financeiro?", "Faz orçamento?", "Sabe para onde vai o dinheiro?"],
      problema: ["Sobra o que gostaria no final do mês?", "Consegue investir de forma consistente?", "Tem sensação de ganhar bem e não ver resultado?"],
      implicacao: ["Quanto dinheiro pode estar perdendo?", "Qual impacto em 10 anos?", "Isso gera estresse?"],
      necessidade: ["Faz sentido organizar isso?", "Gostaria de ter mais clareza?"],
    },
  },
  {
    id: "sem-objetivo", emoji: "❓", icon: HelpCircle, title: "Cliente Sem Objetivo",
    blocks: {
      situacao: ["Se dinheiro não fosse problema, o que faria?", "Existe algo que gostaria de proporcionar à família?", "Qual sonho ainda não realizou?"],
      problema: ["Seu dinheiro está trabalhando para algo?", "Você mede sua evolução financeira?"],
      implicacao: ["Quem não define um destino chega onde?", "Como saber se está evoluindo?", "E se passar mais 10 anos assim?"],
      necessidade: ["Faz sentido descobrir objetivos relevantes?", "Gostaria de ter mais clareza?"],
    },
  },
  {
    id: "assessor", emoji: "🤝", icon: Handshake, title: "Já Possui Assessor",
    blocks: {
      situacao: ["Há quanto tempo trabalha com ele?", "Com qual frequência se encontram?", "Ele conhece todos seus objetivos?"],
      problema: ["Possui planejamento formalizado?", "Tem projeções?", "Sabe a probabilidade de atingir suas metas?"],
      implicacao: ["Como descobriria se algo está errado?", "Quanto tempo poderia perder?", "Quando foi a última revisão profunda?"],
      necessidade: ["Faz sentido ter uma segunda visão?", "Gostaria de validar se tudo está alinhado?"],
    },
  },
];

function Index() {
  const [openGoal, setOpenGoal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [openObjection, setOpenObjection] = useState<number | null>(0);

  const toggleGoal = (id: string) => setOpenGoal((cur) => (cur === id ? null : id));

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-dvh bg-[var(--surface)] text-foreground">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-[var(--navy)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[var(--navy)] via-[var(--navy)] to-[#0b1c3a] text-white motion-reduce:bg-[var(--navy)]">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--brand)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[var(--success)]/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            Guia ao vivo · SPIN Selling
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight">
            <span className="mr-2">🐂</span>Bull Team
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-white/80 font-medium">
            Guia de Agendamento de Entrevista
          </p>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            "Faça as perguntas certas. Gere consciência. Crie urgência. Agende mais entrevistas."
          </p>
        </div>
      </header>

      {/* Sticky flow bar */}
      <nav aria-label="Etapas do funil" className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ol className="flex items-center gap-2 overflow-x-auto py-3 text-xs sm:text-sm">
            {FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-medium text-[var(--navy)] whitespace-nowrap">{step}</span>
                </div>
                {i < FLOW.length - 1 && <ArrowRight aria-hidden className="h-4 w-4 text-muted-foreground shrink-0" />}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <main id="conteudo" className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        <div className="space-y-8 sm:space-y-10">
          {/* Killer questions */}
          <section aria-labelledby="killer-title">
            <div className="rounded-3xl border border-[var(--danger)]/25 bg-gradient-to-br from-[#FFF5F2] to-white p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--danger)] text-white shadow-lg shadow-[var(--danger)]/30">
                  <Flame className="h-5 w-5" />
                </div>
                <h2 id="killer-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                  Perguntas Matadoras
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Sempre acessíveis · Use a qualquer momento da ligação</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {KILLER_QUESTIONS.map((q, i) => (
                  <li key={i} className="group flex gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-[var(--danger)]/40 hover:shadow-md">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--danger)]/10 text-xs font-bold text-[var(--danger)]">{i + 1}</span>
                    <p className="text-[15px] leading-snug text-[var(--navy)] font-medium">{q}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Top converting questions */}
          <section aria-labelledby="top-q-title">
            <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[var(--navy)] via-[#102a55] to-[var(--navy)] p-5 sm:p-8 text-white shadow-xl shadow-[var(--brand)]/15">
              <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[var(--brand)]/40 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div aria-hidden className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--warn)] text-[var(--navy)] shadow-lg shadow-[var(--warn)]/30">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 id="top-q-title" className="text-xl sm:text-2xl font-bold tracking-tight">
                      🏆 Perguntas que Mais Geram Agendamento
                    </h2>
                    <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-[var(--warn)]">As 5 que mais convertem · use sem medo</p>
                  </div>
                </div>
                <ol className="mt-6 grid gap-3">
                  {TOP_QUESTIONS.map((q, i) => (
                    <li key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--warn)] text-base font-extrabold text-[var(--navy)]">{i + 1}</span>
                      <p className="text-[15px] sm:text-base font-semibold leading-snug">{q}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Transition phrases */}
          <section aria-labelledby="trans-title">
            <div className="rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="trans-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                    🎤 Frases de Transição
                  </h2>
                  <p className="text-sm text-muted-foreground">Conduza o cliente etapa por etapa sem perder o ritmo</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {TRANSITIONS.map((t, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-[var(--surface)] p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                      <span>{t.from}</span>
                      <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                      <span>{t.to}</span>
                    </div>
                    <p className="mt-2 text-[15px] sm:text-base font-medium text-[var(--navy)] leading-snug">"{t.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Goals */}
          <section aria-labelledby="goals-title">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 id="goals-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                  Escolha o Objetivo do Cliente
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Clique no card para expandir o roteiro SPIN</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GOALS.map((g) => {
                const open = openGoal === g.id;
                const panelId = `goal-panel-${g.id}`;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className={`group relative flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-left transition-all motion-reduce:transition-none ${
                      open
                        ? "border-[var(--brand)] bg-[var(--brand)]/5 shadow-md shadow-[var(--brand)]/10"
                        : "border-border bg-white hover:border-[var(--brand)]/40 hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0"
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition ${
                      open ? "bg-[var(--brand)] text-white" : "bg-[var(--surface)] text-[var(--navy)]"
                    }`}>
                      <span aria-hidden>{g.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--navy)] truncate">{g.title}</p>
                      <p className="text-xs text-muted-foreground">{open ? "Roteiro aberto" : "Tocar para abrir"}</p>
                    </div>
                    <ChevronDown aria-hidden className={`h-4 w-4 shrink-0 text-muted-foreground transition motion-reduce:transition-none ${open ? "rotate-180 text-[var(--brand)]" : ""}`} />
                  </button>
                );
              })}
            </div>

            {/* Expanded content */}
            {openGoal && (
              <div className="mt-6" id={`goal-panel-${openGoal}`} role="region" aria-label="Roteiro do objetivo selecionado">
                {GOALS.filter((g) => g.id === openGoal).map((g) => (
                  <GoalBlocks key={g.id} goal={g} />
                ))}
              </div>
            )}
          </section>

          {/* Objections */}
          <section aria-labelledby="obj-title">
            <div className="rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success)]/15 text-[var(--success)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 id="obj-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                  🛡️ Contorno de Objeções
                </h2>
              </div>
              <div className="mt-5 space-y-3">
                {OBJECTIONS.map((o, i) => {
                  const open = openObjection === i;
                  const panelId = `obj-panel-${i}`;
                  return (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border bg-[var(--surface)]">
                      <button
                        type="button"
                        onClick={() => setOpenObjection(open ? null : i)}
                        aria-expanded={open}
                        aria-controls={panelId}
                        className="flex min-h-14 w-full items-center gap-3 p-4 text-left"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--danger)]/10 text-sm font-bold text-[var(--danger)]">{i + 1}</span>
                        <span className="flex-1 font-semibold text-[var(--navy)]">"{o.objection}"</span>
                        <ChevronDown aria-hidden className={`h-4 w-4 text-muted-foreground transition motion-reduce:transition-none ${open ? "rotate-180 text-[var(--brand)]" : ""}`} />
                      </button>
                      {open && (
                        <div id={panelId} className="border-t border-border bg-white p-4 sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--success)]">Resposta</p>
                          <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-[var(--navy)]">{o.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Mistakes vs right moves */}
          <section aria-labelledby="mistakes-title">
            <div className="rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--danger)]/15 text-[var(--danger)]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 id="mistakes-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                  ⚠️ Erros que Matam o Agendamento
                </h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--danger)]/25 bg-[#FFF5F2] p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--danger)]">Não faça</p>
                  <ul className="mt-3 space-y-2">
                    {KILLER_MISTAKES.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-[15px] text-[var(--navy)] leading-snug">
                        <XCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/8 p-5" style={{ backgroundColor: "color-mix(in oklab, var(--success) 8%, white)" }}>
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--success)]">Faça</p>
                  <ul className="mt-3 space-y-2">
                    {RIGHT_MOVES.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-[15px] font-semibold text-[var(--navy)] leading-snug">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Ideal flow + filosofia */}
          <section aria-labelledby="ideal-title">
            <div className="rounded-3xl border-2 border-[var(--brand)] bg-white p-5 sm:p-8 shadow-xl shadow-[var(--brand)]/10">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/30">
                  <ListOrdered className="h-5 w-5" />
                </div>
                <h2 id="ideal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                  🏆 Roteiro Ideal de Uma Ligação
                </h2>
              </div>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                {IDEAL_FLOW.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 rounded-2xl border border-border bg-[var(--surface)] p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-extrabold text-white">{i + 1}</span>
                    <span className="font-semibold text-[var(--navy)]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-[var(--navy)] to-[#0b1c3a] p-6 sm:p-8 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--success)]">Filosofia Bull Team</p>
                <p className="mt-3 text-lg sm:text-2xl font-bold leading-snug">
                  O objetivo da ligação não é vender.
                </p>
                <p className="mt-2 text-lg sm:text-2xl font-bold leading-snug text-white/90">
                  O objetivo da ligação é fazer o cliente <span className="text-[var(--success)]">desejar participar</span> da Entrevista Estratégica Financeira.
                </p>
              </div>
            </div>
          </section>

          {/* Final booking */}
          <section aria-labelledby="booking-title">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--navy)] to-[#0b1c3a] p-6 sm:p-10 text-white shadow-xl">
              <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[var(--success)]/30 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Etapa 5 · Fechar agendamento
                </div>
                <h2 id="booking-title" className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                  📅 Transição para Agendamento
                </h2>
                <p className="mt-2 text-white/70 max-w-2xl">
                  Leia o script abaixo com firmeza e ofereça os dois horários. Não dê espaço para o "vou pensar".
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 text-white/90 leading-relaxed whitespace-pre-line">
                  {SCRIPT}
                </div>

                <button
                  type="button"
                  onClick={copyScript}
                  aria-live="polite"
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--success)] px-5 py-3 text-sm font-semibold text-[var(--navy)] shadow-lg shadow-[var(--success)]/25 transition hover:brightness-105 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  {copied ? <Check aria-hidden className="h-4 w-4" /> : <ClipboardCopy aria-hidden className="h-4 w-4" />}
                  {copied ? "Script copiado!" : "📋 Copiar Script"}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Side panel: Buying signals */}
        <aside aria-label="Sinais de compra" className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Termômetro de Consciência */}
            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--danger)]/10 text-[var(--danger)]">
                  <Thermometer className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-[var(--navy)]">🌡️ Termômetro de Consciência</h3>
              </div>
              <ol className="mt-4 space-y-2">
                {THERMOMETER.map((t) => (
                  <li
                    key={t.level}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                      t.highlight
                        ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--navy)] font-bold shadow-sm shadow-[var(--success)]/20"
                        : "border-border bg-[var(--surface)] text-[var(--navy)]"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white" style={{ backgroundColor: t.color }}>
                      {t.level}
                    </span>
                    <span className="leading-snug">{t.label}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3 text-xs sm:text-sm font-medium text-[var(--navy)]">
                O objetivo da ligação é conduzir o cliente até os níveis <span className="font-bold">3 ou 4</span> antes de convidar para a entrevista.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--warn)]/15 text-[var(--warn)]">
                  <TrafficCone className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-[var(--navy)]">🚦 Sinais de Compra</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {BUYING_SIGNALS.map((s) => (
                  <li key={s} className="flex items-start gap-2 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm text-[var(--navy)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warn)]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3 text-sm font-medium text-[var(--navy)]">
                Quando ouvir <span className="font-bold">duas ou mais</span> dessas frases, avance para o agendamento.
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>🐂 Bull Team · Ferramenta interna de condução de entrevistas</span>
          <span>SPIN Selling</span>
        </div>
      </footer>
    </div>
  );
}

function GoalBlocks({ goal }: { goal: Goal }) {
  const sections = [
    { key: "situacao", title: "Situação", color: "var(--brand)", emoji: "🔵", items: goal.blocks.situacao, desc: "Entenda o contexto", objective: SPIN_OBJECTIVES.situacao },
    { key: "problema", title: "Problema", color: "var(--warn)", emoji: "🟡", items: goal.blocks.problema, desc: "Revele gargalos", objective: SPIN_OBJECTIVES.problema },
    { key: "necessidade", title: "Necessidade", color: "var(--success)", emoji: "🟢", items: goal.blocks.necessidade, desc: "Conduza à solução", objective: SPIN_OBJECTIVES.necessidade },
  ];

  return (
    <div className="rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-2xl" aria-hidden>{goal.emoji}</span>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--navy)]">{goal.title}</h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.slice(0, 2).map((s) => (
          <BlockCard key={s.key} title={s.title} emoji={s.emoji} color={s.color} items={s.items} desc={s.desc} objective={s.objective} />
        ))}
      </div>

      {/* Implicação — destaque máximo */}
      <div className="mt-4 rounded-2xl border-2 border-[var(--danger)] bg-gradient-to-br from-[#FFF1ED] via-white to-[#FFF6E8] p-5 sm:p-6 shadow-lg shadow-[var(--danger)]/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--danger)] text-white shadow-md">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--navy)]">🟠 Implicação</h4>
            <p className="text-xs sm:text-sm font-medium text-[var(--danger)] uppercase tracking-wide">Perguntas mais importantes · gere consciência e urgência</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-white/70 p-3 sm:p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--danger)]">Objetivo</p>
          <p className="mt-1 text-sm sm:text-[15px] font-medium text-[var(--navy)] leading-snug">{SPIN_OBJECTIVES.implicacao}</p>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {goal.blocks.implicacao.map((q, i) => (
            <li key={i} className="rounded-xl border border-[var(--danger)]/25 bg-white p-4 text-[15px] sm:text-base font-semibold text-[var(--navy)] leading-snug shadow-sm">
              {q}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        {(() => { const s = sections[2]; return <BlockCard title={s.title} emoji={s.emoji} color={s.color} items={s.items} desc={s.desc} objective={s.objective} />; })()}
      </div>
    </div>
  );
}

function BlockCard({ title, emoji, color, items, desc, objective }: { title: string; emoji: string; color: string; items: string[]; desc: string; objective?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-2">
        <span aria-hidden>{emoji}</span>
        <h4 className="font-bold text-[var(--navy)]">{title}</h4>
        <span className="ml-auto text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{desc}</span>
      </div>
      {objective && (
        <div className="mt-3 rounded-lg border border-border bg-[var(--surface)] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>Objetivo</p>
          <p className="mt-1 text-sm text-[var(--navy)] leading-snug">{objective}</p>
        </div>
      )}
      <ul className="mt-4 space-y-2.5">
        {items.map((q, i) => (
          <li key={i} className="flex gap-3 rounded-lg bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--navy)] leading-snug">
            <span className="mt-0.5 font-bold tabular-nums" style={{ color }}>{i + 1}.</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
