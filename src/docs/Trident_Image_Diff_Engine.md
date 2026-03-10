# Design Doc: The "Trident" Image Difference Engine

## 1. Objective

To design and specify a system for comparing two images (Image A and Image B) that produces a single, interpretable "Difference Score (Δ)". This score must be robust enough to approximate human perception of similarity, accounting for changes in compression, resolution, structure, and semantic content.

This engine will replace simple pHash-only comparisons and provide the foundation for the "Resilience Layer" and "Visual Duplicate Detection" features outlined in your `TODO.md`.

## 2. Core Principles

*   **Multi-Pronged Analysis:** No single algorithm can capture the nuance of visual difference. We will use a pipeline of three distinct comparison methods ("prongs").
*   **From Pixels to Semantics:** The analysis will start with low-level hash comparisons, move to structural comparisons, and culminate in high-level semantic object analysis.
*   **Configurable Depth:** The system will support different modes (e.g., "Quick Scan", "Deep Structural", "Semantic AI") that trade speed for analytical depth, allowing for flexible use cases like real-time UI feedback vs. deep forensic analysis.
*   **Interpretable Output:** The final score (Δ) will be a weighted synthesis of all prongs, normalized to a 0-1000 scale, and mapped to the existing "Difference Bands" for clear, human-readable results.

## 3. The Trident Pipeline Architecture

The engine will process both images through three parallel "prongs" of analysis. The results are then synthesized into the final score.

#### Prong 1: Perceptual Hashing (The Baseline)

This is the fastest check and provides a baseline for overall similarity.

*   **Algorithm:** **Wavelet-based Perceptual Hash (pHash)**. This is more robust than simpler average or difference hashes and is what you currently use for video frames.
*   **Process:**
    1.  Resize Image A and Image B to a standard 64x64 pixels.
    2.  Convert both to grayscale.
    3.  Apply a Discrete Cosine Transform (DCT) and extract the low-frequency components.
    4.  Compute the hash bits based on whether the DCT values are above or below the median.
    5.  Calculate the **Hamming distance** between the two hashes (number of differing bits).
*   **Output:** An integer `d_pHash` (0-64).
*   **Strength:** Extremely fast. Resilient to compression artifacts, minor color/gamma changes, and watermarking.
*   **Weakness:** Fails on significant crops, rotations, or localized edits. A small change can sometimes flip many bits, while a large structural change might not.

#### Prong 2: Structural Similarity (The Contextual Check)

This prong measures the perceived change in structure, which aligns more closely with how humans notice modifications.

*   **Algorithm:** **Structural Similarity Index (SSIM)**.
*   **Process:**
    1.  Resize both images to a standard dimension (e.g., 256x256). Convert to grayscale.
    2.  Using a sliding window (e.g., 11x11 pixels), compare corresponding windows in both images based on their luminance, contrast, and structure.
    3.  The main output is an average SSIM score for the entire image.
    4.  A secondary output is a **visual diff map**, an image that highlights the exact areas where structural differences were detected. This map is invaluable for human review.
*   **Output:**
    *   A float `s_SSIM` (0 to 1, where 1 is identical).
    *   A diff map image (for UI display).
*   **Strength:** Excellent at detecting local changes (e.g., an object was edited or removed), texture changes, and brightness/contrast adjustments in specific regions. The diff map is highly interpretable.
*   **Weakness:** More computationally intensive than pHash. Still pixel-based and lacks semantic understanding (it doesn't know *what* changed, only *that* it changed).

#### Prong 3: Semantic & Feature Analysis (The "Human" Layer)

This is the most advanced prong, designed to understand the *content* of the images. It has two parts.

*   **Part A: Feature Matching (SIFT/ORB)**
    *   **Algorithm:** **Oriented FAST and Rotated BRIEF (ORB)**, as it's a high-performance, patent-free alternative to SIFT.
    *   **Process:**
        1.  Detect hundreds of keypoints (corners, distinct features) in both images.
        2.  Create a descriptor vector for each keypoint.
        3.  Match keypoints between the two images based on descriptor similarity.
        4.  Filter out bad matches (e.g., using Lowe's ratio test).
    *   **Output:** A float `r_features` representing the ratio of good matches to the total number of keypoints in the sparser image (0 to 1).
    *   **Strength:** Extremely robust against rotation, scaling, and occlusion. It can find an object even if it's been moved or resized.

*   **Part B: Object Detection (AI Model)**
    *   **Algorithm:** A pre-trained object detection model like **COCO-SSD** running via **TensorFlow.js** or **ONNX.js**.
    *   **Process:**
        1.  Run Image A and Image B through the model.
        2.  The model returns a list of detected objects (e.g., `{class: "cat", box: [x,y,w,h]}`) for each image.
        3.  Compare the object lists.
            *   **Count Change:** Did the number of cats/dogs/people change?
            *   **Class Change:** Was an object of one class replaced with another?
            *   **Position Change:** For objects present in both, calculate the Intersection over Union (IoU) of their bounding boxes. A low IoU indicates the object moved significantly.
    *   **Output:** A custom score `d_semantic` (0 to 1), where 0 means no semantic changes and 1 means significant additions, removals, or rearrangements.
    *   **Strength:** This is the only prong that provides true semantic understanding, which is the cornerstone of being "as good as a human." It can tell you "a car was removed from the scene."

## 4. Synthesizing the Difference Score (Δ)

The individual outputs must be normalized and combined into the final score.

1.  **Normalization:** Convert all prong outputs to a common scale of 0-1000 (where higher means more different).
    *   `pHash_norm = (d_pHash / 64) * 1000`
    *   `SSIM_norm = (1 - s_SSIM) * 1000`
    *   `features_norm = (1 - r_features) * 1000`
    *   `semantic_norm = d_semantic * 1000`

2.  **Weighted Combination:** The final score Δ is a weighted average. The weights are configurable based on the desired analysis mode.

    **Δ = (w1 * pHash_norm) + (w2 * SSIM_norm) + (w3 * features_norm) + (w4 * semantic_norm)**

    *   **"Quick Scan" Mode (UI feedback):** `w1=0.7, w2=0.3, w3=0, w4=0`. Fast, pHash-dominant.
    *   **"Deep Structural" Mode (Batch Verifier):** `w1=0.1, w2=0.5, w3=0.4, w4=0`. Prioritizes structural integrity and feature matching.
    *   **"Semantic AI" Mode (Forensic analysis):** `w1=0.1, w2=0.2, w3=0.2, w4=0.5`. Heavily weights the AI's semantic analysis.

3.  **Mapping to Difference Bands:** The final score Δ is mapped to your existing classification system:
    *   **0-30: MINIMAL DIFFERENCE (Match)**
    *   **30-120: LOW DIFFERENCE (Consistent)**
    *   **120-300: MODERATE DIFFERENCE (Modified)**
    *   **>300: HIGH DIFFERENCE (Distinct)**

## 5. Implementation Plan

*   **Dependencies:**
    *   `pHash`: A reliable WASM or JS library.
    *   `SSIM`: `ssim.js` or a similar library.
    *   `ORB`: `OpenCV.js` (compiled to WASM) is the standard for this.
    *   `Object Detection`: `TensorFlow.js` with the `coco-ssd` model.
*   **Integration:** This engine should be built as a standalone service/worker within your application to avoid blocking the main UI thread, especially for the "Deep" and "Semantic" modes.
