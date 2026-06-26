
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Content overrides (chave/valor por campo)
CREATE TABLE public.content_overrides (
  field_id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.content_overrides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_overrides TO authenticated;
GRANT ALL ON public.content_overrides TO service_role;

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

-- Todos (incluindo anon) podem ler — os textos aparecem para qualquer visitante
CREATE POLICY "Anyone can read overrides" ON public.content_overrides
  FOR SELECT TO anon, authenticated
  USING (true);

-- Apenas admins podem escrever
CREATE POLICY "Admins can insert overrides" ON public.content_overrides
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update overrides" ON public.content_overrides
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete overrides" ON public.content_overrides
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
