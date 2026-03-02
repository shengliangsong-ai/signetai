
import React, { useState, useEffect } from 'react';

interface NotebookProps {
  onClose: () => void;
}

const demoSteps = [
  {
    title: "Step 1: TrustKey Registry",
    transcript: "First, we are interacting with the TrustKey Registry. This is a decentralized database of public keys and digital identities. We are verifying that the signatory, 'signetai.io:ssl', is a registered and trusted entity in the Signet Protocol. This foundational step ensures that the keys used for signing are authentic and have not been tampered with."
  },
  {
    title: "Step 2: Universal Media Signing",
    transcript: "Now, we are performing the Universal Media Signing. A unique cryptographic signature is being generated for the media file. This signature is created using the signatory's private key and is inextricably linked to the content itself through a dual-hashing process. This ensures both the authenticity of the signatory and the integrity of the media."
  },
  {
    title: "Step 3: Public Verifier",
    transcript: "Next, we are using the Public Verifier. Anyone can use this tool to check the validity of the signed media. The verifier uses the signatory's public key, retrieved from the TrustKey Registry, to confirm that the signature is valid and that the media has not been altered since it was signed. This provides a transparent and accessible way to verify authenticity."
  },
  {
    title: "Step 4: Diff Engine Analysis",
    transcript: "Finally, we are running the Diff Engine Analysis. This advanced tool performs a deep comparison of the media against its original, unaltered version. It can detect even the most subtle changes, including deepfakes, synthetic alterations, or tampering. The analysis is complete, and no discrepancies were found. The media is authentic."
  }
];

export const Notebook: React.FC<NotebookProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && currentStep < demoSteps.length) {
      const step = demoSteps[currentStep];
      // Announce the step with voice
      window.dispatchEvent(new CustomEvent('signet:speak', { detail: { text: step.transcript } }));

      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 15000); // 15 seconds per step

      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length) {
      setIsRunning(false);
    }
  }, [currentStep, isRunning]);

  const handleRunDemo = () => {
    setCurrentStep(0);
    setIsRunning(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="bg-[var(--bg-standard)] w-full max-w-2xl h-auto max-h-[80vh] rounded-lg shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center">
          <h2 className="text-lg font-bold">Demo Notebook</h2>
          <button onClick={onClose} className="opacity-50 hover:opacity-100">✕</button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {demoSteps.map((step, index) => (
              <div key={index} className={`p-4 rounded-lg transition-all ${currentStep === index && isRunning ? 'bg-[var(--bg-subtle)] border border-[var(--trust-blue)]' : 'bg-[var(--code-bg)] border border-transparent'}`}>
                <h3 className="font-bold text-md">{step.title}</h3>
                <p className="text-sm mt-2">{step.transcript}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-[var(--border-light)]">
          <button 
            onClick={handleRunDemo} 
            disabled={isRunning}
            className="w-full bg-[var(--trust-blue)] text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? `Running Step ${currentStep + 1}...` : "Run Demo"}
          </button>
        </div>
      </div>
    </div>
  );
};
