import React, { useState, useEffect } from 'react';
import { ImageComparator } from './ImageComparator';
import { VerifyView } from './VerifyView';
import { TrustKeyService } from './TrustKeyService';
import { UniversalSigner } from './UniversalSigner';
import { BatchVerifier } from './BatchVerifier';
import { ResumeProfile } from './ResumeProfile';
import { HackathonView } from './HackathonView';

export const DemoNotebook: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const steps = [
    { 
      id: 1, 
      title: "Stage 01: Sovereign Identity & Verification", 
      subtitle: "Establishing Cryptographic Root of Trust",
      desc: "This entire website and its underlying architecture were built with the help of Google AI Studio. We begin by generating a Sovereign Grade cryptographic keypair. To demonstrate its real-world application, we've integrated a live verification of the architect's resume. Using the generated public key, anyone can verify the authenticity of the signed resume payload.",
      speakerGuide: "Start by explaining that this site was built using Google AI Studio. Then explain that Signet doesn't rely on centralized authorities. We generate a 264-bit entropy key that identifies the creator. Show the Architect Profile verification demo to explain how data is signed with a private key and instantly verified in the browser."
    },
    { 
      id: 2, 
      title: "Stage 02: Universal Media Signing (C2PA+)", 
      subtitle: "Atomic Provenance Injection",
      desc: "Next, we inject a C2PA-compliant manifest directly into the asset's JUMBF boxes. This isn't just metadata; it's a cryptographically bound history of the asset's creation.",
      speakerGuide: "Show the manifest structure. Point out the 'org.signetai.vpr' assertion—this is where our proprietary Visual Provenance Record is stored, binding the pixels to the signature."
    },
    { 
      id: 3, 
      title: "Stage 03: Public Ledger Verification", 
      subtitle: "Decentralized Chain of Custody",
      desc: "We verify the signature against our distributed ledger. This ensures the asset hasn't been backdated or re-signed by an unauthorized party.",
      speakerGuide: "This is the 'Proof of Existence'. Even if the manifest is removed, the ledger maintains a permanent record of the original hash and signing time."
    },
    { 
      id: 4, 
      title: "Stage 04: Image Forensic Diff Analysis", 
      subtitle: "Trident Engine Perceptual Audit",
      desc: "We run the Trident Engine for static media. It performs a multi-layered perceptual audit, comparing the candidate asset against the original keyframes stored in the manifest. We run deterministic pixel-perfect diffs for images to detect deepfakes or synthetic alterations.",
      speakerGuide: "This is the core for static images. We show the SSIM map and the score composition. A score of 12 indicates minimal difference—meaning the asset is authentic despite platform compression."
    },
    { 
      id: 5, 
      title: "Stage 05: Video Authenticity Verification", 
      subtitle: "Frame-by-Frame Temporal Analysis",
      desc: "For dynamic media, the Trident Engine performs frame-by-frame analysis. It extracts keyframes from the video and compares them against the cryptographically signed provenance record to ensure temporal and visual authenticity.",
      speakerGuide: "Highlight the Video Diff Engine. Explain how temporal analysis is crucial for detecting deepfakes in video streams."
    },
    { 
      id: 6, 
      title: "Stage 06: Hackathon Submission", 
      subtitle: "Project Requirements & Checklist",
      desc: "To conclude our technical demonstration, we present our complete Hackathon Submission. This outlines how SignetAI fulfills all the core requirements, including the use of Gemini 2.5 Flash, Firebase, and our innovative approach to digital provenance.",
      speakerGuide: "Present the Hackathon Submission page. Walk the judges through the checklist to demonstrate that all criteria have been met and exceeded."
    },
    { 
      id: 7, 
      title: "Stage 07: Conclusion & Future Outlook", 
      subtitle: "The New Standard for Digital Trust",
      desc: "Signet Protocol isn't just a tool; it's a new standard for digital integrity. By combining sovereign identity with deep forensic analysis, we ensure that truth remains verifiable in an era of synthetic media.",
      speakerGuide: "Wrap up by thanking the judges. Emphasize that Signet is ready for integration today, bringing transparency back to the digital world."
    }
  ];

  useEffect(() => {
    const handleStart = () => {
      setIsRunning(true);
      setActiveStep(1);
    };
    window.addEventListener('signet:start-demo', handleStart);
    return () => window.removeEventListener('signet:start-demo', handleStart);
  }, []);

  useEffect(() => {
    const handleSetStep = (e: Event) => {
      const customEvent = e as CustomEvent;
      const step = customEvent.detail?.step;
      if (step) {
        setActiveStep(step);
        setTimeout(() => {
          const el = document.getElementById(`demo-step-${step}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    };
    window.addEventListener('signet:set-step', handleSetStep);
    return () => window.removeEventListener('signet:set-step', handleSetStep);
  }, []);

  useEffect(() => {
    if (activeStep > steps.length) {
      setIsRunning(false);
    }
  }, [activeStep, steps.length]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpokenForCurrentStep, setHasSpokenForCurrentStep] = useState(false);

  useEffect(() => {
    const handleSpeakingStatus = (e: Event) => {
      const { isSpeaking: speaking } = (e as CustomEvent).detail;
      setIsSpeaking(speaking);
      if (speaking) {
        setHasSpokenForCurrentStep(true);
      }
    };
    window.addEventListener('signet:speaking-status', handleSpeakingStatus);
    return () => window.removeEventListener('signet:speaking-status', handleSpeakingStatus);
  }, []);

  // When step changes, reset the spoken flag and ask assistant to narrate
  useEffect(() => {
    if (isRunning && activeStep > 0 && activeStep <= steps.length) {
      setHasSpokenForCurrentStep(false);
      if (activeStep > 1) { // Step 1 is narrated by the initial prompt
        window.dispatchEvent(new CustomEvent('signet:narrate-step', { detail: { step: activeStep } }));
      }
    }
  }, [isRunning, activeStep, steps.length]);

  // Auto-advance logic based on audio lock
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && activeStep > 0 && activeStep <= steps.length) {
      if (hasSpokenForCurrentStep && !isSpeaking) {
        // Assistant finished speaking. Advance after a short pause.
        timer = setTimeout(() => {
          const nextStep = activeStep + 1;
          setActiveStep(nextStep);
          if (nextStep <= steps.length) {
            setTimeout(() => {
              const el = document.getElementById(`demo-step-${nextStep}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        }, 5000); // Increased from 2000 to 5000 to allow for longer pauses during detailed explanations
      } else if (!hasSpokenForCurrentStep) {
        // Fallback in case assistant never speaks
        timer = setTimeout(() => {
          const nextStep = activeStep + 1;
          setActiveStep(nextStep);
          if (nextStep <= steps.length) {
            setTimeout(() => {
              const el = document.getElementById(`demo-step-${nextStep}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        }, activeStep === 1 ? 60000 : 30000); // Increased fallback for other steps to 30s
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, activeStep, steps.length, isSpeaking, hasSpokenForCurrentStep]);

  return (
    <div className="max-w-4xl mx-auto p-8 font-mono animate-in fade-in duration-500">
      <div className="mb-12 border-b border-[var(--border-light)] pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--text-header)]">The Forensic Notebook.</h1>
          <p className="text-[var(--text-body)] opacity-70">
            A 4-minute automated walkthrough of the SignetAI trust pipeline. Designed for forensic audit and hackathon presentation.
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          {!isRunning && activeStep === 0 && (
            <button 
              onClick={() => { 
                setIsRunning(true); 
                setActiveStep(1); 
                window.dispatchEvent(new CustomEvent('signet:start-demo', { detail: { fromManual: true } })); 
              }} 
              className="px-6 py-3 bg-[var(--trust-blue)] text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-500/30 flex items-center gap-2 whitespace-nowrap"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
              Start Live Demo
            </button>
          )}
          <button 
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className="text-xs text-[var(--text-body)] opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4"
          >
            {showSpeakerNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
          </button>
        </div>
      </div>

      {isRunning && activeStep <= steps.length && (
        <div className="mb-8 p-4 bg-blue-500/10 border border-[var(--trust-blue)] rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <p className="text-sm text-[var(--trust-blue)] font-bold uppercase tracking-widest">
              Live Agent Narration Active
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-standard)] px-3 py-1.5 rounded border border-[var(--trust-blue)] shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={timeElapsed > 240 ? 'text-red-500' : 'text-[var(--trust-blue)]'}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className={`font-mono font-bold text-sm ${timeElapsed > 240 ? 'text-red-500' : 'text-[var(--trust-blue)]'}`}>
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          const isPast = activeStep > step.id;
          const isFuture = activeStep < step.id && activeStep !== 0;
          const isWaiting = activeStep === 0;

          return (
            <div 
              key={step.id} 
              id={`demo-step-${step.id}`}
              onClick={() => {
                if (!isActive && isRunning) {
                  setActiveStep(step.id);
                  setTimeout(() => {
                    const el = document.getElementById(`demo-step-${step.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }
              }}
              className={`p-6 border rounded-xl transition-all duration-700 relative overflow-hidden ${isRunning && !isActive ? 'cursor-pointer hover:opacity-80' : ''}
                ${isActive ? 'border-[var(--trust-blue)] shadow-[0_0_30px_rgba(0,85,255,0.15)] bg-blue-50/5 scale-[1.02]' : 
                  isPast ? 'border-green-500/30 bg-green-50/5' : 
                  'border-[var(--border-light)] opacity-40'}`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--trust-blue)] animate-pulse"></div>
              )}
              {isPast && (
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-mono opacity-50 mb-1">
                    {String(step.id).padStart(2, '0')}
                  </div>
                  <h3 className={`font-bold text-lg ${isActive ? 'text-[var(--trust-blue)]' : isPast ? 'text-green-500' : 'text-[var(--text-body)]'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium opacity-80 mt-1">{step.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--trust-blue)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--trust-blue)]"></span>
                      </span>
                      <span className="text-xs uppercase tracking-widest text-[var(--trust-blue)] font-bold">Executing</span>
                    </>
                  )}
                  {isPast && <span className="text-xs uppercase tracking-widest text-green-500 font-bold">Completed [✓]</span>}
                  {(isFuture || isWaiting) && <span className="text-xs uppercase tracking-widest text-[var(--text-body)] opacity-50 font-bold">Queued</span>}
                </div>
              </div>

              <p className={`text-sm mb-6 ${isActive ? 'text-[var(--text-header)]' : 'text-[var(--text-body)] opacity-70'}`}>
                {step.desc}
              </p>

              {showSpeakerNotes && (isActive || isPast) && (
                <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] p-4 rounded-lg mb-6 flex gap-4 items-start">
                  <div className="text-xl">🎙️</div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Speaker Guide</div>
                    <p className="text-sm italic opacity-80">{step.speakerGuide}</p>
                  </div>
                </div>
              )}

              {(isActive || isPast) && step.id === 1 && (
                <div className="mt-6 flex flex-col gap-6">
                  <div className="border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4 max-h-[800px] overflow-y-auto">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Identity Generation</h4>
                    <TrustKeyService />
                  </div>
                  <div className="border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4 max-h-[800px] overflow-y-auto">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Resume Verification Demo</h4>
                    <ResumeProfile />
                  </div>
                </div>
              )}

              {(isActive || isPast) && step.id === 2 && (
                <div className="mt-6 border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4 max-h-[800px] overflow-y-auto">
                  <UniversalSigner />
                </div>
              )}

              {(isActive || isPast) && step.id === 3 && (
                <div className="mt-6 border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4 max-h-[800px] overflow-y-auto">
                  <BatchVerifier />
                </div>
              )}

              {(isActive || isPast) && step.id === 4 && (
                <div className="mt-6 border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Image Comparator</h4>
                  <ImageComparator 
                    defaultImageA="/signet_Gemini_Generated_Image_ABCD.png" 
                    defaultImageB="/signet_Gemini_Generated_Image_XYZZ.png" 
                    autoRun={true} 
                  />
                </div>
              )}

              {(isActive || isPast) && step.id === 5 && (
                <div className="mt-6 border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4 max-h-[800px] overflow-y-auto">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Video Diff Engine</h4>
                  <VerifyView autoRun={true} />
                </div>
              )}

              {(isActive || isPast) && step.id === 6 && (
                <div className="mt-6 border border-[var(--border-light)] rounded-xl overflow-hidden bg-black/20 p-4 max-h-[800px] overflow-y-auto">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Hackathon Submission</h4>
                  <HackathonView />
                </div>
              )}

              {isActive && !isRunning && (
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => {
                      const nextStep = step.id + 1;
                      setActiveStep(nextStep);
                      if (nextStep <= steps.length) {
                        setTimeout(() => {
                          const el = document.getElementById(`demo-step-${nextStep}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }
                    }}
                    className="px-4 py-2 bg-[var(--trust-blue)] text-white rounded font-bold text-sm hover:bg-blue-600 transition-colors"
                  >
                    {step.id === steps.length ? 'Finish Demo' : 'Skip ➔'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>


      {!isRunning && activeStep > steps.length && (
        <div className="mt-12 p-6 border border-green-500/30 bg-green-500/10 rounded-xl text-center">
          <h3 className="text-xl font-bold text-green-500 mb-2">Execution Complete</h3>
          <p className="text-[var(--text-body)] opacity-80 mb-6">All protocol steps have been successfully verified.</p>
          <button 
            onClick={() => { setIsRunning(false); setActiveStep(0); }} 
            className="px-6 py-2 border border-[var(--border-light)] rounded hover:bg-[var(--bg-sidebar)] transition-colors text-sm"
          >
            Reset Notebook
          </button>
        </div>
      )}
    </div>
  );
};
