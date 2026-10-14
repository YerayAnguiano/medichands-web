import React from 'react';
import { imagenes } from './content';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="section hero bg-gradient-to-b from-[#fbf4f9] to-white">
      <div className="container grid-2" style={{ alignItems: 'center' }}>
        <div className="hero-text">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender-light mb-3">
            Bitácora de Investigación
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-mh-gray-900 leading-tight mb-4">
            Tecnología que acompaña el cuidado de tu salud mamaria
          </h1>
          <p className="text-base sm:text-lg text-mh-gray-700 leading-relaxed mb-6">
            MedicHands es una herramienta de apoyo biomecánica y tecnológica diseñada para ayudar a identificar 
            posibles asimetrías térmicas precoces, promoviendo la prevención activa y la derivación médica oportuna.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#nosotros" className="btn btn-primary">
              La historia de MedicHands
            </a>
            <a href="#difusion" className="btn btn-secondary">
              Ver impacto y difusión
            </a>
          </div>
        </div>
        
        <div className="hero-visual flex items-center justify-center p-4">
          <img 
            src={imagenes[0].img} 
            alt={imagenes[0].desc} 
            title={imagenes[0].title}
            className="w-full max-w-sm h-auto object-contain drop-shadow-md rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};
