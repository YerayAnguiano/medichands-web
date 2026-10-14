import React from 'react';
import { team } from './content';

export const About: React.FC = () => {
  return (
    <section id="nosotros" className="section bg-[#fdfafc] border-t border-mh-lavender-light">
      <div className="container">

        {/* Encabezado de la sección */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender-light px-3 py-1 rounded-full">
            Memoria Histórica
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-mh-gray-900 mt-3 mb-3">
            Nuestra Historia
          </h2>
          <p className="text-sm sm:text-base text-mh-gray-600 leading-relaxed">
            De una inquietud en las aulas universitarias a una misión de vida por el bienestar, la accesibilidad y la prevención médica oportuna.
          </p>
        </div>

        {/* Timeline / Hitos */}
        <div className="max-w-3xl mx-auto mb-16 flex flex-col gap-6">

          <div className="card border-l-4 border-l-mh-primary p-6 bg-white shadow-sm">
            <span className="text-[11px] font-bold text-mh-primary uppercase tracking-wider">Hito 1 · Diciembre 2016</span>
            <h3 className="text-lg font-display font-bold text-mh-gray-900 mt-1 mb-2">
              El Legado y la Inspiración Científica
            </h3>
            <p className="text-sm text-mh-gray-700 leading-relaxed">
              El 1 de diciembre de 2016, el <strong>Dr. Jesús Alberto Verduzco Ramírez</strong> publicó el artículo 
              <em> "Sistema de monitoreo de temperatura de los senos humanos en la detección temprana del cáncer de seno"</em> en la revista 
              RICS (Iberoamericana de las Ciencias de la Salud). Esta investigación propuso detectar variaciones térmicas mamarias causadas 
              por la <strong>neoangiogénesis</strong> (mayor vascularización tumoral). En 2026, el Dr. Verduzco nos invitó a revivir y evolucionar esta visión hacia un dispositivo <em>wearable</em> ergonómico y moderno.
            </p>
          </div>

          <div className="card border-l-4 border-l-mh-secondary p-6 bg-white shadow-sm">
            <span className="text-[11px] font-bold text-mh-secondary uppercase tracking-wider">Hito 2 · Sexto Semestre FIME</span>
            <h3 className="text-lg font-display font-bold text-mh-gray-900 mt-1 mb-2">
              El Impulso Académico y la Mentoría
            </h3>
            <p className="text-sm text-mh-gray-700 leading-relaxed">
              Cursando el sexto semestre en la Universidad de Colima, decidimos trabajar conjuntamente en la clase del <strong>Dr. Walter Alexander Mata López</strong>, quien fomentó la redacción y envío de artículos de investigación a congresos de Ciencias Aplicadas. Con la mentoría de ambos doctores, consolidamos la arquitectura asíncrona de software y la lógica explicable de triaje.
            </p>
          </div>

          <div className="card border-l-4 border-l-mh-primary p-6 bg-white shadow-sm">
            <span className="text-[11px] font-bold text-mh-primary uppercase tracking-wider">Hito 3 · CITCA 2026</span>
            <h3 className="text-lg font-display font-bold text-mh-gray-900 mt-1 mb-2">
              Validación Científica en el Congreso CITCA
            </h3>
            <p className="text-sm text-mh-gray-700 leading-relaxed">
              Nuestro esfuerzo rindió frutos al ser aceptados y publicar en el <strong>6to Congreso Internacional de Tecnología y Ciencia Aplicada (CITCA)</strong>. Validamos que la detección de asimetrías térmicas contralaterales superiores a <strong>0.8°C</strong> es un indicador robusto para un tamizaje preliminar no invasivo, alcanzando un <strong>94.2% de precisión técnica</strong> en nuestra regla de software sobre datos sintéticos.
            </p>
          </div>

          <div className="card border-l-4 border-l-mh-secondary p-6 bg-white shadow-sm">
            <span className="text-[11px] font-bold text-mh-secondary uppercase tracking-wider">Hito 4 · Presente y Futuro</span>
            <h3 className="text-lg font-display font-bold text-mh-gray-900 mt-1 mb-2">
              Evolución hacia Copas TPU 3D y Biometría MAX30205
            </h3>
            <p className="text-sm text-mh-gray-700 leading-relaxed">
              Al avanzar hacia la implementación física, descubrimos que los textiles tradicionales requerían confección a medida y no garantizaban repetibilidad. Decidimos migrar hacia <strong>copas anatómicas de TPU 95A impresas en 3D</strong> y sensores clínicos <strong>MAX30205</strong> (Maxim Integrated, precisión de ±0.1°C), logrando un kit lavable, reutilizable y adaptable a cualquier sostén.
            </p>
          </div>

        </div>

        {/* Sección del Equipo con Fotos Reales */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-display font-bold text-center text-mh-gray-900 mb-8">
            El Equipo Detrás de MedicHands
          </h3>
          <div className="grid-3">
            {team.map((member, index) => (
              <div key={index} className="card text-center p-6 bg-white hover:border-mh-primary/50 transition-all flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-mh-lavender shadow-md bg-mh-lavender-light">
                  <img
                    src={member.img}
                    alt={`Fotografía de ${member.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-display font-bold text-sm text-mh-gray-900 mb-1">
                  {member.name}
                </h4>
                <p className="text-xs text-mh-primary font-semibold mb-2">
                  {member.role}
                </p>
                <span className="text-[11px] text-mh-gray-500">
                  Universidad de Colima (UCol)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
