import React from 'react';

const PipelineStep: React.FC<{ layer: string; title: string; desc: string; tools: string[] }> = ({ layer, title, desc, tools }) => (
  <div className="relative pl-12 pb-16 last:pb-0 border-l border-neutral-800/20">
    <div className="absolute left-[-9px] top-0 w-4 h-4 theme-bg border-2 border-current theme-text flex items-center justify-center">
      <div className="w-1.5 h-1.5 theme-accent-bg"></div>
    </div>
    <span className="font-mono text-[10px] theme-text-secondary uppercase tracking-[0.3em] font-bold">{layer}</span>
    <h3 className="font-serif text-4xl theme-text mt-2 mb-4 italic font-bold tracking-tight">{title}</h3>
    <p className="theme-text-secondary text-lg max-w-lg leading-relaxed mb-8 font-serif">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tools.map(tool => (
        <span key={tool} className="px-4 py-1 border border-neutral-800/10 glass-card font-mono text-[9px] theme-text-secondary uppercase tracking-tighter font-bold">
          {tool}
        </span>
      ))}
    </div>
  </div>
);

export const Architecture: React.FC = () => {
  return (
    <section id="architecture" className="py-40 px-6 max-w-7xl mx-auto border-v">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
        <div>
          <div className="w-12 h-px theme-accent-bg mb-10"></div>
          <span className="font-mono text-[10px] uppercase theme-text-secondary block mb-6 tracking-[0.4em] font-bold">Pipeline Architecture</span>
          <h2 className="font-serif text-7xl md:text-8xl theme-text mb-16 font-bold leading-[0.9] tracking-tighter">
            The Protocol<br/>
            <span className="italic font-normal">Substrate.</span>
          </h2>
          <div className="mt-24 space-y-4">
            <PipelineStep 
              layer="Layer 1" 
              title="Vision Substrate" 
              desc="The Immutable Thesis. Every AI interaction begins with a deterministic DNA block. Any drift is a protocol violation."
              tools={['Scripture', 'Truth Anchor', 'Thesis Engine']}
            />
            <PipelineStep 
              layer="Layer 2" 
              title="Neural Lens" 
              desc="The Logic Compiler. Maps continuous reasoning paths into discrete, verifiable Directed Acyclic Graphs (DAGs)."
              tools={['DAG Compiler', 'Reasoning Trace']}
            />
            <PipelineStep 
              layer="Layer 3" 
              title="Adversarial Probe" 
              desc="Entropy Detection. Systematically probes reasoning nodes for circular logic and hallucination masking."
              tools={['Logic Verifier', 'Drift Sensor']}
            />
            <PipelineStep 
              layer="Layer 4" 
              title="Master Signet" 
              desc="Human Attestation. A verified identity binds their cryptographic key to the fully audited reasoning chain."
              tools={['Ed25519 Signature', 'Human-in-the-Loop']}
            />
          </div>
        </div>
        <div className="space-y-10 lg:pt-48">
          <div className="p-12 glass-card relative overflow-hidden group border-l-4 border-l-[var(--accent)]">
            <div className="absolute top-0 right-0 w-32 h-32 theme-accent-bg opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <h4 className="font-mono text-[11px] theme-text-secondary uppercase mb-8 tracking-[0.3em] font-bold">Network Consensus</h4>
            <h2 className="font-serif text-5xl mb-6 italic theme-text font-bold leading-tight">100x Collective Reasoning</h2>
            <p className="theme-text-secondary text-xl leading-relaxed font-serif italic">
              "Trust is a shared compute expense." The Signet Pool distributes the high cost of multi-agent verification across 100 co-signing participants.
            </p>
          </div>
          <div className="p-12 glass-card relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 theme-accent-bg opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <h4 className="font-mono text-[11px] theme-text-secondary uppercase mb-8 tracking-[0.3em] font-bold">Verifier Isolation</h4>
            <h2 className="font-serif text-5xl mb-6 italic theme-text font-bold leading-tight">Generator Independence</h2>
            <p className="theme-text-secondary text-xl leading-relaxed font-serif italic">
              Protocol Draft Section 6: Enforces that the Neural Lens verifier remains architecturally distinct from the Generator to mitigate agreeability bias.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};