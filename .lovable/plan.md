## Objetivo

Criar uma tela de login e um sistema que permita ao admin **clicar em qualquer texto** das páginas (Recomendações, Ligações, Esquentar, Prospecção, Guia da Ligação) e editar direto na tela. As edições ficam salvas no banco e aparecem para todos.

## Arquitetura

1. **Lovable Cloud (Supabase)** — auth real + banco para persistir as edições.
2. **Tabela `content_overrides`** — chave/valor por `field_id` (string única por campo). Sem precisar mapear coluna por coluna; qualquer campo novo é só dar um id.
3. **Tabela `user_roles`** + função `has_role()` — só quem for `admin` consegue editar (segue o padrão recomendado, role NUNCA na tabela de perfil).
4. **Componente `<Editable id="..." as="h2">texto padrão</Editable>`** — usado em toda página. Quando o usuário admin ativa o "Modo Edição", aparece um lápis em cada campo; clicar abre editor inline (textarea + salvar/cancelar). Para usuários comuns, renderiza o texto normalmente (com override aplicado se existir).
5. **Hook `useContent()`** — carrega todos os overrides uma vez via TanStack Query e devolve `get(id, default)`. Cache invalida após salvar.
6. **Server functions** (`createServerFn` com `requireSupabaseAuth` + checagem `has_role('admin')`):
   - `listOverrides()` — público, retorna todos os pares id→valor.
   - `upsertOverride({ id, value })` — admin only.
   - `deleteOverride({ id })` — admin only (volta ao texto padrão).

## UX

- **/auth** — tela de login (email + senha, sem cadastro público; admins criados manualmente pelo dono).
- **TopNav** — quando logado como admin, aparece botão **✏️ Modo Edição**. Quando ativo, todo `<Editable>` ganha contorno tracejado e ícone de lápis no hover. Clique → editor inline → salvar persiste no banco.
- Visitantes não autenticados veem tudo igual, com os overrides aplicados.
- Botão **Sair** no menu quando logado.

## Implementação por etapas

### Etapa 1 — agora, nesta resposta
- Ativar Lovable Cloud.
- Migration: `content_overrides`, `user_roles`, enum `app_role`, função `has_role`, RLS e GRANTs.
- Criar rota `/auth` (login email/senha).
- Criar `_authenticated/route.tsx` (gerenciado pela integração) — usado só para o painel admin.
- Criar `<Editable>`, `useContent`, contexto `EditModeContext`.
- Criar server functions `listOverrides` / `upsertOverride` / `deleteOverride`.
- Integrar botão "Modo Edição" e "Entrar/Sair" no `TopNav`.
- Aplicar `<Editable>` no **hero e títulos principais das 5 páginas** como prova de conceito (uns 20-30 campos).

### Etapa 2 — turnos seguintes (sob demanda)
- Aplicar `<Editable>` em massa nos demais campos. Posso fazer página por página conforme você for usando, ou rodar um script que envolve textos automaticamente. Você me diz por onde começar (sugiro Recomendações, já que é a maior).

### Como criar o primeiro admin
Depois que a Cloud subir, você cria sua conta na tela `/auth` e eu insiro manualmente uma linha em `user_roles` com seu `user_id` e `role='admin'` (te peço o email pra eu localizar).

## Detalhes técnicos

- Server fn `listOverrides` é pública (sem `requireSupabaseAuth`) e usa cliente publishable + policy `TO anon SELECT` — assim o SSR e visitantes anônimos veem os textos editados.
- `upsertOverride` / `deleteOverride` exigem auth + `has_role('admin')`.
- Cada `Editable` precisa de `id` único e estável (`recomendacoes.hero.title`, `ligacoes.modelo.confirmacao.intent`, etc.).
- Valores são texto puro (sem HTML). Se precisar de markdown depois, dá pra adicionar.

## O que NÃO faço nesta etapa
- Não troco a estrutura visual de nenhuma página.
- Não permito cadastro aberto (só admin loga; sem signup público).
- Não envolvo todos os ~500 textos ainda — vou marcando conforme você priorizar.

Confirma que posso começar pela Etapa 1?