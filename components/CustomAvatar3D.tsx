import React, { useEffect, useState } from 'react';

export interface CustomAvatarProps {
  hairStyle: 'short' | 'long' | 'bald' | 'curly' | 'buzzcut' | 'dreadlocks' | 'mohawk' | 'spiky' | 'wavy' | 'bun' | 'ponytail' | 'fade' | 'afro';
  hairColor: string;
  skinColor: string;
  eyeColor: string;
  eyeStyle: 'normal' | 'glasses' | 'sunglasses';
  noseStyle: 'small' | 'wide' | 'pointed' | 'button' | 'aquiline' | 'snub' | 'roman' | 'flat' | 'broad' | 'thin';
  mouthStyle: 'smile' | 'neutral' | 'sad' | 'smirk' | 'open' | 'surprised' | 'pout' | 'laugh' | 'thin' | 'wide';
  clothesStyle: 'tshirt' | 'suit' | 'hoodie' | 'sweater' | 'jacket' | 'tanktop' | 'dress' | 'shirt' | 'turtleneck' | 'vneck';
  clothesColor: string;
  bgTheme: 'light' | 'dark' | 'gradient' | 'neon';
  isSpeaking?: boolean;

  // New Facial Hair
  facialHairStyle?: 'none' | 'stubble' | 'mustache' | 'beard' | 'goatee';
  facialHairColor?: string;

  // Face Adjustments
  faceWidth?: number;

  // Eyes Adjustments
  eyeSize?: number;
  eyeAngle?: number;
  eyeDistance?: number;
  eyelidHeight?: number;
  upperLashes?: 'none' | 'short' | 'long' | 'thick';
  lowerLashes?: 'none' | 'short' | 'long';

  // Nose Adjustments
  noseWidth?: number;
  noseHeight?: number;
  noseAngle?: number;
  noseTipSize?: number;

  // Mouth Adjustments
  mouthFullness?: number;
  mouthWidth?: number;
  mouthHeight?: number;
}

export const CustomAvatar3D: React.FC<CustomAvatarProps> = ({
  hairStyle = 'short',
  hairColor = '#1a1a1a',
  skinColor = '#f5cbb7',
  eyeColor = '#166534',
  eyeStyle = 'normal',
  noseStyle = 'small',
  mouthStyle = 'smile',
  clothesStyle = 'tshirt',
  clothesColor = '#0055FF',
  bgTheme = 'light',
  isSpeaking = false,
  facialHairStyle = 'none',
  facialHairColor = '#1a1a1a',
  faceWidth = 50,
  eyeSize = 50,
  eyeAngle = 50,
  eyeDistance = 50,
  eyelidHeight = 50,
  upperLashes = 'long',
  lowerLashes = 'short',
  noseWidth = 50,
  noseHeight = 50,
  noseAngle = 50,
  noseTipSize = 50,
  mouthFullness = 50,
  mouthWidth = 50,
  mouthHeight = 50
}) => {
  const [mouthOpen, setMouthOpen] = useState(1);
  const [blink, setBlink] = useState(false);
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(1);
      setHeadTilt({ x: 0, y: 0 });
      return;
    }
    const interval = setInterval(() => {
      setMouthOpen(Math.random() * 8 + 2);
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
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 4000 + 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Calculate shadow color based on skin color (simple darkening)
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 200, g: 150, b: 120 };
  };
  const rgb = hexToRgb(skinColor);
  const skinShadow = `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`;
  const skinDark = `rgb(${Math.max(0, rgb.r - 80)}, ${Math.max(0, rgb.g - 80)}, ${Math.max(0, rgb.b - 80)})`;

  const bgClasses = {
    light: "bg-white border-4 border-slate-100",
    dark: "bg-slate-900 border-4 border-slate-800",
    gradient: "bg-gradient-to-br from-blue-400 to-purple-500",
    neon: "bg-black border-4 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
  };

  // Calculations for new properties
  const faceScaleX = 0.8 + (faceWidth / 100) * 0.4;
  
  const eyeScale = 0.5 + (eyeSize / 100) * 1.0;
  const eyeRot = (eyeAngle - 50) * 0.5;
  const eyeDistOffset = (eyeDistance - 50) * 0.2;
  const eyelidY = 38 + (eyelidHeight / 100) * 8;

  const noseScaleX = 0.5 + (noseWidth / 100) * 1.0;
  const noseScaleY = 0.5 + (noseHeight / 100) * 1.0;
  const noseRot = (noseAngle - 50) * 0.5;
  const noseTipScale = 0.5 + (noseTipSize / 100) * 1.0;

  const mouthScaleX = 0.5 + (mouthWidth / 100) * 1.0;
  const mouthScaleY = 0.5 + (mouthHeight / 100) * 1.0;
  const mouthStrokeWidth = 1 + (mouthFullness / 100) * 2;

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-full shadow-inner ${bgClasses[bgTheme]}`}>
      <div 
        className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
        style={{ transform: `translate(${headTilt.x}px, ${headTilt.y}px)` }}
      >
        <svg viewBox="0 0 100 130" className="w-[100%] h-[100%] drop-shadow-2xl" style={{ transform: 'translateY(5%)' }}>
          <defs>
            <radialGradient id="customSkin" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor={skinColor} />
              <stop offset="80%" stopColor={skinShadow} />
              <stop offset="100%" stopColor={skinDark} />
            </radialGradient>
            <radialGradient id="customEyeWhite" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
            <radialGradient id="customIris" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor={eyeColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id="customMouth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <filter id="customShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.4" />
            </filter>
            <filter id="customInnerShadow">
              <feOffset dx="0" dy="2"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="black" floodOpacity="0.3" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>

          <g style={{ transformOrigin: '50px 50px' }}>
            {/* Hair Back (Long Hair) */}
            {hairStyle === 'long' && (
              <path d="M 15 40 Q 5 55 18 70 Q 5 85 20 100 Q 10 115 30 120 Q 50 115 70 120 Q 90 115 80 100 Q 95 85 82 70 Q 95 55 85 40 Z" fill={hairColor} filter="url(#customShadow)" />
            )}
            {hairStyle === 'wavy' && (
              <path d="M 12 40 Q 0 60 20 80 Q 5 100 25 120 Q 50 110 75 120 Q 95 100 80 80 Q 100 60 88 40 Z" fill={hairColor} filter="url(#customShadow)" />
            )}
            {hairStyle === 'dreadlocks' && (
              <g filter="url(#customShadow)">
                <path d="M 15 40 L 15 110 L 22 110 L 22 40 Z" fill={hairColor} />
                <path d="M 25 40 L 25 115 L 32 115 L 32 40 Z" fill={hairColor} />
                <path d="M 68 40 L 68 115 L 75 115 L 75 40 Z" fill={hairColor} />
                <path d="M 78 40 L 78 110 L 85 110 L 85 40 Z" fill={hairColor} />
              </g>
            )}

            {/* Neck */}
            <path d="M 35 60 L 35 125 L 65 125 L 65 60 Z" fill="url(#customSkin)" filter="url(#customShadow)" />
            
            {/* Clothes */}
            {clothesStyle === 'tshirt' && (
              <path d="M 20 90 Q 50 100 80 90 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
            )}
            {clothesStyle === 'hoodie' && (
              <g>
                <path d="M 15 85 Q 50 110 85 85 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
                <path d="M 25 85 Q 50 105 75 85 L 70 125 L 30 125 Z" fill="#000" opacity="0.2" />
              </g>
            )}
            {clothesStyle === 'suit' && (
              <g>
                <path d="M 15 90 L 50 125 L 85 90 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
                <path d="M 35 90 L 50 110 L 65 90 Z" fill="#ffffff" />
                <path d="M 45 95 L 50 105 L 55 95 Z" fill="#1e293b" />
                <path d="M 48 105 L 52 105 L 53 125 L 50 128 L 47 125 Z" fill="#e11d48" />
              </g>
            )}
            {clothesStyle === 'sweater' && (
              <g>
                <path d="M 18 88 Q 50 98 82 88 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
                <path d="M 25 88 Q 50 98 75 88 L 72 95 Q 50 105 28 95 Z" fill="#000" opacity="0.1" />
              </g>
            )}
            {clothesStyle === 'jacket' && (
              <g>
                <path d="M 30 90 Q 50 100 70 90 L 70 125 L 30 125 Z" fill="#ffffff" />
                <path d="M 15 88 L 35 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
                <path d="M 85 88 L 65 125 L 95 125 Z" fill={clothesColor} filter="url(#customShadow)" />
              </g>
            )}
            {clothesStyle === 'tanktop' && (
              <g>
                <path d="M 20 90 Q 50 80 80 90 L 95 125 L 5 125 Z" fill="url(#customSkin)" filter="url(#customShadow)" />
                <path d="M 30 95 Q 50 115 70 95 L 75 125 L 25 125 Z" fill={clothesColor} filter="url(#customShadow)" />
              </g>
            )}
            {clothesStyle === 'dress' && (
              <path d="M 25 90 Q 50 110 75 90 L 85 125 L 15 125 Z" fill={clothesColor} filter="url(#customShadow)" />
            )}
            {clothesStyle === 'shirt' && (
              <g>
                <path d="M 18 90 Q 50 100 82 90 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
                <path d="M 35 90 L 50 105 L 45 90 Z" fill="#ffffff" opacity="0.8" />
                <path d="M 65 90 L 50 105 L 55 90 Z" fill="#ffffff" opacity="0.8" />
                <circle cx="50" cy="110" r="1.5" fill="#000000" opacity="0.5" />
                <circle cx="50" cy="120" r="1.5" fill="#000000" opacity="0.5" />
              </g>
            )}
            {clothesStyle === 'turtleneck' && (
              <g>
                <path d="M 18 85 Q 50 90 82 85 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
                <path d="M 32 60 L 68 60 L 70 90 Q 50 95 30 90 Z" fill={clothesColor} filter="url(#customShadow)" />
              </g>
            )}
            {clothesStyle === 'vneck' && (
              <path d="M 18 90 L 50 115 L 82 90 L 95 125 L 5 125 Z" fill={clothesColor} filter="url(#customShadow)" />
            )}

            {/* Head Base */}
            <g style={{ transformOrigin: '50px 45px', transform: `scale(${faceScaleX}, 1)` }}>
              <ellipse cx="50" cy="45" rx="30" ry="34" fill="url(#customSkin)" filter="url(#customShadow)" />
            </g>

            {/* Ears */}
            <ellipse cx="22" cy="48" rx="4" ry="7" fill="url(#customSkin)" filter="url(#customShadow)" />
            <ellipse cx="78" cy="48" rx="4" ry="7" fill="url(#customSkin)" filter="url(#customShadow)" />

            {/* Hair Front */}
            {hairStyle !== 'bald' && (
              <>
                {hairStyle === 'short' && (
                  <path d="M 22 35 C 22 5, 78 5, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} filter="url(#customShadow)" />
                )}
                {hairStyle === 'buzzcut' && (
                  <path d="M 22 35 C 22 10, 78 10, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} opacity="0.8" filter="url(#customShadow)" />
                )}
                {hairStyle === 'fade' && (
                  <g>
                    <path d="M 22 35 C 22 15, 78 15, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} opacity="0.5" />
                    <path d="M 26 25 C 26 5, 74 5, 74 25 C 74 15, 50 10, 26 25 Z" fill={hairColor} filter="url(#customShadow)" />
                  </g>
                )}
                {hairStyle === 'mohawk' && (
                  <g>
                    <path d="M 22 35 C 22 15, 78 15, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} opacity="0.3" />
                    <path d="M 42 35 Q 50 -15 58 35 Z" fill={hairColor} filter="url(#customShadow)" />
                  </g>
                )}
                {hairStyle === 'spiky' && (
                  <path d="M 22 35 L 26 15 L 34 28 L 42 10 L 50 25 L 58 10 L 66 28 L 74 15 L 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} filter="url(#customShadow)" />
                )}
                {hairStyle === 'afro' && (
                  <g filter="url(#customShadow)">
                    <circle cx="50" cy="20" r="25" fill={hairColor} />
                    <circle cx="25" cy="35" r="18" fill={hairColor} />
                    <circle cx="75" cy="35" r="18" fill={hairColor} />
                  </g>
                )}
                {hairStyle === 'bun' && (
                  <g>
                    <path d="M 22 35 C 22 5, 78 5, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} filter="url(#customShadow)" />
                    <circle cx="50" cy="5" r="12" fill={hairColor} filter="url(#customShadow)" />
                  </g>
                )}
                {hairStyle === 'ponytail' && (
                  <g>
                    <path d="M 22 35 C 22 5, 78 5, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} filter="url(#customShadow)" />
                    <path d="M 75 35 Q 95 45 85 70 Q 75 50 70 40 Z" fill={hairColor} filter="url(#customShadow)" />
                  </g>
                )}
                {hairStyle === 'long' && (
                  <g>
                    <path d="M 18 38 C 18 -5, 82 -5, 82 38 C 82 20, 50 10, 18 38 Z" fill={hairColor} filter="url(#customShadow)" />
                    <path d="M 22 35 Q 10 45 18 55 Q 10 65 20 75 Q 24 65 16 55 Q 24 45 25 35 Z" fill={hairColor} filter="url(#customShadow)" />
                    <path d="M 78 35 Q 90 45 82 55 Q 90 65 80 75 Q 76 65 84 55 Q 76 45 75 35 Z" fill={hairColor} filter="url(#customShadow)" />
                  </g>
                )}
                {hairStyle === 'wavy' && (
                  <g>
                    <path d="M 18 38 C 18 -5, 82 -5, 82 38 C 82 20, 50 10, 18 38 Z" fill={hairColor} filter="url(#customShadow)" />
                    <path d="M 15 35 Q 5 50 20 60 Q 30 70 15 80 L 25 80 Q 35 65 25 55 Q 15 45 25 35 Z" fill={hairColor} filter="url(#customShadow)" />
                    <path d="M 85 35 Q 95 50 80 60 Q 70 70 85 80 L 75 80 Q 65 65 75 55 Q 85 45 75 35 Z" fill={hairColor} filter="url(#customShadow)" />
                  </g>
                )}
                {hairStyle === 'dreadlocks' && (
                  <path d="M 22 35 C 22 5, 78 5, 78 35 C 78 20, 50 15, 22 35 Z" fill={hairColor} filter="url(#customShadow)" />
                )}
                {hairStyle === 'curly' && (
                  <path d="M 20 35 Q 25 15 40 15 Q 50 5 60 15 Q 75 15 80 35 Q 70 20 50 20 Q 30 20 20 35 Z" fill={hairColor} filter="url(#customShadow)" />
                )}
              </>
            )}

            {/* Eyes Group */}
            <g className="transition-transform duration-75" style={{ transformOrigin: '50px 42px', transform: blink ? 'scaleY(0.05)' : 'scaleY(1)' }}>
              {/* Left Eye */}
              <g style={{ transformOrigin: '38px 42px', transform: `translate(${-eyeDistOffset}px, 0) scale(${eyeScale}) rotate(${eyeRot}deg)` }}>
                <ellipse cx="38" cy="42" rx={6} ry={4} fill="url(#customEyeWhite)" filter="url(#customInnerShadow)" />
                <circle cx="38" cy="42" r={2.5} fill="url(#customIris)" />
                <circle cx="37" cy="41" r="0.8" fill="#ffffff" />
                {/* Eyelid */}
                <path d={`M 30 42 Q 38 ${eyelidY - 10} 46 42 L 46 ${eyelidY} L 30 ${eyelidY} Z`} fill="url(#customSkin)" />
                {/* Upper Lashes */}
                {upperLashes !== 'none' && (
                  <path d="M 32 40 Q 38 36 44 40" fill="none" stroke="#000" strokeWidth={upperLashes === 'thick' ? 2 : 1} strokeDasharray={upperLashes === 'short' ? "1,2" : "none"} />
                )}
                {/* Lower Lashes */}
                {lowerLashes !== 'none' && (
                  <path d="M 34 44 Q 38 46 42 44" fill="none" stroke="#000" strokeWidth={0.5} strokeDasharray={lowerLashes === 'short' ? "1,2" : "none"} />
                )}
              </g>
              
              {/* Right Eye */}
              <g style={{ transformOrigin: '62px 42px', transform: `translate(${eyeDistOffset}px, 0) scale(${eyeScale}) rotate(${-eyeRot}deg)` }}>
                <ellipse cx="62" cy="42" rx={6} ry={4} fill="url(#customEyeWhite)" filter="url(#customInnerShadow)" />
                <circle cx="62" cy="42" r={2.5} fill="url(#customIris)" />
                <circle cx="61" cy="41" r="0.8" fill="#ffffff" />
                {/* Eyelid */}
                <path d={`M 54 42 Q 62 ${eyelidY - 10} 70 42 L 70 ${eyelidY} L 54 ${eyelidY} Z`} fill="url(#customSkin)" />
                {/* Upper Lashes */}
                {upperLashes !== 'none' && (
                  <path d="M 56 40 Q 62 36 68 40" fill="none" stroke="#000" strokeWidth={upperLashes === 'thick' ? 2 : 1} strokeDasharray={upperLashes === 'short' ? "1,2" : "none"} />
                )}
                {/* Lower Lashes */}
                {lowerLashes !== 'none' && (
                  <path d="M 58 44 Q 62 46 66 44" fill="none" stroke="#000" strokeWidth={0.5} strokeDasharray={lowerLashes === 'short' ? "1,2" : "none"} />
                )}
              </g>
            </g>

            {/* Glasses */}
            {eyeStyle === 'glasses' && (
              <g filter="url(#customShadow)">
                <rect x="26" y="34" width="24" height="16" rx="6" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                <rect x="50" y="34" width="24" height="16" rx="6" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                <path d="M 48 39 Q 50 37 52 39" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                <path d="M 20 38 L 26 38" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                <path d="M 74 38 L 80 38" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                <path d="M 28 36 L 40 48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
                <path d="M 52 36 L 64 48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
              </g>
            )}
            {eyeStyle === 'sunglasses' && (
              <g filter="url(#customShadow)">
                <rect x="26" y="34" width="24" height="16" rx="6" fill="#0f172a" stroke="#000000" strokeWidth="2.5" />
                <rect x="50" y="34" width="24" height="16" rx="6" fill="#0f172a" stroke="#000000" strokeWidth="2.5" />
                <path d="M 48 39 Q 50 37 52 39" fill="none" stroke="#000000" strokeWidth="2.5" />
                <path d="M 20 38 L 26 38" fill="none" stroke="#000000" strokeWidth="2.5" />
                <path d="M 74 38 L 80 38" fill="none" stroke="#000000" strokeWidth="2.5" />
                <path d="M 28 36 L 40 48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.2" />
                <path d="M 52 36 L 64 48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.2" />
              </g>
            )}

            {/* Nose */}
            <g style={{ transformOrigin: '50px 48px', transform: `scale(${noseScaleX}, ${noseScaleY}) rotate(${noseRot}deg)` }}>
              {noseStyle === 'small' && <path d="M 50 42 L 48 52 C 48 54, 52 54, 52 52 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'wide' && <path d="M 50 42 L 45 54 C 45 57, 55 57, 55 54 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'pointed' && <path d="M 50 42 L 48 56 L 50 58 L 52 56 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'button' && <circle cx="50" cy="52" r="3" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'aquiline' && <path d="M 50 42 Q 54 48 50 56 L 48 56 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'snub' && <path d="M 50 45 L 47 52 Q 50 50 53 52 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'roman' && <path d="M 50 40 L 52 48 L 50 56 L 48 56 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'flat' && <path d="M 46 54 Q 50 52 54 54 L 54 56 Q 50 55 46 56 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'broad' && <path d="M 48 42 L 44 56 L 56 56 L 52 42 Z" fill={skinDark} opacity={0.4} />}
              {noseStyle === 'thin' && <path d="M 50 42 L 49 56 L 51 56 Z" fill={skinDark} opacity={0.4} />}
              
              {/* Nose Tip */}
              <circle cx="50" cy="54" r={2 * noseTipScale} fill={skinDark} opacity={0.2} />
            </g>

            {/* Mouth */}
            <g style={{ transformOrigin: '50px 64px', transform: `scale(${mouthScaleX}, ${mouthScaleY})` }}>
              {isSpeaking ? (
                <>
                  <ellipse 
                    cx="50" 
                    cy="64" 
                    rx="8" 
                    ry={mouthOpen} 
                    fill="url(#customMouth)" 
                    className="transition-all duration-75"
                  />
                  {mouthOpen > 3 && (
                    <path 
                      d={`M 44 ${64 - mouthOpen + 1} Q 50 ${64 - mouthOpen + 3} 56 ${64 - mouthOpen + 1} L 55 ${64 - mouthOpen + 3} Q 50 ${64 - mouthOpen + 4} 45 ${64 - mouthOpen + 3} Z`} 
                      fill="#ffffff" 
                    />
                  )}
                </>
              ) : (
                <>
                  {mouthStyle === 'smile' && <path d="M 42 62 Q 50 68 58 62" fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" />}
                  {mouthStyle === 'neutral' && <path d="M 44 64 L 56 64" fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" />}
                  {mouthStyle === 'sad' && <path d="M 42 66 Q 50 60 58 66" fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" />}
                  {mouthStyle === 'smirk' && <path d="M 42 64 Q 50 64 58 60" fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" />}
                  {mouthStyle === 'open' && <ellipse cx="50" cy="64" rx="6" ry="4" fill={skinDark} />}
                  {mouthStyle === 'surprised' && <circle cx="50" cy="65" r="3" fill={skinDark} />}
                  {mouthStyle === 'pout' && <path d="M 46 64 Q 50 62 54 64 Q 50 66 46 64" fill="none" stroke={skinDark} strokeWidth="2" />}
                  {mouthStyle === 'laugh' && (
                    <g>
                      <path d="M 40 62 Q 50 72 60 62 Z" fill={skinDark} />
                      <path d="M 42 63 Q 50 65 58 63 Z" fill="#ffffff" />
                    </g>
                  )}
                  {mouthStyle === 'thin' && <path d="M 46 64 L 54 64" fill="none" stroke={skinDark} strokeWidth="1" strokeLinecap="round" />}
                  {mouthStyle === 'wide' && <path d="M 38 64 L 62 64" fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" />}
                </>
              )}
            </g>

            {/* Facial Hair */}
            {facialHairStyle !== 'none' && (
              <g style={{ transformOrigin: '50px 65px', transform: `scale(${faceScaleX}, 1)` }}>
                {facialHairStyle === 'stubble' && (
                  <path d="M 25 55 Q 50 90 75 55" fill="none" stroke={facialHairColor} strokeWidth="3" strokeDasharray="1,3" opacity="0.4" />
                )}
                {facialHairStyle === 'mustache' && (
                  <path d="M 40 58 Q 50 55 60 58 Q 50 62 40 58 Z" fill={facialHairColor} />
                )}
                {facialHairStyle === 'beard' && (
                  <path d="M 22 55 Q 22 85 50 85 Q 78 85 78 55 Q 70 75 50 75 Q 30 75 22 55 Z" fill={facialHairColor} opacity="0.9" />
                )}
                {facialHairStyle === 'goatee' && (
                  <path d="M 42 68 Q 50 80 58 68 Q 50 75 42 68 Z" fill={facialHairColor} />
                )}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};
