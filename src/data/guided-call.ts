export type GuidedStage = {
  id: string;
  label: string;
  objetivo: string;
  fala: string;
  aprofundamento: string[];
  sim: string[];
  nao: string[];
  transicao: string;
};

export const CALL_KINDS = [
  {
    id: "amigo",
    label: "Amigo",
    emoji: "🤝",
    hint: "Ligação para pessoa próxima. Tom leve, sem cerimônia.",
  },
  {
    id: "recomendacao",
    label: "Recomendação",
    emoji: "🎯",
    hint: "Ligação para indicação. Tom consultivo, mais formal.",
  },
] as const;

export type CallKindId = (typeof CALL_KINDS)[number]["id"];

export const OBJECTIVES = [
  { id: "independencia", label: "Independência Financeira", emoji: "💰" },
  { id: "aposentadoria", label: "Aposentadoria", emoji: "🌴" },
  { id: "filhos", label: "Futuro dos Filhos", emoji: "👨‍👩‍👧" },
  { id: "casamento", label: "Casamento e Projetos Familiares", emoji: "💍" },
  { id: "casa", label: "Compra de Casa", emoji: "🏡" },
  { id: "carro", label: "Compra de Carro", emoji: "🚗" },
  { id: "viagens", label: "Viagens", emoji: "✈️" },
  { id: "empreendedorismo", label: "Empreendedorismo", emoji: "🚀" },
  { id: "organizacao", label: "Organização Financeira", emoji: "📊" },
  { id: "sem-objetivo", label: "Cliente Sem Objetivo", emoji: "🧭" },
  { id: "ja-tem-assessor", label: "Já Possui Assessor", emoji: "🛡️" },
] as const;

export type ObjectiveId = (typeof OBJECTIVES)[number]["id"];

/**
 * Mapa opcional de gancho por objetivo. Personaliza a fala da Abertura e
 * da etapa Objetivo sem duplicar todo o roteiro.
 */
export const OBJECTIVE_HOOKS: Record<
  ObjectiveId,
  { abertura?: string; objetivo?: string }
> = {
  independencia: {
    objetivo:
      "Se hoje você pudesse parar de trabalhar sem perder o padrão de vida, isso mudaria alguma coisa para você?",
  },
  aposentadoria: {
    objetivo:
      "Quando você imagina sua aposentadoria, como quer que ela seja de verdade? E o que hoje está te levando pra lá?",
  },
  filhos: {
    objetivo:
      "Quando você pensa no futuro dos seus filhos, o que você quer poder garantir para eles daqui a 10 ou 15 anos?",
  },
  casamento: {
    objetivo:
      "Vocês têm algum projeto grande de família pra frente? Casa, mudança, filhos, tempo juntos, algo assim?",
  },
  casa: {
    objetivo:
      "Você já sonha com a sua casa? Como ela é? E o que hoje te separa dela?",
  },
  carro: {
    objetivo:
      "Que tipo de carro faria sentido pra sua vida? E como você está se organizando pra chegar lá sem comprometer o resto?",
  },
  viagens: {
    objetivo:
      "Se dinheiro não fosse um limitador, quais viagens você faria nos próximos anos? O que hoje impede isso?",
  },
  empreendedorismo: {
    objetivo:
      "Você tem algum plano de tirar um projeto do papel? Um negócio, uma virada de carreira?",
  },
  organizacao: {
    objetivo:
      "Se pudesse resolver uma dor financeira sua hoje, qual seria? E o que já tentou fazer sobre isso?",
  },
  "sem-objetivo": {
    objetivo:
      "Sem pressão nenhuma: se você olhasse pros próximos 5 anos, o que você gostaria que estivesse diferente na sua vida?",
  },
  "ja-tem-assessor": {
    objetivo:
      "Você já tem quem te acompanhe no financeiro. Bacana. E o que essa estratégia atual está te entregando de resultado hoje?",
  },
};

/**
 * 10 etapas da condução guiada. Estrutura SPIN adaptada para o funil de
 * marcação/entrevista.
 */
export const GUIDED_STAGES: GuidedStage[] = [
  {
    id: "abertura",
    label: "Abertura",
    objetivo: "Quebrar o gelo e abrir espaço sem soar comercial.",
    fala: "Oi, [Nome], tudo bem? Tô te ligando aqui, tem 3 minutinhos pra conversar?",
    aprofundamento: [
      "Se pergunta o motivo: “é rapidinho, só pra te apresentar uma ideia que faz sentido pra várias pessoas do seu círculo.”",
      "Use o nome do cliente pelo menos 2 vezes nessa etapa.",
    ],
    sim: [
      "Confirmar tom leve e seguir para o objetivo.",
      "“Perfeito, vou ser bem direto contigo, promessa.”",
    ],
    nao: [
      "“Sem problema. Quando é um bom horário mais tarde ou amanhã?”",
      "Marcar callback específico, não “te ligo depois”.",
    ],
    transicao: "Antes de te contar o motivo, posso te fazer uma pergunta rápida?",
  },
  {
    id: "objetivo",
    label: "Objetivo",
    objetivo: "Descobrir o que realmente importa pro cliente hoje.",
    fala: "O que você mais quer conquistar nos próximos 3 a 5 anos?",
    aprofundamento: [
      "Deixe o silêncio trabalhar. Não corte a resposta.",
      "Se responder “não sei”, pergunte: “o que você quer que esteja diferente daqui 5 anos?”",
    ],
    sim: [
      "Espelhar o objetivo com as palavras dele. “Então o que importa é X, é isso?”",
      "Anote mentalmente pra usar nas próximas etapas.",
    ],
    nao: [
      "Traga um objetivo espelho: “muita gente que eu converso quer Y. Faz sentido pra você também?”",
      "Não empurre venda, resgate a conversa.",
    ],
    transicao: "E olhando pra hoje, como está a caminhada pra chegar lá?",
  },
  {
    id: "situacao",
    label: "Situação",
    objetivo: "Entender a realidade financeira atual sem invadir.",
    fala: "Hoje você tem alguma estratégia rodando pra chegar nesse objetivo, ou tá mais no piloto automático?",
    aprofundamento: [
      "Se ele já investe: “bacana, o que te levou a escolher esse caminho?”",
      "Se não investe: “o que tem te impedido de começar?”",
    ],
    sim: [
      "Aprofunde: “e você está acompanhando os resultados de perto ou é mais no piloto?”",
      "Elogie a atitude, sem bajular.",
    ],
    nao: [
      "Normalize: “é a realidade da maioria, tranquilo.”",
      "Reforce que a entrevista é justamente pra organizar isso.",
    ],
    transicao: "E o que te incomoda hoje quando você para pra pensar nisso?",
  },
  {
    id: "problema",
    label: "Problema",
    objetivo: "Provocar a dor real por trás da situação.",
    fala: "O que mais te incomoda hoje quando você pensa em dinheiro, futuro ou aposentadoria?",
    aprofundamento: [
      "Escuta ativa. Se ele disser “nada”, insista: “nada mesmo? Nem uma coisa que você adiaria de bom grado?”",
      "Nomeie a dor com as palavras dele.",
    ],
    sim: [
      "Aprofunde: “há quanto tempo isso te incomoda?”",
      "“Já tentou resolver isso alguma vez?”",
    ],
    nao: [
      "Traga uma dor comum: “muita gente do seu perfil me fala que sente X, você já pensou nisso?”",
      "Não invente dor. Se ele não tem, siga leve pra próxima.",
    ],
    transicao: "E se isso continuar assim pelos próximos 5 anos, o que acontece?",
  },
  {
    id: "implicacao",
    label: "Implicação",
    objetivo: "Amplificar o custo de não resolver.",
    fala: "Se você seguir do jeito que está pelos próximos 5 anos, onde você imagina que vai chegar?",
    aprofundamento: [
      "Pergunte “e depois?” pelo menos 2 vezes pra escalar a dor.",
      "Não conclua por ele. Deixe o cliente descobrir sozinho.",
    ],
    sim: [
      "“Isso te preocupa?” Se sim, seguir. Se muito, marcar já.",
      "Reforce: “então a decisão de não decidir também custa.”",
    ],
    nao: [
      "“Beleza. E se o cenário piorar? Como você lida?”",
      "Traga fato real: “vi gente do seu perfil ter que voltar a trabalhar aos 65.”",
    ],
    transicao: "Então, se existisse um jeito de organizar isso com clareza, faria sentido pra você olhar?",
  },
  {
    id: "necessidade",
    label: "Necessidade",
    objetivo: "Fazer o cliente verbalizar que quer resolver.",
    fala: "Se a gente conseguisse te mostrar um caminho claro pra chegar em [objetivo], valeria a pena uma conversa?",
    aprofundamento: [
      "Espelhe o objetivo dito na etapa 2.",
      "Não venda produto. Venda a clareza.",
    ],
    sim: [
      "“Perfeito. É exatamente pra isso que existe a entrevista.”",
      "Já ir pra sinais de compra.",
    ],
    nao: [
      "“O que te faria valer a pena?”",
      "Reenquadrar: “é 1h, sem custo, sem obrigação. O pior cenário é você sair com mais clareza.”",
    ],
    transicao: "Deixa eu te contar rapidamente como funciona essa conversa.",
  },
  {
    id: "sinais",
    label: "Sinais de Compra",
    objetivo: "Ler engajamento antes de propor agenda.",
    fala: "Faz sentido pra você essa conversa acontecer nos próximos dias?",
    aprofundamento: [
      "Observe hesitação, tom de voz, perguntas de detalhe.",
      "Pergunta sobre esposa/marido é sinal forte de intenção.",
    ],
    sim: [
      "Avance direto pra agenda. Não explique de novo.",
      "Trave uma janela: “tenho terça 19h ou quinta 20h. Qual funciona melhor?”",
    ],
    nao: [
      "“O que te faz hesitar? Fala sem cerimônia.”",
      "Trate a objeção antes de propor agenda.",
    ],
    transicao: "Então bora travar um horário que seja bom pra você.",
  },
  {
    id: "agendamento",
    label: "Agendamento",
    objetivo: "Marcar sem deixar em aberto.",
    fala: "Tenho duas janelas: [dia 1, horário] ou [dia 2, horário]. Qual funciona melhor pra você?",
    aprofundamento: [
      "Sempre oferecer opção A ou B. Nunca “quando você pode?”.",
      "Confirme dia da semana + horário, não só data.",
    ],
    sim: [
      "Repita a data: “fechado, [dia] às [hora], 1 hora, tá combinado.”",
      "Pergunte se é on-line ou presencial e confirme link/local.",
    ],
    nao: [
      "“Qual dia dessa semana funcionaria melhor pra você?”",
      "Se enrolar: “te mando duas opções pelo WhatsApp e você me confirma até amanhã, combinado?”",
    ],
    transicao: "Antes de encerrar, deixa eu te falar duas coisinhas rápidas sobre a reunião.",
  },
  {
    id: "compromisso",
    label: "Compromisso",
    objetivo: "Blindar o no-show e alinhar expectativa.",
    fala: "Pra essa conversa render, é importante você estar num lugar tranquilo, sem estar dirigindo. Combinado?",
    aprofundamento: [
      "Peça pra colocar na agenda com lembrete.",
      "Se casado, sugira que o cônjuge participe.",
    ],
    sim: [
      "“Perfeito. Vou te mandar o convite agora e te lembro no dia.”",
      "Se dispuser, peça WhatsApp confirmando o horário.",
    ],
    nao: [
      "“Sem problema. O que precisa acontecer pra você ficar 100% tranquilo?”",
      "Renegociar horário ou formato, não abandonar a marcação.",
    ],
    transicao: "Última coisa e eu te libero.",
  },
  {
    id: "comparecimento",
    label: "Comparecimento",
    objetivo: "Reaquecer no dia e evitar cancelamento.",
    fala: "Vou passar rapidinho aqui: nossa conversa é [hoje/amanhã] às [hora]. Tá tudo certo pra você?",
    aprofundamento: [
      "Fale “nossa conversa”, não “nossa reunião”.",
      "Não pergunte “você confirma?”. Reforce a presença assumindo.",
    ],
    sim: [
      "“Ótimo, te vejo daqui a pouco. Qualquer coisa me chama.”",
      "Envie link/local mais uma vez.",
    ],
    nao: [
      "“Entendi. Qual o próximo horário bom pra gente reagendar essa semana?”",
      "Se possível, remarcar dentro de 48h.",
    ],
    transicao: "Encerrar leve, sem cobrança, com autoridade.",
  },
];

export function buildGuidedStages(
  _kind: CallKindId,
  objective: ObjectiveId,
): GuidedStage[] {
  const hook = OBJECTIVE_HOOKS[objective];
  return GUIDED_STAGES.map((s) => {
    if (s.id === "objetivo" && hook?.objetivo) {
      return { ...s, fala: hook.objetivo };
    }
    if (s.id === "abertura" && hook?.abertura) {
      return { ...s, fala: hook.abertura };
    }
    return s;
  });
}