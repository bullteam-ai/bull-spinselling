export type ObjectionCategory =
  | "Tempo"
  | "Decisor"
  | "Dinheiro"
  | "Confiança"
  | "Desconforto"
  | "Autonomia"
  | "Medo de compromisso";

export type ObjectionItem = {
  q: string;
  intencao?: string;
  resposta: string;
  escalada?: string;
  categoria?: ObjectionCategory;
};

export const CATEGORY_STYLE: Record<
  ObjectionCategory,
  { color: string; bg: string }
> = {
  Tempo: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  Decisor: { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  Dinheiro: { color: "#16a34a", bg: "rgba(22,163,74,0.12)" },
  Confiança: { color: "#c9a84c", bg: "rgba(201,168,76,0.15)" },
  Desconforto: { color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
  Autonomia: { color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
  "Medo de compromisso": { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
};

export const SHARED_OBJECTIONS: ObjectionItem[] = [
  {
    q: "Vou ver com minha esposa/marido",
    categoria: "Decisor",
    intencao: "Transferir a decisão para outra pessoa ou evitar compromisso imediato.",
    resposta:
      "Perfeito, faz sentido envolver quem toma decisões importantes com você. E justamente por isso a entrevista pode ajudar, porque ela traz clareza para vocês decidirem com mais segurança. O ideal é inclusive que vocês dois participem juntos. Qual horário faria sentido para vocês?",
    escalada:
      "Quando a decisão envolve a família, faz ainda mais sentido olhar isso com clareza. O que seria melhor: vocês decidirem no escuro ou com um diagnóstico financeiro bem feito na mão?",
  },
  {
    q: "Me manda por WhatsApp",
    categoria: "Tempo",
    intencao: "Ganhar tempo, encerrar a conversa ou evitar interação.",
    resposta:
      "Eu te mando sim. Mas o ponto é que, por mensagem, isso perde muita força, porque não estamos falando de uma informação genérica. Estamos falando de entender seus objetivos, sua realidade e os caminhos possíveis. A entrevista existe justamente para personalizar isso.",
    escalada:
      "Se fosse algo simples de explicar por mensagem, eu mandaria agora. Mas como envolve sua realidade financeira, faz mais sentido olhar com profundidade. Melhor fazermos isso de forma correta.",
  },
  {
    q: "Agora estou sem dinheiro",
    categoria: "Dinheiro",
    intencao:
      "Medo de venda, falta de caixa ou associação da entrevista com compra imediata.",
    resposta:
      "Entendo. E justamente por isso pode fazer sentido conversar. A entrevista não parte do princípio de que você precisa investir agora. Ela serve para entender sua situação, organizar prioridades e enxergar caminhos possíveis.",
    escalada:
      "Às vezes o melhor momento para organizar a vida financeira é justamente quando a pessoa sente que não está no cenário ideal. A conversa pode te ajudar a ter clareza antes de tomar qualquer decisão.",
  },
  {
    q: "Não gosto de falar de finanças",
    categoria: "Desconforto",
    intencao: "Desconforto, insegurança ou experiências ruins anteriores.",
    resposta:
      "Eu entendo. Muita gente sente isso porque finanças costuma ser tratado de um jeito técnico, frio ou confuso. A proposta da entrevista é diferente: transformar seus objetivos em algo claro, simples e prático.",
    escalada:
      "Justamente por não ser um assunto confortável para muita gente, ter alguém conduzindo com clareza pode facilitar bastante. Você não precisa dominar finanças para participar.",
  },
  {
    q: "Já invisto sozinho",
    categoria: "Autonomia",
    intencao: "Defesa de autonomia ou medo de parecer que está errado.",
    resposta:
      "Excelente. Isso mostra que você já se preocupa com o futuro. A entrevista não é para desconsiderar o que você faz, mas para validar se sua estratégia está realmente conectada aos seus objetivos e se existe algum caminho mais eficiente.",
    escalada:
      "Quem já investe costuma aproveitar ainda mais uma segunda visão, porque já tem base para comparar. A pergunta não é se você investe. É se está usando a melhor estratégia possível para chegar onde quer.",
  },
  {
    q: "Não quero compromisso",
    categoria: "Medo de compromisso",
    intencao: "Medo de pressão comercial.",
    resposta:
      "Perfeito, e a entrevista não precisa ser vista como compromisso de contratação. O compromisso é apenas com a clareza. A ideia é você sair entendendo melhor onde está, onde quer chegar e quais caminhos existem.",
    escalada:
      "Eu prefiro que você participe sem obrigação nenhuma, mas com abertura para entender. Se fizer sentido, seguimos. Se não fizer, você pelo menos sai com mais clareza.",
  },
];