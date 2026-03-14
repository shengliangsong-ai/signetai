import React, { useEffect, useState } from 'react';
import { avatars, AvatarConfig } from '../constants/avatars';

interface Avatar3DProps {
  isSpeaking: boolean;
  avatarId: string;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({ isSpeaking, avatarId }) => {
  const [mouthOpen, setMouthOpen] = useState(1);
  const [blink, setBlink] = useState(false);
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(1);
      setHeadTilt({ x: 0, y: 0 });
      return;
    }
    
    // Random mouth/mask movement to simulate speech
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

  const config = avatars.find((a: AvatarConfig) => a.id === avatarId) || avatars[0];
  const isFemale = config.gender === 'female';
  const { skinColor, skinShadow, hairColor, eyeColor, hasGlasses, age } = config;

  const displayHairColor = age >= 56 ? '#94a3b8' : hairColor; // Grey hair for older avatars
  
  const scale = age <= 10 ? 0.85 : age <= 16 ? 0.95 : 1;
  const translateY = age <= 10 ? 8 : age <= 16 ? 4 : 0;

  const skinDark = '#b57b65'; // Prevent dark beard look on female

  const bgClass = isFemale ? "bg-white border-4 border-slate-100" : "bg-gradient-to-b from-slate-800 to-slate-900";

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-full shadow-inner ${bgClass}`}>
      <div 
        className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
        style={{ transform: `translate(${headTilt.x}px, ${headTilt.y}px)` }}
      >
        <svg viewBox="0 0 100 100" className="w-[140%] h-[140%] drop-shadow-2xl" style={{ transform: 'translateY(15%)' }}>
          <defs>
            <radialGradient id="skin" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor={skinColor} />
              <stop offset="80%" stopColor={skinShadow} />
              <stop offset="100%" stopColor={skinDark} />
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

          <g style={{ transform: `scale(${scale}) translateY(${translateY}px)`, transformOrigin: '50px 50px' }}>
            {/* Neck */}
            <path d="M 35 60 L 35 120 L 65 120 L 65 60 Z" fill="url(#skin)" filter="url(#shadow)" />
            
            {/* Head Base */}
            <ellipse cx="50" cy="45" rx="28" ry="36" fill="url(#skin)" filter="url(#shadow)" />

            {/* Hair Back (Long Hair) */}

            {/* Ears */}
            <ellipse cx="22" cy="48" rx="4" ry="7" fill="url(#skin)" filter="url(#shadow)" />
            <ellipse cx="78" cy="48" rx="4" ry="7" fill="url(#skin)" filter="url(#shadow)" />

            {/* Hair Front */}
            <path d="M 22 35 C 22 10, 78 10, 78 35 C 78 20, 50 15, 22 35 Z" fill={displayHairColor} filter="url(#shadow)" />
            <path d="M 22 35 C 30 15, 70 15, 78 35 C 70 25, 30 25, 22 35 Z" fill={displayHairColor} opacity="0.8" />

            {/* Eyes Group */}
            <g className="transition-transform duration-75" style={{ transformOrigin: '50px 42px', transform: blink ? 'scaleY(0.05)' : 'scaleY(1)' }}>
              {/* Left Eye */}
              <ellipse cx="38" cy="42" rx={6} ry={4} fill="url(#eyeWhite)" filter="url(#inner-shadow)" />
              <circle cx="38" cy="42" r={2.5} fill="url(#iris)" />
              <circle cx="37" cy="41" r="0.8" fill="#ffffff" />
              
              {/* Right Eye */}
              <ellipse cx="62" cy="42" rx={6} ry={4} fill="url(#eyeWhite)" filter="url(#inner-shadow)" />
              <circle cx="62" cy="42" r={2.5} fill="url(#iris)" />
              <circle cx="61" cy="41" r="0.8" fill="#ffffff" />
            </g>

            {/* Eyebrows */}
            <path d="M 30 35 Q 38 33 44 36" fill="none" stroke={displayHairColor} strokeWidth={2.5} strokeLinecap="round" />
            <path d="M 70 35 Q 62 33 56 36" fill="none" stroke={displayHairColor} strokeWidth={2.5} strokeLinecap="round" />

            {/* Glasses */}
          {hasGlasses && (
            <g filter="url(#shadow)">
              {/* Left Frame */}
              <rect x="26" y="34" width="24" height="16" rx="6" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              {/* Right Frame */}
              <rect x="50" y="34" width="24" height="16" rx="6" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              {/* Bridge */}
              <path d="M 48 39 Q 50 37 52 39" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              {/* Arms */}
              <path d="M 20 38 L 26 38" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              <path d="M 74 38 L 80 38" fill="none" stroke="#e11d48" strokeWidth="2.5" />
              {/* Glass glare */}
              <path d="M 28 36 L 40 48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
              <path d="M 52 36 L 64 48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
            </g>
          )}

          {/* Nose */}
          <path d="M 50 42 L 47 54 C 47 56, 53 56, 53 54 Z" fill="#c27a62" opacity={0.4} />
          <path d="M 46 56 Q 50 58 54 56" fill="none" stroke="#a35d47" strokeWidth={1} opacity={0.4} strokeLinecap="round" />

          {/* Cheeks */}

          {/* Age-based wrinkles */}
          {age >= 36 && (
            <g stroke="#000000" opacity={0.1 + (age - 30) * 0.005} fill="none" strokeWidth={0.8}>
              {/* Smile lines */}
              <path d="M 38 55 Q 32 65 35 72" />
              <path d="M 62 55 Q 68 65 65 72" />
            </g>
          )}
          {age >= 46 && (
            <g stroke="#000000" opacity={0.15 + (age - 40) * 0.005} fill="none" strokeWidth={0.8}>
              {/* Crow's feet */}
              <path d="M 22 40 Q 18 42 15 40" />
              <path d="M 22 43 Q 18 44 15 45" />
              <path d="M 78 40 Q 82 42 85 40" />
              <path d="M 78 43 Q 82 44 85 45" />
            </g>
          )}
          {age >= 56 && (
            <g stroke="#000000" opacity={0.2} fill="none" strokeWidth={0.8}>
              {/* Forehead wrinkles */}
              <path d="M 35 22 Q 50 24 65 22" />
              <path d="M 38 18 Q 50 20 62 18" />
            </g>
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
              d={`M 41 64 Q 50 ${64 - mouthOpen - 2} 59 64`} 
              fill="none" 
              stroke={"#b56555"} 
              strokeWidth={1.5} 
              strokeLinecap="round" 
              className="transition-all duration-75"
            />
            <path 
              d={`M 41 64 Q 50 ${64 + mouthOpen + 2} 59 64`} 
              fill="none" 
              stroke={"#9c4a3c"} 
              strokeWidth={2} 
              strokeLinecap="round" 
              className="transition-all duration-75"
            />
          </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
