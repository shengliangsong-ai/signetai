## Inspiration
In the era of generative AI, the line between reality and synthetic media has vanished. Deepfakes, AI-generated legal documents, and synthetic voice clones are eroding trust in digital intelligence. We realized that the world needs a decentralized, universally accessible "chain of custody" for digital assets. However, cryptographic signing is notoriously complex and intimidating for the average user. 

We were inspired to build **SignetAI** to bridge this gap. By combining Google's Gemini Live API with cryptographic hashing, we envisioned a "Live Digital Notary"—an AI agent that can see, hear, and converse with users in real-time, guiding them through the complex process of verifying and signing digital intelligence as naturally as talking to a human expert.

## What it does
SignetAI is a multimodal, real-time AI agent that acts as a cryptographic notary and deepfake detector for digital assets. Operating as a robust multi-page application, it leverages the **Gemini Live API** to provide a seamless, voice-first experience.

*   **Multimodal Verification & Diff Engine:** Users can upload or show images and videos. Our custom **Image and Video Diff Engines** work alongside Gemini's vision capabilities to detect tampering, compare versions, and identify synthetic alterations. The agent "sees" the content and explains any anomalies naturally.
*   **Real-Time Guidance:** The agent talks the user through the verification and signing process, explaining complex cryptographic concepts on the fly. Because it uses the Live API, users can interrupt the agent at any time to ask questions (e.g., *"Wait, what exactly did the video diff engine find at timestamp 0:15?"*).
*   **Universal Media Signing & Key Management:** Once verified, the agent executes a function call to trigger our **Universal Sign Engine** (supporting images, videos, and any document). It utilizes our built-in **Public/Private Key Registration** system to generate a dual-hash signature of the asset and securely logs the transaction to our Google Cloud backend (Firebase Firestore), creating an immutable record of authenticity.

## How we built it
SignetAI is built as a modern, serverless multi-page application deployed via automated GitHub Actions to **Firebase Web Hosting**.

**The Core Architecture:**
1.  **Frontend:** React, TypeScript, and Tailwind CSS, structured as a multi-page application for scalable routing and distinct workspaces (Signing, Verifying, Key Management).
2.  **The Live Agent:** We utilized the `@google/genai` SDK to establish a WebSocket connection to `gemini-2.5-flash-native-audio-preview`. We implemented the Web Audio API to capture raw PCM audio from the user's microphone and stream it to Gemini, while simultaneously decoding and playing back Gemini's audio responses.
3.  **Advanced Engines:** We integrated our proprietary Image Diff and Video Diff engines directly into the agent's toolset, allowing it to perform pixel-perfect comparisons and semantic analysis of media.
4.  **Backend & Storage:** We use **Google Cloud** via Firebase. Firestore serves as our real-time database to store the cryptographic signatures and public keys, while Firebase Storage handles any associated media.
5.  **Cryptography:** We implemented client-side hashing and a full Public/Private Key Registration system using the Web Crypto API to ensure files never leave the user's device unencrypted. The core hashing mechanism relies on a dual-hash approach:
    $$ H_{final} = \text{SHA-256}( \text{SHA-256}(Data) \parallel \text{Metadata} ) $$

## Architecture Diagram
[View Architecture Diagram](architecture.svg)

## Challenges we ran into
Integrating real-time, bidirectional audio streaming in the browser was our biggest hurdle. Managing the `AudioContext`, ensuring precise sample rates (16kHz for input, 24kHz for output), and handling raw PCM encoding/decoding without relying on high-level abstractions required deep dives into browser audio APIs. 

Additionally, synchronizing visual frames with the audio stream over the Live API WebSocket connection while maintaining low latency was challenging. We had to implement careful throttling to ensure we didn't overwhelm the connection while still providing the agent with enough visual context to be helpful.

## Accomplishments that we're proud of
*   **Zero-Latency Feel:** Successfully implementing the Gemini Live API to create an agent that feels truly conversational and handles interruptions gracefully.
*   **Client-Side Security:** Ensuring that all cryptographic hashing happens locally on the user's device before any metadata is sent to Google Cloud, preserving absolute privacy.
*   **Automated CI/CD:** Setting up a robust GitHub Actions workflow that automatically builds and deploys our application to Firebase Hosting on every merge to the main branch, fulfilling the bonus requirement for automated Cloud Deployment.

## What we learned
We gained a profound understanding of the complexities of real-time multimodal AI. Moving from traditional "text-in/text-out" LLM interactions to continuous, stateful WebSocket connections completely changed our mental model of application architecture. We also learned how powerful the combination of Google's GenAI SDK and Firebase can be for rapidly prototyping and deploying scalable, serverless applications.

## What's next for Signet AI
Our vision is to make SignetAI the standard protocol for restoring accountability to the AI era. 
*   **Cross-Application Workflows:** We plan to expand the agent's capabilities to act as a UI Navigator, allowing it to observe a user's screen and automatically verify content across different platforms (e.g., verifying a news article directly on a publisher's website).
*   **Decentralized Anchoring:** While we currently use Firestore for speed and reliability, we plan to periodically anchor our cryptographic proofs to a public blockchain for ultimate immutability.
*   **Enterprise Integrations:** Developing APIs so organizations can embed the Signet Live Notary directly into their existing document management systems.
