import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone, PhoneCall, Headphones, GraduationCap, Brain, Crown,
  Home as HomeIcon, ClipboardCopy, Check, Sparkles, AlertTriangle,
  CheckCircle2, Target, Quote, RefreshCw, Repeat, Star, Shield, Eye,
} from "lucide-react";
import { useContent } from "@/lib/content/ContentContext";

export const Route = createFileRoute("/ligacoes")({
  head: () => ({
    meta: [
      { title: "Bull Team | Modo Ligação Elite" },
      { name: "description", content: "Scripts e treinamento para ligações de confirmação, reagendamento e recomendação com gatilhos psicológicos." },
      { property: "og:title", content: "Bull Team | Modo Ligação Elite" },
      { property: "og:description", content: "Como conduzir ligações de alta performance: confirmação, reagendamento, recuperação e recomendação." },
    ],
  }),
  component: Ligacoes,
});

/* ============================================================
   TIPOS E DADOS
   ============================================================ */

type Tone = "neutro" | "consultivo" | "premium" | "empatico" | "autoritario";

type Block = {
  id: string;
  label: string;
  intent: string;
  script: string;
  trigger: string;
  tone?: Tone;
  doSay?: string[];
  dontSay?: string[];
};

type Objection = { q: string; a: string };

/**
 * Quebra um script longo em parágrafos visuais.
 * Insere quebras antes de marcadores como "Opção N", "Gatilho:",
 * "Gatilho ativado", além de respeitar \n já existentes.
 */
function formatScript(raw: string): string {
  if (!raw) return raw;
  let s = raw.replace(/\r\n/g, "\n").trim();

  // Garante quebra dupla antes de "Opção N (…)" — novo bloco.
  s = s.replace(/\s*(Opção\s*\d+[^\n]*?\))\s*/g, "\n\n$1\n");

  // Após o título "Opção N (…)", se vier aspas abrindo um script, mantém na linha de baixo.
  s = s.replace(/(Opção\s*\d+[^\n]*?\))\n+([“"])/g, "$1\n$2");

  // Quebra antes de "Gatilho:" e "Gatilho ativado" — sempre em linha própria.
  s = s.replace(/\s*(Gatilho(?:\s+ativado)?\s*:?)/g, "\n\n$1 ");

  // Bullets para marcadores finais comuns ("Empatia.", "Aversão à perda (…).", "Valor…", "Fechamento…").
  const bulletTerms = [
    "Empatia",
    "Aversão à perda",
    "Valor da reunião",
    "Fechamento assumido",
    "Urgência",
    "Autoridade",
    "Contraste",
    "Projeção de futuro",
    "Quebra da procrastinação",
    "Medo do arrependimento",
  ];
  for (const term of bulletTerms) {
    const re = new RegExp(`(?:^|[.\\s])(${term}(?:[^\\n.]{0,80}\\.)?)`, "g");
    s = s.replace(re, (match, g1) => `\n• ${g1.trim()}`);
  }

  // Fecha aspas com quebra para destacar o final de cada opção.
  s = s.replace(/([”"])\s*(?=Gatilho|Opção|\n|$)/g, "$1\n");

  // Normaliza: tira espaços antes de \n, colapsa 3+ quebras.
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

type CallType = {
  id: string;
  label: string;
  short: string;
  emoji: string;
  accent: string;       // css token color
  badge: string;        // small tag
  objetivo: string;
  duracao: string;
  publico: string;
  premissa: string;
  blocks: Block[];
  objections?: Objection[];
  fechamento: string;
  treino: {
    porqueExiste: string;
    gatilhos: { name: string; explica: string }[];
    errosComuns: string[];
    indicadores: string[];
    mantra: string;
  };
};

const TONE_STYLE: Record<Tone, { label: string; color: string }> = {
  neutro:       { label: "Neutro",       color: "var(--muted-foreground)" },
  consultivo:   { label: "Consultivo",   color: "var(--brand)" },
  premium:      { label: "Premium",      color: "#c9a84c" },
  empatico:     { label: "Empático",     color: "var(--success)" },
  autoritario:  { label: "Autoridade",   color: "var(--navy)" },
};

const CALL_TYPES: CallType[] = [
  /* ============================================================
     1) CONFIRMAÇÃO PADRÃO (FUTURO)
     ============================================================ */
  {
    id: "confirmacao",
    label: "Confirmação de Reunião",
    short: "Confirmação",
    emoji: "📅",
    accent: "var(--brand)",
    badge: "Pré-reunião · 24h–48h antes",
    objetivo: "Blindar a presença do cliente reposicionando o valor da reunião antes que ele desmarque mentalmente.",
    duracao: "2 a 3 minutos",
    publico: "Reunião agendada · público geral",
    premissa: "Cliente comum decide presença pela conveniência. Reposicionar a reunião como cuidado financeiro, não compromisso comercial.",
    blocks: [
      {
        id: "abertura",
        label: "Abertura leve",
        intent: "Quebrar resistência inicial e abrir espaço para reflexão, não para venda.",
        trigger: "Reciprocidade + baixa pressão. Tom de aproximação, não de cobrança.",
        tone: "empatico",
        script: "Olá, [Nome], tudo bem? Passando rapidamente porque sua reunião está chegando e eu queria te deixar uma reflexão.",
        doSay: ["Tom calmo e curto", "Falar 'reflexão', não 'lembrete'"],
        dontSay: ["'Só ligando para confirmar'", "'É rapidinho'"],
      },
      {
        id: "quebra-padrao",
        label: "Quebra de padrão",
        intent: "Confrontar suavemente a forma como o cliente trata as próprias decisões financeiras.",
        trigger: "Dissonância cognitiva. O cliente percebe que dedica tempo a quase tudo, menos à própria estratégia financeira.",
        tone: "consultivo",
        script: "A maioria das pessoas dedica anos para construir patrimônio, gerar renda e cuidar da família, mas poucas param por uma hora para analisar se estão realmente no melhor caminho.",
      },
      {
        id: "pre-frame",
        label: "Pré-frame da reunião",
        intent: "Tirar o frame de 'apresentação comercial' e instalar o frame de análise estratégica personalizada.",
        trigger: "Especificidade. O cérebro valoriza o que parece feito para ele.",
        tone: "autoritario",
        script: "Não será uma conversa para falar de produtos ou algo genérico. Será um momento para olhar para a sua realidade, seus objetivos e identificar oportunidades que talvez você ainda não esteja enxergando.",
      },
      {
        id: "analogia",
        label: "Analogia consulta médica",
        intent: "Elevar a percepção de urgência e responsabilidade.",
        trigger: "Analogia familiar + comparação de zelo (saúde × dinheiro).",
        tone: "consultivo",
        script: "Da mesma forma que você não deixaria de comparecer a uma consulta importante para sua saúde, essa conversa é um cuidado com sua saúde financeira.",
      },
      {
        id: "verdade",
        label: "Verdade incômoda",
        intent: "Plantar o medo construtivo de continuar sem revisar decisões.",
        trigger: "Aversão à perda. Não decidir já é uma decisão, e custa caro.",
        tone: "autoritario",
        script: "Acompanhando milhares de famílias, os maiores erros financeiros não acontecem por fazer algo errado. Acontecem por não parar para analisar se existe uma alternativa melhor. Isso costuma custar centenas de milhares de reais ao longo dos anos.",
      },
      {
        id: "fechamento",
        label: "Fechamento da confirmação",
        intent: "Selar o compromisso sem perguntar 'posso confirmar?'.",
        trigger: "Pressuposição positiva. O 'sim' já está implícito no enquadramento.",
        tone: "autoritario",
        script: "Por isso, preserve esse horário na sua agenda. Essa conversa pode gerar muito mais valor do que o tempo que ela consome. Até breve.",
        doSay: ["Encerrar firme, sem perguntar 'tudo certo, então?'"],
        dontSay: ["'Você confirma comigo?'", "'Tem certeza que vai poder?'"],
      },
    ],
    fechamento: "Nunca peça confirmação. Encerre como se a presença já fosse certa. A última frase reforça o valor, não a obrigação.",
    treino: {
      porqueExiste: "A maioria dos no-shows não acontece por imprevisto. Acontece porque o cliente esfriou e racionalizou que 'não é prioridade'. Esta ligação reaquece o valor antes do esfriamento.",
      gatilhos: [
        { name: "Reframe de valor", explica: "Reposiciona a reunião como cuidado, não como venda." },
        { name: "Dissonância", explica: "Cliente percebe que cuida menos do dinheiro do que de outras áreas." },
        { name: "Aversão à perda", explica: "Não revisar custa mais do que revisar." },
        { name: "Pressuposição", explica: "Encerramento assume a presença, não pede." },
      ],
      errosComuns: [
        "Falar 'só ligando para confirmar', abre brecha para o cliente desmarcar.",
        "Perguntar 'tudo certo para amanhã?', convida o 'não'.",
        "Falar de produtos ou empresa nesse contato.",
        "Tom de cobrança ou ansiedade, diminui autoridade.",
      ],
      indicadores: [
        "Cliente responde com 'faz sentido' ou 'pode contar comigo'.",
        "Cliente menciona algo específico que quer entender na reunião.",
        "Cliente confirma horário sem ser perguntado.",
      ],
      mantra: "Você não está confirmando uma reunião. Está reaquecendo uma decisão.",
    },
    objections: [
      { q: "Acho que não vai dar mais.", a: "Entendo. Justamente por isso eu liguei: a maioria das pessoas que adia esse tipo de conversa continua com as mesmas dúvidas pelos próximos meses. Vamos preservar 1h sua agora ou prefere que eu já te apresente duas alternativas para a semana que vem?" },
      { q: "Posso confirmar mais perto?", a: "Pode sim. Mas pela minha experiência, quem confirma de véspera normalmente desmarca. Pelo valor dessa conversa para você, vale travar agora." },
    ],
  },

  /* ============================================================
     2) CONFIRMAÇÃO PREMIUM. ALTA RENDA
     ============================================================ */
  {
    id: "confirmacao-premium",
    label: "Confirmação Premium · Alta Renda",
    short: "Confirmação Premium",
    emoji: "👑",
    accent: "#c9a84c",
    badge: "Pré-reunião · Alta renda",
    objetivo: "Confirmar presença usando linguagem de elite e elevar o cliente ao frame de tomador de decisão.",
    duracao: "2 a 3 minutos",
    publico: "Empresários, médicos, executivos, investidores · alta renda",
    premissa: "Cliente premium decide pelo critério de tempo bem investido. A ligação precisa ter densidade, não simpatia.",
    blocks: [
      {
        id: "abertura",
        label: "Abertura curta e densa",
        intent: "Mostrar respeito ao tempo do cliente em 5 segundos.",
        trigger: "Reciprocidade + status. Tom de par, não de subordinado.",
        tone: "premium",
        script: "Olá, [Nome], tudo bem? Sua reunião está se aproximando e eu queria compartilhar uma reflexão rápida.",
      },
      {
        id: "valor-decisao",
        label: "Tempo × Decisões",
        intent: "Reposicionar o valor da reunião pelo eixo da decisão, não do tempo.",
        trigger: "Identidade de alta performance. 'Pessoas como você decidem.' ",
        tone: "premium",
        script: "Pessoas de alta performance costumam ser muito criteriosas com o uso do próprio tempo. Mas existe algo ainda mais valioso do que tempo: decisões. Uma decisão correta gera ganhos por anos. Uma decisão não revisada custa centenas de milhares ao longo da vida.",
      },
      {
        id: "pre-frame",
        label: "Pré-frame estratégico",
        intent: "Eliminar qualquer suspeita de 'reunião de vendas'.",
        trigger: "Especificidade + autoridade.",
        tone: "autoritario",
        script: "Essa não é uma reunião para falar de produtos. Não é genérica. É uma análise estratégica focada exclusivamente na sua realidade financeira, no seu patrimônio, nos seus objetivos e nas oportunidades que talvez ainda não estejam sendo observadas.",
      },
      {
        id: "analogia",
        label: "Analogia carro × estratégia",
        intent: "Provocar com uma comparação que o cliente premium reconhece em si.",
        trigger: "Auto-percepção desconfortável.",
        tone: "consultivo",
        script: "A maioria das pessoas revisa o carro mais vezes do que revisa a própria estratégia financeira. E os impactos financeiros são infinitamente maiores.",
      },
      {
        id: "visao-elite",
        label: "Visão da elite",
        intent: "Ancorar a reunião como hábito de quem está no topo.",
        trigger: "Prova social de elite + identidade aspiracional.",
        tone: "premium",
        script: "As pessoas mais bem-sucedidas que acompanhamos não são as que nunca erram. São as que criam momentos periódicos para desafiar as próprias decisões e validar se ainda estão no melhor caminho.",
      },
      {
        id: "fechamento",
        label: "Fechamento premium",
        intent: "Encerrar com a ideia de rentabilidade da própria conversa.",
        trigger: "Pressuposição de presença + valor financeiro implícito.",
        tone: "autoritario",
        script: "Preserve esse espaço na sua agenda. Existe uma grande chance de que essa seja uma das conversas mais rentáveis que você terá este ano, não pelo que será vendido, mas pela clareza que ela pode gerar. Nos vemos em breve.",
      },
    ],
    fechamento: "Tom firme, frases curtas e densas. Cliente premium não responde a entusiasmo, responde a precisão.",
    treino: {
      porqueExiste: "Cliente de alta renda já é abordado por bancos privados, corretoras e gestores. A ligação precisa se diferenciar pela densidade da fala e pelo enquadramento de igual-para-igual.",
      gatilhos: [
        { name: "Identidade aspiracional", explica: "'Pessoas como você...' ativa o filtro de status." },
        { name: "Custo da inércia", explica: "Não revisar é o erro mais caro." },
        { name: "Prova social vertical", explica: "Como as pessoas mais bem-sucedidas se comportam." },
        { name: "Especificidade", explica: "'Sua realidade, seu patrimônio, seus objetivos.'" },
      ],
      errosComuns: [
        "Falar muito, cliente premium corta o que parece script.",
        "Adjetivos genéricos ('muito legal', 'super bacana').",
        "Tom de admiração ou subordinação.",
        "Pedir confirmação. Cliente premium não gosta de ser cobrado.",
      ],
      indicadores: [
        "Cliente responde curto, mas firme: 'faz sentido, estarei lá'.",
        "Cliente menciona expectativa específica para a reunião.",
        "Cliente eleva o nível da pergunta (ex: 'vocês cobrem sucessão?').",
      ],
      mantra: "Cliente premium não compra reunião. Compra qualidade de decisão.",
    },
    objections: [
      { q: "Estou bem servido com meu banco privado.", a: "Faz total sentido. Justamente por isso essa conversa tende a ser útil: é o único ambiente em que ninguém precisa vender nada para você. É só análise. E quem é bem servido geralmente é quem mais ganha com uma segunda visão." },
      { q: "Não tenho tempo essa semana.", a: "Entendo perfeitamente. Posso te oferecer dois horários fora do expediente, ainda essa semana ou início da próxima. O custo de adiar essa análise costuma ser maior do que o de fazê-la." },
    ],
  },

  /* ============================================================
     3) REAGENDAMENTO PADRÃO
     ============================================================ */
  {
    id: "reagendamento",
    label: "Reagendamento",
    short: "Reagendamento",
    emoji: "🔁",
    accent: "var(--brand)",
    badge: "Pós no-show · até 48h depois",
    objetivo: "Resgatar a reunião perdida reativando o motivo original que levou o cliente a aceitar.",
    duracao: "3 a 5 minutos",
    publico: "Cliente que não compareceu ou cancelou",
    premissa: "O cliente não rejeitou a reunião. Ele rejeitou o horário. O objetivo original ainda existe, basta reativá-lo.",
    blocks: [
      {
        id: "abertura",
        label: "Abertura sem cobrança",
        intent: "Não constranger. Abrir espaço de conversa, não de justificativa.",
        trigger: "Não-julgamento. O cliente já está em culpa baixa, não amplifique.",
        tone: "empatico",
        script: "Olá, [Nome], tudo bem? Estou te ligando porque vi que não conseguimos realizar nossa reunião conforme planejado e eu queria falar contigo por um motivo muito importante.",
        dontSay: ["'Você sumiu'", "'Combinamos e você não apareceu'"],
      },
      {
        id: "reframe-motivo",
        label: "Reframe do motivo original",
        intent: "Lembrar o cliente de que ele aceitou por um objetivo SEU, não pela empresa.",
        trigger: "Auto-consistência. Pessoas honram aquilo que verbalizaram querer.",
        tone: "consultivo",
        script: "Quando você aceitou essa reunião, não foi por causa da Futuro ou por causa do planejador. Você aceitou porque existe um objetivo financeiro seu que merece atenção.",
      },
      {
        id: "lista-objetivos",
        label: "Listagem dos objetivos vivos",
        intent: "Reativar a memória emocional do motivo original.",
        trigger: "Ancoragem em objetivos pessoais. Ative pelo menos 2 que façam sentido.",
        tone: "consultivo",
        script: "Seja organizar melhor seu patrimônio, acelerar sua independência financeira, proteger sua família, construir aposentadoria ou simplesmente tomar decisões financeiras mais inteligentes.",
      },
      {
        id: "persistencia",
        label: "Persistência do objetivo",
        intent: "Mostrar que o objetivo continua existindo, só foi adiado.",
        trigger: "Verdade incômoda. O problema não desapareceu, apenas foi postergado.",
        tone: "autoritario",
        script: "E a verdade é que esse objetivo continua existindo hoje.",
      },
      {
        id: "descoberta",
        label: "Pergunta de descoberta",
        intent: "Entender o real motivo do no-show antes de propor solução.",
        trigger: "Escuta ativa + diagnóstico antes do reagendamento.",
        tone: "empatico",
        script: "Antes de encerrarmos qualquer possibilidade, queria entender: o que aconteceu para não conseguirmos conversar?",
        doSay: ["Pausa real. Espere o cliente responder."],
        dontSay: ["Atropelar a resposta", "Justificar pelo cliente ('imagino que tenha sido a correria')"],
      },
      {
        id: "reposicionamento",
        label: "Reposicionamento",
        intent: "Validar o motivo do cliente sem aceitar como definitivo.",
        trigger: "Empatia + redirecionamento. 'Faz sentido' não significa 'desistir'.",
        tone: "consultivo",
        script: "Perfeito, entendo. Então vamos fazer o seguinte: vamos encontrar um horário que funcione para você. Seria uma pena deixar uma decisão importante para depois e continuar com as mesmas dúvidas pelos próximos meses.",
      },
      {
        id: "duas-opcoes",
        label: "Duas opções de horário",
        intent: "Reduzir atrito de decisão oferecendo escolha binária.",
        trigger: "Pergunta de alternativa fechada. Nunca 'quando você pode?'.",
        tone: "autoritario",
        script: "Me fala seus horários para a semana que vem e te falo qual da minha agenda faz mais sentido: [Opção 1] ou [Opção 2]?",
        doSay: ["Sempre oferecer 2 opções concretas com dia e hora"],
        dontSay: ["'Quando seria bom para você?'", "'Você me diz'"],
      },
      {
        id: "fechamento",
        label: "Selo final",
        intent: "Encerrar com reforço de valor, não com 'obrigado'.",
        trigger: "Pressuposição positiva.",
        tone: "autoritario",
        script: "Excelente. Tenho certeza que será um tempo muito bem investido e que você sairá da conversa com muito mais clareza do que entrou. Nos vemos no dia [data].",
      },
    ],
    fechamento: "Reagendamento não é 'pedir mais uma chance'. É reativar o motivo original e oferecer um novo encaixe.",
    treino: {
      porqueExiste: "No-show não é desinteresse, é prioridade temporariamente trocada. A janela de 24-48h preserva o valor percebido da reunião antes que ele esfrie.",
      gatilhos: [
        { name: "Auto-consistência", explica: "Lembrar o cliente do 'sim' anterior dele." },
        { name: "Reativação do objetivo", explica: "Listar motivos vivos reativa a urgência." },
        { name: "Empatia produtiva", explica: "Validar sem desistir." },
        { name: "Alternativa fechada", explica: "Duas opções concretas geram mais 'sim' que pergunta aberta." },
      ],
      errosComuns: [
        "Cobrar o cliente pelo no-show.",
        "Aceitar 'depois eu te falo', perde o cliente.",
        "Perguntar 'quando seria bom?' em vez de propor 2 horários.",
        "Ligar 7+ dias depois, janela já fechou.",
      ],
      indicadores: [
        "Cliente justifica espontaneamente e demonstra culpa leve.",
        "Cliente aceita um dos dois horários propostos.",
        "Cliente menciona expectativa renovada para a próxima conversa.",
      ],
      mantra: "O cliente não cancelou o objetivo. Só cancelou o horário.",
    },
    objections: [
      { q: "Acho que não vai dar.", a: "Sem problema. Só uma pergunta antes de a gente encerrar: o motivo que te fez aceitar a reunião na primeira vez ainda existe? (espere a resposta) Então é exatamente sobre ele que vamos conversar." },
      { q: "Me liga semana que vem.", a: "Perfeito. Para garantir que isso aconteça, já deixo travado: prefere [Opção 1] ou [Opção 2]? Aí na semana eu só te lembro." },
    ],
  },

  /* ============================================================
     4) REAGENDAMENTO PREMIUM. ALTA RENDA
     ============================================================ */
  {
    id: "reagendamento-premium",
    label: "Reagendamento Premium · Alta Renda",
    short: "Reagendamento Premium",
    emoji: "♛",
    accent: "#c9a84c",
    badge: "Pós no-show · Alta renda",
    objetivo: "Resgatar o cliente premium sem perder autoridade, reativando o eixo decisão × patrimônio.",
    duracao: "3 a 4 minutos",
    publico: "Cliente premium que não compareceu",
    premissa: "Cliente premium não responde a empatia genérica. Responde à evidência de que decisões financeiras continuam acontecendo com ou sem ele.",
    blocks: [
      {
        id: "abertura",
        label: "Abertura direta",
        intent: "Curta. Sem rodeios.",
        trigger: "Respeito ao tempo + sinal de paridade.",
        tone: "premium",
        script: "Olá, [Nome], tudo bem? Estou te ligando porque vi que não conseguimos realizar nossa conversa e queria falar rapidamente sobre isso.",
      },
      {
        id: "reframe",
        label: "Reframe da reunião",
        intent: "Tirar o frame 'apresentação institucional' e instalar o frame 'análise patrimonial'.",
        trigger: "Especificidade premium.",
        tone: "autoritario",
        script: "Quando você aceitou essa reunião, não foi para conhecer a Futuro e nem para ouvir uma apresentação. O objetivo era criar um momento para analisar decisões financeiras que podem impactar o seu patrimônio pelos próximos anos.",
      },
      {
        id: "decisoes-continuam",
        label: "Decisões continuam acontecendo",
        intent: "Mostrar que o tempo correu, e custou.",
        trigger: "Custo de oportunidade. O patrimônio se move mesmo sem revisão.",
        tone: "autoritario",
        script: "Independente da correria, essas decisões continuam acontecendo. Você continua investindo. Continua pagando impostos. Continua tomando decisões sobre patrimônio, aposentadoria, proteção familiar e construção de riqueza.",
      },
      {
        id: "piloto-automatico",
        label: "Clareza × piloto automático",
        intent: "Provocar a auto-percepção sem confrontar diretamente.",
        trigger: "Dissonância. 'Você está decidindo, mas com qual nível de clareza?'",
        tone: "premium",
        script: "A única diferença é se essas decisões estão sendo tomadas com total clareza ou no piloto automático.",
      },
      {
        id: "descoberta",
        label: "Pergunta de descoberta",
        intent: "Diagnóstico antes da proposta.",
        trigger: "Escuta + posição de consultor.",
        tone: "consultivo",
        script: "Por isso eu queria entender: o que acabou impedindo nossa conversa?",
      },
      {
        id: "reposicionamento",
        label: "Reposicionamento de valor",
        intent: "Validar a resposta sem soltar o objetivo.",
        trigger: "ROI da própria reunião.",
        tone: "premium",
        script: "Faz sentido. Mas eu não gostaria que você perdesse essa oportunidade por uma questão de agenda. Uma única conversa traz insights que geram mais resultado financeiro do que meses tentando descobrir sozinho.",
      },
      {
        id: "duas-opcoes",
        label: "Duas opções concretas",
        intent: "Reduzir fricção da decisão de horário.",
        trigger: "Alternativa fechada.",
        tone: "autoritario",
        script: "Vamos encontrar um horário que funcione para você. Prefere [Opção 1] ou [Opção 2]?",
      },
      {
        id: "fechamento",
        label: "Selo de visão estratégica",
        intent: "Encerrar elevando o frame.",
        trigger: "Pressuposição + ganho de visão.",
        tone: "premium",
        script: "Excelente. Tenho certeza que será uma conversa extremamente produtiva e que você sairá dela com uma visão mais estratégica sobre sua situação financeira.",
      },
    ],
    fechamento: "Cliente premium reagenda quando percebe custo de oportunidade. Toda fala precisa carregar densidade de patrimônio.",
    treino: {
      porqueExiste: "Cliente de alta renda raramente cancela por desinteresse, cancela por sobreposição de prioridades. O reagendamento precisa lembrar que o patrimônio dele decide sozinho enquanto ele não revisa.",
      gatilhos: [
        { name: "Custo de oportunidade", explica: "Decisões financeiras estão acontecendo mesmo sem reunião." },
        { name: "Clareza × piloto automático", explica: "Provoca auto-percepção sem confronto." },
        { name: "ROI da conversa", explica: "Insights de 1h × meses de tentativa solo." },
        { name: "Alternativa fechada premium", explica: "2 opções específicas, não 'quando puder'." },
      ],
      errosComuns: [
        "Pedir desculpas pela ligação.",
        "Tratar como cliente comum (excesso de empatia abre fragilidade).",
        "Falar em produtos, taxas ou empresa.",
        "Aceitar 'depois eu te chamo' sem fechar nova opção.",
      ],
      indicadores: [
        "Cliente concede um motivo real (corrida, viagem, agenda).",
        "Cliente aceita um dos dois horários ou propõe um terceiro concreto.",
        "Cliente eleva a expectativa ('quero falar de sucessão também').",
      ],
      mantra: "Patrimônio não espera reagendamento. Revise antes que ele decida sozinho.",
    },
    objections: [
      { q: "Não tenho tempo agora.", a: "Justamente. Quanto menos tempo você tem, mais caro fica decidir sem revisar. Posso te oferecer um horário fora do expediente, ainda essa semana ou início da próxima?" },
      { q: "Tenho assessor / banco privado.", a: "Perfeito. Inclusive por isso essa conversa costuma render, é o único momento em que ninguém precisa te vender nada. É análise pura, com olhar externo." },
    ],
  },

  /* ============================================================
     5) RECUPERAÇÃO + RECOMENDAÇÕES PÓS-REUNIÃO
     ============================================================ */
  {
    id: "recuperacao-rec",
    label: "Recuperação Pós-Reunião + Recomendações",
    short: "Pós-Reunião · REC",
    emoji: "🎯",
    accent: "var(--success)",
    badge: "Pós-reunião · 24h–72h depois",
    objetivo: "Validar a experiência, reforçar valor percebido e extrair recomendações qualificadas em linha de forma consultiva.",
    duracao: "5 a 8 minutos",
    publico: "Cliente que já participou da reunião",
    premissa: "Indicação não se pede, se conduz. A janela ideal é logo após a reunião, quando o valor ainda está fresco.",
    blocks: [
      {
        id: "abertura",
        label: "Abertura institucional (sem cara de venda)",
        intent: "Tirar a guarda do cliente. Posicionar como liderança que acompanha, não vendedor que cobra.",
        trigger: "Autoridade + baixa pressão. 'Não é comercial.'",
        tone: "consultivo",
        script: "Olá, [Nome], tudo bem? Aqui é o [Nome do Líder], da Futuro. Fica tranquilo que essa não é uma ligação comercial. Estou entrando em contato porque acompanho o trabalho da equipe e gosto de conversar com algumas pessoas que participaram das reuniões para entender como foi a experiência. Você tem 2 minutinhos?",
        doSay: ["Falar o cargo: 'líder', 'gestor', 'diretor'", "Pedir 2 minutos, não a tarde toda"],
        dontSay: ["'Estou ligando para te oferecer'", "'É sobre indicações'"],
      },
      {
        id: "nota",
        label: "Validação por nota (0 a 10)",
        intent: "Trazer o cliente para a zona de feedback objetivo e abrir o canal emocional.",
        trigger: "Compromisso público. Quem dá nota alta precisa explicar, e explicar reforça o valor.",
        tone: "consultivo",
        script: "De 0 a 10, qual nota você daria para a reunião que teve com o [Nome do Planejador]?",
        doSay: ["Anotar a nota. Se for 8+, seguir. Se for 6-7, aprofundar antes de pedir REC."],
      },
      {
        id: "aprofundamento",
        label: "Aprofundamento da experiência",
        intent: "Fazer o cliente verbalizar o valor, quem verbaliza, vende para si mesmo.",
        trigger: "Auto-persuasão. O cliente passa a defender a própria experiência.",
        tone: "consultivo",
        script: "O que mais te chamou atenção durante a conversa? Teve algum momento, orientação ou reflexão que fez você enxergar sua situação financeira de uma forma diferente? Qual foi o principal aprendizado que você leva daquela reunião?",
      },
      {
        id: "reforco-valor",
        label: "Reforço de valor",
        intent: "Validar a fala do cliente e ancorar o propósito.",
        trigger: "Espelhamento + missão.",
        tone: "empatico",
        script: "Que ótimo ouvir isso. Nosso objetivo é justamente ajudar as pessoas a enxergarem oportunidades, riscos e caminhos que muitas vezes não estavam claros antes da conversa. Fico feliz em saber que a reunião agregou valor para você.",
      },
      {
        id: "transicao",
        label: "Transição para recomendações",
        intent: "Migrar para REC sem pedir favor. Usar a empatia do cliente, não a necessidade do consultor.",
        trigger: "Reciprocidade + pergunta projetiva. 'Se um amigo seu...'",
        tone: "consultivo",
        script: "Deixa eu te fazer uma pergunta... Se um amigo próximo, familiar ou colega de trabalho estivesse vivendo dúvidas parecidas com as que você tinha antes da reunião, você acredita que essa conversa poderia ajudar essa pessoa também?",
        doSay: ["Esperar o 'sim'."],
        dontSay: ["'Você teria alguém para indicar?'", "'Conhece alguém interessado?'"],
      },
      {
        id: "primeiro-nome",
        label: "Extração do primeiro nome",
        intent: "Capturar o primeiro nome que vem na cabeça, o mais quente.",
        trigger: "Memória episódica. A pergunta certa é fechada e direta.",
        tone: "autoritario",
        script: "Perfeito. E quem foi a primeira pessoa que veio na sua cabeça quando eu fiz essa pergunta?",
        doSay: ["Pausa. Aguarde o nome. Não preencha o silêncio."],
        dontSay: ["'Pode ser qualquer pessoa, viu?'"],
      },
      {
        id: "extracao-multipla",
        label: "Extração múltipla (mais 2 ou 3)",
        intent: "Coletar 3+ nomes antes de pedir qualquer telefone.",
        trigger: "Ancoragem de quantidade. 'Normalmente duas ou três.'",
        tone: "consultivo",
        script: "Excelente. E além dele(a), quem mais você acredita que se beneficiaria de uma conversa como essa? Normalmente quando alguém teve uma boa experiência, lembra de duas ou três pessoas que também gostariam de ter essa clareza. Quem mais veio na sua cabeça?",
      },
      {
        id: "registro-nomes",
        label: "Registro completo dos nomes",
        intent: "Travar os nomes antes da fricção do telefone.",
        trigger: "Compromisso visual. 'Só para eu registrar corretamente.'",
        tone: "autoritario",
        script: "Só para eu registrar corretamente: qual o nome completo dele(a)? E de quem mais você lembrou? (vá anotando todos os nomes antes de pedir contatos)",
      },
      {
        id: "contatos",
        label: "Obtenção dos contatos (continuidade natural)",
        intent: "Pedir o telefone como passo natural, não como autorização.",
        trigger: "Pressuposição. Nunca pergunte 'posso entrar em contato?'.",
        tone: "autoritario",
        script: "Para eu conseguir identificar a pessoa correta quando nossa equipe fizer a abordagem, qual o melhor telefone do(a) [Nome]? Ótimo. E do(a) [Nome 2]? Perfeito. E do(a) [Nome 3]?",
        dontSay: ["'Posso pegar o número?'", "'Tudo bem se eu falar com eles?'"],
      },
      {
        id: "encerramento",
        label: "Encerramento de elevação",
        intent: "Elevar o cliente, ele acabou de fazer algo importante para alguém.",
        trigger: "Identidade de pessoa generosa + segurança da abordagem.",
        tone: "empatico",
        script: "[Nome], obrigado pela confiança. Você está proporcionando para essas pessoas a oportunidade de ter a mesma clareza que você teve na sua reunião. Pode ficar tranquilo: nossa equipe fará uma abordagem profissional, respeitosa e sem qualquer compromisso. Obrigado pelo seu tempo e conte conosco.",
      },
    ],
    fechamento: "A ligação de pós-reunião é a maior fonte de recomendações qualificadas. Janela ideal: até 72h. Depois, o valor esfria e o cliente esquece os nomes.",
    treino: {
      porqueExiste: "A reunião gera percepção de valor. Sem ligação de pós, esse valor evapora em 5-7 dias. A ligação extrai REC enquanto a memória ainda está quente e o cliente está em estado emocional positivo.",
      gatilhos: [
        { name: "Compromisso público", explica: "Dar nota alta gera coerência. Cliente passa a defender a experiência." },
        { name: "Auto-persuasão", explica: "Verbalizar o aprendizado fortalece o valor para o próprio cliente." },
        { name: "Pergunta projetiva", explica: "'Se um amigo seu...' tira o peso do pedido direto." },
        { name: "Memória fechada", explica: "Pergunte pelo PRIMEIRO nome, não por uma lista." },
        { name: "Pressuposição", explica: "Pedir o telefone como passo natural, sem pedir autorização." },
      ],
      errosComuns: [
        "Começar pedindo recomendação, antes de validar a experiência.",
        "Perguntar 'tem alguém pra indicar?' (aberta = vazia).",
        "Pedir telefone antes de coletar todos os nomes.",
        "Pedir autorização ('posso falar com ele?'), abre brecha para 'eu falo antes'.",
        "Ligar 7+ dias depois da reunião, o valor já esfriou.",
      ],
      indicadores: [
        "Nota 8 ou superior.",
        "Cliente cita momento específico da reunião.",
        "Cliente fornece 3+ nomes sem resistência.",
        "Cliente entrega telefones em sequência natural.",
      ],
      mantra: "Você não está pedindo um favor. Está oferecendo às pessoas certas a mesma clareza que o cliente teve.",
    },
    objections: [
      { q: "Não consigo lembrar de ninguém agora.", a: "Sem problemas. Pensando em amigos, familiares, colegas de trabalho ou empresários que você conhece, quem normalmente conversa com você sobre dinheiro, investimentos, aposentadoria ou planejamento financeiro?" },
      { q: "Prefiro não passar contato.", a: "Sem problema algum. Inclusive, o mais importante já aconteceu, você lembrou dessas pessoas. Quem você acredita que mais teria valor nessa conversa?" },
      { q: "Posso falar com eles antes?", a: "Claro. Inclusive isso costuma funcionar muito bem. O número deles que vou adicionar aqui é para registro, e todos terão uma condição especial se fizer sentido. Qual o nome deles para eu registrar? O número é qual?" },
    ],
  },
];

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

type Mode = "ligacao" | "treino";

function Ligacoes() {
  const [activeId, setActiveId] = useState<string>(CALL_TYPES[0].id);
  const [mode, setMode] = useState<Mode>("ligacao");
  const [copied, setCopied] = useState<string | null>(null);

  const call = useMemo(
    () => CALL_TYPES.find((c) => c.id === activeId) ?? CALL_TYPES[0],
    [activeId]
  );

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  const fullScript = useMemo(() => {
    return [
      `# ${call.label}`,
      `Objetivo: ${call.objetivo}`,
      `Duração: ${call.duracao}`,
      `Público: ${call.publico}`,
      "",
      ...call.blocks.map(
        (b) => `[${b.label.toUpperCase()}]\n${b.script}`
      ),
      "",
      `# Fechamento\n${call.fechamento}`,
    ].join("\n\n");
  }, [call]);

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
              <PhoneCall className="h-3.5 w-3.5" /> Modo Ligação
            </span>
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Passo a Passo de <span className="text-[var(--success)]">Ligações Elite</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed">
            Cinco modelos de ligação com script de execução e treinamento profundo: por que cada frase existe, qual gatilho ela ativa e como conduzir como um especialista.
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: "Modelos", v: `${CALL_TYPES.length}` },
              { l: "Confirmação", v: "Padrão + Premium" },
              { l: "Reagendamento", v: "Padrão + Premium" },
              { l: "Pós-reunião", v: "REC qualificada" },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{m.l}</p>
                <p className="mt-2 text-xl sm:text-2xl font-extrabold text-white">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* CALL TYPE SELECTOR */}
      <nav className="sticky top-12 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 flex items-center gap-2 flex-wrap">
          <div role="tablist" className="inline-flex items-center rounded-xl border border-border bg-[var(--surface)] p-1">
            <ModeButton
              active={mode === "ligacao"}
              onClick={() => setMode("ligacao")}
              icon={<Headphones className="h-3.5 w-3.5" />}
              label="Modo Ligação"
              activeClass="bg-[var(--success)] text-[var(--navy)] shadow-sm shadow-[var(--success)]/30"
            />
            <ModeButton
              active={mode === "treino"}
              onClick={() => setMode("treino")}
              icon={<GraduationCap className="h-3.5 w-3.5" />}
              label="Modo Treinamento"
              activeClass="bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/30"
            />
          </div>
          <button
            type="button"
            onClick={() => copy(fullScript, "all")}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 min-h-11 text-xs sm:text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)] transition ml-auto"
          >
            {copied === "all" ? <Check className="h-4 w-4 text-[var(--success)]" /> : <ClipboardCopy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied === "all" ? "Copiado" : "Copiar script completo"}</span>
          </button>
        </div>

        {/* CHIPS DOS MODELOS DE LIGAÇÃO */}
        <div className="border-t border-border bg-gradient-to-b from-white to-[var(--surface)]/60">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 w-max pr-2">
                <span className="hidden sm:inline shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground pr-1">
                  Modelo
                </span>
                {CALL_TYPES.map((c) => {
                  const active = c.id === activeId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border ${
                        active
                          ? "text-white border-transparent shadow-md"
                          : "bg-white border-border text-[var(--navy)] hover:border-[color:var(--brand)] hover:text-[var(--brand)]"
                      }`}
                      style={active ? { background: c.accent, boxShadow: `0 8px 20px -10px ${c.accent}` } : {}}
                    >
                      <span aria-hidden>{c.emoji}</span>
                      {c.short}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-12" data-edit-scope={`ligacoes:${call.id}`}>
        {/* CABEÇALHO DO MODELO ATIVO */}
        <section className="rounded-3xl border-2 p-6 sm:p-8 text-white shadow-2xl bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c]"
          style={{ borderColor: call.accent, boxShadow: `0 30px 80px -40px ${call.accent}` }}
        >
          <div className="flex items-start gap-3 flex-wrap">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
              style={{ background: call.accent, color: "var(--navy)" }}
              aria-hidden
            >
              {call.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: call.accent }}>{call.badge}</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">{call.label}</h2>
              <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">{call.premissa}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniStat icon={<Target className="h-4 w-4" />} label="Objetivo" value={call.objetivo} />
            <MiniStat icon={<RefreshCw className="h-4 w-4" />} label="Duração" value={call.duracao} />
            <MiniStat icon={<Star className="h-4 w-4" />} label="Público" value={call.publico} />
          </div>
        </section>

        {/* CONTEÚDO POR MODO */}
        <div className="mt-10 sm:mt-14">
          {mode === "ligacao" ? (
            <LigacaoMode call={call} copy={copy} copied={copied} />
          ) : (
            <TreinoMode call={call} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   MODO LIGAÇÃO
   ============================================================ */

function LigacaoMode({
  call, copy, copied,
}: { call: CallType; copy: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* REGRA DE OURO */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)] shadow-lg shadow-[var(--success)]/30">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Regra Elite</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Não improvise. Conduza.</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              Cada bloco abaixo existe por um motivo. Siga a ordem, respeite os silêncios e mantenha o tom indicado em cada etapa.
            </p>
          </div>
        </div>
      </section>

      {/* BLOCOS */}
      {call.blocks.map((b, i) => (
        <BlockCard
          key={b.id}
          n={i + 1}
          block={b}
          accent={call.accent}
          onCopy={() => copy(b.script, `${call.id}-${b.id}`)}
          copied={copied === `${call.id}-${b.id}`}
        />
      ))}

      {/* OBJEÇÕES */}
      {call.objections && call.objections.length > 0 && (
        <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
          <header className="mb-5 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--warn)]/15 text-[var(--warn)]">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--warn)]">Contorno de objeções</p>
              <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)]">Respostas prontas</h3>
            </div>
          </header>
          <div className="grid gap-3 md:grid-cols-2">
            {call.objections.map((o, i) => (
              <div key={i} className="rounded-2xl border border-border bg-[var(--surface)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)] flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Objeção do cliente
                </p>
                <p className="mt-1.5 text-sm font-semibold italic text-[var(--navy)]/80">“{o.q}”</p>
                <blockquote className="fala-script mt-3">“{o.a}”</blockquote>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SELO FINAL — Fechamento e agendamento */}
      <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
        <header className="mb-4 flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: call.accent, boxShadow: `0 8px 24px -8px ${call.accent}` }}
          >
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: call.accent }}>
              Fechamento e agendamento
            </p>
            <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)]">Selar o compromisso</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Frase de encerramento para reforçar o motivo da ligação e travar o próximo passo com o cliente.
            </p>
          </div>
        </header>
        <blockquote className="fala-script">“{call.fechamento}”</blockquote>
      </section>
    </div>
  );
}

/* ============================================================
   MODO TREINAMENTO
   ============================================================ */

function TreinoMode({ call }: { call: CallType }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* CAPA */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/40">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Academia de ligações</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Por que essa ligação existe</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">{call.treino.porqueExiste}</p>
          </div>
        </div>
      </section>

      {/* GATILHOS */}
      <section>
        <SectionHeader
          icon={<Sparkles className="h-5 w-5" />}
          eyebrow="Gatilhos psicológicos"
          title="O que está acontecendo no cérebro do cliente"
          accent={call.accent}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {call.treino.gatilhos.map((g) => (
            <div key={g.name} className="rounded-2xl border border-border bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: call.accent }}>Gatilho</p>
              <p className="mt-1 text-lg font-bold text-[var(--navy)]">{g.name}</p>
              <p className="mt-2 text-sm text-[var(--navy)]/80 leading-relaxed">{g.explica}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ERROS COMUNS × INDICADORES */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border-2 border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6">
          <header className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--danger)]/15 text-[var(--danger)]">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">Erros comuns</p>
              <h3 className="mt-0.5 text-xl font-bold text-[var(--navy)]">O que destrói essa ligação</h3>
            </div>
          </header>
          <ul className="space-y-2.5">
            {call.treino.errosComuns.map((e, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl bg-white border border-border px-3 py-2">
                <span className="mt-0.5 text-[var(--danger)] font-bold">✕</span>
                <span className="text-sm text-[var(--navy)] leading-snug">{e}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border-2 border-[var(--success)]/30 bg-[var(--success)]/5 p-6">
          <header className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)]/20 text-[var(--success)]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Indicadores de sucesso</p>
              <h3 className="mt-0.5 text-xl font-bold text-[var(--navy)]">Sinais de que está funcionando</h3>
            </div>
          </header>
          <ul className="space-y-2.5">
            {call.treino.indicadores.map((s, i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl bg-white border border-border px-3 py-2">
                <span className="mt-0.5 text-[var(--success)] font-bold">✓</span>
                <span className="text-sm text-[var(--navy)] leading-snug">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DESCONSTRUÇÃO DE CADA BLOCO */}
      <section>
        <SectionHeader
          icon={<Repeat className="h-5 w-5" />}
          eyebrow="Anatomia da ligação"
          title="O motivo por trás de cada bloco"
          accent={call.accent}
        />
        <div className="space-y-3">
          {call.blocks.map((b, i) => (
            <details key={b.id} className="group rounded-2xl border border-border bg-white p-4 sm:p-5 open:shadow-md transition">
              <summary className="cursor-pointer list-none flex items-start gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                  style={{ background: call.accent }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: call.accent }}>Bloco {i + 1}</p>
                  <p className="mt-0.5 text-base font-bold text-[var(--navy)]">{b.label}</p>
                </div>
                <span className="text-xs text-muted-foreground group-open:hidden">expandir</span>
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-[var(--surface)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Intenção</p>
                  <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{b.intent}</p>
                </div>
                <div className="rounded-xl border border-border bg-[var(--surface)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Gatilho ativado</p>
                  <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{b.trigger}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* MANTRA */}
      <section className="rounded-3xl border-2 p-6 sm:p-8 text-white" style={{ borderColor: call.accent, background: "linear-gradient(135deg, #0a1733, var(--navy))" }}>
        <div className="flex items-start gap-3">
          <Quote className="h-8 w-8 shrink-0" style={{ color: call.accent }} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: call.accent }}>Mantra</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold leading-snug">“{call.treino.mantra}”</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   COMPONENTES AUXILIARES
   ============================================================ */

function ModeButton({
  active, onClick, icon, label, activeClass,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; activeClass: string }) {
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

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center gap-1.5 text-white/60">
        <span aria-hidden>{icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-white leading-snug">{value}</p>
    </div>
  );
}

function SectionHeader({
  icon, eyebrow, title, accent,
}: { icon: React.ReactNode; eyebrow: string; title: string; accent: string }) {
  return (
    <header className="mb-4 sm:mb-6 flex items-start gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
        style={{ background: accent, boxShadow: `0 8px 24px -8px ${accent}` }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>{eyebrow}</p>
        <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">{title}</h2>
      </div>
    </header>
  );
}

/**
 * Bloco do script editável com prévia ao vivo do formatScript.
 * Quando o admin está em Modo Edição, mostra um painel abaixo do
 * blockquote com o resultado formatado em tempo real (debounced).
 */
function ScriptEditable({ script, accent }: { script: string; accent: string }) {
  const { isAdmin, editMode } = useContent();
  const ref = useRef<HTMLQuoteElement | null>(null);
  const initial = useMemo(() => `“${formatScript(script)}”`, [script]);
  const [preview, setPreview] = useState(initial);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => { setPreview(initial); }, [initial]);

  useEffect(() => {
    if (!isAdmin || !editMode) return;
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        const raw = ((el as HTMLElement).innerText ?? el.textContent ?? "")
          .replace(/^[“"]\s*/, "")
          .replace(/\s*[”"]$/, "");
        setPreview(`“${formatScript(raw)}”`);
      }, 180);
    };
    el.addEventListener("input", handler);
    return () => {
      if (t) clearTimeout(t);
      el.removeEventListener("input", handler);
    };
  }, [isAdmin, editMode]);

  return (
    <>
      <blockquote
        ref={ref}
        data-editable-text
        className="fala-script"
      >
        {initial}
      </blockquote>
      {isAdmin && editMode && (
        <div
          className="mt-3 rounded-xl border border-dashed p-4"
          style={{ borderColor: `color-mix(in oklab, ${accent} 50%, transparent)`, background: `color-mix(in oklab, ${accent} 5%, white)` }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: accent }}>
              <Eye className="h-3.5 w-3.5" /> Prévia ao vivo (formatScript)
            </p>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--navy)] hover:bg-[var(--surface)] transition"
            >
              {showPreview ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {showPreview && (
            <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-[14.5px] leading-relaxed text-[var(--navy)]">
              {preview}
            </pre>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Atualiza enquanto você edita. As quebras de “Opção N”, “Gatilho:” e listas aparecem aqui antes de salvar.
          </p>
        </div>
      )}
    </>
  );
}

function BlockCard({
  n, block, accent, onCopy, copied,
}: { n: number; block: Block; accent: string; onCopy: () => void; copied: boolean }) {
  const tone = block.tone ? TONE_STYLE[block.tone] : null;
  return (
    <section id={block.id} className="scroll-mt-32">
      <header className="mb-4 flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-sm font-extrabold shadow-md"
          style={{ background: accent, boxShadow: `0 8px 24px -8px ${accent}` }}
        >
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>Bloco {n}</p>
          <h3 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">{block.label}</h3>
          <p className="mt-1.5 max-w-3xl text-[14.5px] text-muted-foreground leading-relaxed">{block.intent}</p>
        </div>
        {tone && (
          <span
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: tone.color, borderColor: `color-mix(in oklab, ${tone.color} 40%, transparent)`, background: `color-mix(in oklab, ${tone.color} 8%, white)` }}
          >
            <Sparkles className="h-3 w-3" /> {tone.label}
          </span>
        )}
      </header>

      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        {/* SCRIPT */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Script</p>
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--navy)] hover:bg-white transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <ScriptEditable script={block.script} accent={accent} />

        {/* GATILHO */}
        <div className="mt-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)] flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5" /> Gatilho ativado
          </p>
          <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{block.trigger}</p>
        </div>

        {/* DO / DON'T */}
        {(block.doSay || block.dontSay) && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {block.doSay && (
              <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">✅ Faça</p>
                <ul className="mt-2 space-y-1.5">
                  {block.doSay.map((d, i) => (
                    <li key={i} className="text-sm text-[var(--navy)] leading-snug">• {d}</li>
                  ))}
                </ul>
              </div>
            )}
            {block.dontSay && (
              <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)]">❌ Evite</p>
                <ul className="mt-2 space-y-1.5">
                  {block.dontSay.map((d, i) => (
                    <li key={i} className="text-sm text-[var(--navy)] leading-snug">• {d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}