
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import ssim from 'ssim.js';
import { dHash } from 'browser-image-hash';

// Define the structure for the Trident Engine's output
export interface TridentScore {
  delta: number; // The final, weighted difference score (0-1000)
  pHash: {
    distance: number;
    normalized: number;
  };
  ssim: {
    score: number;
    normalized: number;
    diffMap?: ImageData;
  };
  features: {
    ratio: number;
    normalized: number;
  };
  semantic: {
    score: number;
    normalized: number;
  };
  bands: 'MINIMAL' | 'LOW' | 'MODERATE' | 'HIGH';
}

// Define the configuration for the engine
export interface TridentConfig {
  mode: 'QuickScan' | 'DeepStructural' | 'SemanticAI';
  pHashWeight: number;
  ssimWeight: number;
  featureWeight: number;
  semanticWeight: number;
}

// Function to calculate Hamming distance
const hammingDistance = (hash1: string, hash2: string): number => {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
};

// Function to get image data from an HTMLImageElement
const getImageData = (img: HTMLImageElement): ImageData => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get 2D context from canvas');
    }
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
};

// Function to calculate Jaccard similarity
const jaccardSimilarity = (set1: Set<string>, set2: Set<string>): number => {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
};

// Function to calculate Intersection over Union (IoU)
const calculateIoU = (box1: number[], box2: number[]): number => {
    const [x1, y1, width1, height1] = box1;
    const [x2, y2, width2, height2] = box2;

    const xA = Math.max(x1, x2);
    const yA = Math.max(y1, y2);
    const xB = Math.min(x1 + width1, x2 + width2);
    const yB = Math.min(y1 + height1, y2 + height2);

    const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const box1Area = width1 * height1;
    const box2Area = width2 * height2;
    const unionArea = box1Area + box2Area - intersectionArea;

    return intersectionArea / unionArea;
};


/**
 * The Trident Image Difference Engine
 *
 * This class implements the three-pronged image comparison strategy
 * outlined in the design document.
 */
export class TridentEngine {
  private config: TridentConfig;
  private model: cocoSsd.ObjectDetection | null = null;

  constructor(config?: Partial<TridentConfig>) {
    // Default to DeepStructural mode
    const defaultConfig: TridentConfig = {
      mode: 'DeepStructural',
      pHashWeight: 0.1,
      ssimWeight: 0.5,
      featureWeight: 0.4,
      semanticWeight: 0,
    };

    this.config = { ...defaultConfig, ...config };
    this.updateWeightsForMode();
  }

  /**
   * Load the COCO-SSD model.
   */
  public async loadModel() {
    if (!this.model) {
        this.model = await cocoSsd.load();
    }
  }

  /**
   * Set the analysis mode and update the weights accordingly.
   */
  public setMode(mode: TridentConfig['mode']) {
    this.config.mode = mode;
    this.updateWeightsForMode();
  }

  private updateWeightsForMode() {
    switch (this.config.mode) {
      case 'QuickScan':
        this.config.pHashWeight = 0.7;
        this.config.ssimWeight = 0.3;
        this.config.featureWeight = 0;
        this.config.semanticWeight = 0;
        break;
      case 'SemanticAI':
        this.config.pHashWeight = 0.1;
        this.config.ssimWeight = 0.2;
        this.config.featureWeight = 0.2;
        this.config.semanticWeight = 0.5;
        break;
      case 'DeepStructural':
      default:
        this.config.pHashWeight = 0.1;
        this.config.ssimWeight = 0.5;
        this.config.featureWeight = 0.4;
        this.config.semanticWeight = 0;
        break;
    }
  }

  /**
   * Compare two images using the Trident three-pronged strategy.
   *
   * This method calculates a sophisticated difference score (delta) based on a weighted
   * average of three different comparison techniques, making it robust against a wide
   * variety of image manipulations.
   *
   * - **Prong 1: Perceptual Hashing (pHash)**
   *   Creates a "fingerprint" of the image. It's excellent for detecting near-identical
   *   images, even with changes in resolution, compression, or minor color adjustments.
   *   It is not robust against rotation, flips, or significant crops.
   *
   * - **Prong 2: Structural Similarity (SSIM)**
   *   Compares images based on luminance, contrast, and structure in localized windows.
   *   This is highly effective at identifying localized edits, retouching, or changes
   *   in contrast. It produces a "diff map" to visualize where changes occurred.
   *
   * - **Prong 3: Feature & Semantic Analysis (In Progress)**
   *   This prong will use object detection to identify the actual content within the
   *   image. This allows for comparing images based on their semantic meaning, making it
   *   possible to identify images as similar even if the subject is rotated, resized,
   *   or shifted within the frame.
   *
   * @param imageA The first image to compare.
   * @param imageB The second image to compare.
   * @returns A Promise resolving to a TridentScore object containing the detailed breakdown of the comparison.
   */
  public async compare(imageA: HTMLImageElement, imageB: HTMLImageElement): Promise<TridentScore> {
    await this.loadModel();
    if (!this.model) {
        throw new Error('Model not loaded');
    }

    const BITS = 16;

    // Prong 1: pHash
    const [hashA, hashB] = await Promise.all([
        dHash(imageA, BITS),
        dHash(imageB, BITS),
    ]);
    const distance = hammingDistance(hashA, hashB);
    const pHashResult = {
        distance,
        normalized: (distance / (BITS * BITS)) * 1000,
    };

    // Prong 2: SSIM
    const imageDataA = getImageData(imageA);
    const imageDataB = getImageData(imageB);
    const { mssim, ssim_map } = ssim(imageDataA, imageDataB);
    const ssimResult = {
        score: mssim,
        normalized: ((1 - mssim) / 2) * 1000,
        diffMap: ssim_map.imageData,
    };

    // Prong 3: Features & Semantic
    const [objectsA, objectsB] = await Promise.all([
        this.model.detect(imageA),
        this.model.detect(imageB),
    ]);

    const classesA = new Set(objectsA.map(obj => obj.class));
    const classesB = new Set(objectsB.map(obj => obj.class));
    const semanticScore = jaccardSimilarity(classesA, classesB);
    const semanticResult = {
        score: semanticScore,
        normalized: (1 - semanticScore) * 1000,
    };

    let totalIou = 0;
    let featureRatio = 0;
    if (objectsA.length > 0 && objectsB.length > 0) {
        for (const objA of objectsA) {
            let bestIou = 0;
            for (const objB of objectsB) {
                if (objA.class === objB.class) {
                    const iou = calculateIoU(objA.bbox, objB.bbox);
                    if (iou > bestIou) {
                        bestIou = iou;
                    }
                }
            }
            totalIou += bestIou;
        }
        featureRatio = totalIou / objectsA.length;
    }
    
    const featureResult = {
        ratio: featureRatio,
        normalized: (1 - featureRatio) * 1000,
    };


    // Synthesize the final score
    const delta = 
      pHashResult.normalized * this.config.pHashWeight +
      ssimResult.normalized * this.config.ssimWeight +
      featureResult.normalized * this.config.featureWeight +
      semanticResult.normalized * this.config.semanticWeight;

    // Map to difference bands
    let bands: TridentScore['bands'] = 'MINIMAL';
    if (delta > 300) {
        bands = 'HIGH';
    } else if (delta > 120) {
        bands = 'MODERATE';
    } else if (delta > 30) {
        bands = 'LOW';
    }

    return {
      delta,
      pHash: pHashResult,
      ssim: ssimResult,
      features: featureResult,
      semantic: semanticResult,
      bands,
    };
  }
}
