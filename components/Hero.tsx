
import React from 'react';
import { SignetChainVisual } from './SignetChain';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto border-x border-neutral-900">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-tighter text-neutral-400">Mainnet v1.02 Live</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl leading-none gradient-text tracking-tight">
            Accountability<br />Over Truth.
          </h1>
          
          <p className="max-w-xl text-neutral-400 text-lg leading-relaxed">
            In the era of infinite context, consensus is a protocol, not a feeling. 
            SignetAI.io is the <span className="text-white italic">TrustKeyService</span> for the 8 billion. 
            Cryptographically verifiying every reasoning step from Model to Master.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-none hover:bg-neutral-200 transition-colors">
              GENERATE MASTER SIGNET
            </button>
            <button className="px-8 py-4 border border-neutral-700 text-white font-mono text-sm hover:bg-neutral-900 transition-colors">
              IETF-DRAFT-02.pdf
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <SignetChainVisual />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 glass-card">
              <p className="font-mono text-[10px] text-neutral-500 uppercase">Cost Efficiency</p>
              <h3 className="font-serif text-2xl mt-1">100x Pool</h3>
            </div>
            <div className="p-4 glass-card">
              <p className="font-mono text-[10px] text-neutral-500 uppercase">Verification</p>
              <h3 className="font-serif text-2xl mt-1">Neural Lens</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
