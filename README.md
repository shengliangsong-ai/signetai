
# Signet Protocol: Verifiable Proof of Reasoning (VPR)
**Deterministic Telemetry for AI Assets**

Official Repository: [github.com/signetai-io/website](https://github.com/signetai-io/website)

The Signet Protocol (draft-song-signet-04.0) defines a framework for the cryptographic attestation of AI-generated reasoning paths. It transforms non-deterministic LLM outputs into formally verified "Signets" aligned with C2PA 2.3.

## 1. Introduction
As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because they only sign the final result, not the process. Signet Protocol introduces **"Process Provenance"** via Verifiable Proof of Reasoning (VPR).

## 2. Core Components
- **2.1. TrustKeyService (TKS)**: A registry of public keys bound to verifiable identities.
- **2.2. Neural Lens Engine**: A deterministic verifier that probes AI telemetry for logic drift.
- **2.3. Universal Tail-Wrap (UTW)**: A Zero-Copy injection method for arbitrary binary formats (Video/Audio/PDF).
- **2.4. Signet-Alpha Live Assistant**: A real-time, voice-first AI notary featuring a dynamic 3D animated avatar with lip-sync, eye movement, and voice-responsive gender switching.

## 3. CLI & Developer Tools (New in v0.4.0)
The protocol now includes standalone Node.js tools and a Web Batch Processor.

### 3.1 Batch Processor (Web)
A high-performance audit engine available at `/#batch`.
- **Supported Formats**: Universal support for **Images** (PNG, JPG, SVG), **Video** (MP4, MOV), **Audio** (WAV, MP3), and **Documents** (PDF).
- **Deep Audit**: Slices binary streams to verify original content integrity against appended signatures.
- **Telemetry**: Real-time reporting of **Throughput (MB/s)** and **Velocity (Files/s)**.
- **Dual Strategy**: Supports both **Embedded (UTW)** and **Sidecar (.json)** verification.

### 3.2 Batch Signer (CLI)
Zero-dependency script for recursively signing directory trees.
```bash
# Download from /#cli
node signet-cli.js --dir ./assets --identity "your.name"
```

## 4. Security Standards
- **Public Keys**: Professional-grade **256-bit** Ed25519.
- **Entropy Floor**: **264-bit Sovereign Grade** (24-word mnemonics).
- **Master Signatory**: `signetai.io:ssl`

## The 4-Layer Execution Pipeline
1. **Vision Substrate (L1)**: Immutable DNA/Thesis.
2. **Neural Lens (L2)**: DAG Mapping of Reasoning steps.
3. **Adversarial Probing (L3)**: Logic Stress Test.
4. **Human-in-the-Loop (L4)**: Final Curatorial Attestation.

## Local Development & Compilation (MacBook/Linux)

### API Key Configuration

Signet Protocol uses two different Google Gemini APIs that require different security configurations. For the application to work correctly, you must configure **two separate API keys** in your Google Cloud Console:

1. **Diff Engine (Standard API Key)**
   - **Usage:** Used by the Image and Video Diff Engines for semantic analysis.
   - **Protocol:** Standard HTTP requests (`fetch`).
   - **Security:** Requires **HTTP referrers (web sites)** restriction. To ensure both the Google AI Studio Preview and the live website work, add the following to your restricted websites list:
     - `https://ais-dev-volxjj72guvgx7lp3qo724-21086313823.us-west1.run.app/*` (AI Studio Dev Preview)
     - `https://ais-pre-volxjj72guvgx7lp3qo724-21086313823.us-west1.run.app/*` (AI Studio Shared Preview)
     - `https://www.signetai.io/*` (Production Domain)
   - **Environment Variable:** `GEMINI_API_KEY` (or `API_KEY`)

2. **Signet-Alpha Live Assistant (Live API Key)**
   - **Usage:** Used by the real-time voice assistant (Gemini Live API).
   - **Protocol:** WebSockets (`wss://`).
   - **Security:** Requires **None** for Application restrictions. Browsers **do not** send the `Referer` header when opening a WebSocket connection. If you apply HTTP referrer restrictions to this key, the Live Assistant will fail with a `Requests from referer <empty> are blocked` error.
   - **Environment Variable:** Set this unrestricted key in your environment or select it via the UI when prompted by the Live Assistant.

3. **YouTube Data API (YouTube API Key)**
   - **Usage:** Used by the Universal Signer to verify and fetch metadata for YouTube videos before signing them.
   - **Security:** Can be restricted by **HTTP referrers (web sites)** using the same whitelist as the Diff Engine.
   - **Environment Variable:** `YOUTUBE_API_KEY`

To compile the full Signet Platform offline on your machine:

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/signetai-io/website.git
   cd website
   ```

2. **Install Dependencies**
   This installs React, Vite, Tailwind, and the Google GenAI SDK locally.
   ```bash
   npm install
   ```

3. **Run Development Server**
   Starts a hot-reloading local server at `http://localhost:3000`.
   ```bash
   npm run dev
   ```

4. **Compile for Production**
   Generates a static, offline-ready build in the `dist/` folder.
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   To test the compiled artifacts locally:
   ```bash
   npm run preview
   ```

## Live Documentation
The official technical specification is served directly from the platform. Access it by navigating to:
`https://signetai.io/#spec`

---
*Signet Protocol addresses "Agreeability Bias" and "Hallucination Masking" by ensuring architectural independence.*
