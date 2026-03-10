# GitHub Actions Deployment Permissions

This document explains common permission errors that can occur when deploying Firebase Functions from a GitHub Actions workflow and how to resolve them.

## The Problem: `secretmanager.secrets.setIamPolicy` Denied

When you deploy a Firebase Function that has secrets specified in its configuration, the deployment process attempts to automatically grant the function's service account access to those secrets. This is done by modifying the secret's IAM policy.

You may encounter the following error during your GitHub Actions workflow:

```
Error: Request to https://secretmanager.googleapis.com/v1/projects/***/secrets/YOUR_SECRET:setIamPolicy had HTTP Error: 403, Permission 'secretmanager.secrets.setIamPolicy' denied for resource 'projects/***/secrets/YOUR_SECRET' (or it may not exist).
```

This error means that the service account used by your GitHub Actions workflow (e.g., `github-action-1157539967@signetai.iam.gserviceaccount.com`) does not have the necessary permissions to modify the IAM policies of your secrets in Google Cloud Secret Manager.

---

## Solution A: Grant `Secret Manager Admin` Role (Standard Method)

The standard fix is to grant the `Secret Manager Admin` role to the service account that your GitHub Actions workflow uses for deployment. This allows the deployment process to manage secret permissions automatically.

Run the following `gcloud` command, replacing the service account email if necessary:

```bash
gcloud projects add-iam-policy-binding signetai --member="serviceAccount:github-action-1157539967@signetai.iam.gserviceaccount.com" --role="roles/secretmanager.admin"
```

This command gives the GitHub Actions service account the authority to manage access to your secrets, allowing it to complete the deployment process successfully.

## Solution B: Manually Grant Access to the Function (Fallback Method)

Sometimes, even with the correct permissions, the deployment process can fail due to IAM propagation delays or other complex policy interactions. In this case, the most reliable solution is to manually grant the necessary permissions *before* deploying.

The goal is to give your Cloud Function's runtime service account direct permission to access the secrets.

**1. Identify the Function's Service Account:**

The logs from the failed deployment will show which service account the function uses. In this case, it was the default Compute Engine service account: `445715011563-compute@developer.gserviceaccount.com`.

**2. Grant the `Secret Accessor` Role Manually:**

Run the following commands for each secret your function needs. This gives the function read-only access to the secret's value at runtime.

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

By pre-emptively granting these permissions, you remove the need for the deployment process to do it, bypassing the `setIamPolicy` error entirely.
