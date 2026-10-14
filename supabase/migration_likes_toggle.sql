-- ==============================================================================
-- MIGRACIÓN: FUNCIONES RPC PARA LIKES BIDIRECCIONALES Y ESTADO EN TIEMPO REAL
-- MedicHands Web — Ejecutar en Supabase SQL Editor
-- ==============================================================================

-- 1. Función para consultar el conteo en tiempo real y si el visitante ya dio like
CREATE OR REPLACE FUNCTION public.get_post_likes_status(
    target_post_id UUID,
    visitor_hash TEXT
)
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

-- 2. Función para alternar like (Toggle bidireccional atómico ACID)
CREATE OR REPLACE FUNCTION public.toggle_like(
    target_post_id UUID,
    visitor_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_liked BOOLEAN;
    new_likes INTEGER;
BEGIN
    -- Comprobar si el visitante ya dio like
    SELECT EXISTS (
        SELECT 1 FROM public.post_likes
        WHERE post_id = target_post_id AND visitor_fingerprint = visitor_hash
    ) INTO is_liked;

    IF is_liked THEN
        -- Retirar like: eliminar de post_likes y decrementar contador
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
        -- Agregar like: insertar en post_likes e incrementar contador
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
