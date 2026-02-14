import React from 'react';

const PipelineStep: React.FC<{ layer: string; title: string; desc: string; tools: string[] }> = ({ layer, title, desc, tools }) => (
  <div className="relative pl-12 pb-12 last:pb-0 border-l border-neutral-800/30">
    <div className="absolute left-[-9px] top-0 w-4 h-4 theme-bg border-4 border-current theme-text"></div>
    <span className="font-mono text-[10px] theme-text-secondary uppercase tracking-[0.2em]">{layer}</span>
    <h3 className="font-serif text-3xl theme-text mt-1 mb-3 italic">{title}</h3>
    <p className="theme-text-secondary text-base max-w-md leading-relaxed mb-6">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tools.map(tool => (
        <span key={tool} className="px-3 py-1 border border-neutral-800/10 glass-card font-mono text-[9px] theme-text-secondary uppercase tracking-tighter">
          {tool}
        </span>
      ))}
    </div>
  </div>
);

export const Architecture: React.FC = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-v">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <span className="font-mono text-[10px] uppercase theme-text-secondary block mb-6 tracking-widest">Protocol Architecture</span>
          <h2 className="font-serif text-6xl theme-text mb-12 font-bold leading-none">The 4-Layer<br/>Pipeline.</h2>
          <div className="mt-16">
            <PipelineStep 
              layer="Layer 1" 
              title="Vision Substrate" 
              desc="The Immutable Thesis. Defines the conceptual DNA of the asset. Any drift is a protocol violation."
              tools={['Workspace', 'Scripture', 'Digital Checker']}
            />
            <PipelineStep 
              layer="Layer 2" 
              title="Neural Lens Compilation" 
              desc="Maps reasoning steps into a Directed Acyclic Graph (DAG). Claims as nodes, dependencies as edges."
              tools={['Code Editor', 'Whiteboard', 'Logic Probes']}
            />
            <PipelineStep 
              layer="Layer 3" 
              title="Adversarial Probing" 
              desc="Logic Stress Test. Decomposes every node to ensure zero circular logic or hallucination masking."
              tools={['VPR Verifier', 'Adversarial Agent']}
            />
            <PipelineStep 
              layer="Layer 4" 
              title="Human-in-the-Loop" 
              desc="The Master Signet. A verified curator signs the DAG with an Ed25519 private key."
              tools={['Podcast Generator', 'Curator Portal']}
            />
          </div>
        </div>
        <div className="space-y-12 lg:pt-32">
          <div className="p-10 glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 theme-accent-bg opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <h4 className="font-mono text-[10px] theme-text-secondary uppercase mb-6 tracking-widest">Efficiency Metrics</h4>
            <h2 className="font-serif text-4xl mb-6 italic theme-text">The Signet Pool</h2>
            <p className="theme-text-secondary text-lg leading-relaxed font-serif">
              "Fractional reasoning reduces the threshold for truth." When 100 users authorize a high-cost reasoning task, the resulting Signet is co-signed, lowering marginal costs by 100x.
            </p>
          </div>
          <div className="p-10 glass-card relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-24 h-24 theme-accent-bg opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <h4 className="font-mono text-[10px] theme-text-secondary uppercase mb-6 tracking-widest">Verification Logic</h4>
            <h2 className="font-serif text-4xl mb-6 italic theme-text">Generator Independence</h2>
            <p className="theme-text-secondary text-lg leading-relaxed font-serif">
              Section 6: Protocol enforces that the Verifier (Neural Lens) remains architecturally distinct from the Generator to mitigate the systemic risk of Agreeability Bias.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};