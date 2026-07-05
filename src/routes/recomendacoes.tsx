import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ClipboardCopy, Check, Search, Sparkles, GraduationCap, Flame,
  Home as HomeIcon, Headphones, Brain, Crown,
} from "lucide-react";
import {
  AlertTriangle, ArrowDown, ArrowUp, Layers, LifeBuoy, Microscope, Radar,
  Users, Trophy, FileSearch, ScrollText, ListTree, ChevronRight,
} from "lucide-react";
import { CentralInteligencia } from "@/components/central-inteligencia/CentralInteligencia";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Bull Team | Passo a Passo de Recomendações Elite" },
      { name: "description", content: "Academia de recomendações: execução em reunião e treinamento elite com gatilhos psicológicos." },
      { property: "og:title", content: "Bull Team | Recomendações Elite" },
      { property: "og:description", content: "De 1 para 10+ recomendações qualificadas por reunião." },
    ],
    links: [
      { rel: "canonical", href: "https://bull-spinselling.lovable.app/recomendacoes" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Passo a Passo de Recomendações Elite",
          description: "Método Bull Team para sair de cada reunião com 10+ recomendações qualificadas.",
          step: [
            { "@type": "HowToStep", position: 1, name: "Convicção", text: "Confirme com o cliente que a conversa gerou valor antes de pedir recomendações." },
            { "@type": "HowToStep", position: 2, name: "Pergunta certa", text: "Substitua 'Quem você conhece?' por perguntas direcionadas a nichos e objetivos." },
            { "@type": "HowToStep", position: 3, name: "Método dos 3 nomes", text: "Sempre peça pelo menos 3 nomes por nicho, nunca aceite o primeiro 'não lembro'." },
            { "@type": "HowToStep", position: 4, name: "Nichos próximos", text: "Explore família, amigos, trabalho, academia e viagens." },
            { "@type": "HowToStep", position: 5, name: "Objetivos", text: "Conduza por objetivos: imóvel, filhos, investimentos, aposentadoria." },
            { "@type": "HowToStep", position: 6, name: "Subida de nível", text: "Eleve a rede: empresários, médicos, dentistas, advogados, executivos." },
            { "@type": "HowToStep", position: 7, name: "Subida de renda", text: "Direcione perguntas para a faixa de renda alvo do planejamento." },
            { "@type": "HowToStep", position: 8, name: "Pessoa de referência", text: "Identifique conectores naturais da rede do cliente." },
            { "@type": "HowToStep", position: 9, name: "Qualificação", text: "Levante nome, profissão, idade, família, renda e objetivo provável de cada indicado." },
            { "@type": "HowToStep", position: 10, name: "Priorização", text: "Filtre 10 contatos prioritários antes de encerrar a reunião." },
            { "@type": "HowToStep", position: 11, name: "Reconhecimento", text: "Valorize a atitude do cliente e feche a reunião com um encerramento emocional positivo." },
          ],
        }),
      },
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

const FULL_SCRIPT = `[PASSO 1. GERAR CONVICÇÃO]
Fulano, olhando para tudo que conversamos hoje, o que mudou na sua visão financeira entre o início da reunião e agora?
(escutar)
Então podemos dizer que essa conversa teve valor para você?
(se sim) Perfeito. Então provavelmente existem outras pessoas próximas a você que também se beneficiariam dessa oportunidade.

[PASSO 2. NUNCA PERGUNTE "QUEM VOCÊ CONHECE?"]
Use sempre perguntas fechadas de memória.
ERRADO: Quem você conhece que é médico?
CERTO:  Dos médicos que você conhece, quais são os 3 primeiros nomes que vêm na sua cabeça?

[PASSO 3. MÉTODO DOS 3 NOMES]
Quais são os 3 empresários mais próximos de você?
E além desses 3? Quem seria o quarto? Quem mais?
(meta: 5 a 10 nomes por categoria)

[PASSO 4. NICHOS PRÓXIMOS]
Família:   Quais são as 3 pessoas da sua família com quem você mais conversa?
Amigos:    Quem são os 3 amigos que mais participam da sua vida hoje?
Trabalho:  Quais são as 3 pessoas com quem você mais conversa no trabalho?
Academia:  Quem são as 3 pessoas que você mais encontra na academia?
Viagens:   Quais são os 3 amigos com quem você gostaria de viajar mais?

[PASSO 5. OBJETIVOS]
Imóvel:         Quais são as 3 pessoas que você acredita que gostariam de comprar um imóvel nos próximos anos?
Filhos:         Quais são os 3 pais ou mães mais preocupados com o futuro dos filhos que você conhece?
Investimentos:  Quem são as 3 pessoas que ganham bem mas poderiam investir melhor?
Aposentadoria:  Quem são as 3 pessoas que não deveriam depender apenas do INSS?

[PASSO 6. SUBIDA DE NÍVEL]
Empresários: Quais são os 3 empresários mais bem sucedidos que você conhece pessoalmente?
Médicos:     Quais são os 3 médicos mais respeitados que você conhece?
Dentistas:   Quais são os 3 dentistas que mais cresceram profissionalmente nos últimos anos?
Advogados:   Quais são os 3 advogados mais bem posicionados da sua rede?
Engenheiros: Quais são os 3 engenheiros que você acredita que possuem maior potencial financeiro?

[PASSO 7. SUBIDA DE RENDA]
Pensando nas pessoas que você conhece, quem estaria entre os 5 maiores níveis de renda da sua rede?
Dessas pessoas, quais você acredita que mais se beneficiariam de uma orientação financeira?

[PASSO 8. PESSOA DE REFERÊNCIA]
Quem é o maior exemplo de sucesso financeiro que você conhece pessoalmente?
Qual o nome dele? Qual profissão? Por que ele te veio na cabeça?

[PASSO 10. PRIORIZAÇÃO]
Se eu pudesse conversar com apenas 3 dessas pessoas primeiro, quais seriam?
(Top 3 · Top 5 · Top 10)`;

/* =========================================
   PASSOS DA ABA 1. EXECUÇÃO
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
   ÂNCORAS DA JORNADA
   ========================================= */

export type TabKey = "execucao" | "treino";
export type JourneyItem = { id: string; label: string; tab: TabKey };

export const JOURNEY: JourneyItem[] = [
  { id: "mapa-mental",   label: "Mapa mental",              tab: "execucao" },
  { id: "passo-1",       label: "1 · Convicção",            tab: "execucao" },
  { id: "passo-2",       label: "2 · Pergunta certa",       tab: "execucao" },
  { id: "escada",        label: "Escada de profundidade",   tab: "execucao" },
  { id: "passo-3",       label: "3 · Método dos 3 nomes",   tab: "execucao" },
  { id: "passo-4",       label: "4 · Nichos próximos",      tab: "execucao" },
  { id: "passo-5",       label: "5 · Objetivos",            tab: "execucao" },
  { id: "modo-elite",    label: "Modo Elite",               tab: "execucao" },
  { id: "passo-6",       label: "6 · Subida de nível",      tab: "execucao" },
  { id: "passo-7",       label: "7 · Subida de renda",      tab: "execucao" },
  { id: "passo-8",       label: "8 · Pessoa de referência", tab: "execucao" },
  { id: "anatomia",      label: "Anatomia da REC elite",    tab: "execucao" },
  { id: "passo-9",       label: "9 · Qualificação",         tab: "execucao" },
  { id: "passo-10",      label: "10 · Priorização",         tab: "execucao" },
  { id: "passo-11",      label: "11 · Reconhecimento",      tab: "execucao" },
  { id: "passo-12",      label: "Meta final",               tab: "execucao" },
  { id: "mod-1",         label: "M1 · Não lembro",          tab: "treino"   },
  { id: "mod-2",         label: "M2 · Regra dos 30",        tab: "treino"   },
  { id: "mod-3",         label: "M3 · Não peça. Conduza.",  tab: "treino"   },
  { id: "mod-4",         label: "M4 · Subida de nicho",     tab: "treino"   },
  { id: "mod-5",         label: "M5 · Meta de excelência",  tab: "treino"   },
  { id: "mod-6",         label: "M6 · Radar",               tab: "treino"   },
  { id: "mod-7",         label: "M7 · Psicologia",          tab: "treino"   },
  { id: "mod-8",         label: "M8 · Top 1%",              tab: "treino"   },
  { id: "mandamentos",   label: "Mandamentos",              tab: "treino"   },
];

function scrollToAnchor(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =========================================
   PÁGINA
   ========================================= */

function Recomendacoes() {
  const [tab, setTab] = useState<TabKey>("execucao");
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [meetings, setMeetings] = useState(8);
  const [recPerMeeting, setRecPerMeeting] = useState(10);

  const copyScript = async () => {
    const ok = await copyToClipboard(FULL_SCRIPT);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Não foi possível copiar automaticamente. Selecione o texto manualmente.");
    }
  };

  const oportunidades = meetings * recPerMeeting;

  const jumpTo = (item: JourneyItem) => {
    if (item.tab !== tab) {
      setTab(item.tab);
      // aguardar render da aba antes de rolar
      requestAnimationFrame(() => {
        setTimeout(() => scrollToAnchor(item.id), 60);
      });
    } else {
      scrollToAnchor(item.id);
    }
  };

  // Sincronizar com hash da URL (#passo-3 etc.), vindo do menu suspenso global
  useEffect(() => {
    const handleHash = () => {
      const raw = window.location.hash.replace("#", "");
      if (!raw) return;
      const item = JOURNEY.find((i) => i.id === raw);
      if (!item) return;
      if (item.tab !== tab) setTab(item.tab);
      requestAnimationFrame(() => {
        setTimeout(() => scrollToAnchor(item.id), 80);
      });
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* MÓDULO BÔNUS. A MAIOR MENTIRA SOBRE RECOMENDAÇÕES */}
      <MentiraSection />

      {/* CENTRAL DE INTELIGÊNCIA — QUEBRA DE OBJEÇÕES */}
      <CentralInteligencia />

      {/* STICKY TABS */}
      <nav className="sticky top-12 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
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
        <JourneyNav tab={tab} onJump={jumpTo} />
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
   ABA 1. EXECUÇÃO
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

      {/* MAPA MENTAL DA RECOMENDAÇÃO */}
      <MapaMentalSection />

      {/* PASSO 1 */}
      <Step id="passo-1" n={1} eyebrow="Passo 1" title="Gerar convicção" subtitle="Antes de pedir qualquer indicação, faça o cliente verbalizar o valor da reunião.">
        <ScriptCard label="Pergunta de abertura" quote='Fulano, olhando para tudo que conversamos hoje, o que mudou na sua visão financeira entre o início da reunião e agora?' />
        <p className="mt-3 text-sm font-semibold text-muted-foreground">(escuta ativa, deixe o cliente vender o trabalho para ele mesmo)</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <ScriptCard label="Confirmação" quote='Então podemos dizer que essa conversa teve valor para você?' />
          <ScriptCard label="Ponte (se SIM)" quote='Perfeito. Então provavelmente existem outras pessoas próximas a você que também se beneficiariam dessa oportunidade.' />
        </div>
      </Step>

      {/* PASSO 2 */}
      <Step id="passo-2" n={2} eyebrow="Passo 2" title='Nunca pergunte "Quem você conhece?"' subtitle="Use sempre perguntas fechadas de memória. O cérebro responde a categoria, não a busca aberta.">
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

      {/* ESCADA DE PROFUNDIDADE */}
      <EscadaProfundidadeSection />

      {/* PASSO 3 */}
      <Step id="passo-3" n={3} eyebrow="Passo 3" title="Método dos 3 nomes" subtitle="Toda categoria segue a mesma estrutura. Meta: 5 a 10 nomes por categoria.">
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

      {/* PASSO 4. NICHOS PRÓXIMOS */}
      <Step id="passo-4" n={4} eyebrow="Passo 4" title="Nichos próximos" subtitle="Comece pela rede de maior proximidade. Memória ativa primeiro.">
        <QuestionGrid items={NICHE_QUESTIONS.filter(i => matches(i.label) || matches(i.q))} />
        <PerguntaResgateSection />
      </Step>

      {/* PASSO 5. OBJETIVOS */}
      <Step id="passo-5" n={5} eyebrow="Passo 5" title="Objetivos" subtitle="Use os objetivos da reunião para abrir novas gavetas mentais.">
        <QuestionGrid items={GOAL_QUESTIONS.filter(i => matches(i.label) || matches(i.q))} />
      </Step>

      {/* MODO ELITE. APROFUNDAMENTO */}
      <ModoEliteSection />

      {/* PASSO 6. SUBIDA DE NÍVEL */}
      <Step id="passo-6" n={6} eyebrow="Passo 6" title="Subida de nível" subtitle="Cliente comum gera cliente comum. Cliente premium gera cliente premium. Sempre subir.">
        <QuestionGrid items={LEVEL_UP.filter(i => matches(i.label) || matches(i.q))} premium />
        <SubidaNichoInteligenteSection />
      </Step>

      {/* PASSO 7. SUBIDA DE RENDA */}
      <Step id="passo-7" n={7} eyebrow="Passo 7" title="Subida de renda" subtitle="Filtre pelo topo da rede pessoal do cliente.">
        <div className="grid gap-3 md:grid-cols-2">
          <ScriptCard label="Pergunta 1" quote='Pensando nas pessoas que você conhece, quem estaria entre os 5 maiores níveis de renda da sua rede?' />
          <ScriptCard label="Pergunta 2 (após escutar)" quote='Dessas pessoas, quais você acredita que mais se beneficiariam de uma orientação financeira?' />
        </div>
      </Step>

      {/* PASSO 8. PESSOA DE REFERÊNCIA */}
      <Step id="passo-8" n={8} eyebrow="Passo 8" title="Pessoa de referência" subtitle="O nome mais valioso da rede do cliente geralmente está aqui.">
        <ScriptCard label="Pergunta principal" quote='Quem é o maior exemplo de sucesso financeiro que você conhece pessoalmente?' />
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Pill>Qual o nome dele?</Pill>
          <Pill>Qual profissão?</Pill>
          <Pill>Por que ele te veio na cabeça?</Pill>
        </div>
      </Step>

      {/* ANATOMIA DE UMA RECOMENDAÇÃO ELITE */}
      <AnatomiaSection />

      {/* PASSO 9. QUALIFICAÇÃO */}
      <Step id="passo-9" n={9} eyebrow="Passo 9" title="Qualificação" subtitle="Para cada indicação, capturar:">
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

      {/* PASSO 10. PRIORIZAÇÃO */}
      <Step id="passo-10" n={10} eyebrow="Passo 10" title="Priorização" subtitle="Defina ordem de abordagem junto com o cliente.">
        <ScriptCard label="Pergunta de priorização" quote='Se eu pudesse conversar com apenas 3 dessas pessoas primeiro, quais seriam?' />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PriorityCard tier="Top 3"  emoji="🥇" color="var(--success)" desc="Prioridade máxima · abordar em até 2 dias" />
          <PriorityCard tier="Top 5"  emoji="🥈" color="var(--brand)"   desc="Alta · abordar em até 3 dias" />
          <PriorityCard tier="Top 10" emoji="🥉" color="var(--warn)"    desc="Boa · abordar em até 4 dias" />
        </div>
      </Step>

      {/* PASSO 11. RECONHECIMENTO */}
      <ReconhecimentoStep />

      {/* META FINAL */}
      <Step id="passo-12" n={12} eyebrow="Meta final" title="Quantas recomendações você conduziu hoje?" subtitle="Pense em padrão, não em sorte.">
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
   ABA 2. TREINAMENTO ELITE
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

      <Module id="mod-1" n={1} title='Por que o cliente diz "não lembro de ninguém"' hook="Porque você perguntou errado.">
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

      <Module id="mod-2" n={2} title="Regra dos 30 nomes" hook="Levante 30. Filtre 10.">
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

      <Module id="mod-3" n={3} title="Não peça indicações. Conduza indicações." hook="Profissionais fracos pedem. Profissionais fortes conduzem.">
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

      <Module id="mod-4" n={4} title="Subida de nicho" hook="Cliente premium gera cliente premium.">
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

      <Module id="mod-5" n={5} title="Meta de excelência" hook="O número que separa o sobrevivente do elite.">
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

      {/* RADAR DE OPORTUNIDADES */}
      <RadarOportunidadesSection />

      {/* PSICOLOGIA DA RECOMENDAÇÃO */}
      <PsicologiaSection />

      {/* O QUE FAZ OS TOP 1% */}
      <Top1Section />

      {/* MANDAMENTOS DA RECOMENDAÇÃO ELITE */}
      <MandamentosSection />
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

function JourneyNav({
  tab, onJump,
}: { tab: TabKey; onJump: (item: JourneyItem) => void }) {
  const current = JOURNEY.filter((i) => i.tab === tab);
  const other   = JOURNEY.filter((i) => i.tab !== tab);
  const accent  = tab === "execucao" ? "var(--success)" : "var(--brand)";
  const otherLabel = tab === "execucao" ? "Treinamento" : "Execução";
  return (
    <div className="border-t border-border bg-gradient-to-b from-white to-[var(--surface)]/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <ListTree className="h-3.5 w-3.5" style={{ color: accent }} />
          Jornada
        </div>
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 w-max pr-2">
            {current.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJump(item)}
                className="shrink-0 inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-[11.5px] font-semibold text-[var(--navy)] hover:border-[color:var(--brand)] hover:text-[var(--brand)] hover:-translate-y-px transition"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: accent }}
                  aria-hidden
                />
                {item.label}
              </button>
            ))}
            <span className="shrink-0 mx-1 h-5 w-px bg-border" aria-hidden />
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground pl-1 pr-1">
              {otherLabel}
            </span>
            {other.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJump(item)}
                className="shrink-0 inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-transparent px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground hover:border-[color:var(--brand)] hover:text-[var(--brand)] hover:bg-white transition"
              >
                <ChevronRight className="h-3 w-3" aria-hidden />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  n, eyebrow, title, subtitle, children, id,
}: {
  n: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-32">
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
  n, title, hook, children, id,
}: {
  n: number;
  title: string;
  hook: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-32">
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
    <figure className={className}>
      {label && (
        <figcaption className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">{label}</figcaption>
      )}
      <blockquote className="fala-script">
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

/* =========================================
   PASSO 11 — RECONHECIMENTO
   ========================================= */

const RECONHECIMENTO_FALE_ISTO = `Antes de encerrarmos, quero te agradecer pela confiança e pela atitude que você teve agora.

Pode parecer algo simples, mas não é.

Você parou alguns minutos do seu dia para pensar em pessoas importantes da sua vida, e isso diz muito sobre quem você é.

Pessoas que se preocupam genuinamente com quem está ao redor costumam gerar um impacto muito maior do que imaginam.

Quero te parabenizar por essa atitude.

E sabe o que eu acho mais legal nisso tudo?

Talvez daqui a alguns meses ou alguns anos, alguma dessas pessoas esteja vivendo uma situação financeira melhor, realizando um sonho, conquistando mais tranquilidade ou tomando decisões mais inteligentes com o dinheiro.

Se isso acontecer, uma pequena parte dessa transformação começou exatamente aqui, com a atitude que você teve hoje.

Foi você quem abriu essa porta para que essa oportunidade chegasse até ela.

Quero que fique tranquilo também: da mesma forma que fiz com você, vou conversar com cada uma dessas pessoas com muito respeito, responsabilidade e total transparência.

Se eu perceber que realmente posso ajudá-las, vou fazer o meu melhor para que alcancem seus objetivos.

E se entender que não faz sentido naquele momento, também serei completamente sincero.

Nosso compromisso nunca foi vender algo para alguém.

Nosso compromisso é cuidar das pessoas e ajudá-las a tomar as melhores decisões para a vida financeira delas.

Mais uma vez, obrigado pela confiança e parabéns pela atitude que você teve hoje.`;

const RECONHECIMENTO_ALT = [
  "Você acabou de fazer algo que pouca gente faz: pensar primeiro em quem pode se beneficiar dessa oportunidade.",
  "Isso mostra que você valoriza as pessoas que fazem parte da sua vida.",
  "Obrigado pela confiança. Pode ter certeza de que vou tratar cada pessoa que você indicou com o mesmo respeito que tratei você.",
  "As melhores recomendações acontecem quando alguém acredita tanto na experiência que faz questão de apresentá-la para pessoas importantes.",
  "Independentemente do que acontecer depois, a atitude que você teve hoje já merece reconhecimento.",
];

const RECONHECIMENTO_ERROS = [
  { frase: "Obrigado pelas indicações.", motivo: "Isso faz parecer que seu interesse são apenas os contatos." },
  { frase: "Você me ajudou bastante.", motivo: "O foco fica em você, e não na atitude do cliente." },
  { frase: "Agora preciso que você avise essas pessoas.", motivo: "Pode gerar sensação de obrigação." },
  { frase: "Encerrar a reunião imediatamente após pegar os nomes.", motivo: "Você perde o momento emocional mais forte de todo o processo." },
  { frase: "Prometer resultados.", motivo: "Nunca diga que você vai mudar a vida das pessoas. Diga que fará o melhor para ajudá-las caso isso faça sentido para elas." },
];

function ReconhecimentoStep() {
  return (
    <Step
      id="passo-11"
      n={11}
      eyebrow="Passo 11"
      title="Reconhecimento"
      subtitle="Valorize a atitude do cliente e fortaleça seu compromisso com as pessoas que ele indicou."
    >
      {/* CARD PRINCIPAL — FALE ISTO */}
      <section
        className="rounded-3xl border-2 border-[var(--success)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--success)]/20"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success)]/15 border border-[var(--success)]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">
            <Trophy className="h-3.5 w-3.5" /> Fale Isto
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Encerramento emocional</span>
        </div>
        <blockquote className="mt-5 space-y-3 text-[15px] sm:text-[16px] leading-relaxed text-white/90 border-l-4 border-[var(--success)]/70 pl-4">
          {RECONHECIMENTO_FALE_ISTO.split("\n\n").map((p, i, arr) => (
            <p key={i}>
              {i === 0 ? "“" : ""}
              {p}
              {i === arr.length - 1 ? "”" : ""}
            </p>
          ))}
        </blockquote>
      </section>

      {/* GRID: PSICOLOGIA + COMO TRANSMITIR */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border-2 border-[var(--success)]/40 bg-gradient-to-br from-[var(--success)]/10 to-white p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">🧠 Psicologia da etapa</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--navy)]">O que acontece na mente do cliente</h3>
          <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
            Quando uma pessoa é reconhecida por uma atitude positiva, ela tende a reforçar esse comportamento como parte da própria identidade.
          </p>
          <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
            Ao elogiar a decisão de pensar em pessoas importantes da vida dela — e não simplesmente agradecer pelas recomendações — você faz com que o cliente se enxergue como alguém que gera impacto positivo na vida de outras pessoas.
          </p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">Isso aumenta significativamente</p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/85 list-disc pl-5">
            <li>confiança no planejador</li>
            <li>orgulho pela própria atitude</li>
            <li>vontade de falar bem da experiência</li>
            <li>predisposição para preparar os indicados antes do contato</li>
            <li>possibilidade de novas recomendações no futuro</li>
          </ul>
          <p className="mt-3 text-sm italic text-foreground/70">
            O cliente deixa a reunião sentindo que participou de algo maior do que apenas fornecer nomes.
          </p>
        </article>

        <article className="rounded-2xl border-2 border-[var(--brand)]/40 bg-gradient-to-br from-[var(--brand)]/10 to-white p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">🎯 Como transmitir</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--navy)]">Comunicação ideal</h3>
          <ul className="mt-3 space-y-2 text-sm text-foreground/85">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" /> Fale olhando nos olhos.</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" /> Diminua o ritmo da conversa.</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" /> Demonstre gratidão verdadeira.</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" /> Faça pequenas pausas.</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" /> Termine sorrindo.</li>
          </ul>
          <div className="mt-4 rounded-xl border border-[var(--brand)]/30 bg-white p-3.5">
            <p className="text-sm text-foreground/85">
              O reconhecimento precisa parecer <strong>genuíno</strong>. Nunca dê a impressão de que está agradecendo pelos contatos —
              você está reconhecendo a <strong>atitude</strong> da pessoa. Essa diferença muda completamente a percepção do cliente.
            </p>
          </div>
        </article>
      </div>

      {/* FRASES ALTERNATIVAS — CARD LARANJA */}
      <article className="mt-6 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">💬 Frases alternativas</p>
        <h3 className="mt-1 text-lg font-bold text-[var(--navy)]">Adapte o tom sem perder a essência</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {RECONHECIMENTO_ALT.map((f, i) => (
            <div key={i} className="rounded-xl border border-amber-200 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Opção {i + 1}</p>
              <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">“{f}”</p>
            </div>
          ))}
        </div>
      </article>

      {/* ERROS PARA EVITAR — CARD VERMELHO */}
      <article className="mt-6 rounded-2xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-white p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">⚠️ Erros para evitar</p>
        <h3 className="mt-1 text-lg font-bold text-[var(--navy)]">O que <em>nunca</em> dizer no encerramento</h3>
        <ul className="mt-4 space-y-3">
          {RECONHECIMENTO_ERROS.map((e, i) => (
            <li key={i} className="rounded-xl border border-red-200 bg-white p-4">
              <p className="text-sm font-semibold text-red-700 flex items-start gap-2">
                <span aria-hidden>❌</span>
                <span>“{e.frase}”</span>
              </p>
              <p className="mt-1.5 text-sm text-foreground/75 pl-6">{e.motivo}</p>
            </li>
          ))}
        </ul>
      </article>

      {/* ACCORDION — POR QUE FUNCIONA */}
      <details className="mt-6 group rounded-2xl border border-border bg-white shadow-sm open:shadow-md transition">
        <summary className="cursor-pointer list-none flex items-center gap-3 px-5 py-4 rounded-2xl select-none">
          <span className="grid place-items-center h-9 w-9 shrink-0 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
            <Brain className="h-4 w-4" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">Aprofundar</span>
            <span className="block text-base sm:text-lg font-bold text-[var(--navy)]">🔍 Por que essa etapa funciona?</span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
        </summary>

        <div className="px-5 pb-6 sm:px-6 sm:pb-7 space-y-6 border-t border-border pt-5 animate-fade-in">
          <div>
            <h4 className="text-sm font-bold text-[var(--navy)]">A psicologia por trás do reconhecimento</h4>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              As pessoas procuram agir de forma coerente com a imagem que possuem de si mesmas. Quando você reconhece a atitude do cliente, ele passa a acreditar que ajudar pessoas faz parte da própria identidade.
            </p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">Esse efeito aumenta naturalmente a probabilidade de:</p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/85 list-disc pl-5">
              <li>falar bem da reunião</li>
              <li>recomendar novamente</li>
              <li>defender seu trabalho quando alguém perguntar</li>
              <li>preparar melhor os indicados antes do contato</li>
            </ul>
            <p className="mt-2 text-sm italic text-foreground/70">
              O elogio deve ser direcionado ao comportamento, nunca ao número de recomendações.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--navy)]">O verdadeiro objetivo</h4>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              Esta etapa não existe para agradecer. Ela existe para transformar uma recomendação em uma missão compartilhada.
            </p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              O cliente deixa de sentir que “passou contatos”. Ele passa a sentir que abriu uma oportunidade para pessoas importantes da sua vida. Essa mudança de percepção fortalece muito o relacionamento.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--navy)]">O compromisso do planejador</h4>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              O encerramento também reforça um princípio essencial: o planejador não está buscando vender para qualquer pessoa. Está oferecendo uma conversa séria, respeitosa e transparente.
            </p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              Caso exista uma oportunidade real de ajudar, fará isso com dedicação. Caso não exista, será igualmente honesto. Esse posicionamento aumenta a credibilidade e reduz qualquer sensação de pressão comercial.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--navy)]">O impacto futuro</h4>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              Quando uma das pessoas indicadas for contatada, existe uma grande chance de o cliente dizer algo como:
            </p>
            <blockquote className="mt-3 rounded-xl border-l-4 border-[var(--success)] bg-[var(--success)]/5 p-4 text-sm italic text-[var(--navy)]">
              “Pode conversar com ele. Gostei muito da experiência e achei que faria sentido para você também.”
            </blockquote>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              Essa recomendação espontânea começa a ser construída exatamente neste momento.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)] flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> Modo Treinamento · Por que essa etapa existe?
            </p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              O cérebro humano tende a repetir comportamentos que são reconhecidos positivamente. Quando você valoriza a atitude do cliente, ele associa emoções positivas à experiência que acabou de viver.
            </p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">Isso faz com que ele:</p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/85 list-disc pl-5">
              <li>lembre da reunião com satisfação;</li>
              <li>sinta orgulho da decisão que tomou;</li>
              <li>recomende com mais convicção;</li>
              <li>fale naturalmente bem do seu trabalho;</li>
              <li>esteja mais disposto a indicar outras pessoas no futuro.</li>
            </ul>
            <p className="mt-3 text-sm italic text-foreground/70">
              O objetivo desta etapa não é agradecer pelas recomendações. É fazer o cliente sair da reunião sentindo que fez algo importante para pessoas que ama.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[var(--success)]/50 bg-gradient-to-br from-[var(--success)]/10 to-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Dica Premium · Encerramento de Excelência
            </p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">Após concluir toda a conversa, finalize com calma:</p>
            <blockquote className="mt-3 rounded-xl bg-white border border-[var(--success)]/30 p-4 text-sm leading-relaxed text-[var(--navy)]">
              “Pode ficar tranquilo. Vou cuidar dessas pessoas exatamente da forma como cuidei de você: com respeito, responsabilidade e total transparência. Se eu perceber que consigo ajudá-las, farei o meu melhor para que alcancem seus objetivos. Se entender que este não é o momento certo, também serei completamente sincero. Meu compromisso sempre será ajudar as pessoas a tomarem boas decisões, nunca convencê-las de algo que não faça sentido.”
            </blockquote>
          </div>
        </div>
      </details>
    </Step>
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

/* =========================================
   NOVOS MÓDULOS COMPLEMENTARES
   ========================================= */

function BonusHeader({
  eyebrow, title, hook, icon, accent = "var(--brand)",
}: { eyebrow: string; title: string; hook?: string; icon: React.ReactNode; accent?: string }) {
  return (
    <header className="mb-4 sm:mb-6 flex items-start gap-3">
      <span
        className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
        style={{ background: accent, boxShadow: `0 8px 24px -8px ${accent}` }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>{eyebrow}</p>
        <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">{title}</h2>
        {hook && <p className="mt-1.5 text-[14.5px] font-semibold text-[var(--navy)]/80">{hook}</p>}
      </div>
    </header>
  );
}

/* MÓDULO 1. A MAIOR MENTIRA */
function MentiraSection() {
  const pairs = [
    { wrong: "Quem você conhece que é empresário?", right: "Quais são os 3 empresários mais próximos de você?" },
    { wrong: "Quem você conhece que é médico?",      right: "Quais são os 3 médicos que vêm primeiro à sua cabeça?" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6 pt-8">
      <div className="rounded-3xl border-2 border-[var(--danger)]/30 bg-gradient-to-br from-white to-[var(--danger)]/5 p-6 sm:p-8 shadow-xl">
        <BonusHeader
          eyebrow="Mentalidade"
          title="A maior mentira sobre recomendações"
          hook="Profissionais comuns fazem perguntas abertas. Profissionais de elite conduzem a memória."
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="var(--danger)"
        />
        <p className="text-[15px] leading-relaxed text-[var(--navy)] max-w-3xl">
          O erro clássico: <em>“Quem você conhece que gostaria do meu trabalho?”</em>, isso obriga o cérebro
          do cliente a procurar em um universo infinito. Resultado: ele trava.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {pairs.map((p) => (
            <div key={p.wrong} className="rounded-2xl border border-border bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[var(--danger)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--danger)]">Trocar</span>
              </div>
              <p className="mt-2 text-sm text-[var(--navy)]/70 line-through">“{p.wrong}”</p>
              <div className="mt-3 flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-[var(--success)]" />
                <span className="rounded-md bg-[var(--success)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">Por</span>
              </div>
              <p className="mt-2 text-[15px] font-semibold text-[var(--navy)]">“{p.right}”</p>
            </div>
          ))}
        </div>
        <blockquote className="mt-6 rounded-2xl border-l-4 border-[var(--brand)] bg-[var(--brand)]/5 p-5 text-[var(--navy)]">
          <p className="font-semibold leading-relaxed">
            “O problema normalmente não é falta de contatos. É falta de condução.”
          </p>
        </blockquote>
      </div>
    </section>
  );
}

/* MÓDULO 2. MAPA MENTAL */
function MapaMentalSection() {
  const flow = [
    "Valor percebido", "Cliente verbaliza aprendizado", "Objetivos", "Família", "Amigos",
    "Trabalho", "Nichos", "Subida de Nicho", "Subida de Renda", "Top 10 Recomendações", "Priorização",
  ];
  return (
    <section id="mapa-mental" className="scroll-mt-32">
      <BonusHeader
        eyebrow="Visão macro"
        title="Mapa mental da recomendação"
        hook="Não tente encontrar recomendações diretamente. Conduza o cliente por este caminho, as recomendações surgirão naturalmente."
        icon={<Layers className="h-5 w-5" />}
      />
      <div className="rounded-3xl border border-border bg-white p-5 sm:p-7">
        <ol className="flex flex-col items-center gap-2">
          {flow.map((step, i) => (
            <li key={step} className="w-full max-w-md">
              <div
                className="flex items-center gap-3 rounded-xl border px-4 py-3 transition"
                style={{
                  borderColor: i === flow.length - 1 ? "var(--success)" : "var(--brand)",
                  background: i === flow.length - 1
                    ? "color-mix(in oklab, var(--success) 10%, white)"
                    : "color-mix(in oklab, var(--brand) 6%, white)",
                }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                  style={{ background: i === flow.length - 1 ? "var(--success)" : "var(--brand)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--navy)]">{step}</span>
              </div>
              {i < flow.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-[var(--brand)]/60" aria-hidden />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* MÓDULO 3. ESCADA DE PROFUNDIDADE */
function EscadaProfundidadeSection() {
  const levels = [
    "Quem você conhece que é empresário?",
    "Quais são os 3 empresários mais próximos de você?",
    "Desses 3, qual mais conversa sobre dinheiro?",
    "Qual deles mais te pede opinião?",
    "Qual deles mais se beneficiaria de uma conversa como essa?",
  ];
  return (
    <section id="escada" className="scroll-mt-32">
      <BonusHeader
        eyebrow="Aprofundamento"
        title="Escada de profundidade"
        hook="Nunca pare na primeira resposta."
        icon={<ArrowUp className="h-5 w-5" />}
        accent="var(--success)"
      />
      <div className="grid gap-3 md:grid-cols-5">
        {levels.map((q, i) => (
          <article
            key={i}
            className="rounded-2xl border-2 p-4 transition hover:-translate-y-0.5"
            style={{
              borderColor: `color-mix(in oklab, var(--brand) ${20 + i * 15}%, transparent)`,
              background: `color-mix(in oklab, var(--brand) ${3 + i * 2}%, white)`,
            }}
          >
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--brand)]">Nível {i + 1}</p>
            <p className="mt-2 text-[13.5px] font-semibold text-[var(--navy)] leading-snug">“{q}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* MÓDULO 4. PERGUNTA DE RESGATE */
function PerguntaResgateSection() {
  const [open, setOpen] = useState(false);
  const examples = [
    "Se você fosse organizar um churrasco no próximo sábado, quem seriam os primeiros convidados?",
    "Quem são as pessoas que mais aparecem no seu WhatsApp?",
    "Quem são as pessoas que você encontraria se fosse fazer uma viagem amanhã?",
    "Quem você ligaria agora se precisasse de ajuda?",
  ];
  return (
    <div className="mt-5 rounded-2xl border-2 border-[var(--warn)]/40 bg-[var(--warn)]/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-5 w-5 text-[var(--warn)]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--warn)]">Se o cliente travar</p>
            <p className="text-sm font-semibold text-[var(--navy)]">Pergunta de resgate, desbloquear memória</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[var(--navy)]/60">{open ? "Fechar −" : "Ver +"}</span>
      </button>
      {open && (
        <div className="border-t border-[var(--warn)]/30 bg-white px-5 py-4">
          <ul className="grid gap-2 sm:grid-cols-2">
            {examples.map((e) => (
              <li key={e} className="rounded-xl border border-border bg-[var(--surface)] px-3 py-2.5 text-[13.5px] text-[var(--navy)]">
                “{e}”
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* MÓDULO 5. MODO ELITE / APROFUNDAMENTO */
function ModoEliteSection() {
  const questions = [
    "Quantos anos ele tem?",
    "É casado?",
    "Tem filhos?",
    "Qual imóvel?",
    "Já está guardando dinheiro?",
    "Quanto tempo pretende esperar?",
  ];
  return (
    <section id="modo-elite" className="scroll-mt-32">
      <BonusHeader
        eyebrow="Modo Elite"
        title="Aprofundamento"
        hook="Toda recomendação superficial gera baixa conversão."
        icon={<Microscope className="h-5 w-5" />}
        accent="#c9a84c"
      />
      <div className="rounded-3xl border-2 border-[#c9a84c]/40 bg-gradient-to-br from-white to-[#c9a84c]/10 p-6">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">Cliente diz</p>
          <p className="mt-2 text-[15px] font-semibold text-[var(--navy)]">“Meu irmão quer comprar um imóvel.”</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--danger)]">Planejador comum</p>
            <p className="mt-2 text-sm font-semibold text-[var(--navy)]">Segue em frente.</p>
          </div>
          <div className="rounded-2xl border border-[var(--success)]/40 bg-[var(--success)]/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">Planejador elite, aprofunda</p>
            <ul className="mt-2 grid gap-1.5">
              {questions.map((q) => (
                <li key={q} className="text-[13.5px] text-[var(--navy)] flex gap-2">
                  <span className="text-[var(--success)]">→</span> {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* MÓDULO 6. SUBIDA DE NICHO INTELIGENTE */
function SubidaNichoInteligenteSection() {
  const levels = [
    { tier: "Básico",       items: ["Amigos", "Colegas", "Familiares"], color: "var(--brand)" },
    { tier: "Intermediário", items: ["Profissionais liberais", "Coordenadores", "Gerentes"], color: "var(--warn)" },
    { tier: "Avançado",     items: ["Empresários", "Médicos", "Dentistas", "Advogados"], color: "var(--success)" },
    { tier: "Premium",      items: ["Sócios", "Executivos", "Investidores", "Produtores rurais", "Donos de empresas"], color: "#c9a84c" },
  ];
  return (
    <div className="mt-6 rounded-3xl border border-border bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 text-[var(--brand)]" />
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">Subida de nicho inteligente</p>
      </div>
      <h3 className="mt-1 text-lg font-bold text-[var(--navy)]">Aumente a qualidade média da rede indicada</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {levels.map((l, i) => (
          <div key={l.tier} className="relative">
            <div
              className="rounded-2xl border-2 p-4 h-full"
              style={{ borderColor: l.color, background: `color-mix(in oklab, ${l.color} 6%, white)` }}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: l.color }}>
                Nível {i + 1} · {l.tier}
              </p>
              <ul className="mt-3 space-y-1.5">
                {l.items.map((it) => (
                  <li key={it} className="text-[13px] font-semibold text-[var(--navy)]">• {it}</li>
                ))}
              </ul>
            </div>
            {i < levels.length - 1 && (
              <ArrowDown className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand)]/40 rotate-[-90deg]" aria-hidden />
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-[var(--navy)]/80 italic">
        “O objetivo não é apenas gerar quantidade. É aumentar a qualidade média da rede indicada.”
      </p>
    </div>
  );
}

/* MÓDULO 7. RADAR DE OPORTUNIDADES */
function RadarOportunidadesSection() {
  const keywords = [
    { w: "Sócio", e: "🤝" }, { w: "Empresa", e: "🏢" }, { w: "Funcionário", e: "👥" },
    { w: "Médico", e: "🩺" }, { w: "Dentista", e: "🦷" }, { w: "Investimento", e: "📈" },
    { w: "Imóvel", e: "🏠" }, { w: "Herança", e: "💰" }, { w: "Aposentadoria", e: "🌅" },
    { w: "Filhos", e: "👶" }, { w: "Sociedade", e: "🧩" }, { w: "Clínica", e: "🏥" },
    { w: "Construtora", e: "🏗️" }, { w: "Patrimônio", e: "💎" },
  ];
  return (
    <Module id="mod-6" n={6} title="Radar de oportunidades" hook="O cliente entrega recomendações sem perceber, você precisa estar ouvindo.">
      <p className="text-[15px] leading-relaxed text-[var(--navy)]">
        Durante a reunião, fique atento às palavras-chave abaixo. Cada uma delas é uma porta aberta
        para aprofundar e descobrir mais um nome qualificado.
      </p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {keywords.map((k) => (
          <div key={k.w} className="rounded-xl border border-[var(--brand)]/20 bg-gradient-to-br from-white to-[var(--brand)]/5 px-3 py-2.5 flex items-center gap-2">
            <span className="text-xl" aria-hidden>{k.e}</span>
            <span className="text-sm font-semibold text-[var(--navy)]">{k.w}</span>
          </div>
        ))}
      </div>
      <TrainingNote label="Regra de ouro">
        <div className="flex items-start gap-2">
          <Radar className="h-4 w-4 text-[var(--brand)] mt-0.5" />
          <span>Quando ouvir qualquer uma dessas palavras, <strong>aprofunde imediatamente</strong>.</span>
        </div>
      </TrainingNote>
    </Module>
  );
}

/* MÓDULO 8. PSICOLOGIA */
function PsicologiaSection() {
  const naoIndica = ["Não lembrar.", "Ter medo de incomodar.", "Não enxergar quem poderia se beneficiar.", "Não ter percebido valor suficiente."];
  const indica   = ["Perceber transformação.", "Sentir confiança.", "Entender quem pode ser ajudado.", "Querer compartilhar algo positivo."];
  return (
    <Module id="mod-7" n={7} title="Psicologia da recomendação" hook="Recomendações são construídas durante toda a reunião, não no final.">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-[var(--danger)]/30 bg-[var(--danger)]/5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--danger)]">Cliente NÃO indica por</p>
          <ul className="mt-3 space-y-2">
            {naoIndica.map((r) => (
              <li key={r} className="text-sm text-[var(--navy)] flex gap-2">
                <span className="text-[var(--danger)]">✗</span> {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-[var(--success)]/40 bg-[var(--success)]/10 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--success)]">Cliente indica por</p>
          <ul className="mt-3 space-y-2">
            {indica.map((r) => (
              <li key={r} className="text-sm text-[var(--navy)] flex gap-2">
                <span className="text-[var(--success)]">✓</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <TrainingNote label="Princípio">
        “Recomendações não são conquistadas no final da reunião. Elas são construídas durante toda a reunião.”
      </TrainingNote>
    </Module>
  );
}

/* MÓDULO 9. TOP 1% */
function Top1Section() {
  const comum = ["Pede recomendação.", "Aceita o primeiro não.", "Pega 1 nome.", "Não qualifica.", "Segue para o encerramento."];
  const elite = ["Constrói valor.", "Conduz memória.", "Explora nichos.", "Aprofunda.", "Qualifica.", "Prioriza.", "Sai com 10+ nomes."];
  return (
    <Module id="mod-8" n={8} title="O que faz os Top 1%" hook="A diferença não está na quantidade de reuniões. Está na profundidade.">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-[var(--surface)] p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Planejador comum</p>
          </div>
          <ul className="mt-3 space-y-2">
            {comum.map((r) => (
              <li key={r} className="text-sm text-[var(--navy)]/70 flex gap-2">
                <span>·</span> {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-[#c9a84c] bg-gradient-to-br from-white to-[#c9a84c]/10 p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#c9a84c]" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#c9a84c]">Planejador elite</p>
          </div>
          <ul className="mt-3 space-y-2">
            {elite.map((r) => (
              <li key={r} className="text-sm font-semibold text-[var(--navy)] flex gap-2">
                <span className="text-[#c9a84c]">★</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <blockquote className="mt-5 rounded-2xl border-l-4 border-[var(--brand)] bg-[var(--brand)]/5 p-5 text-[var(--navy)]">
        <p className="font-semibold leading-relaxed">
          “A diferença entre um planejador comum e um planejador de elite não está na quantidade de reuniões que faz.
          Está na profundidade com que conduz cada reunião.”
        </p>
      </blockquote>
    </Module>
  );
}

/* MÓDULO 10. ANATOMIA DE UMA RECOMENDAÇÃO ELITE */
function AnatomiaSection() {
  const fraca = ["João", "Empresário", "Telefone"];
  const elite = [
    "João Silva",
    "42 anos",
    "Casado",
    "2 filhos",
    "Empresário",
    "Dono de construtora",
    "Cliente há 10 anos",
    "Quer vender a empresa em 8 anos",
    "Preocupação com aposentadoria",
    "Cliente acredita que ele precisa de ajuda financeira",
  ];
  return (
    <section id="anatomia" className="scroll-mt-32">
      <BonusHeader
        eyebrow="Antes da coleta"
        title="Anatomia de uma recomendação elite"
        hook="Quanto mais informações, maior a chance de conexão, agendamento e fechamento."
        icon={<FileSearch className="h-5 w-5" />}
        accent="#c9a84c"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border-2 border-[var(--danger)]/30 bg-[var(--danger)]/5 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--danger)]">❌ Recomendação fraca</p>
          <ul className="mt-3 space-y-2">
            {fraca.map((f) => (
              <li key={f} className="text-sm text-[var(--navy)]/80">· {f}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground italic">3 campos · pouca conversão.</p>
        </article>
        <article className="rounded-3xl border-2 border-[#c9a84c] bg-gradient-to-br from-white to-[#c9a84c]/10 p-5 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#c9a84c]">✅ Recomendação elite</p>
          <ul className="mt-3 space-y-2">
            {elite.map((f) => (
              <li key={f} className="text-sm font-semibold text-[var(--navy)] flex gap-2">
                <span className="text-[#c9a84c]">◆</span> {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold text-[var(--navy)]/70 italic">
            10 campos · perfil completo · alto índice de fechamento.
          </p>
        </article>
      </div>
    </section>
  );
}

/* MÓDULO 11. MANDAMENTOS */
function MandamentosSection() {
  const mandamentos = [
    "Nunca pergunte “Quem você conhece?”",
    "Sempre peça pelo menos 3 nomes.",
    "Nunca aceite o primeiro “não lembro”.",
    "Conduza por nichos.",
    "Conduza por objetivos.",
    "Suba o nível da rede.",
    "Aprofunde cada indicação.",
    "Priorize antes de encerrar.",
    "Não peça favor.",
    "Conduza oportunidade.",
  ];
  return (
    <section id="mandamentos" className="scroll-mt-32">
      <BonusHeader
        eyebrow="Encerramento"
        title="Mandamentos da recomendação elite"
        hook="Cole isto no espelho antes de cada reunião."
        icon={<ScrollText className="h-5 w-5" />}
        accent="var(--success)"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {mandamentos.map((m, i) => (
          <article
            key={m}
            className="rounded-2xl border-2 border-[var(--success)]/30 bg-gradient-to-br from-white to-[var(--success)]/5 p-4 flex items-start gap-3 transition hover:-translate-y-0.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--success)] text-[var(--navy)] text-xs font-extrabold shadow-md">
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-[var(--navy)] leading-snug">{m}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-[var(--success)]" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Mantra final</p>
        </div>
        <p className="mt-3 text-lg sm:text-xl font-bold leading-snug">
          “Seu objetivo não é sair da reunião com indicações.
          Seu objetivo é sair da reunião com um <span className="text-[var(--success)]">mapa completo</span> da rede de relacionamentos do cliente.”
        </p>
      </div>
    </section>
  );
}
