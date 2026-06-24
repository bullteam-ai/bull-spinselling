import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home as HomeIcon, BookOpen, Target, Search, Lightbulb,
  AlertTriangle, TrendingUp, CheckCircle2, ListChecks, Quote,
  ClipboardList,
} from "lucide-react";

const CANONICAL = "https://bull-spinselling.lovable.app/blog/como-aplicar-spin-selling";

export const Route = createFileRoute("/blog/como-aplicar-spin-selling")({
  head: () => ({
    meta: [
      { title: "Como Aplicar SPIN Selling: Guia Prático Passo a Passo" },
      { name: "description", content: "Guia prático de como aplicar SPIN Selling em reuniões reais: Situação, Problema, Implicação e Necessidade com exemplos, scripts e workbook." },
      { property: "og:title", content: "Como Aplicar SPIN Selling: Guia Prático Passo a Passo" },
      { property: "og:description", content: "Aprenda a aplicar a metodologia SPIN Selling em reuniões reais com perguntas prontas, exemplos e um workbook acionável." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Como Aplicar SPIN Selling: Guia Prático" },
      { name: "twitter:description", content: "Workbook prático de SPIN Selling com perguntas, exemplos e passo a passo de aplicação em reuniões." },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Como Aplicar SPIN Selling: Guia Prático Passo a Passo",
          description:
            "Guia prático de como aplicar SPIN Selling em reuniões reais: Situação, Problema, Implicação e Necessidade com exemplos e workbook.",
          author: { "@type": "Organization", name: "Bull Team" },
          publisher: { "@type": "Organization", name: "Bull Team" },
          mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
          inLanguage: "pt-BR",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "O que é SPIN Selling?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "SPIN Selling é uma metodologia de vendas consultivas criada por Neil Rackham baseada em quatro tipos de perguntas: Situação, Problema, Implicação e Necessidade de Solução. O objetivo é fazer o cliente verbalizar suas dores e o valor de resolvê-las, em vez de o vendedor apresentar argumentos prontos.",
              },
            },
            {
              "@type": "Question",
              name: "Como aplicar SPIN Selling em uma reunião?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Conduza a reunião em quatro fases: 1) Situação — colete contexto rápido com perguntas curtas; 2) Problema — identifique 1 a 3 dores reais; 3) Implicação — amplie o custo de não resolver; 4) Necessidade — leve o cliente a verbalizar o valor da solução. Termine confirmando a dor e o ganho com a própria voz do cliente.",
              },
            },
            {
              "@type": "Question",
              name: "Quais erros evitar ao aplicar SPIN Selling?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Os principais erros são: passar tempo demais em perguntas de Situação, pular direto para a apresentação da solução, fazer perguntas de opinião em vez de perguntas que confrontam números, e tentar 'vender' a Implicação em vez de fazer o cliente concluir sozinho.",
              },
            },
            {
              "@type": "Question",
              name: "SPIN Selling funciona para vendas consultivas de alto ticket?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sim. SPIN Selling foi originalmente concebida para vendas complexas, longas e de alto ticket. Funciona especialmente bem em planejamento financeiro, software B2B, consultoria, serviços profissionais e produtos premium onde a dor não está consciente para o cliente.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: SpinSellingGuide,
});

/* ============================================================
   DADOS DO GUIA
   ============================================================ */

const SPIN_STAGES = [
  {
    letter: "S",
    name: "Situação",
    color: "var(--brand)",
    objetivo: "Mapear contexto rápido — quem é o cliente, como ele opera hoje.",
    quando: "Primeiros 5 a 10 minutos da reunião.",
    erro: "Passar tempo demais aqui. Cliente sente entrevista, não consultoria.",
    examples: [
      "Como você organiza seus investimentos hoje?",
      "Quem te apoia nas decisões financeiras?",
      "Há quanto tempo você segue essa estratégia?",
    ],
    workbookHint:
      "Limite-se a 3 perguntas. Tudo que for público (LinkedIn, site, formulário) NÃO entra aqui.",
  },
  {
    letter: "P",
    name: "Problema",
    color: "#c9a84c",
    objetivo: "Identificar dores reais — não opiniões, fatos verificáveis.",
    quando: "Núcleo da reunião — 30 a 40% do tempo.",
    erro: 'Perguntar "você acredita que está no caminho certo?". Cliente sempre acha que sim.',
    examples: [
      "Quando foi a última vez que alguém revisou sua estratégia com você?",
      "Como você sabe que seus investimentos estão acompanhando a inflação?",
      "Você já comparou o custo real dos seus produtos atuais com alternativas?",
    ],
    workbookHint:
      "Perguntas de Problema devem expor lacunas que o cliente não conhece. Confronte com números, não com opiniões.",
  },
  {
    letter: "I",
    name: "Implicação",
    color: "var(--danger)",
    objetivo: "Ampliar o custo de não resolver. Tornar a dor financeiramente visível.",
    quando: "Logo após confirmar 1 a 3 problemas.",
    erro: "Apresentar a implicação em vez de fazer o cliente verbalizá-la.",
    examples: [
      "Se essa estratégia mantiver o mesmo desempenho pelos próximos 10 anos, qual o impacto no seu patrimônio?",
      "Quanto isso pode significar em poder de compra na sua aposentadoria?",
      "O que acontece com a sua família se um imprevisto ocorrer antes de você reorganizar isso?",
    ],
    workbookHint:
      "A Implicação só funciona quando o cliente faz a conta no próprio cérebro. Faça a pergunta — e pare de falar.",
  },
  {
    letter: "N",
    name: "Necessidade de Solução",
    color: "var(--success)",
    objetivo: "Levar o cliente a verbalizar o valor da solução com a própria voz.",
    quando: "Final da reunião, antes da proposta.",
    erro: "Apresentar benefícios em vez de extrair benefícios.",
    examples: [
      "Se você tivesse uma forma de revisar isso a cada 6 meses sem custo, o que mudaria para você?",
      "Quanto valeria saber, hoje, que sua estratégia está no melhor caminho possível?",
      "Como você se sentiria sabendo que sua família está 100% protegida em qualquer cenário?",
    ],
    workbookHint:
      "Necessidade não se anuncia. Se extrai. A frase de venda mais poderosa sai da boca do cliente, não da sua.",
  },
];

const STEP_BY_STEP = [
  {
    n: 1,
    title: "Prepare o contexto antes da reunião",
    text:
      "Antes do encontro, levante tudo que for público sobre o cliente (LinkedIn, formulário de agendamento, indicação). Cada dado coletado fora da reunião é tempo que você devolve para Problema e Implicação.",
  },
  {
    n: 2,
    title: "Abra com 3 perguntas de Situação — no máximo",
    text:
      'Use as perguntas de Situação como ponte, não como interrogatório. Quando o cliente responde "tenho R$X investido em Y", você ganhou a deixa para entrar em Problema.',
  },
  {
    n: 3,
    title: "Confronte com números, não com opiniões",
    text:
      'Substitua perguntas como "você acha que está bem?" por perguntas que exijam comparação real: "quando você comparou o rendimento líquido do seu CDB com a inflação dos últimos 12 meses?". Cliente comum responde por opinião; cliente exposto a número responde por fato.',
  },
  {
    n: 4,
    title: "Identifique 1 a 3 problemas — não 10",
    text:
      "Vendedor iniciante tenta encontrar todos os problemas. Vendedor SPIN escolhe 1 a 3 dores que mais doem e aprofunda. Mais problemas = mais ansiedade = decisão paralisada.",
  },
  {
    n: 5,
    title: "Amplie a Implicação com silêncio",
    text:
      "A pergunta de Implicação é a mais poderosa da metodologia. Faça a pergunta, encoste no encosto da cadeira e fique quieto. Quem fala primeiro depois de uma pergunta de Implicação, perde. Espere o cliente fazer a conta.",
  },
  {
    n: 6,
    title: "Extraia a Necessidade pela voz do cliente",
    text:
      'Em vez de dizer "nossa solução te dá segurança patrimonial", pergunte "se você tivesse essa segurança a partir desta semana, o que isso significaria na prática para você?". O cliente verbaliza o valor — você só confirma.',
  },
  {
    n: 7,
    title: "Feche confirmando a dor + o ganho na voz do cliente",
    text:
      'Antes de apresentar a proposta, faça um resumo: "Pelo que conversamos, hoje você tem X, isso te custa Y por ano, e resolver isso significa Z para você — está correto?". Quando o cliente diz "sim", a venda já aconteceu.',
  },
];

const COMMON_MISTAKES = [
  {
    wrong: "Você possui um plano financeiro?",
    right:
      'Quando foi a última vez que alguém revisou seu plano financeiro com você, ponto a ponto?',
    why: "Pergunta de opinião abre porta para o cliente dizer 'tenho' e fechar o assunto. Pergunta de fato expõe a lacuna.",
  },
  {
    wrong: "Você acredita que está no caminho certo?",
    right: "Comparado a quem você acredita que está no caminho certo hoje?",
    why: "Quase todo cliente acredita que está fazendo o melhor possível. Confronte com comparação, não com auto-avaliação.",
  },
  {
    wrong: "Você faz acompanhamento dos seus investimentos?",
    right:
      "Quando foi a última vez que alguém te mostrou o impacto da inflação real sobre seus investimentos nos últimos 12 meses?",
    why: "Pergunta vaga gera resposta vaga. Pergunta com recorte temporal e numérico gera reflexão.",
  },
  {
    wrong: "Vou te apresentar nossa metodologia.",
    right:
      "Antes de qualquer coisa: o que mudaria para você se essa lacuna estivesse resolvida nos próximos 30 dias?",
    why: "Apresentar metodologia = vendedor falando. Extrair Necessidade = cliente vendendo para si mesmo.",
  },
];

const QUICK_WIN_ANSWERS = [
  '"Nunca tinha pensado nisso."',
  '"Boa pergunta."',
  '"Não tenho certeza."',
  '"Nunca comparei dessa forma."',
  '"Nunca calculei isso."',
];

/* ============================================================
   COMPONENTE
   ============================================================ */

function SpinSellingGuide() {
  return (
    <div className="min-h-dvh bg-[var(--surface)] text-foreground pb-24">
      {/* HEADER */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[var(--navy)] via-[var(--navy)] to-[#0b1c3a] text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--brand)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[var(--success)]/20 blur-3xl" />
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-10 sm:pt-16 sm:pb-14 relative">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur hover:bg-white/10 transition"
            >
              <HomeIcon className="h-3.5 w-3.5" aria-hidden /> Voltar ao guia
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--success)] backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" /> Guia prático · Workbook
            </span>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/60">
            Blog · Metodologia SPIN Selling
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Como aplicar <span className="text-[var(--success)]">SPIN Selling</span> na prática
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed">
            Guia passo a passo para conduzir reuniões consultivas de alta performance usando as quatro fases do SPIN: Situação, Problema, Implicação e Necessidade de Solução. Com exemplos prontos, erros para evitar e um workbook acionável.
          </p>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SPIN_STAGES.map((s) => (
              <div key={s.letter} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                    style={{ background: s.color }}
                  >
                    {s.letter}
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{s.name}</p>
                </div>
                <p className="mt-2 text-sm text-white/85 leading-snug">{s.objetivo}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* INTRO */}
        <section className="prose-style space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">
            O que é SPIN Selling
          </h2>
          <p className="text-[15.5px] leading-relaxed text-[var(--navy)]/90">
            SPIN Selling é uma metodologia de venda consultiva criada por <strong>Neil Rackham</strong> a partir de 12 anos de pesquisa em mais de 35.000 reuniões comerciais. A descoberta central foi simples: <strong>vendedores que vendem mais não falam mais — perguntam melhor</strong>.
          </p>
          <p className="text-[15.5px] leading-relaxed text-[var(--navy)]/90">
            Em vez de apresentar argumentos prontos, o vendedor SPIN conduz o cliente por quatro tipos de perguntas em sequência. Cada fase tem um objetivo psicológico claro e prepara o terreno para a próxima:
          </p>
          <ul className="mt-2 grid gap-2">
            {SPIN_STAGES.map((s) => (
              <li key={s.letter} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                  style={{ background: s.color }}
                >
                  {s.letter}
                </span>
                <div>
                  <p className="font-bold text-[var(--navy)]">{s.name}</p>
                  <p className="text-sm text-[var(--navy)]/80 leading-snug">{s.objetivo}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* AS 4 FASES — DETALHADO */}
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">
            As quatro fases na prática
          </h2>
          {SPIN_STAGES.map((s) => (
            <article
              key={s.letter}
              id={`fase-${s.letter.toLowerCase()}`}
              className="rounded-3xl border-2 bg-white p-6 sm:p-7 scroll-mt-32"
              style={{ borderColor: `color-mix(in oklab, ${s.color} 40%, transparent)` }}
            >
              <header className="flex items-start gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow-md"
                  style={{ background: s.color, boxShadow: `0 8px 24px -8px ${s.color}` }}
                >
                  {s.letter}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: s.color }}>
                    Fase {s.letter}
                  </p>
                  <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)]">
                    Perguntas de {s.name}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] text-muted-foreground leading-relaxed">
                    {s.objetivo}
                  </p>
                </div>
              </header>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoBox icon={<Target className="h-3.5 w-3.5" />} label="Quando aplicar" tone={s.color}>
                  {s.quando}
                </InfoBox>
                <InfoBox icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Erro a evitar" tone="var(--danger)">
                  {s.erro}
                </InfoBox>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">
                  Exemplos de perguntas (planejamento financeiro)
                </p>
                <ul className="mt-2 space-y-2">
                  {s.examples.map((q) => (
                    <li key={q} className="rounded-xl border border-border bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--navy)] leading-relaxed">
                      “{q}”
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-xl border bg-white p-4" style={{ borderColor: `color-mix(in oklab, ${s.color} 40%, transparent)`, background: `color-mix(in oklab, ${s.color} 6%, white)` }}>
                <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: s.color }}>
                  <Lightbulb className="h-3.5 w-3.5" /> Dica de workbook
                </p>
                <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{s.workbookHint}</p>
              </div>
            </article>
          ))}
        </section>

        {/* PASSO A PASSO */}
        <section className="space-y-5">
          <header className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white">
              <ListChecks className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Passo a passo</p>
              <h2 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">
                Como aplicar em uma reunião real
              </h2>
              <p className="mt-1.5 text-[14.5px] text-muted-foreground leading-relaxed">
                Sequência testada em mais de mil reuniões de planejamento financeiro.
              </p>
            </div>
          </header>

          <ol className="space-y-3">
            {STEP_BY_STEP.map((step) => (
              <li key={step.n} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)] text-sm font-extrabold text-white">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--navy)]">{step.title}</p>
                    <p className="mt-1.5 text-[14.5px] text-[var(--navy)]/85 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ERROS COMUNS */}
        <section className="space-y-5">
          <header className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--danger)]/15 text-[var(--danger)]">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">Erros comuns</p>
              <h2 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">
                Perguntas que parecem SPIN — mas matam a reunião
              </h2>
            </div>
          </header>

          <div className="space-y-3">
            {COMMON_MISTAKES.map((m, i) => (
              <article key={i} className="rounded-2xl border border-border bg-white p-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border-2 border-[var(--danger)]/30 bg-[var(--danger)]/5 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">❌ Não use</p>
                    <p className="mt-1.5 text-sm font-semibold text-[var(--navy)]">“{m.wrong}”</p>
                  </div>
                  <div className="rounded-xl border-2 border-[var(--success)]/30 bg-[var(--success)]/10 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">✅ Use</p>
                    <p className="mt-1.5 text-sm font-semibold text-[var(--navy)]">“{m.right}”</p>
                  </div>
                </div>
                <p className="mt-3 text-[13.5px] text-muted-foreground leading-relaxed">
                  <strong className="text-[var(--navy)]">Por quê:</strong> {m.why}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* SINAIS DE QUE FUNCIONOU */}
        <section className="rounded-3xl border-2 border-[var(--success)]/30 bg-[var(--success)]/5 p-6 sm:p-8">
          <header className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Sinais de sucesso</p>
              <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--navy)]">
                Você sabe que aplicou SPIN bem quando o cliente diz:
              </h2>
            </div>
          </header>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {QUICK_WIN_ANSWERS.map((a) => (
              <li key={a} className="rounded-xl border border-[var(--success)]/30 bg-white px-4 py-3 text-[15px] font-semibold text-[var(--navy)]">
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--navy)]/85 leading-relaxed">
            Essas respostas indicam que o cliente <strong>parou para pensar</strong> em algo que ainda não tinha pensado. É exatamente nesse momento que a reunião deixa de ser apresentação e vira consultoria.
          </p>
        </section>

        {/* WORKBOOK */}
        <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
          <header className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)] shadow-lg shadow-[var(--success)]/30">
              <ClipboardList className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Workbook</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">
                Roteiro de aplicação · imprima ou copie
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed max-w-2xl">
                Use este roteiro como folha de apoio na sua próxima reunião. Marque o que aplicou — e o que ainda escapou.
              </p>
            </div>
          </header>

          <ol className="mt-6 space-y-3">
            {[
              "Antes da reunião: levantei tudo que é público sobre o cliente (LinkedIn, formulário, indicação).",
              "Abertura: usei no máximo 3 perguntas de Situação.",
              "Problema: confrontei o cliente com pelo menos 1 número, comparação ou recorte temporal.",
              "Identifiquei de 1 a 3 problemas claros — não tentei levantar todos.",
              "Implicação: fiz a pergunta, fiquei em silêncio e deixei o cliente fazer a conta.",
              "Necessidade: extraí o valor da solução com a voz do cliente (não apresentei eu mesmo).",
              "Fechei resumindo dor + ganho na voz do cliente e confirmei o 'sim' antes da proposta.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-[var(--success)] bg-transparent text-[var(--success)] text-xs font-extrabold">
                  {i + 1}
                </span>
                <p className="text-[14.5px] text-white/90 leading-relaxed">{item}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* MANTRA */}
        <section>
          <blockquote className="rounded-2xl border-l-4 border-[var(--success)] bg-white p-6 text-[var(--navy)]">
            <Quote className="h-6 w-6 text-[var(--success)]" />
            <p className="mt-3 text-xl font-bold leading-snug">
              Em SPIN Selling, a frase mais poderosa da venda nunca sai da sua boca. Sai da boca do cliente.
            </p>
          </blockquote>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Search className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">FAQ</p>
              <h2 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">
                Perguntas frequentes sobre SPIN Selling
              </h2>
            </div>
          </header>

          <div className="space-y-3">
            {[
              {
                q: "SPIN Selling funciona para vendas B2C ou só B2B?",
                a: "Funciona melhor em vendas consultivas — independente de B2B ou B2C — quando o ticket é alto, o ciclo é longo e a dor não está consciente para o cliente. Planejamento financeiro, seguros, consultoria, software corporativo e produtos premium são o terreno natural da metodologia.",
              },
              {
                q: "Quanto tempo leva para dominar SPIN Selling?",
                a: "A teoria você absorve em 1 hora. A execução exige 30 a 50 reuniões filmadas ou supervisionadas para travar o tempo certo de cada fase, principalmente o silêncio depois da pergunta de Implicação.",
              },
              {
                q: "Posso usar SPIN Selling em ligações de prospecção?",
                a: "Sim, em versão comprimida. Em uma ligação curta, foque em 1 pergunta de Situação, 1 de Problema, 1 de Implicação e converta a Necessidade no convite para a reunião. A versão completa é para o encontro consultivo.",
              },
              {
                q: "Como combinar SPIN Selling com recomendações pós-venda?",
                a: "A própria Necessidade extraída na reunião é o gatilho: quando o cliente verbaliza o valor da solução para ele, pergunte quem mais na vida dele se beneficiaria do mesmo nível de clareza. A recomendação vira extensão natural da venda — não um pedido isolado.",
              },
            ].map((f, i) => (
              <details key={i} className="group rounded-2xl border border-border bg-white p-4 sm:p-5 open:shadow-md transition">
                <summary className="cursor-pointer list-none flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-xs font-extrabold">
                    {i + 1}
                  </span>
                  <p className="text-base font-bold text-[var(--navy)] flex-1">{f.q}</p>
                </summary>
                <p className="mt-3 ml-10 text-[14.5px] text-[var(--navy)]/85 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA INTERNO */}
        <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
          <header className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)]/15 text-[var(--success)]">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Próximos passos</p>
              <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--navy)]">
                Continue construindo sua máquina comercial
              </h2>
              <p className="mt-2 text-[14.5px] text-[var(--navy)]/85 leading-relaxed">
                Combine SPIN Selling com os outros pilares da operação:
              </p>
            </div>
          </header>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              to="/"
              className="rounded-2xl border border-border bg-[var(--surface)] p-4 hover:border-[var(--brand)] transition"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Guia</p>
              <p className="mt-1 font-bold text-[var(--navy)]">Condução da entrevista</p>
              <p className="mt-1 text-xs text-muted-foreground">Roteiro visual completo</p>
            </Link>
            <Link
              to="/ligacoes"
              className="rounded-2xl border border-border bg-[var(--surface)] p-4 hover:border-[var(--brand)] transition"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Ligações</p>
              <p className="mt-1 font-bold text-[var(--navy)]">Confirmação e reagendamento</p>
              <p className="mt-1 text-xs text-muted-foreground">5 modelos com gatilhos</p>
            </Link>
            <Link
              to="/recomendacoes"
              className="rounded-2xl border border-border bg-[var(--surface)] p-4 hover:border-[var(--brand)] transition"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Recomendações</p>
              <p className="mt-1 font-bold text-[var(--navy)]">10+ por reunião</p>
              <p className="mt-1 text-xs text-muted-foreground">Academia completa</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoBox({
  icon, label, tone, children,
}: { icon: React.ReactNode; label: string; tone: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: `color-mix(in oklab, ${tone} 40%, transparent)`, background: `color-mix(in oklab, ${tone} 6%, white)` }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: tone }}>
        {icon} {label}
      </p>
      <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{children}</p>
    </div>
  );
}