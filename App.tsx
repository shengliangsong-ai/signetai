import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { SpecView } from './components/SpecView';
import { VerificationBadge } from './components/VerificationBadge';
import { TrustKeyService } from './components/TrustKeyService';
import { ContactHub } from './components/ContactHub';

type Theme = 'midnight' | 'paper' | 'sepia';

const Footer: React.FC = () => (
  <footer className="py-20 px-6 border-t-theme max-w-7xl mx-auto border-v">
    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="space-y-4">
        <h2 className="font-serif text-3xl theme-text">SignetAI.io</h2>
        <p className="font-mono text-[10px] theme-text-secondary tracking-[0.2em] uppercase">Built for the 2M Context Era</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
        <div className="space-y-4">
          <h4 className="font-mono text-xs theme-text uppercase tracking-widest">Protocol</h4>
          <ul className="theme-text-secondary text-sm space-y-2">
            <li><a href="#spec" className="hover:theme-text cursor-pointer transition-colors">Draft-Song-02</a></li>
            <li className="hover:theme-text cursor-pointer transition-colors">SDK Reference</li>
            <li className="hover:theme-text cursor-pointer transition-colors">Whitepaper</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono text-xs theme-text uppercase tracking-widest">Ecosystem</h4>
          <ul className="theme-text-secondary text-sm space-y-2">
            <li className="hover:theme-text cursor-pointer transition-colors">Neural Lens</li>
            <li className="hover:theme-text cursor-pointer transition-colors">Neural Prism</li>
            <li><a href="#tks" className="hover:theme-text cursor-pointer transition-colors">TrustKeyService</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono text-xs theme-text uppercase tracking-widest">Legal</h4>
          <ul className="theme-text-secondary text-sm space-y-2">
            <li className="hover:theme-text cursor-pointer transition-colors">Accountability</li>
            <li className="hover:theme-text cursor-pointer transition-colors">Privacy</li>
            <li className="hover:theme-text cursor-pointer transition-colors">Goverance</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-20 pt-8 border-t-theme flex justify-between items-center theme-text-secondary font-mono text-[10px]">
      <p>&copy; 2026 SIGNET PROTOCOL GROUP. ALL RIGHTS ACCOUNTED FOR.</p>
      <p>EST: 10.202.1.0-FF</p>
    </div>
  </footer>
);

const Navbar: React.FC<{ isSpec: boolean; currentTheme: Theme; onThemeChange: (t: Theme) => void }> = ({ isSpec, currentTheme, onThemeChange }) => (
  <nav className="fixed top-0 left-0 w-full z-50 border-b-theme" style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(20px)' }}>
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-v">
      <a href="#" className="flex items-center gap-3">
        <div className="w-6 h-6 theme-text border border-current rotate-45 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-current opacity-20"></div>
        </div>
        <span className="font-serif text-xl tracking-tight theme-text font-bold">SignetAI.io</span>
      </a>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-10 font-mono text-[10px] uppercase tracking-widest theme-text-secondary">
          {!isSpec ? (
            <>
              <a href="#" className="hover:theme-text transition-colors">Architecture</a>
              <a href="#tks" className="hover:theme-text transition-colors">TKS Registry</a>
              <a href="#contact" className="hover:theme-text transition-colors">Contact</a>
            </>
          ) : (
            <a href="#" className="hover:theme-text transition-colors">← Back to Site</a>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-800/20 glass-card">
          {(['midnight', 'paper', 'sepia'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-tighter transition-all ${
                currentTheme === t 
                ? 'theme-accent-bg text-white shadow-lg' 
                : 'theme-text-secondary hover:theme-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button className="hidden sm:block px-4 py-2 border border-current theme-text font-mono text-[10px] uppercase tracking-widest hover:theme-accent-bg hover:text-white transition-all">
          Portal
        </button>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'spec'>('home');
  const [theme, setTheme] = useState<Theme>('midnight');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    <div className={`min-h-screen selection:bg-[var(--accent)] selection:text-white theme-bg`}>
      <Navbar isSpec={view === 'spec'} currentTheme={theme} onThemeChange={setTheme} />
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