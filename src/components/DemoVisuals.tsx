
import React, { useState, useEffect } from 'react';
import { DiffReport } from './DiffReport'; // Import the new, shared report component

export type DemoVisualStatus = 'pending' | 'active' | 'complete';

const CheckmarkCircle: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500 flex-shrink-0">
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

export const TrustKeyRegistryVisual: React.FC<{ status: DemoVisualStatus }> = ({ status }) => {
  const [internalStatus, setInternalStatus] = useState<'initial' | 'querying' | 'found'>('initial');

  useEffect(() => {
    if (status === 'active') {
      const t1 = setTimeout(() => setInternalStatus('querying'), 1000);
      const t2 = setTimeout(() => setInternalStatus('found'), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [status]);

  const displayState = status === 'complete' ? 'found' : internalStatus;

  return (
    <div className="p-4 rounded-md bg-[var(--code-bg)] border border-[var(--border-light)] font-sans">
      <div className="font-mono text-xs mb-2 text-gray-400">TrustKey Registry Lookup</div>
      <TerminalLine text="verify --anchor signetai.io:ssl" hasCursor={displayState === 'initial' && status === 'active'} />
      {displayState === 'querying' && <div className="font-mono text-xs text-amber-500 animate-pulse mt-2">Querying decentralized registry...</div>}
      {displayState === 'found' && (
        <div className="mt-2 p-2 border border-green-500/30 bg-green-900/50 rounded-sm text-xs animate-fade-in-fast">
          <div className="flex items-center gap-2 font-bold text-green-400">
              <CheckmarkCircle /> VERIFIED TRUSTED ANCHOR
          </div>
          <div className="font-mono text-gray-400 mt-2 break-all">
              <strong className="text-gray-300">pubkey:</strong> ed25519:signet_v3.1_sovereign_5b98...e4a8bdf9
          </div>
        </div>
      )}
    </div>
  );
};

export const UniversalMediaSigningVisual: React.FC<{ status: DemoVisualStatus }> = ({ status }) => (
    <div className="p-4 rounded-md bg-[var(--code-bg)] border border-[var(--border-light)] font-sans flex items-center justify-around space-x-2 h-[120px]">
      <div className={`text-center ${status !== 'pending' ? 'animate-fade-in-fast' : 'opacity-0'}`}>
        <div className="text-4xl">📹</div>
        <div className="text-xs font-bold mt-1">OriginalVideo.mp4</div>
      </div>
      <div className={`text-3xl text-gray-500 ${status === 'active' ? 'animate-fade-in-delay-1' : status === 'complete' ? 'opacity-100' : 'opacity-0'}`}>+</div>
      <div className={`text-center ${status === 'active' ? 'animate-fade-in-delay-2' : status === 'complete' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-4xl">🔑</div>
        <div className="text-xs font-bold mt-1 text-[var(--trust-blue)]">Private Key</div>
      </div>
      <div className={`text-3xl text-gray-500 ${status === 'active' ? 'animate-fade-in-delay-3' : status === 'complete' ? 'opacity-100' : 'opacity-0'}`}>=</div>
      <div className={`text-center ${status === 'active' ? 'animate-fade-in-delay-4' : status === 'complete' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-4xl">🛡️</div>
        <div className="text-xs font-bold mt-1 text-green-500">Signed Asset</div>
      </div>
    </div>
  );

export const PublicVerifierVisual: React.FC<{ status: DemoVisualStatus }> = ({ status }) => {
    const [isAuthentic, setIsAuthentic] = useState(false);
  
    useEffect(() => {
      if (status === 'active') {
        const t1 = setTimeout(() => setIsAuthentic(true), 4000);
        return () => clearTimeout(t1);
      }
    }, [status]);

    const showAuthentic = status === 'complete' || isAuthentic;

    return (
      <div className="p-4 rounded-md bg-[var(--code-bg)] border border-[var(--border-light)] font-sans h-[120px] flex justify-center items-center">
        {!showAuthentic && (
            <div className="flex items-center gap-3 text-amber-500 animate-pulse">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/></svg>
                <span className="font-bold">Verifying signature...</span>
            </div>
        )}
        {showAuthentic && (
             <div className="flex items-center gap-3 text-green-500 animate-fade-in-fast">
                <CheckmarkCircle />
                <span className="font-bold text-lg">MEDIA AUTHENTIC</span>
            </div>
        )}
      </div>
    );
  };

const DiffEngineInput: React.FC = () => (
    <div className="space-y-3">
        <div>
            <label className="text-xs font-bold text-gray-400">Source A (Reference)</label>
            <div className="p-2 mt-1 bg-gray-900/50 rounded-md text-xs font-mono border border-gray-700 truncate">
                youtube.com/watch?v=dQw4w9WgXcQ
            </div>
        </div>
        <div>
            <label className="text-xs font-bold text-gray-400">Source B (Candidate)</label>
            <div className="p-2 mt-1 bg-gray-900/50 rounded-md text-xs font-mono border border-gray-700 truncate">
                youtube.com/watch?v=R_gE-0vpsWE
            </div>
        </div>
    </div>
);

const DiffEngineAnalyzing: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-500">Comparing Thumbnails...</span>
            <span className="font-mono text-gray-400">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>
        <div className="text-center text-gray-400 text-xs flex justify-around items-center mt-3">
            <div className="text-center">
              <div className="w-16 h-10 bg-gray-600 rounded-sm mx-auto animate-pulse"></div>
              <span className="text-gray-500 text-[10px]">Anchor 1</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-10 bg-gray-600 rounded-sm mx-auto animate-pulse animation-delay-200"></div>
              <span className="text-gray-500 text-[10px]">Anchor 2</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-10 bg-gray-600 rounded-sm mx-auto animate-pulse animation-delay-400"></div>
              <span className="text-gray-500 text-[10px]">Anchor 3</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-10 bg-gray-600 rounded-sm mx-auto animate-pulse animation-delay-600"></div>
              <span className="text-gray-500 text-[10px]">Anchor 4</span>
            </div>
        </div>
    </div>
);

export const DiffEngineAnalysisVisual: React.FC<{ status: DemoVisualStatus }> = ({ status }) => {
    const [phase, setPhase] = useState<'input' | 'analyzing' | 'report'>('input');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (status === 'active') {
            const t1 = setTimeout(() => setPhase('analyzing'), 2000);
            const t2 = setTimeout(() => setPhase('report'), 12000);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [status]);

    useEffect(() => {
        if (phase === 'analyzing' && status === 'active') {
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
    }, [phase, status]);

    let content;
    const displayPhase = status === 'complete' ? 'report' : phase;

    switch (displayPhase) {
        case 'input':
            content = <DiffEngineInput />;
            break;
        case 'analyzing':
            content = <DiffEngineAnalyzing progress={progress} />;
            break;
        case 'report':
            content = <DiffReport />;
            break;
    }

    return (
        <div className="p-4 rounded-md bg-[var(--code-bg)] font-sans min-h-[160px]">
            <div className="animate-fade-in-fast">
                {content}
            </div>
        </div>
    );
  };
