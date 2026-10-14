import React, { useState } from 'react';
import { LikeButton } from './LikeButton';
import { ShareModal } from '../common/ShareModal';
import { Share2 } from 'lucide-react';

interface PostActionsProps {
  postId: string;
  initialLikes: number;
  title: string;
  url: string;
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  initialLikes,
  title,
  url,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-4 border-y border-mh-lavender-light my-8">
        {/* Botón de Like */}
        <div className="flex items-center gap-3">
          <LikeButton postId={postId} initialLikes={initialLikes} />
        </div>

        {/* Botón de Compartir */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-mh-primary bg-mh-lavender-light hover:bg-mh-lavender transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir</span>
        </button>
      </div>

      {/* Modal de Compartir Accesible */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={title}
        url={url}
      />
    </>
  );
};
