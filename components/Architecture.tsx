
import React from 'react';

const ToolCard: React.FC<{ name: string; description: string; type: string }> = ({ name, description, type }) => (
  <div className="p-6 border border-neutral-800 hover:border-neutral-600 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-serif text-2xl group-hover:italic transition-all">{name}</h3>
      <span className="font-mono text-[9px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 uppercase">{type}</span>
    </div>
    <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
    <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between">
      <span className="font-mono text-[10px] text-neutral-600">SIGNET_SDK_ENABLED</span>
      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
    </div>
  </div>
);

export const Architecture: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-x border-neutral-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-neutral-900">
        <div className="p-12 border-b md:border-b-0 md:border-r border-neutral-900">
          <span className="font-mono text-[10px] uppercase text-neutral-500 block mb-4">The Protocol</span>
          <h2 className="font-serif text-4xl mb-6">Unified Trust Mesh</h2>
          <p className="text-neutral-400 leading-relaxed text-sm">
            All 20+ legacy apps are now <span className="text-white">Signet-Enabled</span>. 
            When a tool generates output, it is signed with a unique Tool-Key linked back to our 
            TrustKeyService. Truth is no longer the metric; accountability is.
          </p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2">
          <ToolCard 
            name="Neural Code" 
            description="LLM-driven IDE where every commit hash is signed by both the reasoning engine and the developer's Master Signet." 
            type="Developer Tool"
          />
          <ToolCard 
            name="Podcast Oracle" 
            description="Multimodal audio generator that embeds watermarked metadata into every byte, tracing back to source transcripts." 
            type="Media Service"
          />
          <ToolCard 
            name="Retina Mesh" 
            description="The DAG-based catalog for the Top 1000 Books project, ensuring symbolic parity between AI summaries and original texts." 
            type="Verification"
          />
          <ToolCard 
            name="Signet Pool" 
            description="Logic sharing platform where 100 users co-fund expensive reasoning runs, creating shared cryptographic custody." 
            type="Economics"
          />
        </div>
      </div>
    </section>
  );
};
