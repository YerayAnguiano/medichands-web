-- ==============================================================================
-- MEDICHANDS WEB — ESQUEMA DE BASE DE DATOS (POSTGRESQL / SUPABASE)
-- Políticas RLS estrictas para los 3 administradores y acceso público de lectura.
-- ==============================================================================

-- 1. EXTENSIÓN PARA UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PUBLICACIONES (POSTS)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    is_team_author BOOLEAN NOT NULL DEFAULT false,
    reading_time_minutes INTEGER NOT NULL DEFAULT 3,
    likes_count INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas rápidas y filtros
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes ON public.posts (likes_count DESC);

-- 3. TABLA DE LIKES PERSISTENTES
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
    visitor_fingerprint TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_post_visitor_like UNIQUE (post_id, visitor_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes (post_id);

-- 4. FUNCIONES ATÓMICAS DE LIKES (ACID)
CREATE OR REPLACE FUNCTION public.increment_like(target_post_id UUID, visitor_hash TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_likes INTEGER;
BEGIN
    -- Intentar insertar el like único
    INSERT INTO public.post_likes (post_id, visitor_fingerprint)
    VALUES (target_post_id, visitor_hash)
    ON CONFLICT (post_id, visitor_fingerprint) DO NOTHING;

    -- Si se insertó exitosamente, actualizar el contador atómicamente
    IF FOUND THEN
        UPDATE public.posts
        SET likes_count = likes_count + 1
        WHERE id = target_post_id
        RETURNING likes_count INTO new_likes;
    ELSE
        SELECT likes_count INTO new_likes
        FROM public.posts
        WHERE id = target_post_id;
    END IF;

    RETURN new_likes;
END;
$$;

-- Consultar estado en vivo y si el visitante ya dio like
CREATE OR REPLACE FUNCTION public.get_post_likes_status(target_post_id UUID, visitor_hash TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_likes INTEGER;
    is_liked BOOLEAN;
BEGIN
    SELECT likes_count INTO current_likes
    FROM public.posts
    WHERE id = target_post_id;

    SELECT EXISTS (
        SELECT 1 FROM public.post_likes
        WHERE post_id = target_post_id AND visitor_fingerprint = visitor_hash
    ) INTO is_liked;

    RETURN jsonb_build_object(
        'likes_count', COALESCE(current_likes, 0),
        'has_liked', COALESCE(is_liked, false)
    );
END;
$$;

-- Alternar like (Toggle bidireccional atómico ACID)
CREATE OR REPLACE FUNCTION public.toggle_like(target_post_id UUID, visitor_hash TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_liked BOOLEAN;
    new_likes INTEGER;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.post_likes
        WHERE post_id = target_post_id AND visitor_fingerprint = visitor_hash
    ) INTO is_liked;

    IF is_liked THEN
        DELETE FROM public.post_likes
        WHERE post_id = target_post_id AND visitor_fingerprint = visitor_hash;

        UPDATE public.posts
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = target_post_id
        RETURNING likes_count INTO new_likes;

        RETURN jsonb_build_object(
            'likes_count', new_likes,
            'has_liked', false
        );
    ELSE
        INSERT INTO public.post_likes (post_id, visitor_fingerprint)
        VALUES (target_post_id, visitor_hash)
        ON CONFLICT (post_id, visitor_fingerprint) DO NOTHING;

        UPDATE public.posts
        SET likes_count = likes_count + 1
        WHERE id = target_post_id
        RETURNING likes_count INTO new_likes;

        RETURN jsonb_build_object(
            'likes_count', new_likes,
            'has_liked', true
        );
    END IF;
END;
$$;

-- 5. SEGURIDAD: ROW LEVEL SECURITY (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Lista blanca de los 3 correos administradores oficiales
-- (yerayanguiano@gmail.com, citlallisarar@gmail.com y tercer admin autorizado)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() ->> 'email') IN (
    'yerayanguiano@gmail.com',
    'citlallisarar@gmail.com',
    'efrainarias@gmail.com' -- Efraín Alejandro Arias Meza
  );
$$;

-- Política de lectura de publicaciones: Público puede leer las publicadas
CREATE POLICY "Public read posts"
ON public.posts
FOR SELECT
TO public
USING (is_published = true OR public.is_admin_user());

-- Políticas de escritura en publicaciones: Exclusivas para los 3 admins
CREATE POLICY "Admin insert posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (public.is_admin_user());

-- Políticas de likes: Lectura e inserción pública
CREATE POLICY "Public read likes"
ON public.post_likes
FOR SELECT
TO public
USING (true);

CREATE POLICY "Public insert likes"
ON public.post_likes
FOR INSERT
TO public
WITH CHECK (true);

-- 6. CONFIGURACIÓN DEL STORAGE BUCKET PARA PORTADAS
-- Nota: En Supabase Dashboard -> Storage, crear un bucket llamado 'covers' público.
-- Script de políticas de Storage (si se aplica vía SQL):
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');

CREATE POLICY "Admin upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers' AND public.is_admin_user());

CREATE POLICY "Admin delete covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers' AND public.is_admin_user());
