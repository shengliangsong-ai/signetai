import React, { useState } from 'react';

export const TrustKeyService: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [identity, setIdentity] = useState('');

  const generateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockKey = 'ed25519:signet_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setPublicKey(mockKey);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <section id="tks" className="py-32 px-6 max-w-7xl mx-auto border-v theme-bg-secondary/50">
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-10">
          <div className="inline-block">
            <span className="font-mono text-[10px] uppercase theme-accent-bg text-white px-2 py-0.5 tracking-[0.2em]">Registry v0.2</span>
          </div>
          <h2 className="font-serif text-7xl italic leading-none theme-text font-bold">TrustKey<br/>Service.</h2>
          <p className="theme-text-secondary text-xl leading-relaxed max-w-md font-serif">
            A secure global registry of public keys bound to verifiable identities. Your digital fingerprint for the accountability era.
          </p>
          
          <div className="space-y-6 pt-6 border-t border-neutral-800/10">
            {[
              { num: '01', title: 'Entropy Harvesting', sub: 'Local device random seeding' },
              { num: '02', title: 'Identity Binding', sub: 'G-ID / Protocol association' },
              { num: '03', title: 'Activation', sub: 'Master Signet capability enabled' }
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-6 group">
                <span className="font-mono text-xs theme-text-secondary group-hover:theme-accent tracking-tighter transition-colors">{step.num}</span>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl theme-text font-bold">{step.title}</h4>
                  <p className="font-mono text-[10px] theme-text-secondary uppercase tracking-widest">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="glass-card p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 theme-accent-bg opacity-5 rounded-full blur-3xl"></div>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-3">
                <label className="font-mono text-[10px] theme-text-secondary uppercase tracking-[0.3em] font-bold">Protocol Identity</label>
                <input 
                  type="text" 
                  placeholder="name.signet"
                  className="w-full theme-bg border-b-2 border-current theme-text p-6 font-mono text-xl focus:theme-accent focus:outline-none transition-all placeholder:opacity-20"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                />
              </div>

              {!publicKey ? (
                <button 
                  onClick={generateKey}
                  disabled={isGenerating || !identity}
                  className={`w-full py-6 font-mono text-xs uppercase tracking-[0.4em] transition-all shadow-xl
                    ${isGenerating || !identity 
                      ? 'bg-neutral-500/10 text-neutral-500' 
                      : 'theme-accent-bg text-white hover:brightness-110 active:scale-[0.98]'}`}
                >
                  {isGenerating ? 'GENERATE_SEED_...' : 'Initialize Registry'}
                </button>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="p-8 bg-current/5 border border-current/20">
                    <p className="font-mono text-[10px] theme-text-secondary uppercase mb-4 tracking-widest">Hardware Attestation Ready</p>
                    <p className="font-mono text-xs theme-text break-all leading-relaxed bg-current/5 p-4 select-all">
                      {publicKey}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-4 border border-current theme-text font-mono text-[10px] uppercase tracking-widest hover:theme-accent-bg hover:text-white transition-all font-bold">
                      Export Seed
                    </button>
                    <button className="flex-1 py-4 theme-accent-bg text-white font-mono text-[10px] uppercase tracking-widest font-bold hover:brightness-110 shadow-lg">
                      Activate Identity
                    </button>
                  </div>
                </div>
              )}

              <p className="font-mono text-[9px] theme-text-secondary text-center leading-loose tracking-tight opacity-50">
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