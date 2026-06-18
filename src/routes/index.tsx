import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Target, UserRound, Home, Car, Plane, Rocket, BarChart3, HelpCircle, Handshake,
  Flame, AlertTriangle, ClipboardCopy, Check, ChevronDown, TrafficCone, ArrowRight,
  Trophy, Mic, ShieldCheck, XCircle, CheckCircle2, Thermometer, ListOrdered,
  Search, Star, Pin, Headphones, Filter, Sparkles, GraduationCap, Brain, Quote,
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
  "Descobrir Objetivo",
  "Fazer Perguntas de Situação",
  "Encontrar Problemas",
  "Amplificar Impactos",
  "Gerar Necessidade",
  "Ouvir Sinais de Compra",
  "Agendar Entrevista",
  "Não Vender Nada",
];

const SCRIPT = `Perfeito. Pelo que você compartilhou comigo, existem alguns pontos que vale a pena analisar com mais profundidade para entender exatamente onde você está hoje e qual o caminho mais eficiente para atingir esse objetivo.

O ideal é fazermos uma Entrevista Estratégica Financeira, onde conseguimos colocar tudo isso em números e construir um plano claro.

Tenho disponibilidade na terça às 19h ou quarta às 18h. Qual funciona melhor para você?`;

type Quadrant = "situacao" | "problema" | "implicacao" | "necessidade";

const QUADRANTS: { key: Quadrant; emoji: string; label: string; color: string; chip: string }[] = [
  { key: "situacao",    emoji: "🔵", label: "Situação",    color: "var(--brand)",   chip: "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/30" },
  { key: "problema",    emoji: "🟡", label: "Problema",    color: "var(--warn)",    chip: "bg-[var(--warn)]/10 text-[#8a5a00] border-[var(--warn)]/40" },
  { key: "implicacao",  emoji: "🟠", label: "Implicação",  color: "var(--danger)",  chip: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30" },
  { key: "necessidade", emoji: "🟢", label: "Necessidade", color: "var(--success)", chip: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30" },
];

const SPIN_OBJECTIVES: Record<Quadrant, string> = {
  situacao: "Entender a realidade atual do cliente.",
  problema: "Identificar lacunas, dificuldades e ausência de planejamento.",
  implicacao: "Ampliar o impacto financeiro, emocional e familiar do problema. Esta é a etapa mais importante da metodologia.",
  necessidade: "Levar o cliente a perceber valor em buscar ajuda especializada.",
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
  "Hoje você sente que possui um plano claro para alcançar essa independência?",
  "E se essa independência financeira acontecer 10 anos depois do que você gostaria?",
  "Faz sentido validar se o caminho atual é realmente o mais eficiente?",
  // Aposentadoria
  "Hoje você acredita que sua estratégia atual é suficiente para entregar essa aposentadoria?",
  "E se você precisasse trabalhar 10 anos além do que imagina hoje?",
  "Faria sentido validar se o caminho atual realmente entrega a aposentadoria que você deseja?",
  // Compra de Casa
  "Hoje você sente que existe um plano claro para comprar esse imóvel dentro do prazo desejado?",
  "E se essa compra atrasar cinco anos?",
  "Faz sentido validar se existe uma forma mais eficiente de chegar nesse objetivo?",
  // Compra de Carro
  "Hoje você já sabe exatamente como pretende viabilizar essa compra?",
  "E se essa compra atrasar mais alguns anos?",
  "Faz sentido validar se existe uma forma mais eficiente de atingir esse objetivo?",
  // Viagens
  "Hoje você possui um planejamento específico para realizar essa viagem?",
  "E se essa viagem não acontecer nos próximos 5 anos?",
  "Faz sentido construir uma estratégia para transformar essa viagem em uma meta concreta?",
  // Empreendedorismo
  "Hoje você já possui clareza financeira sobre o que esse projeto exige?",
  "E se esse projeto continuar parado pelos próximos 5 anos?",
  "Faz sentido entender qual estrutura financeira seria necessária para transformar esse projeto em realidade?",
  // Organização Financeira
  "Você sente que o resultado financeiro que possui hoje reflete o esforço que faz?",
  "E se nada mudar nos próximos 10 anos?",
  "Faz sentido organizar tudo para ter mais clareza e previsibilidade?",
  // Cliente Sem Objetivo
  "Se dinheiro não fosse um problema, o que você faria imediatamente?",
  "E se mais 10 anos passarem da mesma forma?",
  "Faz sentido descobrir quais objetivos realmente fazem sentido para você?",
  // Já Possui Assessor
  "Seu assessor conhece profundamente todos os seus objetivos financeiros?",
  "E se algo importante estivesse desalinhado hoje, como você descobriria?",
  "Faz sentido validar se tudo continua alinhado aos seus objetivos atuais?",
]);
const isKiller = (q: string) => KILLER_PRINCIPALS.has(q);

// === MODO TREINAMENTO ===
// Explica a psicologia por trás de cada Pergunta Principal.
// Fallback automático por quadrante quando não houver explicação dedicada.
const QUADRANT_EXPLANATION: Record<Quadrant, string> = {
  situacao:
    "Essa pergunta abre a conversa sem pressão. O objetivo é fazer o cliente verbalizar a própria realidade — aquilo que é dito em voz alta passa a ser percebido com mais clareza por quem fala.",
  problema:
    "Essa pergunta expõe lacunas sem confrontar. Convida o cliente a perceber sozinho que algo importante pode estar faltando, sem que ele se sinta julgado ou precise defender sua estratégia atual.",
  implicacao:
    "Essa pergunta amplia a percepção do custo de não agir. Tira a decisão do campo puramente racional e a leva para o campo emocional — onde a maioria das decisões realmente acontece.",
  necessidade:
    "Essa pergunta gera curiosidade e abre espaço para a ajuda. Em vez de oferecer uma solução, convida o cliente a validar algo que talvez nunca tenha analisado profundamente.",
};

const EXPLANATIONS: Record<string, string> = {
  // Implicações de atraso → custo emocional do tempo
  "E se essa independência financeira acontecer 10 anos depois do que você gostaria?":
    "Essa pergunta existe para ampliar a percepção do custo do atraso. Muitas pessoas enxergam apenas o custo financeiro das decisões. Quando refletimos sobre tempo perdido, experiências adiadas, impacto familiar e oportunidades que não voltam, a decisão passa a ser emocional e não apenas racional. O objetivo não é gerar medo. É gerar consciência.",
  "E se você precisasse trabalhar 10 anos além do que imagina hoje?":
    "Transforma um número distante em uma sensação concreta. O cliente sente o peso de adiar a liberdade e percebe que o verdadeiro custo não está em trabalhar, mas em perder a escolha de parar quando quiser.",
  "E se essa compra atrasar cinco anos?":
    "Conecta o objetivo a algo maior do que o imóvel: rotina familiar, momentos com filhos, conforto. O cliente para de pensar em metros quadrados e passa a pensar em vida.",
  "E se essa compra atrasar mais alguns anos?":
    "Faz o cliente perceber que o desconforto atual continua todos os dias enquanto a compra não acontece. O custo invisível da rotina aparece.",
  "E se essa viagem não acontecer nos próximos 5 anos?":
    "Transforma um problema financeiro em um problema de vida. O cliente deixa de pensar em dinheiro e passa a pensar em experiências, tempo e memórias que não voltam.",
  "E se esse projeto continuar parado pelos próximos 5 anos?":
    "Ativa o medo do arrependimento. Muitas pessoas temem mais nunca tentar do que tentar e errar. A pergunta faz esse risco ficar visível.",
  "E se nada mudar nos próximos 10 anos?":
    "Tira o cliente da inércia. Quando ele projeta a situação atual no futuro, percebe que ‘continuar como está’ também é uma escolha — e raramente é a melhor.",
  "E se mais 10 anos passarem da mesma forma?":
    "Faz o tempo virar protagonista. O cliente sem objetivo costuma viver no automático; essa pergunta o obriga a olhar para frente e perceber o custo invisível da ausência de direção.",
  "E se algo importante estivesse desalinhado hoje, como você descobriria?":
    "Coloca em xeque a confiança automática no acompanhamento atual sem atacar o assessor. Cria espaço para uma segunda visão sem gerar conflito.",

  // Necessidades → curiosidade e abertura
  "Faz sentido validar se o caminho atual é realmente o mais eficiente?":
    "Essa pergunta cria curiosidade. Ela não vende uma solução. Ela convida o cliente a verificar algo que talvez nunca tenha analisado profundamente.",
  "Faria sentido validar se o caminho atual realmente entrega a aposentadoria que você deseja?":
    "Reduz a resistência ao reposicionar a conversa como validação, não como crítica. O cliente não precisa admitir erro — apenas aceitar conferir os números.",
  "Faz sentido validar se existe uma forma mais eficiente de chegar nesse objetivo?":
    "Abre espaço para comparação sem confronto. O cliente percebe que pode existir um caminho melhor sem precisar dizer que o atual está errado.",
  "Faz sentido validar se existe uma forma mais eficiente de atingir esse objetivo?":
    "Convida à curiosidade. Em vez de oferecer produto, oferece clareza — e clareza é algo que ninguém recusa.",
  "Faz sentido construir uma estratégia para transformar essa viagem em uma meta concreta?":
    "Tira o sonho do campo da intenção e leva para o campo do planejamento. Quando algo vira meta com prazo, sai do ‘um dia’ e entra na agenda.",
  "Faz sentido entender qual estrutura financeira seria necessária para transformar esse projeto em realidade?":
    "Substitui a vaga ideia de ‘empreender um dia’ por uma pergunta concreta de quanto e como. Move o cliente da contemplação para a execução.",
  "Faz sentido organizar tudo para ter mais clareza e previsibilidade?":
    "Ninguém recusa clareza. A palavra ‘organizar’ é leve e desarma — ao mesmo tempo em que abre porta para um trabalho profundo.",
  "Faz sentido descobrir quais objetivos realmente fazem sentido para você?":
    "Para o cliente sem objetivo claro, o primeiro passo não é investir melhor — é descobrir para onde ir. Essa pergunta entrega exatamente isso.",
  "Faz sentido validar se tudo continua alinhado aos seus objetivos atuais?":
    "Permite uma segunda visão sem competir com o assessor atual. Posiciona a entrevista como complemento, não como ameaça.",

  // Problemas → reconhecer lacuna sem confronto
  "Hoje você sente que possui um plano claro para alcançar essa independência?":
    "A palavra ‘claro’ é o gatilho. Mesmo quem tem investimentos raramente tem um plano claro — e ao admitir isso, o cliente abre espaço para a próxima etapa.",
  "Hoje você acredita que sua estratégia atual é suficiente para entregar essa aposentadoria?":
    "Diferencia ‘ter dinheiro guardado’ de ‘ter uma estratégia suficiente’. Quase ninguém validou de fato, e a percepção dessa lacuna gera necessidade.",
  "Hoje você sente que existe um plano claro para comprar esse imóvel dentro do prazo desejado?":
    "Conecta o desejo ao prazo. É no prazo que o plano costuma falhar, e admitir isso é o primeiro passo para querer estruturá-lo.",
  "Hoje você já sabe exatamente como pretende viabilizar essa compra?":
    "Substitui ‘você se planeja?’ pelo concreto ‘como?’. Forçar a explicação do método revela a ausência dele.",
  "Hoje você possui um planejamento específico para realizar essa viagem?":
    "A palavra ‘específico’ desmascara o ‘um dia a gente vai’. O cliente percebe que sem reserva e data, a viagem dificilmente sai do papel.",
  "Hoje você já possui clareza financeira sobre o que esse projeto exige?":
    "Empreendedores travam mais por falta de números do que por falta de coragem. Ao perceber essa lacuna, o cliente passa a desejar a clareza.",
  "Você sente que o resultado financeiro que possui hoje reflete o esforço que faz?":
    "Toca direto na frustração de quem ganha bem e não acumula. Conecta esforço a resultado e expõe um desalinhamento que incomoda.",

  // Situação chave → contexto que vira gatilho
  "Se dinheiro não fosse um problema, o que você faria imediatamente?":
    "Revela os verdadeiros desejos do cliente sem pressão. Muitas vezes ele descobre, ali na ligação, o que realmente quer da vida — e isso muda o tom da conversa.",
  "Seu assessor conhece profundamente todos os seus objetivos financeiros?":
    "Diferencia ‘ter assessor’ de ‘ter planejamento’. Sem atacar ninguém, expõe que a maior parte do trabalho costuma ser sobre produto, não sobre vida.",

  // Killer questions referenciadas no topo (também aparecem em busca/favoritos)
  "O que acontece se isso não mudar nos próximos 5 anos?":
    "Coloca o problema no futuro e tira o cliente do conforto do presente. A projeção amplia o desconforto e cria urgência sem precisar empurrar nada.",
  "O que está custando para você não resolver isso hoje?":
    "Transforma indecisão em prejuízo concreto. Quando o custo de não agir fica visível, a inação deixa de parecer neutra.",
  "Como isso impacta sua família?":
    "Grande parte das decisões financeiras não são tomadas apenas por razões financeiras. Quando conectamos o objetivo a filhos, cônjuge ou pessoas importantes, aumentamos a relevância emocional da conversa.",
  "Se continuar exatamente como está, qual será o cenário daqui a 10 anos?":
    "Força o cliente a sair da rotina mental e desenhar o futuro. Quase sempre, o cenário que ele descreve é diferente do que ele deseja.",
  "Você acredita que está no melhor caminho possível ou apenas no caminho que conhece?":
    "Reduz a resistência natural do cliente. Em vez de confrontar a estratégia atual, cria abertura para novas possibilidades. O cliente não precisa admitir que está errado — apenas considerar que pode existir uma alternativa melhor.",
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
  nao: string[];
  transicao: string;
  procurar: string[];
};
type Goal = {
  id: string;
  emoji: string;
  icon: typeof Target;
  title: string;
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
        principal: "Hoje você sente que possui um plano claro para alcançar essa independência?",
        sim: [
          "Como esse plano foi construído?",
          "Existe alguma projeção?",
          "Você revisa esse plano?",
          "O que te dá confiança de que ele funcionará?",
          "É uma certeza ou uma expectativa?",
        ],
        nao: [
          "O que acredita que está faltando?",
          "O que mais gera insegurança?",
          "Já tentou construir esse plano antes?",
        ],
        transicao: "Entendi. Independentemente de existir um plano, vale entender o quanto ele realmente aproxima você desse objetivo.",
        procurar: ["Falta de validação", "Falta de projeção", "Excesso de confiança", "Falta de clareza"],
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
        principal: "Faz sentido validar se o caminho atual é realmente o mais eficiente?",
        sim: [
          "O que gostaria de validar?",
          "O que mais gera dúvida hoje?",
          "O que gostaria de enxergar com mais clareza?",
        ],
        nao: [
          "Você acredita ter 100% de certeza sobre o caminho atual?",
          "Existe algum risco em nunca validar?",
          "O que aconteceria se existisse uma forma melhor e você não conhecesse?",
        ],
        transicao: "Por isso acredito que vale a pena colocarmos tudo em números para enxergar exatamente onde você está e qual o caminho mais eficiente.",
        procurar: ["Curiosidade", "Dúvidas", "Busca por clareza", "Desejo de acelerar resultados"],
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
        principal: "Hoje você acredita que sua estratégia atual é suficiente para entregar essa aposentadoria?",
        sim: [
          "O que te dá essa confiança?",
          "Existe alguma projeção formal?",
          "Você sabe qual renda terá?",
          "Já revisou esse planejamento recentemente?",
          "É uma certeza ou uma expectativa?",
        ],
        nao: [
          "O que mais preocupa você?",
          "O que sente que está faltando?",
          "Já tentou organizar isso anteriormente?",
        ],
        transicao: "Muitas pessoas possuem patrimônio, mas nunca validaram se ele realmente sustentará o padrão de vida desejado.",
        procurar: ["Falta de projeção", "Dependência do INSS", "Excesso de confiança", "Falta de validação"],
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
        principal: "Faria sentido validar se o caminho atual realmente entrega a aposentadoria que você deseja?",
        sim: [
          "O que mais gostaria de validar?",
          "O que ainda gera dúvida?",
          "Existe algum cenário que gostaria de enxergar?",
        ],
        nao: [
          "Você acredita ter 100% de certeza dos números?",
          "Existe algum risco em nunca validar isso?",
          "O que aconteceria se existisse um caminho melhor?",
        ],
        transicao: "Talvez valha a pena colocar tudo em números para ter clareza sobre onde você está e para onde está indo.",
        procurar: ["Curiosidade", "Clareza", "Segurança", "Validação"],
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
        principal: "Hoje você sente que existe um plano claro para comprar esse imóvel dentro do prazo desejado?",
        sim: [
          "Como esse plano foi construído?",
          "Existe alguma projeção formal?",
          "Você acompanha sua evolução?",
          "O que pode fazer esse plano não acontecer?",
        ],
        nao: [
          "O que está faltando?",
          "Qual a maior dificuldade?",
          "O que impede avançar mais rápido?",
        ],
        transicao: "Então vale entender se o caminho atual realmente leva ao prazo que você deseja.",
        procurar: ["Falta de planejamento", "Falta de acompanhamento", "Falta de números"],
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
        principal: "Faz sentido validar se existe uma forma mais eficiente de chegar nesse objetivo?",
        sim: [
          "O que gostaria de validar?",
          "O que mais gera dúvida?",
          "Existe algum prazo que gostaria de confirmar?",
        ],
        nao: [
          "Você acredita que já conhece todas as possibilidades?",
          "Existe algum risco em não revisar essa estratégia?",
        ],
        transicao: "Talvez valha a pena entender se o caminho atual realmente é o mais eficiente.",
        procurar: ["Curiosidade", "Desejo de acelerar", "Clareza"],
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
        principal: "Hoje você já sabe exatamente como pretende viabilizar essa compra?",
        sim: [
          "Como estruturou esse plano?",
          "Existe uma reserva específica?",
          "O plano depende de algo acontecer?",
        ],
        nao: [
          "O que falta definir?",
          "Qual sua principal dúvida?",
          "Isso já atrasou sua decisão?",
        ],
        transicao: "Muitas compras não atrasam por falta de renda, mas por falta de planejamento.",
        procurar: ["Falta de clareza", "Dependência de eventos futuros", "Ausência de estratégia"],
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
        principal: "Faz sentido validar se existe uma forma mais eficiente de atingir esse objetivo?",
        sim: [
          "O que gostaria de entender melhor?",
          "Existe algum cenário que gostaria de comparar?",
        ],
        nao: [
          "Você acredita que o caminho atual já é o ideal?",
          "Existe algum risco em nunca validar isso?",
        ],
        transicao: "Talvez valha a pena colocar isso em números para entender todas as possibilidades.",
        procurar: ["Curiosidade", "Clareza", "Comparação de cenários"],
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
        principal: "Hoje você possui um planejamento específico para realizar essa viagem?",
        sim: [
          "Como esse planejamento foi construído?",
          "Existe uma reserva exclusiva?",
          "Você sabe exatamente quanto precisará?",
          "Já revisou os custos recentemente?",
          "Existe alguma data definida?",
        ],
        nao: [
          "O que normalmente impede essa organização?",
          "A viagem acaba ficando sempre para depois?",
          "Isso já aconteceu outras vezes?",
          "Existe alguma insegurança em relação aos custos?",
        ],
        transicao: "É muito comum que viagens importantes acabem sendo adiadas não pela falta de renda, mas pela ausência de um plano específico.",
        procurar: ["Falta de organização", "Prioridades conflitantes", "Falta de reserva", "Objetivos adiados"],
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
        principal: "Faz sentido construir uma estratégia para transformar essa viagem em uma meta concreta?",
        sim: [
          "O que gostaria de validar?",
          "Existe alguma data que gostaria de confirmar?",
          "Gostaria de entender o valor necessário para isso?",
        ],
        nao: [
          "Você acredita que ela acontecerá naturalmente?",
          "Existe algum risco de continuar adiando indefinidamente?",
        ],
        transicao: "Talvez valha a pena entender como transformar esse sonho em um plano com prazo e números definidos.",
        procurar: ["Comprometimento", "Clareza", "Prazo", "Planejamento"],
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
        principal: "Hoje você já possui clareza financeira sobre o que esse projeto exige?",
        sim: [
          "Como chegou nesses números?",
          "Já validou esse cálculo?",
          "Existe margem para imprevistos?",
          "Considerou capital de giro?",
          "Existe um plano financeiro para execução?",
        ],
        nao: [
          "O que falta descobrir?",
          "O que mais gera dúvida?",
          "Isso tem atrasado o início do projeto?",
        ],
        transicao: "Muitas vezes o projeto não fica parado por falta de capacidade, mas pela ausência de clareza financeira.",
        procurar: ["Falta de números", "Insegurança", "Falta de planejamento"],
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
        principal: "Faz sentido entender qual estrutura financeira seria necessária para transformar esse projeto em realidade?",
        sim: [
          "O que mais gostaria de validar?",
          "Existe um prazo desejado?",
          "Gostaria de saber quanto patrimônio precisaria acumular?",
        ],
        nao: [
          "Você acredita que já possui todas as respostas necessárias?",
          "Existe algum risco em continuar sem essa clareza?",
        ],
        transicao: "Talvez valha a pena colocar isso em números para transformar uma ideia em um plano.",
        procurar: ["Clareza", "Execução", "Planejamento", "Próximo passo"],
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
        principal: "Você sente que o resultado financeiro que possui hoje reflete o esforço que faz?",
        sim: [
          "Como mede esse resultado?",
          "Está satisfeito com sua evolução?",
          "Existe algo que gostaria de acelerar?",
        ],
        nao: [
          "O que mais incomoda?",
          "Tem a sensação de ganhar bem e não acumular?",
          "Onde acredita que está o problema?",
        ],
        transicao: "Muitas pessoas trabalham muito, mas não conseguem transformar renda em patrimônio.",
        procurar: ["Frustração", "Falta de patrimônio", "Falta de direção"],
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
        principal: "Faz sentido organizar tudo para ter mais clareza e previsibilidade?",
        sim: [
          "O que mais gostaria de entender?",
          "Onde sente maior necessidade de organização?",
        ],
        nao: [
          "Existe algum risco em continuar sem essa clareza?",
          "Como saberá se está evoluindo?",
        ],
        transicao: "Talvez valha a pena transformar sua vida financeira em algo mensurável e previsível.",
        procurar: ["Clareza", "Organização", "Controle"],
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
        principal: "Hoje seu dinheiro está trabalhando para algum objetivo específico?",
        sim: [
          "Qual objetivo?",
          "Existe um plano para ele?",
          "Você acompanha sua evolução?",
        ],
        nao: [
          "Como mede seu progresso financeiro?",
          "Como sabe se está avançando?",
        ],
        transicao: "Quem não define um destino normalmente tem dificuldade de medir a evolução.",
        procurar: ["Falta de direção", "Falta de metas"],
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
        principal: "Faz sentido descobrir quais objetivos realmente fazem sentido para você?",
        sim: [
          "O que gostaria de construir?",
          "O que seria prioridade?",
        ],
        nao: [
          "Como saberá se está evoluindo financeiramente?",
        ],
        transicao: "Talvez o primeiro passo não seja investir melhor, mas descobrir para onde quer ir.",
        procurar: ["Clareza", "Propósito", "Direção"],
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
        principal: "Hoje você sabe qual a probabilidade de atingir cada um dos seus objetivos?",
        sim: [
          "Como essa probabilidade foi calculada?",
          "Quando foi revisada?",
        ],
        nao: [
          "Como mede se está no caminho certo?",
          "Existe alguma projeção formal?",
        ],
        transicao: "Muitas pessoas possuem investimentos, mas não possuem planejamento.",
        procurar: ["Falta de projeção", "Falta de acompanhamento"],
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
        principal: "Faz sentido validar se tudo continua alinhado aos seus objetivos atuais?",
        sim: [
          "O que gostaria de revisar?",
          "Existe alguma dúvida atual?",
        ],
        nao: [
          "Existe algum risco em nunca buscar uma segunda visão?",
        ],
        transicao: "Uma segunda visão não substitui o trabalho atual. Ela ajuda a validar se tudo continua fazendo sentido.",
        procurar: ["Abertura", "Curiosidade", "Validação"],
      },
    },
  },
];

function Index() {
  const [openGoal, setOpenGoal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
        const haystack = [s.principal, s.transicao, ...s.sim, ...s.nao, ...s.procurar].join(" \n ").toLowerCase();
        if (titleHit || haystack.includes(q)) {
          matches.push({ quadrant: quad.key, script: s });
        }
      }
      if (matches.length) results.push({ goal: g, matches });
    }
    return results;
  }, [q]);

  return (
    <div className={`min-h-dvh bg-[var(--surface)] text-foreground ${callMode ? "text-[17px] sm:text-[18px]" : ""}`}>
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
          </div>
        </header>

      {/* Sticky control bar */}
      <nav aria-label="Controles de navegação" className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
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
            <section id="treinamento" aria-labelledby="psy-title" className="scroll-mt-28">
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
            <section id="objetivos" aria-labelledby="goals-title" className="scroll-mt-28">
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
                    <button
                      key={g.id}
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
                    </button>
                  );
                })}
              </div>

              {openGoal && (
                <div className="mt-6" id={`goal-panel-${openGoal}`} role="region" aria-label="Roteiro do objetivo selecionado">
                  {GOALS.filter((g) => g.id === openGoal).map((g) => (
                    <GoalBlocks
                      key={g.id}
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
                  ))}
                </div>
              )}
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
            <section id="sinais" aria-labelledby="sinais-title" className="scroll-mt-28">
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
            <section id="agendamento" aria-labelledby="booking-title" className="scroll-mt-28">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--navy)] to-[#0b1c3a] p-6 sm:p-10 text-white shadow-xl">
                <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[var(--success)]/30 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Fechar agendamento
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
                Quando ouvir <span className="font-bold">duas ou mais</span>, avance para o agendamento.
              </div>
            </div>

            <div className="rounded-3xl border-2 border-[var(--success)] bg-gradient-to-br from-[var(--navy)] to-[#0b1c3a] p-5 text-white shadow-lg shadow-[var(--success)]/15">
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-bold">📅 Script de Agendamento</h3>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/85 whitespace-pre-line">{SCRIPT}</p>
              <button
                type="button"
                onClick={copyScript}
                aria-live="polite"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--success)] px-4 text-sm font-bold text-[var(--navy)] transition hover:brightness-105 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                {copied ? <Check aria-hidden className="h-4 w-4" /> : <ClipboardCopy aria-hidden className="h-4 w-4" />}
                {copied ? "Copiado!" : "Copiar Script"}
              </button>
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
  return (
    <div className="rounded-3xl border border-border bg-white p-4 sm:p-7 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-2xl" aria-hidden>{goal.emoji}</span>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--navy)]">{goal.title}</h3>
      </div>

      <div className="space-y-4">
        {QUADRANTS.filter((q) => activeQuads.includes(q.key)).map((quad) => {
          const key = `${goal.id}|${quad.key}`;
          const script = goal.blocks[quad.key];
          return (
            <div key={quad.key}>
              {!callMode && (
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: quad.color }}>
                  <span aria-hidden>{quad.emoji}</span>
                  <span>{quad.label}</span>
                  <span className="text-muted-foreground font-medium normal-case tracking-normal">· {SPIN_OBJECTIVES[quad.key]}</span>
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScriptCard({
  script, quadrant, expanded, onToggle, favorited, onFav, training, onTraining, callMode, contextLabel,
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
}) {
  const isImportant = quadrant.key === "implicacao";
  const isHigh = isHighConversion(script.principal);
  const isKillerQ = isKiller(script.principal);
  const simLabel = script.simLabel ?? "Se responder SIM";
  const naoLabel = script.naoLabel ?? "Se responder NÃO";

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm ${
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
        </div>

        {training && (
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
          <ExplorationList
            label={`❌ ${naoLabel}`}
            items={script.nao}
            tone="danger"
            callMode={callMode}
          />
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