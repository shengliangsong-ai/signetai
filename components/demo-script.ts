export const DEMO_SCRIPT = [
  {
    narration: "Hello. I am Signet-Alpha, a sovereign AI notary for the digital world. You have initiated the genesis demonstration sequence. I will now walk you through the evolution of the Signet Protocol, from a simple concept to a global standard for digital trust.",
    type: 'header',
    content: 'Signet Protocol: The Genesis Demo',
    duration: 12000,
  },
  {
    narration: "Our story begins not with a grand design, but with a simple observation at a hackathon called Neural Prism. The prevailing methods of AI watermarking were failing because they focused on pixels, not process. We knew there had to be a better way.",
    type: 'text',
    content: '**Origin:** [Neural Prism Hackathon Entry](https://devpost.com/software/neural-prism)\n**Insight:** AI watermarking is failing because it focuses on *pixels*. We need to focus on *process*.',
    duration: 15000,
  },
  {
    narration: "This led to the first foundational concept: Verifiable Proof of Reasoning. Instead of just marking the final output, we decided to notarize the entire reasoning process of an AI. This creates an unbreakable chain of custody for every digital asset.",
    type: 'code',
    content: `// Draft-Song-01 Specification\ninterface ReasoningStep {\n  stepId: number;\n  prompt: string;\n  response: string;\n  timestamp: number;\n  signature: string; // Signed hash of the step\n}`,
    duration: 15000,
  },
  {
    narration: "But a protocol is useless without a secure identity layer. We developed the TrustKeyService, a Sybil-resistant system designed to provide a unique, sovereign identity for every human on Earth, without relying on centralized authorities.",
    type: 'text',
    content: '**Entry 04: Identity Registry (TrustKeyService)**\n**Goal:** Create a Sybil-resistant identity layer for 8 billion humans.',
    duration: 14000,
  },
    {
    narration: "The real breakthrough came with the development of the Universal Tail-Wrap. Instead of injecting data into the file, which can be fragile, we append a signed, structured metadata block to the end of any file. This is a universally compatible, non-destructive method for notarizing any digital asset.",
    type: 'code',
    content: `// Universal Tail-Wrap Structure\ntype Strategy = 'UNIVERSAL_TAIL_WRAP';\n\nconst asset = readFile('document.pdf');\nconst signature = sign(asset, privateKey);\nconst tailWrap = {\n  asset_hash: sha256(asset),\n  signature: signature,\n  timestamp: Date.now(),\n  protocol_version: '2.0'\n};\n\nconst finalAsset = Buffer.concat([asset, Buffer.from(JSON.stringify(tailWrap))]);`,
    duration: 22000,
  },
  {
    narration: "This allows for frictionless verification. Anyone can verify an asset by simply providing a URL. The verifier fetches the asset, reads the Tail-Wrap, and cryptographically confirms its authenticity and provenance without ever needing to download it.",
    type: 'text',
    content: '**Feature:** Implemented `?verify_url=` parameter handling in `VerifyView`.\n**Outcome:** Users can now share verification results via `signetai.io/#verify?url=...`.',
    duration: 16000,
  },
  {
    narration: "This entire journey, from a hackathon idea to a global protocol, was driven by a core mission: to build a new foundation for digital trust. This concludes the genesis demonstration. The system is now ready for your queries.",
    type: 'header',
    content: 'Demonstration Complete. System Ready.',
    duration: 12000,
  },
];
