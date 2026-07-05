import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const PAGE_CONTEXT: Record<
  string,
  { name: string; modulo: string; foco: string; prompts: string[] }
> = {
  "/": {
    name: "Guia da Ligação",
    modulo: "Agendamento de entrevista via SPIN Selling",
    foco: "Conduzir ligação passo a passo (abertura, situação, problema, implicação, necessidade, agendamento).",
    prompts: [
      "Explique a etapa atual do SPIN em que estou",
      "Me dê 3 exemplos de pergunta de implicação",
      "Como fazer a transição para agendamento?",
      "Simular um cliente para essa etapa",
    ],
  },
  "/recomendacoes": {
    name: "Recomendações",
    modulo: "Pedido de indicações (REC CL / REC PN) em reuniões",
    foco: "Como pedir indicações no momento certo, quebrar objeções de indicação e gerar 5+ REC CL e 2+ REC PN por EF.",
    prompts: [
      "Melhor momento para pedir indicação na EF",
      "Script para pedir 5 REC CL sem soar forçado",
      "Como pedir REC PN (profissional) de forma natural",
      "Cliente disse 'não tenho ninguém pra indicar', o que respondo?",
    ],
  },
  "/ligacoes": {
    name: "Ligações",
    modulo: "Roteiro de ligações + treino de objeções",
    foco: "Melhorar abertura, condução, quebra de objeções em ligação de agendamento.",
    prompts: [
      "Simular uma ligação difícil agora",
      "Como responder 'me manda por WhatsApp'?",
      "Melhorar minha abertura de ligação",
      "Quebrar objeção 'estou sem tempo'",
    ],
  },
  "/esquentar": {
    name: "Esquentar Lead",
    modulo: "Aquecimento de lead antes da ligação",
    foco: "Mensagens, gatilhos e sequência para esquentar um lead frio antes de ligar.",
    prompts: [
      "Sequência de 3 mensagens para esquentar um lead frio",
      "Primeira mensagem no WhatsApp após conexão",
      "Como reagir se o lead só reagir com emoji",
      "Gatilho para gerar curiosidade antes da ligação",
    ],
  },
  "/prospeccao": {
    name: "Prospecção",
    modulo: "Geração de leads e abordagem inicial",
    foco: "Volumes, canais, abordagens e metas de prospecção (20+ leads / semana).",
    prompts: [
      "Como bater 20 leads por semana",
      "Melhores canais de prospecção para hunter iniciante",
      "Abordagem inicial no LinkedIn / Instagram",
      "Como qualificar rápido se o lead vale entrevista",
    ],
  },
  "/auth": {
    name: "Login",
    modulo: "Autenticação",
    foco: "Usuário na tela de login. Responder apenas dúvidas gerais.",
    prompts: [],
  },
};

function resolveInfo(pathname: string) {
  const key = Object.keys(PAGE_CONTEXT).find(
    (k) => k === pathname || (k !== "/" && pathname.startsWith(k)),
  );
  return key ? PAGE_CONTEXT[key] : PAGE_CONTEXT["/"];
}

function buildContext(pathname: string): string {
  const info = resolveInfo(pathname);
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
    window.__btTrainerPrompts = resolveInfo(pathname).prompts;
    window.dispatchEvent(new CustomEvent("bt:trainer-context-change"));
  }, [pathname]);

  return null;
}