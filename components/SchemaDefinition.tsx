import React from 'react';

export const SchemaDefinition: React.FC = () => {
  const vprHeaderSample = {
    "X-Signet-VPR": "0.2; 0.998; 0x8f2d...4a12",
    "payload": {
      "version": "0.2",
      "timestamp": 1740000000,
      "parity_score": 0.9982,
      "chain": [
        { "entity": "MODEL", "id": "gemini-3-pro", "hash": "sha256:45ea..." },
        { "entity": "TOOL", "id": "podcast-oracle-v2", "hash": "sha256:88bc..." },
        { "entity": "HUMAN", "id": "curator-09", "sig": "ed25519:f9a1..." }
      ]
    }
  };

  const appMapping = [
    { "app": "Scripture", "layer": "L1: VISION", "task": "Truth Anchor" },
    { "app": "Neural Lens", "layer": "L2: COMPILER", "task": "Logic Graphing" },
    { "app": "Verifier", "layer": "L3: ADVERSARIAL", "task": "Drift Detection" },
    { "app": "TKS Hub", "layer": "L4: HUMAN", "task": "Final Attestation" }
  ];

  return (
    <section className="py-40 px-6 max-w-7xl mx-auto border-v theme-bg-secondary/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-[10px] theme-accent tracking-[0.4em] uppercase font-bold">Standard Artifacts</span>
            <h2 className="font-serif text-5xl theme-text font-bold italic">The VPR Payload.</h2>
            <p className="theme-text-secondary font-serif text-lg leading-relaxed">
              Example HTTP header and metadata payload emitted by a Signet-compliant node during asset generation.
            </p>
          </div>
          
          <div className="p-8 rounded-lg shadow-inner overflow-hidden" style={{ backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)' }}>
            <div className="flex gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
            </div>
            <pre className="font-mono text-[12px] theme-text leading-relaxed overflow-x-auto selection:bg-emerald-500/20">
              {JSON.stringify(vprHeaderSample, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-[10px] theme-text-secondary tracking-[0.4em] uppercase font-bold">Ecosystem Distribution</span>
            <h2 className="font-serif text-5xl theme-text font-bold italic">Functional Mapping.</h2>
            <p className="theme-text-secondary font-serif text-lg leading-relaxed">
              How the Signet Protocol layers distribute functional responsibility across the decentralized tool ecosystem.
            </p>
          </div>

          <div className="border border-neutral-800/10 rounded-lg overflow-hidden glass-card">
            <table className="w-full font-mono text-[11px] theme-text-secondary uppercase tracking-wider">
              <thead className="theme-bg-secondary text-neutral-500 border-b border-neutral-800/10">
                <tr>
                  <th className="p-6 text-left font-bold">Component</th>
                  <th className="p-6 text-left font-bold">Protocol Layer</th>
                  <th className="p-6 text-left font-bold">Task</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/10 font-serif lowercase italic text-base">
                {appMapping.map(m => (
                  <tr key={m.app} className="hover:theme-bg-secondary/30 transition-colors">
                    <td className="p-6 theme-text font-bold normal-case font-sans">{m.app}</td>
                    <td className="p-6 font-mono text-[10px] uppercase tracking-tighter not-italic">{m.layer}</td>
                    <td className="p-6 theme-text-secondary opacity-80">{m.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};