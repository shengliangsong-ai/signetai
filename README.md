
# Signet Protocol: Verifiable Proof of Reasoning (VPR)
**Deterministic Telemetry for AI Assets**

Official Repository: [github.com/signetai-io/website](https://github.com/signetai-io/website)

The Signet Protocol (draft-song-signet-03.2) defines a framework for the cryptographic attestation of AI-generated reasoning paths. It transforms non-deterministic LLM outputs into formally verified "Signets" aligned with C2PA 2.3.

## 1. Introduction
As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because they only sign the final result, not the process. Signet Protocol introduces **"Process Provenance"** via Verifiable Proof of Reasoning (VPR).

## 2. Core Components
- **2.1. TrustKeyService (TKS)**: A registry of public keys bound to verifiable identities.
- **2.2. Neural Lens Engine**: A deterministic verifier that probes AI telemetry for logic drift.
- **2.3. Universal Tail-Wrap (UTW)**: A Zero-Copy injection method for arbitrary binary formats (Video/Audio/PDF).

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

## 5. The 4-Layer Execution Pipeline
1. **Vision Substrate (L1)**: Immutable DNA/Thesis.
2. **Neural Lens (L2)**: DAG Mapping of Reasoning steps.
3. **Adversarial Probing (L3)**: Logic Stress Test.
4. **Human-in-the-Loop (L4)**: Final Curatorial Attestation.

## 6. Future Roadmap
Our vision is to make Signet the standard protocol for restoring accountability to the AI era. Here are some potential avenues for expanding its capabilities:

### 6.1. Front-End (User Experience)
*   **Secure Key Export/Import:** Allow users to download an encrypted backup of their key vault, enabling them to restore their identity on other devices.
*   **Enhanced Live Assistant UI:** Add a real-time transcription window and a microphone audio visualizer to improve user interaction and feedback.
*   **Interactive Onboarding Tutorial:** A step-by-step guided tour for new users to explain key creation, signing, and verification.
*   **Offline-First Signing:** Utilize service workers to enable asset signing and verification even without an internet connection, syncing with the backend when connectivity is restored.

### 6.2. Back-End (Core Power)
*   **Web of Trust Implementation:** Build the backend logic allowing users to vouch for other public keys, creating a queryable trust graph to assess signature reliability.
*   **Expand Trident Engine Analysis:** Add new analysis modules for detecting audio deepfakes or document tampering (e.g., hidden metadata in PDFs).
*   **Public API for Third Parties:** Create secure API endpoints with key management and rate-limiting to allow external developers to integrate Signet verification.
*   **Automated Notification System:** Implement a service to notify users when their signed assets are verified or when their trust network changes.

## 7. Local Development & Compilation (MacBook/Linux)

### API Key Configuration
Signet Protocol uses two different Google Gemini APIs that require different security configurations. For the application to work correctly, you must configure **two separate API keys** in your Google Cloud Console:

1. **Diff Engine (Standard API Key)**
   - **Usage:** Used by the Image and Video Diff Engines for semantic analysis.
   - **Protocol:** Standard HTTP requests (`fetch`).
   - **Security:** Requires **HTTP referrers (web sites)** restriction. To ensure both the Google AI Studio Preview and the live website work, add the following to your restricted websites list:
     - `https://ais-dev-volxjj72guvgx7lp3qo724-21086313823.us-west1.run.app/*`
     - `https://ais-pre-volxjj72guvgx7lp3qo724-21086313823.us-west1.run.app/*`
     - `https://www.signetai.io/*`
   - **Environment Variable:** `GEMINI_API_KEY` (or `API_KEY`)

2. **Signet-Alpha Live Assistant (Live API Key)**
   - **Usage:** Used by the real-time voice assistant (Gemini Live API).
   - **Protocol:** WebSockets (`wss://`).
   - **Security:** Requires **None** for Application restrictions. Browsers **do not** send the `Referer` header when opening a WebSocket connection. If you apply HTTP referrer restrictions to this key, the Live Assistant will fail with a `Requests from referer <empty> are blocked` error.
   - **Environment Variable:** Set this unrestricted key in your environment or select it via the UI when prompted by the Live Assistant.

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
   ```bash
   npm install
   ```
3. **Run Development Server**
   ```bash
   npm run dev
   ```
4. **Compile for Production**
   ```bash
   npm run build
   ```
5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 8. Live Documentation
The official technical specification is served directly from the platform. Access it by navigating to:
`https://signetai.io/#spec`

---
*Signet Protocol addresses "Agreeability Bias" and "Hallucination Masking" by ensuring architectural independence.*
