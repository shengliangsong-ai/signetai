
import React from 'react';

const PipelineStep: React.FC<{ layer: string; title: string; desc: string; tools: string[] }> = ({ layer, title, desc, tools }) => (
  <div className="relative pl-12 pb-12 last:pb-0 border-l border-neutral-800">
    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-white border-4 border-black"></div>
    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em]">{layer}</span>
    <h3 className="font-serif text-2xl text-white mt-1 mb-3">{title}</h3>
    <p className="text-neutral-400 text-sm max-w-md leading-relaxed mb-4">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tools.map(tool => (
        <span key={tool} className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50 font-mono text-[9px] text-neutral-500">
          {tool}
        </span>
      ))}
    </div>
  </div>
);

export const Architecture: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-x border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="font-mono text-[10px] uppercase text-neutral-500 block mb-4">Execution Protocol</span>
          <h2 className="font-serif text-5xl mb-8">The 4-Layer Pipeline</h2>
          <div className="mt-12">
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
        <div className="space-y-12">
          <div className="p-8 border border-neutral-800 bg-neutral-950">
            <h4 className="font-mono text-[10px] text-neutral-500 uppercase mb-4">Cost Efficiency</h4>
            <h2 className="font-serif text-3xl mb-4 italic">The Signet Pool</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Section 4: Joint Signets. When 100 users authorize a high-cost reasoning task, the resulting Signet is 
              co-signed by the group. This fractionalizes high-fidelity compute costs by 100x.
            </p>
          </div>
          <div className="p-8 border border-neutral-800 bg-neutral-950">
            <h4 className="font-mono text-[10px] text-neutral-500 uppercase mb-4">Independence</h4>
            <h2 className="font-serif text-3xl mb-4 italic">Security Consideration</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Section 6: Signet Protocol ensures the Verifier (Neural Lens) is architecturally independent 
              from the Generator (AI Model) to mitigate "Agreeability Bias."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
