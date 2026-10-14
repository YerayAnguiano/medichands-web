import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Problem } from './Problem';
import { About } from './About';
import { Diffusion } from './Diffusion';
import { Prevention } from './Prevention';
import { Footer } from './Footer';
import './bitacora.css';

export const BitacoraApp: React.FC = () => {
  return (
    <div className="bitacora-wrapper min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <About />
        <Diffusion />
        <Prevention />
      </main>
      <Footer />
    </div>
  );
};
