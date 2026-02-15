# Signet Protocol Specification (v0.2.7)
**Draft-Song-Signet-Neural-Lens-02.7**

## 1. Introduction
This document defines the Signet Protocol, a standard for attaching cryptographic proof of reasoning (VPR) to AI-generated content, aligned with **C2PA 2.3**.

## 2. Global Identity Registry (TrustKey Service)
To ensure the accountability of the 8 billion human curators, the protocol mandates a centralized settlement layer for Identity-to-Key binding.

### 2.1 Identity Uniqueness & Storage
- **System Anchor**: All identities MUST be indexed by a 32-byte deterministic UUID derived from the full hierarchical identity string.
- **Uniqueness**: The Registry MUST enforce a "First-to-Claim" policy. Registration attempts for existing anchor IDs MUST be rejected.

### 2.2 Vault Recovery Protocol (VRP-R)
- **Non-Custodial Root**: The root of trust is a 12-word or 24-word mnemonic seed. 
- **Recovery Logic**: If a user loses their private seed manifest (the local session file), they MAY re-derive their Ed25519 signing key using the BIP39-style mnemonic.

### 2.3 Sovereign Grade Entropy (VPR-S)
As of 2026, the protocol deprecates 160-bit (SHA-1) security for curatorial anchors. Signet implements **Sovereign Grade Entropy** to match the security levels of 256-bit elliptic curves.
- **BIP-39 Math**: The protocol uses a standard dictionary of 2,048 words. Each word provides **11 bits of entropy** ($\log_2(2048) = 11$).
- **Consumer Grade**: 12 words = 132 bits of entropy ($12 \times 11$). Suitable for ephemeral or low-value attestation.
- **Sovereign Grade**: 24 words = **264 bits of entropy** ($24 \times 11$). Required for high-stakes institutional or master curatorial roles. 
- **Security Parity**: 264-bit entropy provides a safety margin above the 256-bit security floor of SHA-256 and Ed25519, ensuring the seed manifest is the strongest link in the provenance chain.

## 3. Manifest Delivery & Strategies
Compliance with C2PA 2.3 requires support for two primary transport modes.

### 3.1 Sidecar Mode (.json)
- Manifests are delivered as standalone JSON-LD objects.
- Recommended for cloud-native pipelines and LLM context injection.

### 3.2 Embedded Mode (Binary Substrate Injection)
- **Technique**: Manifests MUST be injected into the asset binary. 
- **Tail-End Injection**: Signet utilizes a "Tail-End Wrap" for browser-based delivery, where the manifest is appended after the standard EOI (End of Image) marker, enclosed in `SIGNET_VPR_BEGIN` and `SIGNET_VPR_END` tags.

## 4. Cryptographic Requirements
- **Algorithm**: MUST use Ed25519 for all signatures.
- **Hashing**: SHA-256 MUST be used for generating system anchors and content hashes.

## 5. The X-Signet-VPR Header
All Signet-compliant API responses MUST include the `X-Signet-VPR` header.