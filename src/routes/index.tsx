import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Target, UserRound, Home, Car, Plane, Rocket, BarChart3, HelpCircle, Handshake,
  Flame, AlertTriangle, ClipboardCopy, Check, ChevronDown, TrafficCone, ArrowRight,
  Trophy, Mic, ShieldCheck, XCircle, CheckCircle2, Thermometer, ListOrdered,
  Search, Star, Pin, Headphones, Filter, Sparkles, GraduationCap, Brain, Quote,
  Baby, Heart,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bull Team | Agendamento de Entrevista" },
      { name: "description", content: "Guia consultivo SPIN Selling para consultores Bull Team conduzirem ligações e agendarem mais Entrevistas Estratégicas Financeiras." },
      { property: "og:title", content: "Bull Team | Agendamento de Entrevista" },
      { property: "og:description", content: "Roteiros conversacionais por objetivo financeiro. Conduza, não pergunte." },
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
  "Conectar com o cliente",
  "Apresentar autoridade",
  "Sondar objetivos",
  "Descobrir Objetivo",
  "Fazer Perguntas de Situação",
  "Encontrar Problemas",
  "Amplificar Impactos",
  "Gerar Necessidade",
  "Ouvir Sinais de Compra",
  "Agendar Entrevista",
  "Não Vender Nada",
];

const JOURNEY_STAGES: { n: number; emoji: string; label: string; desc: string }[] = [
  { n: 1, emoji: "☎️", label: "Conexão",        desc: "Criação de rapport e conexão com o cliente." },
  { n: 2, emoji: "🛡️", label: "Autoridade",     desc: "Apresentação da Bull Team e construção de credibilidade." },
  { n: 3, emoji: "🎯", label: "Objetivo",       desc: "Descoberta do principal objetivo financeiro do cliente." },
  { n: 4, emoji: "🔍", label: "SPIN",           desc: "Exploração da situação, problemas, implicações e necessidades." },
  { n: 5, emoji: "🚦", label: "Sinais",         desc: "Identificação de abertura e interesse do cliente." },
  { n: 6, emoji: "📅", label: "Agendamento",    desc: "Convite para a Entrevista Estratégica Financeira." },
  { n: 7, emoji: "🤝", label: "Compromisso",    desc: "Confirmação do comparecimento." },
  { n: 8, emoji: "✅", label: "Comparecimento", desc: "Preparação do cliente para a entrevista." },
];

function JourneyBar({
  activeStages,
  onJump,
}: {
  activeStages: number[];
  onJump: (stage: number) => void;
}) {
  const maxActive = activeStages.length ? Math.max(...activeStages) : 0;
  return (
    <div className="sticky top-12 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 pt-2 pb-2">
        <ol
          aria-label="Jornada da Entrevista Bull Team"
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-thin"
        >
          {JOURNEY_STAGES.map((s, i) => {
            const isActive = activeStages.includes(s.n);
            const isDone = !isActive && s.n < maxActive;
            return (
              <Fragment key={s.n}>
                <li className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onJump(s.n)}
                    title={s.desc}
                    aria-current={isActive ? "step" : undefined}
                    className={`group relative inline-flex items-center gap-1.5 rounded-full border px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition motion-reduce:transition-none ${
                      isActive
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/30 ring-2 ring-[var(--brand)]/25"
                        : isDone
                        ? "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--navy)]"
                        : "border-border bg-white text-muted-foreground hover:text-[var(--navy)]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isDone
                          ? "bg-[var(--success)] text-white"
                          : "bg-[var(--surface)] text-muted-foreground"
                      }`}
                    >
                      {isDone ? "✓" : s.n}
                    </span>
                    <span aria-hidden>{s.emoji}</span>
                    <span className="hidden md:inline whitespace-nowrap">{s.label}</span>
                  </button>
                </li>
                {i < JOURNEY_STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className={`h-px w-2 sm:w-4 shrink-0 ${s.n < maxActive ? "bg-[var(--success)]" : "bg-border"}`}
                  />
                )}
              </Fragment>
            );
          })}
        </ol>
        <p className="mt-1 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Não venda. Conduza. Gere consciência. Agende.
        </p>
      </div>
    </div>
  );
}

const FRIEND_CALL_STEPS = [
  {
    id: "small-talk",
    number: "1",
    title: "Small talk",
    objective: "Criar conexão, gerar conforto e reduzir resistência.",
    doList: [
      "Conversar sobre a relação existente",
      "Perguntar sobre acontecimentos recentes",
      "Demonstrar interesse genuíno",
      "Fazer perguntas abertas",
      "Deixar o cliente falar",
    ],
    goodExamples: [
      "Como você tem estado?",
      "O que aconteceu de novo desde a última vez que nos falamos?",
      "Como estão as coisas no trabalho?",
      "Como está a família?",
      "O que tem ocupado mais seu tempo ultimamente?",
    ],
    avoid: [
      "Encerrar assuntos rapidamente",
      'Responder apenas "legal", "bacana" ou "entendi"',
      "Ir direto para a venda",
    ],
    why: "O cliente compra de pessoas que demonstram interesse genuíno. Antes de falar sobre objetivos financeiros, é preciso criar conexão.",
  },
  {
    id: "autoridade",
    number: "2",
    title: "Autoridade e prova social",
    subtitle: "Explicar rapidamente o motivo da ligação",
    objective: "Gerar credibilidade e contextualizar a chamada em poucos segundos.",
    quote:
      "Hoje faço parte da Futuro Corp, uma operação especializada em planejamento financeiro estratégico focado em objetivos. Nosso trabalho é ajudar as pessoas a entender exatamente onde estão e qual o caminho mais eficiente para alcançar seus objetivos financeiros.",
    why: "A autoridade reduz resistência. O cliente precisa entender rapidamente por que vale a pena continuar ouvindo.",
  },
  {
    id: "convite",
    number: "3",
    title: "Convite para entrevista estratégica",
    subtitle: "Criar curiosidade e gerar valor",
    objective: "Posicionar a entrevista como oportunidade relevante, nunca como venda.",
    quote:
      "Estou participando de um projeto onde tenho algumas entrevistas estratégicas disponíveis para pessoas que acredito que possam se beneficiar de uma análise financeira mais profunda. E pensando na sua realidade, lembrei de você.",
    why: "A entrevista deve parecer uma oportunidade relevante e não uma venda.",
  },
  {
    id: "descoberta",
    number: "4",
    title: "Descoberta do objetivo",
    subtitle: "Porta de entrada para o SPIN",
    objective: "Identificar o objetivo principal e direcionar o roteiro abaixo.",
    quote: "Hoje, quais são os principais objetivos financeiros que você gostaria de conquistar?",
    quickFollowUps: [
      "O que torna esse objetivo importante?",
      "Existe algum prazo?",
      "Quem mais é impactado por esse objetivo?",
    ],
    slowFollowUps: [
      "Existe algo que gostaria de proporcionar para sua família?",
      "Existe alguma conquista importante que ainda deseja realizar?",
      "Se dinheiro não fosse uma preocupação, o que faria?",
    ],
    transition:
      "Perfeito. Vamos explorar um pouco mais esse objetivo para entender exatamente onde você está hoje.",
    note: "Ao identificar o objetivo, escolha o cartão correspondente na seção abaixo e siga o roteiro SPIN.",
  },
];

const SCRIPT = `Perfeito. Pelo que você compartilhou comigo, existem alguns pontos que vale a pena analisar com mais profundidade para entender exatamente onde você está hoje e qual o caminho mais eficiente para atingir esse objetivo.

O ideal é fazermos uma Entrevista Estratégica Financeira, onde conseguimos colocar tudo isso em números e construir um plano claro.

Tenho disponibilidade na terça às 19h ou quarta às 18h. Qual funciona melhor para você?`;

const CLOSING_SCRIPT = `Após agendarmos a entrevista, você receberá um link da pré-entrevista.

Nele você preencherá seus principais objetivos financeiros e algumas informações importantes.

Com isso conseguimos preparar a reunião de forma personalizada e trazer análises mais relevantes para a sua realidade.

Durante a entrevista vamos organizar suas informações, estruturar cenários e mostrar possíveis caminhos para alcançar os objetivos que você compartilhou.

Ao final, caso faça sentido para você, podemos apresentar uma proposta de continuidade.

Caso não faça sentido, você ainda sairá com muito mais clareza sobre sua vida financeira e sobre os próximos passos.

Pelo que você compartilhou comigo hoje, acredito que essa conversa pode gerar bastante valor para você.`;

type Quadrant = "situacao" | "problema" | "implicacao" | "necessidade";

const QUADRANTS: { key: Quadrant; emoji: string; label: string; color: string; chip: string }[] = [
  { key: "situacao",    emoji: "🔵", label: "Situação",    color: "var(--brand)",   chip: "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/30" },
  { key: "problema",    emoji: "🟡", label: "Problema",    color: "var(--warn)",    chip: "bg-[var(--warn)]/10 text-[#8a5a00] border-[var(--warn)]/40" },
  { key: "implicacao",  emoji: "🟠", label: "Implicação",  color: "var(--danger)",  chip: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30" },
  { key: "necessidade", emoji: "🟢", label: "Necessidade", color: "var(--success)", chip: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30" },
];

const SPIN_OBJECTIVES: Record<Quadrant, string> = {
  situacao: "Descobrir a realidade atual do cliente.",
  problema: "Diagnosticar lacunas, dificuldades e ausência de planejamento.",
  implicacao: "Ampliar o impacto financeiro, emocional e familiar.",
  necessidade: "Fazer o cliente desejar a Entrevista Estratégica Financeira.",
};

const HIGH_CONVERSION_MARKERS = [
  "5 anos", "10 anos", "família", "custando", "melhor caminho", "deixaria de viver",
  "trabalhar por obrigação", "trabalhar 10 anos além", "padrão de vida", "juros compostos",
  "não voltam", "tempo perdido", "perder tempo", "perder a liberdade",
];
const isHighConversion = (q: string) =>
  HIGH_CONVERSION_MARKERS.some((m) => q.toLowerCase().includes(m.toLowerCase()));

// As 3 perguntas de maior impacto por objetivo financeiro.
// Critério: maior poder de elevar a consciência do cliente (Termômetro nível 3-4)
// e gerar desejo de participar da Entrevista Estratégica Financeira.
const KILLER_PRINCIPALS = new Set<string>([
  // Independência Financeira
  "Você tem 100% de certeza de que as decisões financeiras e investimentos que está tomando hoje são o caminho mais eficiente para alcançar sua independência financeira?",
  "E se essa independência financeira acontecer 10 anos depois do que você gostaria?",
  "Se você pudesse ter clareza exata de quando alcançará sua independência financeira e o que precisa fazer para chegar lá mais rápido, faria sentido entender isso?",
  // Aposentadoria
  "Você tem 100% de certeza de que a estratégia atual vai gerar a aposentadoria que deseja e no prazo que imagina?",
  "E se você precisasse trabalhar 10 anos além do que imagina hoje?",
  "Faria sentido descobrir hoje qual renda você terá no futuro e se ela será suficiente para manter o padrão de vida que deseja?",
  // Compra de Casa
  "Você tem 100% de certeza de que a estratégia que utiliza hoje é a melhor disponível para conquistar esse imóvel no menor prazo possível e com o menor custo possível?",
  "E se essa compra atrasar cinco anos?",
  "Se fosse possível descobrir qual o caminho mais eficiente para conquistar esse imóvel e até antecipar essa conquista, faria sentido entender isso?",
  // Compra de Carro
  "Você tem 100% de certeza de que a forma que pretende comprar esse carro é a mais inteligente financeiramente?",
  "E se essa compra atrasar mais alguns anos?",
  "Faria sentido descobrir a forma mais inteligente de chegar nesse carro sem comprometer seus outros objetivos?",
  // Viagens
  "Você tem 100% de certeza de que essa viagem acontecerá no prazo desejado mantendo exatamente o que faz hoje?",
  "E se essa viagem não acontecer nos próximos 5 anos?",
  "Faria sentido transformar essa viagem em um plano concreto ao invés de deixá-la depender das circunstâncias?",
  // Empreendedorismo
  "Você tem 100% de certeza de que conhece todas as informações financeiras necessárias para tirar esse projeto do papel com segurança?",
  "E se esse projeto continuar parado pelos próximos 5 anos?",
  "Faria sentido descobrir exatamente o que seria necessário para transformar essa ideia em realidade?",
  // Organização Financeira
  "Você tem 100% de certeza de que seu dinheiro está sendo direcionado da forma mais eficiente possível para os seus objetivos?",
  "E se nada mudar nos próximos 10 anos?",
  "Como seria ter total clareza sobre para onde seu dinheiro está indo e se ele está realmente aproximando você dos seus objetivos?",
  // Cliente Sem Objetivo
  "Se dinheiro não fosse um problema, o que você faria imediatamente?",
  "E se mais 10 anos passarem da mesma forma?",
  "Faria sentido descobrir quais objetivos realmente fazem sentido para a sua vida e enxergar o caminho mais inteligente para construí-los?",
  // Já Possui Assessor
  "Seu assessor conhece profundamente todos os seus objetivos financeiros?",
  "E se algo importante estivesse desalinhado hoje, como você descobriria?",
  "Faria sentido validar se tudo continua alinhado aos seus objetivos atuais e identificar possíveis oportunidades que ainda não estão sendo aproveitadas?",
  "Você tem 100% de certeza de que hoje não existe nenhuma estratégia melhor ou oportunidade relevante que ainda não tenha sido considerada?",
  // Futuro dos Filhos
  "Você tem 100% de certeza de que, mantendo exatamente o que faz hoje, conseguirá proporcionar todas as oportunidades que deseja para seus filhos?",
  "E se chegar o momento em que seu filho precisar dessa ajuda e ela não estiver disponível?",
  "Faria sentido saber exatamente o que precisa ser construído hoje para garantir as oportunidades que deseja oferecer aos seus filhos?",
  // Casamento e Projetos Familiares
  "Você tem 100% de certeza de que a estratégia financeira atual é a melhor possível para acelerar os projetos da sua família?",
  "E se esses objetivos familiares demorarem muito mais tempo para acontecer?",
  "Faria sentido validar se vocês estão utilizando o caminho mais eficiente para construir os sonhos da família?",
]);
const isKiller = (q: string) => KILLER_PRINCIPALS.has(q);

// === MODO TREINAMENTO ===
// Explica a psicologia por trás de cada Pergunta Principal.
// Fallback automático por quadrante quando não houver explicação dedicada.
const QUADRANT_EXPLANATION: Record<Quadrant, string> = {
  situacao:
    "Essa pergunta abre a conversa sem pressão. O objetivo é fazer o cliente verbalizar a própria realidade — aquilo que é dito em voz alta passa a ser percebido com mais clareza por quem fala.",
  problema:
    "Essa pergunta não tenta provar que o cliente está errado. Ela gera dúvida saudável — leva o cliente a perceber que talvez não tenha 100% de certeza sobre o melhor caminho.",
  implicacao:
    "Essa pergunta amplia a percepção do custo de não agir. Tira a decisão do campo puramente racional e a leva para o campo emocional — onde a maioria das decisões realmente acontece.",
  necessidade:
    "Essa pergunta não explora mais problemas. Ela faz o cliente visualizar ganhos — clareza, previsibilidade, velocidade, segurança e tranquilidade — até desejar participar da Entrevista Estratégica Financeira.",
};

const EXPLANATIONS: Record<string, string> = {
  // Implicações de atraso → custo emocional do tempo
  "E se essa independência financeira acontecer 10 anos depois do que você gostaria?":
    "Amplia o custo do atraso. Tira a decisão do campo racional e leva para o emocional, onde a maioria das decisões acontece.",
  "E se você precisasse trabalhar 10 anos além do que imagina hoje?":
    "Torna o atraso tangível. O cliente sente o peso de perder a liberdade de escolher quando parar.",
  "E se essa compra atrasar cinco anos?":
    "Conecta o imóvel à vida real. O cliente passa a pensar em rotina familiar, não em metros quadrados.",
  "E se essa compra atrasar mais alguns anos?":
    "Revela o custo invisível da rotina. O desconforto diário se torna inaceitável.",
  "E se essa viagem não acontecer nos próximos 5 anos?":
    "Transforma dinheiro em experiências perdidas. Ativa a dor de memórias que não voltam.",
  "E se esse projeto continuar parado pelos próximos 5 anos?":
    "Ativa o medo do arrependimento. É mais forte que o medo de errar.",
  "E se nada mudar nos próximos 10 anos?":
    "Tira o cliente da inércia. Mostra que 'continuar como está' também é uma escolha — e raramente a melhor.",
  "E se mais 10 anos passarem da mesma forma?":
    "Obriga o cliente a olhar para frente. O custo invisível da ausência de direção aparece.",
  "E se algo importante estivesse desalinhado hoje, como você descobriria?":
    "Cria dúvida sem atacar o assessor. Abre espaço para uma segunda visão.",

  // Necessidades → curiosidade e abertura
  // Necessidades → desejo pela Entrevista (visualizar ganhos, não explorar problemas)
  "Se você pudesse ter clareza exata de quando alcançará sua independência financeira e o que precisa fazer para chegar lá mais rápido, faria sentido entender isso?":
    "Vende o ganho da clareza e a possibilidade de antecipar a liberdade. O cliente sai querendo enxergar o próprio mapa.",
  "Faria sentido descobrir hoje qual renda você terá no futuro e se ela será suficiente para manter o padrão de vida que deseja?":
    "Oferece previsibilidade e segurança. Transforma a entrevista em uma forma de evitar surpresas futuras.",
  "Se fosse possível descobrir qual o caminho mais eficiente para conquistar esse imóvel e até antecipar essa conquista, faria sentido entender isso?":
    "Conecta o imóvel a velocidade e eficiência. O cliente passa a desejar a entrevista para acelerar a conquista.",
  "Faria sentido descobrir a forma mais inteligente de chegar nesse carro sem comprometer seus outros objetivos?":
    "Vende equilíbrio e inteligência financeira. A entrevista vira a forma de decidir sem abrir mão de nada.",
  "Faria sentido transformar essa viagem em um plano concreto ao invés de deixá-la depender das circunstâncias?":
    "Substitui esperança por previsibilidade. O sonho ganha data, valor e segurança.",
  "Faria sentido descobrir exatamente o que seria necessário para transformar essa ideia em realidade?":
    "Vende clareza e velocidade de execução. O cliente passa a desejar a entrevista para tirar o projeto do papel.",
  "Como seria ter total clareza sobre para onde seu dinheiro está indo e se ele está realmente aproximando você dos seus objetivos?":
    "Vende clareza e confiança. Quem visualiza o destino raramente recusa a entrevista que mostra o caminho.",
  "Faria sentido descobrir quais objetivos realmente fazem sentido para a sua vida e enxergar o caminho mais inteligente para construí-los?":
    "Vende direção e propósito. A entrevista vira o ponto de partida para parar de andar sem destino.",
  "Faria sentido validar se tudo continua alinhado aos seus objetivos atuais e identificar possíveis oportunidades que ainda não estão sendo aproveitadas?":
    "Posiciona a entrevista como ganho — não substituição. Segunda visão que pode revelar oportunidades.",
  "Faria sentido saber exatamente o que precisa ser construído hoje para garantir as oportunidades que deseja oferecer aos seus filhos?":
    "Vende tranquilidade e legado. Transforma planejamento em ato de amor mensurável.",
  "Faria sentido validar se vocês estão utilizando o caminho mais eficiente para construir os sonhos da família?":
    "Vende união e aceleração. A entrevista vira uma decisão tomada em conjunto, com mais clareza.",

  // Problemas → reconhecer lacuna sem confronto
  // Problemas → gerar dúvida saudável sem confrontar (Princípio da Incerteza Elegante)
  "Você tem 100% de certeza de que as decisões financeiras e investimentos que está tomando hoje são o caminho mais eficiente para alcançar sua independência financeira?":
    "'100% de certeza' é o gatilho. Ninguém responde sim com convicção. O cliente conclui sozinho: 'talvez eu não saiba'.",
  "Você tem 100% de certeza de que a estratégia atual vai gerar a aposentadoria que deseja e no prazo que imagina?":
    "Separa ter estratégia de ter certeza do resultado. A dúvida sobre o prazo abre espaço para a entrevista.",
  "Você tem 100% de certeza de que a estratégia que utiliza hoje é a melhor disponível para conquistar esse imóvel no menor prazo possível e com o menor custo possível?":
    "Introduz duas variáveis difíceis de garantir: menor prazo e menor custo. O cliente percebe que nunca comparou.",
  "Você tem 100% de certeza de que a forma que pretende comprar esse carro é a mais inteligente financeiramente?":
    "'Mais inteligente financeiramente' obriga comparação. Quase ninguém comparou de verdade.",
  "Você tem 100% de certeza de que essa viagem acontecerá no prazo desejado mantendo exatamente o que faz hoje?":
    "Liga o sonho a 'mantendo o que faz hoje'. Expõe a fragilidade do plano sem julgar o cliente.",
  "Você tem 100% de certeza de que conhece todas as informações financeiras necessárias para tirar esse projeto do papel com segurança?":
    "Empreendedor não trava por coragem, trava por falta de clareza. A dúvida sobre 'todas as informações' destrava.",
  "Você tem 100% de certeza de que seu dinheiro está sendo direcionado da forma mais eficiente possível para os seus objetivos?":
    "Diferencia controlar de otimizar. Quase ninguém tem certeza de que está otimizando.",
  "Você tem 100% de certeza de que, mantendo exatamente o que faz hoje, conseguirá proporcionar todas as oportunidades que deseja para seus filhos?":
    "Conecta sonho a número sem confronto. A dúvida sobre 'todas as oportunidades' move o pai a buscar clareza.",
  "Você tem 100% de certeza de que a estratégia financeira atual é a melhor possível para acelerar os projetos da sua família?":
    "'A melhor possível' é uma régua impossível de defender. Abre espaço para validação em conjunto.",
  "Você tem 100% de certeza de que hoje não existe nenhuma estratégia melhor ou oportunidade relevante que ainda não tenha sido considerada?":
    "Não ataca o assessor. Pergunta se existe algo que ele ainda não viu — e quase sempre existe.",

  // Situação chave → contexto que vira gatilho
  "Se dinheiro não fosse um problema, o que você faria imediatamente?":
    "Revela os desejos reais sem pressão. O cliente frequentemente descobre o que quer ali na ligação.",
  "Seu assessor conhece profundamente todos os seus objetivos financeiros?":
    "Diferencia 'ter assessor' de 'ter planejamento'. Expõe que o foco costuma ser produto, não vida.",

  // Killer questions referenciadas no topo
  "O que acontece se isso não mudar nos próximos 5 anos?":
    "Projeta o problema no futuro. Cria urgência sem pressão.",
  "O que está custando para você não resolver isso hoje?":
    "Torna o custo da inação visível. Indecisão vira prejuízo concreto.",
  "Como isso impacta sua família?":
    "Aumenta a relevância emocional. Decisões financeiras são tomadas pelo coração, não pela calculadora.",
  "Se continuar exatamente como está, qual será o cenário daqui a 10 anos?":
    "Obriga o cliente a desenhar o futuro. O cenário real raramente é o desejado.",
  "Você acredita que está no melhor caminho possível ou apenas no caminho que conhece?":
    "Reduz resistência. O cliente não precisa admitir erro — apenas considerar alternativas.",

  // Futuro dos Filhos
  "Quando você pensa no futuro dos seus filhos, o que mais gostaria de proporcionar para eles?":
    "Abre pela emoção mais forte: os filhos. Verbalizar o desejo cria compromisso imediato com a conversa.",
  "Hoje existe algum planejamento específico para ajudar seus filhos a alcançarem esses objetivos?":
    "Separa desejo de estrutura. A maioria tem sonhos, poucos têm números. O cliente percebe a lacuna.",
  "E se chegar o momento em que seu filho precisar dessa ajuda e ela não estiver disponível?":
    "Ativa a dor de não ter feito o suficiente. Transforma planejamento em ato de amor.",
  "Faz sentido entender quanto seria necessário para garantir essas oportunidades aos seus filhos?":
    "Move emoção para matemática. Sonho com número vira meta concreta.",

  // Casamento e Projetos Familiares
  "Quando você pensa no seu casamento e na sua família, quais são os principais objetivos que gostaria de construir juntos?":
    "Coloca o casal como protagonista. Decisão familiar tem motivação muito maior que individual.",
  "Hoje vocês possuem um plano financeiro estruturado para alcançar esses objetivos?":
    "Expõe a desconexão entre sonhos e estratégia. Muitos conversam, poucos planejam juntos.",
  "E se esses objetivos familiares demorarem muito mais tempo para acontecer?":
    "Conecta tempo a memórias perdidas. Atraso financeiro vira atraso de vida.",
  "Faz sentido validar se vocês estão utilizando a melhor estratégia para alcançar esses objetivos familiares?":
    "Convida ambos a validar juntos. Transforma entrevista em experiência de união, não julgamento.",
};

const getExplanation = (principal: string, quadrant: Quadrant) =>
  EXPLANATIONS[principal] ?? QUADRANT_EXPLANATION[quadrant];

// === PSICOLOGIA DA ENTREVISTA ===
const PSYCHOLOGY_PRINCIPLES: { title: string; description: string }[] = [
  {
    title: "O cliente percebe um objetivo importante",
    description:
      "Enquanto o objetivo não for emocionalmente relevante, não existe urgência para agir.",
  },
  {
    title: "O cliente percebe que não sabe exatamente como chegar lá",
    description:
      "As pessoas raramente procuram ajuda quando acreditam possuir todas as respostas.",
  },
  {
    title: "O cliente percebe que o atraso tem um custo",
    description:
      "Quando o custo de não agir fica visível, a mudança passa a fazer sentido.",
  },
  {
    title: "O cliente percebe que existe uma forma melhor",
    description:
      "O cliente não precisa acreditar que está errado. Ele apenas precisa acreditar que existe espaço para melhoria.",
  },
  {
    title: "O cliente acredita que a entrevista ajudará",
    description:
      "O valor da entrevista precisa ser maior do que o esforço de participar dela.",
  },
];

type Script = {
  principal: string;
  simLabel?: string;
  naoLabel?: string;
  sim: string[];
  nao?: string[];
  transicao: string;
  procurar: string[];
};
type Goal = {
  id: string;
  emoji: string;
  icon: typeof Target;
  title: string;
  highConversion?: boolean;
  blocks: Record<Quadrant, Script>;
};

const GOALS: Goal[] = [
  {
    id: "independencia", emoji: "🎯", icon: Target, title: "Independência Financeira",
    blocks: {
      situacao: {
        principal: "O que significa independência financeira para você?",
        simLabel: "Se responder claramente",
        naoLabel: "Se responder de forma vaga",
        sim: [
          "Quando você começou a pensar nisso?",
          "Existe algum motivo específico por trás desse objetivo?",
          "O que faria você dizer: 'cheguei lá'?",
          "O que mudaria na sua rotina?",
        ],
        nao: [
          "Quando você imagina sua vida ideal?",
          "O que gostaria de poder fazer sem depender do trabalho?",
          "Existe algo que sente que hoje não consegue fazer?",
        ],
        transicao: "Interessante. Então existe uma visão do que você gostaria de construir. Agora quero entender como isso está estruturado hoje.",
        procurar: ["Sonhos", "Motivações", "Liberdade", "Família", "Qualidade de vida"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que as decisões financeiras e investimentos que está tomando hoje são o caminho mais eficiente para alcançar sua independência financeira?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "O que te dá essa convicção?",
          "Você chegou a comparar estratégias diferentes?",
          "Quando foi a última vez que revisou esse planejamento?",
          "Existe alguma projeção formal que valide isso?",
          "O que poderia fazer esse plano não acontecer?",
        ],
        nao: [
          "O que mais gera dúvida hoje?",
          "Onde sente maior insegurança?",
          "Existe algo que gostaria de entender melhor?",
        ],
        transicao: "Muitas pessoas possuem uma estratégia. Poucas possuem certeza de que ela é a melhor possível.",
        procurar: ["Falta de comparação", "Falta de validação", "Falta de revisão", "Falta de certeza"],
      },
      implicacao: {
        principal: "E se essa independência financeira acontecer 10 anos depois do que você gostaria?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar impacto",
        sim: [
          "O que deixaria de viver?",
          "Quem seria impactado?",
          "O que mudaria para sua família?",
          "Como você se sentiria?",
        ],
        nao: [
          "Então o prazo não é tão importante?",
          "Se pudesse antecipar em 10 anos faria diferença?",
          "Existe alguma experiência que estaria adiando?",
        ],
        transicao: "É justamente aqui que muitas pessoas percebem que o custo não é apenas financeiro.",
        procurar: ["Dor emocional", "Tempo perdido", "Família", "Qualidade de vida", "Oportunidades perdidas"],
      },
      necessidade: {
        principal: "Se você pudesse ter clareza exata de quando alcançará sua independência financeira e o que precisa fazer para chegar lá mais rápido, faria sentido entender isso?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria para você saber exatamente em que ponto da jornada está hoje?",
          "Como seria ter a tranquilidade de saber que está no caminho certo?",
          "Se existisse uma forma de antecipar esse objetivo em alguns anos, isso faria diferença?",
          "O que mudaria na sua vida ao enxergar um plano claro para alcançar essa liberdade?",
        ],
        transicao: "É exatamente isso que buscamos construir durante a entrevista.",
        procurar: ["Clareza", "Tranquilidade", "Antecipação", "Velocidade"],
      },
    },
  },
  {
    id: "aposentadoria", emoji: "👴", icon: UserRound, title: "Aposentadoria",
    blocks: {
      situacao: {
        principal: "Quando você pensa em aposentadoria, o que realmente gostaria que ela proporcionasse para sua vida?",
        simLabel: "Se responder claramente",
        naoLabel: "Se responder de forma vaga",
        sim: [
          "O que torna isso importante para você?",
          "Existe alguma experiência que gostaria de viver nessa fase?",
          "Como imagina sua rotina?",
          "Existe alguém que você gostaria de beneficiar junto com você?",
        ],
        nao: [
          "Já parou para imaginar como gostaria de viver aos 60 ou 70 anos?",
          "Existe algo que definitivamente não gostaria de abrir mão?",
          "Qual padrão de vida gostaria de manter?",
        ],
        transicao: "Interessante. Então existe uma expectativa em relação ao futuro. Agora vale entender o quanto isso está estruturado hoje.",
        procurar: ["Qualidade de vida", "Família", "Liberdade", "Segurança"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que a estratégia atual vai gerar a aposentadoria que deseja e no prazo que imagina?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "Como chegou a essa conclusão?",
          "Existe alguma projeção formal?",
          "Você sabe exatamente qual renda terá?",
          "O que sustenta essa confiança?",
        ],
        nao: [
          "O que mais preocupa você?",
          "Existe alguma dúvida sobre o futuro?",
        ],
        transicao: "Ter uma estratégia é diferente de ter certeza do resultado.",
        procurar: ["Falta de projeção", "Falta de validação", "Falta de certeza sobre prazo", "Falta de certeza sobre renda"],
      },
      implicacao: {
        principal: "E se você precisasse trabalhar 10 anos além do que imagina hoje?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "Como isso afetaria sua qualidade de vida?",
          "O que deixaria de viver?",
          "Como isso impactaria sua família?",
        ],
        nao: [
          "Então o prazo não é importante?",
          "Se pudesse parar antes faria diferença?",
          "Existe alguma liberdade que gostaria de conquistar?",
        ],
        transicao: "O problema normalmente não é trabalhar, mas perder a liberdade de escolher.",
        procurar: ["Tempo", "Liberdade", "Família", "Saúde"],
      },
      necessidade: {
        principal: "Faria sentido descobrir hoje qual renda você terá no futuro e se ela será suficiente para manter o padrão de vida que deseja?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria enxergar esse cenário antes de chegar lá?",
          "Como seria ter segurança sobre o seu futuro financeiro?",
          "Se pudesse corrigir eventuais desvios agora, faria sentido descobrir isso?",
        ],
        transicao: "A entrevista existe justamente para trazer essa previsibilidade.",
        procurar: ["Previsibilidade", "Segurança", "Padrão de vida", "Correção de rota"],
      },
    },
  },
  {
    id: "filhos", emoji: "👶", icon: Baby, title: "Futuro dos Filhos", highConversion: true,
    blocks: {
      situacao: {
        principal: "Quando você pensa no futuro dos seus filhos, o que mais gostaria de proporcionar para eles?",
        simLabel: "Se responder claramente",
        naoLabel: "Se responder de forma vaga",
        sim: [
          "O que torna isso importante para você?",
          "Existe algo que você gostaria que eles tivessem e você não teve?",
          "Qual é seu maior sonho para eles?",
          "Existe alguma preocupação específica com o futuro deles?",
        ],
        nao: [
          "Quando imagina seus filhos adultos, o que gostaria que eles tivessem conquistado?",
          "Existe algo que gostaria de facilitar para eles?",
          "Qual seria sua maior realização como pai ou mãe?",
        ],
        transicao: "É interessante porque praticamente todos os pais possuem sonhos para os filhos, mas poucos transformam isso em um plano.",
        procurar: ["Educação", "Faculdade", "Intercâmbio", "Segurança", "Independência", "Legado"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que, mantendo exatamente o que faz hoje, conseguirá proporcionar todas as oportunidades que deseja para seus filhos?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "Como chegou nessa conclusão?",
          "Existe algum planejamento estruturado?",
          "Você sabe exatamente quanto será necessário?",
        ],
        nao: [
          "O que mais preocupa você?",
          "Existe alguma oportunidade que teme não conseguir proporcionar?",
        ],
        transicao: "Quase todos os pais possuem sonhos para os filhos. Poucos possuem certeza dos números necessários para realizá-los.",
        procurar: ["Falta de números", "Falta de planejamento estruturado", "Falta de certeza", "Excesso de confiança"],
      },
      implicacao: {
        principal: "E se chegar o momento em que seu filho precisar dessa ajuda e ela não estiver disponível?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "Como você se sentiria?",
          "O que isso mudaria para ele?",
          "Existe alguma oportunidade que poderia ser perdida?",
          "Isso geraria alguma frustração?",
        ],
        nao: [
          "Então essa preparação não é tão importante?",
          "Se pudesse garantir isso hoje faria diferença?",
          "Existe algum sonho dele que você gostaria de ajudar a realizar?",
        ],
        transicao: "O impacto normalmente não é financeiro. É emocional. É a sensação de não conseguir entregar algo que era importante.",
        procurar: ["Culpa", "Responsabilidade", "Proteção", "Amor", "Legado"],
      },
      necessidade: {
        principal: "Faria sentido saber exatamente o que precisa ser construído hoje para garantir as oportunidades que deseja oferecer aos seus filhos?",
        simLabel: "Se responder SIM",
        sim: [
          "Como seria ter a tranquilidade de saber que isso está encaminhado?",
          "Quanto valor teria enxergar esse futuro em números?",
          "O que mudaria ao saber que está construindo esse legado da forma correta?",
        ],
        transicao: "É justamente essa tranquilidade que buscamos gerar.",
        procurar: ["Tranquilidade", "Legado", "Clareza em números", "Proteção"],
      },
    },
  },
  {
    id: "familia", emoji: "💍", icon: Heart, title: "Casamento e Projetos Familiares", highConversion: true,
    blocks: {
      situacao: {
        principal: "Quando você pensa no seu casamento e na sua família, quais são os principais objetivos que gostaria de construir juntos?",
        simLabel: "Se responder claramente",
        naoLabel: "Se responder de forma vaga",
        sim: [
          "O que é mais importante para vocês?",
          "Existe algum sonho que compartilham?",
          "Como imaginam a vida daqui a 10 ou 20 anos?",
          "Existe alguma meta financeira em comum?",
        ],
        nao: [
          "Vocês costumam conversar sobre objetivos financeiros?",
          "Existe algo que gostariam de conquistar juntos?",
          "Como imaginam o futuro da família?",
        ],
        transicao: "Os maiores projetos da vida normalmente são construídos em conjunto.",
        procurar: ["Sonhos em comum", "Família", "Imóvel", "Filhos", "Liberdade financeira"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que a estratégia financeira atual é a melhor possível para acelerar os projetos da sua família?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "O que sustenta essa confiança?",
          "Vocês chegaram a comparar alternativas?",
          "Existe alguma validação externa?",
        ],
        nao: [
          "O que mais gera dúvida?",
          "Existe alguma preocupação sobre o ritmo dessas conquistas?",
        ],
        transicao: "Ter objetivos familiares é comum. Ter certeza de que estão no melhor caminho é raro.",
        procurar: ["Falta de comparação", "Falta de validação externa", "Falta de certeza"],
      },
      implicacao: {
        principal: "E se esses objetivos familiares demorarem muito mais tempo para acontecer?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "O que deixariam de viver?",
          "Como isso impactaria a família?",
          "Existe algum sonho que poderia ficar para depois?",
        ],
        nao: [
          "Então o prazo não é tão importante?",
          "Se pudesse acelerar essas conquistas faria diferença?",
        ],
        transicao: "Normalmente o impacto não está apenas no dinheiro, mas nas experiências que a família deixa de viver.",
        procurar: ["Tempo", "Família", "Sonhos", "Qualidade de vida"],
      },
      necessidade: {
        principal: "Faria sentido validar se vocês estão utilizando o caminho mais eficiente para construir os sonhos da família?",
        simLabel: "Se responder SIM",
        sim: [
          "Como seria ter mais clareza sobre os próximos passos?",
          "Quanto valor teria acelerar alguns desses objetivos?",
          "O que mudaria para a família se essas conquistas acontecessem antes?",
        ],
        transicao: "Esse é exatamente o tipo de reflexão que fazemos na entrevista.",
        procurar: ["Clareza", "Aceleração", "União familiar", "Eficiência"],
      },
    },
  },
  {
    id: "casa", emoji: "🏠", icon: Home, title: "Compra de Casa",
    blocks: {
      situacao: {
        principal: "Hoje existe algum imóvel específico que você gostaria de conquistar ou ainda está desenhando esse objetivo?",
        simLabel: "Se responder claramente",
        naoLabel: "Se responder de forma vaga",
        sim: [
          "O que mais te atrai nesse imóvel?",
          "O que essa conquista representa para você?",
          "Quem mais seria beneficiado?",
        ],
        nao: [
          "Como seria o imóvel ideal?",
          "O que gostaria que ele proporcionasse?",
          "Existe alguma região ou característica específica?",
        ],
        transicao: "Então não estamos falando apenas de um imóvel, mas de algo importante para sua vida e sua família.",
        procurar: ["Realização", "Segurança", "Família", "Conforto"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que a estratégia que utiliza hoje é a melhor disponível para conquistar esse imóvel no menor prazo possível e com o menor custo possível?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "Como chegou nessa conclusão?",
          "Você comparou alternativas?",
          "Quando revisou essa estratégia pela última vez?",
          "O que faz acreditar que não existe uma opção melhor?",
        ],
        nao: [
          "O que mais gera incerteza?",
          "Existe algum ponto que ainda não está claro?",
        ],
        transicao: "Normalmente as pessoas sabem que querem comprar um imóvel. Mas poucas sabem se estão utilizando o caminho mais eficiente.",
        procurar: ["Falta de comparação", "Falta de revisão", "Falta de certeza sobre prazo e custo"],
      },
      implicacao: {
        principal: "E se essa compra atrasar cinco anos?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "O que mudaria?",
          "Quem seria impactado?",
          "O que deixaria de viver?",
          "Como se sentiria olhando para trás?",
        ],
        nao: [
          "Então o prazo não é tão relevante?",
          "Se pudesse antecipar faria diferença?",
          "Existe algum sonho ligado a essa conquista?",
        ],
        transicao: "Muitas vezes o custo não está apenas no aluguel, mas nas experiências adiadas.",
        procurar: ["Família", "Sonhos", "Conforto", "Frustração"],
      },
      necessidade: {
        principal: "Se fosse possível descobrir qual o caminho mais eficiente para conquistar esse imóvel e até antecipar essa conquista, faria sentido entender isso?",
        simLabel: "Se responder SIM",
        sim: [
          "O que significaria conquistar esse imóvel antes do previsto?",
          "Como seria ter clareza sobre o valor exato necessário e o prazo real?",
          "Quanto valor teria saber que está utilizando a estratégia mais eficiente?",
        ],
        transicao: "É exatamente esse tipo de clareza que construímos na entrevista.",
        procurar: ["Antecipação", "Clareza de valor e prazo", "Estratégia eficiente"],
      },
    },
  },
  {
    id: "carro", emoji: "🚗", icon: Car, title: "Compra de Carro",
    blocks: {
      situacao: {
        principal: "Qual veículo você gostaria de adquirir e o que ele representaria para você?",
        simLabel: "Se responder claramente",
        naoLabel: "Se responder de forma vaga",
        sim: [
          "O que fez escolher esse modelo?",
          "Existe alguma necessidade específica?",
          "Há quanto tempo pensa nisso?",
        ],
        nao: [
          "Como seria o carro ideal?",
          "O que ele resolveria na sua rotina?",
          "Existe alguma característica indispensável?",
        ],
        transicao: "Interessante. Então existe um objetivo concreto por trás dessa compra.",
        procurar: ["Necessidade", "Conforto", "Mobilidade", "Status"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que a forma que pretende comprar esse carro é a mais inteligente financeiramente?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "O que te dá essa confiança?",
          "Você comparou outras possibilidades?",
          "Existe algum cálculo formal sustentando essa decisão?",
        ],
        nao: [
          "O que mais gera dúvida?",
          "O que ainda não foi definido?",
        ],
        transicao: "Muitas vezes a decisão parece boa, mas nunca foi comparada com outras alternativas.",
        procurar: ["Falta de comparação", "Falta de cálculo formal", "Falta de certeza"],
      },
      implicacao: {
        principal: "E se essa compra atrasar mais alguns anos?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "Como isso afeta sua rotina?",
          "Existe algum desconforto atual?",
          "O que continua acontecendo enquanto esse objetivo não acontece?",
        ],
        nao: [
          "Então o prazo não é importante?",
          "Se pudesse antecipar faria diferença?",
        ],
        transicao: "Às vezes o impacto parece pequeno até colocarmos em perspectiva o tempo perdido.",
        procurar: ["Desconforto", "Tempo", "Rotina", "Frustração"],
      },
      necessidade: {
        principal: "Faria sentido descobrir a forma mais inteligente de chegar nesse carro sem comprometer seus outros objetivos?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria enxergar diferentes cenários antes de tomar uma decisão?",
          "Como seria ter segurança de que essa compra está alinhada com seus objetivos maiores?",
          "Se existisse uma forma mais eficiente, gostaria de conhecê-la?",
        ],
        transicao: "A entrevista serve justamente para comparar possibilidades e tomar decisões melhores.",
        procurar: ["Cenários comparados", "Segurança", "Eficiência", "Equilíbrio entre objetivos"],
      },
    },
  },
  {
    id: "viagens", emoji: "✈️", icon: Plane, title: "Viagens",
    blocks: {
      situacao: {
        principal: "Existe alguma viagem que você sonha em fazer e ainda não conseguiu realizar?",
        sim: [
          "O que torna essa viagem especial?",
          "Quem você gostaria que estivesse junto?",
          "Há quanto tempo pensa nisso?",
          "Existe algum motivo pelo qual ela ainda não aconteceu?",
          "O que essa experiência representaria para você?",
        ],
        nao: [
          "Existe algum lugar que desperta sua curiosidade?",
          "Se pudesse viajar para qualquer lugar hoje, qual escolheria?",
          "Existe alguma experiência que gostaria de proporcionar para sua família?",
        ],
        transicao: "Interessante. Muitas vezes as viagens representam muito mais do que lazer, elas representam experiências e momentos que não voltam.",
        procurar: ["Família", "Experiências", "Sonhos", "Memórias", "Realização"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que essa viagem acontecerá no prazo desejado mantendo exatamente o que faz hoje?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "Como chegou a essa conclusão?",
          "Existe um plano estruturado?",
          "O que poderia atrasar essa realização?",
        ],
        nao: [
          "O que impede ter essa certeza?",
          "O que falta para transformar esse sonho em um projeto?",
        ],
        transicao: "Entre desejar uma viagem e garantir que ela aconteça existe uma grande diferença.",
        procurar: ["Falta de plano estruturado", "Falta de certeza sobre prazo", "Dependência das circunstâncias"],
      },
      implicacao: {
        principal: "E se essa viagem não acontecer nos próximos 5 anos?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "O que você deixaria de viver?",
          "Quem mais seria impactado?",
          "Existe alguma experiência que não poderia ser recuperada depois?",
          "Como se sentiria olhando para trás?",
        ],
        nao: [
          "Então essa viagem não é tão importante?",
          "Se pudesse realizar no próximo ano faria diferença?",
          "Existe alguma experiência ligada à sua família que gostaria de viver enquanto todos estão juntos?",
        ],
        transicao: "Em muitos casos o custo de adiar não está no dinheiro, mas nos momentos que não voltam.",
        procurar: ["Emoção", "Família", "Tempo", "Experiências perdidas"],
      },
      necessidade: {
        principal: "Faria sentido transformar essa viagem em um plano concreto ao invés de deixá-la depender das circunstâncias?",
        simLabel: "Se responder SIM",
        sim: [
          "Como seria saber exatamente quanto precisa acumular?",
          "Quanto valor teria ter uma data real para essa experiência acontecer?",
          "O que mudaria ao transformar esse sonho em um projeto estruturado?",
        ],
        transicao: "É isso que buscamos construir na entrevista.",
        procurar: ["Plano concreto", "Data real", "Projeto estruturado"],
      },
    },
  },
  {
    id: "empreendedorismo", emoji: "🚀", icon: Rocket, title: "Empreendedorismo",
    blocks: {
      situacao: {
        principal: "Existe algum projeto ou negócio que você gostaria de tirar do papel?",
        sim: [
          "Como surgiu essa ideia?",
          "Há quanto tempo ela existe?",
          "O que te atrai nesse projeto?",
          "O que mudaria na sua vida se desse certo?",
        ],
        nao: [
          "Já pensou em ter alguma fonte de renda adicional?",
          "Existe alguma habilidade que gostaria de transformar em negócio?",
          "Existe algo que faria se tivesse mais segurança financeira?",
        ],
        transicao: "Interessante. Muitas vezes existe uma oportunidade que fica parada por anos esperando o momento certo.",
        procurar: ["Sonhos", "Ambição", "Liberdade", "Crescimento"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que conhece todas as informações financeiras necessárias para tirar esse projeto do papel com segurança?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "Como validou isso?",
          "Quem ajudou nessa análise?",
          "Existe algum estudo ou projeção?",
        ],
        nao: [
          "O que mais gera insegurança?",
          "Qual a maior dúvida hoje?",
        ],
        transicao: "Muitas ideias não ficam paradas por falta de capacidade, mas por falta de clareza.",
        procurar: ["Falta de números", "Falta de validação externa", "Falta de clareza"],
      },
      implicacao: {
        principal: "E se esse projeto continuar parado pelos próximos 5 anos?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "O que você deixaria de conquistar?",
          "Como se sentiria?",
          "Existe alguma oportunidade que poderia ser perdida?",
          "Qual seria o custo dessa espera?",
        ],
        nao: [
          "Então ele não é tão importante?",
          "Se estivesse funcionando hoje faria diferença?",
          "Existe alguma realização pessoal ligada a ele?",
        ],
        transicao: "Às vezes o maior risco não é errar, mas nunca executar.",
        procurar: ["Arrependimento", "Oportunidade perdida", "Realização pessoal"],
      },
      necessidade: {
        principal: "Faria sentido descobrir exatamente o que seria necessário para transformar essa ideia em realidade?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria ter clareza dos números antes de correr riscos?",
          "Como seria tomar decisões com mais segurança?",
          "Se existisse um caminho mais rápido para tirar isso do papel, gostaria de enxergá-lo?",
        ],
        transicao: "A entrevista existe para trazer essa clareza.",
        procurar: ["Clareza nos números", "Segurança", "Velocidade de execução"],
      },
    },
  },
  {
    id: "organizacao", emoji: "📊", icon: BarChart3, title: "Organização Financeira",
    blocks: {
      situacao: {
        principal: "Hoje você sente que possui total controle sobre sua vida financeira?",
        sim: [
          "Como realiza esse controle?",
          "O que acompanha mensalmente?",
          "Você mede sua evolução?",
          "Existe alguma área que gostaria de melhorar?",
        ],
        nao: [
          "O que mais gera dificuldade?",
          "Onde sente que perde controle?",
          "Isso gera preocupação?",
        ],
        transicao: "Controlar o dinheiro é importante, mas entender se ele está levando você aos objetivos certos é ainda mais importante.",
        procurar: ["Organização", "Clareza", "Controle"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que seu dinheiro está sendo direcionado da forma mais eficiente possível para os seus objetivos?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "Como chegou nessa conclusão?",
          "Existe alguma análise formal?",
          "Quando revisou isso pela última vez?",
        ],
        nao: [
          "O que mais gera dúvida?",
          "Existe alguma área que gostaria de entender melhor?",
        ],
        transicao: "Controlar o dinheiro e otimizar o dinheiro são coisas diferentes.",
        procurar: ["Falta de análise formal", "Falta de revisão", "Falta de otimização"],
      },
      implicacao: {
        principal: "E se nada mudar nos próximos 10 anos?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "Como isso afetaria seus objetivos?",
          "Qual seria o impacto para sua família?",
          "Como se sentiria?",
        ],
        nao: [
          "Então você está totalmente satisfeito com a situação atual?",
          "Não existe nada que gostaria de melhorar?",
        ],
        transicao: "Pequenos desperdícios repetidos durante anos costumam gerar impactos enormes.",
        procurar: ["Tempo perdido", "Potencial desperdiçado", "Frustração futura"],
      },
      necessidade: {
        principal: "Como seria ter total clareza sobre para onde seu dinheiro está indo e se ele está realmente aproximando você dos seus objetivos?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria enxergar oportunidades que hoje passam despercebidas?",
          "Como seria tomar decisões financeiras com mais confiança?",
          "O que mudaria se você tivesse previsibilidade sobre sua evolução financeira?",
        ],
        transicao: "Esse costuma ser um dos maiores ganhos percebidos pelos clientes.",
        procurar: ["Clareza", "Oportunidades", "Confiança", "Previsibilidade"],
      },
    },
  },
  {
    id: "sem-objetivo", emoji: "❓", icon: HelpCircle, title: "Cliente Sem Objetivo",
    blocks: {
      situacao: {
        principal: "Se dinheiro não fosse um problema, o que você faria imediatamente?",
        simLabel: "Se responder",
        naoLabel: "Se não souber responder",
        sim: [
          "O que torna isso importante?",
          "Há quanto tempo pensa nisso?",
          "O que impede isso de acontecer hoje?",
        ],
        nao: [
          "Já parou para refletir sobre isso?",
          "Existe algo que gostaria de proporcionar para sua família?",
          "Existe alguma experiência que gostaria de viver?",
        ],
        transicao: "Muitas pessoas trabalham para ganhar dinheiro, mas nunca definem exatamente para quê.",
        procurar: ["Sonhos", "Desejos ocultos", "Valores pessoais"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que seu dinheiro hoje está sendo direcionado para construir algo que realmente importa para você?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "O que sustenta essa convicção?",
          "Existe algum objetivo claro por trás disso?",
          "Como acompanha essa evolução?",
        ],
        nao: [
          "O que mais gera dúvida?",
          "Existe alguma direção que gostaria de ter mais clara?",
        ],
        transicao: "Ter dinheiro trabalhando é uma coisa. Ter certeza de que ele caminha para um destino é outra.",
        procurar: ["Falta de destino", "Falta de certeza", "Falta de propósito"],
      },
      implicacao: {
        principal: "E se mais 10 anos passarem da mesma forma?",
        simLabel: "Se reconhecer impacto",
        naoLabel: "Se minimizar",
        sim: [
          "O que deixaria de conquistar?",
          "Como se sentiria?",
        ],
        nao: [
          "Então não existe nada que gostaria de acelerar?",
          "Não existe nenhum sonho importante?",
        ],
        transicao: "O risco não é apenas perder dinheiro. É perder tempo.",
        procurar: ["Tempo", "Arrependimento", "Oportunidades"],
      },
      necessidade: {
        principal: "Faria sentido descobrir quais objetivos realmente fazem sentido para a sua vida e enxergar o caminho mais inteligente para construí-los?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria ter clareza sobre o que você realmente quer construir?",
          "Como seria começar a investir com um propósito definido?",
          "O que mudaria ao ter uma direção concreta para seguir?",
        ],
        transicao: "É exatamente esse ponto de partida que construímos na entrevista.",
        procurar: ["Clareza", "Propósito", "Direção", "Próximos passos"],
      },
    },
  },
  {
    id: "assessor", emoji: "🤝", icon: Handshake, title: "Já Possui Assessor",
    blocks: {
      situacao: {
        principal: "Seu assessor conhece profundamente todos os seus objetivos financeiros?",
        sim: [
          "Com que frequência revisam isso?",
          "Existe um planejamento formal?",
          "Como acompanham a evolução?",
        ],
        nao: [
          "O que normalmente é discutido?",
          "Existe algum objetivo importante que nunca foi tratado?",
        ],
        transicao: "Ter assessor é excelente. A questão é entender o nível de profundidade desse acompanhamento.",
        procurar: ["Planejamento", "Frequência", "Profundidade"],
      },
      problema: {
        principal: "Você tem 100% de certeza de que hoje não existe nenhuma estratégia melhor ou oportunidade relevante que ainda não tenha sido considerada?",
        simLabel: "Se responder SIM",
        naoLabel: "Se responder NÃO",
        sim: [
          "O que sustenta essa convicção?",
          "Quando foi a última revisão profunda?",
          "Você costuma buscar uma segunda visão?",
        ],
        nao: [
          "Existe algo que gostaria de validar?",
          "Existe alguma área que gera dúvida atualmente?",
        ],
        transicao: "A questão não é ter assessor ou não. A questão é saber se tudo continua alinhado ao cenário atual.",
        procurar: ["Falta de revisão profunda", "Falta de segunda visão", "Oportunidades não consideradas"],
      },
      implicacao: {
        principal: "E se algo importante estivesse desalinhado hoje, como você descobriria?",
        simLabel: "Se reconhecer dificuldade",
        naoLabel: "Se responder facilmente",
        sim: [
          "Quanto tempo poderia ser perdido?",
          "Qual seria o impacto?",
        ],
        nao: [
          "Quando foi a última revisão profunda?",
          "Tudo continua alinhado com seus objetivos atuais?",
        ],
        transicao: "O problema raramente é ter assessor. O problema é acreditar que tudo continua correto sem revisar.",
        procurar: ["Confiança excessiva", "Falta de revisão"],
      },
      necessidade: {
        principal: "Faria sentido validar se tudo continua alinhado aos seus objetivos atuais e identificar possíveis oportunidades que ainda não estão sendo aproveitadas?",
        simLabel: "Se responder SIM",
        sim: [
          "Quanto valor teria receber uma segunda visão especializada?",
          "Como seria confirmar que tudo está no caminho ideal?",
          "Se existisse uma melhoria relevante, você gostaria de conhecê-la?",
        ],
        transicao: "A ideia não é substituir nada. É validar e fortalecer o que já existe.",
        procurar: ["Segunda visão", "Validação", "Oportunidades", "Alinhamento"],
      },
    },
  },
];

function Index() {
  const [openGoal, setOpenGoal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedClosing, setCopiedClosing] = useState(false);
  const [openObjection, setOpenObjection] = useState<number | null>(0);
  // Modo de uso: "call" durante ligações (padrão) · "training" para capacitação
  const [callMode, setCallMode] = useState(true);
  const trainingMode = !callMode;

  const scrollToId = (id: string) => {
    const el = typeof document !== "undefined" ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goTraining = () => {
    setCallMode(false);
    setTimeout(() => scrollToId("treinamento"), 60);
  };
  const [query, setQuery] = useState("");
  const [activeQuads, setActiveQuads] = useState<Quadrant[]>(["situacao", "problema", "implicacao", "necessidade"]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [training, setTraining] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bullteam.favs");
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("bullteam.favs", JSON.stringify([...favorites])); } catch {}
  }, [favorites]);

  const toggleFav = (key: string) =>
    setFavorites((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

  const toggleExpand = (key: string) =>
    setExpanded((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

  const toggleTraining = (key: string) =>
    setTraining((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

  const toggleQuad = (q: Quadrant) =>
    setActiveQuads((cur) => (cur.includes(q) ? cur.filter((x) => x !== q) : [...cur, q]));

  // Scroll-spy: detect which journey section is currently in view
  const [activeSection, setActiveSection] = useState<string>("abertura");
  useEffect(() => {
    const ids = [
      "abertura",
      "objetivos",
      "sinais",
      "fechamento-agendamento",
      "fechamento-compromisso",
      "fechamento-comparecimento",
    ];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-200px 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [openGoal]);

  const activeStages = useMemo<number[]>(() => {
    switch (activeSection) {
      case "abertura":
        return [1, 2];
      case "objetivos":
        return openGoal ? [4] : [3];
      case "sinais":
        return [5];
      case "fechamento-agendamento":
        return [6];
      case "fechamento-compromisso":
        return [7];
      case "fechamento-comparecimento":
        return [8];
      default:
        return [1];
    }
  }, [activeSection, openGoal]);

  const jumpToStage = (stage: number) => {
    const map: Record<number, string> = {
      1: "abertura",
      2: "abertura",
      3: "objetivos",
      4: "objetivos",
      5: "sinais",
      6: "fechamento-agendamento",
      7: "fechamento-compromisso",
      8: "fechamento-comparecimento",
    };
    scrollToId(map[stage]);
  };

  const toggleGoal = (id: string) => {
    setOpenGoal((cur) => (cur === id ? null : id));
    // Garantir que o roteiro fique visível logo abaixo do card tocado
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`goal-panel-${id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    });
  };

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const copyClosingScript = async () => {
    try {
      await navigator.clipboard.writeText(CLOSING_SCRIPT);
      setCopiedClosing(true);
      setTimeout(() => setCopiedClosing(false), 2200);
    } catch {
      // ignore
    }
  };

  // Busca global: percorre principal + sim + nao + procurar de cada script
  const q = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return null;
    const results: { goal: Goal; matches: { quadrant: Quadrant; script: Script }[] }[] = [];
    for (const g of GOALS) {
      const titleHit = g.title.toLowerCase().includes(q);
      const matches: { quadrant: Quadrant; script: Script }[] = [];
      for (const quad of QUADRANTS) {
        const s = g.blocks[quad.key];
        const haystack = [s.principal, s.transicao, ...s.sim, ...(s.nao ?? []), ...s.procurar].join(" \n ").toLowerCase();
        if (titleHit || haystack.includes(q)) {
          matches.push({ quadrant: quad.key, script: s });
        }
      }
      if (matches.length) results.push({ goal: g, matches });
    }
    return results;
  }, [q]);

  return (
    <div className={`min-h-dvh bg-[var(--surface)] text-foreground pb-24 ${callMode ? "text-[17px] sm:text-[18px]" : ""}`}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-[var(--navy)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <header className="relative overflow-hidden bg-gradient-to-br from-[var(--navy)] via-[var(--navy)] to-[#0b1c3a] text-white motion-reduce:bg-[var(--navy)]">
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--brand)]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[var(--success)]/20 blur-3xl" />
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-8 sm:pt-16 sm:pb-12 relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              {trainingMode ? "Modo Treinamento ativo" : "Guia ao vivo · pronto para a ligação"}
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="mr-2">🐂</span>Bull Team
            </h1>
            <p className="mt-2 text-lg sm:text-xl text-white/85 font-medium">
              Guia de Agendamento de Entrevista
            </p>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
              Faça as perguntas certas. Gere consciência. Agende mais entrevistas.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/recomendacoes"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/50 bg-[var(--success)]/15 px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--success)]/25 transition"
              >
                <span aria-hidden>🎯</span>
                Passo a Passo de Recomendações
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </header>

      {/* Sticky journey bar */}
      <JourneyBar activeStages={activeStages} onJump={jumpToStage} />

      {/* Sticky control bar */}
      <nav aria-label="Controles de navegação" className="sticky top-[116px] sm:top-[120px] z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar perguntas, objetivos ou palavras-chave (ex: família)"
                aria-label="Busca global"
                className="w-full min-h-11 rounded-xl border border-border bg-white pl-9 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
              />
            </div>
            <div
              role="tablist"
              aria-label="Modo de uso"
              className="shrink-0 inline-flex items-center rounded-xl border border-border bg-[var(--surface)] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={callMode}
                onClick={() => setCallMode(true)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition motion-reduce:transition-none ${
                  callMode
                    ? "bg-[var(--success)] text-[var(--navy)] shadow-sm shadow-[var(--success)]/30"
                    : "text-muted-foreground hover:text-[var(--navy)]"
                }`}
              >
                <Headphones aria-hidden className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">🎯 Modo Ligação</span>
                <span className="sm:hidden">🎯 Ligação</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={trainingMode}
                onClick={() => setCallMode(false)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition motion-reduce:transition-none ${
                  trainingMode
                    ? "bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/30"
                    : "text-muted-foreground hover:text-[var(--navy)]"
                }`}
              >
                <GraduationCap aria-hidden className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">🎓 Modo Treinamento</span>
                <span className="sm:hidden">🎓 Treino</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto">
            {!callMode && (
              <ol className="flex items-center gap-1.5 text-xs shrink-0">
                {FLOW.map((step, i) => (
                  <li key={step} className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-white">{i + 1}</span>
                      <span className="font-medium text-[var(--navy)] whitespace-nowrap">{step}</span>
                    </div>
                    {i < FLOW.length - 1 && <ArrowRight aria-hidden className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                  </li>
                ))}
              </ol>
            )}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <Filter aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
              {QUADRANTS.map((quad) => {
                const active = activeQuads.includes(quad.key);
                return (
                  <button
                    key={quad.key}
                    type="button"
                    onClick={() => toggleQuad(quad.key)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition motion-reduce:transition-none ${
                      active ? quad.chip : "border-border bg-white text-muted-foreground"
                    }`}
                    title={quad.label}
                  >
                    <span aria-hidden>{quad.emoji}</span>
                    <span className="hidden sm:inline">{quad.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main id="conteudo" className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
        <div className="space-y-6 sm:space-y-10">
          {searchResults && (
            <section aria-label="Resultados da busca">
              <div className="rounded-3xl border-2 border-[var(--brand)] bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--navy)]">
                    🔎 Resultados para "<span className="text-[var(--brand)]">{query}</span>"
                  </h2>
                  <button type="button" onClick={() => setQuery("")} className="text-xs font-semibold text-muted-foreground hover:text-[var(--navy)]">
                    Limpar
                  </button>
                </div>
                {searchResults.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">Nenhuma pergunta encontrada. Tente outro termo.</p>
                ) : (
                  <div className="mt-4 space-y-5">
                    {searchResults.map(({ goal, matches }) => (
                      <div key={goal.id}>
                        <div className="flex items-center gap-2 text-sm font-bold text-[var(--navy)]">
                          <span aria-hidden>{goal.emoji}</span>
                          <span>{goal.title}</span>
                          <span className="text-xs font-medium text-muted-foreground">· {matches.length} {matches.length === 1 ? "roteiro" : "roteiros"}</span>
                        </div>
                        <div className="mt-2 space-y-3">
                          {matches
                            .filter((m) => activeQuads.includes(m.quadrant))
                            .map((m) => {
                              const quad = QUADRANTS.find((x) => x.key === m.quadrant)!;
                              const key = `${goal.id}|${m.quadrant}`;
                              return (
                                <ScriptCard
                                  key={key}
                                  fullKey={key}
                                  script={m.script}
                                  quadrant={quad}
                                  contextLabel={`${goal.emoji} ${goal.title}`}
                                  expanded={expanded.has(key)}
                                  onToggle={() => toggleExpand(key)}
                                  favorited={favorites.has(key)}
                                  onFav={() => toggleFav(key)}
                                  training={training.has(key)}
                                  onTraining={() => toggleTraining(key)}
                                  callMode={callMode}
                                />
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {!searchResults && favorites.size > 0 && (
            <section aria-label="Roteiros favoritos">
              <div className="rounded-3xl border-2 border-[var(--warn)] bg-gradient-to-br from-[#FFFBEB] to-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Pin aria-hidden className="h-4 w-4 text-[var(--warn)]" />
                  <h2 className="text-base sm:text-lg font-bold text-[var(--navy)]">📌 Seus roteiros favoritos</h2>
                  <span className="ml-auto text-xs font-semibold text-muted-foreground">{favorites.size}</span>
                </div>
                <div className="mt-3 space-y-3">
                  {[...favorites].map((key) => {
                    const [goalId, quadKey] = key.split("|");
                    const goal = GOALS.find((g) => g.id === goalId);
                    const quad = QUADRANTS.find((x) => x.key === (quadKey as Quadrant));
                    if (!goal || !quad || !activeQuads.includes(quad.key)) return null;
                    const script = goal.blocks[quad.key];
                    return (
                      <ScriptCard
                        key={key}
                        fullKey={key}
                        script={script}
                        quadrant={quad}
                        contextLabel={`${goal.emoji} ${goal.title}`}
                        expanded={expanded.has(key)}
                        onToggle={() => toggleExpand(key)}
                        favorited
                        onFav={() => toggleFav(key)}
                        training={training.has(key)}
                        onTraining={() => toggleTraining(key)}
                        callMode={callMode}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {trainingMode && !searchResults && (
            <section id="treinamento" aria-labelledby="psy-title" className="scroll-mt-44">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-10 text-white shadow-2xl shadow-[var(--brand)]/20">
                <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-[var(--brand)]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[var(--success)]/15 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
                    <Sparkles aria-hidden className="h-3 w-3 text-[var(--success)]" />
                    Treinamento · Fundamento da metodologia
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <div aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#5a8cff] text-white shadow-lg shadow-[var(--brand)]/40">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 id="psy-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                        🧠 Psicologia da Entrevista
                      </h2>
                      <p className="mt-2 text-base sm:text-lg text-white/80 leading-snug">
                        O que realmente faz uma pessoa aceitar uma entrevista estratégica?
                      </p>
                    </div>
                  </div>

                  <ol className="mt-7 grid gap-3 sm:grid-cols-2">
                    {PSYCHOLOGY_PRINCIPLES.map((p, i) => (
                      <li
                        key={p.title}
                        className="group flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-[var(--success)]/40 hover:bg-white/10 motion-reduce:transition-none"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-sm font-extrabold text-[var(--navy)] shadow-md shadow-[var(--success)]/30">
                          {i + 1}
                        </span>
                        <div>
                          <p className="flex items-start gap-1.5 text-[15px] font-bold leading-snug">
                            <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                            <span>{p.title}</span>
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/75">{p.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <figure className="mt-8 relative overflow-hidden rounded-2xl border border-[var(--success)]/40 bg-gradient-to-br from-black/40 via-[var(--navy)] to-black/40 p-6 sm:p-8">
                    <Quote aria-hidden className="absolute -top-2 -left-1 h-16 w-16 text-[var(--success)]/15" />
                    <div className="relative">
                      <blockquote className="text-xl sm:text-2xl font-bold leading-snug">
                        <p>"O objetivo da ligação não é convencer o cliente.</p>
                        <p className="mt-1 text-white/90">
                          O objetivo da ligação é ajudá-lo a perceber algo que ainda não havia percebido."
                        </p>
                      </blockquote>
                      <figcaption className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--success)]">
                        <span aria-hidden>🐂</span> Filosofia Comercial Bull Team
                      </figcaption>
                    </div>
                  </figure>
                </div>
              </div>
            </section>
          )}

          {trainingMode && !searchResults && (
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
          )}

          {trainingMode && !searchResults && (
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
          )}

          {trainingMode && !searchResults && (
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
          )}

          {!searchResults && (
            <section id="abertura" aria-labelledby="friend-title" className="scroll-mt-44">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-10 text-white shadow-2xl shadow-[var(--brand)]/20">
                <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-[var(--brand)]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[var(--success)]/15 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
                    <span aria-hidden>☎️</span>
                    Porta de entrada · antes dos objetivos
                  </div>
                  <div className="mt-5 flex items-start gap-4">
                    <div aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--success)] to-[#3ccf6d] text-[var(--navy)] shadow-lg shadow-[var(--success)]/40">
                      <Handshake className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 id="friend-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Abertura da Ligação
                      </h2>
                      <p className="mt-2 text-base sm:text-lg text-white/80 leading-snug">
                        Roteiro inicial: conexão, autoridade, convite e descoberta — antes de entrar no SPIN.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 relative">
                    <div aria-hidden className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--brand)] via-[var(--success)] to-[var(--brand)]/40 sm:left-[23px]" />
                    <ol className="relative space-y-6">
                      {FRIEND_CALL_STEPS.map((step, i) => (
                        <li key={step.id} className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6">
                          <span className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[#5a8cff] text-sm sm:text-base font-extrabold text-white shadow-lg shadow-[var(--brand)]/40">
                            {step.number}
                          </span>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur transition hover:border-[var(--success)]/40 hover:bg-white/10 motion-reduce:transition-none">
                            <div className="flex flex-col gap-1">
                              <h3 className="text-lg sm:text-xl font-bold tracking-tight">{step.title}</h3>
                              {step.subtitle && (
                                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[var(--success)]">{step.subtitle}</p>
                              )}
                            </div>
                            {step.objective && (
                              <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/85">
                                <span className="font-semibold text-white">Objetivo: </span>
                                {step.objective}
                              </p>
                            )}
                            {step.quote && (
                              <blockquote className="mt-4 border-l-4 border-[var(--success)] pl-4 text-sm sm:text-base font-medium leading-relaxed text-white/95 italic">
                                “{step.quote}”
                              </blockquote>
                            )}
                            {"doList" in step && step.doList && (
                              <div className="mt-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">❓ O que fazer</p>
                                <ul className="mt-2 space-y-2">
                                  {step.doList.map((b, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed text-white/85">
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success)]" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {"goodExamples" in step && step.goodExamples && (
                              <div className="mt-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">✅ Bons exemplos</p>
                                <ul className="mt-2 space-y-1.5">
                                  {step.goodExamples.map((b, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed text-white/90">“{b}”</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {"avoid" in step && step.avoid && (
                              <div className="mt-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">❌ Evite</p>
                                <ul className="mt-2 space-y-1.5">
                                  {step.avoid.map((b, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-white/90">
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {"quickFollowUps" in step && step.quickFollowUps && (
                              <div className="mt-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">⚡ Se responder rapidamente</p>
                                <ul className="mt-2 space-y-1.5">
                                  {step.quickFollowUps.map((b, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-white/85">
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {"slowFollowUps" in step && step.slowFollowUps && (
                              <div className="mt-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">🤔 Se não souber responder</p>
                                <ul className="mt-2 space-y-1.5">
                                  {step.slowFollowUps.map((b, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-white/85">
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warn)]" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {"transition" in step && step.transition && (
                              <blockquote className="mt-4 border-l-4 border-[var(--brand)] pl-4 text-sm sm:text-base font-medium leading-relaxed text-white/95 italic">
                                ➡️ “{step.transition}”
                              </blockquote>
                            )}
                            {step.why && (
                              <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">🎓 Por que essa etapa existe?</p>
                                <p className="mt-1.5 text-sm leading-relaxed text-white/85">{step.why}</p>
                              </div>
                            )}
                            {step.note && (
                              <p className="mt-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3 text-xs sm:text-sm font-medium text-white/90">
                                ✅ {step.note}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!searchResults && (
            <section id="objetivos" aria-labelledby="goals-title" className="scroll-mt-44">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 id="goals-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)]">
                    🎯 Escolha o Objetivo Principal do Cliente
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground">Toque um cartão para abrir o roteiro completo.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3">
                {GOALS.map((g) => {
                  const open = openGoal === g.id;
                  const panelId = `goal-panel-${g.id}`;
                  return (
                    <Fragment key={g.id}>
                    <button
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      aria-expanded={open}
                      aria-controls={panelId}
                      className={`group relative flex min-h-[120px] sm:min-h-[152px] flex-col items-start justify-between gap-3 overflow-hidden rounded-3xl border p-4 sm:p-6 text-left transition-all motion-reduce:transition-none ${
                        open
                          ? "border-[var(--brand)] bg-gradient-to-br from-[var(--brand)]/10 via-white to-[var(--brand)]/5 shadow-xl shadow-[var(--brand)]/15 ring-1 ring-[var(--brand)]/30"
                          : "border-border bg-white hover:border-[var(--brand)]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--brand)]/10 motion-reduce:hover:translate-y-0"
                      }`}
                    >
                      <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl text-2xl sm:text-3xl transition ${
                        open ? "bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/30" : "bg-[var(--surface)] text-[var(--navy)] group-hover:bg-[var(--brand)]/10"
                      }`}>
                        <span aria-hidden>{g.emoji}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--navy)] text-[15px] sm:text-lg leading-tight">{g.title}</p>
                        <p className={`mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider ${open ? "text-[var(--brand)]" : "text-muted-foreground"}`}>
                          {open ? "Roteiro aberto ↓" : "Tocar para abrir →"}
                        </p>
                      </div>
                      {g.highConversion && (
                        <span
                          className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-rose-500/30"
                          aria-label="Alta Conversão"
                        >
                          <Flame className="h-3 w-3" aria-hidden />
                          Alta Conversão
                        </span>
                      )}
                    </button>
                    {open && (
                      <div
                        className="col-span-2 sm:col-span-3"
                        id={panelId}
                        role="region"
                        aria-label="Roteiro do objetivo selecionado"
                      >
                        <GoalBlocks
                          goal={g}
                          activeQuads={activeQuads}
                          expanded={expanded}
                          toggleExpand={toggleExpand}
                          favorites={favorites}
                          toggleFav={toggleFav}
                          training={training}
                          toggleTraining={toggleTraining}
                          callMode={callMode}
                        />
                      </div>
                    )}
                    </Fragment>
                  );
                })}
              </div>

            </section>
          )}

          {trainingMode && !searchResults && (
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
          )}

          {trainingMode && !searchResults && (
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
                  <div className="rounded-2xl border border-[var(--success)]/30 p-5" style={{ backgroundColor: "color-mix(in oklab, var(--success) 8%, white)" }}>
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
          )}

          {trainingMode && !searchResults && (
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
          )}

          {!searchResults && (
            <section id="sinais" aria-labelledby="sinais-title" className="scroll-mt-44">
              <div className="rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--warn)]/15 text-[var(--warn)]">
                    <TrafficCone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 id="sinais-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">
                      🚦 Sinais de Compra
                    </h2>
                    <p className="text-sm text-muted-foreground">Quando ouvir <span className="font-bold text-[var(--navy)]">duas ou mais</span>, avance para o agendamento.</p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {BUYING_SIGNALS.map((s) => (
                    <li key={s} className="flex items-start gap-2 rounded-xl border border-border bg-[var(--surface)] px-3 py-2.5 text-[15px] text-[var(--navy)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warn)]" />
                      <span className="leading-snug">"{s}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
        )}

          {!searchResults && (
            <section id="fechamento" aria-labelledby="closing-title" className="scroll-mt-44">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[var(--navy)] via-[#0e2040] to-[#071225] p-6 sm:p-10 text-white shadow-2xl shadow-[var(--brand)]/20">
                <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[var(--brand)]/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[var(--success)]/20 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                    Último passo da ligação
                  </div>
                  <h2 id="closing-title" className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                    📅 Fechamento e Agendamento
                  </h2>
                  <p className="mt-2 text-white/70 max-w-2xl">
                    Conduza o cliente desde a aceitação da entrevista até a confirmação final da reunião.
                  </p>

                  <div className="mt-8 space-y-6">
                    {/* 1️⃣ Tirar o Doce */}
                    <div id="fechamento-agendamento" className="scroll-mt-44 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-lg shadow-lg shadow-[var(--brand)]/30">🍬</span>
                        <div>
                          <h3 className="text-lg font-bold">Tirar o Doce</h3>
                          <p className="text-xs text-white/60">Aumentar valor percebido da entrevista</p>
                        </div>
                      </div>
                      <p className="mt-4 text-[15px] leading-relaxed text-white/85">
                        &ldquo;Hoje muitas pessoas querem melhorar a aposentadoria, comprar um imóvel com mais eficiência, investir melhor, organizar a vida financeira ou conquistar independência financeira.
                        <br /><br />
                        Por isso a procura por planejamento financeiro aumentou muito.
                        <br /><br />
                        Os especialistas possuem uma agenda bastante concorrida e poucos horários realmente disponíveis.
                        <br /><br />
                        Por isso precisamos encontrar um horário que faça sentido para você e que você realmente consiga participar.&rdquo;
                      </p>
                    </div>

                    {/* 2️⃣ Sondar a Agenda */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-lg shadow-lg shadow-[var(--success)]/30">🗓️</span>
                        <div>
                          <h3 className="text-lg font-bold">Entender a Rotina do Cliente</h3>
                          <p className="text-xs text-white/60">Encontrar um horário de qualidade</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-[var(--success)]">✅ Perguntas recomendadas</p>
                          <ul className="mt-3 space-y-2 text-sm text-white/90">
                            <li>• Que horas você costuma entrar e sair do trabalho?</li>
                            <li>• O que normalmente faz depois do expediente?</li>
                            <li>• Onde mora e onde trabalha?</li>
                            <li>• Existe alguma atividade fixa durante a semana?</li>
                            <li>• Como costuma ser sua rotina à noite?</li>
                          </ul>
                          <p className="mt-3 text-xs text-white/60 italic">
                            &ldquo;O objetivo não é perguntar disponibilidade. O objetivo é entender a rotina para encontrar o melhor horário.&rdquo;
                          </p>
                        </div>
                        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-[var(--danger)]">❌ Evite perguntar</p>
                          <ul className="mt-3 space-y-2 text-sm text-white/90">
                            <li>• Como anda sua agenda?</li>
                            <li>• Como funcionam seus horários?</li>
                            <li>• Qual horário você pode?</li>
                          </ul>
                          <p className="mt-3 text-xs text-white/60 italic">
                            &ldquo;Perguntas genéricas normalmente geram respostas genéricas.&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3️⃣ Definição do Horário */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--warn)] text-[var(--navy)] text-lg shadow-lg shadow-[var(--warn)]/30">⏰</span>
                        <div>
                          <h3 className="text-lg font-bold">Escolha do Horário</h3>
                          <p className="text-xs text-white/60">Assumir o controle da agenda</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 p-5">
                        <p className="text-sm text-white/70 mb-3">Ao invés de perguntar:</p>
                        <p className="text-base font-medium text-white/90">&ldquo;Quando você pode?&rdquo;</p>
                        <div className="my-3 h-px bg-white/10" />
                        <p className="text-sm text-white/70 mb-3">Utilizar:</p>
                        <p className="text-base font-bold text-white">
                          &ldquo;Tenho disponibilidade na terça às 19h ou quarta às 18h. Qual funciona melhor para você?&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* 4️⃣ Agendar com Qualidade */}
                    <div id="fechamento-compromisso" className="scroll-mt-44 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-lg shadow-lg shadow-[var(--success)]/30">🤝</span>
                        <div>
                          <h3 className="text-lg font-bold">Compromisso com a Reunião</h3>
                          <p className="text-xs text-white/60">Reduzir faltas</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {[
                          "Você tem certeza de que nesse dia e horário não existe nenhum compromisso marcado?",
                          "Posso contar com sua palavra de que estará presente?",
                          "Fazendo chuva ou sol, conseguimos manter esse compromisso?",
                          "Esse horário realmente funciona para você?",
                        ].map((q) => (
                          <div key={q} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/90">
                            <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                            <span>{q}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 p-3 text-xs font-medium text-white/90 text-center">
                        &ldquo;O objetivo não é pressionar. É garantir comprometimento.&rdquo;
                      </p>
                    </div>

                    {/* 5️⃣ Formalização */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-lg shadow-lg shadow-[var(--brand)]/30">📧</span>
                        <div>
                          <h3 className="text-lg font-bold">Formalização da Reunião</h3>
                          <p className="text-xs text-white/60">Coletar os dados de forma natural</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 p-5">
                        <p className="text-sm text-white/70 mb-3">Ao invés de pedir autorização:</p>
                        <p className="text-base font-bold text-white">&ldquo;Qual o seu melhor e-mail?&rdquo;</p>
                        <div className="my-3 h-px bg-white/10" />
                        <p className="text-xs text-white/60 italic">
                          &ldquo;O e-mail serve para formalizar a reunião e não para confirmar interesse.&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* 6️⃣ Reforço de Valor */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--warn)] text-[var(--navy)] text-lg shadow-lg shadow-[var(--warn)]/30">💎</span>
                        <div>
                          <h3 className="text-lg font-bold">Reforçar o Valor da Entrevista</h3>
                          <p className="text-xs text-white/60">Fazer o cliente encerrar a ligação acreditando no valor</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {[
                          "Você sairá da entrevista sabendo exatamente onde está e quais são os próximos passos.",
                          "Vamos transformar seus objetivos em números e cenários concretos.",
                          "Você terá uma visão clara do caminho mais eficiente para chegar onde deseja.",
                          "Mesmo que não exista continuidade, você receberá um diagnóstico financeiro muito mais claro do que possui hoje.",
                        ].map((q) => (
                          <div key={q} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/90">
                            <Star aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warn)]" />
                            <span>{q}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 rounded-xl border border-[var(--warn)]/30 bg-[var(--warn)]/10 p-4 text-sm font-semibold text-white/95 text-center">
                        &ldquo;O cliente deve encerrar a ligação acreditando que essa pode ser uma das reuniões mais importantes da vida financeira dele.&rdquo;
                      </p>
                    </div>

                    {/* 7️⃣ Resumo do Processo */}
                    <div id="fechamento-comparecimento" className="scroll-mt-44 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-lg shadow-lg shadow-[var(--success)]/30">📋</span>
                        <div>
                          <h3 className="text-lg font-bold">O Que Acontece Agora</h3>
                          <p className="text-xs text-white/60">Deixar o cliente animado para a reunião</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 text-white/90 leading-relaxed whitespace-pre-line">
                        {CLOSING_SCRIPT}
                      </div>
                      <button
                        type="button"
                        onClick={copyClosingScript}
                        aria-live="polite"
                        className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--success)] px-5 py-3 text-sm font-semibold text-[var(--navy)] shadow-lg shadow-[var(--success)]/25 transition hover:brightness-105 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
                      >
                        {copiedClosing ? <Check aria-hidden className="h-4 w-4" /> : <ClipboardCopy aria-hidden className="h-4 w-4" />}
                        {copiedClosing ? "Script copiado!" : "📌 Copiar Script"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>

        <aside aria-label="Painel de apoio" className="mt-6 lg:mt-0">
          <div className="lg:sticky lg:top-32 space-y-4">
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
                Conduza o cliente até os níveis <span className="font-bold">3 ou 4</span> antes de convidar para a entrevista.
              </p>
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

      {/* Barra de navegação fixa — sempre visível */}
      <nav
        aria-label="Navegação rápida"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-[0_-8px_24px_-12px_rgba(11,28,58,0.18)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 py-2 sm:px-6">
          {[
            { id: "abertura", icon: Handshake, label: "Abertura", emoji: "🤝", action: () => scrollToId("abertura") },
            { id: "objetivos", icon: Target, label: "Objetivos", emoji: "🏠", action: () => scrollToId("objetivos") },
            { id: "sinais", icon: TrafficCone, label: "Sinais", emoji: "🚦", action: () => scrollToId("sinais") },
            { id: "fechamento", icon: Sparkles, label: "Agendamento", emoji: "📅", action: () => scrollToId("fechamento") },
            { id: "treinamento", icon: GraduationCap, label: "Treinamento", emoji: "🎓", action: goTraining, highlight: trainingMode },
          ].map((item) => {
            const Icon = item.icon;
            const active = (item as { highlight?: boolean }).highlight;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={`group flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-semibold transition motion-reduce:transition-none ${
                  active
                    ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "text-muted-foreground hover:bg-[var(--surface)] hover:text-[var(--navy)]"
                }`}
              >
                <Icon aria-hidden className="h-4 w-4 sm:hidden" />
                <span aria-hidden className="hidden text-base leading-none sm:inline">{item.emoji}</span>
                <span className="leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function GoalBlocks({
  goal, activeQuads, expanded, toggleExpand, favorites, toggleFav, training, toggleTraining, callMode,
}: {
  goal: Goal;
  activeQuads: Quadrant[];
  expanded: Set<string>;
  toggleExpand: (k: string) => void;
  favorites: Set<string>;
  toggleFav: (k: string) => void;
  training: Set<string>;
  toggleTraining: (k: string) => void;
  callMode: boolean;
}) {
  const firstCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = firstCardRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  const filtered = QUADRANTS.filter((q) => activeQuads.includes(q.key));

  return (
    <div className="rounded-3xl border border-border bg-white p-4 sm:p-7 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-2xl" aria-hidden>{goal.emoji}</span>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--navy)]">{goal.title}</h3>
      </div>

      <div className="space-y-4">
        {filtered.map((quad, i) => {
          const key = `${goal.id}|${quad.key}`;
          const script = goal.blocks[quad.key];
          const isFirst = i === 0;
          return (
            <div key={quad.key} ref={isFirst ? firstCardRef : undefined}>
              {!callMode && (
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: quad.color }}>
                  <span aria-hidden>{quad.emoji}</span>
                  <span>{quad.label}</span>
                  <span className="text-muted-foreground font-medium normal-case tracking-normal">· {SPIN_OBJECTIVES[quad.key]}</span>
                </div>
              )}
              {!callMode && quad.key === "necessidade" && (
                <div className="mb-2 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 px-3 py-2 text-[12px] leading-snug text-[var(--navy)]">
                  <p className="font-bold text-[var(--success)] uppercase tracking-wide text-[11px]">🟢 Regra da Necessidade</p>
                  <p className="mt-1 font-medium">
                    Pare de explorar problemas. Faça o cliente <strong>visualizar ganhos</strong>: clareza, previsibilidade, velocidade, segurança e tranquilidade — até desejar a Entrevista Estratégica Financeira.
                  </p>
                </div>
              )}
              {!callMode && quad.key === "problema" && (
                <div className="mb-2 rounded-xl border border-[var(--warn)]/40 bg-[var(--warn)]/5 px-3 py-2 text-[12px] leading-snug text-[var(--navy)]">
                  <p className="font-bold uppercase tracking-wide text-[11px] text-[#8a5a00]">🧠 Princípio da Incerteza Elegante</p>
                  <p className="mt-1 font-medium">
                    Não tente provar que o cliente está errado. Leve-o a perceber que talvez ele não tenha todas as respostas. A entrevista existe porque pode existir uma forma melhor — não porque ele está errando.
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-[#8a5a00]">As melhores respostas nesta etapa:</p>
                  <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-[var(--navy)]">
                    <li>✅ "Nunca tinha pensado nisso."</li>
                    <li>✅ "Boa pergunta."</li>
                    <li>✅ "Não tenho certeza."</li>
                    <li>✅ "Nunca comparei dessa forma."</li>
                    <li>✅ "Nunca calculei isso."</li>
                  </ul>
                </div>
              )}
              <ScriptCard
                fullKey={key}
                script={script}
                quadrant={quad}
                expanded={expanded.has(key)}
                onToggle={() => toggleExpand(key)}
                favorited={favorites.has(key)}
                onFav={() => toggleFav(key)}
                training={training.has(key)}
                onTraining={() => toggleTraining(key)}
                callMode={callMode}
                isFirst={isFirst}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScriptCard({
  script, quadrant, expanded, onToggle, favorited, onFav, training, onTraining, callMode, contextLabel, isFirst,
}: {
  fullKey: string;
  script: Script;
  quadrant: (typeof QUADRANTS)[number];
  expanded: boolean;
  onToggle: () => void;
  favorited: boolean;
  onFav: () => void;
  training: boolean;
  onTraining: () => void;
  callMode: boolean;
  contextLabel?: string;
  isFirst?: boolean;
}) {
  const [showHighlight, setShowHighlight] = useState(isFirst ?? false);

  useEffect(() => {
    if (!isFirst) return;
    const t = setTimeout(() => setShowHighlight(false), 2600);
    return () => clearTimeout(t);
  }, [isFirst]);

  const isImportant = quadrant.key === "implicacao";
  const isHigh = isHighConversion(script.principal);
  const isKillerQ = isKiller(script.principal);
  const simLabel = script.simLabel ?? "Se responder SIM";
  const naoLabel = script.naoLabel ?? "Se responder NÃO";

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm transition ${showHighlight ? "ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-white animate-pulse" : ""} ${
        isKillerQ
          ? "border-2 border-[var(--warn)] shadow-lg shadow-[var(--warn)]/20"
          : isImportant
          ? "border-2 border-[var(--danger)] shadow-md shadow-[var(--danger)]/10"
          : "border-border"
      }`}
    >
      <div className={`p-3 sm:p-4 ${
        isKillerQ
          ? "bg-gradient-to-br from-[#FFFBEB] via-white to-[#FFF1ED] rounded-t-2xl"
          : isImportant
          ? "bg-gradient-to-br from-[#FFF1ED] via-white to-[#FFF6E8] rounded-t-2xl"
          : ""
      }`}>
        {contextLabel && (
          <p className="text-[11px] font-semibold text-muted-foreground mb-1">{contextLabel}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${quadrant.chip}`}>
            <span aria-hidden>{quadrant.emoji}</span> {quadrant.label}
          </span>
          {isKillerQ && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--warn)] to-[#FFB020] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--navy)] shadow-sm"
              title="Uma das 3 perguntas de maior impacto deste objetivo"
            >
              <span aria-hidden>⭐⭐⭐⭐⭐</span> Pergunta Matadora
            </span>
          )}
          {isImportant && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--danger)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              <Star className="h-3 w-3" aria-hidden /> Mais Importante
            </span>
          )}
          {isHigh && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warn)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8a5a00]">
              🔥 Alta Conversão
            </span>
          )}
        </div>
        <p className={`mt-2 font-semibold text-[var(--navy)] leading-snug ${callMode ? "text-lg sm:text-2xl" : "text-[15px] sm:text-lg"}`}>
          ❓ {script.principal}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--navy)] transition hover:border-[var(--brand)] motion-reduce:transition-none"
          >
            <ChevronDown aria-hidden className={`h-3.5 w-3.5 transition ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Ocultar Exploração" : "Mostrar Exploração"}
          </button>
          <button
            type="button"
            onClick={onFav}
            aria-pressed={favorited}
            aria-label={favorited ? "Remover dos favoritos" : "Favoritar roteiro"}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition motion-reduce:transition-none ${
              favorited
                ? "border-[var(--warn)] bg-[var(--warn)] text-[var(--navy)]"
                : "border-border bg-white text-muted-foreground hover:border-[var(--warn)]"
            }`}
          >
            <Pin aria-hidden className="h-3.5 w-3.5" />
            {favorited ? "Favoritado" : "Favoritar"}
          </button>
          {!callMode && (
          <button
            type="button"
            onClick={onTraining}
            aria-pressed={training}
            aria-label="Por que essa pergunta existe"
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition motion-reduce:transition-none ${
              training
                ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/30"
                : "border-border bg-white text-[var(--brand)] hover:border-[var(--brand)]"
            }`}
          >
            <GraduationCap aria-hidden className="h-3.5 w-3.5" />
            🎓 Por que essa pergunta existe?
          </button>
          )}
        </div>

        {!callMode && training && (
          <div className="mt-3 relative overflow-hidden rounded-xl border border-[var(--brand)]/30 bg-gradient-to-br from-[#EEF4FF] via-white to-[#F5F0FF] p-4 shadow-inner">
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--brand)]/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div aria-hidden className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand)]">
                  Modo Treinamento · Psicologia da Pergunta
                </p>
              </div>
              <p className={`mt-2 leading-relaxed text-[var(--navy)] ${callMode ? "text-base" : "text-sm"}`}>
                {getExplanation(script.principal, quadrant.key)}
              </p>
            </div>
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-border bg-[var(--surface)] p-3 sm:p-4 space-y-3 rounded-b-2xl">
          <ExplorationList
            label={`✅ ${simLabel}`}
            items={script.sim}
            tone="success"
            callMode={callMode}
          />
          {script.nao && script.nao.length > 0 && (
            <ExplorationList
              label={`❌ ${naoLabel}`}
              items={script.nao}
              tone="danger"
              callMode={callMode}
            />
          )}
          <div className="rounded-lg border border-[var(--brand)]/30 p-3" style={{ backgroundColor: "color-mix(in oklab, var(--brand) 8%, white)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--brand)]">🎤 Transição</p>
            <p className={`mt-1 font-medium text-[var(--navy)] leading-snug ${callMode ? "text-base" : "text-sm"}`}>"{script.transicao}"</p>
          </div>
          {!callMode && script.procurar.length > 0 && (
            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">💡 O que procurar</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {script.procurar.map((p) => (
                  <span key={p} className="inline-flex items-center rounded-full bg-[var(--surface)] border border-border px-2.5 py-0.5 text-xs font-medium text-[var(--navy)]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExplorationList({
  label, items, tone, callMode,
}: {
  label: string;
  items: string[];
  tone: "success" | "danger";
  callMode: boolean;
}) {
  const colorVar = tone === "success" ? "var(--success)" : "var(--danger)";
  return (
    <div className="rounded-lg border p-3" style={{
      borderColor: `color-mix(in oklab, ${colorVar} 35%, transparent)`,
      backgroundColor: `color-mix(in oklab, ${colorVar} 8%, white)`,
    }}>
      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: colorVar }}>{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((q, i) => (
          <li key={i} className={`flex gap-2 text-[var(--navy)] leading-snug ${callMode ? "text-base" : "text-sm"}`}>
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: colorVar }} />
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}