# Signet Protocol: Verifiable Proof of Reasoning (VPR)
**Deterministic Telemetry for AI Assets**

Official Repository: [github.com/shengliangsong-ai/signetai](https://github.com/shengliangsong-ai/signetai)
Official Website: [https://signetai.web.app](https://signetai.web.app)

The Signet Protocol (draft-song-signet-03.2) defines a framework for the cryptographic attestation of AI-generated reasoning paths. It transforms non-deterministic LLM outputs into formally verified "Signets" aligned with C2PA 2.3.

## 1. Introduction
As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because they only sign the final result, not the process. Signet Protocol introduces **"Process Provenance"** via Verifiable Proof of Reasoning (VPR).

## 2. Core Components
- **2.1. TrustKeyService (TKS)**: A registry of public keys bound to verifiable identities.
- **2.2. Neural Lens Engine**: A deterministic verifier that probes AI telemetry for logic drift.
- **2.3. Universal Tail-Wrap (UTW)**: A Zero-Copy injection method for arbitrary binary formats (Video/Audio/PDF).

## 3. Tools & Utilities

### 3.1. Image Comparator
A web-based utility for visually and algorithmically comparing two images. This tool is an implementation of the **Trident Engine**.

-   **Usage**: Upload two images (Image A and Image B) to initiate the comparison.
-   **Output**:
    -   **Trident Score**: A quantitative score measuring the structural similarity (SSIM) between the two images.
    -   **Visual Diff Map**: An output image that visually highlights the exact areas of difference.

## 4. CLI & Developer Tools (New in v0.3.2)
The protocol now includes standalone Node.js tools and a Web Batch Processor.

### 4.1 Batch Processor (Web)
A high-performance audit engine available at `https://signetai.web.app/batch`.
- **Supported Formats**: Universal support for **Images** (PNG, JPG, SVG), **Video** (MP4, MOV), **Audio** (WAV, MP3), and **Documents** (PDF).
- **Deep Audit**: Slices binary streams to verify original content integrity against appended signatures.
- **Telemetry**: Real-time reporting of **Throughput (MB/s)** and **Velocity (Files/s)**.
- **Dual Strategy**: Supports both **Embedded (UTW)** and **Sidecar (.json)** verification.

### 4.2 Batch Signer (CLI)
Zero-dependency script for recursively signing directory trees.
```bash
# Download from https://signetai.web.app/cli
node signet-cli.js --dir ./assets --identity "your.name"
```

## 5. Security Standards
- **Public Keys**: Professional-grade **256-bit** Ed25519.
- **Entropy Floor**: **264-bit Sovereign Grade** (24-word mnemonics).
- **Master Signatory**: `signetai.io:ssl`

## The 4-Layer Execution Pipeline
1. **Vision Substrate (L1)**: Immutable DNA/Thesis.
2. **Neural Lens (L2)**: DAG Mapping of Reasoning steps.
3. **Adversarial Probing (L3)**: Logic Stress Test.
4. **Human-in-the-Loop (L4)**: Final Curatorial Attestation.

## Local Development & Deployment

This section covers how to run the site locally and deploy it to Firebase Hosting.

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Firebase CLI**: Install globally with `npm install -g firebase-tools`

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/shengliangsong-ai/signetai.git
cd signetai

# Install dependencies
npm install

# Run the local development server (live at http://localhost:3000)
npm run dev
```

### 2. Production Deployment
To deploy the site to the live URL, you must use the Firebase CLI.

```bash
# 1. Authenticate with Firebase (only needs to be done once)
firebase login

# 2. Select the correct Firebase project
firebase use signetai

# 3. Build the production-ready static files
npm run build

# 4. Deploy to Firebase Hosting
firebase deploy --only hosting
```
**Note:** Using `firebase deploy` is essential as it correctly processes the `firebase.json` file, which contains the rewrite rules necessary for the site's routing to work correctly.

## Live Documentation
The official technical specification is served directly from the platform. Access it here:
**https://signetai.web.app/spec**

---
*Signet Protocol addresses "Agreeability Bias" and "Hallucination Masking" by ensuring architectural independence.*
