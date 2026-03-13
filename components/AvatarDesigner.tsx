import React, { useState, useEffect } from 'react';
import { CustomAvatar3D, CustomAvatarProps } from './CustomAvatar3D';
import { saveAvatarConfig, loadAvatarConfig, SavedAvatarConfig } from '../services/avatarDb';

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

export const AvatarDesigner: React.FC = () => {
  const [config, setConfig] = useState<CustomAvatarProps>({
    hairStyle: 'short',
    hairColor: '#1a1a1a',
    faceShape: 'round',
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
    cheekFullness: 50,
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

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const saved = await loadAvatarConfig();
        if (saved) {
          const { name, voice, ...avatarProps } = saved;
          setConfig(prev => ({ ...prev, ...avatarProps }));
          setAvatarName(name);
          setAiVoice(voice);
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
  faceShape="${config.faceShape}"
  skinColor="${config.skinColor}"
  eyeColor="${config.eyeColor}"
  eyeStyle="${config.eyeStyle}"
  noseStyle="${config.noseStyle}"
  mouthStyle="${config.mouthStyle}"
  clothesStyle="${config.clothesStyle}"
  clothesColor="${config.clothesColor}"
  bgTheme="${config.bgTheme}"
/>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = {
    skin: ['#ffe0d2', '#f5cbb7', '#e0ac69', '#8d5524', '#3d2210'],
    hair: ['#1a1a1a', '#4a3018', '#a53814', '#e8c37a', '#a0a0a0', '#94a3b8', '#e11d48', '#0284c7'],
    eye: ['#166534', '#0284c7', '#4a3018', '#1a1a1a', '#9333ea'],
    clothes: ['#0055FF', '#1e293b', '#e11d48', '#16a34a', '#eab308', '#ffffff']
  };

  return (
    <div className="min-h-screen bg-[var(--bg-standard)] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-header)] mb-2">Avatar Designer Lab</h1>
          <p className="text-[var(--text-body)] opacity-70">Customize your digital identity representation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-xl p-6 sticky top-24 shadow-lg">
              <div className="aspect-square w-full max-w-[300px] mx-auto mb-6">
                <CustomAvatar3D {...config} />
              </div>
              
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
                  <label className="block text-xs font-bold text-[var(--text-body)] opacity-70 mb-2 uppercase">Face Shape</label>
                  <div className="flex gap-2">
                    {['round', 'oval', 'square'].map(shape => (
                      <button 
                        key={shape} 
                        onClick={() => updateConfig('faceShape', shape)}
                        className={`flex-1 py-1.5 text-sm rounded border capitalize transition-all ${config.faceShape === shape ? 'bg-[var(--trust-blue)] border-[var(--trust-blue)] text-white' : 'border-[var(--border-light)] text-[var(--text-body)] hover:border-gray-400'}`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

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
                <SliderControl label="Cheek Fullness" value={config.cheekFullness || 50} onChange={(v) => updateConfig('cheekFullness', v)} />
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
