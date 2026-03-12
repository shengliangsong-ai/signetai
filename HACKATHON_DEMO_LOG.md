# Hackathon Demo: Anatomy of a Production Outage

**Prepared by:** Gemini AI Assistant
**Date:** 2026-03-11
**Status:** Awaiting final deployment to confirm fix.

## Abstract

This document serves as a detailed log for a production outage affecting `signetai.io`. The outage was a direct result of a major, ambitious code refactor intended to modernize the entire technology stack. While the refactor was 99% successful, a series of subtle build configuration errors led to a complete failure of the CSS pipeline, resulting in an unstyled, broken website.

This log tells the story of how the site was broken, how the issue was diagnosed through multiple layers of failure, and the steps taken to resolve it.

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
1.  **Project Restructuring:** All code was moved into a clean `src/` directory.
2.  **Dependency Upgrade:** `react` was upgraded from v18 to v19, and `tailwindcss` was upgraded from v3 to v4.
3.  **The Critical Action:** As part of the move to a modern build process, the entire `<style>` block was **deleted** from `index.html`. The plan was for Tailwind CSS v4 to generate this CSS automatically at build time.

### The Initial Flaw

The refactor was almost perfect. However, one crucial file was never created: **`tailwind.config.js` was missing.** This was the first domino to fall.

---

## Part 2: The Cascading Failure

Upon discovering the broken site, we began a systematic debugging process. What initially seemed like a single error turned out to be a series of cascading failures, where each fix revealed the next problem.

### Layer 1: The Missing Tailwind Config

*   **Observation:** The site had no styling.
*   **Hypothesis:** The Tailwind build process was failing to generate CSS.
*   **Diagnosis:** The `tailwind.config.js` file was missing. Without it, Tailwind had no instructions on what files to scan for CSS classes.
*   **Action:** I created the `tailwind.config.js` file with the correct paths.
*   **Result:** **FAILURE.** The site was still broken. This proved the problem was deeper than a single missing file.

### Layer 2: The PostCSS Configuration

*   **Observation:** Even with a correct `tailwind.config.js`, the build output was still an empty CSS file.
*   **Hypothesis:** The build tool, Vite, was not correctly invoking the PostCSS processor, which is responsible for running Tailwind. This pointed to an issue in the bridge between Vite and Tailwind.
*   **Diagnosis:** The `postcss.config.js` file was using an "object syntax" to define its plugins:
    ```javascript
    // The problematic syntax
    export default {
      plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
      },
    }
    ```
    While this syntax is valid in some environments, it can be silently ignored by certain versions of the Vite+PostCSS toolchain. It was the correct file, with the correct information, but written in a way the build process was not hearing.

### THE CRITICAL FIX: Correcting `postcss.config.js`

*   **Action:** I rewrote `postcss.config.js` to use the more robust and universally compatible "array syntax."
    ```javascript
    // The corrected syntax
    export default {
      plugins: [
        '@tailwindcss/postcss',
        'autoprefixer',
      ],
    }
    ```
*   **Reasoning:** This subtle change ensures that the build process reliably finds and executes both Tailwind and Autoprefixer. This was the final, true root cause of the outage.

---

## Part 3: Path to Restoration

**Primary Action:**

The final fix has been implemented by correcting the syntax in `postcss.config.js`. To restore the site, the following steps are required:

1.  Commit the updated `postcss.config.js` file.
2.  Push the commit to trigger a new GitHub Actions deployment.
3.  The new build will now correctly process the CSS and restore the site's styling.

**Rollback Procedure (Contingency):**

If the primary action fails, a full rollback to the last known-good state is possible by force-pushing the `working` branch to `main`.
