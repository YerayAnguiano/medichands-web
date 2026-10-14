import React from 'react';
import { problemCards } from './content';

export const Problem: React.FC = () => {
  return (
    <section id="problema" className="section bg-white border-t border-mh-lavender-light">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender-light px-3 py-1 rounded-full">
            Retos y Evolución
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-mh-gray-900 mt-3 mb-3">
            Obstáculos y Aprendizajes del Proyecto
          </h2>
          <p className="text-sm sm:text-base text-mh-gray-600 leading-relaxed">
            La prevención y detección oportuna en México se enfrentan a diversas barreras. 
            A través de la investigación rigurosa, transformamos cada reto en una solución de ingeniería orientada a las usuarias.
          </p>
        </div>
        
        <div className="grid-3">
          {problemCards.map((card, index) => (
            <div key={index} className="card p-6 bg-white hover:border-mh-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-mh-lavender-light text-mh-primary flex items-center justify-center font-bold text-xs mb-3">
                  0{index + 1}
                </div>
                <h3 className="font-display font-bold text-base text-mh-primary mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-mh-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
