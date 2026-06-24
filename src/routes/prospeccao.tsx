import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Target, Compass, Users, Handshake, MessageCircle, Instagram, Linkedin,
  Briefcase, Stethoscope, Scale, Home as HomeIcon, Building2, Search,
  GraduationCap, Brain, Sparkles, AlertTriangle, CheckCircle2, Quote,
  Lightbulb, Radar, ThermometerSun, ListChecks, BookOpen, Network,
  ArrowUpRight, RefreshCw, Crown, HelpCircle, Ear, Shield, Heart,
} from "lucide-react";

export const Route = createFileRoute("/prospeccao")({
  head: () => ({
    meta: [
      { title: "Bull Team | Prospecção de Contatos e Parcerias" },
      { name: "description", content: "Como encontrar, abordar e desenvolver fontes recorrentes de contatos qualificados e parcerias estratégicas." },
      { property: "og:title", content: "Bull Team | Prospecção de Contatos e Parcerias" },
      { property: "og:description", content: "Método em 10 etapas para construir uma rede de prospecção que gera leads qualificados de forma recorrente — não pedindo indicação, construindo fontes." },
    ],
  }),
  component: Prospeccao,
});

/* ============================================================
   TIPOS
   ============================================================ */

type Audience = {
  id: string;
  label: string;
  short: string;
  emoji: string;
  icon: React.ReactNode;
  accent: string;
  badge: string;
  premissa: string;
  perfil: string;
  exemplos: AudienceExample[];
};

type AudienceExample = {
  titulo: string;
  mensagem: string;
  quando: string;
  porqueFunciona: string;
  continuar: string;
};

type Etapa = {
  id: string;
  numero: number;
  titulo: string;
  objetivo: string;
  regra?: string;
  bullets: { eyebrow: string; itens: string[] }[];
  erros?: string[];
  exemplos?: { eyebrow: string; texto: string }[];
  icon: React.ReactNode;
};

/* ============================================================
   ETAPAS (MODO PRÁTICA)
   ============================================================ */

const ETAPAS: Etapa[] = [
  {
    id: "perfil",
    numero: 1,
    titulo: "Definir o Perfil Ideal de Contato",
    objetivo: "Saber exatamente quem procurar antes de gastar tempo prospectando.",
    regra: "Quantidade sem critério não vira lead. Defina o filtro antes de abrir o funil.",
    icon: <Target className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Perfis prioritários",
        itens: [
          "Empresários e donos de negócio",
          "Médicos e dentistas",
          "Advogados e contadores",
          "Corretores de imóveis e consultores",
          "Gestores comerciais e executivos",
          "Profissionais liberais com boa renda",
          "Líderes de comunidade e influenciadores locais",
          "Clientes satisfeitos e pessoas bem relacionadas",
        ],
      },
    ],
    erros: [
      "Procurar qualquer pessoa, sem filtro.",
      "Não ter critério mínimo de renda ou perfil.",
      "Abordar pessoas sem potencial real de conexão.",
      "Confundir quantidade de contatos com qualidade de pipeline.",
    ],
  },
  {
    id: "fontes",
    numero: 2,
    titulo: "Mapear Fontes de Prospecção",
    objetivo: "Criar uma lista organizada de origens recorrentes de contatos.",
    icon: <Compass className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Fontes digitais",
        itens: ["WhatsApp", "Instagram", "LinkedIn", "Comunidades online"],
      },
      {
        eyebrow: "Fontes presenciais",
        itens: [
          "Eventos do setor",
          "Academias e clubes",
          "Condomínios e bairros estratégicos",
          "Associações comerciais",
          "Grupos de networking",
        ],
      },
      {
        eyebrow: "Fontes profissionais",
        itens: [
          "Escritórios de contabilidade",
          "Imobiliárias e corretoras",
          "Empresários locais",
          "Clientes antigos e atuais",
          "Amigos e família com bom círculo",
        ],
      },
    ],
  },
  {
    id: "classificar",
    numero: 3,
    titulo: "Classificar o Potencial",
    objetivo: "Separar quem pode gerar lead eventual de quem pode virar parceiro recorrente.",
    icon: <Radar className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Níveis de potencial",
        itens: [
          "Contato comum: pode indicar 1 ou 2 pessoas.",
          "Contato estratégico: conhece pessoas com perfil financeiro interessante.",
          "Parceiro recorrente: pode gerar contatos todos os meses.",
          "Parceiro premium: tem autoridade sobre um público qualificado.",
        ],
      },
    ],
    regra: "Cada nível exige um tipo diferente de relacionamento. Não trate parceiro premium como contato comum nem o contrário.",
  },
  {
    id: "iniciar",
    numero: 4,
    titulo: "Iniciar Relacionamento",
    objetivo: "Criar conexão antes de pedir qualquer coisa.",
    regra: "Primeiro conversa. Depois sinergia. Só então parceria. Inverter essa ordem queima o contato.",
    icon: <MessageCircle className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Aberturas naturais",
        itens: [
          "“Vi que você atua com empresários aqui da região. Achei muito interessante seu trabalho.”",
          "“Percebi que você atende muitos profissionais liberais. É um público com quem também temos bastante contato.”",
          "“Gostei da forma como você fala sobre crescimento e organização.”",
          "“Vi que você é referência em [área]. Como tá o cenário aí no seu segmento?”",
        ],
      },
    ],
    erros: [
      "Abrir conversa já propondo parceria.",
      "Falar de produtos ou da empresa logo de cara.",
      "Usar mensagens genéricas sem referência ao trabalho da pessoa.",
    ],
  },
  {
    id: "sinergia",
    numero: 5,
    titulo: "Identificar Sinergia",
    objetivo: "Entender se existe troca real de valor entre os dois lados.",
    icon: <Network className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Perguntas para mapear sinergia",
        itens: [
          "“Hoje você atende que tipo de cliente?”",
          "“Qual perfil de pessoa mais procura seu serviço?”",
          "“Você costuma se relacionar com empresários ou profissionais liberais?”",
          "“Existe alguma dor financeira que seus clientes costumam comentar?”",
          "“Você já tem alguém de confiança para direcionar quando aparece esse tipo de demanda?”",
        ],
      },
    ],
    regra: "Sinergia não se assume. Se confirma com perguntas. Sem sinergia clara, não há parceria sustentável.",
  },
  {
    id: "apresentar",
    numero: 6,
    titulo: "Apresentar a Oportunidade de Parceria",
    objetivo: "Mostrar que a parceria gera valor para os clientes dele, não apenas benefício para você.",
    icon: <Handshake className="h-5 w-5" />,
    bullets: [],
    exemplos: [
      {
        eyebrow: "Fala de apresentação",
        texto:
          "“Pelo perfil de cliente que você atende, acredito que pode existir uma sinergia interessante. Muitas vezes essas pessoas têm boa renda, empresa, patrimônio ou objetivos importantes, mas não têm clareza se estão organizando tudo da melhor forma. A ideia seria eu te ajudar a entregar mais valor para essas pessoas quando fizer sentido.”",
      },
    ],
    erros: [
      "Apresentar a parceria pelo seu benefício, não pelo benefício dos clientes dele.",
      "Usar linguagem comercial agressiva ('quero ter acesso à sua base').",
      "Prometer comissão sem ter construído relacionamento antes.",
    ],
  },
  {
    id: "pedir",
    numero: 7,
    titulo: "Pedir o Primeiro Contato",
    objetivo: "Tirar a parceria do campo da conversa e gerar ação imediata.",
    icon: <ArrowUpRight className="h-5 w-5" />,
    bullets: [],
    exemplos: [
      {
        eyebrow: "Pergunta principal",
        texto:
          "“Pensando no seu círculo hoje, quem é uma pessoa que você acredita que poderia se beneficiar de uma conversa mais estratégica sobre organização financeira, patrimônio ou futuro?”",
      },
      {
        eyebrow: "Alternativa mais direta",
        texto: "“Me fala uma pessoa que você lembrou agora e que faria sentido eu conhecer.”",
      },
    ],
    regra: "Use pergunta específica e gere pausa. Quem pergunta vago recebe resposta vaga.",
  },
  {
    id: "facilitar",
    numero: 8,
    titulo: "Facilitar a Indicação",
    objetivo: "Evitar que o parceiro trave por não saber como apresentar você.",
    icon: <Sparkles className="h-5 w-5" />,
    bullets: [],
    exemplos: [
      {
        eyebrow: "Oferta de facilitação",
        texto:
          "“Para facilitar, posso te mandar uma mensagem pronta e você só encaminha ou me coloca em um grupo com a pessoa.”",
      },
      {
        eyebrow: "Mensagem pronta",
        texto:
          "“Fulano, estou te conectando com o [Nome]. Ele trabalha ajudando pessoas a organizarem melhor vida financeira, patrimônio e objetivos futuros. Achei que faria sentido vocês conversarem.”",
      },
    ],
    regra: "Quanto menor o esforço do parceiro, maior a taxa de conversão. Entregue a apresentação pronta.",
  },
  {
    id: "followup",
    numero: 9,
    titulo: "Organizar Follow-up",
    objetivo: "Não deixar a parceria morrer depois da primeira conversa.",
    icon: <RefreshCw className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Ações de follow-up",
        itens: [
          "Registrar o nome do parceiro em CRM ou planilha.",
          "Registrar o perfil de clientes que ele atende.",
          "Registrar todos os contatos gerados.",
          "Marcar a próxima data de follow-up.",
          "Enviar retorno sobre cada contato indicado.",
          "Manter relacionamento ativo, mesmo sem novas indicações.",
        ],
      },
    ],
    erros: [
      "Sumir após a primeira indicação.",
      "Não dar retorno sobre o que aconteceu com o contato.",
      "Confiar na memória em vez de registrar.",
    ],
  },
  {
    id: "nutrir",
    numero: 10,
    titulo: "Nutrir o Parceiro",
    objetivo: "Transformar uma indicação isolada em fonte recorrente de oportunidades.",
    icon: <Crown className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Rotina de nutrição",
        itens: [
          "Enviar conteúdos úteis ao público dele.",
          "Parabenizar conquistas profissionais e pessoais.",
          "Compartilhar cases relevantes e aprendizados.",
          "Atualizar sobre resultados dos contatos indicados.",
          "Reforçar gratidão de forma genuína e periódica.",
          "Criar rotina mensal ou trimestral de contato.",
        ],
      },
    ],
    regra: "Parceiro nutrido lembra de você primeiro. Parceiro esquecido indica para o concorrente.",
  },
];

/* ============================================================
   PÚBLICOS / BIBLIOTECA DE ABORDAGENS
   ============================================================ */

const AUDIENCES: Audience[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    short: "WhatsApp",
    emoji: "💬",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    accent: "var(--success)",
    badge: "Canal · Direto · 1:1",
    premissa: "WhatsApp é canal pessoal. Use somente após ter uma referência cruzada ou um vínculo prévio.",
    perfil: "Pessoas com quem você já trocou pelo menos uma palavra fora do app.",
    exemplos: [
      {
        titulo: "Reconexão para parceria",
        mensagem: "“Oi [Nome], tudo bem? Tava lembrando de você e do trabalho que você faz com [perfil de cliente]. Tenho um trabalho que pode ser complementar ao seu. Você teria 15min essa semana pra eu te apresentar a ideia?”",
        quando: "Quando há vínculo prévio, mesmo que distante (ex-colega, conhecido de evento).",
        porqueFunciona: "Direto, pessoal, e propõe encontro curto com objetivo claro.",
        continuar: "Oferecer dois horários específicos. Não deixar agenda em aberto.",
      },
      {
        titulo: "Indicação inversa",
        mensagem: "“[Nome], tô atendendo um cliente que precisa de [serviço dele]. Posso te apresentar?”",
        quando: "Sempre que tiver um cliente real que precise do trabalho do potencial parceiro.",
        porqueFunciona: "Reciprocidade ativada antes do pedido. Inverte a lógica padrão.",
        continuar: "Após a indicação ser convertida, abrir conversa sobre fluxo mútuo.",
      },
    ],
  },
  {
    id: "instagram",
    label: "Instagram",
    short: "Instagram",
    emoji: "📸",
    icon: <Instagram className="h-3.5 w-3.5" />,
    accent: "#d946ef",
    badge: "Canal · Familiaridade · Público",
    premissa: "Use Instagram para criar familiaridade visual antes da DM. Construa presença antes de pedir.",
    perfil: "Profissionais ativos em conteúdo, com público qualificado.",
    exemplos: [
      {
        titulo: "DM após presença social",
        mensagem: "“Acompanho seus conteúdos há um tempo. Gosto muito da forma como você fala sobre [tema]. Trabalho com planejamento financeiro para pessoas do perfil que você atende e queria te conhecer melhor.”",
        quando: "Após pelo menos 3–4 interações públicas (curtidas e comentários relevantes).",
        porqueFunciona: "A familiaridade já está construída. A DM apenas verbaliza algo já reconhecido.",
        continuar: "Não puxar reunião na primeira DM. Aprofundar conversa antes.",
      },
      {
        titulo: "Resposta a story estratégico",
        mensagem: "“Esse ponto que você levantou faz muito sentido. Eu vejo isso acontecer bastante com [perfil de cliente] no meu trabalho.”",
        quando: "Em stories sobre o segmento profissional dele, especialmente quando ele toca em pontos de dor.",
        porqueFunciona: "Resposta a story é menos invasiva que DM fria e abre conversa naturalmente.",
        continuar: "Aprofundar com curiosidade genuína. Não emendar pitch.",
      },
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    short: "LinkedIn",
    emoji: "💼",
    icon: <Linkedin className="h-3.5 w-3.5" />,
    accent: "var(--brand)",
    badge: "Canal · Profissional · B2B",
    premissa: "LinkedIn é o canal de autoridade. Linguagem profissional e foco em complementaridade de atendimento.",
    perfil: "Contadores, advogados, consultores, gestores e executivos.",
    exemplos: [
      {
        titulo: "Convite com contexto",
        mensagem: "“[Nome], acompanho conteúdos sobre [tema]. Trabalho com [área] complementar ao seu. Gostaria de conectar e, se fizer sentido, trocar uma ideia em algum momento.”",
        quando: "Ao enviar convite de conexão. Nunca em branco.",
        porqueFunciona: "Contexto + complementaridade aumentam o aceite e eliminam suspeita de spam.",
        continuar: "Aguardar uma publicação dele para começar a interagir publicamente.",
      },
      {
        titulo: "Mensagem direta após interações",
        mensagem: "“[Nome], pelas nossas trocas aqui, faria sentido reservarmos 30min para alinhar como nossos atendimentos podem se complementar. Te envio duas opções de horário?”",
        quando: "Após 2–3 comentários públicos relevantes em publicações dele.",
        porqueFunciona: "Linguagem profissional + agenda travada + frame de complementaridade.",
        continuar: "Levar uma proposta clara de fluxo na reunião, não apenas conversa.",
      },
    ],
  },
  {
    id: "cliente-satisfeito",
    label: "Cliente Satisfeito",
    short: "Cliente",
    emoji: "⭐",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    accent: "#c9a84c",
    badge: "Fonte · Maior conversão",
    premissa: "Cliente satisfeito é a fonte com maior conversão. Mas só funciona se for ativada no momento certo.",
    perfil: "Clientes com resultado claro, no auge da satisfação (após entrega de valor).",
    exemplos: [
      {
        titulo: "Pedido no auge da satisfação",
        mensagem: "“[Nome], que bom que essa fase tá fazendo sentido pra você. Pensando nas pessoas mais próximas, quem você acredita que se beneficiaria de uma conversa parecida com a que tivemos?”",
        quando: "Imediatamente após momento de resultado ou validação clara (revisão de plano, entrega de relatório).",
        porqueFunciona: "Cliente no auge da satisfação tem maior disposição a indicar e mais clareza para pensar em quem.",
        continuar: "Anotar nomes. Oferecer apresentação facilitada via mensagem pronta.",
      },
      {
        titulo: "Conversa de profundidade",
        mensagem: "“[Nome], tenho ajudado mais pessoas com perfil parecido com o seu. Pensando no seu círculo — amigos, familiares, sócios — quem é alguém que talvez também esteja precisando dessa clareza?”",
        quando: "Em reuniões periódicas com cliente engajado, fora do momento de venda.",
        porqueFunciona: "Frame de cuidado mútuo. Cliente sente que está ajudando os outros, não te dando comissão.",
        continuar: "Listar nomes em conjunto. Combinar abordagem facilitada.",
      },
    ],
  },
  {
    id: "contador",
    label: "Contador",
    short: "Contador",
    emoji: "📊",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    accent: "var(--brand)",
    badge: "Parceiro · Recorrente · Premium",
    premissa: "Contador é talvez a parceria mais poderosa: vê o fluxo financeiro real do cliente e tem autoridade técnica.",
    perfil: "Contadores com carteira de empresários e profissionais liberais.",
    exemplos: [
      {
        titulo: "Abordagem inicial",
        mensagem: "“[Nome], soube do seu trabalho com [perfil]. Trabalho com planejamento financeiro pessoal para empresários e profissionais liberais. Como o que eu faço complementa muito o seu lado contábil, queria entender se faz sentido conversarmos.”",
        quando: "Após mapear contadores que atendem o mesmo perfil de cliente.",
        porqueFunciona: "Complementaridade explícita. Não compete com o trabalho dele.",
        continuar: "Propor reunião de 45min sem expectativa imediata. Construir antes de cobrar.",
      },
      {
        titulo: "Fluxo de reciprocidade",
        mensagem: "“[Nome], esse cliente meu precisa de um contador estratégico. Posso te apresentar?”",
        quando: "Sempre que tiver cliente sem contador ou insatisfeito com o atual.",
        porqueFunciona: "Reciprocidade ativada. Você vira fonte antes de pedir nada.",
        continuar: "Após a indicação fluir, propor reunião de alinhamento de processo.",
      },
    ],
  },
  {
    id: "advogado",
    label: "Advogado",
    short: "Advogado",
    emoji: "⚖️",
    icon: <Scale className="h-3.5 w-3.5" />,
    accent: "var(--navy)",
    badge: "Parceiro · Sucessório · Patrimonial",
    premissa: "Advogados de família, sucessório e empresarial atendem o mesmo público de alta renda. Parceria natural.",
    perfil: "Advogados de sucessões, planejamento patrimonial, M&A e direito societário.",
    exemplos: [
      {
        titulo: "Abordagem técnica",
        mensagem: "“[Nome], acompanho o trabalho de vocês com [área]. Tenho atuado muito com clientes que precisam de planejamento financeiro e patrimonial estruturado — área que conversa muito com o que vocês fazem. Faria sentido conversarmos sobre como nossos atendimentos podem se complementar?”",
        quando: "Após identificar advogados que atendem alta renda.",
        porqueFunciona: "Linguagem técnica + complementaridade evidente.",
        continuar: "Marcar reunião de alinhamento. Levar exemplos de caso conjunto.",
      },
    ],
  },
  {
    id: "corretor",
    label: "Corretor de Imóveis",
    short: "Corretor",
    emoji: "🏘️",
    icon: <HomeIcon className="h-3.5 w-3.5" />,
    accent: "#d946ef",
    badge: "Parceiro · Alto ticket · Decisão patrimonial",
    premissa: "Quem compra imóvel está tomando decisão patrimonial. Momento perfeito para entrar uma conversa financeira.",
    perfil: "Corretores de imóveis de médio e alto padrão, com base ativa de clientes.",
    exemplos: [
      {
        titulo: "Aliança no momento patrimonial",
        mensagem: "“[Nome], muita gente que compra imóvel com você tá tomando uma decisão patrimonial importante. Eu ajudo essas pessoas a organizarem o restante do planejamento financeiro pra que essa compra faça parte de uma estratégia maior. Que tal alinharmos como funcionar?”",
        quando: "Após mapear corretores de imóveis de médio/alto padrão.",
        porqueFunciona: "Posiciona você como complemento estratégico no momento exato da decisão.",
        continuar: "Propor reunião curta. Mostrar exemplos de fluxo conjunto.",
      },
    ],
  },
  {
    id: "medico",
    label: "Médico",
    short: "Médico",
    emoji: "🩺",
    icon: <Stethoscope className="h-3.5 w-3.5" />,
    accent: "var(--success)",
    badge: "Público · Alta renda · Tempo escasso",
    premissa: "Médicos têm alta renda, agenda apertada e pouco tempo para planejar finanças. Sinergia clara.",
    perfil: "Médicos com prática consolidada, sócios de clínica, especialistas reconhecidos.",
    exemplos: [
      {
        titulo: "Abordagem direta",
        mensagem: "“[Nome], trabalho com planejamento financeiro especificamente para médicos. Vejo muitos profissionais brilhantes na medicina que ainda não estruturaram patrimônio e reserva da mesma forma que estruturaram a carreira. Faria sentido conversarmos 30min?”",
        quando: "Após confirmar perfil e ter alguma referência cruzada (indicação, evento).",
        porqueFunciona: "Especificidade ('médicos') gera identificação. Frame de patrimônio, não de produto.",
        continuar: "Oferecer dois horários fora do expediente clínico.",
      },
    ],
  },
  {
    id: "empresario",
    label: "Empresário",
    short: "Empresário",
    emoji: "🏢",
    icon: <Building2 className="h-3.5 w-3.5" />,
    accent: "#c9a84c",
    badge: "Público · Patrimônio + Empresa",
    premissa: "Empresário pensa em empresa, sucessão, holding e patrimônio. Conversa precisa estar à altura.",
    perfil: "Donos de negócio com faturamento consolidado, em fase de crescimento ou estruturação.",
    exemplos: [
      {
        titulo: "Abordagem estratégica",
        mensagem: "“[Nome], muitos empresários no seu estágio têm a empresa rodando bem, mas o patrimônio pessoal e a estrutura financeira ainda crescem em ritmo diferente. Faz sentido conversarmos 30min sobre como organizar isso de forma mais estratégica?”",
        quando: "Após referência cruzada ou interação prévia.",
        porqueFunciona: "Linguagem de empresário, foco em estratégia, não em produto.",
        continuar: "Oferecer reunião enxuta com agenda clara. Tempo é o ativo mais escasso para esse perfil.",
      },
    ],
  },
  {
    id: "networking",
    label: "Networking Presencial",
    short: "Networking",
    emoji: "🤝",
    icon: <Users className="h-3.5 w-3.5" />,
    accent: "var(--brand)",
    badge: "Canal · Presencial · Follow-up crítico",
    premissa: "Em eventos, a primeira conversa importa pouco. O que define é o follow-up dos 7 dias seguintes.",
    perfil: "Eventos do setor, câmaras de comércio, associações, encontros empresariais.",
    exemplos: [
      {
        titulo: "Apresentação no evento",
        mensagem: "“Oi, sou o [Você]. Vi que você atua com [perfil]. O que te trouxe pra esse evento?”",
        quando: "Nos primeiros minutos de interação. Foco em ouvir, não em se vender.",
        porqueFunciona: "Pergunta aberta sobre o outro coloca ele no centro da conversa.",
        continuar: "Falar de você só quando perguntado. Trocar contato no fim da conversa.",
      },
      {
        titulo: "Follow-up em 24h",
        mensagem: "“[Nome], foi muito bom te conhecer ontem. Aquela conversa sobre [tema] ficou na cabeça. Vamos manter contato?”",
        quando: "Em até 24h após o evento, enquanto a memória é fresca.",
        porqueFunciona: "Especificidade prova que a conversa importou. Abre canal sem cobrança.",
        continuar: "Após 5–7 dias, enviar conteúdo útil relacionado ao que conversaram.",
      },
    ],
  },
];

/* ============================================================
   MODO ESTUDO
   ============================================================ */

const ESTUDO_BLOCKS: { id: string; eyebrow: string; titulo: string; texto: string; bullets?: string[]; icon: React.ReactNode }[] = [
  {
    id: "logica",
    eyebrow: "Conceito 01",
    titulo: "A lógica da prospecção inteligente",
    texto:
      "O planejador medíocre depende exclusivamente de lead novo. O planejador de alta performance constrói uma rede de relacionamento capaz de gerar contatos qualificados de forma recorrente. Não é sorte. É sistema.",
    bullets: [
      "Lead novo é dependência. Rede é independência.",
      "Contato recorrente exige investimento de relacionamento, não de tráfego.",
      "Quem depende só de lead pago vira refém do custo de aquisição.",
    ],
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "contato-vs-parceiro",
    eyebrow: "Conceito 02",
    titulo: "Diferença entre contato e parceiro",
    texto:
      "Os dois geram leads, mas a natureza, o ritmo e o investimento são completamente diferentes. Confundir os dois leva a desperdiçar energia em todo lugar.",
    bullets: [
      "Contato: pode indicar uma pessoa específica, em um momento específico.",
      "Parceiro: pode abrir portas continuamente, mês após mês.",
      "Contato exige relacionamento pontual. Parceria exige rotina.",
    ],
    icon: <Network className="h-5 w-5" />,
  },
  {
    id: "leads-melhores",
    eyebrow: "Conceito 03",
    titulo: "Por que parcerias geram leads melhores",
    texto:
      "Lead que chega via parceria converte mais que lead frio porque a confiança já foi transferida antes da primeira conversa.",
    bullets: [
      "Confiança transferida: o parceiro empresta a credibilidade dele.",
      "Lead chega menos frio: já existe contexto e expectativa positiva.",
      "Barreira inicial menor: a desconfiança natural já foi atenuada.",
      "Indicação vem com contexto: você sabe a dor antes da reunião.",
    ],
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "erros",
    eyebrow: "Diagnóstico",
    titulo: "Erros que matam parcerias",
    texto:
      "Parcerias raramente morrem por incompatibilidade. Quase sempre morrem pelos mesmos erros previsíveis. Eliminar esses erros já te coloca acima da média.",
    bullets: [
      "Pedir indicação cedo demais, antes de ter construído relacionamento.",
      "Falar só de si, sem entender o trabalho do potencial parceiro.",
      "Não gerar valor para o parceiro antes de pedir valor dele.",
      "Não dar retorno sobre os contatos indicados.",
      "Sumir depois da primeira indicação.",
      "Ser genérico, sem mostrar entendimento do público dele.",
      "Não organizar follow-up — confiar na memória.",
    ],
    icon: <AlertTriangle className="h-5 w-5" />,
  },
];

const TERMOMETRO = [
  {
    nivel: "Fria",
    emoji: "🔴",
    cor: "var(--danger)",
    sinais: [
      "A pessoa não conhece você.",
      "Não entende o que você faz.",
      "Não vê valor na conexão ainda.",
    ],
    acao: "Voltar para Etapa 4. Construir relacionamento antes de qualquer pedido.",
  },
  {
    nivel: "Morna",
    emoji: "🟡",
    cor: "var(--warn)",
    sinais: [
      "Conversa com você esporadicamente.",
      "Entende sua atuação.",
      "Acha a parceria interessante, mas ainda não age.",
    ],
    acao: "Aprofundar com Etapas 5 e 6. Confirmar sinergia e apresentar a oportunidade pelo benefício dos clientes dela.",
  },
  {
    nivel: "Quente",
    emoji: "🟢",
    cor: "var(--success)",
    sinais: [
      "Indica pessoas espontaneamente.",
      "Abre portas dentro do círculo dela.",
      "Lembra de você quando surge oportunidade.",
    ],
    acao: "Manter Etapas 9 e 10. Nutrir e dar retorno para sustentar a parceria como fonte recorrente.",
  },
];

const CHECKLIST = [
  "Entendi o público que essa pessoa atende.",
  "Expliquei com clareza como posso ajudar.",
  "Mostrei o benefício para os clientes dela, não só para mim.",
  "Pedi um primeiro contato de forma específica e objetiva.",
  "Facilitei a apresentação com mensagem pronta.",
  "Registrei o follow-up em CRM ou planilha.",
  "Combinei continuidade e próxima conversa.",
];

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

type Mode = "pratica" | "estudo";

function Prospeccao() {
  const [activeId, setActiveId] = useState<string>(AUDIENCES[0].id);
  const [mode, setMode] = useState<Mode>("pratica");

  const audience = useMemo(
    () => AUDIENCES.find((a) => a.id === activeId) ?? AUDIENCES[0],
    [activeId],
  );

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
              <Search className="h-3.5 w-3.5" /> Modo Prospecção
            </span>
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Passo a Passo para <span className="text-[var(--success)]">Prospecção de Contatos e Parcerias</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed">
            Prospecção de contatos e parcerias não é pedir indicação de forma desesperada. É construir fontes recorrentes de oportunidade — pessoas e parceiros que geram leads qualificados todo mês.
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: "Etapas", v: `${ETAPAS.length}` },
              { l: "Abordagens", v: `${AUDIENCES.length}` },
              { l: "Modo Prática", v: "Execução" },
              { l: "Modo Estudo", v: "Estratégia" },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{m.l}</p>
                <p className="mt-2 text-xl sm:text-2xl font-extrabold text-white">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MODE SELECTOR + AUDIENCE CHIPS */}
      <nav className="sticky top-12 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 flex items-center gap-2 flex-wrap">
          <div role="tablist" className="inline-flex items-center rounded-xl border border-border bg-[var(--surface)] p-1">
            <ModeButton
              active={mode === "pratica"}
              onClick={() => setMode("pratica")}
              icon={<Search className="h-3.5 w-3.5" />}
              label="Modo Prática"
              activeClass="bg-[var(--success)] text-[var(--navy)] shadow-sm shadow-[var(--success)]/30"
            />
            <ModeButton
              active={mode === "estudo"}
              onClick={() => setMode("estudo")}
              icon={<GraduationCap className="h-3.5 w-3.5" />}
              label="Modo Estudo"
              activeClass="bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/30"
            />
          </div>
        </div>

        {/* CHIPS DE PÚBLICO/CANAL */}
        <div className="border-t border-border bg-gradient-to-b from-white to-[var(--surface)]/60">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 w-max pr-2">
                <span className="hidden sm:inline shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground pr-1">
                  Abordagem
                </span>
                {AUDIENCES.map((a) => {
                  const active = a.id === activeId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActiveId(a.id)}
                      aria-label={`Selecionar abordagem ${a.label}`}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border ${
                        active
                          ? "text-white border-transparent shadow-md"
                          : "bg-white border-border text-[var(--navy)] hover:border-[color:var(--brand)] hover:text-[var(--brand)]"
                      }`}
                      style={active ? { background: a.accent, boxShadow: `0 8px 20px -10px ${a.accent}` } : {}}
                    >
                      <span aria-hidden>{a.emoji}</span>
                      {a.short}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-12">
        {/* CABEÇALHO DA ABORDAGEM ATIVA */}
        <section className="rounded-3xl border-2 p-6 sm:p-8 text-white shadow-2xl bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c]"
          style={{ borderColor: audience.accent, boxShadow: `0 30px 80px -40px ${audience.accent}` }}
        >
          <div className="flex items-start gap-3 flex-wrap">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
              style={{ background: audience.accent, color: "var(--navy)" }}
              aria-hidden
            >
              {audience.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: audience.accent }}>{audience.badge}</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">{audience.label}</h2>
              <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">{audience.premissa}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MiniStat icon={<Target className="h-4 w-4" />} label="Perfil ideal" value={audience.perfil} />
            <MiniStat icon={<Lightbulb className="h-4 w-4" />} label="Princípio" value="Construir fontes recorrentes. Nunca pedir indicação desesperada." />
          </div>
        </section>

        {/* CONTEÚDO POR MODO */}
        <div className="mt-10 sm:mt-14">
          {mode === "pratica" ? <PraticaMode audience={audience} /> : <EstudoMode audience={audience} />}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   MODO PRÁTICA
   ============================================================ */

function PraticaMode({ audience }: { audience: Audience }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* REGRA DE OURO */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)] shadow-lg shadow-[var(--success)]/30">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Regra Elite</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Prospecção é sistema, não esmola.</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              As 10 etapas abaixo formam um fluxo. Pedir indicação sem ter construído as etapas anteriores é o que transforma prospecção em desespero.
            </p>
          </div>
        </div>
      </section>

      {/* ETAPAS */}
      {ETAPAS.map((e) => (
        <EtapaCard key={e.id} etapa={e} accent={audience.accent} />
      ))}

      {/* BIBLIOTECA DE EXEMPLOS */}
      <section>
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          eyebrow={`Biblioteca · ${audience.label}`}
          title="Abordagens prontas para esse perfil"
          accent={audience.accent}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {audience.exemplos.map((ex, i) => (
            <article key={i} className="rounded-2xl border border-border bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: audience.accent }}>
                Abordagem {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-bold text-[var(--navy)] leading-snug">{ex.titulo}</h3>
              <blockquote className="mt-3 rounded-xl border border-border bg-[var(--surface)] p-4 text-sm text-[var(--navy)] leading-relaxed">
                {ex.mensagem}
              </blockquote>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Quando usar</dt>
                  <dd className="mt-1 text-[var(--navy)]/85 leading-relaxed">{ex.quando}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Por que funciona</dt>
                  <dd className="mt-1 text-[var(--navy)]/85 leading-relaxed">{ex.porqueFunciona}</dd>
                </div>
                <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Como continuar</dt>
                  <dd className="mt-1 text-[var(--navy)] leading-relaxed">{ex.continuar}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   MODO ESTUDO
   ============================================================ */

function EstudoMode({ audience }: { audience: Audience }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* CAPA */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/40">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Academia da Prospecção</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Por que rede vence pitch</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              Quem depende só de lead novo está sempre vulnerável. Quem constrói rede de contatos e parceiros tem fluxo previsível, conversão maior e custo de aquisição menor.
            </p>
          </div>
        </div>
      </section>

      {/* CONCEITOS */}
      {ESTUDO_BLOCKS.map((b) => (
        <section key={b.id} className="rounded-3xl border border-border bg-white p-6 sm:p-8">
          <header className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: audience.accent }}>
              {b.icon}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: audience.accent }}>{b.eyebrow}</p>
              <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)] leading-tight">{b.titulo}</h3>
            </div>
          </header>
          <p className="text-[15px] text-[var(--navy)]/85 leading-relaxed">{b.texto}</p>
          {b.bullets && (
            <ul className="mt-4 space-y-2">
              {b.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl border border-border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--navy)] leading-snug">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: audience.accent }} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* TERMÔMETRO */}
      <section>
        <SectionHeader
          icon={<ThermometerSun className="h-5 w-5" />}
          eyebrow="Diagnóstico contínuo"
          title="O termômetro da parceria"
          accent={audience.accent}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {TERMOMETRO.map((t) => (
            <div key={t.nivel} className="rounded-3xl border-2 bg-white p-5" style={{ borderColor: `color-mix(in oklab, ${t.cor} 35%, transparent)` }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>{t.emoji}</span>
                <p className="text-base font-extrabold text-[var(--navy)]">{t.nivel}</p>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--navy)]/85 leading-snug">
                {t.sinais.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5"><span style={{ color: t.cor }}>•</span> {s}</li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl p-3 text-sm font-semibold" style={{ background: `color-mix(in oklab, ${t.cor} 10%, white)`, color: "var(--navy)" }}>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: t.cor }}>Próxima ação</span>
                {t.acao}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="rounded-3xl border-2 border-[var(--success)]/30 bg-[var(--success)]/5 p-6 sm:p-8">
        <header className="mb-5 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)]/20 text-[var(--success)]">
            <ListChecks className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Checklist final</p>
            <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)] leading-tight">Antes de considerar uma parceria ativa</h3>
          </div>
        </header>
        <ul className="grid gap-2.5 md:grid-cols-2">
          {CHECKLIST.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl border border-border bg-white px-4 py-3">
              <span aria-hidden className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[var(--success)]/50 text-[var(--success)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm text-[var(--navy)] leading-snug">{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-[var(--navy)]/80 leading-relaxed">
          <strong>Regra:</strong> se a maioria das respostas for NÃO, a parceria ainda é uma intenção, não um ativo. Volte às etapas anteriores antes de cobrar resultados.
        </p>
      </section>

      {/* MANTRA */}
      <section className="rounded-3xl border-2 p-6 sm:p-8 text-white" style={{ borderColor: audience.accent, background: "linear-gradient(135deg, #0a1733, var(--navy))" }}>
        <div className="flex items-start gap-3">
          <Quote className="h-8 w-8 shrink-0" style={{ color: audience.accent }} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: audience.accent }}>Mantra</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold leading-snug">
              “Você não está pedindo indicações. Está construindo fontes recorrentes de oportunidade.”
            </p>
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

function EtapaCard({ etapa, accent }: { etapa: Etapa; accent: string }) {
  return (
    <section id={etapa.id} className="scroll-mt-32">
      <header className="mb-4 flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-sm font-extrabold shadow-md"
          style={{ background: accent, boxShadow: `0 8px 24px -8px ${accent}` }}
        >
          {etapa.numero}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>Etapa {etapa.numero}</p>
          <h3 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[var(--navy)]">{etapa.titulo}</h3>
          <p className="mt-1.5 max-w-3xl text-[14.5px] text-muted-foreground leading-relaxed">{etapa.objetivo}</p>
        </div>
        <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ color: accent, borderColor: `color-mix(in oklab, ${accent} 40%, transparent)`, background: `color-mix(in oklab, ${accent} 8%, white)` }}
        >
          {etapa.icon}
        </span>
      </header>

      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 space-y-4">
        {etapa.regra && (
          <div className="rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)] flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Regra
            </p>
            <p className="mt-1.5 text-sm text-[var(--navy)] leading-relaxed">{etapa.regra}</p>
          </div>
        )}

        {etapa.bullets.map((b, i) => (
          <div key={i}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>{b.eyebrow}</p>
            <ul className="mt-2 grid gap-1.5 md:grid-cols-2">
              {b.itens.map((it, j) => (
                <li key={j} className="flex items-start gap-2 rounded-xl border border-border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--navy)] leading-snug">
                  <span className="mt-0.5 font-bold" style={{ color: accent }}>•</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {etapa.exemplos && etapa.exemplos.map((ex, i) => (
          <div key={i} className="rounded-xl border border-border bg-[var(--surface)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>{ex.eyebrow}</p>
            <blockquote className="mt-2 text-[15px] text-[var(--navy)] leading-relaxed">{ex.texto}</blockquote>
          </div>
        ))}

        {etapa.erros && (
          <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger)] flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Erros comuns
            </p>
            <ul className="mt-2 space-y-1.5">
              {etapa.erros.map((e, i) => (
                <li key={i} className="text-sm text-[var(--navy)] leading-snug flex items-start gap-1.5">
                  <span className="mt-0.5 font-bold text-[var(--danger)]">✕</span> {e}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}