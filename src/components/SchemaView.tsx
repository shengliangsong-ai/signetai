import React from 'react';

export const SchemaView: React.FC = () => {
  const schemaCode = `{
  "$schema": "https://signetai.io/standards/vpr-schema.json",
  "type": "org.signetai.vpr",
  "version": "0.2.6",
  "provenance": {
    "protocol": "Signet-C2PA-Hybrid",
    "c2pa_manifest_id": "urn:uuid:6e8bc431...",
    "vpr_identity_binding": "ed25519:signet_v2.3_8f2d...4a12"
  },
  "assertions": [
    {
      "label": "org.signetai.logic_dag",
      "data": {
        "nodes": 42,
        "root_hash": "sha256:7b8c...44a2"
      }
    },
    {
      "label": "org.signetai.neural_lens_parity",
      "data": {
        "score": 0.9982,
        "status": "deterministic"
      }
    }
  ],
  "signatures": [
    {
      "entity": "HUMAN_MASTER_CURATOR",
      "identity": "ssl.signetai.io",
      "sig": "0x5f9a..."
    }
  ]
}`;

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
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-body)] opacity-40">VPR_MANIFEST_STUB_v0.2.6</span>
        </div>
        <div className="p-8 md:p-12 overflow-x-auto" style={{ backgroundColor: 'var(--code-bg)' }}>
          <pre className="font-mono text-[13px] leading-relaxed border-none p-0 bg-transparent">
            <code>{schemaCode}</code>
          </pre>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)]">
        <a href="#" className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Specification Intro
        </a>
      </div>
    </div>
  );
};