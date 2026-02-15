import React from 'react';

const ManualSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-16">
    <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--trust-blue)] font-bold mb-6 border-b border-[var(--border-light)] pb-2">
      {title}
    </h3>
    <div className="space-y-6">
      {children}
    </div>
  </section>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="p-8 border border-[var(--border-light)] bg-[var(--table-header)] rounded shadow-sm">
    <div className="w-10 h-10 border border-[var(--trust-blue)] text-[var(--trust-blue)] flex items-center justify-center font-bold mb-6 italic">
      {icon}
    </div>
    <h4 className="font-serif text-xl font-bold text-[var(--text-header)] mb-3">{title}</h4>
    <p className="text-[14px] leading-relaxed text-[var(--text-body)] opacity-70 italic">{desc}</p>
  </div>
);

export const ManualView: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto">
      <header className="mb-20 space-y-4">
        <h1 className="text-6xl font-bold tracking-tighter italic text-[var(--text-header)]">Operator's Manual</h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic">
          v0.2.7 — Standardized Guidance for the Signet Accountability Layer.
        </p>
      </header>

      <ManualSection title="01. Identity & Vault Recovery">
        <div className="space-y-4 text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif">
          <p>Signet uses a <strong>Non-Custodial</strong> trust model. This means you alone hold the keys to your curatorial authority.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded">
               <h5 className="font-bold text-red-600 mb-2">If you lose your Seed Manifest:</h5>
               <p className="text-sm opacity-70">Use the <strong>12-Word Mnemonic</strong> in the "Vault Recovery" section to re-derive your signing keys. This resets your local session without changing your Registry Anchor.</p>
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded">
               <h5 className="font-bold text-amber-600 mb-2">If you lose both Seed & Mnemonic:</h5>
               <p className="text-sm opacity-70">The identity is <strong>Orphaned</strong>. It remains in the registry for accountability (others can still verify old assets), but no new assets can ever be signed by this ID.</p>
            </div>
          </div>
        </div>
      </ManualSection>

      <ManualSection title="02. Manifest Delivery Strategies">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          The Signet Protocol supports two primary methods for delivering content credentials, aligned with C2PA 2.3 standards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="⚓" 
            title="Embedded (JUMBF)" 
            desc="The manifest is injected directly into the asset binary (e.g., JPEG APP11). Best for social sharing and mobile portability, as the proof travels 'inside' the pixels." 
          />
          <FeatureCard 
            icon="📄" 
            title="Sidecar (.json)" 
            desc="A separate file containing the VPR assertions. Preferred for enterprise cloud pipelines and LLM context windows where binary modification is restricted." 
          />
        </div>
      </ManualSection>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Dashboard
        </a>
        <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">Certified by Signet Standards Group | v0.2.7</p>
      </div>
    </div>
  );
};