# Signet Protocol: Verifiable Proof of Reasoning (VPR)
**Deterministic Telemetry for AI Assets**

The Signet Protocol (draft-song-signet-neural-lens-02) defines a framework for the cryptographic attestation of AI-generated reasoning paths. It utilizes the **Neural Lens** engine to transform non-deterministic LLM outputs into formally verified "Signets."

## 1. Introduction
As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because they only sign the final result, not the process. Signet Protocol introduces **"Process Provenance"** via Verifiable Proof of Reasoning (VPR).

## 2. Core Components
- **2.1. TrustKeyService (TKS)**: A registry of public keys bound to verifiable identities (Google, Government ID, or SignetAI).
- **2.2. Neural Lens Engine**: A deterministic verifier that probes AI telemetry for logic drift and symbolic parity.
- **2.3. The Signet**: A nested cryptographic object containing the VPR Payload (Reasoning Hash, Scores, Metadata) and Multi-layer signatures (Agent, Tool, Human).

## The 4-Layer Execution Pipeline
Every AI asset produced under the Signet standard MUST pass:
1. **Vision Substrate (L1)**: Immutable DNA/Thesis.
2. **Neural Lens (L2)**: DAG Mapping of Reasoning steps.
3. **Adversarial Probing (L3)**: Logic Stress Test.
4. **Human-in-the-Loop (L4)**: Final Curatorial Attestation.

## Quick Start
```bash
# Install the SDK
npm install @signet-ai/sdk

# Check VPR Header of an asset
curl -I https://api.signetai.io/assets/book_01 | grep X-Signet-VPR
```

---
*Signet Protocol addresses "Agreeability Bias" and "Hallucination Masking" by ensuring architectural independence.*
