import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, ClipboardCopy, Check, Search, Target, Users, Briefcase,
  Sparkles, GraduationCap, ShieldCheck, Trophy, Flame, AlertTriangle,
  Quote, ChevronDown, Home as HomeIcon, Headphones, ListOrdered,
} from "lucide-react";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Bull Team | Passo a Passo de Recomendações" },
      { name: "description", content: "Treinamento consultivo para gerar 10 recomendações qualificadas por reunião — possíveis clientes, planejadores e subida de nicho." },
      { property: "og:title", content: "Bull Team | Passo a Passo de Recomendações" },
      { property: "og:description", content: "Conduza a recomendação como oportunidade. Não como favor." },
    ],
  }),
  component: Recomendacoes,
});

const METRICS = [
  { label: "Meta por reunião", value: "10 REC" },
  { label: "Mínimo aceitável", value: "5 REC" },
  { label: "Ideal", value: "3 PN + 7 Clientes" },
  { label: "Foco", value: "Qualidade · Nicho · Proximidade" },
];

const PN_CATEGORIES: { label: string; question: string }[] = [
  { label: "Pessoa comunicativa", question: "Quem você conhece que é muito comunicativo, aquele tipo que conhece todo mundo, organiza o churrasco, lidera o grupo e naturalmente influencia os outros?" },
  { label: "Pessoa empreendedora", question: "Quem você conhece que vive pensando em negócio, renda extra, vendas, empresa ou crescimento?" },
  { label: "Já trabalha no mercado financeiro", question: "Quem você conhece que trabalha em banco, seguradora, consórcio, investimentos, contabilidade ou algo ligado ao mercado financeiro?" },
  { label: "Bancário", question: "Quem você conhece que trabalha em banco e já demonstrou inconformismo com a rotina ou com a remuneração?" },
  { label: "Corretor de seguros", question: "Quem você conhece que é corretor de seguros e poderia expandir o portfólio com planejamento financeiro?" },
  { label: "Vendedor de consórcio", question: "Quem você conhece que trabalha com consórcio e tem perfil consultivo?" },
  { label: "Assessor de investimentos", question: "Quem você conhece que é assessor de investimentos e busca crescimento de carreira?" },
  { label: "Contador", question: "Quem você conhece que é contador e poderia agregar planejamento ao trabalho atual?" },
  { label: "Buscando transição de carreira", question: "Quem você conhece que está insatisfeito profissionalmente e poderia estar buscando um desafio maior?" },
  { label: "Ambiciosa e inconformada", question: "Quem você conhece que é ambicioso e não se contenta com a vida atual?" },
];

const GOAL_CARDS = [
  { emoji: "🏠", title: "Sair do aluguel", question: "Quem você conhece que quer sair do aluguel ou comprar o primeiro imóvel?" },
  { emoji: "🚗", title: "Trocar de carro", question: "Quem você conhece que quer trocar de carro, compra carro com frequência ou paga juros altos sem perceber?" },
  { emoji: "🌅", title: "Aposentadoria", question: "Quem você conhece que não quer depender do INSS no futuro?" },
  { emoji: "👶", title: "Filhos", question: "Quem você conhece que tem filhos e se preocupa em dar uma vida melhor para eles?" },
  { emoji: "✈️", title: "Viagens", question: "Quem você conhece que ama viajar e gostaria de viajar mais sem comprometer a vida financeira?" },
  { emoji: "📈", title: "Investimentos", question: "Quem você conhece que ganha bem, mas sente que poderia investir melhor?" },
  { emoji: "💍", title: "Casamento", question: "Quem você conhece que vai casar, acabou de casar ou está começando uma nova fase de vida?" },
];

const NICHE_CARDS = [
  { emoji: "👨‍👩‍👧", label: "Família" },
  { emoji: "💼", label: "Trabalho" },
  { emoji: "🎓", label: "Faculdade" },
  { emoji: "🏋️", label: "Academia / Crossfit" },
  { emoji: "⛪", label: "Igreja" },
  { emoji: "🌍", label: "Grupos de viagem" },
  { emoji: "🤝", label: "Amigos próximos" },
  { emoji: "⚽", label: "Esportes" },
  { emoji: "🏢", label: "Empresários" },
  { emoji: "🧑‍⚖️", label: "Profissionais liberais" },
  { emoji: "🩺", label: "Área da saúde" },
  { emoji: "💎", label: "Pessoas de alta renda" },
];

const NICHE_QUESTIONS = [
  "Com quem você mais conversa no trabalho?",
  "Quem são as pessoas da sua família que mais confiam em você?",
  "Quem são os amigos que você gostaria que também tivessem esse tipo de orientação?",
  "Quem está no seu grupo de academia, esporte, igreja ou viagem?",
  "Quem é aquela pessoa que ganha bem, mas você percebe que talvez não organize tão bem o dinheiro?",
];

const HEALTH_PROFS = ["Médico", "Dentista", "Nutricionista", "Fisioterapeuta", "Enfermeiro", "Personal trainer", "Psicólogo", "Veterinário"];
const DOCTOR_SPECIALTIES = ["Cardiologista", "Pediatra", "Nutrólogo", "Ginecologista", "Endocrinologista", "Ortopedista", "Médico da família"];

const PROF_BRIDGES = [
  { emoji: "🛠️", title: "Engenheiro", script: "Fulano, você como engenheiro conhece bem a realidade da área. Quem você conhece que também é engenheiro e gostaria de pagar menos imposto, investir melhor ou organizar melhor o patrimônio?" },
  { emoji: "🏘️", title: "Corretor de imóveis", script: "Tenho clientes corretores que vivem aquela realidade de um mês muito forte e outro mais fraco. Com planejamento, conseguimos organizar reserva e futuro. Quem você conhece que também é corretor?" },
  { emoji: "🩺", title: "Médico", script: "Você conhece bem a rotina da medicina. Quem você conhece que ganha bem, trabalha muito, mas talvez ainda não tenha uma estratégia financeira à altura da renda?" },
];

const OBJECTIONS = [
  { o: "Não estou lembrando de ninguém agora.", a: "Normal, não precisa vir todo mundo de uma vez. Vamos por partes: primeiro família, depois trabalho, depois amigos próximos." },
  { o: "Essa pessoa já está bem financeiramente.", a: "Perfeito. E justamente por estar bem, talvez ela tenha ainda mais a proteger e potencializar. Se uma pessoa milionária pudesse estruturar melhor o patrimônio e acelerar resultados, faria sentido ela ouvir?" },
  { o: "Não sei se a pessoa vai querer.", a: "Sem problema. A decisão é dela. O seu papel é só abrir a oportunidade, assim como alguém abriu para você." },
  { o: "Depois eu te mando.", a: "Combinado, mas para não ficar solto, vamos deixar pelo menos alguns nomes mapeados agora. Depois você complementa." },
];

const QUALIFY_FIELDS = [
  "Nome", "Telefone", "Profissão", "Idade aproximada", "Estado civil",
  "Tem filhos?", "Renda estimada / padrão de vida", "Relação com o cliente",
  "Por que lembrou dessa pessoa?", "Possível dor ou objetivo",
  "Prioridade (alta / média / baixa)", "Melhor forma de abordagem",
  "Cliente autoriza mencionar o nome dele?",
];

const COUNTER_TIERS = [
  { range: "0–2", label: "Fraco", color: "var(--danger)" },
  { range: "3–5", label: "Aceitável", color: "var(--warn)" },
  { range: "6–9", label: "Forte", color: "var(--brand)" },
  { range: "10+", label: "Padrão ideal", color: "var(--success)" },
];

const FULL_SCRIPT = `[ABERTURA]
Fulano, agora vamos para a quarta parte da nossa reunião. Esse é um momento muito importante, porque é onde eu consigo entender quem são as pessoas próximas a você que também poderiam se beneficiar de um trabalho como esse.

[REC PN — POSSÍVEIS PLANEJADORES]
Autoridade: O brasileiro enfrenta muitos desafios quando o assunto é planejamento financeiro. Não é à toa que nossa profissão está entre as que mais crescem no país. Hoje já somos mais de 170 consultores e seguimos expandindo, buscando pessoas com perfil certo para fazer parte desse crescimento.

Desenvolvimento: Mais do que conhecimento técnico, valorizamos perfil, vontade de crescer, comunicação e ambição. Temos um processo robusto de capacitação, com mais de 300 horas de aprendizado entre teoria e prática.

Aprovação social: E uma coisa interessante é que muitos dos melhores perfis que chegam até nós vêm por indicação dos próprios clientes, justamente porque eles conheceram o trabalho, entenderam a seriedade do processo e conseguem enxergar pessoas próximas que teriam fit com a nossa cultura.

[REC CLIENTE]
Fulano, antes de eu te perguntar nomes, deixa eu te perguntar uma coisa: o que mudou no Fulano que começou essa reunião para o Fulano de agora?

(escutar — fazer o cliente vender o trabalho para ele mesmo)

Perfeito. Então assim como você teve a oportunidade de entender isso, existem pessoas próximas a você que também precisariam passar por essa virada de chave.

Das pessoas à sua volta, quem você conhece que também tem objetivos parecidos com os seus e poderia se beneficiar de um planejamento financeiro?

[PRIORIDADE]
Fulano, dessas pessoas que você trouxe, quais você acredita que eu deveria priorizar primeiro?

[FINALIZAÇÃO]
Excelente. Você não só está me ajudando, você está dando a essas pessoas a chance de ter acesso a algo que fez sentido para você hoje. Obrigado pela confiança.`;

function Recomendacoes() {
  const [trainingMode, setTrainingMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profQuery, setProfQuery] = useState("");
  const [pnChecked, setPnChecked] = useState<Set<string>>(new Set());
  const [nicheChecked, setNicheChecked] = useState<Set<string>>(new Set());
  const [openObj, setOpenObj] = useState<number | null>(0);
  const [meetings, setMeetings] = useState(8);
  const [recPerMeeting, setRecPerMeeting] = useState(10);

  const filteredPN = useMemo(() => {
    const q = profQuery.trim().toLowerCase();
    if (!q) return PN_CATEGORIES;
    return PN_CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(q) || c.question.toLowerCase().includes(q)
    );
  }, [profQuery]);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              {trainingMode ? "Modo Treinamento ativo" : "Passo a passo · pronto para a reunião"}
            </span>
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Passo a Passo para Gerar <span className="text-[var(--success)]">10 Recomendações</span> por Reunião
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed">
            “A recomendação não é um pedido de favor. É a consequência natural de uma reunião bem conduzida, onde o cliente percebe valor, autoridade e entende que outras pessoas também precisam ter acesso ao planejamento financeiro.”
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {METRICS.map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{m.label}</p>
                <p className="mt-2 text-xl sm:text-2xl font-extrabold text-white">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={profQuery}
              onChange={(e) => setProfQuery(e.target.value)}
              placeholder="Buscar por profissão ou nicho (ex: médico, empresário)"
              className="w-full min-h-11 rounded-xl border border-border bg-white pl-9 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>
          <button
            type="button"
            onClick={copyScript}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 min-h-11 text-xs sm:text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)] transition"
          >
            {copied ? <Check className="h-4 w-4 text-[var(--success)]" /> : <ClipboardCopy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar script completo"}</span>
          </button>
          <div role="tablist" className="shrink-0 inline-flex items-center rounded-xl border border-border bg-[var(--surface)] p-1">
            <button
              role="tab"
              aria-selected={!trainingMode}
              onClick={() => setTrainingMode(false)}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition ${
                !trainingMode ? "bg-[var(--success)] text-[var(--navy)] shadow-sm" : "text-muted-foreground hover:text-[var(--navy)]"
              }`}
            >
              <Headphones className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Modo Reunião</span>
            </button>
            <button
              role="tab"
              aria-selected={trainingMode}
              onClick={() => setTrainingMode(true)}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition ${
                trainingMode ? "bg-[var(--brand)] text-white shadow-sm" : "text-muted-foreground hover:text-[var(--navy)]"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Modo Treinamento</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
        <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)] shadow-lg shadow-[var(--success)]/30">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Regra de ouro</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Não peça favor. Conduza oportunidade.</h2>
              <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
                O planejador que pede recomendação se posiciona como vendedor. O planejador que conduz recomendação se posiciona como consultor.
                A diferença está no tom: energia, convicção e autoridade.
              </p>
            </div>
          </div>
        </section>

        <Section eyebrow="Passo 1" icon={<Sparkles className="h-5 w-5" />} title="Antes de pedir recomendação, aumente a energia" subtitle="O planejador precisa mudar o tom da reunião nesse momento. A recomendação deve ter energia, convicção e autoridade.">
          <ScriptCard quote='Fulano, agora vamos para a quarta parte da nossa reunião. Esse é um momento muito importante, porque é onde eu consigo entender quem são as pessoas próximas a você que também poderiam se beneficiar de um trabalho como esse.' />
          <Alert>Não peça recomendação como quem está incomodando. Conduza como quem está abrindo uma oportunidade.</Alert>
          {trainingMode && (
            <TrainingNote>A mudança de energia sinaliza para o cliente que entramos em uma fase importante da reunião. Sem essa transição, o cliente percebe a recomendação como apêndice — e responde no automático.</TrainingNote>
          )}
        </Section>

        <Section eyebrow="Passo 2 · REC PN" icon={<Briefcase className="h-5 w-5" />} title="Recomendação de possíveis planejadores" subtitle="Encontrar pessoas com perfil comercial, comunicativo, empreendedor ou com interesse no mercado financeiro.">
          <div className="grid gap-3 md:grid-cols-3">
            <ScriptCard label="Autoridade" quote='O brasileiro enfrenta muitos desafios quando o assunto é planejamento financeiro. Não é à toa que nossa profissão está entre as que mais crescem no país. Hoje já somos mais de 170 consultores e seguimos expandindo, buscando pessoas com perfil certo para fazer parte desse crescimento.' />
            <ScriptCard label="Desenvolvimento" quote='Mais do que conhecimento técnico, valorizamos perfil, vontade de crescer, comunicação e ambição. Temos um processo robusto de capacitação, com mais de 300 horas de aprendizado entre teoria e prática.' />
            <ScriptCard label="Aprovação social" quote='E uma coisa interessante é que muitos dos melhores perfis que chegam até nós vêm por indicação dos próprios clientes, justamente porque eles conheceram o trabalho, entenderam a seriedade do processo e conseguem enxergar pessoas próximas que teriam fit com a nossa cultura.' />
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[var(--navy)]">Checklist de perfis PN</h3>
              <span className="text-xs font-semibold text-muted-foreground">
                {pnChecked.size} marcados · meta: pelo menos 3 bons nomes
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Buscar de 2 a 3 nomes por categoria até chegar em pelo menos 3 bons nomes de PN.</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {filteredPN.map((c) => {
                const checked = pnChecked.has(c.label);
                return (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={() => toggle(pnChecked, setPnChecked, c.label)}
                      className={`w-full text-left rounded-xl border p-3 transition ${
                        checked ? "border-[var(--success)] bg-[var(--success)]/10" : "border-border bg-white hover:border-[var(--brand)]/40"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checked ? "bg-[var(--success)] border-[var(--success)] text-white" : "border-border bg-white"}`}>
                          {checked && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[var(--navy)]">{c.label}</p>
                          <p className="mt-1 text-[13px] text-muted-foreground leading-snug">{c.question}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            {filteredPN.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">Nenhuma categoria encontrada para “{profQuery}”.</p>
            )}
          </div>
        </Section>

        <Section eyebrow="Passo 3 · REC Cliente" icon={<Users className="h-5 w-5" />} title="Recomendação de possíveis clientes" subtitle="Fazer o cliente reviver o valor da reunião antes de indicar.">
          <div className="grid gap-3 md:grid-cols-2">
            <ScriptCard label="Abertura" quote='Fulano, antes de eu te perguntar nomes, deixa eu te perguntar uma coisa: o que mudou no Fulano que começou essa reunião para o Fulano de agora?' />
            <ScriptCard label="Resposta após escutar" quote='Perfeito. Então assim como você teve a oportunidade de entender isso, existem pessoas próximas a você que também precisariam passar por essa virada de chave.' />
          </div>
          <div className="mt-4 rounded-2xl border-2 border-[var(--brand)]/40 bg-[var(--brand)]/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Pergunta principal</p>
            <p className="mt-2 text-base sm:text-lg font-semibold text-[var(--navy)]">
              “Das pessoas à sua volta, quem você conhece que também tem objetivos parecidos com os seus e poderia se beneficiar de um planejamento financeiro?”
            </p>
          </div>
          {trainingMode && (
            <TrainingNote>A pergunta sobre “o que mudou” faz o cliente vender o trabalho para ele mesmo. Quem verbaliza valor em voz alta, indica com convicção.</TrainingNote>
          )}
        </Section>

        <Section eyebrow="Passo 4" icon={<Target className="h-5 w-5" />} title="Buscar recomendações pelos objetivos falados na reunião" subtitle="Use os objetivos que o próprio cliente compartilhou para abrir gavetas mentais.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GOAL_CARDS.map((g) => (
              <article key={g.title} className="rounded-2xl border border-border bg-white p-4 hover:border-[var(--brand)]/40 transition">
                <div className="flex items-start gap-3">
                  <span aria-hidden className="text-2xl">{g.emoji}</span>
                  <div>
                    <p className="font-bold text-[var(--navy)]">{g.title}</p>
                    <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-snug">{g.question}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow="Passo 5" icon={<ListOrdered className="h-5 w-5" />} title="Mapa de nichos para não deixar o cliente pensar no vazio" subtitle='O erro do planejador é perguntar “quem você conhece?” de forma aberta. O cliente trava. A condução certa é abrir gavetas mentais.'>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {NICHE_CARDS.map((n) => {
              const checked = nicheChecked.has(n.label);
              return (
                <button
                  key={n.label}
                  type="button"
                  onClick={() => toggle(nicheChecked, setNicheChecked, n.label)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition ${
                    checked ? "border-[var(--brand)] bg-[var(--brand)]/10" : "border-border bg-white hover:border-[var(--brand)]/40"
                  }`}
                >
                  <span aria-hidden className="text-xl">{n.emoji}</span>
                  <span className="text-sm font-semibold text-[var(--navy)]">{n.label}</span>
                  {checked && <Check className="ml-auto h-4 w-4 text-[var(--brand)]" />}
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Perguntas de abertura</p>
            <ul className="mt-3 space-y-2">
              {NICHE_QUESTIONS.map((q) => (
                <li key={q} className="flex items-start gap-2 text-[14.5px] text-[var(--navy)]">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section eyebrow="Passo 6" icon={<Trophy className="h-5 w-5" />} title="Subida de nicho: como chegar em clientes melhores" subtitle="Buscar pessoas com maior renda, maior dor financeira e maior potencial de fechamento.">
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-base font-bold text-[var(--navy)]">🩺 Área da saúde</h3>
              <ScriptCard className="mt-3" quote='Tenho muitos clientes da área da saúde que trabalham muito, ganham bem, mas nem sempre têm tempo ou segurança para organizar a vida financeira. Quem você conhece que é médico, dentista, nutricionista, fisioterapeuta, enfermeiro ou personal?' />
              <div className="mt-4 flex flex-wrap gap-1.5">
                {HEALTH_PROFS.map((p) => (
                  <span key={p} className="rounded-full border border-border bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--navy)]">{p}</span>
                ))}
              </div>
              <h4 className="mt-6 text-sm font-bold text-[var(--navy)]">Subida para médicos</h4>
              <ScriptCard className="mt-2" quote='Dentro da saúde, muitos clientes médicos têm renda alta, mas sem planejamento acabam dependendo do teto do INSS no futuro. Quem você conhece que é médico?' />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {DOCTOR_SPECIALTIES.map((p) => (
                  <span key={p} className="rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]">{p}</span>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-base font-bold text-[var(--navy)]">🏢 Empresários</h3>
              <ScriptCard className="mt-3" quote='Também consigo ajudar muito empresários, porque muitos têm dificuldade em separar pessoa física e pessoa jurídica, organizar caixa, proteger patrimônio e investir melhor. Quem você conhece que é empresário?' />
              <div className="mt-4 rounded-xl border border-[var(--warn)]/40 bg-[var(--warn)]/10 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a00]">Pergunta de aprofundamento</p>
                <p className="mt-1 text-sm font-semibold text-[var(--navy)]">
                  “Dos empresários que você conhece, quem você diria que ganha bem, mas vive com a vida financeira mais bagunçada do que deveria?”
                </p>
              </div>
            </article>
          </div>
        </Section>

        <Section eyebrow="Passo 7" icon={<Quote className="h-5 w-5" />} title="Use a profissão do cliente para puxar semelhantes" subtitle="Quando o cliente pertence a um nicho, use a própria profissão dele como ponte.">
          <div className="grid gap-3 md:grid-cols-3">
            {PROF_BRIDGES.map((b) => (
              <article key={b.title} className="rounded-2xl border border-border bg-white p-5">
                <p className="text-2xl" aria-hidden>{b.emoji}</p>
                <h3 className="mt-2 font-bold text-[var(--navy)]">{b.title}</h3>
                <p className="mt-2 text-[14px] leading-snug text-[var(--navy)]">“{b.script}”</p>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow="Passo 8" icon={<ShieldCheck className="h-5 w-5" />} title="Como destravar quando o cliente diz que não conhece ninguém" subtitle="Cada objeção tem uma virada. Conduza, não confronte.">
          <ul className="space-y-2.5">
            {OBJECTIONS.map((o, i) => {
              const open = openObj === i;
              return (
                <li key={o.o}>
                  <button
                    type="button"
                    onClick={() => setOpenObj(open ? null : i)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      open ? "border-[var(--brand)] bg-[var(--brand)]/5" : "border-border bg-white hover:border-[var(--brand)]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[var(--navy)]">“{o.o}”</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
                    </div>
                    {open && (
                      <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--navy)]">
                        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Resposta:</span>
                        {o.a}
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section eyebrow="Passo 9" icon={<ShieldCheck className="h-5 w-5" />} title="Não basta pegar nome. Precisa qualificar." subtitle="Checklist de qualificação para cada recomendação.">
          <div className="rounded-2xl border border-border bg-white p-5">
            <ul className="grid gap-2 sm:grid-cols-2">
              {QUALIFY_FIELDS.map((f, i) => (
                <li key={f} className="flex items-start gap-2 rounded-xl border border-border bg-[var(--surface)] px-3 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--brand)] text-[10px] font-extrabold text-white">{i + 1}</span>
                  <span className="text-sm font-medium text-[var(--navy)]">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section eyebrow="Passo 10" icon={<Flame className="h-5 w-5" />} title="Prioridade de abordagem" subtitle="Decida com o cliente quem entra primeiro na fila.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--danger)]/40 bg-[var(--danger)]/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">Prioridade alta</p>
              <p className="mt-2 text-base font-bold text-[var(--navy)]">Abordar em até 2 dias</p>
            </div>
            <div className="rounded-2xl border border-[var(--warn)]/40 bg-[var(--warn)]/10 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a00]">Demais</p>
              <p className="mt-2 text-base font-bold text-[var(--navy)]">Abordar em até 4 dias</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ScriptCard label="Pergunta de priorização" quote='Fulano, dessas pessoas que você trouxe, quais você acredita que eu deveria priorizar primeiro?' />
            <ScriptCard label="Finalização" quote='Excelente. Você não só está me ajudando, você está dando a essas pessoas a chance de ter acesso a algo que fez sentido para você hoje. Obrigado pela confiança.' />
          </div>
        </Section>

        <Section eyebrow="Meta da reunião" icon={<Trophy className="h-5 w-5" />} title="Quantas recomendações você conduziu hoje?" subtitle="Pense em padrão, não em sorte.">
          <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
            {COUNTER_TIERS.map((t) => (
              <div key={t.range} className="rounded-2xl border-2 p-4" style={{ borderColor: t.color, background: `color-mix(in oklab, ${t.color} 8%, white)` }}>
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
                <input type="range" min={1} max={30} value={meetings} onChange={(e) => setMeetings(Number(e.target.value))} className="mt-2 w-full accent-[var(--success)]" />
                <span className="mt-1 block text-2xl font-extrabold">{meetings}</span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/70">REC por reunião</span>
                <input type="range" min={1} max={15} value={recPerMeeting} onChange={(e) => setRecPerMeeting(Number(e.target.value))} className="mt-2 w-full accent-[var(--success)]" />
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
              “O planejador que pede 1 recomendação está tentando sobreviver. O planejador que conduz 10 recomendações está construindo escala, autoridade e futuro.”
            </p>
          </blockquote>
        </Section>
      </main>
    </div>
  );
}

function Section({
  eyebrow, icon, title, subtitle, children,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <header className="mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">
          <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
          {eyebrow}
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">{title}</h2>
        {subtitle && <p className="mt-2 max-w-3xl text-[15px] text-muted-foreground leading-relaxed">{subtitle}</p>}
      </header>
      <div>{children}</div>
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

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--warn)]/40 bg-[var(--warn)]/10 p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-[#8a5a00]" />
      <p className="text-sm font-semibold text-[var(--navy)]">{children}</p>
    </div>
  );
}

function TrainingNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Modo treinamento</p>
      <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{children}</p>
    </div>
  );
}
