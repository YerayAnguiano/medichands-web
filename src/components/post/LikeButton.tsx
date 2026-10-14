import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { togglePostLike, getPostLikesStatus } from '../../lib/supabase';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

// Obtener o generar identificador persistente anónimo del visitante
function getVisitorFingerprint(): string {
  try {
    let fp = localStorage.getItem('mh_visitor_fp');
    if (!fp) {
      fp = 'fp_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('mh_visitor_fp', fp);
    }
    return fp;
  } catch {
    return 'anon_guest_' + Date.now();
  }
}

export const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // 1. Inicialización inmediata desde localStorage para evitar saltos visuales
    try {
      const stored = localStorage.getItem(`mh_like_${postId}`);
      if (stored === 'true') {
        setHasLiked(true);
      }
    } catch {
      // Ignorar errores en modo incógnito/restringido
    }

    // 2. Sincronización en vivo con Supabase (reconcilia el conteo real y estado del visitante)
    let isMounted = true;
    const syncStatus = async () => {
      const fingerprint = getVisitorFingerprint();
      const res = await getPostLikesStatus(postId, fingerprint);
      if (isMounted && res.success && res.data) {
        setLikes(res.data.likes_count);
        setHasLiked(res.data.has_liked);
        try {
          if (res.data.has_liked) {
            localStorage.setItem(`mh_like_${postId}`, 'true');
          } else {
            localStorage.removeItem(`mh_like_${postId}`);
          }
        } catch {}
      }
    };

    syncStatus();

    return () => {
      isMounted = false;
    };
  }, [postId, initialLikes]);

  const handleToggleLike = async () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);

    const willLike = !hasLiked;

    // Actualización optimista inmediata en la UI
    setHasLiked(willLike);
    setLikes((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (willLike) {
        localStorage.setItem(`mh_like_${postId}`, 'true');
      } else {
        localStorage.removeItem(`mh_like_${postId}`);
      }
    } catch {}

    // Llamada atómica a Supabase RPC toggle_like
    const fingerprint = getVisitorFingerprint();
    const res = await togglePostLike(postId, fingerprint);

    if (res.success && res.data) {
      // Reconciliación con la base de datos authoritative
      setLikes(res.data.likes_count);
      setHasLiked(res.data.has_liked);
      try {
        if (res.data.has_liked) {
          localStorage.setItem(`mh_like_${postId}`, 'true');
        } else {
          localStorage.removeItem(`mh_like_${postId}`);
        }
      } catch {}
    } else {
      // Revertir en caso de falla de red
      setHasLiked(!willLike);
      setLikes((prev) => (!willLike ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
        hasLiked
          ? 'bg-mh-lavender text-mh-primary border border-mh-primary'
          : 'bg-[#FEFEFE] text-mh-gray-700 border border-mh-lavender-light hover:border-mh-lavender hover:bg-mh-lavender-light/40'
      }`}
      aria-label={hasLiked ? 'Quitar Me gusta' : 'Dar Me gusta'}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${
          hasLiked ? 'fill-current text-mh-primary scale-110' : 'text-mh-gray-500'
        } ${animating ? 'scale-125' : ''}`}
      />
      <span>{likes}</span>
      <span className="hidden sm:inline font-normal text-mh-gray-500">
        {likes === 1 ? 'Me gusta' : 'Me gusta'}
      </span>
    </button>
  );
};

