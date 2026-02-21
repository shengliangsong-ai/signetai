# Compliance Mapping: Signet Protocol v0.3.2

### 1. C2PA v2.3 Alignment
Signet implements mandatory "Hard-Binding" using SHA-256 hashes of raw asset byte streams to prevent metadata stripping.

### 2. ISO/TC 290 (Online Reputation)
The protocol supports trustworthy digital reputation systems by providing verifiable methods for organizations to assert reasoning behind synthetic media.

### 3. NIST CSWP 39 (Cryptographic Agility)
The architecture is built for "Algorithm Agility," allowing the replacement of signing algorithms (e.g., for Post-Quantum security) without breaking the protocol.

### 4. Data Sovereignty
Signet follows a local-first model; all cryptographic operations (Hashing, Signing) occur in the user's secure local sandbox (V8).
