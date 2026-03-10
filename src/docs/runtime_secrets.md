# How to Set Runtime Secrets for Firebase Functions

This guide explains how to securely manage API keys and other secrets for your Firebase Cloud Functions using Google Cloud Secret Manager.

## Summary

We will create secrets in Google Cloud Secret Manager and grant our Cloud Function's service account permission to access them. This is the most secure method and is recommended by Google.

### Step 1: Create the Secret in Google Cloud

First, you need to create the secret itself. We will do this via the command line.

**1. Create the `GEMINI_API_KEY` Secret:**

Open your terminal and run the following command, replacing `[YOUR_API_KEY]` with your actual Gemini API key.

```bash
echo -n "[YOUR_API_KEY]" | gcloud secrets create GEMINI_API_KEY --replication-policy="automatic" --data-file=- --project=signetai
```

**2. Create the `SIGNET_PROJECT_ID` Secret:**

Next, we'll create a secret to hold the Firebase Project ID. This is useful for environments where the project ID isn't automatically available. **Do not use the reserved name `FIREBASE_PROJECT_ID`.**

```bash
echo -n "signetai" | gcloud secrets create SIGNET_PROJECT_ID --replication-policy="automatic" --data-file=- --project=signetai
```

### Step 2: Grant Access to the Service Account

Your Cloud Function runs using a specific service account. During deployment, Firebase attempts to automatically grant this service account permission to read the secrets you've specified.

1.  **Find your function's service account:** It's often the default Compute Engine service account, e.g., `445715011563-compute@developer.gserviceaccount.com`, or one named `[YOUR_PROJECT_ID]@appspot.gserviceaccount.com`.
2.  **Grant the `Secret Accessor` role:** In an ideal scenario, the deployment process handles this. However, if it fails, you must do it manually (see troubleshooting section).

### Step 3: Update the Cloud Function Code

Finally, update your function's code to declare that it needs these secrets. The Firebase toolchain will automatically make them available as environment variables.

In `functions/src/index.ts`, modify the `onRequest` definition:

```typescript
export const chat = onRequest(
  // Add the names of your secrets to this array
  { cors: true, secrets: ["GEMINI_API_KEY", "SIGNET_PROJECT_ID"] },
  async (req, res) => {
    // Access the secrets from process.env
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SIGNET_PROJECT_ID = process.env.SIGNET_PROJECT_ID;

    // ... rest of your function code
  }
);
```

---

### Troubleshooting: `setIamPolicy` Deployment Failures

If your deployment fails with a `Permission 'secretmanager.secrets.setIamPolicy' denied` error, it means the account running your deployment (e.g., from GitHub Actions) cannot grant the function's service account access to the secrets.

The solution is to grant the access manually **before** deploying.

For a detailed explanation, see `docs/github_actions_deployment.md`.

**Example Fix:**

These commands manually give the function's service account (`445715011563-compute@developer.gserviceaccount.com`) read-access to the secrets, bypassing the need for the deployment to do it.

```bash
# Grant access to the Gemini API Key
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
    --member="serviceAccount:445715011563-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=signetai

# Grant access to the Project ID
gcloud secrets add-iam-policy-binding SIGNET_PROJECT_ID \
    --member="serviceAccount:445715011563-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=signetai
```

After running these commands, re-run your deployment.
git 