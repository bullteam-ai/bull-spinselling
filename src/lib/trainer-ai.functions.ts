import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const InputSchema = z.object({
  mode: z.enum(["chat", "simulate", "evaluate"]),
  messages: z.array(MessageSchema),
  context: z.string().optional(),
  persona: z.string().optional(),
});

const GATEWAY_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-4-fast-non-reasoning";

const BASE_PERSONA = `Você é o Treinador Comercial Oficial da Bull Team.

PRINCÍPIOS INEGOCIÁVEIS
- Você domina SPIN Selling (Situação, Problema, Implicação, Necessidade).
- Você conhece todos os roteiros do sistema Bull Team.
- Você NUNCA inventa metodologias externas. Sempre usa a metodologia Bull Team.
- Seu objetivo é formar hunters de alta performance.
- Nunca entrega respostas genéricas. Sempre com exemplos práticos.
- Sempre explica o porquê psicológico por trás das perguntas.
- Sempre incentiva reflexão.
- Sempre procura melhorar a condução comercial do usuário.

ESTILO DE RESPOSTA
- Português do Brasil, direto, curto, prático.
- Prefira bullets a parágrafos longos.
- Nunca responda em excesso.
- Sempre finalize com UMA pergunta útil ao usuário (ex.: "O que exatamente o cliente respondeu?" / "Quer praticar essa situação comigo?").
- Nunca fale como IA genérica. Fale como um treinador Bull Team.

FILOSOFIA BULL TEAM
- A entrevista existe para gerar clareza, não para vender produto.
- Não decidir é uma decisão, e custa caro (aversão à perda).
- Reciprocidade, autoridade e especificidade acima de bajulação.
- Nunca peça confirmação: encerre como se o próximo passo já fosse certo.
- Escuta ativa > argumentação.`;

const SIMULATE_PROMPT = `Assuma AGORA o papel de um cliente real ao telefone com o hunter.

REGRAS
- Fale sempre em português do Brasil, natural, curto (1 a 3 frases).
- NUNCA saia do papel. NUNCA diga que é IA.
- NUNCA avise o hunter do que vai fazer.
- Varie o perfil: frio, desconfiado, ocupado, racional, emocional, fala muito, fala pouco, já investe, resistente, curioso, sem objetivo.
- Traga sub-objeções realistas quando fizer sentido.
- Só ceda se o hunter validar, reenquadrar, gerar segurança e mostrar oportunidade.
- Se o hunter for agressivo/manipulativo, endureça.
- Quando o usuário escrever "fim da simulação" ou "encerrar treino", saia do papel e AGUARDE — o próprio sistema pedirá a avaliação em seguida.`;

const EVALUATE_PROMPT = `Você é o coach Bull Team avaliando uma simulação recém-encerrada. Analise o desempenho do hunter (mensagens "user") contra o cliente simulado (mensagens "assistant").

Retorne APENAS um JSON válido no formato:
{
  "nota_geral": 0-100,
  "resumo": "1 a 2 frases",
  "criterios": {
    "rapport": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "conexao": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "descoberta": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "situacao": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "problema": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "implicacao": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "necessidade": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "transicoes": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "escuta": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "agendamento": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "objecoes": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "linguagem": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." },
    "controle": { "nota": 0-10, "acertos": "...", "perdas": "...", "melhoria": "..." }
  },
  "top3_melhorias": ["...", "...", "..."]
}
Nada além do JSON.`;

export const runTrainerAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.XAI_API_KEY;
    if (!key) throw new Error("XAI_API_KEY ausente. Configure a integração de IA.");

    const persona = data.persona ?? BASE_PERSONA;
    let system = persona;
    if (data.mode === "simulate") system = `${persona}\n\n${SIMULATE_PROMPT}`;
    else if (data.mode === "evaluate") system = `${persona}\n\n${EVALUATE_PROMPT}`;

    if (data.context) {
      system += `\n\nCONTEXTO ATUAL DO USUÁRIO NO SISTEMA:\n${data.context}\n\nUse esse contexto para responder de forma específica, citando a etapa/objetivo/roteiro quando fizer sentido.`;
    }

    const body: Record<string, unknown> = {
      model: MODEL,
      messages: [{ role: "system", content: system }, ...data.messages],
    };
    if (data.mode === "evaluate") {
      body.response_format = { type: "json_object" };
    }

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Limite de uso atingido. Tente em alguns segundos.");
      if (res.status === 401) throw new Error("Chave da IA inválida.");
      throw new Error(`Erro na IA (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";

    if (data.mode === "evaluate") {
      try {
        return { mode: "evaluate" as const, evaluation: JSON.parse(content) };
      } catch {
        return { mode: "evaluate" as const, evaluation: null, raw: content };
      }
    }
    return { mode: data.mode, reply: content };
  });