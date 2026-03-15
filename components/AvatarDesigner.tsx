import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { CustomAvatar3D, CustomAvatarProps } from './CustomAvatar3D';
import { saveAvatarConfig, loadAvatarConfig, SavedAvatarConfig } from '../services/avatarDb';
import { avatars } from '../constants/avatars';

export const normalizeColor = (color: string, defaultColor: string = '#000000') => {
  if (!color) return defaultColor;
  if (/^#[0-9A-Fa-f]{3,6}$/.test(color)) return color;
  
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      return ctx.fillStyle; // Returns hex format like '#000000'
    }
  } catch (e) {
    // Ignore canvas errors in non-browser environments
  }
  return defaultColor;
};

export const getLuminance = (hex: string) => {
  if (!hex) return 0;
  hex = hex.replace('#', '');
  
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrast = (lum1: number, lum2: number) => {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const bgLuminance = {
  light: getLuminance('#ffffff'),
  dark: getLuminance('#0f172a'),
  gradient: getLuminance('#60a5fa'),
  neon: getLuminance('#000000')
};

export const ensureGoodContrast = <T extends Partial<CustomAvatarProps>>(config: T): T => {
  // Normalize colors to ensure named colors (like 'black') are converted to hex
  if (config.skinColor) config.skinColor = normalizeColor(config.skinColor, '#ffe0d2');
  if (config.clothesColor) config.clothesColor = normalizeColor(config.clothesColor, '#0055FF');
  if (config.hairColor) config.hairColor = normalizeColor(config.hairColor, '#1a1a1a');
  if (config.eyeColor) config.eyeColor = normalizeColor(config.eyeColor, '#166534');

  // Simplify: always use light background
  config.bgTheme = 'light';

  // Avoid white or extremely light face color
  const skinLum = getLuminance(config.skinColor || '#ffe0d2');
  if (skinLum > 0.8) {
    // If skin is too light/white, set it to a default natural skin tone
    config.skinColor = '#f5cbb7';
  }

  // Ensure clothes aren't too light against the white background
  const clothesLum = getLuminance(config.clothesColor || '#0055FF');
  if (clothesLum > 0.8) {
    config.clothesColor = '#0055FF'; // Default to blue if clothes are too white
  }

  return config;
};

const SliderControl = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 uppercase">{label}</label>
      <span className="text-xs text-[var(--text-body)] opacity-50">{value}</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-[var(--border-light)] rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

export const AvatarDesigner: React.FC<{ onAvatarGenerated?: (config: CustomAvatarProps) => void, onNextStep?: (config: CustomAvatarProps) => void }> = ({ onAvatarGenerated, onNextStep }) => {
  const [config, setConfig] = useState<CustomAvatarProps>({
    hairStyle: 'short',
    hairColor: '#1a1a1a',
    skinColor: '#f5cbb7',
    eyeColor: '#166534',
    eyeStyle: 'normal',
    noseStyle: 'small',
    mouthStyle: 'smile',
    clothesStyle: 'tshirt',
    clothesColor: '#0055FF',
    bgTheme: 'light',
    isSpeaking: false,
    facialHairStyle: 'none',
    facialHairColor: '#1a1a1a',
    faceWidth: 50,
    eyeSize: 50,
    eyeAngle: 50,
    eyeDistance: 50,
    eyelidHeight: 50,
    upperLashes: 'long',
    lowerLashes: 'short',
    noseWidth: 50,
    noseHeight: 50,
    noseAngle: 50,
    noseTipSize: 50,
    mouthFullness: 50,
    mouthWidth: 50,
    mouthHeight: 50
  });
  
  const [avatarName, setAvatarName] = useState('Signet-Alpha');
  const [aiVoice, setAiVoice] = useState('Zephyr');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setSaveMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setSaveMessage("Could not access camera. Please ensure permissions are granted.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    stopCamera();
    setIsAnalyzing(true);
    setSaveMessage('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: "image/jpeg"
              }
            },
            {
              text: "Analyze this face and map the person's features to the provided CustomAvatarProps schema. Return ONLY valid JSON matching the schema. IMPORTANT RULES: 1. Always use 'light' for bgTheme. 2. Do not generate pure white (#ffffff) or extremely light skinColor. Use realistic natural skin tones. 3. Do not generate pure white or extremely light clothesColor."
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hairStyle: { type: Type.STRING, enum: ['short', 'long', 'bald', 'curly', 'buzzcut', 'dreadlocks', 'mohawk', 'spiky', 'wavy', 'bun', 'ponytail', 'fade', 'afro'] },
              hairColor: { type: Type.STRING, description: "Hex color code for hair" },
              skinColor: { type: Type.STRING, description: "Hex color code for skin" },
              eyeColor: { type: Type.STRING, description: "Hex color code for eyes" },
              eyeStyle: { type: Type.STRING, enum: ['normal', 'glasses', 'sunglasses'] },
              noseStyle: { type: Type.STRING, enum: ['small', 'wide', 'pointed', 'button', 'aquiline', 'snub', 'roman', 'flat', 'broad', 'thin'] },
              mouthStyle: { type: Type.STRING, enum: ['smile', 'neutral', 'sad', 'smirk', 'open', 'surprised', 'pout', 'laugh', 'thin', 'wide'] },
              clothesStyle: { type: Type.STRING, enum: ['tshirt', 'suit', 'hoodie', 'sweater', 'jacket', 'tanktop', 'dress', 'shirt', 'turtleneck', 'vneck', 'doctor', 'chef', 'police', 'astronaut', 'construction', 'ninja', 'wizard', 'cyberpunk', 'sports', 'military', 'royal', 'farmer', 'kimono', 'hanfu', 'sari', 'dashiki', 'poncho', 'qipao', 'dirndl', 'kilt'] },
              clothesColor: { type: Type.STRING, description: "Hex color code for clothes" },
              headwear: { type: Type.STRING, enum: ['none', 'cap', 'beanie', 'hijab', 'turban', 'sombrero', 'conical', 'crown', 'cowboy', 'headband'] },
              bgTheme: { type: Type.STRING, enum: ['light', 'dark', 'gradient', 'neon'] },
              facialHairStyle: { type: Type.STRING, enum: ['none', 'stubble', 'mustache', 'beard', 'goatee'] },
              facialHairColor: { type: Type.STRING, description: "Hex color code for facial hair" },
              faceWidth: { type: Type.NUMBER, description: "0 to 100" },
              eyeSize: { type: Type.NUMBER, description: "0 to 100" },
              eyeAngle: { type: Type.NUMBER, description: "0 to 100" },
              eyeDistance: { type: Type.NUMBER, description: "0 to 100" },
              eyelidHeight: { type: Type.NUMBER, description: "0 to 100" },
              upperLashes: { type: Type.STRING, enum: ['none', 'short', 'long', 'thick'] },
              lowerLashes: { type: Type.STRING, enum: ['none', 'short', 'long'] },
              noseWidth: { type: Type.NUMBER, description: "0 to 100" },
              noseHeight: { type: Type.NUMBER, description: "0 to 100" },
              noseAngle: { type: Type.NUMBER, description: "0 to 100" },
              noseTipSize: { type: Type.NUMBER, description: "0 to 100" },
              mouthFullness: { type: Type.NUMBER, description: "0 to 100" },
              mouthWidth: { type: Type.NUMBER, description: "0 to 100" },
              mouthHeight: { type: Type.NUMBER, description: "0 to 100" },
              gender: { type: Type.STRING, enum: ["male", "female"], description: "The gender of the person" }
            },
            required: ["gender", "hairStyle", "hairColor", "skinColor", "eyeColor", "eyeStyle", "noseStyle", "mouthStyle", "clothesStyle", "clothesColor", "headwear", "bgTheme", "facialHairStyle", "facialHairColor", "faceWidth", "eyeSize", "eyeAngle", "eyeDistance", "eyelidHeight", "upperLashes", "lowerLashes", "noseWidth", "noseHeight", "noseAngle", "noseTipSize", "mouthFullness", "mouthWidth", "mouthHeight"]
          }
        }
      });
      
      const result = JSON.parse(response.text || "{}");
      
      setConfig(prev => {
        const mergedConfig = { ...prev, ...result };
        const contrastFixedResult = ensureGoodContrast(mergedConfig);
        if (onAvatarGenerated) onAvatarGenerated(contrastFixedResult);
        return contrastFixedResult;
      });
      
      if (result.gender === 'female') {
        if (!aiVoice.includes('Zephyr') && !aiVoice.includes('Kore')) {
          setAiVoice('Zephyr');
        }
      } else if (result.gender === 'male') {
        if (!aiVoice.includes('Puck') && !aiVoice.includes('Charon') && !aiVoice.includes('Fenrir')) {
          setAiVoice('Puck');
        }
      }

      setSaveMessage('Avatar generated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (err) {
      console.error("Error analyzing image:", err);
      setSaveMessage("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const saved = await loadAvatarConfig();
        if (saved) {
          const { name, voice, ...avatarProps } = saved;
          setConfig(prev => ({ ...prev, ...avatarProps }));
          setAvatarName(name === 'My Avatar' ? 'Signet-Alpha' : (name || 'Signet-Alpha'));
          setAiVoice(voice || 'Zephyr');
        }
      } catch (err) {
        console.error("Failed to load avatar config", err);
      }
    };
    loadSaved();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await saveAvatarConfig({
        ...config,
        name: avatarName,
        voice: aiVoice
      });
      setSaveMessage('Avatar saved successfully! It will be used in Live Chat.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Failed to save avatar", err);
      setSaveMessage('Failed to save avatar.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (key: keyof CustomAvatarProps, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateCode = () => {
    return `<CustomAvatar3D
  hairStyle="${config.hairStyle}"
  hairColor="${config.hairColor}"
  skinColor="${config.skinColor}"
  eyeColor="${config.eyeColor}"
  eyeStyle="${config.eyeStyle}"
  noseStyle="${config.noseStyle}"
  mouthStyle="${config.mouthStyle}"
  clothesStyle="${config.clothesStyle}"
  clothesColor="${config.clothesColor}"
  headwear="${config.headwear || 'none'}"
  bgTheme="${config.bgTheme}"
/>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skinLum = getLuminance(config.skinColor);
  const clothesLum = getLuminance(config.clothesColor);
  const bgLum = bgLuminance[config.bgTheme || 'light'];
  
  const skinContrast = getContrast(skinLum, bgLum);
  const clothesContrast = getContrast(clothesLum, bgLum);
  const hasPoorContrast = skinContrast < 2.5 || clothesContrast < 2.5;

  const colors = {
    skin: ['#ffe0d2', '#f5cbb7', '#e0ac69', '#8d5524', '#3d2210'],
    hair: ['#1a1a1a', '#4a3018', '#a53814', '#e8c37a', '#a0a0a0', '#94a3b8', '#e11d48', '#0284c7'],
    eye: ['#166534', '#0284c7', '#4a3018', '#1a1a1a', '#9333ea'],
    clothes: ['#0055FF', '#1e293b', '#e11d48', '#16a34a', '#eab308', '#ffffff']
  };

  return (
    <div className="bg-[var(--bg-standard)] p-8">
      <div className="max-w-6xl mx-auto">
        {!onNextStep && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--text-header)] mb-2">Avatar Designer Lab</h1>
            <p className="text-[var(--text-body)] opacity-70">Customize your digital identity representation.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-xl p-6 sticky top-24 shadow-lg">
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 uppercase mb-2">Start from Preset</label>
                <button 
                  onClick={() => setShowPresetModal(true)}
                  className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-body)] outline-none hover:border-[var(--trust-blue)] transition-colors flex items-center justify-between"
                >
                  <span>Browse Avatar Presets</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>

              <div className="mb-6">
                <button 
                  onClick={startCamera}
                  disabled={isAnalyzing}
                  className="w-full px-4 py-3 bg-[var(--trust-blue)] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    'Analyzing Face...'
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                      Generate from Photo
                    </>
                  )}
                </button>
              </div>

              {isCameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                  <div className="bg-[var(--bg-sidebar)] p-6 rounded-xl max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[var(--text-header)]">Take a Photo</h3>
                      <button onClick={stopCamera} className="text-[var(--text-body)] opacity-70 hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <button 
                      onClick={captureAndAnalyze}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-500 transition-all shadow-md"
                    >
                      Capture & Generate
                    </button>
                  </div>
                </div>
              )}

              <div className="aspect-square w-full max-w-[300px] mx-auto mb-6">
                <CustomAvatar3D {...config} />
              </div>

              {hasPoorContrast && (
                <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 mt-0.5 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    <strong>Low Contrast Warning:</strong> The current background theme may make the avatar hard to see. Consider changing the background theme, skin color, or clothes color.
                  </p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => updateConfig('isSpeaking', !config.isSpeaking)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${config.isSpeaking ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-[var(--table-header)] text-[var(--text-body)] border border-[var(--border-light)] hover:bg-[var(--border-light)]'}`}
                >
                  {config.isSpeaking ? 'Stop Speaking' : 'Test Speaking'}
                </button>
              </div>

              <div className="mt-8 border-t border-[var(--border-light)] pt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Avatar Name</label>
                  <input 
                    type="text" 
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    placeholder="Enter avatar name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">AI Voice</label>
                  <select 
                    value={aiVoice}
                    onChange={(e) => setAiVoice(e.target.value)}
                    className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                  >
                    <option value="Zephyr">Zephyr (Female)</option>
                    <option value="Kore">Kore (Female)</option>
                    <option value="Puck">Puck (Male)</option>
                    <option value="Charon">Charon (Male)</option>
                    <option value="Fenrir">Fenrir (Male)</option>
                    <option value="Zephyr-CN">Zephyr (Female - Chinese)</option>
                    <option value="Fenrir-CN">Fenrir (Male - Chinese)</option>
                  </select>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full px-4 py-3 bg-[var(--trust-blue)] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Avatar to IndexedDB'}
                </button>
                {saveMessage && (
                  <p className="text-xs text-green-500 text-center font-bold mt-2">{saveMessage}</p>
                )}
              </div>

              <div className="mt-6 border-t border-[var(--border-light)] pt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 uppercase">Export React Code</label>
                  <button onClick={handleCopyCode} className="text-xs font-bold text-[var(--trust-blue)] hover:underline">
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="bg-[var(--code-bg)] text-[var(--text-body)] p-3 rounded text-xs overflow-x-auto border border-[var(--border-light)]">
                  <code>{generateCode()}</code>
                </pre>
                <p className="text-[10px] opacity-50 mt-2">You can use this code snippet in your own React application.</p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-2 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Basic Features */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-header)] border-b border-[var(--border-light)] pb-2">Face & Head</h3>
                
                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Skin Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.skin.map(color => (
                      <button 
                        key={color} 
                        onClick={() => updateConfig('skinColor', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${config.skinColor === color ? 'border-[var(--trust-blue)] scale-110' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Hair Style</label>
                  <select 
                    value={config.hairStyle} 
                    onChange={(e) => updateConfig('hairStyle', e.target.value)}
                    className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                  >
                    <option value="short">Short</option>
                    <option value="long">Long</option>
                    <option value="bald">Bald</option>
                    <option value="curly">Curly</option>
                    <option value="buzzcut">Buzzcut</option>
                    <option value="dreadlocks">Dreadlocks</option>
                    <option value="mohawk">Mohawk</option>
                    <option value="spiky">Spiky</option>
                    <option value="wavy">Wavy</option>
                    <option value="bun">Bun</option>
                    <option value="ponytail">Ponytail</option>
                    <option value="fade">Fade</option>
                    <option value="afro">Afro</option>
                  </select>
                </div>

                {config.hairStyle !== 'bald' && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Hair Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.hair.map(color => (
                        <button 
                          key={color} 
                          onClick={() => updateConfig('hairColor', color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${config.hairColor === color ? 'border-[var(--trust-blue)] scale-110' : 'border-transparent hover:scale-110'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Facial Hair</label>
                    <select 
                      value={config.facialHairStyle} 
                      onChange={(e) => updateConfig('facialHairStyle', e.target.value)}
                      className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="stubble">Stubble</option>
                      <option value="mustache">Mustache</option>
                      <option value="beard">Beard</option>
                      <option value="goatee">Goatee</option>
                    </select>
                  </div>
                  {config.facialHairStyle !== 'none' && (
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Facial Hair Color</label>
                      <div className="flex gap-1 flex-wrap">
                        {colors.hair.map(color => (
                          <button 
                            key={color} 
                            onClick={() => updateConfig('facialHairColor', color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${config.facialHairColor === color ? 'border-[var(--trust-blue)] scale-110' : 'border-transparent hover:scale-110'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <SliderControl label="Face Width" value={config.faceWidth || 50} onChange={(v) => updateConfig('faceWidth', v)} />
              </div>

              {/* Details & Styling */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-header)] border-b border-[var(--border-light)] pb-2">Features & Style</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Eye Style</label>
                    <select 
                      value={config.eyeStyle} 
                      onChange={(e) => updateConfig('eyeStyle', e.target.value)}
                      className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="glasses">Glasses</option>
                      <option value="sunglasses">Sunglasses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Eye Color</label>
                    <div className="flex gap-1 flex-wrap">
                      {colors.eye.map(color => (
                        <button 
                          key={color} 
                          onClick={() => updateConfig('eyeColor', color)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${config.eyeColor === color ? 'border-[var(--trust-blue)] scale-110' : 'border-transparent hover:scale-110'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Upper Lashes</label>
                    <select 
                      value={config.upperLashes} 
                      onChange={(e) => updateConfig('upperLashes', e.target.value)}
                      className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="short">Short</option>
                      <option value="long">Long</option>
                      <option value="thick">Thick</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Lower Lashes</label>
                    <select 
                      value={config.lowerLashes} 
                      onChange={(e) => updateConfig('lowerLashes', e.target.value)}
                      className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="short">Short</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                <SliderControl label="Eye Size" value={config.eyeSize || 50} onChange={(v) => updateConfig('eyeSize', v)} />
                <SliderControl label="Eye Angle" value={config.eyeAngle || 50} onChange={(v) => updateConfig('eyeAngle', v)} />
                <SliderControl label="Eye Distance" value={config.eyeDistance || 50} onChange={(v) => updateConfig('eyeDistance', v)} />
                <SliderControl label="Eyelid Height" value={config.eyelidHeight || 50} onChange={(v) => updateConfig('eyelidHeight', v)} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Nose</label>
                    <select 
                      value={config.noseStyle} 
                      onChange={(e) => updateConfig('noseStyle', e.target.value)}
                      className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    >
                      <option value="small">Small</option>
                      <option value="wide">Wide</option>
                      <option value="pointed">Pointed</option>
                      <option value="button">Button</option>
                      <option value="aquiline">Aquiline</option>
                      <option value="snub">Snub</option>
                      <option value="roman">Roman</option>
                      <option value="flat">Flat</option>
                      <option value="broad">Broad</option>
                      <option value="thin">Thin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Mouth</label>
                    <select 
                      value={config.mouthStyle} 
                      onChange={(e) => updateConfig('mouthStyle', e.target.value)}
                      className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                    >
                      <option value="smile">Smile</option>
                      <option value="neutral">Neutral</option>
                      <option value="sad">Sad</option>
                      <option value="smirk">Smirk</option>
                      <option value="open">Open</option>
                      <option value="surprised">Surprised</option>
                      <option value="pout">Pout</option>
                      <option value="laugh">Laugh</option>
                      <option value="thin">Thin</option>
                      <option value="wide">Wide</option>
                    </select>
                  </div>
                </div>

                <SliderControl label="Nose Width" value={config.noseWidth || 50} onChange={(v) => updateConfig('noseWidth', v)} />
                <SliderControl label="Nose Height" value={config.noseHeight || 50} onChange={(v) => updateConfig('noseHeight', v)} />
                <SliderControl label="Nose Angle" value={config.noseAngle || 50} onChange={(v) => updateConfig('noseAngle', v)} />
                <SliderControl label="Nose Tip Size" value={config.noseTipSize || 50} onChange={(v) => updateConfig('noseTipSize', v)} />

                <SliderControl label="Mouth Fullness" value={config.mouthFullness || 50} onChange={(v) => updateConfig('mouthFullness', v)} />
                <SliderControl label="Mouth Width" value={config.mouthWidth || 50} onChange={(v) => updateConfig('mouthWidth', v)} />
                <SliderControl label="Mouth Height" value={config.mouthHeight || 50} onChange={(v) => updateConfig('mouthHeight', v)} />

                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Clothes Style</label>
                  <select 
                    value={config.clothesStyle} 
                    onChange={(e) => updateConfig('clothesStyle', e.target.value)}
                    className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                  >
                    <option value="tshirt">T-Shirt</option>
                    <option value="suit">Suit</option>
                    <option value="hoodie">Hoodie</option>
                    <option value="sweater">Sweater</option>
                    <option value="jacket">Jacket</option>
                    <option value="tanktop">Tank Top</option>
                    <option value="dress">Dress</option>
                    <option value="shirt">Button Shirt</option>
                    <option value="turtleneck">Turtleneck</option>
                    <option value="vneck">V-Neck</option>
                    <option value="doctor">Doctor</option>
                    <option value="chef">Chef</option>
                    <option value="police">Police</option>
                    <option value="astronaut">Astronaut</option>
                    <option value="construction">Construction</option>
                    <option value="ninja">Ninja</option>
                    <option value="wizard">Wizard</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="sports">Sports</option>
                    <option value="military">Military</option>
                    <option value="royal">Royal</option>
                    <option value="farmer">Farmer</option>
                    <option value="kimono">Kimono</option>
                    <option value="hanfu">Hanfu</option>
                    <option value="sari">Sari</option>
                    <option value="dashiki">Dashiki</option>
                    <option value="poncho">Poncho</option>
                    <option value="qipao">Qipao</option>
                    <option value="dirndl">Dirndl</option>
                    <option value="kilt">Kilt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Headwear</label>
                  <select 
                    value={config.headwear || 'none'} 
                    onChange={(e) => updateConfig('headwear', e.target.value)}
                    className="w-full bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] rounded p-2 text-sm"
                  >
                    <option value="none">None</option>
                    <option value="cap">Cap</option>
                    <option value="beanie">Beanie</option>
                    <option value="hijab">Hijab</option>
                    <option value="turban">Turban</option>
                    <option value="sombrero">Sombrero</option>
                    <option value="conical">Conical Hat</option>
                    <option value="crown">Crown</option>
                    <option value="cowboy">Cowboy Hat</option>
                    <option value="headband">Headband</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Clothes Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.clothes.map(color => (
                      <button 
                        key={color} 
                        onClick={() => updateConfig('clothesColor', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${config.clothesColor === color ? 'border-[var(--trust-blue)] scale-110' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Background Theme</label>
                  <div className="flex gap-2 flex-wrap">
                    {['light', 'dark', 'gradient', 'neon'].map(theme => (
                      <button 
                        key={theme} 
                        onClick={() => updateConfig('bgTheme', theme)}
                        className={`px-3 py-1.5 text-sm rounded border capitalize transition-all ${config.bgTheme === theme ? 'bg-[var(--trust-blue)] border-[var(--trust-blue)] text-white' : 'border-[var(--border-light)] text-[var(--text-body)] hover:border-gray-400'}`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                
                {onNextStep && (
                  <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                    <button
                      onClick={() => onNextStep(config)}
                      className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[12px] uppercase font-bold tracking-widest rounded shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3"
                    >
                      Save & Return to Registration <span>→</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-[var(--bg-standard)] rounded-2xl border border-[var(--border-light)] shadow-2xl w-full max-w-6xl max-h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-sidebar)]">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-header)]">Select Avatar Preset</h2>
                <p className="text-sm text-[var(--text-body)] opacity-70">Choose a starting point for your digital identity.</p>
              </div>
              <button 
                onClick={() => setShowPresetModal(false)}
                className="p-2 hover:bg-[var(--bg-standard)] rounded-full transition-colors text-[var(--text-body)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {avatars.map(avatar => (
                  <button 
                    key={avatar.id}
                    onClick={() => {
                      const { id, gender, age, ...rest } = avatar;
                      setConfig(prev => ({ ...prev, ...rest }));
                      if (gender === 'female') {
                        if (!aiVoice.includes('Zephyr') && !aiVoice.includes('Kore')) {
                          setAiVoice('Zephyr');
                        }
                      } else {
                        if (!aiVoice.includes('Puck') && !aiVoice.includes('Charon') && !aiVoice.includes('Fenrir')) {
                          setAiVoice('Puck');
                        }
                      }
                      setShowPresetModal(false);
                    }}
                    className="group relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-transparent hover:border-[var(--trust-blue)] hover:bg-[var(--bg-sidebar)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--trust-blue)]"
                  >
                    <div className="w-full aspect-square rounded-full overflow-hidden border border-[var(--border-light)] bg-[var(--bg-standard)] shadow-sm group-hover:shadow-md transition-all">
                      <div className="w-full h-full pointer-events-none flex items-center justify-center">
                        <CustomAvatar3D {...avatar} isSpeaking={false} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-body)] opacity-70 group-hover:opacity-100 group-hover:text-[var(--trust-blue)] transition-colors">
                      {avatar.gender === 'female' ? 'Female' : 'Male'} {avatar.id.replace(/[a-z]/g, '')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
