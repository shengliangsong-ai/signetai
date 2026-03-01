import React, { useState, useEffect } from 'react';
import { DEMO_SCRIPT as steps } from './demo-script';

interface DemoModeProps {
  onComplete: () => void;
}

export const DemoMode: React.FC<DemoModeProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsRunning(true);
      setActiveStep(1);
    };
    window.addEventListener('signet:start-demo', handleStart);
    
    // Automatically start the demo when the component mounts
    handleStart();

    return () => window.removeEventListener('signet:start-demo', handleStart);
  }, []);

  useEffect(() => {
    if (isRunning && activeStep > 0 && activeStep <= steps.length) {
      const currentStep = steps[activeStep - 1];
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, currentStep.duration); 
      return () => clearTimeout(timer);
    } else if (activeStep > steps.length) {
      setIsRunning(false);
      onComplete();
    }
  }, [isRunning, activeStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-[200] flex items-center justify-center p-8 font-mono animate-in fade-in duration-500">
        <div className="w-full max-w-4xl mx-auto p-8 h-full overflow-y-auto">

          <div className="mb-12 border-b border-[var(--border-light)] pb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">Live Digital Notary: Execution Notebook</h1>
            <p className="text-white opacity-70">
              Automated demonstration of the SignetAI protocol pipeline, triggered by the Live Agent.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const isPast = activeStep > step.id;

              return (
                <div 
                  key={step.id} 
                  className={`p-6 border rounded-xl transition-all duration-700 relative overflow-hidden
                    ${isActive ? 'border-[var(--trust-blue)] shadow-[0_0_30px_rgba(0,85,255,0.25)] bg-blue-50/10 scale-[1.02]' : 
                      isPast ? 'border-green-500/30 bg-green-50/5' : 
                      'border-gray-700 opacity-40'}`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--trust-blue)] animate-pulse"></div>
                  )}
                  {isPast && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold text-lg ${isActive ? 'text-[var(--trust-blue)]' : isPast ? 'text-green-500' : 'text-gray-300'}`}>
                      {step.title}
                    </h3>
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
                    </div>
                  </div>

                  <div className="bg-[#0D1117] text-[#56D364] p-4 rounded-lg text-sm mb-4 overflow-x-auto border border-gray-800 shadow-inner">
                    <pre className="whitespace-pre-wrap"><code>{step.code}</code></pre>
                  </div>
                  
                  <p className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {step.desc}
                  </p>

                  {isActive && (
                    <div className="mt-6 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--trust-blue)]"
                        style={{
                          width: '100%',
                          animation: `progress ${steps[activeStep - 1].duration / 1000}s linear forwards`
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes progress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
    </div>
  );
};
