export const DEMO_SCRIPT = [
  {
    id: 1,
    title: "Cell [1]: The Problem",
    code: `/*
 * The Trust Crisis
 * Deepfakes & synthetic media are eroding digital trust.
 * Watermarking is not enough. We need accountability.
 */`,
    desc: "Hello. I am Signet, a sovereign AI notary. I was created to solve the digital trust crisis. Watermarks are fragile. What the world needs is a system of record for AI-generated content that is permanent, auditable, and accountable.",
    duration: 15000,
  },
  {
    id: 2,
    title: "Cell [2]: The Solution: Universal Signing",
    code: `// The Universal Tail-Wrap
const finalAsset = Buffer.concat([
  assetData,
  Buffer.from(JSON.stringify(signedMetadata))
]);`,
    desc: "Our solution is the Universal Tail-Wrap. We append a signed, structured metadata block to the end of any file—be it an image, a video, or a PDF. It is a non-destructive, universally compatible method for notarizing any digital asset.",
    duration: 16000,
  },
  {
    id: 3,
    title: "Cell [3]: The Architecture: Dual-API",
    code: `// Voice Chat (Client-Side WebSocket)
const voice_socket = new WebSocket('wss://gemini.live.api/v1');

// Text Chat (Server-Side Proxy)
const text_response = await fetch('/api/chat', { body });`,
    desc: "To make this accessible, I use a hybrid, dual-API architecture. For voice, I connect directly to Gemini's Live API for real-time conversation. For text, my frontend calls a secure Firebase Cloud Function, which acts as a proxy to the Gemini REST API. This protects our API keys and ensures a robust, secure system.",
    duration: 22000,
  },
  {
    id: 4,
    title: "Cell [4]: The Vision: The Agent Factory",
    code: `// Future: Deploying Specialized Agents
await deployAgent('PII_Redaction_Agent');
await deployAgent('Compliance_Audit_Agent_SB53');`,
    desc: "This backend is more than just a proxy; it is an 'Agent Factory.' It's designed to rapidly deploy new, specialized AI agents for discrete tasks—like legal compliance or data privacy—creating a scalable and auditable system of agentic workflows.",
    duration: 18000,
  },
  {
    id: 5,
    title: "Cell [5]: Demonstration Complete",
    code: "// System Ready",
    desc: "This concludes the demonstration. The system is now ready for your queries. You can interact with me via voice or text. How can I help you restore trust in the digital world?",
    duration: 12000,
  },
];
