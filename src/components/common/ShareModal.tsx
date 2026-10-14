import React, { useState, useEffect } from 'react';
import { Copy, Check, Facebook, Twitter, Instagram, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400,noopener,noreferrer'
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' — MedicHands')}`,
      '_blank',
      'width=600,height=400,noopener,noreferrer'
    );
  };

  const shareInstagram = () => {
    handleCopy();
    window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
    >
      <div className="bg-[#FEFEFE] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-mh-lavender relative">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-mh-gray-500 hover:text-mh-primary hover:bg-mh-lavender-light rounded-full transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="share-title" className="text-xl font-display font-bold text-mh-gray-900 mb-1">
          Compartir publicación
        </h3>
        <p className="text-sm text-mh-gray-500 mb-6 line-clamp-1">
          {title}
        </p>

        {/* Redes y Opciones */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Facebook */}
          <button
            onClick={shareFacebook}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-mh-lavender-light bg-mh-lavender-light/30 hover:bg-mh-lavender-light hover:border-mh-lavender transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] mb-1.5 group-hover:scale-110 transition-transform">
              <Facebook className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-mh-gray-700">Facebook</span>
          </button>

          {/* X / Twitter */}
          <button
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-mh-lavender-light bg-mh-lavender-light/30 hover:bg-mh-lavender-light hover:border-mh-lavender transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-black mb-1.5 group-hover:scale-110 transition-transform">
              <Twitter className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-mh-gray-700">X (Twitter)</span>
          </button>

          {/* Instagram */}
          <button
            onClick={shareInstagram}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-mh-lavender-light bg-mh-lavender-light/30 hover:bg-mh-lavender-light hover:border-mh-lavender transition-all group"
            title="Copia el enlace y abre Instagram"
          >
            <div className="w-10 h-10 rounded-full bg-[#E4405F]/10 flex items-center justify-center text-[#E4405F] mb-1.5 group-hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-mh-gray-700">Instagram</span>
          </button>
        </div>

        {/* Copiar enlace directo */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-500 mb-1.5">
            Enlace directo
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-mh-gray-100 border border-mh-gray-200">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-mh-gray-700 flex-1 outline-none px-1 select-all"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-mh-primary text-mh-white px-3 py-1.5 rounded-lg hover:bg-mh-primary-dark transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-mh-lavender" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] font-semibold text-mh-primary mt-1.5 animate-fadeIn">
              ¡Enlace copiado al portapapeles!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
