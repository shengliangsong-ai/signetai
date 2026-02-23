
import React, { useState, useRef, useEffect } from 'react';
import { TridentEngine, TridentScore, TridentConfig, ProgressCallback } from '../src/lib/trident-engine';
import { ScoreCompositionTable } from './ScoreCompositionTable';

// Component state for audit and performance
type AuditResult = { 
  score: number; 
  band: string; 
  verdict: string; 
  confidence: number; 
  delta: number; 
  breakdown: TridentScore['breakdown'];
  config: TridentConfig;
};
type PerfMetrics = { 
  compareMs: number; 
  bytesProcessed: number; 
  imageADims: string; 
  imageBDims: string; 
};

// NEW: State for real-time progress tracking
type ProgressState = { stage: string; percent: number; elapsed: number };

export const ImageComparator: React.FC = () => {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  
  // Engine and result states
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [scanMode, setScanMode] = useState<TridentConfig['mode']>('DeepStructural');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [perfMetrics, setPerfMetrics] = useState<PerfMetrics | null>(null);
  const [progress, setProgress] = useState<ProgressState>({ stage: 'Idle', percent: 0, elapsed: 0 });
  const [diffMap, setDiffMap] = useState<ImageData | null>(null);

  const imageARef = useRef<HTMLImageElement>(null);
  const imageBRef = useRef<HTMLImageElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TridentEngine | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`[ImageComparator] ${msg}`);
    setLogMessages(prev => [...prev, `${timestamp} > ${msg}`]);
  };

  // Initialize engine on mount
  useEffect(() => {
    const initializeEngine = async () => {
      addLog('Engine cold start: Initializing TridentEngine...');
      engineRef.current = new TridentEngine({ mode: scanMode });
      setIsEngineReady(true);
      addLog('Engine is now ready for comparison.');
    };
    initializeEngine();
  }, []);

  // Effect to draw the diffMap to the canvas when it's available
  useEffect(() => {
    if (diffMap && diffCanvasRef.current) {
      const canvas = diffCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = diffMap.width;
        canvas.height = diffMap.height;
        ctx.putImageData(diffMap, 0, 0);
        addLog('SSIM difference map rendered.');
      }
    }
  }, [diffMap, auditResult]); // Rerun when diffMap is created and auditResult is set (ensuring canvas is visible)

  // Update engine mode when scanMode changes
  useEffect(() => {
    if (engineRef.current && isEngineReady) {
      addLog(`Switching scan mode to: ${scanMode}`);
      engineRef.current.setMode(scanMode);
    }
  }, [scanMode, isEngineReady]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setImage(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleCompare = async () => {
    const imgA = imageARef.current;
    const imgB = imageBRef.current;
    if (!imgA || !imgB || !engineRef.current) return;

    const imageAProps = { src: imgA.src, dims: `${imgA.naturalWidth}x${imgA.naturalHeight}` };
    const imageBProps = { src: imgB.src, dims: `${imgB.naturalWidth}x${imgB.naturalHeight}` };

    setAuditResult(null);
    setPerfMetrics(null);
    setDiffMap(null);
    setIsComparing(true);
    setError(null);
    addLog('Comparison process started.');
    const compareStartedAt = Date.now();

    progressIntervalRef.current = window.setInterval(() => {
        setProgress(prev => ({ ...prev, elapsed: (Date.now() - compareStartedAt) / 1000 }));
    }, 500);

    const onCompareProgress: ProgressCallback = ({ stage, percent }) => {
      addLog(`[${percent}%] ${stage}`);
      setProgress({ stage, percent, elapsed: (Date.now() - compareStartedAt) / 1000 });
    };

    try {
      const result: TridentScore = await engineRef.current.compare(imgA, imgB, onCompareProgress);
      const compareMs = Date.now() - compareStartedAt;
      addLog(`Comparison finished in ${compareMs}ms.`);

      const score = Math.min(1000, Math.round(result.delta));
      let band: string, verdict: string;
      if (score <= 30) { band = 'MINIMAL'; verdict = 'CONSISTENT'; }
      else if (score <= 120) { band = 'LOW'; verdict = 'MODIFIED'; }
      else if (score <= 300) { band = 'MODERATE'; verdict = 'MODIFIED'; }
      else { band = 'HIGH'; verdict = 'DIFFERENT'; }

      const confidence = Math.max(0, (result.ssim.score + 1) / 2); // Rescale SSIM from [-1, 1] to [0, 1]

      setAuditResult({ 
        score, 
        band, 
        verdict, 
        confidence, 
        delta: result.delta, 
        breakdown: result.breakdown, 
        config: result.config 
      });
      setPerfMetrics({ compareMs, bytesProcessed: imageAProps.src.length + imageBProps.src.length, imageADims: imageAProps.dims, imageBDims: imageBProps.dims });
      if (result.ssim.diffMap) {
        setDiffMap(result.ssim.diffMap);
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`An error occurred: ${msg}`);
      addLog(`FATAL ERROR: ${msg}`);
    } finally {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsComparing(false);
    }
  };

  const renderReport = () => {
    if (!auditResult || !perfMetrics) return null;

    const bandLabels: { [key: string]: string } = {
        'MINIMAL': 'MINIMAL DIFFERENCE',
        'LOW': 'LOW DIFFERENCE',
        'MODERATE': 'MODERATE DIFFERENCE',
        'HIGH': 'HIGH DIFFERENCE',
    };
    const bandColorMap: { [key: string]: string } = {
        'MINIMAL': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
        'LOW': 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10',
        'MODERATE': 'text-amber-500 border-amber-500/30 bg-amber-500/10',
        'HIGH': 'text-red-500 border-red-500/30 bg-red-500/10',
    };
    
    const bandClass = bandColorMap[auditResult.band];
    if (!bandClass) return null;

    const textColor = bandClass.split(' ')[0];
    const borderColor = bandClass.split(' ')[1];

    return (
        <div className={`border rounded-xl flex flex-col p-8 space-y-6 relative overflow-hidden ${borderColor} ${bandClass.split(' ')[2]}`}>
           <div className="flex items-center gap-8">
               <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center ${borderColor}`}>
                   <div className="text-center">
                       <span className="block text-2xl font-bold font-serif">{auditResult.score}</span>
                       <span className="text-[8px] opacity-60 uppercase font-mono">Diff Score</span>
                   </div>
               </div>
               <div className="space-y-1">
                   <h4 className={`font-serif text-xl font-bold italic ${textColor}`}>
                       {bandLabels[auditResult.band]}
                   </h4>
                   <p className={`font-mono text-[10px] uppercase tracking-widest font-bold ${auditResult.verdict === 'CONSISTENT' ? 'text-emerald-600' : 'text-red-600'}`}>
                       Verdict: {auditResult.verdict}
                   </p>
                   <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest">
                       Confidence: {(auditResult.confidence * 100).toFixed(1)}% (SSIM)
                   </p>
               </div>
           </div>

           {/* NEW: Analysis Breakdown Section */}
           <ScoreCompositionTable score={auditResult} />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[var(--border-light)] pt-6">
              <div className="space-y-2">
                <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Source A</h5>
                <img src={imageA!} className="w-full h-auto object-cover rounded border border-[var(--border-light)]" />
              </div>
              <div className="space-y-2">
                <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Source B</h5>
                <img src={imageB!} className="w-full h-auto object-cover rounded border border-[var(--border-light)]" />
              </div>
              <div className="space-y-2">
                 <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">SSIM Difference Map</h5>
                 <canvas ref={diffCanvasRef} className="w-full h-auto object-cover rounded border border-[var(--border-light)] bg-black"></canvas>
              </div>
           </div>

           <div className="border border-[var(--border-light)] rounded bg-white/60 p-3">
             <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Performance Summary</h5>
             <table className="w-full text-[10px] font-mono">
               <tbody>
                 <tr className="border-b border-[var(--border-light)]">
                   <td className="py-1 pr-2 opacity-60">Compare Time</td>
                   <td className="py-1 font-bold text-right">{perfMetrics.compareMs} ms</td>
                 </tr>
                 <tr className="border-b border-[var(--border-light)]">
                   <td className="py-1 pr-2 opacity-60">Bytes Processed (Approx)</td>
                   <td className="py-1 font-bold text-right">{perfMetrics.bytesProcessed.toLocaleString()} B</td>
                 </tr>
                 <tr className="border-b border-[var(--border-light)]">
                   <td className="py-1 pr-2 opacity-60">Image A Dimensions</td>
                   <td className="py-1 font-bold text-right">{perfMetrics.imageADims}</td>
                 </tr>
                 <tr>
                   <td className="py-1 pr-2 opacity-60">Image B Dimensions</td>
                   <td className="py-1 font-bold text-right">{perfMetrics.imageBDims}</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
    );
  };

  return (
    <div className="py-12 space-y-8 animate-in fade-in duration-700">
        {/* Header */}
        <header className="space-y-4">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Trident Image Engine (v1.3)</span>
            <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Image Difference Lab</h2>
            <p className="text-xl opacity-60 max-w-2xl font-serif italic">Select a scan mode and two images to compute the perceptual difference. The engine provides real-time feedback during analysis.</p>
        </header>

        {/* Scan Mode Selector */}
        <div className="flex items-center gap-4 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg p-3">
            <label className="font-mono text-xs uppercase font-bold">Scan Mode:</label>
            <select value={scanMode} onChange={e => setScanMode(e.target.value as TridentConfig['mode'])} disabled={isComparing || !isEngineReady} className="bg-white/10 border-none rounded text-xs p-1">
                <option value="QuickScan">Quick Scan (Fast, pHash-focused)</option>
                <option value="DeepStructural">Deep Structural (Balanced)</option>
                <option value="SemanticAI">Semantic AI (Slow, AI-powered)</option>
            </select>
        </div>

        {/* Main Content: Uploads & Progress */}
        {isComparing ? (
            <div className="h-[240px] border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col items-center justify-center text-center p-8">
                <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
                    <div className="bg-[var(--trust-blue)] h-2.5 rounded-full" style={{ width: `${progress.percent}%` }}></div>
                </div>
                <p className="font-mono text-sm text-[var(--trust-blue)]">{progress.stage}</p>
                <p className="font-mono text-xs opacity-60 mt-1">Elapsed Time: {progress.elapsed.toFixed(1)}s</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload A */}
                <div className="space-y-3">
                    <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">Source A</h3>
                    <div className="p-4 border border-dashed border-[var(--border-light)] rounded-lg">
                        <input className="file-input text-xs" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageA)} />
                        {imageA && <img ref={imageARef} className="mt-4 w-full h-auto rounded shadow-md" src={imageA} alt="Image A Preview" />}
                    </div>
                </div>
                {/* Image Upload B */}
                 <div className="space-y-3">
                    <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">Source B</h3>
                    <div className="p-4 border border-dashed border-[var(--border-light)] rounded-lg">
                        <input className="file-input text-xs" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageB)} />
                        {imageB && <img ref={imageBRef} className="mt-4 w-full h-auto rounded shadow-md" src={imageB} alt="Image B Preview" />}
                    </div>
                </div>
            </div>
        )}

        {/* Action Button */}
        <div className="text-center pt-4">
            <button className="button px-8 py-3 bg-[var(--trust-blue)] text-white font-mono text-sm uppercase font-bold rounded hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCompare} disabled={!imageA || !imageB || isComparing || !isEngineReady}>
                {isComparing ? `ANALYZING...` : !isEngineReady ? `ENGINE LOADING...` : `Calculate Difference`}
            </button>
        </div>

        {/* Error Display */}
        {error && <div className="p-4 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-xs font-serif italic text-center">{error}</div>}

        {/* Report Section */}
        <div className="mt-8">
            <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em] mb-4">Analysis Report</h3>
            {auditResult && perfMetrics ? renderReport() : (
                <div className="h-[200px] border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col items-center justify-center text-center p-8 opacity-50 italic font-serif">
                    <span className="text-4xl mb-4">🔬</span>
                    <p>Report will be generated here after comparison.</p>
                </div>
            )}
        </div>

        {/* Analysis Trace Log */}
        {logMessages.length > 0 && (
            <div className="mt-8">
                <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em] mb-4">Analysis Trace</h3>
                <div className="bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-[9px] space-y-1 opacity-70">
                    {logMessages.map((log, i) => <div key={i} className="break-all">{log}</div>)}
                </div>
            </div>
        )}
    </div>
  );
};

export default ImageComparator;
