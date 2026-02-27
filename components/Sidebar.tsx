
import React, { useState } from 'react';
import SignetLogo from './SignetLogo';
import { SecurityIntegrityMonitor } from './SecurityIntegrityMonitor';

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }> = ({ title, children, isOpen, onToggle }) => (
  <div>
    <button onClick={onToggle} className="w-full flex justify-between items-center px-4 py-2 text-left">
      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-60">{title}</p>
      <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>&rarr;</span>
    </button>
    {isOpen && <div className="pl-4 border-l border-[var(--border-light)] ml-4">{children}</div>}
  </div>
);

const Sidebar: React.FC<{ currentView: string; isOpen: boolean }> = ({ currentView, isOpen }) => {
  const [openSection, setOpenSection] = useState('core');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] z-40 transition-transform duration-300 transform 
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => window.location.href = '/'}>
          <SignetLogo className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="font-bold tracking-tight text-xl text-[var(--text-header)]">Neural Audit 0.3.1 (TEST)</span>
        </div>

        <nav className="space-y-4 flex-1 overflow-y-auto">
          <AccordionSection title="Core Specification" isOpen={openSection === 'core'} onToggle={() => toggleSection('core')}>
            <a href="/" className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}>0. Introduction</a>
            <a href="/mission" className={`sidebar-link ${currentView === 'mission' ? 'active' : ''}`}>0.1 Mission & Team</a>
            <a href="/standards" className={`sidebar-link ${currentView === 'standards' ? 'active' : ''}`}>1. Standards & C2PA</a>
            <a href="/compliance" className={`sidebar-link ${currentView === 'compliance' ? 'active' : ''}`}>2. 2026 Strategy</a>
            <a href="/schema" className={`sidebar-link ${currentView === 'schema' ? 'active' : ''}`}>3. VPR JSON Manifest</a>
            <a href="/spec" className={`sidebar-link ${currentView === 'spec' ? 'active' : ''}`}>4. Technical Draft</a>
          </AccordionSection>

          <AccordionSection title="Identity & Trust" isOpen={openSection === 'identity'} onToggle={() => toggleSection('identity')}>
            <a href="/identity" className={`sidebar-link ${currentView === 'identity' ? 'active' : ''}`}>5. TrustKey Registry</a>
            <a href="/verify" className={`sidebar-link ${currentView === 'verify' ? 'active' : ''}`}>6. Difference Engine</a>
            <a href="/auditor" className={`sidebar-link ${currentView === 'auditor' ? 'active' : ''}`}>7. Provenance Lab</a>
            <a href="/branding" className={`sidebar-link ${currentView === 'branding' ? 'active' : ''}`}>8. Branding Kit</a>
          </AccordionSection>
          
          <AccordionSection title="Tools & Labs" isOpen={openSection === 'tools'} onToggle={() => toggleSection('tools')}>
            <a href="/universal-lab" className={`sidebar-link ${currentView === 'universal-lab' ? 'active' : ''}`}>Universal Media Lab</a>
            <a href="/batch" className={`sidebar-link ${currentView === 'batch' ? 'active' : ''}`}>Batch Mode (Local)</a>
            <a href="/cli" className={`sidebar-link ${currentView === 'cli' ? 'active' : ''}`}>CLI Tool (Download)</a>
            <a href="/image-comparator-demo" className={`sidebar-link ${currentView === 'image-comparator-demo' ? 'active' : ''}`}>Image Comparison Demo</a>
            <a href="/svg-lab" className={`sidebar-link ${currentView === 'svg-lab' ? 'active' : ''}`}>SVG Vector Lab</a>
            <a href="/pdf-lab" className={`sidebar-link ${currentView === 'pdf-lab' ? 'active' : ''}`}>PDF Doc Lab</a>
          </AccordionSection>

          <AccordionSection title="Meta" isOpen={openSection === 'meta'} onToggle={() => toggleSection('meta')}>
            <a href="/status" className={`sidebar-link ${currentView === 'status' ? 'active' : ''}`}>Project Status</a>
            <a href="/donate" className={`sidebar-link text-[var(--trust-blue)] font-bold ${currentView === 'donate' ? 'active' : ''}`}>Donate & Grants</a>
            <a href="/privacy" className={`sidebar-link opacity-60 ${currentView === 'privacy' ? 'active' : ''}`}>Privacy & Legal</a>
            <a href="/terms" className={`sidebar-link opacity-60 ${currentView === 'terms' ? 'active' : ''}`}>Terms of Service</a>
            <a href="/data-deletion" className={`sidebar-link opacity-60 ${currentView === 'data-deletion' ? 'active' : ''}`}>User Data Deletion</a>
          </AccordionSection>
        </nav>

        <div className="pt-8 mt-8 border-t border-[var(--border-light)] space-y-6">
          <SecurityIntegrityMonitor />
          <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 text-[var(--text-body)]">
            <span>Root: 7B8C...44A2 | Session: ACTI</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 text-[var(--text-body)]">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>MAINNET_NODE: ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
