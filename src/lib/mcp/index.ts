import { defineMcp } from "@lovable.dev/mcp-js";
import listCallTypes from "./tools/list-call-types";
import listPages from "./tools/list-pages";

export default defineMcp({
  name: "bull-team-mcp",
  title: "Bull Team · SPIN Selling",
  version: "0.1.0",
  instructions:
    "Ferramentas do Bull Team para planejamento financeiro e SPIN Selling. Use `list_pages` para conhecer as seções do app e `list_call_types` para descobrir os scripts de ligação (confirmação, reagendamento e pós-reunião).",
  tools: [listPages, listCallTypes],
});