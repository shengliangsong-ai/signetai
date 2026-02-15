# Signet Protocol Security Policy

## 1. Risk Assessment (LOG-2026-02-15-G)
- **Privilege Escalation**: [NEUTRALIZED] Admin access is strictly hardcoded to `shengliang.song.ai@gmail.com`.
- **Referrer Restrictions**: [ENFORCED] Website whitelisting is active for `*.signetai.io`, `*.aivoicecast.com`, and official Cloud Run endpoints.
- **Referer Spoofing**: [RESIDUAL] API Key remains technically vulnerable to non-browser spoofing via CLI headers.
- **API Key Exposure**: [OPEN] The key is public. Protection relies on Referrer whitelisting (Browser-side) and Firestore Security Rules (Server-side).

## 2. Mandatory GCP Configuration
Referrer shielding is currently ACTIVE. To maintain this:

1. **Authorized Domains:** 
   - Ensure `*.signetai.io/*` and `*.aivoicecast.com/*` are always present in the GCP Credentials Console.
   
2. **API Restrictions:** 
   - The key must be limited to Firestore, Storage, and Identity Toolkit.

## 3. Post-Pivot Hardening (Day 40+)
1. **Rotate API Key**: Recommended.
2. **Firebase App Check**: This is the only way to eliminate CLI-based spoofing. It verifies that requests originate from a signed app/browser instance using ReCAPTCHA Enterprise.
3. **Cloud Functions**: Migrate Registry write operations to server-side code.
