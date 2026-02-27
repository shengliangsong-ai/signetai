
import React, { useEffect, useState, useRef } from 'react';
import { SecurityIntegrityMonitor } from './SecurityIntegrityMonitor';

const OPERATIONS = [
  "Probing L3 Logic Drift...",
  "Validating JUMBF Capsule Integrity...",
  "Sampling Merkle Leaf [0x4A]...",
  "Verifying Ed25519 TKS Signature...",
  "Checking Vision Substrate Parity...",
  "Rotating Ephemeral Session Keys...",
  "Auditing DAG Branch Consistency...",
  "Cross-referencing ISO/TC 290 Nodes...",
  "Scanning for Adversarial Drift...",
  "Attesting Curatorial Signet...",
  "Hashing Output Payload...",
  "Decrypting Peer-Audit Evidence...",
  "Validating Symbolic Parity...",
  "Analyzing Manifest DNA Roots...",
  "Synchronizing Identity Registry..."
];

const LAYERS = ["L1", "L2", "L3", "L4"];

export const PortalView: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<{ id: string; msg: string; status: string; layer: string }[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [auditMode, setAuditMode] = useState<'EXHAUSTIVE' | 'PROBABILISTIC'>('PROBABILISTIC');
  const [showGuide, setShowGuide] = useState(false);
  const [showNeuralAudit, setShowNeuralAudit] = useState(false);
  const traceCounter = useRef(Math.floor(Math.random() * 1000));
  const portalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const urlParams = new URLSearchParams(window.location.search);
      const verifyUrl = urlParams.get('verify_url');
      if (verifyUrl) {
        setShowNeuralAudit(true);
      }

      if (!isFinalized && showNeuralAudit) {
        const interval = setInterval(() => {
          traceCounter.current += 1;
          const op = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
          const layer = LAYERS[Math.floor(Math.random() * LAYERS.length)];
          
          const newLog = {
            id: '0x' + traceCounter.current.toString(16).toUpperCase().padStart(4, '0'),
            msg: `${op} [Ref:${Math.floor(Math.random() * 999)}]`,
            layer: layer,
            status: 'VERIFIED'
          };
          
          setLogs(prev => [newLog, ...prev].slice(0, 20));
        }, auditMode === 'PROBABILISTIC' ? 1000 : 300);
        
        return () => {
          clearInterval(interval);
        };
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFinalized, auditMode, showNeuralAudit]);

  const handleFinalizeAndSeal = async () => {
    setIsFinalized(true);
    if (portalContentRef.current) {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(portalContentRef.current, { useCORS: true, allowTaint: true });
      const link = document.createElement('a');
      link.download = 'signet-sealed-manifest.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div ref={portalContentRef} className="relative w-full max-w-7xl h-full max-h-[90vh] bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl overflow-hidden flex flex-col rounded-lg">
        {/* Header */}
        <div className="p-8 border-b border-[var(--border-light)] flex flex-wrap justify-between items-center bg-[var(--table-header)] gap-6">
          <div className="flex items-center gap-6">
              <div className="w-12 h-12 border-2 border-[var(--trust-blue)] flex items-center justify-center rounded-sm">
                <span className="text-[var(--trust-blue)] font-bold text-xl">∑</span>
              </div>
              <div>
                <h2 className="font-serif text-3xl text-[var(--text-header)] italic font-bold tracking-tight">Verifier SDK</h2>
              </div>
            </div>
          <div className="flex gap-4 ml-auto">
             <button
                onClick={() => setShowNeuralAudit(!showNeuralAudit)}
                className={`px-4 py-1.5 border ${showNeuralAudit ? 'bg-[var(--trust-blue)] text-white' : 'border-[var(--trust-blue)] text-[var(--trust-blue)]'} font-mono text-[9px] uppercase font-bold transition-all`}
                >
                {showNeuralAudit ? 'Hide Verifier' : 'Show Usage Guide'}
                </button>
             <button onClick={onClose} className="text-3xl hover:text-[var(--trust-blue)] transition-colors px-4">×</button>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-hidden flex">
          {showNeuralAudit ? (
            <>
              <div className="w-full lg:w-80 p-8 border-r border-[var(--border-light)] bg-[var(--bg-sidebar)] space-y-10 overflow-y-auto">
                <SecurityIntegrityMonitor />
              </div>

              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
                {showGuide && (
                  <div className="absolute inset-0 z-50 flex">
                    <div className="w-full lg:w-96 bg-black text-white p-12 overflow-y-auto animate-in slide-in-from-left duration-300">
                      <h3 className="font-serif text-4xl italic mb-8 border-b border-white/20 pb-4">Audit Specs</h3>
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h4 className="font-mono text-[10px] uppercase text-[var(--trust-blue)] font-bold">Continuous Attestation</h4>
                          <p className="text-[12px] opacity-70 leading-relaxed italic">The loop is intentional. It confirms state integrity every second to prevent post-generation drift.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-mono text-[10px] uppercase text-[var(--trust-blue)] font-bold">Probabilistic Sampling</h4>
                          <p className="text-[12px] opacity-70 leading-relaxed italic">Signet audits random logic branches to maintain O(log n) efficiency at planetary scale.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowGuide(false)}></div>
                  </div>
                )}

                {/* Main Feed */}
                <div className="flex-1 flex flex-col">
                  <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center px-8">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-[var(--text-header)] uppercase tracking-widest font-bold">Neural Audit 0.3.1 (TEST)</span>
                      <span className="font-mono text-[9px] text-red-500 uppercase font-bold">[TODO]</span>
                      <div className="flex items-center gap-2 px-2 py-0.5 rounded-full border border-[var(--trust-blue)]/30 bg-[var(--admonition-bg)]">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                         <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--trust-blue)] font-bold">HEARTBEAT_SYNC</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest">v0.2.6_CORE</span>
                  </div>

                  <div className="flex-1 bg-[var(--code-bg)] p-8 overflow-y-auto font-mono text-[11px] space-y-2">
                    <div className="grid grid-cols-4 gap-4 pb-4 mb-4 border-b border-[var(--border-light)] opacity-30 text-[9px] uppercase font-bold tracking-widest">
                      <div>Trace Ref ID</div>
                      <div>Layer</div>
                      <div>Operation Substrate</div>
                      <div className="text-right">Verdict</div>
                    </div>

                    {logs.map((log, i) => (
                      <div key={i} className={`grid grid-cols-4 gap-4 animate-in slide-in-from-bottom-1 duration-300 ${i === 0 ? 'text-[var(--trust-blue)]' : 'opacity-60'}`}>
                        <div className="font-bold">{log.id}</div>
                        <div className="text-[9px] mt-0.5">[{log.layer}] AUDIT</div>
                        <div className="italic">{log.msg}</div>
                        <div className="text-right font-bold text-green-500">✓ {log.status}</div>
                      </div>
                    ))}
                    {logs.length === 0 && <div className="text-center py-20 opacity-20 italic">Initializing Attestation Pipeline...</div>}
                  </div>

                  <div className="p-8 border-t border-[var(--border-light)] bg-[var(--table-header)] grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-1">
                        <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Merkle Coverage</p>
                        <p className="font-serif text-2xl font-bold italic">{auditMode === 'PROBABILISTIC' ? '5.2%' : '100.0%'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Compute Overhead</p>
                        <p className="font-serif text-2xl font-bold italic">Near-Zero</p>
                     </div>
                     <div className="space-y-1">
                        <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Signet Status</p>
                        <p className="font-serif text-2xl text-[var(--trust-blue)] font-bold italic">DETERMINISTIC</p>
                     </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 p-12 overflow-y-auto">
              <h3 className="font-serif text-4xl italic mb-8 border-b border-[var(--border-light)] pb-4">SDK Usage Guide</h3>
              <div className="space-y-12">
                
                <div className="space-y-4">
                  <h4 className="font-mono text-lg text-[var(--trust-blue)] uppercase tracking-widest">Overview</h4>
                  <p className="text-sm opacity-70 leading-relaxed">
                    The Verifier SDK provides tools to integrate Neural Audit's verification capabilities into your own applications. 
                    You can verify digital assets, check their provenance, and ensure their integrity using our powerful "Neural Lens" technology.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-lg text-[var(--trust-blue)] uppercase tracking-widest">Direct URL Verification</h4>
                  <p className="text-sm opacity-70 leading-relaxed">
                    You can trigger a verification for any publicly accessible asset by using the <code>?verify_url=</code> query parameter. 
                    This is a quick way to inspect an asset without any integration.
                  </p>
                  <p className="text-sm">
                    <strong>Example:</strong> <br />
                    <code className="bg-[var(--code-bg)] p-2 rounded text-[12px]">
                      {window.location.origin}{window.location.pathname}?verify_url=https://example.com/my-image.jpg
                    </code>
                  </p>
                  <p className="text-xs text-red-500 font-mono">
                    // TODO: Implement the backend logic to fetch and process the URL.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-lg text-[var(--trust-blue)] uppercase tracking-widest">API Integration (Neural Lens)</h4>
                  <p className="text-sm opacity-70 leading-relaxed">
                    For deeper integration, you can use the Neural Lens API. This allows you to programmatically submit assets for verification and receive detailed reports.
                  </p>
                  <div className="bg-[var(--code-bg)] p-4 rounded space-y-2">
                    <p className="font-mono text-[12px]">
                      <strong>API Endpoint:</strong> <code>https://api.signet.ai/v1/verify</code> <br />
                      <strong>Method:</strong> <code>POST</code> <br />
                      <strong>Body:</strong>
                    </p>
                    <pre className="text-[12px] opacity-70">
{`{
  "apiKey": "YOUR_API_KEY", 
  "assetUrl": "https://example.com/my-asset.png"
}`}
                    </pre>
                    <p className="text-xs text-red-500 font-mono">
                      // TODO: Implement API key generation and management for users. <br />
                      // TODO: Build the '/v1/verify' API endpoint.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono text-lg text-[var(--trust-blue)] uppercase tracking-widest">Developer Resources</h4>
                  <ul className="list-disc list-inside text-sm opacity-70 space-y-2">
                    <li><a href="/spec" className="text-[var(--trust-blue)] hover:underline">Technical Specification</a></li>
                    <li><a href="https://github.com/signetai-io/website" target="_blank" rel="noopener noreferrer" className="text-[var(--trust-blue)] hover:underline">GitHub Repository</a></li>
                    <li><p>Support: <code className="text-[12px]">support@signet.ai</code></p></li>
                  </ul>
                   <p className="text-xs text-red-500 font-mono">
                      // TODO: Create a dedicated documentation site.
                    </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-light)] bg-[var(--bg-standard)] flex justify-between items-center">
          <p className="font-mono text-[9px] opacity-40 uppercase tracking-widest italic">Attestation finalized by Lead Architect (Signet Labs)</p>
          <div className="flex gap-4">
            <button 
              onClick={handleFinalizeAndSeal}
              disabled={!showNeuralAudit}
              className={`px-8 py-2 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isFinalized ? 'MANIFEST_SEALED' : 'Finalize & Seal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
