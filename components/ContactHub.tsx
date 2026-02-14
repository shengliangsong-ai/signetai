import React from 'react';

const ObfuscatedEmail: React.FC<{ user: string; domain: string; label: string }> = ({ user, domain, label }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <a 
      href="#" 
      onClick={handleClick}
      className="group flex items-center justify-between w-full"
    >
      <div className="space-y-1">
        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{label}</p>
        <p className="font-serif text-xl text-white group-hover:text-emerald-400 transition-colors italic">
          {user}<span className="text-neutral-700">@</span>{domain}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 group-hover:text-emerald-400">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </a>
  );
};

export const ContactHub: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-x border-neutral-900">
      <div className="mb-16">
        <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-[0.2em] block mb-4 italic">Verified Communication Channels</span>
        <h2 className="font-serif text-5xl text-white">Signet Contact Hub</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bento Box 1: Leadership */}
        <div className="glass-card p-8 border-neutral-800 hover:border-neutral-700 transition-all">
          <ObfuscatedEmail 
            user="ssl" 
            domain="signetai.io" 
            label="Direct Leadership" 
          />
          <p className="mt-4 text-neutral-500 text-xs leading-relaxed">
            Song Sheng-Liang, Lead Architect. High-level strategic inquiries and foundational protocol direction.
          </p>
        </div>

        {/* Bento Box 2: Technical Specs */}
        <div className="glass-card p-8 border-neutral-800 hover:border-neutral-700 transition-all">
          <ObfuscatedEmail 
            user="spec" 
            domain="signetai.io" 
            label="Protocol & Specs" 
          />
          <p className="mt-4 text-neutral-500 text-xs leading-relaxed">
            IETF Submissions, VPR technical documentation, and symbolic parity verification standards.
          </p>
        </div>

        {/* Bento Box 3: Partnerships */}
        <div className="glass-card p-8 border-neutral-800 hover:border-neutral-700 transition-all">
          <ObfuscatedEmail 
            user="hello" 
            domain="signetai.io" 
            label="SaaS & Partnerships" 
          />
          <p className="mt-4 text-neutral-500 text-xs leading-relaxed">
            General inquiries, partnership opportunities, and ecosystem onboarding for developers.
          </p>
        </div>

        {/* Bento Box 4: Technical Trust */}
        <div className="glass-card p-8 border-neutral-800 hover:border-neutral-700 transition-all">
          <ObfuscatedEmail 
            user="trust" 
            domain="signetai.io" 
            label="Technical Trust" 
          />
          <p className="mt-4 text-neutral-500 text-xs leading-relaxed">
            TrustKeyService (TKS) Registry issues, key recovery, and identity binding verification.
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4 py-4 px-6 bg-emerald-500/5 border border-emerald-500/10 inline-block">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <p className="font-mono text-[10px] text-emerald-500/80 uppercase tracking-widest">
          SLA COMMITMENT: Standard Response Time &lt; 4 hours for Protocol Inquiries.
        </p>
      </div>
    </section>
  );
};