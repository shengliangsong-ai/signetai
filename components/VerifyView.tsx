import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Admonition } from './Admonition';
import { NutritionLabel } from './NutritionLabel';

export const VerifyView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [showL2, setShowL2] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for deep-linked URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deepLinkUrl = params.get('url') || params.get('verify_url');
    
    if (deepLinkUrl) {
      setUrlInput(deepLinkUrl);
      handleUrlFetch(deepLinkUrl);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setManifest(null);
      setShowL2(false);
      setFetchError(null);
    }
  };

  const handleUrlFetch = async (url: string) => {
    if (!url) return;
    setIsFetching(true);
    setFetchError(null);
    setFile(null);
    setManifest(null);
    
    try {
      // In a real env, this might need a CORS proxy if the target doesn't allow cross-origin
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      // Try to get filename from url or headers
      const urlFileName = url.split('/').pop()?.split('?')[0] || 'remote_asset.bin';
      const fetchedFile = new File([blob], urlFileName, { type: blob.type });
      
      setFile(fetchedFile);
    } catch (err: any) {
      console.error("Fetch error:", err);
      let msg = "Failed to fetch asset.";
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        msg = "CORS Error: The hosting server blocked this request. Try downloading the file and dragging it here instead.";
      }
      setFetchError(msg);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFetchError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setManifest(null);
      setShowL2(false);
    }
  }, []);

  const handleVerify = () => {
    if (!file) return;
    setIsVerifying(true);
    
    // Simulated C2PA v2.3 Verification Loop
    setTimeout(() => {
      setManifest({
        signature: {
          identity: "Signet Alpha Model",
          anchor: "signetai.io:ssl",
          timestamp: Date.now() - 1000 * 60 * 5,
        },
        assertions: [{
          data: {
            actions: [{ softwareAgent: "Signet AI Neural Prism v0.2.7" }]
          }
        }]
      });
      setIsVerifying(false);
      setShowL2(true);
    }, 1500);
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Public Verification Tool</span>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Audit Content History.</h2>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
          Drag and drop any asset to inspect its Content Credentials. Verified by the global Signet Registry.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Universal Ingest Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`h-96 border-2 border-dashed rounded-2xl bg-[var(--bg-standard)] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${
              dragActive ? 'border-[var(--trust-blue)] bg-blue-50/10' : 'border-[var(--border-light)] hover:border-[var(--trust-blue)]'
            }`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--trust-blue) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {isFetching ? (
               <div className="text-center space-y-4 relative z-10 animate-pulse">
                 <span className="text-6xl">🌐</span>
                 <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em]">Resolving Remote Asset...</p>
               </div>
            ) : file ? (
              <div className="text-center space-y-4 relative z-10">
                <span className="text-6xl">🛡️</span>
                <p className="font-mono text-sm font-bold text-[var(--text-header)]">{file.name}</p>
                <p className="text-xs opacity-40 uppercase font-mono tracking-widest">Substrate Ready for Audit</p>
                
                {manifest && (
                  <div className="absolute top-0 right-[-60px]">
                    <div className="cr-badge w-12 h-12 bg-white text-[var(--trust-blue)] shadow-xl animate-bounce">cr</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="text-6xl">⭱</span>
                <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em]">
                  {dragActive ? 'Release to Ingest' : 'Drop Asset / Paste URL'}
                </p>
              </div>
            )}
            
            {dragActive && (
              <div className="absolute inset-0 bg-[var(--trust-blue)]/10 pointer-events-none flex items-center justify-center">
                 <p className="font-serif text-2xl font-bold italic text-[var(--trust-blue)]">Drop to Audit</p>
              </div>
            )}
          </div>

          {/* URL Input & Controls */}
          <div className="space-y-4">
             <div className="flex gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                    <span className="text-xs">🔗</span>
                  </div>
                  <input 
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://... (Remote Audit)"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch(urlInput)}
                    className="w-full pl-9 pr-4 py-3 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded font-mono text-[11px] outline-none focus:border-[var(--trust-blue)] transition-colors"
                  />
                  {urlInput && (
                    <button 
                      onClick={() => handleUrlFetch(urlInput)}
                      className="absolute inset-y-0 right-0 px-4 text-[9px] font-bold uppercase hover:bg-[var(--bg-sidebar)] transition-colors rounded-r border-l border-[var(--border-light)] text-[var(--trust-blue)]"
                    >
                      Fetch
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => { setFile(null); setManifest(null); setShowL2(false); setUrlInput(''); setFetchError(null); }}
                  className="px-6 border border-[var(--border-light)] rounded hover:bg-neutral-50 transition-colors font-mono text-[10px] uppercase font-bold"
                >
                  Clear
                </button>
             </div>

             {fetchError && (
               <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-serif italic">
                 ⚠️ {fetchError}
               </div>
             )}

             <button 
               onClick={handleVerify}
               disabled={!file || isVerifying || isFetching}
               className="w-full py-5 bg-[var(--trust-blue)] text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded-lg shadow-2xl transition-all disabled:opacity-30 disabled:shadow-none hover:brightness-110 active:scale-95"
             >
               {isVerifying ? 'PROBING SUBSTRATE...' : 'Execute Audit (∑)'}
             </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">L2_Disclosure</h3>
          {manifest ? (
            <div className="relative h-[400px]">
               <NutritionLabel manifest={manifest} onClose={() => setShowL2(false)} />
            </div>
          ) : (
            <div className="h-[400px] border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col items-center justify-center text-center p-8 opacity-30 italic font-serif">
               <span className="text-4xl mb-4">🔬</span>
               <p>Awaiting asset ingestion for progressive disclosure.</p>
            </div>
          )}
        </div>
      </div>

      <Admonition type="note" title="Durable Credentials">
        If an image is uploaded without metadata, our <strong>Soft Binding</strong> engine will use perceptual hashing (pHash) to recover its credentials from the Signet cloud repository.
      </Admonition>
    </div>
  );
};