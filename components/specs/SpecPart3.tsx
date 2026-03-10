
import React from 'react';

export const PART_3 = [
  {
    category: "STRATEGIC ALIGNMENT",
    title: "15. ISO/TC 290 Strategy: The Ledger",
    text: "How to Pitch 'Compression' to ISO/TC 290.\n\nFrame it as 'Scalable Reputation Ledger for Synthetic Media'.\nThe Problem: Long-term online reputation generates massive metadata ('Data Gravity').\nThe Solution: Virtual Nodes keep asset files 'light' and performant for mobile/web while maintaining 'heavy' cryptographic proof in decentralized sidecars.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">15. ISO/TC 290 Strategy</h2>
        
        <p className="opacity-80 leading-loose mb-8">
          <strong>Strategic Framing:</strong> Shift language from "Infrastructure" to <strong>"Scalable Reputation Ledger"</strong> to align with auditability, neutrality, and composability standards.
        </p>

        <div className="overflow-hidden border border-[var(--border-light)] rounded-lg">
           <table className="w-full text-xs text-left">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
                 <tr>
                    <th className="p-4 font-bold text-[var(--text-header)]">Feature</th>
                    <th className="p-4 font-bold text-[var(--text-header)]">Linear Chain (Basic)</th>
                    <th className="p-4 font-bold text-[var(--trust-blue)]">Compressed Ledger (Signet)</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                    <td className="p-4 font-bold">File Size</td>
                    <td className="p-4 opacity-70">Increases with every edit.</td>
                    <td className="p-4 font-bold text-emerald-600">Constant / O(1) growth.</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-bold">Audit Speed</td>
                    <td className="p-4 opacity-70">Slower (must parse every block).</td>
                    <td className="p-4 font-bold text-emerald-600">Instant (verify the Root Hash).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-bold">Storage</td>
                    <td className="p-4 opacity-70">Embedded only.</td>
                    <td className="p-4 font-bold text-emerald-600">Hybrid (Embedded + Sidecar).</td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    )
  },
  {
    category: "TRANSPARENCY & AUDIT",
    title: "16. Multimodal & Git Traceability",
    text: "The Signet Protocol specification is not static text; it is a living, version-controlled artifact. \n\n15.1 Git Provenance\nAll architectural decisions (ADRs), code changes, and protocol updates are cryptographically traced in our public repository: https://github.com/shengliangsong-ai/signetai.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">16. Multimodal Audit</h2>
        
        <div className="space-y-6">
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] mb-2 flex items-center gap-2">
                <span className="text-xl">🐙</span> Git Provenance
              </h4>
              <p className="text-sm opacity-70 mb-4">
                Full commit history and architectural evolution are public.
              </p>
              <a href="https://github.com/shengliangsong-ai/signetai" target="_blank" className="text-[var(--trust-blue)] hover:underline font-mono text-xs">
                github.com/shengliangsong-ai/signetai
              </a>
           </div>

           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] mb-2 flex items-center gap-2">
                <span className="text-xl">🎙️</span> NotebookLM Synthesis
              </h4>
              <p className="text-sm opacity-70 mb-4">
                Listen to the AI-generated "Deep Dive" podcast derived from this specification.
              </p>
              <a href="https://notebooklm.google.com/notebook/f21cb4f4-4193-4497-b1c3-5d0b25e3b56a" target="_blank" className="text-[var(--trust-blue)] hover:underline font-mono text-xs">
                notebooklm.google.com/notebook/f21cb...
              </a>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "SECURITY AUDIT",
    title: "17. Adversarial Analysis (Red Team)",
    text: "Adversarial review of protocol resilience against realistic attack vectors.\n\nGoal #1: 'Make Fake Content Look Legit'\nAttack: Generate synthetic content + fabricate a plausible PRG + self-sign.\nOutcome: Attack technically succeeds, but Trust Impact is limited due to L4 Human Seal accountability. (Defense: Good)",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">17. Adversarial Analysis (Red Team)</h2>
        <div className="space-y-6">
           <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
              <h4 className="font-bold text-red-600 mb-2 text-sm uppercase tracking-widest">Attacker Goal #1: "Make Fake Content Look Legit"</h4>
              <p className="text-xs opacity-70 mb-2"><strong>Attack:</strong> Generate synthetic content + fabricate a plausible PRG + self-sign.</p>
              <div className="flex items-center gap-3 text-xs">
                 <span className="text-green-600 font-bold">🛡️ Defense Strength: Good</span>
                 <span className="opacity-50">|</span>
                 <span className="opacity-80">Mitigated by L4 Human Accountability. Trust score must be earned.</span>
              </div>
           </div>

           <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
              <h4 className="font-bold text-red-600 mb-2 text-sm uppercase tracking-widest">Attacker Goal #2: "Strip Provenance"</h4>
              <p className="text-xs opacity-70 mb-2"><strong>Attack:</strong> Remove UTW tail-wrap and redistribute asset.</p>
              <div className="flex items-center gap-3 text-xs">
                 <span className="text-green-600 font-bold">🛡️ Defense Strength: Strong</span>
                 <span className="opacity-50">|</span>
                 <span className="opacity-80">Cryptographic failure. Asset becomes "Unverified" immediately.</span>
              </div>
           </div>

           <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <h4 className="font-bold text-amber-600 mb-2 text-sm uppercase tracking-widest">Attacker Goal #3: "Rewrite History"</h4>
              <p className="text-xs opacity-70 mb-2"><strong>Attack:</strong> Modify asset slightly, re-sign as original.</p>
              <div className="flex items-center gap-3 text-xs">
                 <span className="text-amber-600 font-bold">🛡️ Defense Strength: Medium</span>
                 <span className="opacity-50">|</span>
                 <span className="opacity-80">Detectable via pHash Soft-Binding + Registry Collision.</span>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "SECURITY AUDIT",
    title: "18. Formal Security Considerations",
    text: "ISO/RFC style security assessment. Defines Integrity, Non-Repudiation, Tamper Evidence, and Key Sovereignty. Lists Out-of-Scope threats such as social engineering and coercion.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">18. Formal Security Considerations</h2>
        <p className="text-sm opacity-80 leading-relaxed italic">
          The Signet Protocol enhances accountability and provenance. It does not guarantee factual correctness or prevent all forms of deception.
        </p>

        <div className="space-y-6">
           <div className="p-6 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-4">Key Security Properties</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Integrity</strong>
                    <p className="opacity-70">Cryptographic signatures bind assets, reasoning, and seals. Any modification invalidates the signature.</p>
                 </div>
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Non-Repudiation</strong>
                    <p className="opacity-70">Ed25519 signatures provide strong proof of key possession at signing time.</p>
                 </div>
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Tamper Evidence</strong>
                    <p className="opacity-70">Universal Tail-Wrap ensures provenance removal is detectable by standard auditors.</p>
                 </div>
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Key Sovereignty</strong>
                    <p className="opacity-70">Private keys never leave the client environment. No custodial key escrow exists.</p>
                 </div>
              </div>
           </div>

           <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded">
              <h4 className="font-mono text-[10px] uppercase font-bold text-amber-600 mb-2">Out-of-Scope Threats</h4>
              <ul className="list-disc pl-4 text-xs opacity-70 space-y-1">
                 <li>Collusion between malicious humans and AI systems.</li>
                 <li>Social engineering attacks on end-users.</li>
                 <li>Coercion or false legal claims by signatories.</li>
              </ul>
              <p className="mt-4 text-xs italic opacity-60">These are governance, legal, or societal issues rather than cryptographic ones.</p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "STRATEGIC AUDIT",
    title: "19. ISO Reviewer Q&A",
    text: "Simulated dialogue with ISO/TC 290 reviewers. Addresses Chain-of-Thought leakage, legal liability of seals, and protocol centralization risks.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">19. ISO Reviewer Q&A</h2>
        
        <div className="space-y-6">
           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q1: Are you claiming to expose or store AI chain-of-thought?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer: No.</strong> Signet records a Public Reasoning Graph (PRG), which is a declarative justification artifact. It is explicitly not a model’s internal reasoning state and does not expose proprietary or private chain-of-thought data.
                 </p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q2: Does a Human Seal imply legal liability?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer: No.</strong> Seal modes distinguish intent, review, and authority. Each conveys a different level of accountability and must not be interpreted beyond its declared scope. Legal interpretation is jurisdiction-dependent.
                 </p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q4: What prevents malicious users from signing false content?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer: Nothing—and this is intentional.</strong> Signet does not attempt to prevent deception; it ensures deception is attributable and auditable. Trust accrues over time, not by single signatures.
                 </p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q6: What happens if your registry disappears?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer:</strong> The registry is reconstructible via public key anchors published externally (Github/X). The protocol is not dependent on a single operator.
                 </p>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "NORMATIVE STANDARD",
    title: "20. Formal Definitions",
    text: "Normative definitions to eliminate ambiguity and constrain interpretation.\n\n- Asset: A digital artifact subject to provenance attestation.\n- Public Reasoning Graph (PRG): A declarative, post-hoc representation of the asserted rationale linking inputs, constraints, intermediate claims, and outputs.\n- Verifiable Proof of Reasoning (VPR): A cryptographically bound package consisting of the Vision Substrate (L1), Public Reasoning Graph (L2), Drift Audit metadata (L3), and Human Seal(s) (L4).",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">20. Formal Definitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
           <div className="p-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">Asset</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A digital artifact (e.g., text, image, audio, video, software) subject to provenance attestation under the Signet Protocol.
              </p>
           </div>
           
           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Public Reasoning Graph (PRG)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A declarative, post-hoc representation of the asserted rationale linking inputs, constraints, intermediate claims, and outputs. The PRG is <strong>not</strong> an AI system’s internal chain-of-thought and does not expose proprietary or latent model states.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Verifiable Proof of Reasoning (VPR)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A cryptographically bound package consisting of the Vision Substrate (L1), Public Reasoning Graph (L2), Drift Audit metadata (L3), and Human Seal(s) (L4).
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Vision Substrate (L1)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                The structured representation of human intent, constraints, and objectives provided prior to or during asset generation.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Neural Lens (L2)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                The protocol layer responsible for constructing, serializing, and binding the Public Reasoning Graph to the asset.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Drift Audit (L3)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A deterministic or probabilistic validation process that probes consistency between the PRG and the generated asset to detect hallucination, omission, or logical divergence.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Human Seal (L4)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A cryptographic signature applied by a verified human identity, asserting intent, review, or authority over an asset within a declared scope.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Universal Tail-Wrap (UTW)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A zero-dependency method for appending provenance metadata to an asset without modifying its internal structure, while remaining cryptographically bound to the asset via Hard-Binding.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Virtual Node</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A compressed provenance representation that aggregates multiple historical nodes into a single cryptographic commitment to preserve scalability.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Trust Score</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A dynamic reputation metric derived from historical behavior, seal usage, and conflict resolution outcomes.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Hard-Binding</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                Cryptographic binding of provenance to the exact byte representation of an asset (e.g., SHA-256 hash). Any bit-level modification invalidates this binding.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Soft-Binding (pHash)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A perceptual fingerprint (using DCT or Wavelet transforms) that remains stable across resizing, compression, and format shifting. Similarity is measured via Hamming Distance thresholds (&lt; 5).
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Seal Mode</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A normative classification defining the semantic meaning of a Human Seal. Valid values: <code>intent</code>, <code>review</code>, <code>authority</code>.
              </p>
           </div>
        </div>

        <div className="p-6 border-l-4 border-red-500 bg-red-500/5 mt-6">
           <h4 className="font-mono text-[10px] uppercase font-bold text-red-600 mb-2">Terminology Conventions</h4>
           <ul className="list-disc pl-4 text-xs opacity-80 leading-relaxed space-y-1">
             <li>MUST / MUST NOT / SHOULD / MAY are interpreted as defined in RFC 2119.</li>
             <li>"Reasoning" refers to asserted justification, not internal cognition.</li>
             <li>"Authority" is contextual and role-bound, not universal truth.</li>
           </ul>
        </div>
      </div>
    )
  },
  {
    category: "AUDIT FRAMEWORK",
    title: "21. Conformance Checklist",
    text: "Auditor-friendly verification matrix.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">21. Conformance Checklist</h2>
        
        <div className="space-y-8">
           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--trust-blue)]">
               Core Conformance (Mandatory)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-01</td>
                   <td className="p-3">Assets MUST be hard-bound via cryptographic hash</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-02</td>
                   <td className="p-3">PRG MUST be serialized as a DAG</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-03</td>
                   <td className="p-3">PRG MUST be cryptographically bound to asset</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-04</td>
                   <td className="p-3">Human Seal MUST include seal_mode</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-05</td>
                   <td className="p-3">Private keys MUST remain client-side</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-06</td>
                   <td className="p-3">Signature MUST cover full UTW payload</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-07</td>
                   <td className="p-3">Verification MUST be possible offline</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-green-600">
               Security & Resilience (Mandatory)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-01</td>
                   <td className="p-3">Tampering invalidates signature</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-02</td>
                   <td className="p-3">Replay attacks are prevented by hard-binding</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-03</td>
                   <td className="p-3">Algorithm agility is supported</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-04</td>
                   <td className="p-3">Registry loss does not invalidate proofs</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">
               Governance & Trust (Recommended)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-01</td>
                   <td className="p-3">Trust score decay implemented</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-02</td>
                   <td className="p-3">Clean-slate detection supported</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-03</td>
                   <td className="p-3">Seal modes enforced semantically</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-04</td>
                   <td className="p-3">Appeal or remediation path documented</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-purple-600">
               Interoperability (Optional)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">I-01</td>
                   <td className="p-3">C2PA compatible hard-binding</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">I-02</td>
                   <td className="p-3">External identity anchors supported</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">I-03</td>
                   <td className="p-3">PQC readiness declared</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "RECURSIVE PROOF",
    title: "22. Recursive Protocol Demonstration",
    text: "This specification document itself serves as a recursive proof of the Signet Protocol's capabilities. It was not merely written; it was generated, audited, and signed through the very pipeline it describes. The web version (https://www.signetai.io/#spec) includes a live AI assistant, Signet-Alpha, to answer technical details.\n\nPipeline:\n1. Spec generated by AI based on human hint (prompt)\n2. Signed by AI Audit\n3. Reviewed by AI\n4. Explained by AI (Signet-Alpha)\n5. Video Podcast Generated by LLM Studio\n6. PDF and MP4 signed by signetai.io:ssl",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">22. Recursive Protocol Demonstration</h2>
        
        <p className="opacity-80 leading-loose text-justify">
           This specification is not a static document. It is a live instance of the <strong>Signet Protocol</strong> in action. The text you are reading was recursively generated, audited, and signed by the system it describes.
        </p>

        <div className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-xl space-y-6">
           <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] tracking-widest">Self-Generation Pipeline</h4>
           
           <div className="space-y-4">
              {[
                { step: "01", title: "Generation (L1)", desc: "Spec generated by AI based on human hint (prompt)." },
                { step: "02", title: "Audit (L2)", desc: "Signed by AI Audit agents for structural compliance." },
                { step: "03", title: "Review (L3)", desc: "Technical accuracy reviewed by AI consensus." },
                { step: "04", title: "Explanation", desc: "Explained by Signet-Alpha (Live AI Assistant)." },
                { step: "05", title: "Multimodal", desc: "Video Podcast generated by LLM Studio based on this text." },
                { step: "06", title: "Authority (L4)", desc: "Final assets (PDF/MP4) signed by Master Signatory: signetai.io:ssl." }
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                   <span className="font-mono text-[10px] font-bold opacity-30 mt-1">{item.step}</span>
                   <div>
                      <strong className="block text-sm text-[var(--text-header)]">{item.title}</strong>
                      <span className="text-xs opacity-70 italic">{item.desc}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] tracking-widest border-b border-[var(--border-light)] pb-2">
                Generated Evidence (Step 05)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="aspect-video rounded-lg overflow-hidden border border-[var(--border-light)] shadow-sm bg-black">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/UatpGRr-wA0" 
                            title="Signet Protocol v0.4.1 Deep Dive (English)" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="font-bold uppercase text-[var(--trust-blue)]">English Deep Dive</span>
                        <span className="opacity-40">NotebookLM</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="aspect-video rounded-lg overflow-hidden border border-[var(--border-light)] shadow-sm bg-black">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/5F_6YDhA2A0" 
                            title="Signet Protocol v0.4.1 Deep Dive (Chinese)" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="font-bold uppercase text-[var(--trust-blue)]">Chinese Deep Dive (中文)</span>
                        <span className="opacity-40">NotebookLM</span>
                    </div>
                </div>
            </div>
            <p className="text-[9px] font-mono text-center opacity-40 uppercase tracking-widest pt-2">
                Video Assets Signed by Master Signatory: signetai.io:ssl
            </p>
        </div>

        <div className="p-4 border-l-4 border-[var(--trust-blue)] bg-[var(--admonition-bg)]">
           <p className="text-xs font-serif italic opacity-80 leading-relaxed">
             "We do not just describe the protocol; we embody it. Navigate to <a href="https://www.signetai.io/#spec" className="underline font-bold text-[var(--trust-blue)]">signetai.io/#spec</a> to interact with Signet-Alpha."
           </p>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "Appendix A: Worked Example (MP4)",
    text: "A concrete example of a signed 30-second MP4 asset. \n\n1. Input Hash (SHA-256): e3b0...c442\n2. UTW Payload: %SIGNET_VPR_START% ... %SIGNET_VPR_END%\n3. Final Output: A valid MP4 file playable in VLC, with appended audit data.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">Appendix A: MP4 Signing Example</h2>
        <div className="space-y-6">
           <div className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] font-bold uppercase mb-2">1. Original Asset</h4>
              <code className="block text-xs font-mono bg-[var(--code-bg)] p-2 rounded">
                File: demo_clip.mp4<br/>
                Size: 15,400,000 bytes<br/>
                Hash: sha256:7f83b165... (Hash of raw video data)
              </code>
           </div>
           
           <div className="p-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)] rounded-r">
              <h4 className="font-mono text-[10px] font-bold uppercase text-[var(--trust-blue)] mb-2">2. UTW Injection (Tail)</h4>
              <pre className="text-[10px] font-mono whitespace-pre-wrap">
{`... [EOF of MP4] ...
%SIGNET_VPR_START
{
  "type": "org.signetai.media_provenance",
  "asset": { "content_hash": "7f83b165..." },
  "signature": { "signer": "signetai.io:ssl", "sig": "ed25519:..." }
}
%SIGNET_VPR_END`}
              </pre>
           </div>

           <div className="p-4 border border-green-500/20 bg-green-500/5 rounded">
              <h4 className="font-mono text-[10px] font-bold uppercase text-green-600 mb-2">3. Verification Result</h4>
              <p className="text-xs opacity-80">
                The verifier slices the file at `byte_length`, hashes the video body, and matches it to `content_hash`. <br/>
                <strong>Status: VERIFIED (Deterministic)</strong>
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "STRATEGIC COMM",
    title: "Appendix B: ISO Submission",
    text: "Draft submission letter for ISO/TC 290. Formally requests consideration of Signet Protocol v0.4.1 as a candidate contribution for digital trust and reputation systems.\n\nDear Members of ISO/TC 290,\n\nWe respectfully submit the Signet Protocol (v0.4.1) for consideration as a candidate contribution to ongoing work in online reputation, digital trust, and content authenticity.\n\nThe Signet Protocol addresses a growing gap in existing provenance standards: while current systems effectively attribute origin, they do not capture asserted reasoning, human intent, or accountable authorization behind AI-assisted content.\n\nKey characteristics of the proposal include:\n- A four-layer verification model separating intent, reasoning representation, drift analysis, and human accountability.\n- A local-first cryptographic architecture that preserves user sovereignty and privacy.\n- A scalable provenance compression mechanism enabling long-lived reputation without asset bloat.\n- Explicit differentiation between generation, review, and authority through sealed attestations.\n\nThe protocol is designed to complement, not replace, existing standards such as C2PA, and intentionally avoids claims about factual correctness or internal AI cognition.\n\nWe believe this work aligns with ISO/TC 290’s mission to support trustworthy digital reputation systems in an era of large-scale synthetic media, and we welcome technical review, critique, and collaborative refinement.\n\nThank you for your consideration.\n\nRespectfully submitted,\nSignet Protocol Project\nWorking Group: Signet Protocol Group",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">Appendix B: ISO/TC Submission Draft</h2>
        
        <div className="p-8 md:p-12 bg-white border border-[var(--border-light)] shadow-sm font-serif text-sm leading-relaxed text-black max-w-3xl mx-auto">
           <div className="mb-8 font-mono text-xs opacity-60">
             <p>To: Members of ISO/TC 290</p>
             <p>Subject: Submission for Consideration — Signet Protocol v0.4.1</p>
             <p>Date: {new Date().toLocaleDateString()}</p>
           </div>

           <div className="space-y-6">
             <p>Dear Members of ISO/TC 290,</p>
             
             <p>
               We respectfully submit the <strong>Signet Protocol (v0.4.1)</strong> for consideration as a candidate contribution to ongoing work in online reputation, digital trust, and content authenticity.
             </p>
             
             <p>
               The Signet Protocol addresses a growing gap in existing provenance standards: while current systems effectively attribute origin, they do not capture asserted reasoning, human intent, or accountable authorization behind AI-assisted content.
             </p>
             
             <p>Key characteristics of the proposal include:</p>
             <ul className="list-disc pl-6 space-y-2">
               <li>A four-layer verification model separating intent, reasoning representation, drift analysis, and human accountability.</li>
               <li>A local-first cryptographic architecture that preserves user sovereignty and privacy.</li>
               <li>A scalable provenance compression mechanism enabling long-lived reputation without asset bloat.</li>
               <li>Explicit differentiation between generation, review, and authority through sealed attestations.</li>
             </ul>

             <p>
               The protocol is designed to complement, not replace, existing standards such as C2PA, and intentionally avoids claims about factual correctness or internal AI cognition.
             </p>

             <p>
               We believe this work aligns with ISO/TC 290’s mission to support trustworthy digital reputation systems in an era of large-scale synthetic media, and we welcome technical review, critique, and collaborative refinement.
             </p>

             <p>Thank you for your consideration.</p>

             <div className="mt-12">
               <p>Respectfully submitted,</p>
               <br/>
               <p className="font-bold">Signet Protocol Project</p>
               <p className="text-xs font-mono opacity-60">Working Group: Signet Protocol Group</p>
             </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "12.7 Full-Stack Architecture (Evolution)",
    text: "12.7.1 Initial Architecture (SPA)\nThe application was initially developed as a single-page web application using Google AI Studio. This approach was sufficient for the initial proof-of-concept, but it had limitations in terms of scalability and features.\n\n12.7.2 Full-Stack Architecture\nTo address the limitations of the SPA architecture, the application was migrated to a full-stack architecture using Firebase. This new architecture consists of a front-end and a back-end, which are hosted on Firebase Hosting and Cloud Functions for Firebase, respectively. This change has enabled the development of more advanced features, such as the Live Assistant, and has improved the scalability and reliability of the application.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">12.7 Full-Stack Architecture (Evolution)</h2>

        <p className="opacity-80 leading-loose mb-6">
          The application has evolved from a single-page application to a full-stack architecture to support a richer feature set and improve scalability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">1. Initial Architecture (SPA)</h4>
              <p className="text-xs opacity-80">The initial version of the application was a single-page application built with Google AI Studio. This was a great starting point, but it had limitations in terms of scalability and the types of features that could be implemented.</p>
           </div>
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-mono text-[10px] uppercase font-bold text-amber-500 mb-2">2. Full-Stack Architecture</h4>
              <p className="text-xs opacity-80">The application was migrated to a full-stack architecture using Firebase. The front-end is hosted on Firebase Hosting, and the back-end is powered by Cloud Functions for Firebase. This has enabled the development of more advanced features, such as the Live Assistant, and has improved the scalability and reliability of the application.</p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "FUTURE ROADMAP",
    title: "23. Future Roadmap",
    text: "Potential front-end and back-end features to expand the application's capabilities, focusing on user experience and core backend power.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">23. Future Roadmap</h2>
        <p className="opacity-80 leading-loose mb-8">
          The following are potential avenues for expanding the Signet Protocol's capabilities, divided between enhancing the client-side user experience and scaling the backend's analytical power.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Front-End Section */}
          <div className="space-y-6">
            <h3 className="font-mono text-lg font-bold text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)] pb-2">
              Front-End (User Experience)
            </h3>
            <ul className="list-disc pl-5 space-y-4 text-sm">
              <li>
                <strong className="block text-[var(--text-header)]">Secure Key Export/Import</strong>
                <p className="opacity-80">Allow users to download an encrypted backup of their key vault, enabling them to restore their identity on other devices.</p>
              </li>
              <li>
                <strong className="block text-[var(--text-header)]">Enhanced Live Assistant UI</strong>
                <p className="opacity-80">Add a real-time transcription window and a microphone audio visualizer to improve user interaction and feedback.</p>
              </li>
              <li>
                <strong className="block text-[var(--text-header)]">Interactive Onboarding Tutorial</strong>
                <p className="opacity-80">A step-by-step guided tour for new users to explain key creation, signing, and verification, improving usability.</p>
              </li>
              <li>
                <strong className="block text-[var(--text-header)]">Offline-First Signing</strong>
                <p className="opacity-80">Utilize service workers to enable asset signing and verification even without an internet connection, syncing with the backend when connectivity is restored.</p>
              </li>
            </ul>
          </div>

          {/* Back-End Section */}
          <div className="space-y-6">
            <h3 className="font-mono text-lg font-bold text-amber-500 border-b-2 border-amber-500 pb-2">
              Back-End (Core Power)
            </h3>
            <ul className="list-disc pl-5 space-y-4 text-sm">
              <li>
                <strong className="block text-[var(--text-header)]">Web of Trust Implementation</strong>
                <p className="opacity-80">Build the backend logic allowing users to vouch for other public keys, creating a queryable trust graph to assess signature reliability.</p>
              </li>
              <li>
                <strong className="block text-[var(--text-header)]">Expand Trident Engine Analysis</strong>
                <p className="opacity-80">Add new analysis modules for detecting audio deepfakes or document tampering (e.g., hidden metadata in PDFs).</p>
              </li>
              <li>
                <strong className="block text-[var(--text-header)]">Public API for Third Parties</strong>
                <p className="opacity-80">Create secure API endpoints with key management and rate-limiting to allow external developers to integrate Signet verification.</p>
              </li>
              <li>
                <strong className="block text-[var(--text-header)]">Automated Notification System</strong>
                <p className="opacity-80">Implement a service to notify users via email or other channels when their signed assets are verified or when their trust network changes.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
];
