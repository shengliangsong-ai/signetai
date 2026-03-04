
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { SpecView } from './components/SpecView';
import { StandardsView } from './components/StandardsView';
import { SchemaView } from './components/SchemaView';
import { Admonition } from './components/Admonition';
import { TrustKeyService } from './components/TrustKeyService';
import { ContactHub } from './components/ContactHub';
import { PortalView } from './components/PortalView';
import { VerificationBadge } from './components/VerificationBadge';
import { BrandingView } from './components/BrandingView';
import { ManualView } from './components/ManualView';
import { LiveAssistant } from './components/LiveAssistant';
import { ProvenanceLab } from './components/ProvenanceLab';
import { SecurityIntegrityMonitor } from './components/SecurityIntegrityMonitor';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { VerifyView } from './components/VerifyView';
import { EcosystemView } from './components/EcosystemView';
import { SvgSigner } from './components/SvgSigner';
import { PdfSigner } from './components/PdfSigner';
import { UniversalSigner } from './components/UniversalSigner';
import { ProjectStatusView } from './components/ProjectStatusView';
import { BatchVerifier } from './components/BatchVerifier';
import { CliDownload } from './components/CliDownload';
import { MissionView } from './components/MissionView';
import { PrivacyView } from './components/PrivacyView';
import { DonationView } from './components/DonationView';
import { PodcastDemo } from './components/PodcastDemo';
import { TermsOfServiceView } from './components/TermsOfServiceView';
import { UserDataDeletionView } from './components/UserDataDeletionView';
import { DemoNotebook } from './components/DemoNotebook';

export type Theme = 'standard' | 'midnight';

// Inline SVG to ensure it always renders without 404s
const SignetLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a2f35"/>
        <stop offset="100%" stopColor="#000000"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="128" fill="url(#logo_grad)"/>
    <path d="M0 440h512v72H0z" fill="#0055FF" fillOpacity="0.9"/>
    <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="280" fill="#FFFFFF" letterSpacing="-14">SA</text>
    <circle cx="400" cy="110" r="28" fill="#0055FF" stroke="#1B1F23" strokeWidth="20"/>
  </svg>
);

const SidebarGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-body)] opacity-40 mb-2">
      {title}
    </h3>
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

const SidebarLink: React.FC<{ 
  id: string; 
  currentView: string; 
  label: string; 
  isSub?: boolean;
  highlight?: boolean;
}> = ({ id, currentView, label, isSub, highlight }) => {
  const isActive = currentView === id || (id === '' && currentView === 'home');
  const href = id === '' ? '#' : `#${id}`;
  
  return (
    <a 
      href={href}
      onClick={(e) => { if(id === '') { e.preventDefault(); window.location.hash = ''; } }}
      className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${isSub ? 'ml-4 text-[13px] border-l border-[var(--border-light)] pl-4' : 'font-medium'} ${
        isActive 
          ? 'bg-[var(--trust-blue)] text-white shadow-md shadow-blue-500/20' 
          : highlight 
            ? 'text-green-500 hover:bg-green-500/10'
            : 'text-[var(--text-body)] hover:bg-[var(--border-light)] hover:text-[var(--text-header)]'
      }`}
    >
      {label}
    </a>
  );
};

const Sidebar: React.FC<{ currentView: string; isOpen: boolean }> = ({ currentView, isOpen }) => (
  <aside 
    className={`fixed left-0 top-0 h-screen w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] z-40 transition-transform duration-300 transform flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
  >
    <div className="p-6 border-b border-[var(--border-light)]">
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.hash = ''}>
        <SignetLogo className="w-8 h-8 rounded-lg shadow-sm" />
        <span className="font-bold tracking-tight text-xl text-[var(--text-header)]">Signet v0.3.3</span>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto p-4">
      <SidebarGroup title="Getting Started">
        <SidebarLink id="" currentView={currentView} label="Introduction" />
        <SidebarLink id="mission" currentView={currentView} label="Mission & Team" />
        <SidebarLink id="demo" currentView={currentView} label="▶ Run Demo Notebook" highlight />
      </SidebarGroup>

      <SidebarGroup title="Core Protocol">
        <SidebarLink id="standards" currentView={currentView} label="Standards & C2PA" />
        <SidebarLink id="schema" currentView={currentView} label="VPR JSON Manifest" />
        <SidebarLink id="spec" currentView={currentView} label="Technical Draft" />
        <SidebarLink id="compliance" currentView={currentView} label="2026 Strategy" />
      </SidebarGroup>

      <SidebarGroup title="Trust & Identity">
        <SidebarLink id="identity" currentView={currentView} label="TrustKey Registry" />
        <SidebarLink id="verify" currentView={currentView} label="Public Verifier" />
        <SidebarLink id="batch" currentView={currentView} label="Batch Mode (Local)" isSub />
        <SidebarLink id="cli" currentView={currentView} label="CLI Tool (Download)" isSub />
      </SidebarGroup>

      <SidebarGroup title="Media Labs">
        <SidebarLink id="universal-lab" currentView={currentView} label="Universal Media Lab" />
        <SidebarLink id="svg-lab" currentView={currentView} label="SVG Vector Lab" isSub />
        <SidebarLink id="pdf-lab" currentView={currentView} label="PDF Doc Lab" isSub />
        <SidebarLink id="auditor" currentView={currentView} label="Provenance Lab (Sim)" />
      </SidebarGroup>

      <SidebarGroup title="Resources">
        <SidebarLink id="manual" currentView={currentView} label="Operator's Manual" />
        <SidebarLink id="ecosystem" currentView={currentView} label="Ecosystem Repositories" />
        <SidebarLink id="branding" currentView={currentView} label="Branding Kit" />
        <SidebarLink id="status" currentView={currentView} label="Project Status" />
      </SidebarGroup>

      <SidebarGroup title="Legal & Meta">
        <SidebarLink id="donate" currentView={currentView} label="Donate & Grants" />
        <SidebarLink id="privacy" currentView={currentView} label="Privacy & Legal" />
        <SidebarLink id="terms" currentView={currentView} label="Terms of Service" />
        <SidebarLink id="data-deletion" currentView={currentView} label="Data Deletion" />
      </SidebarGroup>
    </nav>

    <div className="p-6 border-t border-[var(--border-light)] bg-[var(--bg-sidebar)]">
      <SecurityIntegrityMonitor />
      <div className="flex items-center gap-2 mt-4 text-[10px] font-mono opacity-50 text-[var(--text-body)]">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span>MAINNET_NODE: ACTIVE</span>
      </div>
    </div>
  </aside>
);

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
      ISO/TC 290 - Cognitive Provenance Standard
    </div>
    
    <div className="flex items-center gap-6">
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
      <button 
        onClick={onOpenPortal}
        className="px-4 py-1.5 bg-[var(--trust-blue)] text-white text-[11px] font-bold rounded hover:brightness-110 transition-all shadow-sm"
      >
        Verifier SDK (∑)
      </button>
    </div>
  </header>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'mission' | 'spec' | 'standards' | 'schema' | 'branding' | 'manual' | 'auditor' | 'identity' | 'compliance' | 'verify' | 'ecosystem' | 'svg-lab' | 'pdf-lab' | 'universal-lab' | 'status' | 'batch' | 'cli' | 'privacy' | 'donate' | 'terms' | 'data-deletion' | 'demo'>('home');
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
      const hash = window.location.hash;
      const route = hash.split('?')[0]; // Ignore query params for routing match

      if (route === '#mission') {
        setView('mission');
      } else if (route === '#auditor') {
        setView('auditor');
      } else if (route === '#identity') {
        setView('identity');
      } else if (route === '#spec') {
        setView('spec');
      } else if (route === '#standards') {
        setView('standards');
      } else if (route === '#schema') {
        setView('schema');
      } else if (route === '#branding') {
        setView('branding');
      } else if (route === '#manual') {
        setView('manual');
      } else if (route === '#compliance') {
        setView('compliance');
      } else if (route === '#verify') {
        setView('verify');
      } else if (route === '#ecosystem') {
        setView('ecosystem');
      } else if (route === '#svg-lab') {
        setView('svg-lab');
      } else if (route === '#pdf-lab') {
        setView('pdf-lab');
      } else if (route === '#universal-lab') {
        setView('universal-lab');
      } else if (route === '#status') {
        setView('status');
      } else if (route === '#batch') {
        setView('batch');
      } else if (route === '#cli') {
        setView('cli');
      } else if (route === '#privacy') {
        setView('privacy');
      } else if (route === '#terms') {
        setView('terms');
      } else if (route === '#data-deletion') {
        setView('data-deletion');
      } else if (route === '#donate') {
        setView('donate');
      } else if (route === '#demo') {
        setView('demo');
      } else {
        setView('home');
      }
      setIsSidebarOpen(false);
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      console.log("Signet PWA: Install Prompt Captured");
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

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
          {view === 'home' && (
            <>
              <Hero onOpenPortal={() => setIsPortalOpen(true)} />
              <Admonition type="note" title="Cognitive Assertion Layer">
                Signet Protocol acts as a specialized subdirectory of C2PA, mapping neural logic states into standard JUMBF manifest boxes.
              </Admonition>
              <Architecture />
              <hr className="hr-chapter" />
              <PodcastDemo />
              <hr className="hr-chapter" />
              <SchemaDefinition />
              <hr className="hr-chapter" />
              <ContactHub />
            </>
          )}
          {view === 'mission' && <MissionView />}
          {view === 'identity' && <TrustKeyService />}
          {view === 'auditor' && <ProvenanceLab />}
          {view === 'spec' && <SpecView />}
          {view === 'standards' && <StandardsView />}
          {view === 'schema' && <SchemaView />}
          {view === 'branding' && <BrandingView />}
          {view === 'manual' && <ManualView />}
          {view === 'compliance' && <ComplianceDashboard />}
          {view === 'verify' && <VerifyView />}
          {view === 'ecosystem' && <EcosystemView />}
          {view === 'svg-lab' && <SvgSigner />}
          {view === 'pdf-lab' && <PdfSigner />}
          {view === 'universal-lab' && <UniversalSigner />}
          {view === 'status' && <ProjectStatusView />}
          {view === 'batch' && <BatchVerifier />}
          {view === 'cli' && <CliDownload />}
          {view === 'privacy' && <PrivacyView />}
          {view === 'donate' && <DonationView />}
          {view === 'terms' && <TermsOfServiceView />}
          {view === 'data-deletion' && <UserDataDeletionView />}
          {view === 'demo' && <DemoNotebook />}

          <footer className="mt-24 pt-12 border-t border-[var(--border-light)] flex flex-wrap justify-between items-center gap-6 text-[10px] font-mono opacity-50 uppercase tracking-widest text-[var(--text-body)]">
            <div className="flex items-center gap-4">
              <div className="cr-badge">cr</div>
              <span>Signet Protocol Group © 2026 | Master Signatory: signetai.io:ssl</span>
            </div>
            <div className="flex gap-4">
              <a href="#mission" className="hover:text-[var(--trust-blue)]">About</a>
              <a href="#privacy" className="hover:text-[var(--trust-blue)]">Privacy</a>
              <a href="#terms" className="hover:text-[var(--trust-blue)]">Terms</a>
              <a href="#data-deletion" className="hover:text-[var(--trust-blue)]">Data Deletion</a>
              <a href="#donate" className="hover:text-[var(--trust-blue)]">Grants</a>
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
