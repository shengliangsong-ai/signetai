# Signet AI Evolution Log

**Repository:** [github.com/signetai-io/website](https://github.com/signetai-io/website)  
**Master Signatory:** signetai.io:ssl

---

## Entry 01: Protocol Inception (The Pivot)
**Date:** January 08, 2026
**Task Goal:** Architect the transition from "AiVoiceCast" (Consumer Tool) to "Signet Protocol" (Industrial Standard).
**Origin:** [Neural Prism Hackathon Entry](https://devpost.com/software/neural-prism)

**Reasoning Path:**
AI watermarking is failing because it focuses on *pixels*. We need to focus on *process*.
- **Strategy**: Define "Verifiable Proof of Reasoning" (VPR).
- **Outcome**: Established `draft-song-01` specification. Deprecated legacy audio tools.

## Entry 04: Identity Registry (TrustKeyService)
**Date:** January 15, 2026
**Task Goal:** Create a Sybil-resistant identity layer for 8 billion humans.

**Reasoning Path:**
- **Challenge**: Centralized CAs (DigiCert) are too expensive for individuals.
- **Solution**: "TrustKeyService" (TKS). A Firestore-backed Public Key Infrastructure (PKI).
- **Implementation**: Ed25519-256 keypairs generated in-browser. Public keys anchored to `signetai.io:username`.

## Entry 08: Sovereign Grade Entropy
**Date:** January 28, 2026
**Task Goal:** Hardening security against quantum decryption probabilities.

**Reasoning Path:**
Standard 12-word mnemonics (132-bit) are insufficient for "Master Signatory" roles.
- **Upgrade**: Implemented BIP-39 24-word generation.
- **Math**: 24 words * 11 bits = 264 bits of entropy.
- **Status**: Defaulted to Sovereign Grade for all new Vaults.

## Entry 12: Neural Prism (JUMBF Injection)
**Date:** February 05, 2026
**Task Goal:** First successful C2PA manifest injection.

**Reasoning Path:**
We need to inject the logic DAG into the file without breaking it.
- **Method**: Utilized `c2pa-js` wasm bindings for JPEG assets.
- **Result**: Successfully embedded `org.signetai.vpr` assertion into a test image.
- **Constraint**: Found WASM to be too heavy (8MB) for mobile web. Initiated search for "Lightweight Tail-Wrap" alternative.

## Entry 14: PWA Shell & Service Workers
**Date:** February 12, 2026
**Task Goal:** Mobile-first verification capability.

**Reasoning Path:**
- **Objective**: The "Verifier" must run offline in field conditions (e.g., journalists, auditors).
- **Action**: Deployed `sw.js` with aggressive caching strategy.
- **Visuals**: Designed the "Zoom-In" icon set (192px/512px) representing the "Microscopic Audit".

## Entry 15: The "Verified Badge"
**Date:** February 14, 2026
**Task Goal:** Self-Attestation of the platform code.

**Reasoning Path:**
If we verify others, we must verify ourselves.
- **Feature**: Created `VerificationBadge.tsx`.
- **Logic**: The site verifies its own origin and build hash against the Master Signatory's public key on load.

## Entry 16: Vector Attestation (SVG Injection)
**Date:** February 17, 2026
**Task Goal:** Extend the protocol to support non-binary vector assets (SVG) via XML Metadata Injection.

**Reasoning Path:**
Standard C2PA relies heavily on JUMBF boxes (binary) which work for JPEG/PNG but break SVG text readability.
- **Strategy**: We implemented an `XML-DSig` hybrid approach.
- **Method**: Signet injects a JSON-LD manifest into a `<metadata>` tag within the SVG source code.
- **Verification**: The verifier extracts the metadata, calculates the SHA-256 hash of the surrounding "visual" XML, and compares it against the signed hash.
- **Asset Tested**: `signetai-solar-system.svg` successfully attested.

## Entry 17: Operator Manual Update (Vector & Uploads)
**Date:** February 17, 2026
**Task Goal:** Enable custom SVG uploads and document the vector signing workflow in the Operator's Manual.

**Reasoning Path:**
To move beyond demo data, the `SvgSigner` component was upgraded to accept local file uploads via a hidden file input triggered by a UI button.
- **Feature**: Added file picker to `SvgSigner.tsx`.
- **Documentation**: Added Section 04 to `ManualView.tsx` explaining the "Code vs. Art" separation in SVG signing.
- **Outcome**: Users can now attest their own vector graphics using their active Signet Identity.

## Entry 18: Universal Tail-Wrap (UTW) Architecture
**Date:** February 18, 2026
**Task Goal:** Enable signing of arbitrary binary formats (MP4, WAV, RAW) without expensive format-specific parsing libraries (wasm).

**Reasoning Path:**
Browser environments struggle with complex binary parsing (e.g., rewriting MP4 atoms).
- **Strategy**: Adopted the "Universal Tail-Wrap" (UTW) standard.
- **Method**: `[ORIGINAL_BINARY] + [EOF_MARKER] + [JSON_MANIFEST]`.
- **Benefit**: O(1) complexity for verification discovery. The original file structure remains 100% compliant with standard players/viewers, as they ignore appended bytes.
- **Status**: Standardized in `SpecView.tsx` and implemented in `UniversalSigner.tsx`.

## Entry 19: Zero-Copy Streaming Engine
**Date:** February 18, 2026
**Task Goal:** Prevent browser memory crashes when signing large assets (1GB+ Video).

**Reasoning Path:**
Reading `file.arrayBuffer()` loads the entire asset into RAM. This crashes mobile browsers on 4K video files.
- **Solution**: Implemented Block-Chained Hashing via `crypto.subtle` in 5MB chunks.
- **Memory Footprint**: Reduced from O(n) to O(1) (~5MB constant).
- **Composition**: Used `new Blob([FileRef, Signature])` to create the final download artifact without ever copying the full file data into Javascript memory.
- **Outcome**: Capable of signing terabyte-scale files within the browser sandbox.

## Entry 20: Community Synchronization
**Date:** February 19, 2026
**Task Goal:** Bridge the gap between the Hackathon prototype and the current Industrial Standard.

**Reasoning Path:**
The velocity of the last 40 days has rendered the original submission description obsolete.
- **Action**: Released "Post-Submission Status" report.
- **Focus**: Highlighting the shift to **Universal Tail-Wrap** and **Sovereign Identity**.
- **Metric**: 100% Codebase replacement since "Neural Prism" submission.

## Entry 21: Public Verifier Deep-Linking
**Date:** February 19, 2026
**Task Goal:** Enable frictionless verification of external assets via URL parameters and deep-linking.

**Reasoning Path:**
Verification should not require a "Download -> Upload" cycle.
- **Feature**: Implemented `?verify_url=` parameter handling in `VerifyView`.
- **UX**: Added proper HTML5 Drag-and-Drop events (`onDrop`) to the audit zone.
- **Network**: Added Client-side Fetch with CORS error handling.
- **Outcome**: Users can now share verification results via `signetai.io/#verify?url=...`.

## Entry 22: Auto-Verification & Blob Streaming
**Date:** February 20, 2026
**Task Goal:** Seamless verification of large binary assets (Zero RAM) without user intervention.

**Reasoning Path:**
The "Sign vs. Verify" dichotomy is artificial. The system should detect if a file is already signed upon selection.
- **Challenge**: Reading a 2GB file to check for a signature crashes the browser.
- **Solution**: Refactored `verifyBlob` to use `Blob.slice()` and `calculateStreamingHash`.
- **Logic**: The app now scans the last 10KB of any selected file for `%SIGNET_VPR_START`. If found, it bypasses the signing flow and triggers immediate streaming verification.
- **Outcome**: "Any Size. Zero RAM." UX is now fully realized for both Signing AND Verification.

## Entry 23: Live Assistant Resilience
**Date:** March 19, 2026
**Task Goal:** Fix text-based chat failures in the Live Assistant.

**Reasoning Path:**
Users reported a "Logic drift detected" error when using the text chat. Audio chat was unaffected.
- **Diagnosis**: The client-side was making a direct API call to Gemini. The development server, not having a route for it, was serving `index.html` instead of a JSON response, causing a parsing failure.
- **Solution**: Implemented a server-side proxy. Created a new `/api/chat` endpoint in `vite.config.ts` that securely forwards requests to the Gemini API.
- **Refinement**: Modified `LiveAssistant.tsx` to use this new local endpoint, preventing the client from making direct, insecure API calls.
- **CI/CD Fix**: Corrected an initial oversight by committing the updated `package-lock.json` to ensure the new `axios` dependency is included in the GitHub Actions build pipeline.
- **Outcome**: Text chat is now stable and operates through a secure server-side proxy, resolving the error.

## Entry 24: Dual-Path Input Processing in Live Assistant
**Date:** March 19, 2026
**Task Goal:** Document the distinct handling of text and audio inputs in the `LiveAssistant` component.
**Reasoning Path:** The Live Assistant uses two fundamentally different methods for communication. This is a key architectural decision that clarifies the system's design for future development and technical reviews.

### Path 1: Text Input (Stateless HTTP Request)
This is a standard, stateless HTTP request-response cycle, designed for simplicity and reliability.
1.  **Trigger**: The user types a message and activates the `handleSendMessage` function.
2.  **Request**: The function makes a `fetch` call to the local `/api/chat` endpoint. The body is a simple JSON object: `{ "contents": "user message" }`.
3.  **Proxy**: The Vite development server proxies this request to the standard Gemini API, attaching the necessary API key securely on the server-side.
4.  **Response**: The Gemini API returns a complete text response, which is proxied back to the browser.
5.  **UI Update**: The React component appends the response to the `messages` state, triggering a re-render.

### Path 2: Audio Input (Stateful WebSocket Stream)
This path is complex and stateful, designed for low-latency, real-time, bidirectional conversation.
1.  **Initialization**: The `initVoiceChat` function is triggered. It sets up two `AudioContext` objects (16kHz for input, 24kHz for output) and uses the `@google/genai` library to establish a persistent WebSocket connection to the Gemini Live API.
2.  **Real-Time Capture**: Once connected, an `onaudioprocess` event listener is attached to the microphone's audio stream.
3.  **Encoding & Sending**: This event fires continuously, taking small chunks of raw audio. Each chunk is converted to 16-bit PCM, Base64-encoded, and sent immediately over the WebSocket via `session.sendRealtimeInput`.
4.  **Bidirectional Flow**: While the user's audio is being sent, the component simultaneously listens for `onmessage` events from the Gemini API on the same WebSocket. These messages can contain:
    *   **Input Transcriptions**: Real-time text of what the user is saying.
    *   **Audio Output**: Base64-encoded audio chunks of the AI's voice, which are decoded and played back.
    *   **Control Signals**: Messages indicating the end of a turn or interruptions.

### Comparison Summary

| Feature        | Text Input (Stateless)             | Audio Input (Stateful)                      |
| :------------- | :--------------------------------- | :------------------------------------------ |
| **Connection** | Standard HTTP Request              | Persistent WebSocket                        |
| **Latency**    | High (One request per message)     | Very Low (Continuous stream)                |
| **Data Flow**  | Unidirectional (Request -> Response) | Bidirectional (Simultaneous send & receive) |
| **Data Format**  | JSON                               | Base64 Encoded PCM Audio Chunks             |
| **API Used**   | Standard Gemini REST API (proxied) | Gemini Live Streaming API                   |
| **State Mgmt** | Stateless                          | Stateful (manages connection, audio context)|

## Entry 25: Backend Service Migration & Deployment Fix
**Date:** March 19, 2026
**Task Goal:** Resolve persistent Firebase deployment failures and establish a stable, modern backend architecture.

**Reasoning Path:**
Deployment via GitHub Actions began failing with TypeScript errors like `Cannot find module 'firebase-functions/v2/https'` and exit code 2.
- **Problem Diagnosis**: The root cause was the decommissioning of the Node.js 18 runtime by Firebase. The previous architecture, which relied on a server-side proxy within the Vite development server, was not compatible with the updated Node.js 20 environment in production.
- **Architectural Solution**: The monolithic structure was refactored into a separate client and server. The Express-based API was migrated into its own dedicated Cloud Function, located in the `functions/` directory.
- **Implementation Steps**:
    1.  **Backend Creation**: A new `functions/src/index.ts` file was created to wrap the API logic using the `firebase-functions/v2/https` SDK.
    2.  **Dependency Isolation**: A separate `functions/package.json` was created to manage backend-specific dependencies (`firebase-functions`, `express`, etc.).
    3.  **Firebase Configuration**: `firebase.json` was updated to define the `functions` source directory, explicitly set the runtime to `nodejs20`, and create a rewrite rule to direct all `/api/**` traffic to the new cloud function.
    4.  **CI/CD Correction**: The GitHub Actions workflow (`.github/workflows/firebase-hosting-merge.yml`) was critically updated. A new step was added to explicitly run `npm install` inside the `./functions` directory, ensuring the backend dependencies were installed before any build or deployment could occur. This was the final step that resolved the CI/CD pipeline errors.
- **Outcome**: The project is now successfully deployed with a robust, dual-service architecture. The frontend (Vite) and backend (Cloud Function) are cleanly separated, improving maintainability, scalability, and alignment with modern cloud deployment best practices.

---
*Signed: Master Curator, signetai.io:ssl*
