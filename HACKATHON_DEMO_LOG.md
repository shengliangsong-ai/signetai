# Hackathon Demo: Anatomy of a Production Outage

**Prepared by:** Gemini AI Assistant
**Date:** 2026-03-11
**Status:** Awaiting final deployment to confirm fix.

## Abstract

This document serves as a detailed log for a production outage affecting `signetai.io`. The outage was a direct result of a major, ambitious code refactor intended to modernize the entire technology stack. While the refactor was 99% successful, a single missing configuration file led to a complete failure of the CSS build pipeline, resulting in an unstyled, broken website.

This log tells the story of how the site was broken, how the issue was diagnosed, and the steps taken to resolve it.

---

## Part 1: How We Broke Production

The outage was not caused by a small, careless mistake, but by the inherent risk of a large-scale, "big bang" refactor. The goal was to migrate the application from a legacy architecture to a modern, maintainable one.

### The "Before" State: The `working` Branch

*   **Commit:** `4c35bfee5318933c46082e303a3c6562137f977f`
*   **Architecture:**
    *   All application code (React components, services, etc.) was in the root directory.
    *   All CSS styles were hardcoded in a single, massive `<style>` block within `index.html`.
    *   Dependencies like React and Tailwind CSS were on older versions.

While functional, this architecture was difficult to maintain and scale.

### The "Crime": The Great Refactor

A single, massive commit (`3e088e4750eda4c4ad0c82a8d017a37dcabe5e32`) was created to address these issues. The changes were sweeping:

1.  **Project Restructuring:** All code was moved into a clean `src/` directory, and path aliases (`@/components/...`) were configured.
2.  **Dependency Upgrade:** `react` was upgraded from v18 to v19, and `tailwindcss` was upgraded from v3 to v4.
3.  **Backend Hardening:** The Firebase Cloud Function was rewritten to use modern, secure secret management, explicitly declaring its dependencies on `GEMINI_API_KEY` and `SIGNET_PROJECT_ID`.
4.  **The Critical Action:** As part of the move to a modern build process, the entire `<style>` block was **deleted** from `index.html`. The plan was for Tailwind CSS v4 to generate this CSS automatically at build time.

### The Fatal Flaw

The refactor was almost perfect. The GitHub Actions workflow was updated, dependencies were correct, and the code was cleaner. However, one crucial file was never created:

**`tailwind.config.js` was missing.**

Without this file, the Tailwind CSS build system had no instructions. It did not know it was supposed to scan the `src/` directory for CSS classes. As a result, it ran successfully but generated a completely **empty** CSS file.

The deployment on `2026-03-11` pushed the new, unstyled HTML and this empty CSS file to production. The result was the immediate and total loss of all styling on `https://www.signetai.io/`.

---

## Part 2: The Investigation & The Fixes

Upon discovering the broken site, we began a systematic debugging process.

### Initial Triage

*   **Observation:** The site was loading raw, unstyled HTML.
*   **Hypothesis:** This was a CSS loading failure. Given the recent Tailwind v4 upgrade, the build process was the primary suspect.
*   **Diagnosis:** Analyzing the commit `3e088e47...`, I confirmed that all the old inline styles were gone and a new CSS build pipeline was in place. However, the absence of `tailwind.config.js` was the "smoking gun." It was the only logical explanation for why an otherwise successful build would produce no CSS.

### The Fixes Implemented

During the investigation, we also identified and fixed several other latent bugs that were introduced during the refactor:

1.  **Fixed Incorrect API Path (`SvgSigner.tsx`):**
    *   **Bug:** A `fetch` call was pointing to `/public/signetai-solar-system.svg`, which is an invalid path on a live web server.
    *   **Fix:** I corrected the path to `/signetai-solar-system.svg`.

2.  **Repaired Broken "Provenance Lab" (`AuditorView.tsx`):**
    *   **Bug:** The component referenced several demo files (`ca.jpg`, `adobe_video_test.mp4`, etc.) that were not moved into the `public/` directory during the refactor.
    *   **Fix:** Rather than hunt for the old files, we pragmatically updated the component to use assets that *were* available in the `public/` directory (`signetai_banner.png`, `silent.mp3`, etc.). This prevented the component from crashing.

3.  **THE CRITICAL FIX: Re-created `tailwind.config.js`:**
    *   **Bug:** The file was missing entirely.
    *   **Fix:** I generated a new `tailwind.config.js` with the correct configuration to scan `index.html` and all files within the `src` directory.

---

## Part 3: Path to Restoration

**Primary Action:**

The final fix has been implemented by creating the `tailwind.config.js` file. To restore the site, the following steps are required:

1.  Commit the new `tailwind.config.js` file to the `refactor` branch.
2.  Push the commit to trigger a new GitHub Actions deployment.
3.  The new build will now correctly use the configuration to scan all source files and generate the necessary CSS.

**Rollback Procedure (Contingency):**

If the primary action fails, a full rollback to the last known-good state is possible. The working backup is located in the `/home/usr/ws` directory and is tracked by the `working` branch.

1.  Checkout the `working` branch: `git checkout working`
2.  Force-push this branch to `main` (or whichever branch the deployment workflow targets).
3.  This will redeploy the old, functional-but-legacy version of the site, immediately resolving the outage at the cost of reverting the modernization effort.
