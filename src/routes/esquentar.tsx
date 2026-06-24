import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MessageCircle, Instagram, Linkedin, Users, Handshake,
  Flame, GraduationCap, Brain, Sparkles, Target, AlertTriangle,
  CheckCircle2, Home as HomeIcon, Quote, Search, Eye, MessagesSquare,
  Heart, Gift, Award, Radar, PhoneCall, ThermometerSun, ListChecks,
  BookOpen, Lightbulb,
} from "lucide-react";

export const Route = createFileRoute("/esquentar")({
  head: () => ({
    meta: [
      { title: "Bull Team | Passo a Passo para Esquentar Contato" },
      { name: "description", content: "Como transformar desconhecidos, seguidores e indicações frias em contatos quentes através de WhatsApp, Instagram, LinkedIn, networking e parceiros." },
      { property: "og:title", content: "Bull Team | Passo a Passo para Esquentar Contato" },
      { property: "og:description", content: "Construa relacionamento, autoridade e confiança antes da primeira ligação. Método em 8 etapas com modo prática e modo estudo." },
    ],
  }),
  component: Esquentar,
});

/* ============================================================
   TIPOS
   ============================================================ */

type Channel = {
  id: string;
  label: string;
  short: string;
  emoji: string;
  icon: React.ReactNode;
  accent: string;
  badge: string;
  premissa: string;
  ritmo: string;
  exemplos: ChannelExample[];
};

type ChannelExample = {
  titulo: string;
  mensagem: string;
  quando: string;
  porqueFunciona: string;
  resposta: string;
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
  exemplos?: string[];
  sinaisVerdes?: string[];
  sinaisAmarelos?: string[];
  sinaisVermelhos?: string[];
  icon: React.ReactNode;
};

/* ============================================================
   CONTEÚDO — ETAPAS (MODO PRÁTICA)
   ============================================================ */

const ETAPAS: Etapa[] = [
  {
    id: "mapear",
    numero: 1,
    titulo: "Mapear o Contato",
    objetivo: "Antes de enviar qualquer mensagem, entender profundamente quem é a pessoa.",
    regra: "Quanto mais personalizada for a abordagem, maior a chance de resposta. Mensagem genérica vira spam.",
    icon: <Search className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "O que analisar",
        itens: [
          "Profissão atual e cargo",
          "Empresa e segmento",
          "Momento de vida (casamento, filhos, troca de carreira, expansão)",
          "Família e dependentes",
          "Redes sociais ativas e tom de comunicação",
          "Interesses pessoais que aparecem nas postagens",
          "Objetivos profissionais aparentes",
          "Possíveis dores financeiras inferidas pelo contexto",
        ],
      },
    ],
    erros: [
      "Enviar mensagens genéricas copiadas e coladas.",
      "Pular essa etapa para acelerar a abordagem.",
      "Pesquisar só o nome e ignorar perfil completo.",
      "Tratar todo contato igual, sem segmentar por momento de vida.",
    ],
  },
  {
    id: "reconhecimento",
    numero: 2,
    titulo: "Gerar Reconhecimento",
    objetivo: "Fazer a pessoa notar a sua existência antes de qualquer abordagem direta.",
    regra: "Não tente vender. Não fale de reunião. Não fale da empresa. O objetivo único é se tornar familiar.",
    icon: <Eye className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Ações práticas",
        itens: [
          "Curtir publicações relevantes do contato.",
          "Comentar conteúdos de forma genuína e específica.",
          "Responder stories com observações pertinentes.",
          "Parabenizar conquistas profissionais e pessoais.",
          "Interagir consistentemente por 1–2 semanas antes de iniciar conversa.",
        ],
      },
    ],
    erros: [
      "Curtir tudo de uma vez (gera estranhamento).",
      "Comentar com clichês genéricos ('top!', 'arrasou!').",
      "Pular essa fase e cair direto na DM com pitch.",
      "Misturar reconhecimento com tentativa de venda.",
    ],
  },
  {
    id: "conversa",
    numero: 3,
    titulo: "Iniciar Conversas Naturais",
    objetivo: "Criar a primeira interação sem que pareça prospecção comercial.",
    icon: <MessagesSquare className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Exemplos de abertura",
        itens: [
          "“Vi sua publicação sobre gestão de equipes. Gostei muito da forma como você abordou esse ponto.”",
          "“Percebi que você atua na área médica. Como está o cenário atualmente?”",
          "“Vi que você abriu uma nova unidade. Parabéns pela conquista — como foi essa decisão?”",
          "“Acompanho seus conteúdos sobre [tema]. Tem uma visão muito clara sobre isso.”",
        ],
      },
    ],
    erros: [
      "Começar a conversa falando de finanças.",
      "Enviar pitch ou apresentação da empresa.",
      "Pedir reunião antes de qualquer relacionamento.",
      "Frases prontas que não fazem referência ao contato real.",
    ],
  },
  {
    id: "relacionamento",
    numero: 4,
    titulo: "Desenvolver Relacionamento",
    objetivo: "Transformar uma interação pontual em conversa recorrente e natural.",
    icon: <Heart className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Perguntas que sustentam conversa",
        itens: [
          "Sobre projetos atuais e em andamento.",
          "Sobre desafios profissionais recentes.",
          "Sobre crescimento e próximos passos da carreira.",
          "Sobre como ele vê o mercado em que atua.",
          "Sobre objetivos pessoais e profissionais para os próximos anos.",
        ],
      },
    ],
    sinaisVerdes: [
      "A pessoa responde com detalhes e contexto.",
      "Faz perguntas de volta sobre você.",
      "Continua a conversa espontaneamente em dias diferentes.",
      "Compartilha algo pessoal sem ser provocado.",
    ],
  },
  {
    id: "valor",
    numero: 5,
    titulo: "Entregar Valor",
    objetivo: "Fazer com que conversar com você seja percebido como útil, não como obrigação.",
    regra: "Entregue valor sem pedir absolutamente nada em troca. Reciprocidade só funciona quando é genuína.",
    icon: <Gift className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Formatos de valor",
        itens: [
          "Compartilhar um artigo relevante para o segmento dele.",
          "Enviar uma notícia que afeta diretamente o negócio dele.",
          "Comentar uma tendência que vale a pena ele acompanhar.",
          "Compartilhar um aprendizado prático de alguém parecido com ele.",
          "Enviar um insight financeiro aplicado ao contexto que ele vive.",
        ],
      },
    ],
    erros: [
      "Enviar conteúdo institucional da empresa.",
      "Mandar 'venda disfarçada' — material que termina pedindo reunião.",
      "Enviar conteúdo genérico que não tem relação com o contato.",
      "Cobrar reciprocidade ('viu o que te mandei?').",
    ],
  },
  {
    id: "autoridade",
    numero: 6,
    titulo: "Construir Autoridade",
    objetivo: "Demonstrar competência sem parecer vendedor.",
    regra: "Fale sobre problemas que você resolve. Nunca fale sobre produtos que você vende.",
    icon: <Award className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Repertório de autoridade",
        itens: [
          "Casos reais (anonimizados) com o desafio e o resultado.",
          "Experiências vividas em atendimentos parecidos com o dele.",
          "Tendências de mercado observadas em primeira mão.",
          "Situações comuns que aparecem em famílias e empresas parecidas.",
          "Aprendizados extraídos de erros frequentes de clientes.",
        ],
      },
    ],
  },
  {
    id: "abertura",
    numero: 7,
    titulo: "Identificar Momento de Abertura",
    objetivo: "Reconhecer quando o contato está pronto para avançar para uma conversa estruturada.",
    icon: <Radar className="h-5 w-5" />,
    bullets: [],
    sinaisVerdes: [
      "Pergunta sobre a sua atuação ('o que exatamente você faz?').",
      "Pergunta como você ajuda pessoas no dia a dia.",
      "Compartilha preocupações financeiras de forma espontânea.",
      "Compartilha objetivos futuros e pede a sua opinião.",
    ],
    sinaisAmarelos: [
      "Respostas curtas, mas constantes.",
      "Baixa interação, mas sem rejeitar conversa.",
      "Pouco engajamento, mas continua respondendo.",
    ],
    sinaisVermelhos: [
      "Visualiza e não responde mais de duas vezes seguidas.",
      "Responde apenas com monossílabos.",
      "Demonstra desinteresse direto ('agora não dá').",
    ],
  },
  {
    id: "terreno",
    numero: 8,
    titulo: "Preparar Terreno para a Ligação",
    objetivo: "Criar desejo pela conversa futura sem forçar agendamento.",
    regra: "Gere curiosidade. Não pressione. Nunca force agenda nessa etapa — a ligação vem como consequência.",
    icon: <PhoneCall className="h-5 w-5" />,
    bullets: [
      {
        eyebrow: "Frases que abrem caminho",
        itens: [
          "“Essa situação que você comentou é algo que vejo com frequência.”",
          "“Existem alguns pontos interessantes aí que valeria a pena aprofundar.”",
          "“Numa conversa mais estruturada eu conseguiria te mostrar algumas perspectivas que talvez você ainda não tenha visto.”",
          "“Tem algumas coisas específicas que normalmente faço junto com pessoas do seu perfil — se você quiser, eu te mostro.”",
        ],
      },
    ],
    erros: [
      "Tentar fechar agenda já nessa frase ('podemos marcar amanhã?').",
      "Insistir após uma resposta morna.",
      "Listar produtos e serviços para 'vender' a reunião.",
      "Forçar urgência artificial ('só essa semana').",
    ],
  },
];

/* ============================================================
   CONTEÚDO — CANAIS (com biblioteca de exemplos)
   ============================================================ */

const CHANNELS: Channel[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    short: "WhatsApp",
    emoji: "💬",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    accent: "var(--success)",
    badge: "Canal · 1:1 · Alta intimidade",
    premissa: "WhatsApp é canal pessoal. Mensagem fria sem contexto queima reputação. Use após pelo menos uma referência cruzada (rede social, indicação, evento).",
    ritmo: "1 contato a cada 2–3 dias. Nunca quebrar a sequência sem motivo.",
    exemplos: [
      {
        titulo: "Reconexão após indicação",
        mensagem: "“Olá [Nome], aqui é o [Você]. O [Indicador] me passou seu contato e comentou que você é referência em [tema]. Sem compromisso nenhum — só queria te apresentar e entender melhor o que você tem feito.”",
        quando: "Logo após receber uma indicação, antes de qualquer abordagem comercial.",
        porqueFunciona: "Usa prova social do indicador + reduz pressão ('sem compromisso') + foca no contato, não em você.",
        resposta: "“Oi, tudo bem? O [Indicador] falou de você também. Trabalho com [área], como posso te ajudar?”",
        continuar: "Perguntar sobre o trabalho dele antes de qualquer fala sobre você. Reciprocidade.",
      },
      {
        titulo: "Conteúdo útil sem pedido",
        mensagem: "“[Nome], lembrei de você quando vi essa matéria sobre [tema relevante ao segmento dele]. Achei que faria sentido te mandar.”",
        quando: "Após primeiro contato bem-sucedido, sem ter avançado para reunião ainda.",
        porqueFunciona: "Ativa reciprocidade sem cobrar. Reforça que você lembrou dele e prestou atenção no segmento.",
        resposta: "“Valeu! Bem interessante mesmo.”",
        continuar: "Não emendar pitch. Esperar pelo menos 5 dias antes do próximo movimento.",
      },
      {
        titulo: "Parabéns por conquista pública",
        mensagem: "“Vi a publicação sobre [nova unidade / promoção / projeto]. Parabéns! Imagino o tamanho do desafio até aqui.”",
        quando: "Em até 48h após o anúncio ser feito em redes sociais.",
        porqueFunciona: "Demonstra atenção real, valida a conquista e abre espaço para a pessoa contar mais.",
        resposta: "“Obrigado! Foram alguns anos até aqui.”",
        continuar: "Perguntar sobre o processo, não sobre os planos comerciais. Construir relacionamento.",
      },
      {
        titulo: "Insight aplicado ao segmento",
        mensagem: "“[Nome], tô vendo bastante movimento de [tendência] no seu segmento. Em conversas com [perfil similar] esse ponto tem feito muita diferença.”",
        quando: "Após 3–4 interações sociais. O contato já te reconhece.",
        porqueFunciona: "Constrói autoridade indireta + gera curiosidade sem pedir reunião.",
        resposta: "“Verdade, tô vendo isso por aqui também.”",
        continuar: "Aprofundar a conversa por mensagem antes de propor ligação.",
      },
      {
        titulo: "Convite para conversa exploratória",
        mensagem: "“[Nome], pelo que conversamos até aqui, faz sentido a gente sentar 30min e olhar isso com mais calma — sem compromisso, só pra trocar visão. Topa?”",
        quando: "Quando há sinais verdes: pergunta sobre sua atuação, compartilha preocupação financeira ou objetivo.",
        porqueFunciona: "'Trocar visão' baixa a guarda. 'Sem compromisso' reduz a fricção. 30min é curto e específico.",
        resposta: "“Topo. Pode ser semana que vem?”",
        continuar: "Oferecer duas opções de horário concretas, não pedir 'quando você pode'.",
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
    badge: "Canal · Familiaridade · Visual",
    premissa: "Instagram é território de familiaridade visual. Interações leves, recorrentes e públicas constroem reconhecimento antes da DM.",
    ritmo: "3–4 interações públicas (curtir, comentar, responder story) antes da primeira DM.",
    exemplos: [
      {
        titulo: "Resposta a story específico",
        mensagem: "“Esse ponto que você levantou sobre [tema] faz total sentido. Já vi acontecer várias vezes em [contexto].”",
        quando: "Sempre que o contato publicar story sobre o segmento profissional dele.",
        porqueFunciona: "Resposta a story é o canal mais direto e menos invasivo do Instagram.",
        resposta: "“Verdade! Você também atua nessa área?”",
        continuar: "Apresentar-se de forma curta e devolver o foco para ele.",
      },
      {
        titulo: "Comentário com substância",
        mensagem: "“Concordo demais. Tenho visto [observação específica] acontecer em [contexto similar]. Bom ver alguém tocando nesse assunto.”",
        quando: "Em posts feed do contato, especialmente os menos visíveis (onde sua presença aparece).",
        porqueFunciona: "Comentário com conteúdo vira referência. Te diferencia dos 'top!' genéricos.",
        resposta: "Curtida no comentário ou resposta direta.",
        continuar: "Aumentar consistência: 1 comentário por semana ao longo de um mês.",
      },
      {
        titulo: "DM após meses de presença",
        mensagem: "“Acompanho seus conteúdos faz um tempo. Gosto bastante da sua visão sobre [tema]. Queria me apresentar: sou [você], trabalho com [área].”",
        quando: "Após pelo menos 4 semanas de presença social pública (curtidas, comentários, respostas).",
        porqueFunciona: "A familiaridade já está construída. A DM apenas verbaliza algo que ele já percebeu inconscientemente.",
        resposta: "“Obrigado! Já tinha visto seu nome por aqui.”",
        continuar: "Manter conversa leve. Não puxar reunião nessa DM.",
      },
      {
        titulo: "Compartilhar conteúdo dele",
        mensagem: "“Compartilhei seu post nos meus stories. Conteúdo muito relevante pro pessoal que me acompanha.”",
        quando: "Quando o contato publica algo realmente alinhado ao seu público — sem inventar.",
        porqueFunciona: "Reciprocidade visível. Você está oferecendo audiência antes de pedir tempo.",
        resposta: "“Demais, obrigado!”",
        continuar: "Trocar duas ou três mensagens leves antes de qualquer convite.",
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
    badge: "Canal · Autoridade · Profissional",
    premissa: "LinkedIn é território de autoridade. O critério de avaliação é alto: conteúdo, contexto e linguagem profissional.",
    ritmo: "Conexão → 1 interação pública → mensagem direta com contexto. Nunca pular etapas.",
    exemplos: [
      {
        titulo: "Convite de conexão com contexto",
        mensagem: "“[Nome], acompanho conteúdos sobre [tema] no seu segmento. Gostaria de conectar para acompanhar suas publicações.”",
        quando: "Sempre que enviar um convite. Nunca envie convite em branco.",
        porqueFunciona: "Convite com contexto aumenta taxa de aceite em 3–4x e elimina suspeita de spam.",
        resposta: "Conexão aceita.",
        continuar: "Aguardar uma publicação dele para começar a interagir. Não mandar mensagem imediatamente após aceite.",
      },
      {
        titulo: "Comentário em publicação dele",
        mensagem: "“Esse ponto sobre [tema específico] é exatamente o que tenho observado em conversas com [perfil similar]. Sua leitura é precisa.”",
        quando: "Em até 24h após a publicação, quando ainda há engajamento orgânico.",
        porqueFunciona: "Visibilidade pública + validação inteligente. Cria reconhecimento entre os pares dele.",
        resposta: "Curtida no comentário ou resposta direta.",
        continuar: "Repetir o padrão em outras publicações. Construir autoridade visível.",
      },
      {
        titulo: "Mensagem direta com observação técnica",
        mensagem: "“[Nome], tenho acompanhado seus posts sobre [tema]. Há um ponto que costuma aparecer em conversas com [perfil similar] que talvez complemente sua visão: [insight curto]. Compartilho se fizer sentido.”",
        quando: "Após pelo menos 2 comentários públicos relevantes em publicações dele.",
        porqueFunciona: "Autoridade demonstrada + reciprocidade ofertada + opcionalidade ('se fizer sentido').",
        resposta: "“Faz sentido sim, manda aí.”",
        continuar: "Enviar conteúdo realmente útil. Não emendar pitch.",
      },
      {
        titulo: "Convite para conversa estruturada",
        mensagem: "“[Nome], pelas nossas trocas aqui, faria sentido a gente reservar 30min pra olhar [tema específico] com mais profundidade. Te envio duas opções de horário?”",
        quando: "Após 3+ trocas substanciais e pelo menos 1 sinal verde claro.",
        porqueFunciona: "Linguagem profissional + agenda travada + autoridade.",
        resposta: "“Sim, manda as opções.”",
        continuar: "Oferecer dois horários específicos com dia e hora.",
      },
    ],
  },
  {
    id: "networking",
    label: "Networking Presencial",
    short: "Networking",
    emoji: "🤝",
    icon: <Users className="h-3.5 w-3.5" />,
    accent: "#c9a84c",
    badge: "Canal · Presencial · Confiança rápida",
    premissa: "Em eventos, a confiança se constrói em minutos. Mas o esquentamento real acontece DEPOIS — no follow-up dos próximos 7 dias.",
    ritmo: "Conversa presencial → mensagem em 24h → conteúdo em 5 dias → convite em 10 dias.",
    exemplos: [
      {
        titulo: "Apresentação em evento",
        mensagem: "“Oi, sou o [Você]. Vi que você é da área [X]. O que te trouxe pra esse evento?”",
        quando: "Nos primeiros minutos de interação. Foco em ouvir, não em se vender.",
        porqueFunciona: "Pergunta aberta sobre o outro. Coloca ele no centro da conversa, não você.",
        resposta: "Ele responde e devolve a pergunta.",
        continuar: "Aprofundar com curiosidade genuína. Falar de você só quando perguntado.",
      },
      {
        titulo: "Follow-up em 24h",
        mensagem: "“[Nome], foi muito bom te conhecer ontem no [evento]. Aquela conversa sobre [tema específico] ficou na cabeça. Vamos manter contato?”",
        quando: "Em até 24h após o evento, enquanto a memória ainda é fresca.",
        porqueFunciona: "Especificidade (tema) prova que a conversa importou + abre canal de comunicação.",
        resposta: "“Igualmente, foi ótimo. Vamos sim.”",
        continuar: "Não puxar reunião. Apenas reforçar a conexão.",
      },
      {
        titulo: "Envio de conteúdo relacionado",
        mensagem: "“[Nome], lembrei daquela nossa conversa sobre [tema] quando vi isso aqui. Acho que vai te interessar.”",
        quando: "5–7 dias após o follow-up inicial.",
        porqueFunciona: "Reciprocidade + memória curada + continuidade do tema dele.",
        resposta: "“Demais, obrigado por lembrar.”",
        continuar: "Aguardar mais 5–7 dias antes do próximo movimento.",
      },
      {
        titulo: "Convite estruturado",
        mensagem: "“[Nome], tô organizando uma agenda pra revisar com algumas pessoas do círculo o cenário de [tema]. Como nossa conversa foi nessa linha, faria sentido você participar. Te envio duas opções?”",
        quando: "Após 2–3 trocas pós-evento e ao menos uma demonstração de interesse.",
        porqueFunciona: "Cria escassez por seleção ('algumas pessoas') + reposiciona a reunião como continuação natural.",
        resposta: "“Faz sentido, manda as opções.”",
        continuar: "Marcar com dia, hora e formato definidos. Nunca deixar em aberto.",
      },
    ],
  },
  {
    id: "parceiros",
    label: "Parceiros Estratégicos",
    short: "Parceiros",
    emoji: "♟️",
    icon: <Handshake className="h-3.5 w-3.5" />,
    accent: "var(--navy)",
    badge: "Canal · Multiplicador · B2B2C",
    premissa: "Parceiros (contadores, advogados, médicos influentes, gestores de clínicas) são alavancas. Esquentar parceiro vale por 10 contatos diretos.",
    ritmo: "Conexão profissional → entrega de valor → reciprocidade → indicação mútua.",
    exemplos: [
      {
        titulo: "Abordagem inicial profissional",
        mensagem: "“[Nome], soube do seu trabalho com [perfil de cliente] através de [referência]. Tenho um trabalho complementar com [perfil semelhante]. Faria sentido a gente se conhecer?”",
        quando: "Após mapear contadores, advogados ou consultores que atendem o mesmo perfil de cliente que você.",
        porqueFunciona: "'Trabalho complementar' posiciona como parceria, não concorrência.",
        resposta: "“Faz sentido sim, podemos conversar.”",
        continuar: "Agendar conversa 1:1 sem expectativa imediata de troca. Construir antes de cobrar.",
      },
      {
        titulo: "Indicação primeiro (você indica antes)",
        mensagem: "“[Nome], tô indicando o [Cliente] pra você. Caso de [contexto], faz total sentido você atender. Te apresento por aqui ou em chamada?”",
        quando: "Sempre que tiver um cliente real que se beneficie do trabalho do parceiro.",
        porqueFunciona: "Reciprocidade ativa antes da reciprocidade pedida. Inverte a lógica padrão de prospecção.",
        resposta: "“Demais, manda os contatos.”",
        continuar: "Após a indicação ser convertida, abrir conversa sobre fluxo recíproco.",
      },
      {
        titulo: "Reunião de alinhamento estratégico",
        mensagem: "“[Nome], pelo que conversamos, faz sentido a gente alinhar como nossos atendimentos podem se complementar. Te envio duas opções de horário pra reservar 45min?”",
        quando: "Após 1–2 trocas profissionais e sinal claro de interesse mútuo.",
        porqueFunciona: "Frame estratégico (não comercial) + agenda específica + tempo definido.",
        resposta: "“Sim, manda as opções.”",
        continuar: "Levar para a reunião uma proposta clara de fluxo, não apenas conversa.",
      },
      {
        titulo: "Conteúdo posicionando você como referência",
        mensagem: "“[Nome], elaborei esse material sobre [tema técnico relevante para os clientes dele]. Se fizer sentido, fica à vontade para usar com seus clientes.”",
        quando: "Periodicamente, sem cobrança de retorno.",
        porqueFunciona: "Você vira fonte. Quando ele precisar de planejamento financeiro pra um cliente, lembra de você primeiro.",
        resposta: "“Vou usar sim, obrigado.”",
        continuar: "Repetir trimestralmente. Construir autoridade no fluxo dele.",
      },
    ],
  },
];

/* ============================================================
   CONTEÚDO — MODO ESTUDO
   ============================================================ */

const ESTUDO_BLOCKS: { id: string; titulo: string; eyebrow: string; texto: string; bullets?: string[]; icon: React.ReactNode }[] = [
  {
    id: "psicologia",
    eyebrow: "Conceito 01",
    titulo: "A psicologia do contato frio",
    texto:
      "Desconhecidos naturalmente desconfiam. O cérebro humano é treinado para tratar o que não reconhece como ameaça em potencial. Por isso, qualquer abordagem direta de venda dispara resistência instantânea. A solução não é melhorar o pitch — é eliminar o frio antes da abordagem.",
    bullets: [
      "Resistência inicial é biológica, não pessoal.",
      "Pitches frios reforçam a desconfiança em vez de reduzi-la.",
      "A única forma de baixar a guarda é repetição com baixa pressão.",
    ],
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "familiaridade",
    eyebrow: "Conceito 02",
    titulo: "O efeito familiaridade",
    texto:
      "Pessoas confiam mais em quem já viram várias vezes, mesmo sem nunca terem conversado. Curtidas, comentários, presença em stories e interações leves criam uma sensação de 'já conheço esse nome' que reduz a barreira de entrada da primeira conversa.",
    bullets: [
      "Repetição reduz resistência mesmo sem conteúdo profundo.",
      "Familiaridade visual é a antessala da confiança.",
      "5–8 exposições passivas antes da primeira mensagem direta.",
    ],
    icon: <Eye className="h-5 w-5" />,
  },
  {
    id: "reciprocidade",
    eyebrow: "Conceito 03",
    titulo: "O efeito reciprocidade",
    texto:
      "Entregar valor antes de pedir qualquer coisa aumenta drasticamente o engajamento futuro. Não porque a pessoa 'deve' algo — mas porque o cérebro automaticamente classifica quem entrega valor como aliado, não como vendedor.",
    bullets: [
      "Reciprocidade só funciona se for genuína e sem cobrança.",
      "Conteúdo institucional não conta como entrega de valor.",
      "O valor entregue precisa ser específico para o contexto da pessoa.",
    ],
    icon: <Gift className="h-5 w-5" />,
  },
  {
    id: "autoridade-pilares",
    eyebrow: "Conceito 04",
    titulo: "Os 4 pilares da autoridade",
    texto: "Autoridade não se declara. Se demonstra. E é construída sobre quatro pilares simples:",
    bullets: [
      "Conhecimento: você sabe do que está falando, com profundidade real.",
      "Consistência: aparece sempre, com a mesma qualidade, sem oscilar.",
      "Credibilidade: cita casos, exemplos, situações reais — não teoria.",
      "Prova social: outras pessoas reconhecem você publicamente.",
    ],
    icon: <Award className="h-5 w-5" />,
  },
  {
    id: "fracasso",
    eyebrow: "Diagnóstico",
    titulo: "Por que a maioria dos planejadores fracassa",
    texto:
      "Não é falta de técnica. É pressa. A maioria queima as etapas tentando converter contato frio direto em reunião — e gera rejeição em escala. O ciclo do erro é sempre o mesmo:",
    bullets: [
      "Tentam agendar rápido demais, sem reconhecimento prévio.",
      "Tentam vender rápido demais, sem entregar valor antes.",
      "Falam de produtos cedo demais, sem construir autoridade.",
      "Criam urgência artificial sem relacionamento que sustente.",
    ],
    icon: <AlertTriangle className="h-5 w-5" />,
  },
];

const TERMOMETRO = [
  {
    nivel: "Frio",
    emoji: "🔴",
    cor: "var(--danger)",
    sinais: [
      "Não responde mensagens.",
      "Não te reconhece em redes sociais.",
      "Nenhuma interação registrada.",
    ],
    acao: "Voltar para a Etapa 1 ou 2. Não tentar conversa direta ainda.",
  },
  {
    nivel: "Morno",
    emoji: "🟡",
    cor: "var(--warn)",
    sinais: [
      "Reconhece você por nome ou foto.",
      "Interage ocasionalmente em redes sociais.",
      "Conversa acontece, mas com respostas curtas.",
    ],
    acao: "Aprofundar relacionamento (Etapas 4 e 5). Entregar valor sem pedir nada.",
  },
  {
    nivel: "Quente",
    emoji: "🟢",
    cor: "var(--success)",
    sinais: [
      "Busca sua opinião sobre temas que ele enfrenta.",
      "Interage espontaneamente em diferentes canais.",
      "Demonstra confiança e abre temas pessoais ou financeiros.",
    ],
    acao: "Está pronto para a ligação. Avançar para Etapa 8 e propor conversa estruturada.",
  },
];

const CHECKLIST = [
  "O contato já me reconhece por nome.",
  "Já houve troca de mensagens substanciais.",
  "Já entreguei valor sem pedir nada em troca.",
  "Existe uma base de confiança mínima estabelecida.",
  "Existe curiosidade do contato sobre o que eu faço.",
  "Existe abertura para conversa estruturada.",
  "Existe um relacionamento mínimo, ainda que recente.",
];

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

type Mode = "pratica" | "estudo";

function Esquentar() {
  const [activeId, setActiveId] = useState<string>(CHANNELS[0].id);
  const [mode, setMode] = useState<Mode>("pratica");

  const channel = useMemo(
    () => CHANNELS.find((c) => c.id === activeId) ?? CHANNELS[0],
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
              <Flame className="h-3.5 w-3.5" /> Modo Esquentamento
            </span>
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Passo a Passo para <span className="text-[var(--success)]">Esquentar Contato</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed">
            Como transformar desconhecidos, seguidores, parceiros e indicações antigas em pessoas que reconhecem valor em você antes mesmo da primeira ligação.
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: "Etapas", v: `${ETAPAS.length}` },
              { l: "Canais", v: `${CHANNELS.length}` },
              { l: "Modo Prática", v: "Execução" },
              { l: "Modo Estudo", v: "Psicologia" },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{m.l}</p>
                <p className="mt-2 text-xl sm:text-2xl font-extrabold text-white">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MODE SELECTOR + CHANNEL CHIPS */}
      <nav className="sticky top-12 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 flex items-center gap-2 flex-wrap">
          <div role="tablist" className="inline-flex items-center rounded-xl border border-border bg-[var(--surface)] p-1">
            <ModeButton
              active={mode === "pratica"}
              onClick={() => setMode("pratica")}
              icon={<Flame className="h-3.5 w-3.5" />}
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

        {/* CHIPS DE CANAL */}
        <div className="border-t border-border bg-gradient-to-b from-white to-[var(--surface)]/60">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 w-max pr-2">
                <span className="hidden sm:inline shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground pr-1">
                  Canal
                </span>
                {CHANNELS.map((c) => {
                  const active = c.id === activeId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      aria-label={`Selecionar canal ${c.label}`}
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

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-12">
        {/* CABEÇALHO DO CANAL ATIVO */}
        <section className="rounded-3xl border-2 p-6 sm:p-8 text-white shadow-2xl bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c]"
          style={{ borderColor: channel.accent, boxShadow: `0 30px 80px -40px ${channel.accent}` }}
        >
          <div className="flex items-start gap-3 flex-wrap">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
              style={{ background: channel.accent, color: "var(--navy)" }}
              aria-hidden
            >
              {channel.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: channel.accent }}>{channel.badge}</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">{channel.label}</h2>
              <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">{channel.premissa}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MiniStat icon={<Target className="h-4 w-4" />} label="Ritmo recomendado" value={channel.ritmo} />
            <MiniStat icon={<Lightbulb className="h-4 w-4" />} label="Princípio" value="Familiaridade antes de proposta. Valor antes de pedido." />
          </div>
        </section>

        {/* CONTEÚDO POR MODO */}
        <div className="mt-10 sm:mt-14">
          {mode === "pratica" ? <PraticaMode channel={channel} /> : <EstudoMode channel={channel} />}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   MODO PRÁTICA
   ============================================================ */

function PraticaMode({ channel }: { channel: Channel }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* REGRA DE OURO */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--navy)] shadow-lg shadow-[var(--success)]/30">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Regra Elite</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Esquentar é processo, não evento.</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              As 8 etapas abaixo formam uma sequência. Pular etapas é o motivo mais comum de rejeição. Conduza no ritmo da pessoa, não no seu.
            </p>
          </div>
        </div>
      </section>

      {/* ETAPAS */}
      {ETAPAS.map((e) => (
        <EtapaCard key={e.id} etapa={e} accent={channel.accent} />
      ))}

      {/* BIBLIOTECA DE EXEMPLOS DO CANAL */}
      <section>
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          eyebrow={`Biblioteca · ${channel.label}`}
          title="Exemplos prontos para esse canal"
          accent={channel.accent}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {channel.exemplos.map((ex, i) => (
            <article key={i} className="rounded-2xl border border-border bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: channel.accent }}>
                Exemplo {i + 1}
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
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Possível resposta</dt>
                  <dd className="mt-1 text-[var(--navy)] leading-relaxed">{ex.resposta}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Como continuar</dt>
                  <dd className="mt-1 text-[var(--navy)]/85 leading-relaxed">{ex.continuar}</dd>
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

function EstudoMode({ channel }: { channel: Channel }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* CAPA */}
      <section className="rounded-3xl border-2 border-[var(--brand)] bg-gradient-to-br from-[#0a1733] via-[var(--navy)] to-[#1a2e5c] p-6 sm:p-8 text-white shadow-2xl shadow-[var(--brand)]/20">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/40">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Academia do Esquentamento</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">Por que esquentar antes vence pitch frio</h2>
            <p className="mt-3 text-white/80 leading-relaxed max-w-3xl">
              O esquentamento não é gentileza. É engenharia. Cada etapa ativa um mecanismo cognitivo específico que prepara a outra pessoa para a conversa estruturada.
            </p>
          </div>
        </div>
      </section>

      {/* CONCEITOS */}
      {ESTUDO_BLOCKS.map((b) => (
        <section key={b.id} className="rounded-3xl border border-border bg-white p-6 sm:p-8">
          <header className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: channel.accent }}>
              {b.icon}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: channel.accent }}>{b.eyebrow}</p>
              <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)] leading-tight">{b.titulo}</h3>
            </div>
          </header>
          <p className="text-[15px] text-[var(--navy)]/85 leading-relaxed">{b.texto}</p>
          {b.bullets && (
            <ul className="mt-4 space-y-2">
              {b.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl border border-border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--navy)] leading-snug">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: channel.accent }} />
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
          title="O termômetro do relacionamento"
          accent={channel.accent}
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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">Checklist de esquentamento</p>
            <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-[var(--navy)] leading-tight">Antes de propor uma ligação, verifique</h3>
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
          <strong>Regra:</strong> se a maioria das respostas for NÃO, ainda não é hora da ligação. Volte uma etapa e aprofunde o relacionamento.
        </p>
      </section>

      {/* MANTRA */}
      <section className="rounded-3xl border-2 p-6 sm:p-8 text-white" style={{ borderColor: channel.accent, background: "linear-gradient(135deg, #0a1733, var(--navy))" }}>
        <div className="flex items-start gap-3">
          <Quote className="h-8 w-8 shrink-0" style={{ color: channel.accent }} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: channel.accent }}>Mantra</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold leading-snug">
              “Você não está perseguindo um cliente. Está construindo uma relação onde a ligação acontece como consequência natural.”
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

        {(etapa.sinaisVerdes || etapa.sinaisAmarelos || etapa.sinaisVermelhos) && (
          <div className="grid gap-3 md:grid-cols-3">
            {etapa.sinaisVerdes && (
              <SignalBox label="Sinais verdes" color="var(--success)" items={etapa.sinaisVerdes} symbol="✓" />
            )}
            {etapa.sinaisAmarelos && (
              <SignalBox label="Sinais amarelos" color="var(--warn)" items={etapa.sinaisAmarelos} symbol="!" />
            )}
            {etapa.sinaisVermelhos && (
              <SignalBox label="Sinais vermelhos" color="var(--danger)" items={etapa.sinaisVermelhos} symbol="✕" />
            )}
          </div>
        )}

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

function SignalBox({ label, color, items, symbol }: { label: string; color: string; items: string[]; symbol: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: `color-mix(in oklab, ${color} 35%, transparent)`, background: `color-mix(in oklab, ${color} 6%, white)` }}>
      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-[var(--navy)] leading-snug flex items-start gap-1.5">
            <span className="mt-0.5 font-bold" style={{ color }}>{symbol}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}