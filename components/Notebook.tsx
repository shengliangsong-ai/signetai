
import React, { useState, useEffect } from 'react';
import { 
    TrustKeyRegistryVisual, 
    UniversalMediaSigningVisual, 
    PublicVerifierVisual, 
    DiffEngineAnalysisVisual,
    DemoVisualStatus
} from './DemoVisuals';
import { DiffReport } from './DiffReport';

interface NotebookProps {
  onClose: () => void;
}

const demoSteps = [
  {
    title: "Step 1: TrustKey Registry",
    transcript: "First, we are interacting with the TrustKey Registry. This is a decentralized database of public keys and digital identities. We are verifying that the signatory, 'signetai.io:ssl', is a registered and trusted entity in the Signet Protocol. This foundational step ensures that the keys used for signing are authentic and have not been tampered with.",
    visual: TrustKeyRegistryVisual
  },
  {
    title: "Step 2: Universal Media Signing",
    transcript: "Now, we are performing the Universal Media Signing. A unique cryptographic signature is being generated for the media file. This signature is created using the signatory's private key and is inextricably linked to the content itself through a dual-hashing process. This ensures both the authenticity of the signatory and the integrity of the media.",
    visual: UniversalMediaSigningVisual
  },
  {
    title: "Step 3: Public Verifier",
    transcript: "Next, we are using the Public Verifier. Anyone can use this tool to check the validity of the signed media. The verifier uses the signatory's public key, retrieved from the TrustKey Registry, to confirm that the signature is valid and that the media has not been altered since it was signed. This provides a transparent and accessible way to verify authenticity.",
    visual: PublicVerifierVisual
  },
  {
    title: "Step 4: Diff Engine Analysis",
    transcript: "Finally, we are running the Diff Engine Analysis. The engine takes two YouTube video URLs as input and performs a 'Quick Check' by comparing four anchor thumbnails from each video, generating perceptual hashes to measure the difference. This efficient method can quickly spot major changes. The analysis is complete, and a minimal difference was detected, confirming the videos are visually consistent.",
    visual: DiffEngineAnalysisVisual
  }
];

export const Notebook: React.FC<NotebookProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isRunning && currentStep < demoSteps.length) {
      const step = demoSteps[currentStep];
      window.dispatchEvent(new CustomEvent('signet:speak', { detail: { text: step.transcript } }));

      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 15000);

      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length) {
      setIsRunning(false);
    }
  }, [currentStep, isRunning]);

  const progress = isRunning ? ((currentStep) / demoSteps.length) * 100 + (1 / demoSteps.length * 100) : 100;
  const statusText = isRunning ? `Running Step ${currentStep + 1} of ${demoSteps.length}...` : 'Demo Complete';

  const getVisualStatus = (index: number): DemoVisualStatus => {
      if (index < currentStep) return 'complete';
      if (index === currentStep && isRunning) return 'active';
      return 'pending';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="bg-[var(--bg-standard)] w-full max-w-3xl h-auto max-h-[90vh] rounded-xl shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center">
          <h2 className="text-lg font-bold">Live Action Demo</h2>
          <button onClick={onClose} className="opacity-50 hover:opacity-100">✕</button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {demoSteps.map((step, index) => {
              const VisualComponent = step.visual;
              const visualStatus = getVisualStatus(index);
              const isExpanded = visualStatus === 'active' || visualStatus === 'complete';

              return (
                <div key={index} className={`p-5 rounded-lg transition-all duration-500 ${visualStatus === 'active' ? 'bg-[var(--bg-subtle)] border-2 border-[var(--trust-blue)] shadow-xl' : 'bg-[var(--code-bg)] border-2 border-transparent'}`}>
                  <h3 className="font-bold text-md text-[var(--text-header)]">{step.title}</h3>
                  
                  {isExpanded && (
                      <div className="mt-4 mb-2 animate-fade-in-fast rounded-lg overflow-hidden">
                        <VisualComponent status={visualStatus} />
                      </div>
                  )}
                  
                  <p className={`text-sm text-[var(--text-body)] transition-all duration-300 ${visualStatus === 'active' ? 'opacity-100' : 'opacity-60'}`}>{step.transcript}</p>
                </div>
              )
            })}
            
            {!isRunning && currentStep >= demoSteps.length && (
                <div className="mt-8 animate-fade-in-fast">
                    <h3 className="text-xl font-bold text-center mb-4">Final Diff Report</h3>
                    <div className="p-5 rounded-lg bg-[var(--code-bg)] border-2 border-green-500/30 shadow-xl">
                        <DiffReport />
                    </div>
                </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-4">
                <div className="flex-1 bg-[var(--code-bg)] rounded-full h-2.5">
                    <div className="bg-[var(--trust-blue)] h-2.5 rounded-full transition-all duration-200 ease-linear" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-sm font-semibold w-48 text-right text-[var(--text-header)]">
                    {statusText}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};
