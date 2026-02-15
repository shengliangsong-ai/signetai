import React, { useState } from 'react';

const SPEC_PAGES = [
  {
    title: "Abstract & Introduction",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic underline underline-offset-8 decoration-1 decoration-neutral-500/30">Abstract</h2>
        <p className="indent-12 opacity-80 leading-loose">
          The Signet Protocol defines a framework for the cryptographic attestation of AI-generated reasoning paths. 
          Version 0.2.7 introduces the <strong>Vault Recovery Protocol (VRP-R)</strong> and <strong>Dual-Mode Manifest Delivery</strong>. 
          By utilizing the Neural Lens engine, the protocol transforms non-deterministic LLM outputs into formally verified "Signets," 
          while providing curators with a non-custodial 24-word mnemonic for identity restoration.
        </p>
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">1. Introduction</h2>
        <p className="opacity-80 leading-loose">
          As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because 
          they only sign the final result, not the process. Signet Protocol introduces <span className="text-[var(--text-header)] italic">"Process Provenance"</span> via 
          Verifiable Proof of Reasoning (VPR).
        </p>
      </div>
    )
  },
  {
    title: "Identity & Vault Recovery",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2. Registry & Recovery</h2>
        <p className="opacity-80 leading-loose mb-6">
          Signet identities are anchored to a <strong>System Anchor</strong> in the global registry. If a local curatorial vault is lost, the 
          <strong>Vault Recovery Protocol (VRP-R)</strong> enables the re-derivation of signing keys via a 24-word mnemonic.
        </p>
        <div className="bg-[var(--admonition-bg)] p-8 border-l-4 border-[var(--trust-blue)] space-y-4 rounded-r">
          <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--trust-blue)]">Layer 0: Cryptographic Root</p>
          <ul className="text-xs font-mono opacity-60 space-y-1">
            <li>• ALGORITHM: ED25519-256</li>
            <li>• ENTROPY: 264-BIT SOVEREIGN</li>
            <li>• RECOVERY: VRP-R (24-WORD MNEMONIC)</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Sovereign Entropy (Section 2.3)",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2.3 Sovereign Grade Entropy (VPR-S)</h2>
        <p className="opacity-80 leading-loose">
          Signet implements <strong>Sovereign Grade Entropy</strong> to match the security levels of 256-bit elliptic curves.
        </p>
        <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-[11px] space-y-2">
          <p className="text-[var(--trust-blue)] font-bold">Entropy Calculation:</p>
          <code className="block p-2 bg-black/5 rounded">24 words × 11 bits/word = 264 bits</code>
          <p className="opacity-40 italic mt-4">This exceeds the 256-bit security floor of SHA-256 and Ed25519.</p>
        </div>
      </div>
    )
  },
  {
    title: "Manifest Delivery & JUMBF",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">3. Delivery Strategies</h2>
        <p className="opacity-80 leading-loose">
          Compliance with C2PA 2.3 requires support for two primary transport modes:
        </p>
        <div className="space-y-4">
          <h4 className="font-bold text-[var(--text-header)]">3.1 Sidecar Mode (.json)</h4>
          <p className="opacity-80 leading-loose">Standalone JSON-LD objects for cloud-native pipelines.</p>
          <h4 className="font-bold text-[var(--text-header)]">3.2 Embedded Mode (JUMBF)</h4>
          <p className="opacity-80 leading-loose">Tail-end binary injection via <code>SIGNET_VPR</code> tags.</p>
        </div>
      </div>
    )
  },
  {
    title: "VPR Header & Signing",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">5. The X-Signet-VPR Header</h2>
        <p className="opacity-80 leading-loose">
          All protocol nodes MUST emit an <code>X-Signet-VPR</code> header containing the deterministic reasoning chain hash.
        </p>
        <div className="p-10 border border-dashed border-[var(--border-light)] text-center space-y-4">
           <p className="font-serif italic opacity-50">This document is formally attested and sealed.</p>
           <p className="font-mono text-xs font-bold text-[var(--trust-blue)] uppercase tracking-widest">
             Signed by Master Curator:<br/>shengliang.song.ai:gmail.com
           </p>
        </div>
      </div>
    )
  }
];

export const SpecView: React.FC = () => {
  const [page, setPage] = useState(0);

  const handleDownloadPDF = () => {
    const content = `SIGNET PROTOCOL SPECIFICATION v0.2.7\nOFFICIAL SIGNATORY: shengliang.song.ai:gmail.com\n\n${SPEC_PAGES.map(p => `--- ${p.title} ---\n`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Signet-Protocol-Spec-v0.2.7.txt';
    a.click();
    window.print();
  };

  return (
    <div className="bg-[var(--bg-standard)] text-[var(--text-body)] font-serif text-lg leading-relaxed pt-12 pb-24 px-6 max-w-4xl mx-auto selection:bg-[var(--trust-blue)] selection:text-white">
      <div className="glass-card p-8 md:p-20 shadow-2xl relative border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg min-h-[700px] flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--trust-blue)] opacity-[0.02] -translate-y-32 translate-x-32 rotate-45 pointer-events-none"></div>

        <div className="flex flex-col md:row justify-between mb-12 border-b border-[var(--border-light)] pb-6 text-[11px] font-mono uppercase tracking-[0.3em] opacity-40 font-bold">
          <div className="space-y-1">
            <p>Protocol Working Group | Page {page + 1}/{SPEC_PAGES.length}</p>
            <p>Draft Song-02.7 (C2PA 2.3 Aligned)</p>
          </div>
          <button 
            onClick={handleDownloadPDF}
            className="text-[var(--trust-blue)] hover:underline mt-2 md:mt-0 flex items-center gap-2"
          >
            <span className="text-sm">⭳</span> Download .PDF / Print
          </button>
        </div>

        <div className="mb-12 text-center space-y-4">
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--text-header)] font-bold tracking-tighter leading-tight italic">
            {SPEC_PAGES[page].title}
          </h1>
          <div className="w-12 h-px bg-[var(--trust-blue)] mx-auto"></div>
        </div>

        <div className="flex-1">
          {SPEC_PAGES[page].content}
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border-light)] flex justify-between items-center">
          <button 
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={`opacity-60 hover:opacity-100 transition-colors flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest font-bold ${page === 0 ? 'invisible' : ''}`}
          >
            <span className="text-lg">←</span> Previous
          </button>
          
          <div className="flex gap-2">
            {SPEC_PAGES.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === page ? 'bg-[var(--trust-blue)]' : 'bg-[var(--border-light)]'}`}></div>
            ))}
          </div>

          <button 
            disabled={page === SPEC_PAGES.length - 1}
            onClick={() => setPage(page + 1)}
            className={`opacity-60 hover:opacity-100 transition-colors flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest font-bold ${page === SPEC_PAGES.length - 1 ? 'invisible' : ''}`}
          >
            Next <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};