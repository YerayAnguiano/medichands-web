import React, { useState } from 'react';
import { navLinks } from './content';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bitacora-header">
      <div className="container header-content">
        <a href="#inicio" className="logo">
          <img src="/logo.ico" alt="Logo MedicHands" className="w-7 h-7 object-contain" />
          <span><strong>MedicHands</strong> · Bitácora</span>
        </a>
        
        <nav className={`nav ${isOpen ? 'open' : ''}`} aria-label="Navegación de la bitácora">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} onClick={() => setIsOpen(false)}>{link.name}</a>
              </li>
            ))}
          </ul>
          <a href="/quienes-somos" className="btn btn-secondary text-xs">
            ← Volver a ¿Quiénes somos?
          </a>
        </nav>

        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Alternar menú"
          aria-expanded={isOpen}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
};
