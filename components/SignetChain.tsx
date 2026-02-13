
import React from 'react';

const SignetLayer: React.FC<{ label: string; sub: string; delay: string; active?: boolean }> = ({ label, sub, delay, active }) => (
  <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${active ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`} style={{ transitionDelay: delay }}>
    <div className={`w-16 h-16 rounded-full border flex items-center justify-center ${active ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-neutral-700'}`}>
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-white' : 'bg-neutral-700'}`}></div>
    </div>
    <div className="text-center">
      <h4 className="font-serif text-lg text-white">{label}</h4>
      <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

export const SignetChainVisual: React.FC = () => {
  return (
    <div className="relative py-12 px-4 glass-card rounded-2xl overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent -translate-y-12"></div>
      
      <div className="flex justify-between items-start max-w-2xl mx-auto relative z-10">
        <SignetLayer label="Foundation" sub="Gemini 3 Pro" delay="0ms" active />
        <div className="h-px w-20 bg-neutral-700 mt-8"></div>
        <SignetLayer label="Execution" sub="Signet SDK v2.1" delay="200ms" active />
        <div className="h-px w-20 bg-neutral-700 mt-8"></div>
        <SignetLayer label="Curator" sub="Master Signet" delay="400ms" active />
      </div>

      <div className="mt-12 text-center">
        <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-neutral-800 text-neutral-400 bg-black">
          PROTOCOL STATUS: DRAFT-SONG-02 ACTIVE
        </span>
      </div>
    </div>
  );
};
