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
      <div className="space-y-2">
        <p className="font-mono text-[10px] theme-text-secondary uppercase tracking-[0.2em] font-bold">{label}</p>
        <p className="font-serif text-3xl theme-text group-hover:theme-accent transition-colors italic font-bold">
          {user}<span className="opacity-30">@</span>{domain}
        </p>
      </div>
      <div className="w-12 h-12 rounded-full border border-current theme-text flex items-center justify-center opacity-20 group-hover:opacity-100 transition-all">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </a>
  );
};

export const ContactHub: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-6 max-w-7xl mx-auto border-v">
      <div className="mb-20 text-center max-w-3xl mx-auto space-y-4">
        <span className="font-mono text-[10px] uppercase theme-text-secondary tracking-[0.4em] block font-bold">Verified Communication</span>
        <h2 className="font-serif text-7xl theme-text font-bold tracking-tight">Reach the Labs.</h2>
        <p className="theme-text-secondary font-serif italic text-xl">"Direct inquiry is the antidote to digital noise."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { user: 'ssl', label: 'Direct Leadership', desc: 'Song Sheng-Liang. Strategic vision and foundational protocol direction.' },
          { user: 'spec', label: 'Protocol Standards', desc: 'IETF Submissions, VPR technical documentation, and symbolic standards.' },
          { user: 'hello', label: 'Ecosystem', desc: 'SaaS onboarding, general inquiries, and strategic partnerships.' },
          { user: 'trust', label: 'TKS Registry', desc: 'Identity binding, key recovery issues, and hardware attestation.' }
        ].map((item) => (
          <div key={item.user} className="glass-card p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <ObfuscatedEmail 
              user={item.user} 
              domain="signetai.io" 
              label={item.label} 
            />
            <p className="mt-6 theme-text-secondary text-sm leading-relaxed font-serif italic border-t border-neutral-800/10 pt-6">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex items-center justify-center">
        <div className="flex items-center gap-6 py-4 px-8 theme-accent-bg text-white shadow-xl">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
            Protocol SLA: Guaranteed Response &lt; 4h
          </p>
        </div>
      </div>
    </section>
  );
};