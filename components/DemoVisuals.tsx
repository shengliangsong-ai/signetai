
import React, { useState, useEffect } from 'react';

const CheckmarkCircle: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
  </svg>
);

const TerminalLine: React.FC<{ text: string; hasCursor?: boolean }> = ({ text, hasCursor }) => (
  <div className="flex items-center font-mono text-xs text-green-400">
    <span className="text-gray-500 mr-2">$</span>
    <span className="flex-1">{text}</span>
    {hasCursor && <div className="w-2 h-4 bg-green-400 animate-pulse ml-1"></div>}
  </div>
);

export const TrustKeyRegistryVisual: React.FC = () => {
  const [status, setStatus] = useState(0); // 0: initial, 1: querying, 2: found
  useEffect(() => {
    const t1 = setTimeout(() => setStatus(1), 1000);
    const t2 = setTimeout(() => setStatus(2), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="p-4 rounded-md bg-[var(--code-bg)] border border-[var(--border-light)] font-sans">
      <div className="font-mono text-xs mb-2 text-gray-400">TrustKey Registry Lookup</div>
      {status < 2 && <TerminalLine text="verify --anchor signetai.io:ssl" hasCursor={status === 0} />}
      {status === 1 && <div className="font-mono text-xs text-amber-500 animate-pulse mt-2">Querying decentralized registry...</div>}
      {status === 2 && (
        <>
          <TerminalLine text="verify --anchor signetai.io:ssl" />
          <div className="mt-2 p-2 border border-green-500/30 bg-green-900/50 rounded-sm text-xs animate-fade-in-fast">
            <div className="flex items-center gap-2 font-bold text-green-400">
                <CheckmarkCircle /> VERIFIED TRUSTED ANCHOR
            </div>
            <div className="font-mono text-gray-400 mt-2 break-all">
                <strong className="text-gray-300">pubkey:</strong> ed25519:signet_v3.1_sovereign_5b98...e4a8bdf9
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const UniversalMediaSigningVisual: React.FC = () => (
  <div className="p-4 rounded-md bg-[var(--code-bg)] border border-[var(--border-light)] font-sans flex items-center justify-around space-x-2 h-[120px]">
    <div className="text-center animate-fade-in-fast">
      <div className="text-4xl">📄</div>
      <div className="text-xs font-bold mt-1">MediaFile.pdf</div>
    </div>
    <div className="text-3xl text-gray-500 animate-fade-in-delay-1">+</div>
    <div className="text-center animate-fade-in-delay-2">
      <div className="text-4xl">🔑</div>
      <div className="text-xs font-bold mt-1 text-[var(--trust-blue)]">Private Key</div>
    </div>
    <div className="text-3xl text-gray-500 animate-fade-in-delay-3">=</div>
    <div className="text-center animate-fade-in-delay-4">
      <div className="text-4xl">🛡️</div>
      <div className="text-xs font-bold mt-1 text-green-500">Signed Asset</div>
    </div>
  </div>
);

export const PublicVerifierVisual: React.FC = () => {
    const [status, setStatus] = useState(0); // 0: verifying, 1: authentic
    useEffect(() => {
      const t1 = setTimeout(() => setStatus(1), 4000);
      return () => clearTimeout(t1);
    }, []);
  
    return (
      <div className="p-4 rounded-md bg-[var(--code-bg)] border border-[var(--border-light)] font-sans h-[120px] flex justify-center items-center">
        {status === 0 && (
            <div className="flex items-center gap-3 text-amber-500 animate-pulse">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/></svg>
                <span className="font-bold">Verifying signature...</span>
            </div>
        )}
        {status === 1 && (
             <div className="flex items-center gap-3 text-green-500 animate-fade-in-fast">
                <CheckmarkCircle />
                <span className="font-bold text-lg">MEDIA AUTHENTIC</span>
            </div>
        )}
      </div>
    );
  };

  export const DiffEngineAnalysisVisual: React.FC = () => {
    const [phase, setPhase] = useState<'input' | 'analyzing' | 'report'>('input');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('analyzing'), 2000);
        const t2 = setTimeout(() => setPhase('report'), 12000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    useEffect(() => {
        if (phase === 'analyzing') {
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return p + 2;
                });
            }, 180);
            return () => clearInterval(interval);
        }
    }, [phase]);

    const renderInputPhase = () => (
        <div className="space-y-3 animate-fade-in-fast">
            <div>
                <label className="text-xs font-bold text-gray-400">Source A (Reference)</label>
                <div className="p-2 mt-1 bg-gray-900/50 rounded-md text-xs font-mono border border-gray-700">
                    youtube.com/playlist?list=PL2...A0F
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400">Source B (Candidate)</label>
                <div className="p-2 mt-1 bg-gray-900/50 rounded-md text-xs font-mono border border-gray-700">
                    youtube.com/playlist?list=PL2...B1C
                </div>
            </div>
        </div>
    );

    const renderAnalyzingPhase = () => (
        <div className="animate-fade-in-fast space-y-3">
            <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-500">Comparing Hashes...</span>
                <span className="font-mono text-gray-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
            </div>
            <div className="text-center text-gray-400 text-xs">
                Frame-by-frame delta analysis in progress...
            </div>
        </div>
    );

    const renderReportPhase = () => (
        <div className="animate-fade-in-fast text-xs space-y-3">
             <div className="flex justify-between items-baseline p-2 bg-green-900/50 border border-green-500/30 rounded-md">
                <span className="font-bold text-gray-300">Delta Score:</span>
                <span className="font-mono text-lg font-bold text-green-400">0.0017%</span>
             </div>
             <div className="flex justify-between items-baseline p-2 bg-green-900/50 border border-green-500/30 rounded-md">
                <span className="font-bold text-gray-300">Interpretation:</span>
                <span className="font-mono text-lg font-bold text-green-400">MINIMAL_DIFFERENCE</span>
             </div>
            <div className="font-mono text-gray-400">
                <div className="font-bold text-gray-300 mb-1">Analysis Report:</div>
                <div className="text-gray-500 grid grid-cols-4 gap-x-2 gap-y-1 text-[10px]">
                    <span className="font-bold">Frame</span>
                    <span className="font-bold">Hash A</span>
                    <span className="font-bold">Hash B</span>
                    <span className="font-bold">Delta</span>
                    <span>0001</span><span>a3f4...</span><span>a3f4...</span><span className="text-green-500">0.00</span>
                    <span>0002</span><span>b9c1...</span><span>b9c1...</span><span className="text-green-500">0.00</span>
                    <span className="opacity-50">...</span><span className="opacity-50">...</span><span className="opacity-50">...</span><span className="opacity-50">...</span>
                    <span>1798</span><span>f0a9...</span><span>d8b3...</span><span className="text-red-500">0.89</span>
                    <span className="opacity-50">...</span><span className="opacity-50">...</span><span className="opacity-50">...</span><span className="opacity-50">...</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 rounded-md bg-[var(--code-bg)] font-sans min-h-[140px]">
            {phase === 'input' && renderInputPhase()}
            {phase === 'analyzing' && renderAnalyzingPhase()}
            {phase === 'report' && renderReportPhase()}
        </div>
    );
  };
