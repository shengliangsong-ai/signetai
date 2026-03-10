# Full-Stack Deployment Guide for Signet API

This guide provides the correct two-step process to deploy both the frontend website and the backend API function. The previous instructions were incorrect and caused the "Not Found" errors.

**DO THIS ONLY ONCE:**

### Step 1: Set the Backend API Key in Google Cloud

Your backend needs the Gemini API key to function. A local `.env` file is not used by the live server. You must set this secret directly in Google Cloud.

Run this command in your terminal to set the `GEMINI_API_KEY`. Replace `your_actual_gemini_api_key_here` with your real key.

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

When prompted, paste your key. This is a one-time setup. You do not need to do this again unless you change your key.

**DO THIS EVERY TIME YOU DEPLOY:**

### Step 2: Deploy Both Frontend and Backend

The previous command `firebase deploy --only hosting` was wrong. It only deployed the website and ignored the backend function.

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
1.  Run `firebase functions:secrets:set GEMINI_API_KEY` once to store your key.
2.  Run `firebase deploy` every time you want to update your live website.
