import React, { useEffect, useState } from 'react';

interface Avatar3DProps {
  isSpeaking: boolean;
  voiceName: string;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({ isSpeaking, voiceName }) => {
  const [mouthOpen, setMouthOpen] = useState(1);
  const [blink, setBlink] = useState(false);
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });

  const isFemale = ['Zephyr', 'Kore'].includes(voiceName);

  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(1);
      setHeadTilt({ x: 0, y: 0 });
      return;
    }
    
    // Random mouth movement to simulate speech
    const interval = setInterval(() => {
      setMouthOpen(Math.random() * 8 + 2); // 2 to 10
      
      // Slight head bobbing when speaking
      if (Math.random() > 0.7) {
        setHeadTilt({
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 5
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isSpeaking]);

  useEffect(() => {
    // Random blinking
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 4000 + 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  const skinColor = isFemale ? '#ffe0d2' : '#f5cbb7';
  const skinShadow = isFemale ? '#e8b4a1' : '#dca08a';
  const hairColor = isFemale ? '#2b2d42' : '#1a1a1a';
  const eyeColor = isFemale ? '#0284c7' : '#166534'; // Blue vs Green eyes

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-slate-800 to-slate-900 shadow-inner">
      <div 
        className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
        style={{ transform: `translate(${headTilt.x}px, ${headTilt.y}px)` }}
      >
        <svg viewBox="0 0 100 100" className="w-[140%] h-[140%] drop-shadow-2xl" style={{ transform: 'translateY(15%)' }}>
          <defs>
            <radialGradient id="skin" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor={skinColor} />
              <stop offset="80%" stopColor={skinShadow} />
              <stop offset="100%" stopColor="#b57b65" />
            </radialGradient>
            <radialGradient id="eyeWhite" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
            <radialGradient id="iris" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor={eyeColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id="mouth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.4" />
            </filter>
            <filter id="inner-shadow">
              <feOffset dx="0" dy="2"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="black" floodOpacity="0.3" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>

          {/* Neck */}
          <path d="M 35 60 L 35 100 L 65 100 L 65 60 Z" fill="url(#skin)" filter="url(#shadow)" />
          
          {/* Head Base */}
          <ellipse cx="50" cy="45" rx="28" ry="36" fill="url(#skin)" filter="url(#shadow)" />

          {/* Hair Back */}
          {isFemale && (
            <path d="M 20 40 C 10 70, 25 100, 50 100 C 75 100, 90 70, 80 40 Z" fill={hairColor} filter="url(#shadow)" />
          )}

          {/* Ears */}
          <ellipse cx="22" cy="48" rx="4" ry="7" fill="url(#skin)" filter="url(#shadow)" />
          <ellipse cx="78" cy="48" rx="4" ry="7" fill="url(#skin)" filter="url(#shadow)" />

          {/* Hair Front */}
          {isFemale ? (
            <path d="M 22 45 C 22 20, 78 20, 78 45 C 78 25, 50 10, 22 45 Z" fill={hairColor} filter="url(#shadow)" />
          ) : (
            <path d="M 22 35 C 22 10, 78 10, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} filter="url(#shadow)" />
          )}
          {/* Extra hair volume */}
          <path d="M 22 35 C 30 15, 70 15, 78 35 C 70 25, 30 25, 22 35 Z" fill={hairColor} opacity="0.8" />

          {/* Eyes Group */}
          <g className="transition-transform duration-75" style={{ transformOrigin: '50px 42px', transform: blink ? 'scaleY(0.05)' : 'scaleY(1)' }}>
            {/* Left Eye */}
            <ellipse cx="38" cy="42" rx="6" ry="4" fill="url(#eyeWhite)" filter="url(#inner-shadow)" />
            <circle cx="38" cy="42" r="2.5" fill="url(#iris)" />
            <circle cx="37" cy="41" r="0.8" fill="#ffffff" />
            
            {/* Right Eye */}
            <ellipse cx="62" cy="42" rx="6" ry="4" fill="url(#eyeWhite)" filter="url(#inner-shadow)" />
            <circle cx="62" cy="42" r="2.5" fill="url(#iris)" />
            <circle cx="61" cy="41" r="0.8" fill="#ffffff" />
          </g>

          {/* Eyebrows */}
          <path d="M 30 35 Q 38 33 44 36" fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 70 35 Q 62 33 56 36" fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />

          {/* Nose */}
          <path d="M 50 42 L 47 54 C 47 56, 53 56, 53 54 Z" fill="#c27a62" opacity="0.4" />
          <path d="M 46 56 Q 50 58 54 56" fill="none" stroke="#a35d47" strokeWidth="1" opacity="0.4" strokeLinecap="round" />

          {/* Cheeks */}
          {isFemale && (
            <>
              <ellipse cx="32" cy="52" rx="5" ry="3" fill="#ff8fa3" opacity="0.3" filter="blur(2px)" />
              <ellipse cx="68" cy="52" rx="5" ry="3" fill="#ff8fa3" opacity="0.3" filter="blur(2px)" />
            </>
          )}

          {/* Mouth */}
          <g style={{ transformOrigin: '50px 64px' }}>
            <ellipse 
              cx="50" 
              cy="64" 
              rx="8" 
              ry={mouthOpen} 
              fill="url(#mouth)" 
              className="transition-all duration-75"
              filter="url(#inner-shadow)"
            />
            {/* Teeth */}
            {mouthOpen > 3 && (
              <path 
                d={`M 44 ${64 - mouthOpen + 1} Q 50 ${64 - mouthOpen + 3} 56 ${64 - mouthOpen + 1} L 55 ${64 - mouthOpen + 3} Q 50 ${64 - mouthOpen + 4} 45 ${64 - mouthOpen + 3} Z`} 
                fill="#ffffff" 
              />
            )}
            {/* Lips */}
            <path 
              d={`M 42 64 Q 50 ${64 - mouthOpen - 2} 58 64`} 
              fill="none" 
              stroke={isFemale ? "#e5383b" : "#b56555"} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              className="transition-all duration-75"
            />
            <path 
              d={`M 42 64 Q 50 ${64 + mouthOpen + 2} 58 64`} 
              fill="none" 
              stroke={isFemale ? "#ba1826" : "#9c4a3c"} 
              strokeWidth="2" 
              strokeLinecap="round" 
              className="transition-all duration-75"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
