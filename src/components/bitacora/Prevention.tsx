import React from 'react';
import { preventionTopics } from './content';

export const Prevention: React.FC = () => {
  return (
    <section id="educacion" className="section bg-[#fdfafc] border-t border-mh-lavender-light">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender-light px-3 py-1 rounded-full">
            Salud Comunitaria
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-mh-gray-900 mt-3 mb-3">
            Educación y Prevención
          </h2>
          <p className="text-sm sm:text-base text-mh-gray-600 leading-relaxed">
            La información veraz y accesible es la primera línea de cuidado. Consulta fuentes oficiales y guías de salud mamaria.
          </p>
        </div>

        <div className="grid-2">
          {preventionTopics.map((topic, index) => (
            <div key={index} className="card p-6 bg-white border-l-4 border-l-mh-primary flex flex-col justify-between hover:border-mh-primary/50 transition-all">
              <div>
                <h3 className="font-display font-bold text-base text-mh-gray-900 mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-mh-gray-600 leading-relaxed mb-4">
                  {topic.desc}
                </p>
              </div>
              <a
                href={topic.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-mh-primary hover:text-mh-primary-dark transition-colors self-start"
              >
                <span>Leer guía médica oficial</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
