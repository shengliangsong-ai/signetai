# Signet Protocol Security Policy

## 1. Key Management (TKS-SEC-01)
As of v0.2.6, all sensitive credentials MUST be stored in `private_keys.ts`. This file is explicitly ignored by version control.

## 2. Deferred Rotation Incident (LOG-2026-02-15)
- **Status**: [MITIGATION ACTIVE / ROTATION DEFERRED]
- **Context**: The Firebase API Key was exposed in a public commit. Due to an active Hackathon Judging Period (frozen deployment at `aivoicecast.com`), full key rotation is deferred for 30 days to maintain uptime for evaluators.

### Phase A: Hardening (ACTIVE)
- **Website Referrer Restrictions**: Applied in GCP Console to only allow requests from specific origins.
- **Whitelist Patterns (Copy these into GCP Console):**
    - `https://www.signetai.io/*`
    - `https://www.aivoicecast.com/*`
    - `https://*-836641670384.us-west1.run.app/*` (Covers all Cloud Run instances)
    - `http://localhost:*` (Development only)

### Phase B: Scheduled Rotation
- **Rotation Date**: March 15, 2026.
- **Action**: Click "Regenerate Key" in GCP Console to invalidate the leaked string `...OKQjYLP0`.

## 3. Why ".run.app" Wildcards?
Google Cloud Run generates unique URLs for every service (e.g., `neural-prism-...`). By using the wildcard `*-836641670384.us-west1.run.app`, you authorize all apps belonging to your Project ID `836641670384` while blocking any other user's Cloud Run apps from stealing your quota.

## 4. Contact
For security disclosures, contact `trust@signetai.io`.
