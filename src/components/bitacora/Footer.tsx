import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-white py-12 border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2 font-display font-black text-lg text-mh-lavender">
              <img src="/logo.ico" alt="Logo MedicHands" className="w-6 h-6 object-contain" />
              <span>MEDICHANDS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Herramienta tecnológica de apoyo e IoMT para la identificación no invasiva de asimetrías térmicas mamarias.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Secciones</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#problema" className="hover:text-white transition-colors">Obstáculos y Retos</a></li>
              <li><a href="#nosotros" className="hover:text-white transition-colors">Nuestra Historia</a></li>
              <li><a href="#difusion" className="hover:text-white transition-colors">Divulgación</a></li>
              <li><a href="/quienes-somos" className="text-mh-lavender hover:underline">← Volver al Portal Web</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Contacto Académico</h4>
            <div className="space-y-1 text-xs text-slate-400">
              <p>Facultad de Ingeniería Mecánica y Eléctrica (FIME)</p>
              <p>Universidad de Colima (UCol)</p>
              <p className="text-mh-lavender">Colima, México</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6 text-center text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Aviso Médico Preventivo:</strong> MedicHands es una herramienta tecnológica de triaje y apoyo que 
            <strong> no sustituye</strong> la valoración, diagnóstico, mastografía o tratamiento médico realizado por profesionales de la salud.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} MedicHands. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
