
import React from 'react';

export const SchemaDefinition: React.FC = () => {
  const vprHeaderSample = {
    "X-Signet-VPR": "0.2; 0.998; 0x8f2d...4a12",
    "payload": {
      "version": "0.2",
      "timestamp": 1740000000,
      "artifact": "Book_Podcast_Generator_v1",
      "parity_score": 0.9982,
      "chain": [
        { "entity": "MODEL", "id": "gemini-3-pro", "hash": "sha256:45ea..." },
        { "entity": "TOOL", "id": "podcast-oracle-v2", "hash": "sha256:88bc..." },
        { "entity": "HUMAN", "id": "signet-curator-09", "sig": "ed25519:f9a1..." }
      ],
      "retina_mesh": {
        "nodes": 124,
        "edges": 450,
        "root_thesis": "The Ethics of AI Reasoning"
      }
    }
  };

  const appMapping = [
    { "app": "Scripture", "layer": "L1: VISION_SUBSTRATE", "task": "Truth Anchor" },
    { "app": "Code Editor", "layer": "L2: NEURAL_LENS", "task": "Logic Graphing" },
    { "app": "VPR Verifier", "layer": "L3: ADVERSARIAL", "task": "Drift Detection" },
    { "app": "Podcast Gen", "layer": "L4: HUMAN_SIGNET", "task": "Final Attestation" }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-x border-neutral-900 bg-black/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-4xl mb-4 italic">Sample Artifacts</h2>
            <p className="text-neutral-400 text-sm mb-6">X-Signet-VPR header generation for a Podcast/Book asset.</p>
            <div className="bg-[#050505] border border-neutral-800 rounded p-6 overflow-hidden">
              <pre className="font-mono text-[11px] text-emerald-400/80 leading-tight">
                {JSON.stringify(vprHeaderSample, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="font-serif text-4xl mb-4 italic">App-to-Signet Mapping</h2>
          <p className="text-neutral-400 text-sm mb-6">Functional distribution across the protocol layers.</p>
          <div className="border border-neutral-800">
            <table className="w-full font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <thead className="bg-neutral-900 text-neutral-500">
                <tr>
                  <th className="p-4 text-left border-b border-neutral-800">App</th>
                  <th className="p-4 text-left border-b border-neutral-800">Layer</th>
                  <th className="p-4 text-left border-b border-neutral-800">Protocol Task</th>
                </tr>
              </thead>
              <tbody>
                {appMapping.map(m => (
                  <tr key={m.app} className="border-b border-neutral-900 last:border-0 hover:bg-neutral-900/50 transition-colors">
                    <td className="p-4 text-white">{m.app}</td>
                    <td className="p-4">{m.layer}</td>
                    <td className="p-4 italic">{m.task}</td>
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
