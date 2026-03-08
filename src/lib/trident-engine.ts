import { GoogleGenAI, Type } from "@google/genai";
import { GOOGLE_GEMINI_KEY } from "../config/env";

export type TridentConfig = { mode: 'QuickScan' | 'DeepStructural' | 'SemanticAI' };
export type ProgressCallback = (progress: { stage: string; percent: number }) => void;

export type TridentScore = {
  delta: number; // 0 to 1000
  ssim: { score: number; diffMap?: ImageData }; // score -1 to 1
  breakdown: {
    structural: number;
    perceptual: number;
    semantic: number;
  };
  config: TridentConfig;
};

export class TridentEngine {
  config: TridentConfig;

  constructor(config: TridentConfig) {
    this.config = config;
  }

  setMode(mode: TridentConfig['mode']) {
    this.config.mode = mode;
  }

  async compare(imgA: HTMLImageElement, imgB: HTMLImageElement, onProgress: ProgressCallback): Promise<TridentScore> {
    onProgress({ stage: 'Extracting image data...', percent: 10 });
    
    // Create a simple structural diff map (pixel by pixel)
    const canvasA = document.createElement('canvas');
    const canvasB = document.createElement('canvas');
    
    // Normalize size for comparison
    const width = Math.max(imgA.naturalWidth, imgB.naturalWidth, 1);
    const height = Math.max(imgA.naturalHeight, imgB.naturalHeight, 1);
    
    canvasA.width = width;
    canvasA.height = height;
    canvasB.width = width;
    canvasB.height = height;
    
    const ctxA = canvasA.getContext('2d')!;
    const ctxB = canvasB.getContext('2d')!;
    
    ctxA.drawImage(imgA, 0, 0, width, height);
    ctxB.drawImage(imgB, 0, 0, width, height);
    
    const dataA = ctxA.getImageData(0, 0, width, height);
    const dataB = ctxB.getImageData(0, 0, width, height);
    
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = width;
    diffCanvas.height = height;
    const diffCtx = diffCanvas.getContext('2d')!;
    const diffData = diffCtx.createImageData(width, height);
    
    onProgress({ stage: 'Computing structural differences...', percent: 30 });
    
    let diffPixels = 0;
    for (let i = 0; i < dataA.data.length; i += 4) {
      const rDiff = Math.abs(dataA.data[i] - dataB.data[i]);
      const gDiff = Math.abs(dataA.data[i+1] - dataB.data[i+1]);
      const bDiff = Math.abs(dataA.data[i+2] - dataB.data[i+2]);
      const aDiff = Math.abs(dataA.data[i+3] - dataB.data[i+3]);
      
      const totalDiff = rDiff + gDiff + bDiff + aDiff;
      if (totalDiff > 50) {
        diffPixels++;
        diffData.data[i] = 255; // R
        diffData.data[i+1] = 0; // G
        diffData.data[i+2] = 0; // B
        diffData.data[i+3] = 255; // A
      } else {
        diffData.data[i] = dataA.data[i] * 0.3; // R
        diffData.data[i+1] = dataA.data[i+1] * 0.3; // G
        diffData.data[i+2] = dataA.data[i+2] * 0.3; // B
        diffData.data[i+3] = 255; // A
      }
    }
    
    const structuralScore = 1 - (diffPixels / (width * height));
    
    onProgress({ stage: 'Querying Neural Engine for Semantic Analysis...', percent: 50 });
    
    let semanticScore = 1;
    let perceptualScore = 1;
    let finalDelta = 0;
    
    try {
      // Use Gemini to compare images like a human
      let apiKey = '';
      try {
        const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (envKey && !envKey.includes('UNUSED')) {
          apiKey = envKey;
        }
      } catch (e) {
        // Ignore
      }
      if (!apiKey && GOOGLE_GEMINI_KEY && !GOOGLE_GEMINI_KEY.includes('UNUSED')) {
        apiKey = GOOGLE_GEMINI_KEY;
      }
      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      
      const base64A = canvasA.toDataURL('image/jpeg', 0.8).split(',')[1];
      const base64B = canvasB.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            { text: "You are an expert image forensic analyst. Compare these two images. Are they identical? Has one been flipped, shifted, rotated, cropped, trimmed, or altered in any way? Rate the difference on a scale of 0 to 1000, where 0 means perfectly identical (or just very minor compression noise), and 1000 means completely different images. Return a JSON object with 'delta' (0-1000), 'semantic_similarity' (0.0 to 1.0), and 'perceptual_similarity' (0.0 to 1.0)." },
            { inlineData: { data: base64A, mimeType: "image/jpeg" } },
            { inlineData: { data: base64B, mimeType: "image/jpeg" } }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              delta: { type: Type.NUMBER, description: "Difference score from 0 to 1000" },
              semantic_similarity: { type: Type.NUMBER, description: "How similar the meaning/content is (0.0 to 1.0)" },
              perceptual_similarity: { type: Type.NUMBER, description: "How similar they look to a human (0.0 to 1.0)" }
            },
            required: ["delta", "semantic_similarity", "perceptual_similarity"]
          }
        }
      });
      
      onProgress({ stage: 'Parsing neural response...', percent: 85 });
      
      const resultText = response.text || "{}";
      const parsed = JSON.parse(resultText);
      
      finalDelta = parsed.delta ?? (1000 * (1 - structuralScore));
      semanticScore = parsed.semantic_similarity ?? 1;
      perceptualScore = parsed.perceptual_similarity ?? 1;
      
    } catch (e) {
      console.error("Gemini API failed, falling back to structural diff", e);
      finalDelta = Math.round((1 - structuralScore) * 1000);
      semanticScore = structuralScore;
      perceptualScore = structuralScore;
    }
    
    onProgress({ stage: 'Finalizing scores...', percent: 100 });
    
    return {
      delta: finalDelta,
      ssim: {
        score: (structuralScore * 2) - 1, // Convert 0..1 to -1..1
        diffMap: diffData
      },
      breakdown: {
        structural: Math.round(structuralScore * 100),
        perceptual: Math.round(perceptualScore * 100),
        semantic: Math.round(semanticScore * 100)
      },
      config: this.config
    };
  }
}
