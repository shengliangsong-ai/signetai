
import React from 'react';
import SignetLogo from './SignetLogo';
import { Theme } from '../App';

const Header: React.FC<{ 
  onToggleSidebar: () => void; 
  theme: Theme; 
  onToggleTheme: () => void; 
  onOpenPortal: () => void;
  installPrompt: any;
  onInstall: () => void;
}> = ({ onToggleSidebar, theme, onToggleTheme, onOpenPortal, installPrompt, onInstall }) => (
  <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-[var(--bg-standard)] border-b border-[var(--border-light)] z-30 flex items-center justify-between px-8">
    <button onClick={onToggleSidebar} className="lg:hidden p-2 text-2xl text-[var(--text-header)]">☰</button>
    <div className="hidden lg:block text-[11px] font-mono text-[var(--text-body)] opacity-40 uppercase tracking-widest">
      Neural Audit
    </div>
    
    <div className="flex items-center gap-4">
      {installPrompt && (
        <button 
          onClick={onInstall}
          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-sidebar)] border border-[var(--trust-blue)] rounded hover:bg-[var(--admonition-bg)] transition-all animate-pulse shadow-[0_0_10px_rgba(0,85,255,0.3)]"
        >
          <SignetLogo className="w-3 h-3" />
          <span className="text-[10px] font-mono uppercase font-bold text-[var(--trust-blue)] tracking-wider">Install App</span>
        </button>
      )}

      <button 
        onClick={() => window.location.reload()}
        className="text-[var(--text-body)] opacity-40 hover:opacity-100 hover:text-[var(--trust-blue)] transition-all"
        title="Check for Updates / Reload"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>

      <a 
        href="https://github.com/signetai-io/website" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[var(--text-body)] opacity-40 hover:opacity-100 hover:text-[var(--trust-blue)] transition-all"
        title="View on GitHub"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <button 
        onClick={onToggleTheme}
        className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors"
      >
        {theme === 'standard' ? 'Midnight' : 'Standard'}
      </button>
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-mono text-[var(--text-body)]">Neural Audit 0.3.1 (TEST)</span>
        <span className="text-[11px] font-mono text-[var(--text-body)] opacity-60">Root: 7B8C...44A2 | Session: ACTI</span>
      </div>
    </div>
  </header>
);

export default Header;
