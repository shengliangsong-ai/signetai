import React from 'react';
import { Admonition } from './Admonition';

const ECOSYSTEM_REPOS = [
  {
    name: "signetai",
    tagline: "Core Protocol & SDK",
    desc: "The primary specification, TypeScript SDK, and JUMBF orchestration engine for Signet VPR.",
    status: "v0.2.7_ACTIVE",
    color: "bg-blue-500",
    url: "https://github.com/shengliangsong-ai/signetai"
  },
  {
    name: "signetai-benchmark",
    tagline: "Parity & Logic Scoring",
    desc: "Public test suites and performance metrics for Verifiable Proof of Reasoning (VPR) drift.",
    status: "STABLE",
    color: "bg-emerald-500",
    url: "https://github.com/shengliangsong-ai/signetai-benchmark"
  },
  {
    name: "signetai-tools",
    tagline: "CLI & Injection Utilities",
    desc: "Industrial-grade CLI tools for manifest injection, sidecar generation, and pHash soft-binding.",
    status: "BETA",
    color: "bg-amber-500",
    url: "https://github.com/shengliangsong-ai/signetai-tools"
  },
  {
    name: "signetai-agents",
    tagline: "Autonomous Signing Nodes",
    desc: "Integration layers for LLM reasoning agents to natively sign their own logic paths.",
    status: "DRAFT",
    color: "bg-purple-500",
    url: "https://github.com/shengliangsong-ai/signetai-agents"
  },
  {
    name: "signetai-skills",
    tagline: "Reasoning Attestation Modules",
    desc: "Specialized attestation modules for specific reasoning vertical like math, code, and ethics.",
    status: "EXPERIMENTAL",
    color: "bg-red-500",
    url: "https://github.com/shengliangsong-ai/signetai-skills"
  }
];

export const EcosystemView: React.FC = () => {
  return (
    <div className="py-12 space-y-16 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Protocol Infrastructure</span>
          <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">ECOSYSTEM_v1</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">The Signet Repositories.</h2>
        <p className="text-xl opacity-60 max-w-3xl font-serif italic leading-relaxed">
          Mapped for parity with the official C2PA repository structure. These modules form the backbone of the Cognitive Provenance standard.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ECOSYSTEM_REPOS.map((repo) => (
          <a 
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-10 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm hover:shadow-2xl hover:border-[var(--trust-blue)] transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <span className="font-mono text-[10px] opacity-40 font-bold uppercase tracking-widest">Signet Protocol Group</span>
                <h3 className="font-serif text-3xl font-bold text-[var(--text-header)] group-hover:text-[var(--trust-blue)] transition-colors">{repo.name}</h3>
              </div>
              <div className={`px-3 py-1 rounded-sm text-white font-mono text-[9px] font-bold ${repo.color}`}>
                {repo.status}
              </div>
            </div>

            <p className="font-mono text-[11px] text-[var(--trust-blue)] font-bold uppercase mb-4 tracking-tighter">
              {repo.tagline}
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--text-body)] opacity-70 italic font-serif flex-1">
              {repo.desc}
            </p>

            <div className="mt-8 pt-8 border-t border-[var(--border-light)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-30">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-mono text-[9px] opacity-30 font-bold uppercase">View on GitHub</span>
              </div>
              <span className="text-[var(--trust-blue)] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>

      <Admonition type="note" title="Contribution Model">
        The Signet Protocol follows the "Accountability First" contribution model. All merges into these repositories must be attested by a Master Curator and accompanied by a logic audit trace.
      </Admonition>
    </div>
  );
};