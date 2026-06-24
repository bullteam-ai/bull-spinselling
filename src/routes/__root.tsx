import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { JOURNEY, type JourneyItem } from "./recomendacoes";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bull Team | Agendamento de Entrevista" },
      { name: "description", content: "Guia visual de condução de entrevistas com metodologia SPIN Selling para consultores Bull Team." },
      { name: "author", content: "Bull Team" },
      { property: "og:title", content: "Bull Team | Agendamento de Entrevista" },
      { property: "og:description", content: "Guia visual de condução de entrevistas com metodologia SPIN Selling para consultores Bull Team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@BullTeam" },
      { name: "twitter:title", content: "Bull Team | Agendamento de Entrevista" },
      { name: "twitter:description", content: "Guia visual de condução de entrevistas com metodologia SPIN Selling para consultores Bull Team." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bf4feb22-bdc1-42f0-b67b-0b21c6979e85/id-preview-3dd0646e--47053e90-1c99-49d5-8629-06ae87ce9173.lovable.app-1781755868874.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bf4feb22-bdc1-42f0-b67b-0b21c6979e85/id-preview-3dd0646e--47053e90-1c99-49d5-8629-06ae87ce9173.lovable.app-1781755868874.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TopNav />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const goToAnchor = (item: JourneyItem) => {
    setOpen(false);
    const currentPath = router.state.location.pathname;
    if (currentPath === "/recomendacoes") {
      // mesma página: atualizar hash dispara handler interno
      if (window.location.hash === `#${item.id}`) {
        // forçar re-trigger
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      } else {
        window.location.hash = item.id;
      }
    } else {
      router.navigate({ to: "/recomendacoes", hash: item.id });
    }
  };

  const grouped = {
    execucao: JOURNEY.filter((i) => i.tab === "execucao"),
    treino:   JOURNEY.filter((i) => i.tab === "treino"),
  };

  return (
    <div className="sticky top-0 z-[60] w-full border-b border-white/10 bg-[var(--navy)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--navy)]/80 text-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 h-12 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-white hover:text-[var(--success)] transition"
        >
          <span aria-hidden>🐂</span>
          <span className="hidden sm:inline">Bull Team</span>
        </Link>

        <span className="hidden sm:block h-5 w-px bg-white/15" aria-hidden />

        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "text-white bg-white/10" }}
          inactiveProps={{ className: "text-white/70 hover:text-white" }}
          className="rounded-md px-2.5 py-1.5 text-xs font-semibold transition"
        >
          Guia da Ligação
        </Link>

        <Link
          to="/recomendacoes"
          activeProps={{ className: "text-white bg-white/10" }}
          inactiveProps={{ className: "text-white/70 hover:text-white" }}
          className="rounded-md px-2.5 py-1.5 text-xs font-semibold transition"
        >
          Recomendações
        </Link>

        <Link
          to="/ligacoes"
          activeProps={{ className: "text-white bg-white/10" }}
          inactiveProps={{ className: "text-white/70 hover:text-white" }}
          className="rounded-md px-2.5 py-1.5 text-xs font-semibold transition"
        >
          Ligações
        </Link>

        <div ref={ref} className="relative ml-auto">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/40 bg-[var(--success)]/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--success)]/25 transition"
          >
            <span aria-hidden>🎯</span>
            <span className="hidden sm:inline">Passo a Passo de Recomendações</span>
            <span className="sm:hidden">Passo a Passo</span>
            <svg
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              viewBox="0 0 20 20" fill="currentColor" aria-hidden
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-[min(92vw,28rem)] max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-white text-[var(--navy)] shadow-2xl ring-1 ring-black/5"
            >
              <DropdownGroup
                label="Execução"
                accent="var(--success)"
                items={grouped.execucao}
                onPick={goToAnchor}
              />
              <div className="border-t border-border" />
              <DropdownGroup
                label="Treinamento Elite"
                accent="var(--brand)"
                items={grouped.treino}
                onPick={goToAnchor}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DropdownGroup({
  label, accent, items, onPick,
}: {
  label: string;
  accent: string;
  items: JourneyItem[];
  onPick: (item: JourneyItem) => void;
}) {
  return (
    <div className="py-2">
      <div className="px-4 pt-1 pb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden />
        <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: accent }}>
          {label}
        </p>
      </div>
      <ul className="px-2 pb-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              role="menuitem"
              onClick={() => onPick(item)}
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--surface)] hover:text-[var(--brand)] transition flex items-center gap-2"
            >
              <span
                className="inline-block h-1 w-1 rounded-full opacity-60"
                style={{ background: accent }}
                aria-hidden
              />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
