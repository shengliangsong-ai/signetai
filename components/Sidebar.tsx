
import React from 'react';
import SignetLogo from './SignetLogo';
import { SecurityIntegrityMonitor } from './SecurityIntegrityMonitor';

const Sidebar: React.FC<{ currentView: string; isOpen: boolean }> = ({ currentView, isOpen }) => (
  <aside 
    className={`fixed left-0 top-0 h-screen w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] z-40 transition-transform duration-300 transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
  >
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => window.location.href = '/'}>
        <SignetLogo className="w-8 h-8 rounded-lg shadow-sm" />
        <span className="font-bold tracking-tight text-xl text-[var(--text-header)]">Signet v0.3.3</span>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        <p className="px-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Core Specification</p>
        <a href="/" className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}>0. Introduction</a>
        <a href="/mission" className={`sidebar-link ${currentView === 'mission' ? 'active' : ''}`}>0.1 Mission & Team</a>
        <a href="/standards" className={`sidebar-link ${currentView === 'standards' ? 'active' : ''}`}>1. Standards & C2PA</a>
        <a href="/compliance" className={`sidebar-link ${currentView === 'compliance' ? 'active' : ''}`}>2. 2026 Strategy</a>
        <a href="/schema" className={`sidebar-link ${currentView === 'schema' ? 'active' : ''}`}>3. VPR JSON Manifest</a>
        <a href="/spec" className={`sidebar-link ${currentView === 'spec' ? 'active' : ''}`}>4. Technical Draft</a>
        <p className="px-4 py-2 text-[9px] text-[var(--text-body)] opacity-40 font-mono">v0.3.3 (C2PA 2.3)</p>
        
        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Identity & Trust</p>
        <a href="/identity" className={`sidebar-link ${currentView === 'identity' ? 'active' : ''}`}>5. TrustKey Registry (Register)</a>
        <a href="/verify" className={`sidebar-link ${currentView === 'verify' ? 'active' : ''}`}>6. Difference Engine (/verify)</a>
        <a href="/batch" className={`sidebar-link ml-4 opacity-70 ${currentView === 'batch' ? 'active' : ''}`}>↳ Batch Mode (Local)</a>
        <a href="/cli" className={`sidebar-link ml-4 opacity-70 ${currentView === 'cli' ? 'active' : ''}`}>↳ CLI Tool (Download)</a>
        <a href="/auditor" className={`sidebar-link ${currentView === 'auditor' ? 'active' : ''}`}>7. Provenance Lab (Sim)</a>
        <a href="/branding" className={`sidebar-link ${currentView === 'branding' ? 'active' : ''}`}>8. Branding Kit</a>
        <a href="/manual" className={`sidebar-link ${currentView === 'manual' ? 'active' : ''}`}>9. Operator's Manual</a>
        <a href="/ecosystem" className={`sidebar-link ${currentView === 'ecosystem' ? 'active' : ''}`}>10. Ecosystem Repositories</a>
        
        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Media Labs (Active)</p>
        <a href="/universal-lab" className={`sidebar-link ${currentView === 'universal-lab' ? 'active' : ''}`}>11. Universal Media Lab</a>
        <a href="/svg-lab" className={`sidebar-link ml-4 opacity-70 ${currentView === 'svg-lab' ? 'active' : ''}`}>↳ SVG Vector Lab</a>
        <a href="/pdf-lab" className={`sidebar-link ml-4 opacity-70 ${currentView === 'pdf-lab' ? 'active' : ''}`}>↳ PDF Doc Lab</a>
        <a href="/image-comparator-demo" className={`sidebar-link ${currentView === 'image-comparator-demo' ? 'active' : ''}`}>11.5. Image Comparison Demo</a>

        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Meta</p>
        <a href="/status" className={`sidebar-link ${currentView === 'status' ? 'active' : ''}`}>12. Project Status & Log</a>
        <a href="/donate" className={`sidebar-link text-[var(--trust-blue)] font-bold ${currentView === 'donate' ? 'active' : ''}`}>13. Donate & Grants</a>
        <a href="/privacy" className={`sidebar-link opacity-60 ${currentView === 'privacy' ? 'active' : ''}`}>14. Privacy & Legal</a>
        <a href="/terms" className={`sidebar-link opacity-60 ${currentView === 'terms' ? 'active' : ''}`}>15. Terms of Service</a>
        <a href="/data-deletion" className={`sidebar-link opacity-60 ${currentView === 'data-deletion' ? 'active' : ''}`}>16. User Data Deletion</a>
      </nav>

      <div className="pt-8 mt-8 border-t border-[var(--border-light)] space-y-6">
        <SecurityIntegrityMonitor />
        <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 text-[var(--text-body)]">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>MAINNET_NODE: ACTIVE</span>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
