import type { FocusStep } from "@/components/FocusMode";
import { GUIDED_STAGES } from "./guided-call";

/**
 * Roteiros do Modo Foco por rota. Cada entrada aqui é um roteiro estruturado,
 * validado manualmente com o conteúdo real da página correspondente.
 *
 * Regras:
 *   - Só publicamos etapas para páginas que TÊM roteiro comercial explícito.
 *   - Nunca inferimos etapas a partir do DOM. Se a página não está aqui,
 *     o Modo Foco exibe estado vazio orientando o usuário.
 *   - Rotas com publicação dinâmica (ex.: /ligacoes, que muda por modelo)
 *     NÃO aparecem neste mapa e continuam controladas pela própria página.
 */

const HOME_FOCUS_SCRIPT: FocusStep[] = GUIDED_STAGES.map((stage) => ({
  id: stage.id,
  label: stage.label,
  pergunta: stage.fala,
  sim: stage.sim,
  nao: stage.nao,
  transicao: stage.transicao,
}));

export const FOCUS_SCRIPTS: Record<string, FocusStep[]> = {
  "/": HOME_FOCUS_SCRIPT,

  "/recomendacoes": [
    {
      id: "passo-1",
      label: "1 · Gerar convicção",
      pergunta:
        "Fulano, olhando para tudo que conversamos hoje, o que mudou na sua visão financeira entre o início da reunião e agora?",
      sim: [
        "Então podemos dizer que essa conversa teve valor para você?",
        "Perfeito. Então provavelmente existem outras pessoas próximas a você que também se beneficiariam.",
      ],
      transicao: "Deixa eu te fazer uma pergunta importante.",
    },
    {
      id: "passo-2",
      label: "2 · Pergunta certa",
      pergunta:
        "Dos médicos que você conhece, quais são os 3 primeiros nomes que vêm na sua cabeça?",
      sim: [
        "Sempre categoria fechada. Nunca 'quem você conhece?'.",
        "Deixe o silêncio trabalhar até o cliente listar.",
      ],
      nao: [
        "Evitar 'quem você conhece que é médico?' (pergunta aberta trava a memória).",
      ],
      transicao: "Ótimo. Agora vamos abrir mais categorias.",
    },
    {
      id: "passo-3",
      label: "3 · Método dos 3 nomes",
      pergunta: "Quais são os 3 empresários mais próximos de você?",
      sim: [
        "E além desses 3?",
        "Quem seria o quarto?",
        "Quem mais? (extrair 5 a 10 nomes por categoria).",
      ],
      transicao: "Vamos pra nichos próximos da sua rotina.",
    },
    {
      id: "passo-7",
      label: "7 · Subida de renda",
      pergunta:
        "Pensando nas pessoas que você conhece, quem estaria entre os 5 maiores níveis de renda da sua rede?",
      sim: [
        "Dessas pessoas, quais você acredita que mais se beneficiariam de uma orientação financeira?",
      ],
      transicao: "Agora a pergunta mais valiosa.",
    },
    {
      id: "passo-8",
      label: "8 · Pessoa de referência",
      pergunta:
        "Quem é o maior exemplo de sucesso financeiro que você conhece pessoalmente?",
      sim: ["Qual o nome dele?", "Qual profissão?", "Por que ele te veio na cabeça?"],
      transicao: "Agora vamos qualificar cada nome.",
    },
    {
      id: "passo-10",
      label: "10 · Priorização",
      pergunta:
        "Se eu pudesse conversar com apenas 3 dessas pessoas primeiro, quais seriam?",
      sim: [
        "Top 3: abordar em até 2 dias.",
        "Top 5: até 3 dias. Top 10: até 4 dias.",
      ],
      transicao: "Feche reconhecendo o cliente pelas indicações.",
    },
  ],

  "/esquentar": [
    {
      id: "et-1",
      label: "1 · Mapear o contato",
      pergunta:
        "Antes de qualquer mensagem: profissão, momento de vida, família, redes ativas, interesses e possíveis dores.",
      sim: ["Pesquisar perfil completo, não só o nome."],
      nao: ["Mensagens genéricas copiadas e coladas.", "Pular essa etapa para acelerar."],
      transicao: "Depois de mapear, gere reconhecimento.",
    },
    {
      id: "et-2",
      label: "2 · Gerar reconhecimento",
      pergunta:
        "Torne-se familiar antes de qualquer abordagem: curtir, comentar com substância, responder stories, parabenizar conquistas por 1–2 semanas.",
      nao: [
        "Curtir tudo de uma vez.",
        "Comentar clichês ('top!', 'arrasou!').",
        "Pular direto para pitch na DM.",
      ],
      transicao: "Quando o rosto já é conhecido, inicie conversa natural.",
    },
    {
      id: "et-3",
      label: "3 · Iniciar conversa natural",
      pergunta:
        "Puxe assunto pelo interesse dele, não pela sua oferta. Comente algo específico que ele postou.",
      transicao: "Depois da 1ª troca, desenvolva relacionamento.",
    },
    {
      id: "et-4",
      label: "4 · Desenvolver relacionamento",
      pergunta:
        "Transforme interação pontual em conversa recorrente. Volte em 3–5 dias com contexto novo, não com pedido.",
      transicao: "Ao longo das conversas, entregue valor.",
    },
    {
      id: "et-5",
      label: "5 · Entregar valor",
      pergunta:
        "Compartilhe algo útil ligado ao contexto dele: um insight, um dado, uma indicação, sem pedir nada em troca.",
      transicao: "Isso constrói autoridade natural.",
    },
    {
      id: "et-6",
      label: "6 · Construir autoridade",
      pergunta:
        "Mostre competência sem vender: cases, resultados, presença consistente, sem forçar 'sou consultor'.",
      transicao: "Fique atento ao momento de abertura.",
    },
    {
      id: "et-7",
      label: "7 · Identificar abertura",
      pergunta:
        "Ele fez pergunta sobre o que você faz? Comentou sobre dinheiro/futuro? É hora de avançar.",
      transicao: "Prepare o terreno para a ligação.",
    },
    {
      id: "et-8",
      label: "8 · Preparar a ligação",
      pergunta:
        "Gere desejo pela conversa futura: 'tem uma coisa que quero te mostrar com calma, melhor por voz'. Sem forçar horário ainda.",
      transicao: "Agora sim: chame para ligar.",
    },
  ],

  "/prospeccao": [
    {
      id: "pr-1",
      label: "1 · Identificar oportunidades",
      pergunta:
        "Descubra em qual papel essa pessoa entra no seu sistema: cliente, indicador ou parceiro?",
      transicao: "Se for indicador/parceiro em potencial, mapeie a rede.",
    },
    {
      id: "pr-2",
      label: "2 · Qualidade da rede",
      pergunta:
        "Como é o círculo profissional que você mais frequenta hoje?",
      transicao: "Descubra os problemas comuns desse público.",
    },
    {
      id: "pr-3",
      label: "3 · Problemas do público",
      pergunta:
        "Quais dores financeiras você mais escuta das pessoas próximas a você?",
      transicao: "Teste abertura para parceria.",
    },
    {
      id: "pr-4",
      label: "4 · Testar abertura",
      pergunta:
        "Faz sentido a gente pensar em algo em conjunto pra essas pessoas?",
      transicao: "Se sim, gere curiosidade sobre o método.",
    },
    {
      id: "pr-5",
      label: "5 · Gerar curiosidade",
      pergunta:
        "Deixe ele enxergar valor no que você faz antes de falar em indicação: explique o resultado, não o produto.",
      transicao: "Peça a primeira oportunidade concreta.",
    },
    {
      id: "pr-6",
      label: "6 · Primeira oportunidade",
      pergunta:
        "Quem seria uma pessoa boa pra gente começar juntos essa semana?",
      transicao: "Se aparecer objeção, contorne com calma.",
    },
    {
      id: "pr-7",
      label: "7 · Contornar objeções",
      pergunta:
        "Responder as 3 objeções mais comuns: 'não tenho ninguém agora', 'preciso conhecer melhor', 'depois eu penso'.",
      transicao: "Feche a conversa preservando o vínculo.",
    },
    {
      id: "pr-8",
      label: "8 · Manutenção",
      pergunta:
        "Combine um retorno leve: 'te chamo semana que vem para atualizar'. Parceria nasce na consistência.",
      transicao: "Encerre firme, sem promessa vaga.",
    },
  ],
};

export function resolveFocusScript(pathname: string): FocusStep[] | null {
  if (FOCUS_SCRIPTS[pathname]) return FOCUS_SCRIPTS[pathname];
  // Match prefixo para sub-rotas (ex.: /recomendacoes/xyz)
  const key = Object.keys(FOCUS_SCRIPTS).find(
    (k) => pathname === k || pathname.startsWith(k + "/"),
  );
  return key ? FOCUS_SCRIPTS[key] : null;
}