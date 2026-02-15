import React, { useState } from 'react';

const DefinitionTooltip: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="group relative inline-block ml-1">
    <span className="cursor-help opacity-40 hover:opacity-100 transition-opacity">ⓘ</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black text-white text-[10px] rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-white/10">
      <p className="font-bold mb-1 uppercase tracking-widest text-[var(--trust-blue)]">{title}</p>
      <p className="opacity-70 leading-relaxed italic">{text}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
    </div>
  </div>
);

export const TrustKeyService: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [identity, setIdentity] = useState('');
  const [isActivated, setIsActivated] = useState(false);

  const generateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockKey = 'ed25519:signet_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setPublicKey(mockKey);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <section id="identity" className="py-32 px-6 max-w-7xl mx-auto border-v bg-[var(--bg-sidebar)]/30">
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-10">
          <div className="inline-block">
            <span className="font-mono text-[10px] uppercase bg-[var(--trust-blue)] text-white px-3 py-1 tracking-[0.2em] font-bold rounded-sm">Registry v0.2.5</span>
          </div>
          <h2 className="font-serif text-7xl italic leading-none text-[var(--text-header)] font-bold">TrustKey<br/>Service.</h2>
          <p className="text-[var(--text-body)] opacity-70 text-xl leading-relaxed max-w-md font-serif">
            The decentralized registry for 8 billion identities. Every reasoning path requires a registered Human Curator.
          </p>
          
          <div className="space-y-6 pt-6 border-t border-[var(--border-light)]">
            {[
              { num: '01', title: 'Entropy Harvesting', sub: 'Local device random seeding' },
              { num: '02', title: 'Identity Binding', sub: 'Protocol association' },
              { num: '03', title: 'Activation', sub: 'Mainnet Node Registry entry' }
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-6 group">
                <span className="font-mono text-xs text-[var(--text-body)] opacity-40 group-hover:text-[var(--trust-blue)] group-hover:opacity-100 tracking-tighter transition-colors font-bold">{step.num}</span>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl text-[var(--text-header)] font-bold">{step.title}</h4>
                  <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-widest">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-[var(--bg-standard)] p-10 md:p-16 border border-[var(--border-light)] relative overflow-hidden rounded-lg shadow-xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--trust-blue)] opacity-5 rounded-full blur-3xl"></div>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Protocol Identity</label>
                <input 
                  type="text" 
                  placeholder="name.signet"
                  className="w-full bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-6 font-mono text-xl focus:border-[var(--trust-blue)] focus:outline-none transition-all placeholder:opacity-20"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                />
              </div>

              {!publicKey ? (
                <button 
                  onClick={generateKey}
                  disabled={isGenerating || !identity}
                  className={`w-full py-6 font-mono text-xs uppercase tracking-[0.4em] transition-all shadow-xl font-bold rounded
                    ${isGenerating || !identity 
                      ? 'bg-neutral-500/10 text-neutral-500 cursor-not-allowed' 
                      : 'bg-[var(--trust-blue)] text-white hover:brightness-110 active:scale-[0.98]'}`}
                >
                  {isGenerating ? 'GENERATE_SEED_...' : 'Initialize Registry'}
                </button>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="p-8 bg-[var(--code-bg)] border border-[var(--border-light)] rounded">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-widest font-bold">Hardware Attestation Ready</p>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[9px] font-mono font-bold">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                        SECURE_KEY
                      </div>
                    </div>
                    <p className="font-mono text-xs text-[var(--text-header)] break-all leading-relaxed bg-[var(--bg-sidebar)] p-4 select-all rounded border border-[var(--border-light)]">
                      {publicKey}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <button className="w-full py-4 border border-[var(--text-header)] text-[var(--text-header)] font-mono text-[10px] uppercase tracking-widest hover:bg-[var(--text-header)] hover:text-[var(--bg-standard)] transition-all font-bold rounded">
                        Export Seed
                      </button>
                      <div className="text-center">
                        <span className="text-[9px] font-mono opacity-40">PRIVATE BACKUP</span>
                        <DefinitionTooltip title="Export Seed" text="Saves the encrypted 24-word seed phrase required to recover this identity on other devices." />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <button 
                        onClick={() => setIsActivated(true)}
                        className={`w-full py-4 font-mono text-[10px] uppercase tracking-widest font-bold rounded shadow-lg transition-all
                          ${isActivated 
                            ? 'bg-green-500 text-white' 
                            : 'bg-[var(--trust-blue)] text-white hover:brightness-110 active:scale-95'}`}
                      >
                        {isActivated ? '✓ IDENTITY_ACTIVE' : 'Activate Identity'}
                      </button>
                      <div className="text-center">
                        <span className="text-[9px] font-mono opacity-40">NETWORK REGISTRY</span>
                        <DefinitionTooltip title="Activate Identity" text="Broadcasts your public key to the Signet Mainnet to enable verified reasoning signatures." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="font-mono text-[9px] text-[var(--text-body)] opacity-40 text-center leading-loose tracking-tight italic">
                KEYS GENERATED VIA SIGNET SDK V0.2.1-ALPHA.<br />
                SIGNET AI LABS MAINTAINS ZERO KNOWLEDGE OF PRIVATE KEY SEEDS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};