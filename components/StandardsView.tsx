import React from 'react';

export const StandardsView: React.FC = () => {
  const comparisonData = [
    { feature: "Identity Logic", standard: "Anonymous / Black Box", c2pa: "Verified Asset (Ed25519)", signet: "Bound TrustKey (Hardware-Verified)" },
    { feature: "Provenance", standard: "None", c2pa: "Asset Chain (Who/When)", signet: "Cognitive Chain (How/Why)" },
    { feature: "Reasoning Depth", standard: "Implicit / Opaque", c2pa: "Surface Level Metadata", signet: "Deterministic VPR DAG Mapping" },
    { feature: "Auditability", standard: "Proprietary / Locked", c2pa: "Public Manifest", signet: "Neural Lens Symbolic Parity" },
    { feature: "Compliance", standard: "Post-hoc Policy", c2pa: "ISO/TC 290 - C2PA 2.2", signet: "ISO + VPR Hybrid v0.2" }
  ];

  return (
    <div className="min-h-screen theme-bg theme-text pt-32 pb-24 px-6 max-w-6xl mx-auto font-serif">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-12 items-start mb-24 border-b-theme pb-20">
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-mono text-emerald-500 font-bold text-xl">cr</div>
            <span className="font-mono text-[10px] uppercase theme-text-secondary tracking-[0.4em] font-bold">C2PA + VPR Dual Standard</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tighter leading-[0.9] italic">
            Accountability<br/>by Design.
          </h1>
          <p className="theme-text-secondary text-xl leading-relaxed max-w-xl">
            Signet AI Labs officially adopts the C2PA v2.2 specification, augmented with our proprietary **Verifiable Proof of Reasoning (VPR)**. We verify not only the creator but the logical substrate of the creation.
          </p>
          <div className="flex gap-4">
            <a href="https://verify.signetai.io" target="_blank" className="px-8 py-4 theme-accent-bg text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl">
              Launch Verify Tool
            </a>
            <a href="#schema" className="px-8 py-4 border border-current theme-text font-mono text-xs uppercase tracking-widest font-bold hover:theme-accent-bg hover:text-white transition-all">
              VPR JSON Schema
            </a>
          </div>
        </div>
        <div className="w-full md:w-80 p-8 glass-card space-y-6">
          <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold">Certification Nodes</h4>
          <div className="space-y-4">
            {[
              { label: 'Asset Binding', val: 'C2PA/Manifest', status: 'PASS' },
              { label: 'Cognitive Parity', val: 'Signet/VPR', status: 'PASS' },
              { label: 'Identity Auth', val: 'TKS Registry', status: 'PASS' }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center text-xs">
                <span className="theme-text-secondary font-mono">{item.label}</span>
                <span className="theme-accent font-bold">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl italic font-bold mb-4">The Trust Hierarchy</h2>
          <p className="theme-text-secondary font-mono text-[10px] uppercase tracking-widest">Cognitive Provenance vs. Standard Attribution</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-800/10 glass-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="theme-bg-secondary font-mono text-[10px] uppercase tracking-[0.2em] theme-text-secondary">
                <th className="p-8 border-b border-neutral-800/10">Verification Tier</th>
                <th className="p-8 border-b border-neutral-800/10">Black Box AI</th>
                <th className="p-8 border-b border-neutral-800/10">C2PA Standard</th>
                <th className="p-8 border-b border-neutral-800/10 theme-accent">Signet Hybrid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/10">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:theme-bg-secondary/20 transition-colors">
                  <td className="p-8 font-bold italic text-lg">{row.feature}</td>
                  <td className="p-8 theme-text-secondary text-sm italic">{row.standard}</td>
                  <td className="p-8 theme-text-secondary text-sm italic">{row.c2pa}</td>
                  <td className="p-8 theme-text font-bold text-sm italic border-l border-emerald-500/10 bg-emerald-500/5">{row.signet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-32 p-12 glass-card text-center border-t-4 border-t-[var(--accent)]">
        <h3 className="text-3xl font-bold mb-6 italic">Towards a Universal Verifier.</h3>
        <p className="theme-text-secondary text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Signet Protocol is currently under submission for IETF standardization as a secure extension to the C2PA manifest system. We invite technical auditors to review the VPR schema.
        </p>
        <a href="#contact" className="font-mono text-[10px] uppercase tracking-[0.4em] theme-accent font-bold hover:underline">
          Request Technical Audit Data &rarr;
        </a>
      </div>
    </div>
  );
};