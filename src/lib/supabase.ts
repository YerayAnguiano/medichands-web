import { createClient } from '@supabase/supabase-js';
import type { Post } from '../types';
import { MOCK_POSTS } from '../data/mockPosts';

// Variables de entorno de Supabase (con fallback seguro para entorno local)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('tu-proyecto') &&
  supabaseAnonKey !== 'tu-anon-key-aqui'
);

// Cliente Supabase instanciado (con fallback)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

// Helper para convertir registro de base de datos snake_case a Post camelCase
function mapDbPostToPost(db: any): Post {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    excerpt: db.excerpt,
    content: db.content,
    coverImage: db.cover_image,
    category: db.category,
    authorName: db.author_name,
    authorEmail: db.author_email,
    isTeamAuthor: db.is_team_author,
    readingTimeMinutes: db.reading_time_minutes || 3,
    likesCount: db.likes_count || 0,
    isPublished: db.is_published,
    publishedAt: db.published_at || db.created_at,
  };
}

// 1. Obtener todas las publicaciones
export async function getPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Usando publicaciones locales de respaldo (Supabase no retornó datos o error):', error?.message);
      return MOCK_POSTS;
    }

    return data.map(mapDbPostToPost);
  } catch (err) {
    console.warn('Error conectando a Supabase, usando respaldo local:', err);
    return MOCK_POSTS;
  }
}

// 2. Obtener una publicación por Slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return MOCK_POSTS.find((p) => p.slug === slug) || null;
    }

    return mapDbPostToPost(data);
  } catch {
    return MOCK_POSTS.find((p) => p.slug === slug) || null;
  }
}

// 3. Crear una publicación (Exclusivo administradores autenticados)
export async function createPost(post: Omit<Post, 'id' | 'likesCount'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('posts').insert([
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.coverImage,
        category: post.category,
        author_name: post.authorName,
        author_email: post.authorEmail,
        is_team_author: post.isTeamAuthor,
        reading_time_minutes: post.readingTimeMinutes,
        is_published: post.isPublished !== undefined ? post.isPublished : true,
        published_at: post.publishedAt || new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al crear publicación' };
  }
}

// 4. Actualizar publicación
export async function updatePost(id: string, post: Partial<Post>): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {};
    if (post.title !== undefined) updateData.title = post.title;
    if (post.slug !== undefined) updateData.slug = post.slug;
    if (post.excerpt !== undefined) updateData.excerpt = post.excerpt;
    if (post.content !== undefined) updateData.content = post.content;
    if (post.coverImage !== undefined) updateData.cover_image = post.coverImage;
    if (post.category !== undefined) updateData.category = post.category;
    if (post.authorName !== undefined) updateData.author_name = post.authorName;
    if (post.authorEmail !== undefined) updateData.author_email = post.authorEmail;
    if (post.isTeamAuthor !== undefined) updateData.is_team_author = post.isTeamAuthor;
    if (post.isPublished !== undefined) updateData.is_published = post.isPublished;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase.from('posts').update(updateData).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar publicación' };
  }
}

// 5. Eliminar publicación
export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar publicación' };
  }
}

// 6. Consultar estado en vivo de likes y si el visitante actual ya dio like
export async function getPostLikesStatus(
  postId: string,
  visitorFingerprint: string
): Promise<{ success: boolean; data?: { likes_count: number; has_liked: boolean }; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    const { data, error } = await supabase.rpc('get_post_likes_status', {
      target_post_id: postId,
      visitor_hash: visitorFingerprint,
    });

    if (error) throw error;
    return {
      success: true,
      data: {
        likes_count: Number(data?.likes_count ?? 0),
        has_liked: Boolean(data?.has_liked ?? false),
      },
    };
  } catch (err: any) {
    console.warn('Error consultando get_post_likes_status RPC:', err?.message || err);
    return { success: false, error: err?.message || 'Error en RPC get_post_likes_status' };
  }
}

// 7. Alternar likes atómicamente (Toggle: agregar o retirar like vía RPC PostgreSQL)
export async function togglePostLike(
  postId: string,
  visitorFingerprint: string
): Promise<{ success: boolean; data?: { likes_count: number; has_liked: boolean }; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { data, error } = await supabase.rpc('toggle_like', {
      target_post_id: postId,
      visitor_hash: visitorFingerprint,
    });

    if (error) throw error;
    return {
      success: true,
      data: {
        likes_count: Number(data?.likes_count ?? 0),
        has_liked: Boolean(data?.has_liked ?? false),
      },
    };
  } catch (err: any) {
    console.warn('Error alternando like en Supabase RPC:', err?.message || err);
    return { success: false, error: err?.message || 'Error en RPC toggle_like' };
  }
}

// 8. Incrementar likes atómicamente con huella de visitante (retrocompatibilidad)
export async function incrementPostLike(
  postId: string,
  visitorFingerprint: string
): Promise<{ success: boolean; newLikes?: number; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { data, error } = await supabase.rpc('increment_like', {
      target_post_id: postId,
      visitor_hash: visitorFingerprint,
    });

    if (error) throw error;
    return { success: true, newLikes: data };
  } catch (err: any) {
    console.warn('Error registrando like en Supabase RPC:', err?.message || err);
    return { success: false, error: err?.message || 'Error en RPC increment_like' };
  }
}

// 7. Subir imagen de portada al bucket 'covers' con validación de tipo y tamaño
export async function uploadCoverImage(file: File): Promise<{ url?: string; error?: string }> {
  try {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return { error: 'Formato no admitido. Selecciona una imagen JPG, PNG, WebP o SVG.' };
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return { error: 'El archivo excede el tamaño máximo permitido de 5MB.' };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err: any) {
    return { error: err.message || 'Error al subir la imagen' };
  }
}
