import React from 'react';

export const SchemaView: React.FC = () => {
  const schemaCode = `{
  "$schema": "https://signetai.io/standards/vpr-schema.json",
  "type": "org.signetai.vpr",
  "version": "0.2.2",
  "provenance": {
    "protocol": "C2PA-Signet-Hybrid",
    "c2pa_manifest_id": "urn:uuid:6e8bc431...",
    "vpr_identity_binding": "ed25519:signet_8f2d...4a12"
  },
  "assertions": [
    {
      "label": "org.signetai.logic_dag",
      "data": {
        "nodes": 42,
        "edges": 84,
        "root_hash": "sha256:7b8c...44a2"
      }
    },
    {
      "label": "org.signetai.neural_lens_parity",
      "data": {
        "score": 0.9982,
        "drift_threshold": 0.05,
        "status": "deterministic"
      }
    }
  ],
  "signatures": [
    {
      "entity": "HUMAN_MASTER_CURATOR",
      "identity": "ssl.signet",
      "sig": "0x5f9a..."
    }
  ]
}`;

  return (
    <div className="min-h-screen theme-bg theme-text pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <span className="font-mono text-[10px] uppercase theme-accent tracking-[0.4em] font-bold block mb-4">Developer Reference</span>
        <h1 className="font-serif text-6xl font-bold italic tracking-tighter">org.signetai.vpr</h1>
        <p className="theme-text-secondary font-serif text-xl mt-6 italic">The official JSON schema for Verifiable Proof of Reasoning manifests.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b-theme theme-bg-secondary flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">JSON-LD Compliant Artifact</span>
        </div>
        <div className="p-8 md:p-12 overflow-x-auto" style={{ backgroundColor: 'var(--code-bg)' }}>
          <pre className="font-mono text-[13px] leading-relaxed selection:bg-emerald-500/20">
            <code className="theme-text-secondary">{schemaCode}</code>
          </pre>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
        <div className="space-y-4">
          <h4 className="font-bold text-xl italic underline underline-offset-8 decoration-1 decoration-neutral-500/20">Compliance Note</h4>
          <p className="theme-text-secondary text-sm leading-relaxed">
            The `org.signetai.vpr` assertion MUST be embedded within the standard C2PA metadata store to maintain hybrid compliance. Implementations lacking the VPR assertion will be downgraded to "Attributed" status.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-xl italic underline underline-offset-8 decoration-1 decoration-neutral-500/20">Identity Mapping</h4>
          <p className="theme-text-secondary text-sm leading-relaxed">
            The `vpr_identity_binding` key MUST match the public key registered in the Signet TrustKeyService (TKS) for a specific identity domain.
          </p>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t-theme text-center">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="theme-text-secondary hover:theme-text font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Core Interface
        </a>
      </div>
    </div>
  );
};