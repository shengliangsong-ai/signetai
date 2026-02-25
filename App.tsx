
import React, { useState, useEffect } from 'react';
import { pathRoutes, hashRoutes, viewComponents } from './routeConfig.tsx';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { PortalView } from './components/PortalView';
import { VerificationBadge } from './components/VerificationBadge';
import { LiveAssistant } from './components/LiveAssistant';

export type Theme = 'standard' | 'midnight';

const App: React.FC = () => {
  const [view, setView] = useState<string>('home');
  const [theme, setTheme] = useState<Theme>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      const hash = window.location.hash;
      const route = hash.split('?')[0]; // Ignore query params for routing match

      const newView = pathRoutes[path] || hashRoutes[route] || 'home';
      setView(newView);
      setIsSidebarOpen(false);
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      console.log("Signet PWA: Install Prompt Captured");
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  const CurrentView = viewComponents[view];

  return (
    <div className="min-h-screen bg-[var(--bg-standard)] transition-colors duration-200">
      <Sidebar currentView={view} isOpen={isSidebarOpen} />
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'standard' ? 'midnight' : 'standard')}
        onOpenPortal={() => setIsPortalOpen(true)}
        installPrompt={installPrompt}
        onInstall={handleInstall}
      />
      
      <main className="lg:pl-72 pt-16">
        <div className="content-column">
          {CurrentView && <CurrentView onOpenPortal={() => setIsPortalOpen(true)} />}

          <footer className="mt-24 pt-12 border-t border-[var(--border-light)] flex flex-wrap justify-between items-center gap-6 text-[10px] font-mono opacity-50 uppercase tracking-widest text-[var(--text-body)]">
            <div className="flex items-center gap-4">
              <div className="cr-badge">cr</div>
              <span>Signet Protocol Group © 2026 | Master Signatory: signetai.io:ssl</span>
            </div>
            <div className="flex gap-4">
              <a href="/mission" className="hover:text-[var(--trust-blue)]">About</a>
              <a href="/privacy" className="hover:text-[var(--trust-blue)]">Privacy</a>
              <a href="/terms" className="hover:text-[var(--trust-blue)]">Terms</a>
              <a href="/data-deletion" className="hover:text-[var(--trust-blue)]">Data Deletion</a>
              <a href="/donate" className="hover:text-[var(--trust-blue)]">Grants</a>
              <span>VERSION: 0.3.3_UTW</span>
              <span>UPDATED: {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC</span>
            </div>
          </footer>
        </div>
      </main>

      <PortalView isOpen={isPortalOpen} onClose={() => setIsPortalOpen(false)} />
      <VerificationBadge />
      <LiveAssistant />
    </div>
  );
};

export default App;
