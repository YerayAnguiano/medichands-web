import React from 'react';
import { difusionItems } from './content';

export const Diffusion: React.FC = () => {
  return (
    <section id="difusion" className="section bg-white border-t border-mh-lavender-light">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender-light px-3 py-1 rounded-full">
            Divulgación Institucional
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-mh-gray-900 mt-3 mb-3">
            Impacto, Publicaciones y Medios
          </h2>
          <p className="text-sm sm:text-base text-mh-gray-600 leading-relaxed">
            MedicHands ha trascendido las aulas universitarias, validando su metodología científica en congresos internacionales y compartiendo sus avances con la comunidad.
          </p>
        </div>
        
        <div className="grid-2">
          {difusionItems.map((item, index) => (
            <div key={index} className="card p-6 bg-white flex flex-col justify-between hover:border-mh-primary/50 transition-all">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-mh-secondary bg-mh-lavender-light px-2.5 py-0.5 rounded mb-3">
                  {item.type}
                </span>
                <h3 className="font-display font-bold text-base text-mh-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-mh-gray-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              {item.link && item.link !== '#' ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-mh-primary hover:text-mh-primary-dark transition-colors self-start mt-2"
                >
                  <span>{item.linkText}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <span className="text-xs font-semibold text-mh-gray-500 self-start mt-2">
                  Paper Oficial CITCA 2026
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
