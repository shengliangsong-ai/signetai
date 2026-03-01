import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { DEMO_SCRIPT } from './demo-script';

interface DemoModeProps {
  onComplete: () => void;
}

export const DemoMode: React.FC<DemoModeProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleCells, setVisibleCells] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const playNarration = (narration: string) => {
    // In a real implementation, this would use a TTS service.
    // For this demo, we'll simulate it with a silent audio track and timing.
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (currentStep < DEMO_SCRIPT.length) {
      const step = DEMO_SCRIPT[currentStep];

      // Add the current cell to the visible cells
      setVisibleCells(prev => [...prev, currentStep]);

      // Play the narration for the current step
      playNarration(step.narration);

      // Set a timeout to advance to the next step
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, step.duration);

      return () => clearTimeout(timer);
    } else {
      // Demo is complete
      onComplete();
    }
  }, [currentStep, onComplete]);

  useEffect(() => {
    // Scroll to the bottom of the container as new cells are added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCells]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-[200] p-8">
      <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-2xl overflow-y-auto font-mono text-sm p-8">
        <h1 className="text-2xl font-bold mb-8">Signet-Alpha: Genesis Demo</h1>
        <div className="space-y-4">
          {visibleCells.map(index => {
            const step = DEMO_SCRIPT[index];
            return (
              <div key={index} className="bg-gray-100 p-4 rounded-md animate-in fade-in">
                <p className="text-gray-500 mb-2 italic">Narrating: "{step.narration}"</p>
                <div className="bg-white p-4 rounded shadow-inner">
                  {step.type === 'header' && <h2 className="text-xl font-bold">{step.content}</h2>}
                  {step.type === 'text' && <ReactMarkdown>{step.content}</ReactMarkdown>}
                  {step.type === 'code' && <pre className="bg-gray-800 text-white p-4 rounded"><code>{step.content}</code></pre>}
                </div>
              </div>
            );
          })}
        </div>
        <audio ref={audioRef} src="/silent.mp3" />
      </div>
    </div>
  );
};
