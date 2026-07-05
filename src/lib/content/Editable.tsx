import { useState, type ElementType, type ReactNode } from "react";
import { useContent } from "./ContentContext";

type Props = {
  id: string;
  children: string;
  as?: ElementType;
  multiline?: boolean;
  className?: string;
};

/**
 * Wrap any text string with <Editable id="unique.id">text</Editable>.
 * Renders the default text (or the saved override) for everyone.
 * Admins in edit mode see a dashed outline + pencil; click to edit inline.
 */
export function Editable({ id, children, as, multiline, className }: Props) {
  const { get, save, reset, editMode, isAdmin } = useContent();
  const Tag = (as ?? "span") as ElementType;
  const value = get(id, children);
  const overridden = value !== children;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  if (!editMode || !isAdmin) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (!editing) {
    return (
      <Tag
        className={`${className ?? ""} relative inline-block cursor-pointer rounded outline-dashed outline-1 outline-[var(--brand)]/60 outline-offset-2 hover:outline-[var(--brand)] hover:bg-[var(--brand)]/5`}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDraft(value); setEditing(true); }}
        title={`Editar (${id})${overridden ? ", modificado" : ""}`}
      >
        {value}
        <span className="ml-1 text-[10px] align-top">✏️</span>
        {overridden && <span className="ml-0.5 text-[10px] align-top text-[var(--success)]">●</span>}
      </Tag>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try { await save(id, draft); setEditing(false); }
    catch { alert("Erro ao salvar. Verifique se você está logado como admin."); }
    finally { setSaving(false); }
  };
  const handleReset = async () => {
    if (!confirm("Voltar ao texto padrão?")) return;
    setSaving(true);
    try { await reset(id); setDraft(children); setEditing(false); }
    catch { alert("Erro ao resetar."); }
    finally { setSaving(false); }
  };

  return (
    <span className="inline-flex flex-col gap-1 align-top w-full max-w-full">
      {multiline ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={Math.max(3, Math.min(10, draft.split("\n").length + 1))}
          className="w-full min-w-[200px] rounded border-2 border-[var(--brand)] bg-white p-2 text-sm text-[var(--navy)] font-normal"
        />
      ) : (
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-w-[200px] rounded border-2 border-[var(--brand)] bg-white p-2 text-sm text-[var(--navy)] font-normal"
        />
      )}
      <span className="flex flex-wrap gap-1 text-xs">
        <button type="button" disabled={saving} onClick={handleSave}
          className="rounded bg-[var(--success)] px-2 py-1 font-semibold text-white disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" disabled={saving} onClick={() => setEditing(false)}
          className="rounded bg-gray-200 px-2 py-1 font-semibold text-gray-800">
          Cancelar
        </button>
        {overridden && (
          <button type="button" disabled={saving} onClick={handleReset}
            className="rounded bg-red-100 px-2 py-1 font-semibold text-red-700">
            Resetar
          </button>
        )}
        <span className="ml-auto self-center text-[10px] text-gray-500 font-mono">{id}</span>
      </span>
    </span>
  );
}
