# Signet Protocol: Technical Architecture & VPR Pipeline

### 1. Verifiable Proof of Reasoning (VPR) Overview
The Signet Protocol (v0.3.2) implements a four-layer cryptographic pipeline to ensure the provenance of AI-generated reasoning paths.

### 2. The Four-Layer Stack
* **L1: Vision Substrate:** Captures and binds the initial intent and prompt "ingredients".
* **L2: Neural Lens (Reasoning Graph):** Generates the Public Reasoning Graph (PRG), a declarative representation of the logic flow encapsulated in JUMBF.
* **L3: Reality Check (Drift Audit):** Performs deterministic probing to calculate the "drift" between the PRG and the final generated output.
* **L4: Human Seal:** The final institutional attestation (Intent, Review, or Authority) using Ed25519 signatures.

### 3. Core Technologies
* **Universal Tail-Wrap (UTW):** Injects provenance manifests into binary assets (PDF, MP4, WAV) without breaking file structure.
* **Recursive SNARKs:** Provides $O(1)$ constant-time verification for large-scale municipal applications.
