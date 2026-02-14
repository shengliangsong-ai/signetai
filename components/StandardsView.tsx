import React from 'react';

export const StandardsView: React.FC = () => {
  const alignmentMatrix = [
    { 
      feature: "Core Focus", 
      c2pa: "Asset Integrity (Did the pixels change?)", 
      signet: "Cognitive Integrity (Was the logic sound?)" 
    },
    { 
      feature: "Trust Level", 
      c2pa: "Metadata Signature (The \"Seal\")", 
      signet: "Logic Trace Parity (The \"Audit\")" 
    },
    { 
      feature: "AI Handling", 
      c2pa: "Labels content as \"AI Generated\"", 
      signet: "Proves how the AI reasoned the result" 
    },
    { 
      feature: "Compliance", 
      c2pa: "100% Native Integration", 
      signet: "Extended Logic Assertions (VPR)" 
    }
  ];

  return (
    <div className="min-h-screen theme-bg theme-text pt-32 pb-24 px-6 max-w-6xl mx-auto font-serif">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-12 items-start mb-24 border-b-theme pb-20">
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-mono text-emerald-500 font-bold text-xl">cr</div>
            <span className="font-mono text-[10px] uppercase theme-text-secondary tracking-[0.4em] font-bold">Standard-Native Implementation</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tighter leading-[0.9] italic">
            Cognitive<br/>Provenance.
          </h1>
          <p className="theme-text-secondary text-xl leading-relaxed max-w-xl">
            Signet AI Labs operates as a specialized **Cognitive Assertion Provider**. We extend the C2PA v2.2 specification to secure the reasoning substrate of autonomous AI systems.
          </p>
          <div className="flex gap-4">
            <a href="https://contentcredentials.org/verify" target="_blank" className="px-8 py-4 theme-accent-bg text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl">
              Verify Credentials
            </a>
            <a href="#schema" className="px-8 py-4 border border-current theme-text font-mono text-xs uppercase tracking-widest font-bold hover:theme-accent-bg hover:text-white transition-all">
              VPR JUMBF Schema
            </a>
          </div>
        </div>
        
        {/* Callout Box for Auditors */}
        <div className="w-full md:w-80 p-8 glass-card border-t-4 border-t-emerald-500/50 space-y-6">
          <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold theme-text">Auditor Resources</h4>
          <div className="space-y-4">
            <a 
              href="https://spec.c2pa.org/" 
              target="_blank" 
              className="block p-4 border border-current/10 hover:bg-emerald-500/5 transition-colors group"
            >
              <p className="font-mono text-[9px] theme-text-secondary uppercase mb-1">C2PA Specification</p>
              <p className="text-sm font-bold theme-text group-hover:theme-accent">Official ISO/TC 290 Link &rarr;</p>
            </a>
            <a 
              href="https://contentauthenticity.org/" 
              target="_blank" 
              className="block p-4 border border-current/10 hover:bg-emerald-500/5 transition-colors group"
            >
              <p className="font-mono text-[9px] theme-text-secondary uppercase mb-1">Ecosystem Partner</p>
              <p className="text-sm font-bold theme-text group-hover:theme-accent">Content Authenticity Initiative &rarr;</p>
            </a>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl italic font-bold mb-4">Alignment Matrix</h2>
          <p className="theme-text-secondary font-mono text-[10px] uppercase tracking-widest">C2PA Standard vs. Signet Neural Prism (VPR)</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-800/10 glass-card">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="theme-bg-secondary font-mono text-[10px] uppercase tracking-[0.2em] theme-text-secondary">
                <th className="p-8 border-b border-neutral-800/10">Trust Dimension</th>
                <th className="p-8 border-b border-neutral-800/10">C2PA Standard</th>
                <th className="p-8 border-b border-neutral-800/10 theme-accent">Signet VPR (Neural Prism)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/10">
              {alignmentMatrix.map((row, idx) => (
                <tr key={idx} className="hover:theme-bg-secondary/20 transition-colors">
                  <td className="p-8 font-bold italic text-lg">{row.feature}</td>
                  <td className="p-8 theme-text-secondary text-sm italic leading-relaxed">{row.c2pa}</td>
                  <td className="p-8 theme-text font-bold text-sm italic border-l border-emerald-500/10 bg-emerald-500/5 leading-relaxed">
                    {row.signet}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Footer */}
      <div className="mt-32 p-12 glass-card text-center border-b-4 border-b-emerald-500/50">
        <h3 className="text-3xl font-bold mb-6 italic">The Future of Content Authenticity.</h3>
        <p className="theme-text-secondary text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Signet Protocol is the first system to leverage the C2PA JUMBF framework for <strong>reasoning-depth assertions</strong>. We provide the mathematical proof that the AI didn't just generate the output, but understood the assignment.
        </p>
        <div className="flex justify-center gap-8 items-center opacity-40 grayscale hover:grayscale-0 transition-all">
          <span className="font-mono text-[10px] font-bold">C2PA COMPLIANT</span>
          <span className="font-mono text-[10px] font-bold">ISO/TC 290</span>
          <span className="font-mono text-[10px] font-bold">VPR ENABLED</span>
        </div>
      </div>
    </div>
  );
};