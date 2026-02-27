
import React, { useEffect, useState, useRef } from 'react';
import { SecurityIntegrityMonitor } from './SecurityIntegrityMonitor';

const DefinitionItem: React.FC<{ term: string; def: string }> = ({ term, def }) => (
  <div className="space-y-1">
    <dt className="font-mono text-[9px] text-[var(--trust-blue)] uppercase font-bold tracking-widest">{term}</dt>
    <dd className="text-[11px] text-[var(--text-body)] opacity-60 leading-relaxed italic">{def}</dd>
  </div>
);

const HelpPulse: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-2 group">
      <button 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-3 h-3 rounded-full border border-[var(--trust-blue)] text-[var(--trust-blue)] flex items-center justify-center text-[7px] font-bold hover:bg-[var(--trust-blue)] hover:text-white transition-all animate-pulse"
      >
        ?
      </button>
      {show && (
        <div className="absolute left-full top-0 ml-4 w-48 p-3 bg-black text-white text-[10px] leading-relaxed rounded shadow-2xl z-[300] border border-[var(--trust-blue)] animate-in fade-in slide-in-from-left-2 duration-200">
          <div className="absolute left-0 top-1.5 -ml-1 w-2 h-2 bg-black border-l border-b border-[var(--trust-blue)] rotate-45"></div>
          {text}
        </div>
      )}
    </div>
  );
};

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
  const [showGuide, setShowGuide] = useState(true);
  const [showNeuralAudit, setShowNeuralAudit] = useState(false);
  const traceCounter = useRef(Math.floor(Math.random() * 1000));
  const portalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Check for URL parameters to trigger verification
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
                <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.4em]">Neural Audit 0.3.1 (TEST)</p>
              </div>
            </div>
          <div className="flex gap-4 ml-auto">
             <button
                onClick={() => setShowNeuralAudit(!showNeuralAudit)}
                className={`px-4 py-1.5 border ${showNeuralAudit ? 'bg-[var(--trust-blue)] text-white' : 'border-[var(--trust-blue)] text-[var(--trust-blue)]'} font-mono text-[9px] uppercase font-bold transition-all`}
                >
                {showNeuralAudit ? 'Hide Verifier' : 'Show Verifier'}
                </button>
             <button onClick={onClose} className="text-3xl hover:text-[var(--trust-blue)] transition-colors px-4">×</button>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-hidden flex">
          {showNeuralAudit ? (
            <>
              {/* ... existing verifier UI ... */}
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
        </div>
      </div>
    </div>
  );
};
