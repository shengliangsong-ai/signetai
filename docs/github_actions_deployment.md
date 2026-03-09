# Deploying to Firebase Hosting with GitHub Actions

This document outlines the procedure for setting up automated deployments to Firebase Hosting using GitHub Actions. This process relies on a Google Cloud service account for authentication.

## Part 1: Creating the Service Account JSON Key

To allow GitHub Actions to securely interact with your Firebase project, you need to create a service account key.

1.  **Navigate to Google Cloud Console:** Open the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Select Your Project:** Ensure the correct project (e.g., `signetai`) is selected from the project dropdown at the top of the page.
3.  **Go to Service Accounts:** In the navigation menu (☰), go to **IAM & Admin** > **Service Accounts**.
4.  **Select the Service Account:** Identify the service account used by Firebase. It will typically have a name like `firebase-adminsdk-...`. If you are unsure, you can create a new service account and grant it the **"Firebase Hosting Admin"** role.
5.  **Create a New Key:**
    *   Click on the service account to go to its details page.
    *   Select the **KEYS** tab.
    *   Click **ADD KEY** and choose **Create new key**.
    *   Select **JSON** as the key type and click **CREATE**.
6.  **Download and Secure the Key:** A JSON file will be downloaded to your computer. **Treat this file like a password and keep it secure.** Do not commit it to your git repository. The name will be similar to `signetai-firebase-adminsdk-fbsvc-9bded52914.json`.

## Part 2: Updating GitHub Repository Secrets

The GitHub Actions workflow uses this JSON key to authenticate with Google Cloud. You must add the key's content as a secret to your repository.

1.  **Navigate to GitHub Repository:** Open your repository within the `signetai-io` GitHub organization.
2.  **Go to Settings:** Click on the **Settings** tab.
3.  **Access Actions Secrets:** In the left sidebar, navigate to **Secrets and variables** > **Actions**.
4.  **Create a New Secret:**
    *   Under the "Repository secrets" section, click the **New repository secret** button.
    *   For the **Name**, enter exactly: `FIREBASE_SERVICE_ACCOUNT_SIGNETAI`
    *   For the **Secret**, open the JSON file you downloaded in Part 1 with a text editor, copy its entire contents, and paste them into this field.
    *   Click **Add secret**.

Once the secret is saved, your GitHub Actions workflow will have the necessary credentials to deploy your application to Firebase Hosting automatically whenever you push to the `main` branch.
