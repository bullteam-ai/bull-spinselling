import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const PAGE_CONTEXT: Record<string, { name: string; modulo: string; foco: string }> = {
  "/": {
    name: "Guia da Ligação",
    modulo: "Agendamento de entrevista via SPIN Selling",
    foco: "Conduzir ligação passo a passo (abertura, situação, problema, implicação, necessidade, agendamento).",
  },
  "/recomendacoes": {
    name: "Recomendações",
    modulo: "Pedido de indicações (REC CL / REC PN) em reuniões",
    foco: "Como pedir indicações no momento certo, quebrar objeções de indicação e gerar 5+ REC CL e 2+ REC PN por EF.",
  },
  "/ligacoes": {
    name: "Ligações",
    modulo: "Roteiro de ligações + treino de objeções",
    foco: "Melhorar abertura, condução, quebra de objeções em ligação de agendamento.",
  },
  "/esquentar": {
    name: "Esquentar Lead",
    modulo: "Aquecimento de lead antes da ligação",
    foco: "Mensagens, gatilhos e sequência para esquentar um lead frio antes de ligar.",
  },
  "/prospeccao": {
    name: "Prospecção",
    modulo: "Geração de leads e abordagem inicial",
    foco: "Volumes, canais, abordagens e metas de prospecção (20+ leads / semana).",
  },
  "/auth": {
    name: "Login",
    modulo: "Autenticação",
    foco: "Usuário na tela de login. Responder apenas dúvidas gerais.",
  },
};

function buildContext(pathname: string): string {
  const key = Object.keys(PAGE_CONTEXT).find(
    (k) => k === pathname || (k !== "/" && pathname.startsWith(k)),
  );
  const info = key ? PAGE_CONTEXT[key] : PAGE_CONTEXT["/"];
  return [
    `Página atual: ${info.name} (${pathname})`,
    `Módulo: ${info.modulo}`,
    `Foco de ajuda nesta tela: ${info.foco}`,
  ].join("\n");
}

export function TrainerContextBridge() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__btTrainerContext = buildContext(pathname);
  }, [pathname]);

  return null;
}