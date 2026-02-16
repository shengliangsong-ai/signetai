import React, { useState } from 'react';
import { Admonition } from './Admonition';

const PIVOT_PHASES = [
  {
    day: "01-10",
    title: "Substrate Hardening",
    tasks: [
      "Deploy C2PATextManifestWrapper (Section A.7)",
      "Encode JUMBF into Unicode Variation Selectors",
      "Mandatory migration to c2pa.actions.v2"
    ]
  },
  {
    day: "11-25",
    title: "Real-time & Merkle Support",
    tasks: [
      "Implement verifiable-segment-info for AI Video",
      "Integrate emsg box transport for fMP4",
      "Build Merkle Piecewise Auditor for large assets"
    ]
  },
  {
    day: "26-40",
    title: "Identity & Trust Alignment",
    tasks: [
      "Map Sovereign Vault to 'Private Credential Storage'",
      "Implement Durable Content Credential discovery",
      "Final ISO/TC 290 attestation audit"
    ]
  }
];

const COMPLIANCE_PILLARS = [
  { 
    title: "Technical Hardening", 
    desc: "Transitioning to HSM/KMS for key management and implementing pHash perceptual binding.",
    status: "85%",
    color: "text-blue-500"
  },
  { 
    title: "User Trust (L1-L3)", 
    desc: "Implementing the official 'Cr' Nutrition Label with progressive disclosure popups.",
    status: "40%",
    color: "text-emerald-500"
  },
  { 
    title: "Interoperability", 
    desc: "Ensuring Signet-signed assets pass Adobe/Microsoft CAI audits natively.",
    status: "92%",
    color: "text-amber-500"
  }
];

export const ComplianceDashboard: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="py-12 space-y-16 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Pivot Command Center</span>
          <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded uppercase">Action Required</span>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">v2.3 Compliance & Execution.</h2>
        <p className="text-xl opacity-60 max-w-3xl font-serif italic">
          Aligning Signet AI with the Jan 2026 C2PA mandate. We are moving from attribution to full logic accountability.
        </p>
      </header>

      {/* 2026 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMPLIANCE_PILLARS.map((p, i) => (
          <div key={i} className="p-8 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm space-y-4 hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-xl font-bold text-[var(--text-header)]">{p.title}</h4>
              <span className={`font-mono text-[12px] font-bold ${p.color}`}>{p.status}</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed font-serif italic">{p.desc}</p>
            <div className="h-1 bg-[var(--border-light)] rounded-full overflow-hidden">
               <div className={`h-full bg-current ${p.color}`} style={{ width: p.status }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Gap Analysis Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-widest border-b border-[var(--border-light)] pb-2">Architectural Gap Analysis (v0.2.7 vs v2.3)</h3>
          <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)] font-mono text-[9px] opacity-40 uppercase">
                <tr>
                  <th className="px-6 py-4">Standard Aspect</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Logic Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)] font-serif italic">
                <tr>
                  <td className="px-6 py-4"><strong>Unstructured Text</strong></td>
                  <td className="px-6 py-4 opacity-70">JSON Sidecar only</td>
                  <td className="px-6 py-4 text-right text-red-500 font-bold font-mono">UNICODE_VS (A.7)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4"><strong>Live Video</strong></td>
                  <td className="px-6 py-4 opacity-70">Periodic Snapshots</td>
                  <td className="px-6 py-4 text-right text-amber-500 font-bold font-mono">EMSG_SEGMENT (19.4)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4"><strong>Action Labels</strong></td>
                  <td className="px-6 py-4 opacity-70">actions.v1</td>
                  <td className="px-6 py-4 text-right text-blue-500 font-bold font-mono">DEPRECATED -> v2</td>
                </tr>
                <tr>
                  <td className="px-6 py-4"><strong>Hashing Model</strong></td>
                  <td className="px-6 py-4 opacity-70">SHA-256 Blobs</td>
                  <td className="px-6 py-4 text-right text-neutral-400 font-bold font-mono">MERKLE_PIECEWISE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Admonition type="important" title="Mandatory v2.3 Schema">
            Section 18.15.2 Mandate: All new manifests MUST include 'actions.v2' as the root assertion label. v1 parsing will be disabled in the 30-day registry freeze.
          </Admonition>
        </div>

        {/* 40-Day Pivot Execution Plan */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-widest border-b border-[var(--border-light)] pb-2">40-Day Execution Plan</h3>
          <div className="space-y-4">
            {PIVOT_PHASES.map((phase, i) => (
              <div 
                key={i} 
                onClick={() => setActivePhase(i)}
                className={`p-6 border rounded-lg cursor-pointer transition-all ${
                  activePhase === i ? 'border-[var(--trust-blue)] bg-[var(--admonition-bg)] shadow-md' : 'border-[var(--border-light)] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[9px] font-bold text-[var(--trust-blue)]">PHASE_{i+1}</span>
                  <span className="font-mono text-[9px] opacity-40">DAYS {phase.day}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[var(--text-header)] mb-4">{phase.title}</h4>
                <ul className="space-y-2">
                  {phase.tasks.map((task, j) => (
                    <li key={j} className="flex gap-3 text-[11px] font-serif italic leading-tight">
                      <span className="text-[var(--trust-blue)] text-xs">■</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-xl space-y-6">
         <h3 className="font-serif text-2xl font-bold italic text-[var(--text-header)]">Soft-Binding & Perceptual Parity</h3>
         <p className="opacity-70 text-sm leading-relaxed max-w-2xl font-serif italic">
           To survive "metadata scrubbing" on social platforms, Signet implements Section 9.3 (Soft Bindings). If an image loses its JUMBF header, the verifier uses pHash to recover the manifest from our cloud repository.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-6 bg-black/5 rounded border border-black/5 font-mono text-[10px] space-y-2">
               <p className="text-[var(--trust-blue)] font-bold">// Soft Binding Discovery Logic</p>
               <code className="block opacity-60 text-xs">const substrate = compute_pHash(target_asset);</code>
               <code className="block opacity-60 text-xs">const manifest = repository.find(substrate);</code>
               <code className="block text-green-600 font-bold">Status: Durable Content Credential Active</code>
            </div>
            <div className="flex items-center gap-6 opacity-30">
               <span className="text-4xl">🌫️</span>
               <span className="text-2xl">→</span>
               <span className="text-4xl">🛡️</span>
               <p className="text-[10px] font-mono uppercase tracking-widest leading-tight">Stripped Asset <br/>Recovery via pHash</p>
            </div>
         </div>
      </div>

      <footer className="pt-10 border-t border-[var(--border-light)] flex justify-between items-center opacity-40 italic font-serif text-sm">
        <p>Execution Plan attested by signetai.io:ssl</p>
        <p>Current Sprint: v2.3_PIVOT_R1</p>
      </footer>
    </div>
  );
};