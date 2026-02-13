
import React from 'react';

export const SchemaDefinition: React.FC = () => {
  const schemaCode = `
// TrustKeyService Protocol Schema (v0.2)
// Defined in SignetAI.io Infrastructure

table users {
  id: uuid primary_key
  master_pub_key: ed25519_string
  kyc_verified: boolean
  signet_reputation: int
}

table trust_keys {
  id: uuid primary_key
  owner_id: fkey(users.id)
  provider: enum('SIGNET', 'GOOGLE', 'DEEPSEEK')
  encrypted_seed: blob
  is_active: boolean
}

table neural_retina_mesh {
  id: uuid primary_key
  node_id: string
  parent_nodes: array(uuid)
  symbolic_parity: float // [0.0 - 1.0]
  last_verified_at: timestamp
  master_signet_id: fkey(signets.id)
}

table signet_pools {
  id: uuid primary_key
  session_hash: string
  participant_count: int // Standard: 100
  total_gas_spent: bigint
  multisig_threshold: int
}
`;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-x border-neutral-900 bg-black/40">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h2 className="font-serif text-4xl mb-6 italic">Infrastructure of Trust</h2>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Our schema is designed for a DAG-first architecture. The <strong>Neural Retina Mesh</strong> 
            tracks dependencies across the world's knowledge, while the <strong>Signet Pools</strong> 
            facilitate 100x cost efficiency through shared cryptographic validation.
          </p>
          <ul className="space-y-4 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <li className="flex items-center gap-3"><span className="w-1 h-1 bg-white"></span> Ed25519 Master Signatures</li>
            <li className="flex items-center gap-3"><span className="w-1 h-1 bg-white"></span> VPR Verifier Compatibility</li>
            <li className="flex items-center gap-3"><span className="w-1 h-1 bg-white"></span> Multi-Provider HSM Integration</li>
          </ul>
        </div>
        <div className="flex-[1.5] bg-[#050505] border border-neutral-800 rounded-lg p-6 overflow-x-auto shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-900 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            <span className="font-mono text-[10px] text-neutral-600 ml-4">schema.signet.prisma</span>
          </div>
          <pre className="font-mono text-sm text-neutral-300 leading-relaxed">
            {schemaCode}
          </pre>
        </div>
      </div>
    </section>
  );
};
