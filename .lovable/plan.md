# Plano — Bull Team | Central de Condução Comercial

Três camadas de uso convivendo na página `/ligacoes`, sem quebrar o que já existe:

1. **Consulta livre** (comportamento atual)
2. **Modo Foco** (camada teleprompter opcional)
3. **Ligação Guiada** (fluxo passo a passo com wizard)

Além disso, ampliação da seção de objeções.

---

## 1. Modo Foco (refatorar `src/components/FocusMode.tsx`)

Hoje ele só esconde as demais `<section>`s e mostra a atual como está — mantém toda a poluição visual (treinamento, badges, etc). Vou trocar por uma **camada overlay teleprompter**:

- Quando ativo, renderiza um `fixed inset-0` com fundo escuro sobre a página.
- Card central grande com:
  - Topo: `Modo Foco · Ligação ao vivo`
  - Indicador "Etapa X de N · Nome"
  - Pergunta / fala principal em fonte grande (`text-3xl sm:text-4xl`)
  - Duas colunas: **✅ Se responder SIM** / **❌ Se responder NÃO** (empilhadas no mobile)
  - `🎤 Transição recomendada`
  - Rodapé: `← Voltar`, `Próxima etapa →`, `Sair do Modo Foco`
- Continua lendo `<section id="…">` do `<main>` como fonte das etapas (retrocompatível).
- Extração da pergunta/SIM/NÃO/transição a partir dos campos existentes do bloco (`script`, `doSay`, `dontSay`, `intent`). Onde não houver ramo SIM/NÃO explícito, oculta a caixa faltante.
- Atalhos de teclado (← → Esc) preservados.
- CSS antigo `.focus-mode [data-focus-hidden]` deixa de ser necessário (overlay resolve), mas mantenho por retrocompatibilidade.

## 2. Ligação Guiada (novo)

Novo componente `src/components/GuidedCall.tsx` acionado por um botão **🚀 Iniciar Ligação Guiada** no topo de `/ligacoes`.

Wizard em 3 passos + condução:

- **Passo 1:** Tipo de ligação — Amigo | Recomendação (chips grandes).
- **Passo 2:** Objetivo principal — 11 objetivos listados (grid de cards).
- **Passo 3:** Condução — sequência fixa **Abertura → Objetivo → Situação → Problema → Implicação → Necessidade → Sinais de Compra → Agendamento → Compromisso → Comparecimento** (10 etapas).

Cada etapa mostra:
- Barra de progresso "Etapa 3 de 10 · Problema"
- Título + objetivo curto da etapa
- Fala principal (card destaque)
- Opções de aprofundamento
- Botões: `cliente respondeu bem` (revela ramo SIM) · `cliente resistiu` (revela ramo NÃO) · `Próxima etapa`

### Fonte de dados

As 10 etapas SPIN não existem 1:1 nos `CallType` atuais. Crio um dataset novo, enxuto, em `src/data/guided-call.ts`:

- `GUIDED_STAGES: { id, label, objetivo, fala, sim: string[], nao: string[], transicao }[]` (10 entradas).
- `CALL_KINDS` (Amigo/Recomendação) e `OBJECTIVES` (11) apenas ajustam a **fala de "Objetivo"** e "Abertura" via um mapa `OBJECTIVE_HOOKS[objectiveId] = { abertura?, objetivo }`.

Isso evita duplicar o conteúdo existente e mantém o dataset guiado compacto e editável. Fonte de verdade separada dos scripts atuais (que continuam intactos).

## 3. Objeções expandidas

Nova estrutura em `src/data/objecoes.ts`:

```ts
type Objection = {
  q: string;
  intencao: string;
  resposta: string;
  escalada: string;
  categoria: "Tempo"|"Decisor"|"Dinheiro"|"Confiança"|"Desconforto"|"Autonomia"|"Medo de compromisso";
};
```

- Adiciono as 6 novas objeções do briefing.
- Atualizo o tipo `Objection` em `ligacoes.tsx` e migro as objeções antigas (que só têm `q`+`a`) para o novo shape com campos opcionais `intencao`/`escalada`/`categoria`.
- Novo componente `ObjectionCard` (expansível/accordion): mostra objeção + tag; ao expandir revela Intenção, Resposta, Escalada e botão **Copiar resposta** (reusa `copyToClipboard`).
- Aplico o novo layout em TODAS as listas de objeções da página (todos os `CallType`).

## 4. Componentização e limpeza

- `src/components/FocusOverlay.tsx` (novo overlay do Modo Foco).
- `src/components/GuidedCall.tsx` (wizard + condutor).
- `src/components/ObjectionCard.tsx` (card expansível reutilizável).
- `src/data/guided-call.ts` + `src/data/objecoes.ts`.
- Nenhum "—" nos textos visíveis (respeita o check de build já instalado).

## 5. Preservação

- Modo Ligação e Modo Treinamento intactos.
- Busca, favoritos, filtros SPIN, termômetro e barra inferior preservados.
- Nada removido do dataset atual `CALL_TYPES`.
- Botões e fontes grandes, mobile-first no overlay e no wizard.

---

## Perguntas antes de codar

1. **Ligação Guiada — escopo do dataset:** o briefing pede 10 etapas SPIN genéricas (Abertura → … → Comparecimento). Confirma que posso criar esse dataset novo/enxuto (~10 falas curtas + ramos SIM/NÃO) em vez de tentar mapear os `CallType` atuais (que são de Confirmação/Reagendamento/Recomendação, não uma ligação SPIN de descoberta)?
2. **Modo Foco — origem dos ramos SIM/NÃO:** dentro do fluxo livre atual, poucos blocos têm ramificação SIM/NÃO real. Posso ocultar as caixas vazias quando não houver conteúdo, ou você prefere que eu preencha SIM/NÃO padrão para cada bloco existente (trabalho de conteúdo bem maior)?
3. **Objeções antigas:** migro para o novo shape mesmo sem `intencao`/`escalada`/`categoria` preenchidos (campos ficam ocultos até você editar), ou prefere que eu escreva esses campos para as objeções existentes também?
