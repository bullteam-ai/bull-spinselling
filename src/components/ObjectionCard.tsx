import { useState } from "react";
import { AlertTriangle, ChevronDown, ClipboardCopy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import {
  CATEGORY_STYLE,
  type ObjectionItem,
  type ObjectionCategory,
} from "@/data/objecoes";

export function ObjectionCard({ o }: { o: ObjectionItem }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const cat = (o.categoria as ObjectionCategory | undefined) ?? undefined;
  const style = cat ? CATEGORY_STYLE[cat] : null;

  const doCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = [
      o.resposta,
      o.escalada ? `\n\nEscalada: ${o.escalada}` : "",
    ].join("");
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--warn)]/15 text-[var(--warn)]">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--danger)]">
              Objeção
            </p>
            {cat && style ? (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: style.bg, color: style.color }}
              >
                {cat}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-base sm:text-lg font-bold italic text-[var(--navy)] leading-snug">
            “{o.q}”
          </p>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="border-t border-border bg-[var(--surface)] px-4 sm:px-5 py-4 space-y-4">
          {o.intencao ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Intenção por trás
              </p>
              <p className="mt-1 text-sm text-[var(--navy)]/80 leading-relaxed">
                {o.intencao}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
              Resposta base
            </p>
            <blockquote className="fala-script mt-1.5">“{o.resposta}”</blockquote>
          </div>

          {o.escalada ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--warn)]">
                Escalada
              </p>
              <blockquote className="fala-script mt-1.5">“{o.escalada}”</blockquote>
            </div>
          ) : null}

          <button
            type="button"
            onClick={doCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-[var(--navy)] hover:bg-[var(--surface)]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[var(--success)]" /> Copiado
              </>
            ) : (
              <>
                <ClipboardCopy className="h-4 w-4" /> Copiar resposta
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}