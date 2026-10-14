import React, { useState, useMemo, useEffect } from 'react';
import type { Post, PostFilter } from '../../types';
import { Search, Flame, Clock, Heart, ArrowRight } from 'lucide-react';
import { getPosts } from '../../lib/supabase';

interface PostFeedProps {
  posts: Post[];
}

export const PostFeed: React.FC<PostFeedProps> = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<PostFilter>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Sincronización en vivo con Supabase en el navegador
  useEffect(() => {
    let isMounted = true;
    const syncLivePosts = async () => {
      const live = await getPosts();
      if (isMounted) {
        setPosts(live);
      }
    };
    syncLivePosts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado y ordenamiento dinámico
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Búsqueda por texto (título, extracto o autor)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q)
      );
    }

    // Ordenamiento
    if (filter === 'recent') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (filter === 'popular') {
      result.sort((a, b) => b.likesCount - a.likesCount);
    }

    return result;
  }, [posts, filter, searchQuery]);

  return (
    <div id="feed-section" className="space-y-6">
      
      {/* Barra de Filtros y Buscador en Vivo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-mh-lavender-light">
        {/* Pestañas de Filtro estilo Substack */}
        <div className="flex items-center gap-1.5 p-1 bg-mh-lavender-light/50 rounded-xl border border-mh-lavender self-start sm:self-auto">
          <button
            onClick={() => setFilter('recent')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'recent'
                ? 'bg-mh-primary text-mh-white shadow-sm'
                : 'text-mh-gray-700 hover:text-mh-primary hover:bg-mh-lavender-light'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Más recientes</span>
          </button>
          <button
            onClick={() => setFilter('popular')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'popular'
                ? 'bg-mh-primary text-mh-white shadow-sm'
                : 'text-mh-gray-700 hover:text-mh-primary hover:bg-mh-lavender-light'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Más populares</span>
          </button>
        </div>

        {/* Input de Búsqueda */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-mh-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o tema..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-mh-lavender-light/40 border border-mh-lavender rounded-xl text-mh-gray-900 placeholder:text-mh-gray-500 focus:outline-none focus:border-mh-primary focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-mh-gray-500 hover:text-mh-primary font-bold"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Conteo de resultados */}
      <div className="flex items-center justify-between text-xs text-mh-gray-500">
        <span>
          Mostrando {filteredPosts.length} {filteredPosts.length === 1 ? 'publicación' : 'publicaciones'}
        </span>
        {searchQuery && (
          <span className="font-medium text-mh-primary">
            Filtrado por: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Listado de Tarjetas */}
      {filteredPosts.length > 0 ? (
        <div className="divide-y divide-mh-lavender-light">
          {filteredPosts.map((post) => {
            const dateStr = new Date(post.publishedAt).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={post.id}
                className="py-6 first:pt-0 group flex flex-col sm:flex-row items-start justify-between gap-4 transition-all"
              >
                {/* Información textual */}
                <div className="flex-1 min-w-0 pr-0 sm:pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender-light px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-mh-gray-500">· {dateStr}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-mh-gray-900 group-hover:text-mh-primary transition-colors leading-snug mb-2">
                    <a href={`/post/${post.slug}`}>
                      {post.title}
                    </a>
                  </h3>

                  <p className="text-xs sm:text-sm text-mh-gray-700 leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-mh-gray-500">
                    <span className="font-semibold text-mh-gray-700">{post.authorName}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-mh-primary">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      {post.likesCount}
                    </span>
                    <span>·</span>
                    <span>{post.readingTimeMinutes} min</span>
                  </div>
                </div>

                {/* Thumbnail */}
                <a
                  href={`/post/${post.slug}`}
                  className="w-full sm:w-40 sm:h-28 aspect-video sm:aspect-auto flex-shrink-0 rounded-xl overflow-hidden bg-mh-lavender-light relative border border-mh-lavender-light group-hover:border-mh-lavender transition-all"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </a>
              </article>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío */
        <div className="py-16 text-center rounded-2xl border border-dashed border-mh-lavender bg-mh-lavender-light/20 p-8">
          <div className="w-12 h-12 rounded-full bg-mh-lavender flex items-center justify-center text-mh-primary mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-mh-gray-900 mb-1">
            No se encontraron publicaciones
          </h4>
          <p className="text-xs text-mh-gray-500 max-w-sm mx-auto mb-4">
            No hay resultados que coincidan con "{searchQuery}". Intenta buscar con otros términos como "sensores", "copas" o "precisión".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-mh-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Ver todas las publicaciones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
