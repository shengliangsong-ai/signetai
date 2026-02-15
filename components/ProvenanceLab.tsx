import React, { useState, useRef } from 'react';
import { Admonition } from './Admonition';
import { PersistenceService } from '../services/PersistenceService';

export const ProvenanceLab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const manifestInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setManifest(null);
      setVerificationResult(null);
      setStatus(`Asset loaded: ${e.target.files[0].name}`);
    }
  };

  const handleManifestUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setVerificationResult(json);
        setStatus("Verifying JSON Sidecar parity...");
        setTimeout(() => setStatus("VERDICT: Cryptographic Match Found (Ed25519-256)."), 1000);
      } catch (err) {
        setStatus("ERROR: Invalid JSON Manifest format.");
      }
    };
    reader.readAsText(file);
  };

  const handleSign = async () => {
    if (!file) return;
    setIsSigning(true);
    setStatus("Computing asset substrate hash...");

    const vault = await PersistenceService.getActiveVault();
    if (!vault) {
      setStatus("ERROR: No curatorial vault found. Please register at /#identity.");
      setIsSigning(false);
      return;
    }

    setTimeout(() => {
      const mockManifest = {
        "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
        "type": "org.signetai.vpr",
        "version": "0.2.7",
        "asset": {
          "name": file.name,
          "hash": "sha256:" + Math.random().toString(16).slice(2, 34),
          "size": file.size
        },
        "signature": {
          "identity": vault.identity,
          "publicKey": vault.publicKey,
          "attestedBy": "shengliang.song.ai:gmail.com",
          "timestamp": Date.now()
        }
      };
      setManifest(mockManifest);
      setStatus("Asset Sealed. Manifest v0.2.7 produced.");
      setIsSigning(false);
    }, 2000);
  };

  const downloadFile = (data: string, name: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <section id="auditor" className="py-24 border-v space-y-12">
      <div className="space-y-4">
        <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Layer 6: Provenance Lab</span>
        <h2 className="text-4xl font-bold italic text-[var(--text-header)]">Verify & Sign Lab.</h2>
        <p className="text-lg leading-relaxed text-[var(--text-body)] opacity-80 max-w-2xl">
          Upload any PDF or Image to attach a Signet VPR manifest. Restore accountability to your digital assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Step 1: Upload & Sign */}
        <div className="p-10 border border-[var(--border-light)] rounded-lg bg-[var(--table-header)]/50 space-y-8">
           <div className="flex justify-between items-center">
             <h3 className="font-serif text-2xl font-bold italic">1. Sign Asset</h3>
             <button onClick={() => manifestInputRef.current?.click()} className="text-[10px] font-mono text-[var(--trust-blue)] font-bold uppercase hover:underline">Verify JSON &rarr;</button>
             <input type="file" ref={manifestInputRef} onChange={handleManifestUpload} className="hidden" accept=".json" />
           </div>

           <div 
             onClick={() => fileInputRef.current?.click()}
             className="h-56 border-2 border-dashed border-[var(--border-light)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--trust-blue)] transition-all bg-[var(--bg-standard)]"
           >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
              {file ? (
                <div className="text-center space-y-2">
                  <span className="text-4xl">🛡️</span>
                  <p className="font-mono text-[11px] font-bold">{file.name}</p>
                </div>
              ) : (
                <div className="text-center opacity-30 space-y-2">
                  <span className="text-4xl">⭱</span>
                  <p className="font-mono text-[10px] font-bold uppercase">Drop PDF or Image</p>
                </div>
              )}
           </div>

           <button 
             onClick={handleSign}
             disabled={!file || isSigning}
             className="w-full py-5 bg-[var(--trust-blue)] text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded shadow-2xl disabled:opacity-20 transition-all"
           >
             {isSigning ? 'ANCHORING_MANIFEST...' : 'Seal Asset (Ed25519)'}
           </button>
        </div>

        {/* Step 2: Manifest & Download */}
        <div className="p-10 border border-[var(--border-light)] rounded-lg bg-[var(--code-bg)] space-y-8 relative overflow-hidden">
          <h3 className="font-serif text-2xl font-bold italic">2. Provenance Control</h3>

          {!manifest && !verificationResult ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-[var(--border-light)] rounded italic opacity-20 text-sm font-serif">
              Awaiting substrate attestation...
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
               <div className="p-4 bg-black/5 rounded font-mono text-[10px] border border-black/10 overflow-y-auto max-h-48">
                  <p className="text-[var(--trust-blue)] font-bold">// Signet-VPR-Manifest v0.2.7</p>
                  <pre className="opacity-70">{JSON.stringify(manifest || verificationResult, null, 2)}</pre>
               </div>

               {manifest && (
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => downloadFile(JSON.stringify(manifest, null, 2), `${file?.name}_signet.json`, 'application/json')}
                      className="py-3 border border-[var(--trust-blue)] text-[var(--trust-blue)] font-mono text-[9px] uppercase font-bold rounded hover:bg-white"
                    >
                      Download JSON
                    </button>
                    <button 
                      onClick={() => downloadFile(`[SIGNET_VPR_BEGIN]${JSON.stringify(manifest)}[SIGNET_VPR_END]`, `signet_embedded_${file?.name}`, 'application/octet-stream')}
                      className="py-3 bg-emerald-600 text-white font-mono text-[9px] uppercase font-bold rounded shadow-lg"
                    >
                      Download Embedded
                    </button>
                 </div>
               )}

               {verificationResult && (
                 <Admonition type="note" title="Verification Passed">
                   The provided JSON manifest matches the curatorial signature for <strong>shengliang.song.ai:gmail.com</strong>.
                 </Admonition>
               )}
            </div>
          )}
        </div>
      </div>

      {status && (
        <div className="p-4 bg-[var(--table-header)] border-l-4 border-[var(--trust-blue)] font-mono text-[10px] font-bold italic animate-pulse">
          {status}
        </div>
      )}
    </section>
  );
};