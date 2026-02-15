
import React, { useEffect, useState, useRef } from 'react';

const DefinitionItem: React.FC<{ term: string; def: string }> = ({ term, def }) => (
  <div className="space-y-1">
    <dt className="font-mono text-[9px] text-[var(--trust-blue)] uppercase font-bold tracking-widest">{term}</dt>
    <dd className="text-[11px] text-[var(--text-body)] opacity-60 leading-relaxed italic">{def}</dd>
  </div>
);

export const PortalView: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<{ id: string; msg: string; status: string; timestamp: string }[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isPaused && !isFinalized) {
      document.body.style.overflow = 'hidden';
      const interval = setInterval(() => {
        const now = new Date();
        const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
        const newLog = {
          id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          msg: [
            'Calibrating Neural Lens...',
            'Probing L2 DAG Nodes...',
            'Verifying Parity Score...',
            'Attesting Signet Identity...',
            'Soft-Binding JUMBF Payload...'
          ][Math.floor(Math.random() * 5)],
          status: Math.random() > 0.15 ? 'OK' : 'AUDIT',
          timestamp
        };
        setLogs(prev => [newLog, ...prev].slice(0, 20));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, isPaused, isFinalized]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--table-header)]">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 border border-[var(--trust-blue)] flex items-center justify-center rotate-45">
              <div className="w-2 h-2 bg-[var(--trust-blue)]"></div>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--text-header)] italic font-bold">Signet Command Center</h2>
              <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.4em]">Protocol Session: {isFinalized ? 'FINALIZED' : 'STREAMING'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-full">
            
            {/* Column 1: Definitions & Control */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-header)] border-b border-[var(--border-light)] pb-2 font-bold">Audit Controls</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold border ${isPaused ? 'bg-[var(--trust-blue)] text-white' : 'border-[var(--border-light)] text-[var(--text-body)]'}`}
                  >
                    {isPaused ? '▶ Resume Telemetry' : '⏸ Pause Stream'}
                  </button>
                  <button 
                    onClick={() => setIsFinalized(true)}
                    className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold bg-black text-white hover:bg-[var(--trust-blue)] transition-colors"
                  >
                    🔒 Finalize & Sign Manifest
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-header)] border-b border-[var(--border-light)] pb-2 font-bold">Protocol Glossary</h3>
                <dl className="space-y-4">
                  <DefinitionItem term="Trace ID" def="Unique identifier for a single reasoning node in the Logic DAG." />
                  <DefinitionItem term="Audit Message" def="The specific layer of validation being applied to the node." />
                  <DefinitionItem term="Status: OK" def="Cryptographic parity confirmed between AI model and manifest." />
                  <DefinitionItem term="Status: AUDIT" def="Logic drift detected. Node flagged for manual human attestation." />
                </dl>
              </div>
            </div>

            {/* Column 2 & 3: Live Verification Feed */}
            <div className="lg:col-span-2 flex flex-col h-full border-l border-[var(--border-light)] pl-12">
              <div className="flex-1 border border-[var(--border-light)] rounded overflow-hidden flex flex-col bg-[var(--code-bg)]">
                <div className="p-4 border-b border-[var(--border-light)] bg-[var(--table-header)] flex justify-between items-center">
                  <span className="font-mono text-[11px] text-[var(--text-header)] uppercase tracking-widest font-bold">Neural Lens Stream / Live Audit</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isFinalized ? 'bg-green-500' : 'bg-[var(--trust-blue)] animate-pulse'}`}></span>
                    <span className="font-mono text-[9px] text-[var(--text-body)] uppercase tracking-tighter opacity-60">
                      {isFinalized ? 'MANIFEST_IMMUTABLE' : isPaused ? 'IDLE: STATE_LOCKED' : 'PROBING_ACTIVE'}
                    </span>
                  </div>
                </div>
                
                {/* Table Headers */}
                <div className="grid grid-cols-4 px-6 py-2 border-b border-[var(--border-light)] bg-[var(--table-header)] font-mono text-[9px] uppercase font-bold opacity-40">
                  <div>Timestamp</div>
                  <div>Trace ID</div>
                  <div className="col-span-1">Operation</div>
                  <div className="text-right">Verdict</div>
                </div>

                <div className="flex-1 p-6 font-mono text-[12px] overflow-y-auto space-y-2 text-[var(--text-body)]" ref={scrollRef}>
                  {isFinalized && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded mb-4 text-center">
                      <p className="font-bold">✓ AUDIT COMPLETE</p>
                      <p className="text-[10px] opacity-70">Manifest bound to JUMBF Box 0x92AF...C110</p>
                    </div>
                  )}
                  {logs.map((log, idx) => (
                    <div key={idx} className={`grid grid-cols-4 gap-4 animate-in slide-in-from-left-1 duration-200 ${idx === 0 ? 'text-[var(--trust-blue)]' : 'opacity-60'}`}>
                      <span className="opacity-40 text-[10px]">{log.timestamp}</span>
                      <span className="font-bold">[{log.id}]</span>
                      <span className="flex-1">{log.msg}</span>
                      <span className={`text-right font-bold ${log.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>{log.status}</span>
                    </div>
                  ))}
                  {logs.length === 0 && <p className="opacity-20 animate-pulse text-center mt-20">Initializing Neural Link...</p>}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-[var(--border-light)] text-center bg-[var(--table-header)]">
                  <p className="font-mono text-[9px] text-[var(--text-body)] opacity-50 uppercase mb-1">Total Nodes</p>
                  <p className="font-serif text-2xl text-[var(--text-header)] font-bold italic">{isFinalized ? '241' : logs.length + 150}</p>
                </div>
                <div className="p-4 border border-[var(--border-light)] text-center bg-[var(--table-header)]">
                  <p className="font-mono text-[9px] text-[var(--text-body)] opacity-50 uppercase mb-1">Integrity Score</p>
                  <p className="font-serif text-2xl text-[var(--trust-blue)] font-bold italic">0.9982</p>
                </div>
                <div className="p-4 border border-[var(--border-light)] text-center bg-[var(--table-header)]">
                  <p className="font-mono text-[9px] text-[var(--text-body)] opacity-50 uppercase mb-1">State Drift</p>
                  <p className="font-serif text-2xl text-[var(--text-header)] font-bold italic">0.00%</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-light)] bg-[var(--table-header)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] text-[var(--text-body)] opacity-40 tracking-widest uppercase">Signet AI Labs | Protocol Compliance Node v0.2.5</p>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-[var(--border-light)] text-[var(--text-body)] font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-[var(--trust-blue)] hover:text-white transition-all">
              Export VPR Manifest
            </button>
            <button 
              disabled={isFinalized}
              className={`px-6 py-2 ${isFinalized ? 'bg-neutral-500 cursor-not-allowed' : 'bg-[var(--trust-blue)]'} text-white font-mono text-[9px] uppercase tracking-widest font-bold shadow-lg transition-all`}
            >
              {isFinalized ? 'SESSION_LOCKED' : 'Re-Attest Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
