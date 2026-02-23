
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import ssim from 'ssim.js';

// Self-contained dHash implementation
const dHash = async (img: HTMLImageElement, bits: number = 8): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context for dHash');
  const width = bits + 1;
  const height = bits;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  const grayscale = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < grayscale.data.length; i += 4) {
    const avg = (grayscale.data[i] + grayscale.data[i + 1] + grayscale.data[i + 2]) / 3;
    grayscale.data[i] = grayscale.data[i + 1] = grayscale.data[i + 2] = avg;
  }
  ctx.putImageData(grayscale, 0, 0);
  let hash = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      const leftPixel = ctx.getImageData(x, y, 1, 1).data[0];
      const rightPixel = ctx.getImageData(x + 1, y, 1, 1).data[0];
      hash += leftPixel < rightPixel ? '1' : '0';
    }
  }
  return hash;
};

export interface TridentScore {
  delta: number;
  pHash: { distance: number; normalized: number; };
  ssim: { score: number; normalized: number; diffMap?: ImageData; };
  features: { ratio: number; normalized: number; };
  semantic: { score: number; normalized: number; };
  bands: 'MINIMAL' | 'LOW' | 'MODERATE' | 'HIGH';
  breakdown: {
    pHash: { weight: number; contribution: number; };
    ssim: { weight: number; contribution: number; };
    features: { weight: number; contribution: number; };
    semantic: { weight: number; contribution: number; };
  };
  config: TridentConfig;
}

// Define the configuration for the engine
export interface TridentConfig {
  mode: 'QuickScan' | 'DeepStructural' | 'SemanticAI';
  pHashWeight: number;
  ssimWeight: number;
  featureWeight: number;
  semanticWeight: number;
}

// NEW: Define the progress callback function signature
export type ProgressCallback = (progress: { stage: string; percent: number }) => void;

const hammingDistance = (hash1: string, hash2: string): number => {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
};

const getImageData = (img: HTMLImageElement): ImageData => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context from canvas');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
};

const jaccardSimilarity = (set1: Set<string>, set2: Set<string>): number => {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
};

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

export class TridentEngine {
  private config: TridentConfig;
  private model: cocoSsd.ObjectDetection | null = null;

  constructor(config?: Partial<TridentConfig>) {
    const defaultConfig: TridentConfig = { mode: 'DeepStructural', pHashWeight: 0.1, ssimWeight: 0.5, featureWeight: 0.4, semanticWeight: 0 };
    this.config = { ...defaultConfig, ...config };
    this.updateWeightsForMode();
  }

  public async loadModel(onProgress?: ProgressCallback) {
    if (this.model || this.config.mode !== 'SemanticAI') return;
    console.log('Engine cold start: Initializing TridentEngine...');
    onProgress?.({ stage: 'Initializing AI model...', percent: 1 });
    try {
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('Loading semantic analysis model (COCO-SSD)... This may take a few moments.');
        onProgress?.({ stage: 'Downloading AI model...', percent: 25 });
        this.model = await cocoSsd.load();
        onProgress?.({ stage: 'AI model ready', percent: 100 });
        console.log('TridentEngine ready.');
    } catch (e) {
        console.error('FATAL: Model load failed:', e);
    }
  }

  public setMode(mode: TridentConfig['mode']) {
    this.config.mode = mode;
    this.updateWeightsForMode();
    console.log(`Switching scan mode to: ${mode}`);
  }

  private updateWeightsForMode() {
    switch (this.config.mode) {
      case 'QuickScan': this.config = { ...this.config, pHashWeight: 1.0, ssimWeight: 0, featureWeight: 0, semanticWeight: 0 }; break;
      case 'DeepStructural': this.config = { ...this.config, pHashWeight: 0.3, ssimWeight: 0.7, featureWeight: 0, semanticWeight: 0 }; break;
      case 'SemanticAI': default: this.config = { ...this.config, pHashWeight: 0.1, ssimWeight: 0.2, featureWeight: 0.2, semanticWeight: 0.5 }; break;
    }
  }

  public async compare(
    imageA: HTMLImageElement, 
    imageB: HTMLImageElement, 
    onProgress?: ProgressCallback
  ): Promise<TridentScore> {
    console.log('Trident Engine starting comparison with config:', this.config);
    onProgress?.({ stage: 'Initializing', percent: 0 });

    const BITS = 16;

    onProgress?.({ stage: 'Analyzing perceptual hash (pHash)', percent: 10 });
    const [hashA, hashB] = await Promise.all([dHash(imageA, BITS), dHash(imageB, BITS)]);
    const distance = hammingDistance(hashA, hashB);
    const pHashResult = { distance, normalized: (distance / (BITS * BITS)) * 1000 };
    console.log(`[pHash Details] Raw Distance: ${distance} (${((distance / (BITS * BITS)) * 100).toFixed(2)}% dissimilarity) | Normalized Score: ${pHashResult.normalized.toFixed(3)}`);
    onProgress?.({ stage: 'pHash analysis complete', percent: 25 });

    let ssimResult = { score: 0, normalized: 0, diffMap: undefined as ImageData | undefined };
    let featureResult = { ratio: 0, normalized: 0 };
    let semanticResult = { score: 0, normalized: 0 };

    if (this.config.mode === 'DeepStructural' || this.config.mode === 'SemanticAI') {
      onProgress?.({ stage: 'Analyzing structural similarity (SSIM)', percent: 30 });
      const imageDataA = getImageData(imageA);
      const imageDataB = getImageData(imageB);
      const ssimOptions = { windowSize: 5, k1: 0.01, k2: 0.03 }; 
      console.log('[SSIM Details] Using options:', ssimOptions);
      const { mssim, ssim_map } = ssim(imageDataA, imageDataB, ssimOptions);
      console.log(`[SSIM Details] Raw MSSIM Score: ${mssim.toFixed(5)} (1 is identical)`);

      let diffImageData;
      if (ssim_map) {
        const { data, width, height } = ssim_map;
        const rgba = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < data.length; i++) {
          const similarity = data[i];
          const difference = 255 - similarity; 
          const j = i * 4;
          rgba[j + 0] = difference; rgba[j + 1] = difference; rgba[j + 2] = difference; rgba[j + 3] = 255;
        }
        diffImageData = new ImageData(rgba, width, height);
      }
      ssimResult = { score: mssim, normalized: ((1 - mssim) / 2) * 1000, diffMap: diffImageData };
      onProgress?.({ stage: 'SSIM analysis complete', percent: 50 });
    }

    if (this.config.mode === 'SemanticAI') {
      console.log('[Semantic AI] Note: The COCO-SSD model runs locally. No API tokens are used.');
      if (!this.model) {
        await this.loadModel(onProgress);
        if (!this.model) throw new Error('AI Model failed to load and is required for SemanticAI mode.');
      }
      onProgress?.({ stage: 'Analyzing semantic content (AI)', percent: 55 });
      const [objectsA, objectsB] = await Promise.all([this.model.detect(imageA), this.model.detect(imageB)]);
      onProgress?.({ stage: 'Semantic analysis complete', percent: 85 });

      const classesA = new Set(objectsA.map(obj => obj.class));
      const classesB = new Set(objectsB.map(obj => obj.class));
      const semanticScore = jaccardSimilarity(classesA, classesB);
      semanticResult = { score: semanticScore, normalized: (1 - semanticScore) * 1000 };
      console.log(`[Semantic AI] Jaccard Score: ${semanticScore.toFixed(3)}`);

      let totalIou = 0;
      let featureRatio = 0;
      if (objectsA.length > 0 && objectsB.length > 0) {
          for (const objA of objectsA) {
              let bestIou = 0;
              for (const objB of objectsB) {
                  if (objA.class === objB.class) {
                      const iou = calculateIoU(objA.bbox, objB.bbox);
                      if (iou > bestIou) bestIou = iou;
                  }
              }
              totalIou += bestIou;
          }
          featureRatio = totalIou / objectsA.length;
      }
      featureResult = { ratio: featureRatio, normalized: (1 - featureRatio) * 1000 };
      console.log(`[Semantic AI] Feature Match Ratio: ${featureRatio.toFixed(3)}`);
    }

    onProgress?.({ stage: 'Synthesizing final score', percent: 95 });
    const pHashContribution = pHashResult.normalized * this.config.pHashWeight;
    const ssimContribution = ssimResult.normalized * this.config.ssimWeight;
    const featureContribution = featureResult.normalized * this.config.featureWeight;
    const semanticContribution = semanticResult.normalized * this.config.semanticWeight;

    const delta = pHashContribution + ssimContribution + featureContribution + semanticContribution;

    let bands: TridentScore['bands'] = 'MINIMAL';
    if (delta > 300) bands = 'HIGH';
    else if (delta > 120) bands = 'MODERATE';
    else if (delta > 30) bands = 'LOW';

    const breakdown: TridentScore['breakdown'] = {
      pHash: { weight: this.config.pHashWeight, contribution: pHashContribution },
      ssim: { weight: this.config.ssimWeight, contribution: ssimContribution },
      features: { weight: this.config.featureWeight, contribution: featureContribution },
      semantic: { weight: this.config.semanticWeight, contribution: semanticContribution },
    };

    console.log('[Final Synthesis] Applied Weights:', { pHash: breakdown.pHash.weight, ssim: breakdown.ssim.weight, features: breakdown.features.weight, semantic: breakdown.semantic.weight });
    console.log(`[Final Synthesis] Final Delta: ${delta.toFixed(3)} | Resulting Band: ${bands}`);

    onProgress?.({ stage: 'Complete', percent: 100 });

    return {
      delta, 
      pHash: pHashResult, 
      ssim: ssimResult, 
      features: featureResult, 
      semantic: semanticResult, 
      bands,
      breakdown,
      config: this.config,
    };
  }
}
