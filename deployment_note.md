# Full-Stack Deployment Guide for Signet API

This guide provides the correct two-step process to deploy both the frontend website and the backend API function.

**DO THIS ONLY ONCE (per secret):**

### Step 1: Set Runtime Secrets in Google Cloud

Your backend needs API keys and configuration to function. A local `.env` file is not used by the live server. You must set these secrets directly in Google Cloud using the `gcloud` CLI.

**1. Set the `GEMINI_API_KEY`:**

Run this command in your terminal, replacing `[YOUR_GEMINI_API_KEY]` with your real key.

```bash
echo -n "[YOUR_GEMINI_API_KEY]" | gcloud secrets create GEMINI_API_KEY --replication-policy="automatic" --data-file=- --project=signetai
```

**2. Set the `SIGNET_PROJECT_ID`:**

```bash
echo -n "signetai" | gcloud secrets create SIGNET_PROJECT_ID --replication-policy="automatic" --data-file=- --project=signetai
```

These are typically one-time setup steps. You do not need to do them again unless your keys or project ID change.

**DO THIS EVERY TIME YOU DEPLOY:**

### Step 2: Deploy Both Frontend and Backend

The command `firebase deploy --only hosting` is incomplete as it only deploys the website and ignores the backend function.

To deploy everything correctly, use this command:

```bash
firebase deploy
```

This command will:
1.  Read your `firebase.json` file.
2.  Deploy your frontend from the `dist` folder to Firebase Hosting.
3.  Deploy your backend from the `functions` folder to Cloud Functions.
4.  Correctly link them together so that `https://www.signetai.io/api/chat` works.

---

**Summary:**
1.  Run the `gcloud secrets create` commands once to store your secrets.
2.  Run `firebase deploy` every time you want to update your live application.
