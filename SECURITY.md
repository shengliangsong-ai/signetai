# Signet Protocol Security Policy

## 1. Key Management (TKS-SEC-01)
As of v0.2.6, all sensitive credentials including Firebase API Keys and Signet Authority Private Keys MUST be stored in `private_keys.ts`. This file is explicitly ignored by version control.

## 2. API Key Rotation Policy
- **Incident LOG-2026-02-15**: Detected public exposure of Firebase API Key.
- **Remediation**: 
    1. Key moved to encapsulated storage.
    2. Rotation scheduled in Google Cloud Console.
    3. HTTP Referrer restrictions applied to `*.signetai.io` and `localhost`.

## 3. Deployment Security
Frontend keys are restricted via HTTP Referrer white-listing. Server-side operations for the Neural Lens are handled via protected Cloud Functions using IAM roles, ensuring no administrative keys are exposed to the client substrate.

## 4. Contact
For security disclosures, contact `trust@signetai.io`.
