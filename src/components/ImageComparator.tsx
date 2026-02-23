
import React, { useState, useRef } from 'react';
import { TridentEngine, TridentScore } from '../lib/trident-engine';

export const ImageComparator: React.FC = () => {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [score, setScore] = useState<TridentScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const imageARef = useRef<HTMLImageElement>(null);
  const imageBRef = useRef<HTMLImageElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompare = async () => {
    if (imageARef.current && imageBRef.current) {
      setIsComparing(true);
      setError(null);
      try {
        const engine = new TridentEngine();
        const result = await engine.compare(imageARef.current, imageBRef.current);
        setScore(result);

        if (result.ssim.diffMap && diffCanvasRef.current) {
          const canvas = diffCanvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = result.ssim.diffMap.width;
            canvas.height = result.ssim.diffMap.height;
            ctx.putImageData(result.ssim.diffMap, 0, 0);
          }
        }

      } catch (err) {
        setError('An error occurred during comparison.');
        console.error(err);
      } finally {
        setIsComparing(false);
      }
    }
  };

  return (
    <div className="image-comparator">
      <div className="image-upload-container">
        <div className="image-upload">
          <h2>Image A</h2>
          <input className="file-input" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageA)} />
          {imageA && <img ref={imageARef} className="image-preview" src={imageA} alt="Image A" />}
        </div>
        <div className="image-upload">
          <h2>Image B</h2>
          <input className="file-input" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageB)} />
          {imageB && <img ref={imageBRef} className="image-preview" src={imageB} alt="Image B" />}
        </div>
      </div>
      <div>
        <button className="button" onClick={handleCompare} disabled={!imageA || !imageB || isComparing}>
          {isComparing ? 'Comparing...' : 'Compare Images'}
        </button>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {score && (
        <div className="results-container">
          <h2>Comparison Results</h2>
          <p><strong>Delta:</strong> {score.delta.toFixed(2)}</p>
          <p><strong>Difference Band:</strong> {score.bands}</p>
          <h3>SSIM Difference Map</h3>
          <canvas ref={diffCanvasRef} className="diff-map"></canvas>
        </div>
      )}
    </div>
  );
};
