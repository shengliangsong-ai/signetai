import React from 'react';

const schemaCode = `{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Verifiable Proof of Reasoning (VPR) Manifest",
  "description": "A manifest for a cognitive process, providing a verifiable record of reasoning and assertion.",
  "version": "0.3.0",
  "properties": {
    "claim": "The primary assertion or conclusion of the reasoning process.",
    "agent": {
      "@id": "c2pa.agent"
    },
    "evidence": {
      "@id": "c2pa.assertions",
      "description": "A collection of evidence supporting the claim."
    },
    "reasoning": {
      "description": "A description of the reasoning process used to reach the claim from the evidence.",
      "type": "Text"
    },
    "seal": {
      "description": "A seal providing a human assertion about the content.",
      "type": "Object",
      "properties": {
        "mode": {
          "type": "Text",
          "description": "The type of seal.",
          "enum": ["intent", "review", "authority"]
        },
        "signer": {
          "type": "Text",
          "description": "The identity of the signer."
        }
      },
      "required": ["mode", "signer"]
    },
    "timestamp": {
      "@id": "c2pa.signature_info",
      "description": "The time at which the VPR was created."
    }
  },
  "required": ["claim", "agent", "evidence", "reasoning", "timestamp"]
}`;

export const SchemaView: React.FC = () => {
    return (
        <div className="py-24">
          <div className="mb-12">
            <span className="font-mono text-[10px] uppercase text-[var(--trust-blue)] tracking-[0.4em] font-bold block mb-4">L3 Manifest Draft</span>
            <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">org.signetai.vpr</h1>
            <p className="text-xl mt-6 text-[var(--text-body)] opacity-80">The JSON-LD schema for Verifiable Proof of Reasoning manifests.</p>
          </div>
  
          <div className="border border-[var(--border-light)] rounded overflow-hidden">
            <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-body)] opacity-40">VPR_MANIFEST_STUB_v0.3.0</span>
            </div>
            <div className="p-8 md:p-12 overflow-x-auto" style={{ backgroundColor: 'var(--code-bg)' }}>
              <pre className="font-mono text-[13px] leading-relaxed border-none p-0 bg-transparent">
                <code>{schemaCode}</code>
              </pre>
            </div>
          </div>
        </div>
    );
};
