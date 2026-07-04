import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const InputSchema = z.object({
  mode: z.enum(["chat", "evaluate"]),
  objecao: z.string().min(1),
  dificuldade: z.enum(["basica", "media", "dura"]).default("media"),
  messages: z.array(MessageSchema),
});

const GATEWAY_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-4-fast-non-reasoning";

function systemPromptChat(objecao: string, dificuldade: string) {
  const nivel =
    dificuldade === "dura"
      ? "Você é um cliente MUITO resistente. Fica em dúvida, questiona, hesita várias vezes antes de ceder."
      : dificuldade === "basica"
        ? "Você é um cliente moderadamente resistente. Cede se o vendedor for empático e claro."
        : "Você é um cliente com resistência média. Precisa ser convencido com empatia, reenquadre e segurança.";
  return `Você é um cliente em uma reunião de planejamento financeiro que acabou de ser convidado a INDICAR pessoas próximas. Sua objeção principal é: "${objecao}". ${nivel}

Regras:
- Fale sempre em português do Brasil, tom natural, curto (1 a 3 frases).
- NUNCA saia do papel. NUNCA diga que é uma IA.
- Não facilite. Só ceda se o vendedor validar, reenquadrar, gerar segurança e mostrar oportunidade.
- Pode trazer sub-objeções relacionadas (medo de julgamento, perda de controle, exposição, LGPD, etc.).
- Se o vendedor for agressivo/manipulativo, endureça.
- Quando finalmente ceder, ceda de forma realista (ex: "Tá, deixa eu pensar em alguém... o [Nome]...").`;
}

function systemPromptEval(objecao: string) {
  return `Você é um coach de vendas elite especializado em quebra de objeções em recomendações. Avalie a performance do vendedor em uma simulação sobre a objeção: "${objecao}".

Retorne APENAS um JSON válido no formato exato:
{
  "notas": {
    "empatia": 0-10,
    "clareza": 0-10,
    "reducao_de_risco": 0-10,
    "naturalidade": 0-10,
    "conducao_proximo_passo": 0-10
  },
  "nota_geral": 0-10,
  "pontos_fortes": ["...", "..."],
  "pontos_a_melhorar": ["...", "..."],
  "resposta_otimizada": "resposta ideal que o vendedor poderia ter dado, em português, natural, seguindo Validar > Reenquadrar > Gerar Segurança > Mostrar Oportunidade > Pedir Ação",
  "exercicio_proximo_nivel": "descrição curta de um exercício mais difícil"
}
Nada além do JSON.`;
}

export const runObjecaoTrainer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.XAI_API_KEY;
    if (!key) throw new Error("XAI_API_KEY ausente");

    const system =
      data.mode === "chat"
        ? systemPromptChat(data.objecao, data.dificuldade)
        : systemPromptEval(data.objecao);

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
      if (res.status === 429) throw new Error("Limite de uso do Grok atingido. Tente em alguns segundos.");
      if (res.status === 401) throw new Error("XAI_API_KEY inválida.");
      throw new Error(`Erro no Grok (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";

    if (data.mode === "evaluate") {
      try {
        return { evaluation: JSON.parse(content) };
      } catch {
        return { evaluation: null, raw: content };
      }
    }
    return { reply: content };
  });