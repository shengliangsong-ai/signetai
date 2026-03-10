> **SignetAI** is a multimodal, real-time AI agent that acts as a cryptographic notary and deepfake detector for digital assets. Operating as a robust multi-page application, it leverages the **Gemini Live API** for voice and a secure **Cloud Function proxy** for text, ensuring a seamless and secure user experience.

## 🏆 Hackathon Requirements Checklist

✅ **Category:** Live Agents 🗣️ (Real-time Interaction with Audio/Vision)
✅ **Mandatory Tech:** Gemini Live API (`gemini-2.5-flash-native-audio-preview`) & Gemini REST API
✅ **Google Cloud:** Firebase Hosting, Firestore Database, Cloud Functions for Firebase
✅ **Text Description:** Provided below in this document.
✅ **Public Code Repository:** [GitHub Repository Link] (Includes spin-up instructions in `README.md`)
✅ **Proof of Google Cloud Deployment:** See `.github/workflows` for automated Firebase deployment, and `src/config/env.ts` and `functions/src/index.ts` for Firebase/Cloud Function initialization.
✅ **Architecture Diagram:** Available in the "Introduction" section of the app and in `architecture.mermaid`.
✅ **Demonstration Video:** Available via the "▶ Run Demo" button in the top menu (4-minute interactive Live Agent narration).
✅ **Bonus - Automated Cloud Deployment:** CI/CD pipeline implemented via GitHub Actions (`.github/workflows/firebase-hosting-merge.yml`).

## Inspiration

In the era of generative AI, the line between reality and synthetic media has vanished. Deepfakes, AI-generated legal documents, and synthetic voice clones are eroding trust in digital intelligence. We realized that the world needs a decentralized, universally accessible "chain of custody" for digital assets. However, cryptographic signing is notoriously complex and intimidating for the average user. 

We were inspired to build **SignetAI** to bridge this gap. By combining Google's Gemini Live API with cryptographic hashing, we envisioned a "Live Digital Notary"—an AI agent that can see, hear, and converse with users in real-time, guiding them through the complex process of verifying and signing digital intelligence as naturally as talking to a human expert.

## What it does

*   **Hybrid Chat Interface:** Interact with the agent via real-time, low-latency voice chat (Live API) or standard text chat. The agent maintains context across both modes.
*   **Multimodal Verification & Diff Engine:** Users can upload or show images and videos. Our custom **Image and Video Diff Engines** work alongside Gemini's vision capabilities to detect tampering, compare versions, and identify synthetic alterations.
*   **Real-Time Guidance:** The agent talks the user through the verification and signing process. Because it uses the Live API, users can interrupt the agent at any time to ask questions.
*   **Universal Media Signing & Key Management:** Once verified, the agent triggers a function call to our **Universal Sign Engine**. It utilizes our built-in **Public/Private Key Registration** system to generate a dual-hash signature of the asset and securely logs the transaction to our Google Cloud backend (Firebase Firestore), creating an immutable record of authenticity.

## How we built it

SignetAI is built on a modern, serverless architecture using Firebase and Google Cloud, featuring a deliberate dual-API design for the Live Assistant.

**The Core Architecture:**

1.  **Frontend:** React, TypeScript, and Tailwind CSS, deployed to **Firebase Hosting**.
2.  **Live Agent (Voice Chat):** For voice, we connect directly to the Gemini Live API (`gemini-2.5-flash-native-audio-preview`) from the client using a WebSocket. This is the intended use pattern for the Live API, providing the lowest possible latency. We use the Web Audio API to stream microphone input and play back the agent's audio response.
3.  **Text Chat (Server-Side Proxy):** For text messages, we implemented a **Firebase Cloud Function** that acts as a secure backend proxy. The frontend calls this function, which then securely calls the standard Gemini REST API using a server-side API key. This follows security best practices by never exposing the standard API key to the client.
4.  **Backend & Storage:** We use **Google Cloud** via Firebase. **Firestore** serves as our real-time database for cryptographic signatures and public keys. **Cloud Functions** power the secure text-chat proxy and provide the foundation for our "Agent Factory" model.
5.  **Cryptography:** All hashing and key management happen client-side via the Web Crypto API, ensuring private keys never leave the user's device.

## Challenges we ran into

**Fixing Post-Deployment Failures with a Backend Proxy:**

Initially, both the voice and text chat functionalities worked perfectly in the local development environment. However, after deploying to Firebase Hosting, the text chat failed completely with a 404 (Not Found) error. We quickly diagnosed the issue: the original design made a direct client-side `fetch` call to a relative path (`/api/chat`) that did not exist on the deployed static site. More importantly, this was an insecure architecture, as it would have required exposing our main `GEMINI_API_KEY` in the browser.

Our solution was to architect a proper backend. We created a **Firebase Cloud Function** to act as a secure proxy. The front-end now sends the text message to this HTTPS endpoint. The Cloud Function, which securely holds the API key as an environment variable, then makes the call to the Gemini REST API on the server side and forwards the response back to the user. This not only fixed the 404 error but also implemented the correct, secure pattern for handling API keys, demonstrating the evolution from a prototype to a production-ready application.

## Accomplishments that we're proud of

*   **Robust Dual-API Architecture:** Successfully implementing a hybrid system that uses the right tool for the job: low-latency WebSockets for voice and a secure, server-side proxy for text.
*   **Zero-Latency Feel:** Integrating the Gemini Live API to create an agent that feels truly conversational and handles interruptions gracefully.
*   **Client-Side Security:** Ensuring that all cryptographic hashing happens locally on the user's device before any metadata is sent to Google Cloud, preserving absolute privacy.
*   **Automated CI/CD:** Setting up a robust GitHub Actions workflow that automatically builds and deploys our application to Firebase Hosting on every merge to the main branch.

## What we learned

We gained a profound understanding of the architectural differences between real-time and standard API interactions. Moving from a single-page app to a full-stack, serverless model with Cloud Functions was a critical step. The challenges highlighted the importance of thinking through production security and infrastructure from the beginning, rather than relying on local development behavior. This experience solidified our understanding of how to build scalable, secure, and feature-rich AI applications using the full suite of Google Cloud and Firebase tools.

## Future Roadmap

Our vision is to make SignetAI the standard protocol for restoring accountability to the AI era.

### Back-End (The "Agent Factory")

Our backend, built on Cloud Functions, is architected as an **"Agent Factory."** This allows for the rapid development and deployment of independent, specialized AI agents to handle discrete tasks, enabling a scalable and auditable system.

*   **Web of Trust Implementation:** Build the backend logic allowing users to vouch for other public keys, creating a queryable trust graph.
*   **Expand Trident Engine Analysis:** Add new analysis modules for detecting audio deepfakes or document tampering.
*   **Public API for Third Parties:** Create secure API endpoints for external developers to integrate Signet verification.
*   **Specialized Compliance Agents:** Deploy new agents for specific tasks, such as a "PII Redaction Agent" or an "SB-53 Compliance Agent."

### Front-End (User Experience)

*   **Secure Key Export/Import:** Allow users to download an encrypted backup of their key vault.
*   **Enhanced Live Assistant UI:** Add a real-time transcription window and a microphone audio visualizer.
*   **Interactive Onboarding Tutorial:** A step-by-step guided tour for new users.
*   **Offline-First Signing:** Utilize service workers to enable signing and verification even without an internet connection.
