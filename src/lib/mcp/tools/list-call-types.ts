import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const CALL_TYPES = [
  { id: "confirmacao", label: "Confirmação de Reunião", objetivo: "Blindar a presença do cliente reposicionando o valor da reunião antes que ele desmarque mentalmente.", duracao: "2 a 3 minutos", publico: "Reunião agendada · público geral" },
  { id: "confirmacao-premium", label: "Confirmação Premium · Alta Renda", objetivo: "Confirmar presença usando linguagem de elite e elevar o cliente ao frame de tomador de decisão.", duracao: "2 a 3 minutos", publico: "Empresários, médicos, executivos, investidores" },
  { id: "reagendamento", label: "Reagendamento", objetivo: "Resgatar a reunião perdida reativando o motivo original que levou o cliente a aceitar.", duracao: "3 a 5 minutos", publico: "Cliente que não compareceu ou cancelou" },
  { id: "reagendamento-premium", label: "Reagendamento Premium · Alta Renda", objetivo: "Resgatar o cliente premium sem perder autoridade, reativando o eixo decisão × patrimônio.", duracao: "3 a 4 minutos", publico: "Cliente premium que não compareceu" },
  { id: "recuperacao-rec", label: "Recuperação Pós-Reunião + Recomendações", objetivo: "Validar a experiência, reforçar valor percebido e extrair recomendações qualificadas.", duracao: "5 a 8 minutos", publico: "Cliente que já participou da reunião" },
];

export default defineTool({
  name: "list_call_types",
  title: "List call types",
  description: "Lista os tipos de ligação disponíveis no Bull Team (confirmação, reagendamento, pós-reunião) com objetivo, duração e público.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(CALL_TYPES, null, 2) }],
    structuredContent: { call_types: CALL_TYPES },
  }),
});