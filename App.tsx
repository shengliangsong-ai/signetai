// [SOURCE PROMPT]: Implement the TrustKeyService (TKS) Registry API structure and UI for identity binding (Task F-01).

import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { SpecView } from './components/SpecView';
import { VerificationBadge } from './components/VerificationBadge';
import { TrustKeyService } from './components/TrustKeyService';
import { ContactHub } from './components/ContactHub';

const Footer: React.FC = () => (
  <footer className="py-20 px-6 border-t border-neutral-900 max-w-7xl mx-auto border-x">
    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="space-y-4">
        <h2 className="font-serif text-3xl">SignetAI.io</h2>
        <p className="font-mono text-[10px] text-neutral-600 tracking-[0.2em] uppercase">Built for the 2M Context Era</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
        <div className="space-y-4">
          <h4 className="font-mono text-xs text-white uppercase tracking-widest">Protocol</h4>
          <ul className="text-neutral-500 text-sm space-y-2">
            <li><a href="#spec" className="hover:text-white cursor-pointer">Draft-Song-02</a></li>
            <li className="hover:text-white cursor-pointer">SDK Reference</li>
            <li className="hover:text-white cursor-pointer">Whitepaper</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono text-xs text-white uppercase tracking-widest">Ecosystem</h4>
          <ul className="text-neutral-500 text-sm space-y-2">
            <li className="hover:text-white cursor-pointer">Neural Lens</li>
            <li className="hover:text-white cursor-pointer">Neural Prism</li>
            <li><a href="#tks" className="hover:text-white cursor-pointer">TrustKeyService</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono text-xs text-white uppercase tracking-widest">Legal</h4>
          <ul className="text-neutral-500 text-sm space-y-2">
            <li className="hover:text-white cursor-pointer">Accountability</li>
            <li className="hover:text-white cursor-pointer">Privacy</li>
            <li className="hover:text-white cursor-pointer">Goverance</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-neutral-600 font-mono text-[10px]">
      <p>&copy; 2026 SIGNET PROTOCOL GROUP. ALL RIGHTS ACCOUNTED FOR.</p>
      <p>EST: 10.202.1.0-FF</p>
    </div>
  </footer>
);

const Navbar: React.FC<{ isSpec: boolean }> = ({ isSpec }) => (
  <nav className="fixed top-0 left-0 w-full z-50 border-b border-neutral-900 bg-black/80 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-x border-neutral-900">
      <a href="#" className="flex items-center gap-3">
        <div className="w-6 h-6 bg-white rotate-45"></div>
        <span className="font-serif text-xl tracking-tight">SignetAI.io</span>
      </a>
      <div className="hidden md:flex items-center gap-10 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
        {!isSpec ? (
          <>
            <a href="#" className="hover:text-white transition-colors">Architecture</a>
            <a href="#tks" className="hover:text-white transition-colors">TKS Registry</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <a href="#spec" className="hover:text-white transition-colors">Full Spec</a>
          </>
        ) : (
          <a href="#" className="hover:text-white transition-colors">← Back to Site</a>
        )}
      </div>
      <button className="px-4 py-2 border border-white text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
        Portal
      </button>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'spec'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#spec') {
        setView('spec');
        window.scrollTo(0, 0);
      } else {
        setView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Navbar isSpec={view === 'spec'} />
      <main>
        {view === 'home' ? (
          <>
            <Hero />
            <Architecture />
            <TrustKeyService />
            <SchemaDefinition />
            <ContactHub />
          </>
        ) : (
          <SpecView />
        )}
      </main>
      <Footer />
      <VerificationBadge />
    </div>
  );
};

export default App;