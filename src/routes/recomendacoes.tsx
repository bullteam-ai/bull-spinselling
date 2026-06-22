import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ClipboardCopy, Check, Search, Sparkles, GraduationCap, Flame,
  Home as HomeIcon, Headphones, Brain, Crown,
} from "lucide-react";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Bull Team | Passo a Passo de Recomendações Elite" },
      { name: "description", content: "Academia de recomendações: execução em reunião e treinamento elite com gatilhos psicológicos." },
      { property: "og:title", content: "Bull Team | Recomendações Elite" },
      { property: "og:description", content: "De 1 para 10+ recomendações qualificadas por reunião." },
    ],
  }),
  component: Recomendacoes,
});

/* ============================================================
   TIPOS E DADOS
   ============================================================ */

const COUNTER_TIERS = [
  { range: "< 5",   label: "Insuficiente", color: "var(--danger)" },
  { range: "5–9",   label: "Aceitável",    color: "var(--warn)" },
  { range: "10–15", label: "Forte",        color: "var(--brand)" },
  { range: "15+",   label: "Elite",        color: "var(--success)" },
];

const HERO_METRICS = [
  { label: "Meta da reunião", value: "10+ REC" },
  { label: "Meta elite",       value: "20 REC" },
  { label: "Expansão",         value: "30+ REC" },
  { label: "Regra",            value: "30 nomes · filtrar 10" },
];

const QUALIFY_FIELDS = [
  "Nome", "Profissão", "Idade aproximada", "Casado?", "Tem filhos?",
  "Renda aproximada", "Objetivo provável", "Relação com o cliente", "Prioridade",
];

const FULL_SCRIPT = `[PASSO 1 — GERAR CONVICÇÃO]
Fulano, olhando para tudo que conversamos hoje, o que mudou na sua visão financeira entre o início da reunião e agora?
(escutar)
Então podemos dizer que essa conversa teve valor para você?
(se sim) Perfeito. Então provavelmente existem outras pessoas próximas a você que também se beneficiariam dessa oportunidade.

[PASSO 2 — NUNCA PERGUNTE "QUEM VOCÊ CONHECE?"]
Use sempre perguntas fechadas de memória.
ERRADO: Quem você conhece que é médico?
CERTO:  Dos médicos que você conhece, quais são os 3 primeiros nomes que vêm na sua cabeça?

[PASSO 3 — MÉTODO DOS 3 NOMES]
Quais são os 3 empresários mais próximos de você?
E além desses 3? Quem seria o quarto? Quem mais?
(meta: 5 a 10 nomes por categoria)

[PASSO 4 — NICHOS PRÓXIMOS]
Família:   Quais são as 3 pessoas da sua família com quem você mais conversa?
Amigos:    Quem são os 3 amigos que mais participam da sua vida hoje?
Trabalho:  Quais são as 3 pessoas com quem você mais conversa no trabalho?
Academia:  Quem são as 3 pessoas que você mais encontra na academia?
Viagens:   Quais são os 3 amigos com quem você gostaria de viajar mais?

[PASSO 5 — OBJETIVOS]
Imóvel:         Quais são as 3 pessoas que você acredita que gostariam de comprar um imóvel nos próximos anos?
Filhos:         Quais são os 3 pais ou mães mais preocupados com o futuro dos filhos que você conhece?
Investimentos:  Quem são as 3 pessoas que ganham bem mas poderiam investir melhor?
Aposentadoria:  Quem são as 3 pessoas que não deveriam depender apenas do INSS?

[PASSO 6 — SUBIDA DE NÍVEL]
Empresários: Quais são os 3 empresários mais bem sucedidos que você conhece pessoalmente?
Médicos:     Quais são os 3 médicos mais respeitados que você conhece?
Dentistas:   Quais são os 3 dentistas que mais cresceram profissionalmente nos últimos anos?
Advogados:   Quais são os 3 advogados mais bem posicionados da sua rede?
Engenheiros: Quais são os 3 engenheiros que você acredita que possuem maior potencial financeiro?

[PASSO 7 — SUBIDA DE RENDA]
Pensando nas pessoas que você conhece, quem estaria entre os 5 maiores níveis de renda da sua rede?
Dessas pessoas, quais você acredita que mais se beneficiariam de uma orientação financeira?

[PASSO 8 — PESSOA DE REFERÊNCIA]
Quem é o maior exemplo de sucesso financeiro que você conhece pessoalmente?
Qual o nome dele? Qual profissão? Por que ele te veio na cabeça?

[PASSO 10 — PRIORIZAÇÃO]
Se eu pudesse conversar com apenas 3 dessas pessoas primeiro, quais seriam?
(Top 3 · Top 5 · Top 10)`;

/* =========================================
   PASSOS DA ABA 1 — EXECUÇÃO
   ========================================= */

const NICHE_QUESTIONS = [
  { emoji: "👨‍👩‍👧", label: "Família",  q: "Quais são as 3 pessoas da sua família com quem você mais conversa?" },
  { emoji: "🤝",     label: "Amigos",   q: "Quem são os 3 amigos que mais participam da sua vida hoje?" },
  { emoji: "💼",     label: "Trabalho", q: "Quais são as 3 pessoas com quem você mais conversa no trabalho?" },
  { emoji: "🏋️",    label: "Academia", q: "Quem são as 3 pessoas que você mais encontra na academia?" },
  { emoji: "✈️",     label: "Viagens",  q: "Quais são os 3 amigos com quem você gostaria de viajar mais?" },
];

const GOAL_QUESTIONS = [
  { emoji: "🏠", label: "Imóvel",        q: "Quais são as 3 pessoas que você acredita que gostariam de comprar um imóvel nos próximos anos?" },
  { emoji: "👶", label: "Filhos",        q: "Quais são os 3 pais ou mães mais preocupados com o futuro dos filhos que você conhece?" },
  { emoji: "📈", label: "Investimentos", q: "Quem são as 3 pessoas que ganham bem mas poderiam investir melhor?" },
  { emoji: "🌅", label: "Aposentadoria", q: "Quem são as 3 pessoas que não deveriam depender apenas do INSS?" },
];

const LEVEL_UP = [
  { emoji: "🏢", label: "Empresários", q: "Quais são os 3 empresários mais bem sucedidos que você conhece pessoalmente?" },
  { emoji: "🩺", label: "Médicos",     q: "Quais são os 3 médicos mais respeitados que você conhece?" },
  { emoji: "🦷", label: "Dentistas",   q: "Quais são os 3 dentistas que mais cresceram profissionalmente nos últimos anos?" },
  { emoji: "⚖️", label: "Advogados",  q: "Quais são os 3 advogados mais bem posicionados da sua rede?" },
  { emoji: "🛠️", label: "Engenheiros", q: "Quais são os 3 engenheiros que você acredita que possuem maior potencial financeiro?" },
];

/* =========================================
   PÁGINA
   ========================================= */

function Recomendacoes() {
  const [tab, setTab] = useState<"execucao" | "treino">("execucao");
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [meetings, setMeetings] = useState(8);
  const [recPerMeeting, setRecPerMeeting] = useState(10);

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(FULL_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const oportunidades = meetings * recPerMeeting;

  return (
    <div className="min-h-dvh bg-[var(--surface)] text-foreground pb-24">
      {/* HEADER */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[var(--navy)] via-[var(--navy)] to-[#0b1c3a] text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--brand)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[var(--success)]/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-10 sm:pt-16 sm:pb-14 relative">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur hover:bg-white/10 transition"
            >
              <HomeIcon className="h-3.5 w-3.5" aria-hidden /> Voltar ao guia
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--success)] backdrop-blur">
              <Crown className="h-3.5 w-3.5" /> Modo Elite
            </span>
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Passo a Passo de <span className="text-[var(--success)]">Recomendações Elite</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed">
            Transforme a média de 1 recomendação por reunião em 10+ recomendações qualificadas.
            Academia completa: execução em reunião e treinamento dos gatilhos por trás de cada pergunta.
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {HERO_METRICS.map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{m.label}</p>
                <p className="mt-2 text-xl sm:text-2xl font-extrabold text-white">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* STICKY TABS */}
      <nav className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 flex items-center gap-2 flex-wrap">
          <div role="tablist" className="inline-flex items-center rounded-xl border border-border bg-[var(--surface)] p-1">
            <TabButton active={tab === "execucao"} onClick={() => setTab("execucao")}
              icon={<Headphones className="h-3.5 w-3.5" />} label="Execução"
              activeClass="bg-[var(--success)] text-[var(--navy)] shadow-sm shadow-[var(--success)]/30"
            />
            <TabButton active={tab === "treino"} onClick={() => setTab("treino")}
              icon={<GraduationCap className="h-3.5 w-3.5" />} label="Treinamento Elite"
              activeClass="bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/30"
            />
          </div>
          {tab === "execucao" && (
            <div className="relative flex-1 min-w-[200px]">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar profissão, nicho ou objetivo (ex: médico, filhos)"
                className="w-full min-h-11 rounded-xl border border-border bg-white pl-9 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
              />
            </div>
          )}
          <button
            type="button"
            onClick={copyScript}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 min-h-11 text-xs sm:text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)] transition ml-auto"
          >
            {copied ? <Check className="h-4 w-4 text-[var(--success)]" /> : <ClipboardCopy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar script completo"}</span>
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-12">
        {tab === "execucao" ? (
          <ExecucaoTab query={query} meetings={meetings} setMeetings={setMeetings}
            recPerMeeting={recPerMeeting} setRecPerMeeting={setRecPerMeeting} oportunidades={oportunidades} />
        ) : (
          <TreinoTab />
        )}
      </main>
    </div>
  );
}

/* =========================================
   ABA 1 — EXECUÇÃO
   ========================================= */

function ExecucaoTab({
  query, meetings, setMeetings, recPerMeeting, setRecPerMeeting, oportunidades,
}: {
  query: string;
  meetings: number; setMeetings: (n: number) => void;
  recPerMeeting: number; setRecPerMeeting: (n: number) => void;
  oportunidades: number;
}) {
  const q = query.trim().toLowerCase();
  const matches = (text: string) => !q || text.toLowerCase().includes(q);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Regra de ouro */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)] shadow-lg shadow-[var(--success)]/30">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Regra Elite</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Não peça. Conduza.</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              A recomendação não é favor. É a extensão natural de uma reunião que entregou valor.
              Pergunta certa, na ordem certa, com o tom certo.
            </p>
          </div>
        </div>
      </section>

      {/* PASSO 1 */}
      <Step n={1} eyebrow="Passo 1" title="Gerar convicção" subtitle="Antes de pedir qualquer indicação, faça o cliente verbalizar o valor da reunião.">
        <ScriptCard label="Pergunta de abertura" quote='Fulano, olhando para tudo que conversamos hoje, o que mudou na sua visão financeira entre o início da reunião e agora?' />
        <p className="mt-3 text-sm font-semibold text-muted-foreground">(escuta ativa — deixe o cliente vender o trabalho para ele mesmo)</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <ScriptCard label="Confirmação" quote='Então podemos dizer que essa conversa teve valor para você?' />
          <ScriptCard label="Ponte (se SIM)" quote='Perfeito. Então provavelmente existem outras pessoas próximas a você que também se beneficiariam dessa oportunidade.' />
        </div>
      </Step>

      {/* PASSO 2 */}
      <Step n={2} eyebrow="Passo 2" title='Nunca pergunte "Quem você conhece?"' subtitle="Use sempre perguntas fechadas de memória. O cérebro responde a categoria, não a busca aberta.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-[var(--danger)]/40 bg-[var(--danger)]/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">❌ Errado</p>
            <p className="mt-2 text-base font-semibold text-[var(--navy)]">“Quem você conhece que é médico?”</p>
            <p className="mt-2 text-xs text-muted-foreground">Pergunta aberta = travamento. O cliente diz que não lembra de ninguém.</p>
          </div>
          <div className="rounded-2xl border-2 border-[var(--success)]/40 bg-[var(--success)]/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">✅ Certo</p>
            <p className="mt-2 text-base font-semibold text-[var(--navy)]">“Dos médicos que você conhece, quais são os 3 primeiros nomes que vêm na sua cabeça?”</p>
            <p className="mt-2 text-xs text-muted-foreground">Pergunta fechada por categoria = ativa memória episódica.</p>
          </div>
        </div>
      </Step>

      {/* PASSO 3 */}
      <Step n={3} eyebrow="Passo 3" title="Método dos 3 nomes" subtitle="Toda categoria segue a mesma estrutura. Meta: 5 a 10 nomes por categoria.">
        <ScriptCard label="Pergunta inicial" quote='Quais são os 3 empresários mais próximos de você?' />
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Pill>E além desses 3?</Pill>
          <Pill>Quem seria o quarto?</Pill>
          <Pill>Quem mais?</Pill>
        </div>
        <div className="mt-4 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
          <p className="text-sm font-semibold text-[var(--navy)]">
            <span className="text-[var(--brand)]">Objetivo:</span> extrair de 5 a 10 nomes por categoria.
          </p>
        </div>
      </Step>

      {/* PASSO 4 — NICHOS PRÓXIMOS */}
      <Step n={4} eyebrow="Passo 4" title="Nichos próximos" subtitle="Comece pela rede de maior proximidade. Memória ativa primeiro.">
        <QuestionGrid items={NICHE_QUESTIONS.filter(i => matches(i.label) || matches(i.q))} />
      </Step>

      {/* PASSO 5 — OBJETIVOS */}
      <Step n={5} eyebrow="Passo 5" title="Objetivos" subtitle="Use os objetivos da reunião para abrir novas gavetas mentais.">
        <QuestionGrid items={GOAL_QUESTIONS.filter(i => matches(i.label) || matches(i.q))} />
      </Step>

      {/* PASSO 6 — SUBIDA DE NÍVEL */}
      <Step n={6} eyebrow="Passo 6" title="Subida de nível" subtitle="Cliente comum gera cliente comum. Cliente premium gera cliente premium. Sempre subir.">
        <QuestionGrid items={LEVEL_UP.filter(i => matches(i.label) || matches(i.q))} premium />
      </Step>

      {/* PASSO 7 — SUBIDA DE RENDA */}
      <Step n={7} eyebrow="Passo 7" title="Subida de renda" subtitle="Filtre pelo topo da rede pessoal do cliente.">
        <div className="grid gap-3 md:grid-cols-2">
          <ScriptCard label="Pergunta 1" quote='Pensando nas pessoas que você conhece, quem estaria entre os 5 maiores níveis de renda da sua rede?' />
          <ScriptCard label="Pergunta 2 (após escutar)" quote='Dessas pessoas, quais você acredita que mais se beneficiariam de uma orientação financeira?' />
        </div>
      </Step>

      {/* PASSO 8 — PESSOA DE REFERÊNCIA */}
      <Step n={8} eyebrow="Passo 8" title="Pessoa de referência" subtitle="O nome mais valioso da rede do cliente geralmente está aqui.">
        <ScriptCard label="Pergunta principal" quote='Quem é o maior exemplo de sucesso financeiro que você conhece pessoalmente?' />
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Pill>Qual o nome dele?</Pill>
          <Pill>Qual profissão?</Pill>
          <Pill>Por que ele te veio na cabeça?</Pill>
        </div>
      </Step>

      {/* PASSO 9 — QUALIFICAÇÃO */}
      <Step n={9} eyebrow="Passo 9" title="Qualificação" subtitle="Para cada indicação, capturar:">
        <div className="rounded-2xl border border-border bg-white p-5">
          <ul className="grid gap-2 sm:grid-cols-3">
            {QUALIFY_FIELDS.map((f, i) => (
              <li key={f} className="flex items-start gap-2 rounded-xl border border-border bg-[var(--surface)] px-3 py-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--brand)] text-[10px] font-extrabold text-white">{i + 1}</span>
                <span className="text-sm font-medium text-[var(--navy)]">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Step>

      {/* PASSO 10 — PRIORIZAÇÃO */}
      <Step n={10} eyebrow="Passo 10" title="Priorização" subtitle="Defina ordem de abordagem junto com o cliente.">
        <ScriptCard label="Pergunta de priorização" quote='Se eu pudesse conversar com apenas 3 dessas pessoas primeiro, quais seriam?' />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PriorityCard tier="Top 3"  emoji="🥇" color="var(--success)" desc="Prioridade máxima · abordar em até 2 dias" />
          <PriorityCard tier="Top 5"  emoji="🥈" color="var(--brand)"   desc="Alta · abordar em até 3 dias" />
          <PriorityCard tier="Top 10" emoji="🥉" color="var(--warn)"    desc="Boa · abordar em até 4 dias" />
        </div>
      </Step>

      {/* META FINAL */}
      <Step n={11} eyebrow="Meta final" title="Quantas recomendações você conduziu hoje?" subtitle="Pense em padrão, não em sorte.">
        <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
          {COUNTER_TIERS.map((t) => (
            <div
              key={t.range}
              className="rounded-2xl border-2 p-4"
              style={{ borderColor: t.color, background: `color-mix(in oklab, ${t.color} 8%, white)` }}
            >
              <p className="text-3xl font-extrabold" style={{ color: t.color }}>{t.range}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--navy)]">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--success)]" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Simulador de meta</p>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3 items-end">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Reuniões no mês</span>
              <input type="range" min={1} max={30} value={meetings}
                onChange={(e) => setMeetings(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--success)]" />
              <span className="mt-1 block text-2xl font-extrabold">{meetings}</span>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">REC por reunião</span>
              <input type="range" min={1} max={30} value={recPerMeeting}
                onChange={(e) => setRecPerMeeting(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--success)]" />
              <span className="mt-1 block text-2xl font-extrabold">{recPerMeeting}</span>
            </label>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Oportunidades / mês</p>
              <p className="mt-1 text-4xl font-extrabold text-[var(--success)]">{oportunidades}</p>
              <p className="mt-1 text-xs text-white/60">{meetings} × {recPerMeeting}</p>
            </div>
          </div>
        </div>

        <blockquote className="mt-6 rounded-2xl border-l-4 border-[var(--success)] bg-white p-5 text-[var(--navy)]">
          <p className="font-semibold leading-relaxed">
            “O planejador que pede 1 recomendação está tentando sobreviver. O planejador que conduz 15+ está construindo escala, autoridade e futuro.”
          </p>
        </blockquote>
      </Step>
    </div>
  );
}

/* =========================================
   ABA 2 — TREINAMENTO ELITE
   ========================================= */

function TreinoTab() {
  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/40">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Academia de recomendações</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Entenda os gatilhos por trás de cada pergunta.</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              Por que aquela pergunta existe, qual gatilho psicológico ela ativa, qual objeção ela previne e como aprofundar.
            </p>
          </div>
        </div>
      </section>

      <Module n={1} title='Por que o cliente diz "não lembro de ninguém"' hook="Porque você perguntou errado.">
        <p className="text-[15px] leading-relaxed text-[var(--navy)]">
          O cérebro não trabalha por busca aberta. Ele trabalha por categoria. Quando você pergunta
          “quem você conhece?”, o cliente entra em loop e não acessa memória.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Compare type="weak"   label="Fraco"  text="Quem você conhece?" />
          <Compare type="strong" label="Forte"  text="Quais são os 3 empresários mais próximos de você?" />
        </div>
        <TrainingNote label="Gatilho ativado">
          Memória episódica + ancoragem numérica. O número “3” fecha o escopo e gera resposta imediata.
        </TrainingNote>
      </Module>

      <Module n={2} title="Regra dos 30 nomes" hook="Levante 30. Filtre 10.">
        <p className="text-[15px] leading-relaxed text-[var(--navy)]">
          Objetivo da reunião: <strong>30 nomes levantados</strong>. Depois filtrar.
          Nunca tente encontrar apenas 3. Encontre 30. Selecione os melhores 10.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat big="30" small="Nomes levantados" color="var(--brand)" />
          <Stat big="10" small="Selecionados para abordagem" color="var(--success)" />
          <Stat big="3"  small="Prioridade alta (Top 3)" color="var(--warn)" />
        </div>
        <TrainingNote label="Por que funciona">
          Quanto maior o universo, melhor a qualidade da seleção. Quem mira 3 entrega 1. Quem mira 30 entrega 10.
        </TrainingNote>
      </Module>

      <Module n={3} title="Não peça indicações. Conduza indicações." hook="Profissionais fracos pedem. Profissionais fortes conduzem.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-[var(--danger)]/40 bg-[var(--danger)]/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">Pedir</p>
            <p className="mt-2 text-sm font-semibold text-[var(--navy)]">Tom de favor. Energia baixa. Posição de vendedor.</p>
          </div>
          <div className="rounded-2xl border-2 border-[var(--success)]/40 bg-[var(--success)]/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Conduzir</p>
            <p className="mt-2 text-sm font-semibold text-[var(--navy)]">Tom de autoridade. Energia alta. Posição de consultor.</p>
          </div>
        </div>
        <TrainingNote label="Mentalidade">
          A recomendação é extensão natural da reunião. Você está abrindo a mesma oportunidade que o cliente teve.
        </TrainingNote>
      </Module>

      <Module n={4} title="Subida de nicho" hook="Cliente premium gera cliente premium.">
        <p className="text-[15px] leading-relaxed text-[var(--navy)]">
          Sempre subir. Use as profissões de maior renda como ponte natural.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Empresários", "Médicos", "Dentistas", "Advogados", "Executivos", "Produtores rurais", "Investidores", "Profissionais liberais de alta renda"].map((p) => (
            <span key={p} className="rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--brand)] inline-flex items-center gap-1.5">
              <Crown className="h-3 w-3" /> {p}
            </span>
          ))}
        </div>
        <TrainingNote label="Princípio">
          O ticket médio sobe quando a rede sobe. Cada subida de nicho duplica potencial de fechamento.
        </TrainingNote>
      </Module>

      <Module n={5} title="Meta de excelência" hook="O número que separa o sobrevivente do elite.">
        <div className="grid gap-3 sm:grid-cols-3">
          <LevelCard emoji="🎯" tier="Reunião comum"  value="10"  label="Recomendações qualificadas" color="var(--brand)" />
          <LevelCard emoji="🏆" tier="Planejador elite" value="20"  label="Recomendações qualificadas" color="var(--success)" />
          <LevelCard emoji="👑" tier="Franqueado de expansão" value="30+" label="Recomendações qualificadas" color="#c9a84c" />
        </div>
        <TrainingNote label="Verdade incômoda">
          Quanto maior o número de nomes levantados, maior a qualidade da seleção final.
          1 recomendação = sobrevivência. 10 = padrão. 20+ = quem constrói escala.
        </TrainingNote>
      </Module>
    </div>
  );
}

/* =========================================
   COMPONENTES AUXILIARES
   ========================================= */

function TabButton({
  active, onClick, icon, label, activeClass,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 sm:px-4 text-xs sm:text-sm font-semibold transition ${
        active ? activeClass : "text-muted-foreground hover:text-[var(--navy)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Step({
  n, eyebrow, title, subtitle, children,
}: {
  n: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <header className="mb-4 sm:mb-6 flex items-start gap-3">
        <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white text-sm font-extrabold shadow-md shadow-[var(--brand)]/30">
          {n}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">{eyebrow}</p>
          <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">{title}</h2>
          {subtitle && <p className="mt-1.5 max-w-3xl text-[14.5px] text-muted-foreground leading-relaxed">{subtitle}</p>}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}

function Module({
  n, title, hook, children,
}: {
  n: number;
  title: string;
  hook: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <header className="mb-4 sm:mb-6 flex items-start gap-3">
        <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#1a4a8a] text-white text-sm font-extrabold shadow-md shadow-[var(--brand)]/30">
          M{n}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Módulo {n}</p>
          <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">{title}</h2>
          <p className="mt-1.5 text-[14.5px] font-semibold text-[var(--navy)]/80">{hook}</p>
        </div>
      </header>
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ScriptCard({ quote, label, className }: { quote: string; label?: string; className?: string }) {
  return (
    <figure className={`rounded-2xl border border-border bg-white p-4 sm:p-5 ${className ?? ""}`}>
      {label && (
        <figcaption className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">{label}</figcaption>
      )}
      <blockquote className={`${label ? "mt-2" : ""} text-[15px] sm:text-base leading-relaxed text-[var(--navy)]`}>
        “{quote}”
      </blockquote>
    </figure>
  );
}

function QuestionGrid({
  items, premium,
}: { items: { emoji: string; label: string; q: string }[]; premium?: boolean }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum resultado para a busca atual.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((g) => (
        <article
          key={g.label}
          className={`rounded-2xl border p-4 transition hover:border-[var(--brand)]/40 ${
            premium
              ? "border-[var(--brand)]/30 bg-gradient-to-br from-[var(--brand)]/5 to-white"
              : "border-border bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-2xl">{g.emoji}</span>
            <div className="min-w-0">
              <p className="font-bold text-[var(--navy)] flex items-center gap-1.5">
                {g.label}
                {premium && <Crown className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden />}
              </p>
              <p className="mt-1.5 text-[13.5px] text-[var(--navy)]/80 leading-snug">“{g.q}”</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-2 text-center text-sm font-semibold text-[var(--navy)]">
      {children}
    </div>
  );
}

function PriorityCard({ tier, emoji, color, desc }: { tier: string; emoji: string; color: string; desc: string }) {
  return (
    <div
      className="rounded-2xl border-2 p-5"
      style={{ borderColor: color, background: `color-mix(in oklab, ${color} 8%, white)` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>{emoji}</span>
        <p className="text-lg font-extrabold" style={{ color }}>{tier}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-[var(--navy)]">{desc}</p>
    </div>
  );
}

function TrainingNote({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)] flex items-center gap-1.5">
        <Brain className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{children}</p>
    </div>
  );
}

function Compare({ type, label, text }: { type: "weak" | "strong"; label: string; text: string }) {
  const isStrong = type === "strong";
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        isStrong
          ? "border-[var(--success)]/40 bg-[var(--success)]/10"
          : "border-[var(--danger)]/40 bg-[var(--danger)]/5"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-wider ${
          isStrong ? "text-[var(--success)]" : "text-[var(--danger)]"
        }`}
      >
        {isStrong ? "✅" : "❌"} {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--navy)]">“{text}”</p>
    </div>
  );
}

function Stat({ big, small, color }: { big: string; small: string; color: string }) {
  return (
    <div
      className="rounded-2xl border-2 p-4 text-center"
      style={{ borderColor: color, background: `color-mix(in oklab, ${color} 8%, white)` }}
    >
      <p className="text-3xl sm:text-4xl font-extrabold" style={{ color }}>{big}</p>
      <p className="mt-1 text-xs sm:text-sm font-semibold text-[var(--navy)]">{small}</p>
    </div>
  );
}

function LevelCard({ emoji, tier, value, label, color }: { emoji: string; tier: string; value: string; label: string; color: string }) {
  return (
    <div
      className="rounded-2xl border-2 p-5"
      style={{ borderColor: color, background: `color-mix(in oklab, ${color} 6%, white)` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>{emoji}</span>
        <p className="text-sm font-bold text-[var(--navy)]">{tier}</p>
      </div>
      <p className="mt-3 text-4xl font-extrabold" style={{ color }}>{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
