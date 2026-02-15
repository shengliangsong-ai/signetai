# Signet Protocol Security Policy

## 1. Risk Assessment (LOG-2026-02-15-C)
- **API Key Leak**: Mitigated. Access is limited via **GCP Referrer Whitelisting** to `signetai.io` and `aivoicecast.com`.
- **Identity Registry**: [FRICTIONLESS DEMO] Registration allows public `create` but strictly prevents `update/delete`. This ensures the "First-to-Claim" demo works without requiring user login, while maintaining record integrity.
- **Data Integrity**: [HARDENED] Ledgers (Bible/Neural) are now **Append-Only** for users. Deletion is restricted to Admins.
- **Privilege Escalation**: [FIXED] User document creation blocks self-assignment of the `admin_neural_prism` group.

## 2. Mandatory GCP Configuration
The security of the unauthenticated Registry depends ENTIRELY on the [GCP Credentials Console](https://console.cloud.google.com/apis/credentials). Verify these settings:

1. **Website Restrictions:**
   - `https://www.signetai.io/*`
   - `https://www.aivoicecast.com/*`
   - `http://localhost:*` (Allowed for dev)

2. **API Restrictions:**
   - Limit key usage to: Firestore, Storage, and Identity Toolkit.

## 3. Deployment Checklist
- [ ] Deploy Firestore Rules (v0.2.6_STABLE)
- [ ] Deploy Storage Rules (v0.2.6_STABLE)
- [ ] Confirm `TrustKeyService` registration works without login.
- [ ] Confirm a standard user cannot delete ledger entries.
