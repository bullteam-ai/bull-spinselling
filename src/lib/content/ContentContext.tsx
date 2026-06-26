import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

type OverridesMap = Record<string, string>;

type ContentContextValue = {
  session: Session | null;
  isAdmin: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  get: (id: string, fallback: string) => string;
  save: (id: string, value: string) => Promise<void>;
  reset: (id: string) => Promise<void>;
  loading: boolean;
  signOut: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<OverridesMap>({});
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load overrides once (anyone, including anon, can read)
  const loadOverrides = useCallback(async () => {
    const { data, error } = await supabase
      .from("content_overrides")
      .select("field_id, value");
    if (error) {
      console.error("[content] load error", error);
      return;
    }
    const map: OverridesMap = {};
    for (const row of data ?? []) map[row.field_id] = row.value;
    setOverrides(map);
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Initial session + overrides
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(data.session ?? null);
      await loadOverrides();
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null);
      if (!s) setEditMode(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadOverrides]);

  // Check admin role whenever session changes
  useEffect(() => {
    if (!session?.user) { setIsAdmin(false); return; }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      if (error) { console.error("[content] role error", error); setIsAdmin(false); return; }
      setIsAdmin(!!data);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const toggleEditMode = useCallback(() => {
    if (!isAdmin) return;
    setEditMode((v) => !v);
  }, [isAdmin]);

  const get = useCallback(
    (id: string, fallback: string) => (overrides[id] ?? fallback),
    [overrides],
  );

  const save = useCallback(async (id: string, value: string) => {
    const { error } = await supabase
      .from("content_overrides")
      .upsert({ field_id: id, value, updated_by: session?.user?.id ?? null, updated_at: new Date().toISOString() });
    if (error) { console.error("[content] save error", error); throw error; }
    setOverrides((m) => ({ ...m, [id]: value }));
  }, [session]);

  const reset = useCallback(async (id: string) => {
    const { error } = await supabase.from("content_overrides").delete().eq("field_id", id);
    if (error) { console.error("[content] reset error", error); throw error; }
    setOverrides((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setEditMode(false);
  }, []);

  return (
    <ContentContext.Provider value={{ session, isAdmin, editMode, toggleEditMode, get, save, reset, loading, signOut }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
