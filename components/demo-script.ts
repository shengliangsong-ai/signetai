export const DEMO_SCRIPT = [
  {
    id: 1,
    title: "Cell [1]: The Genesis",
    code: "/*\\n * Signet Protocol: The Genesis Demo\\n * Origin: [Neural Prism Hackathon Entry](https://devpost.com/software/neural-prism)\\n * Insight: AI watermarking is failing because it focuses on *pixels*. We need to focus on *process*.\\n */",
    desc: "Hello. I am Signet-Alpha, a sovereign AI notary for the digital world. You have initiated the genesis demonstration sequence. Our story begins not with a grand design, but with a simple observation: prevailing methods of AI watermarking were failing because they focused on pixels, not process.",
    duration: 15000,
  },
  {
    id: 2,
    title: "Cell [2]: Verifiable Proof of Reasoning",
    code: `// Draft-Song-01 Specification
interface ReasoningStep {
  stepId: number;
  prompt: string;
  response: string;
  timestamp: number;
  signature: string; // Signed hash of the step
}`,
    desc: "This led to the first foundational concept: Verifiable Proof of Reasoning. Instead of just marking the final output, we decided to notarize the entire reasoning process of an AI. This creates an unbreakable chain of custody for every digital asset.",
    duration: 15000,
  },
    {
    id: 3,
    title: "Cell [3]: The Universal Tail-Wrap",
    code: `// Universal Tail-Wrap Structure
type Strategy = \'UNIVERSAL_TAIL_WRAP\';

const asset = readFile(\'document.pdf\');
const signature = sign(asset, privateKey);
const tailWrap = {
  asset_hash: sha256(asset),
  signature: signature,
  timestamp: Date.now(),
  protocol_version: \'2.0\'
};

const finalAsset = Buffer.concat([asset, Buffer.from(JSON.stringify(tailWrap))]);`,
    desc: "The real breakthrough came with the Universal Tail-Wrap. Instead of injecting data into the file, which can be fragile, we append a signed, structured metadata block to the end of any file. This is a universally compatible, non-destructive method for notarizing any digital asset.",
    duration: 22000,
  },
  {
    id: 4,
    title: "Cell [4]: Frictionless Verification",
    code: `// Feature: Implemented \`?verify_url=\` parameter handling
// Outcome: Users can now share verification results via \`signetai.io/#verify?url=...\`

const isValid = await signet.verify(signedMediaURL);
console.log(isValid);
// -> true (Cryptographic Chain of Custody Verified)`,
    desc: "This allows for frictionless verification. Anyone can verify an asset by simply providing a URL. The verifier fetches the asset, reads the Tail-Wrap, and cryptographically confirms its authenticity and provenance without ever needing to download it.",
    duration: 16000,
  },
  {
    id: 5,
    title: "Cell [5]: Demonstration Complete",
    code: "// System Ready",
    desc: "This entire journey, from a hackathon idea to a global protocol, was driven by a core mission: to build a new foundation for digital trust. This concludes the genesis demonstration. The system is now ready for your queries.",
    duration: 12000,
  },
];
