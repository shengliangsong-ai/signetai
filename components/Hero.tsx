import React from 'react';
import { SignetChainVisual } from './SignetChain';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto border-x border-neutral-900">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-tighter text-neutral-400">Draft-Song-02 Protocol Active</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl leading-none gradient-text tracking-tight">
            Deterministic<br />Telemetry.
          </h1>
          
          <p className="max-w-xl text-neutral-400 text-lg leading-relaxed">
            Move beyond watermarking with <span className="text-white font-mono text-sm border-b border-neutral-700">Process Provenance</span>. 
            Signet Protocol transforms non-deterministic LLM outputs into formally verified "Signets" through 
            Verifiable Proof of Reasoning (VPR).
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href="#tks" 
              className="px-8 py-4 bg-white text-black font-semibold rounded-none hover:bg-neutral-200 transition-colors text-center"
            >
              GENERATE MASTER SIGNET
            </a>
            <a 
              href="#spec" 
              className="px-8 py-4 border border-neutral-700 text-white font-mono text-sm hover:bg-neutral-900 transition-colors text-center"
            >
              TECHNICAL_SPEC_V0.2
            </a>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <SignetChainVisual />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 glass-card">
              <p className="font-mono text-[10px] text-neutral-500 uppercase">Cost Architecture</p>
              <h3 className="font-serif text-2xl mt-1 italic">100x Shared Pool</h3>
            </div>
            <div className="p-4 glass-card">
              <p className="font-mono text-[10px] text-neutral-500 uppercase">Reasoning Proof</p>
              <h3 className="font-serif text-2xl mt-1">VPR Header v0.2</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};