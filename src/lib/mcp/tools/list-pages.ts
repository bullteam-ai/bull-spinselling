import { defineTool } from "@lovable.dev/mcp-js";

const PAGES = [
  { path: "/", title: "Início", description: "Fluxo Elite: da abertura ao agendamento com scripts padronizados." },
  { path: "/ligacoes", title: "Modo Ligação", description: "Scripts completos para confirmação, reagendamento e pós-reunião com gatilhos psicológicos." },
  { path: "/prospeccao", title: "Prospecção", description: "Abordagens de prospecção ativa e mensagens de contato inicial." },
  { path: "/esquentar", title: "Esquentar", description: "Como esquentar o lead antes da reunião." },
  { path: "/recomendacoes", title: "Recomendações", description: "Como pedir e conduzir recomendações qualificadas." },
];

export default defineTool({
  name: "list_pages",
  title: "List pages",
  description: "Lista as páginas principais do Bull Team (SPIN Selling) com um resumo de cada seção.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PAGES, null, 2) }],
    structuredContent: { pages: PAGES },
  }),
});