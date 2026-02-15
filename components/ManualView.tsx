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
          v0.2.6 — Standardized Guidance for the Signet Accountability Layer.
        </p>
      </header>

      <ManualSection title="01. The Verifier SDK">
        <p className="text-lg leading-loose text-[var(--text-body)]">
          The Verifier SDK is your interface into the **Neural Lens**. It provides a real-time window into the cryptographic attestation process.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <FeatureCard 
            icon="ID" 
            title="Understanding Trace IDs" 
            desc="Every row in the Live Audit table represents a specific 'Logic Node' in the AI's reasoning path. The ID is a unique SHA-256 fingerprint." 
          />
          <FeatureCard 
            icon="∞" 
            title="The Continuous Heartbeat" 
            desc="Signet uses 'Continuous Attestation'. The stream monitors for 'State Drift' — ensuring the asset hasn't been tampered with." 
          />
        </div>
      </ManualSection>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Dashboard
        </a>
        <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">Certified by Signet Standards Group | v0.2.6</p>
      </div>
    </div>
  );
};