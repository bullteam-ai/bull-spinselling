import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login | Bull Team" },
      { name: "description", content: "Acesso restrito ao painel de edição da Bull Team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // If already logged in, bounce home
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.invalidate();
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setInfo("Conta criada. Peça ao gestor para liberar permissão de admin.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-[var(--navy)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-[var(--navy)] mb-1">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Acesso ao painel de edição dos scripts.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-green-700">{info}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[var(--brand)] py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50">
            {loading ? "Carregando..." : (mode === "signin" ? "Entrar" : "Criar conta")}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600">
          {mode === "signin" ? (
            <>Não tem conta?{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-bold text-[var(--brand)]">
                Criar conta
              </button>
            </>
          ) : (
            <>Já tem conta?{" "}
              <button type="button" onClick={() => setMode("signin")} className="font-bold text-[var(--brand)]">
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
