import React, { useState, useEffect, useRef } from 'react';
import { CustomAvatar3D, CustomAvatarProps } from './CustomAvatar3D';
import { saveAvatarConfig, loadAvatarConfig, SavedAvatarConfig, saveCustomAvatar, loadCustomAvatars, deleteCustomAvatar } from '../services/avatarDb';
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
  const [presetTab, setPresetTab] = useState<'all' | 'female' | 'male' | 'custom'>('all');
  const [presetSearch, setPresetSearch] = useState('');
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [customAvatars, setCustomAvatars] = useState<SavedAvatarConfig[]>([]);

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
        const custom = await loadCustomAvatars();
        setCustomAvatars(custom);
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
            <div className="p-6 border-b border-[var(--border-light)] flex flex-col gap-4 bg-[var(--bg-sidebar)]">
              <div className="flex justify-between items-center">
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
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex bg-[var(--bg-standard)] p-1 rounded-lg border border-[var(--border-light)] w-full sm:w-auto">
                  {(['all', 'female', 'male', 'custom'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setPresetTab(tab)}
                      className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${presetTab === tab ? 'bg-[var(--trust-blue)] text-white shadow-sm' : 'text-[var(--text-body)] hover:bg-[var(--bg-sidebar)] opacity-70 hover:opacity-100'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)] opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input
                      type="text"
                      placeholder="Search features, jobs, hobbies..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--trust-blue)]"
                    />
                  </div>
                  <button 
                    onClick={() => setShowSearchHelp(!showSearchHelp)}
                    className="p-2 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg hover:bg-[var(--bg-sidebar)] transition-colors text-[var(--text-body)] opacity-70 hover:opacity-100"
                    title="Search Usage Manual"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  </button>
                  {presetTab === 'custom' && (
                    <label className="p-2 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg hover:bg-[var(--bg-sidebar)] transition-colors text-[var(--text-body)] opacity-70 hover:opacity-100 cursor-pointer" title="Upload Custom Avatar JSON">
                      <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const json = JSON.parse(event.target?.result as string);
                              const { id, timestamp, ...rest } = json;
                              const newCustomAvatar = await saveCustomAvatar(rest);
                              setCustomAvatars(prev => [newCustomAvatar, ...prev]);
                            } catch (err) {
                              alert("Invalid JSON file");
                            }
                          };
                          reader.readAsText(file);
                          e.target.value = '';
                        }} 
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    </label>
                  )}
                </div>
              </div>
              
              {showSearchHelp && (
                <div className="bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg p-4 text-sm text-[var(--text-body)] animate-in fade-in slide-in-from-top-2 max-h-[60vh] overflow-y-auto">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Search & API Usage Manual
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <strong className="block mb-1 text-[var(--trust-blue)]">1. How to Search</strong>
                      <p className="opacity-80 text-xs">Search by name prefixes, careers, hobbies, or features.</p>
                      <ul className="list-disc pl-4 mt-1 opacity-80 text-xs">
                        <li>Names: "Emm" (matches Emma), "Li"</li>
                        <li>Careers: "engineer", "doctor", "farmer"</li>
                        <li>Hobbies: "cooking", "runner", "gamer"</li>
                        <li>Features: "glasses", "beard", "bun"</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="block mb-1 text-[var(--trust-blue)]">2. Modify Existing</strong>
                      <p className="opacity-80 text-xs">Select any preset avatar from the list below. Once loaded, use the left sidebar controls to tweak colors, facial features, and clothing.</p>
                    </div>
                    <div>
                      <strong className="block mb-1 text-[var(--trust-blue)]">3. Design Your Own</strong>
                      <p className="opacity-80 text-xs">If you can't find what you need, type a detailed description in the search bar. If no results match, an "AI Generate" button will appear to create it instantly!</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-[var(--border-light)] pt-4">
                    <strong className="block mb-2 text-[var(--trust-blue)]">Programmatic API (CustomAvatar3D)</strong>
                    <p className="opacity-80 text-xs mb-3">You can programmatically generate avatars using the <code>&lt;CustomAvatar3D /&gt;</code> component with the following supported exact string values. <strong>Note:</strong> Using invalid values (like "Elegant Hollywood Waves") will result in missing features.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">hairStyle:</span> <span className="opacity-70">'short' | 'long' | 'bald' | 'curly' | 'buzzcut' | 'dreadlocks' | 'mohawk' | 'spiky' | 'wavy' | 'bun' | 'ponytail' | 'fade' | 'afro'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">eyeStyle:</span> <span className="opacity-70">'normal' | 'glasses' | 'sunglasses'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">noseStyle:</span> <span className="opacity-70">'small' | 'wide' | 'pointed' | 'button' | 'aquiline' | 'snub' | 'roman' | 'flat' | 'broad' | 'thin'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">mouthStyle:</span> <span className="opacity-70">'smile' | 'neutral' | 'sad' | 'smirk' | 'open' | 'surprised' | 'pout' | 'laugh' | 'thin' | 'wide'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">clothesStyle:</span> <span className="opacity-70">'tshirt' | 'suit' | 'hoodie' | 'sweater' | 'jacket' | 'tanktop' | 'dress' | 'shirt' | 'turtleneck' | 'vneck' | 'doctor' | 'chef' | 'police' | 'astronaut' | 'construction' | 'ninja' | 'wizard' | 'cyberpunk' | 'sports' | 'military' | 'royal' | 'farmer' | 'kimono' | 'hanfu' | 'sari' | 'dashiki' | 'poncho' | 'qipao' | 'dirndl' | 'kilt'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">headwear:</span> <span className="opacity-70">'none' | 'cap' | 'beanie' | 'hijab' | 'turban' | 'sombrero' | 'conical' | 'crown' | 'cowboy' | 'headband'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">facialHairStyle:</span> <span className="opacity-70">'none' | 'stubble' | 'mustache' | 'beard' | 'goatee'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">bgTheme:</span> <span className="opacity-70">'light' | 'dark' | 'gradient' | 'neon'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">upperLashes:</span> <span className="opacity-70">'none' | 'short' | 'long' | 'thick'</span></div>
                      <div><span className="font-mono font-semibold text-[var(--text-header)]">lowerLashes:</span> <span className="opacity-70">'none' | 'short' | 'long'</span></div>
                      <div className="col-span-1 sm:col-span-2"><span className="font-mono font-semibold text-[var(--text-header)]">Colors (Hex):</span> <span className="opacity-70">hairColor, skinColor, eyeColor, clothesColor, facialHairColor</span></div>
                      <div className="col-span-1 sm:col-span-2"><span className="font-mono font-semibold text-[var(--text-header)]">Numeric (0-100):</span> <span className="opacity-70">faceWidth, eyeSize, eyeAngle, eyeDistance, eyelidHeight, noseWidth, noseHeight, noseAngle, noseTipSize, mouthFullness, mouthWidth, mouthHeight</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const filteredAvatars = presetTab === 'custom'
                  ? customAvatars.filter(avatar => {
                      if (presetSearch) {
                        const searchLower = presetSearch.toLowerCase();
                        return avatar.name?.toLowerCase().includes(searchLower);
                      }
                      return true;
                    })
                  : avatars.filter(avatar => {
                      if (presetTab !== 'all' && avatar.gender !== presetTab) return false;
                      if (presetSearch) {
                        const searchLower = presetSearch.toLowerCase();
                        const nameMatch = avatar.name?.toLowerCase().includes(searchLower);
                        const keywordMatch = avatar.keywords?.some(k => k.toLowerCase().includes(searchLower));
                        return nameMatch || keywordMatch;
                      }
                      return true;
                    });

                if (filteredAvatars.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-16 h-16 bg-[var(--bg-sidebar)] rounded-full flex items-center justify-center mb-4 border border-[var(--border-light)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-body)] opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-header)] mb-2">No presets found</h3>
                      <p className="text-[var(--text-body)] opacity-70 max-w-md mb-6">
                        We couldn't find any avatars matching "{presetSearch}". Try adjusting your search terms.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {filteredAvatars.map(avatar => (
                      <div key={avatar.id} className="relative group">
                        <button 
                          onClick={() => {
                            const { id, gender, age, name, keywords, timestamp, voice, ...rest } = avatar as any;
                            setConfig(prev => ({ ...prev, ...rest }));
                            if (voice) {
                              setAiVoice(voice);
                            } else if (gender === 'female') {
                              if (!aiVoice.includes('Zephyr') && !aiVoice.includes('Kore')) {
                                setAiVoice('Zephyr');
                              }
                            } else {
                              if (!aiVoice.includes('Puck') && !aiVoice.includes('Charon') && !aiVoice.includes('Fenrir')) {
                                setAiVoice('Puck');
                              }
                            }
                            if (name) setAvatarName(name);
                            setShowPresetModal(false);
                          }}
                          className="w-full flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-transparent hover:border-[var(--trust-blue)] hover:bg-[var(--bg-sidebar)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--trust-blue)]"
                        >
                          <div className="w-full aspect-square rounded-full overflow-hidden border border-[var(--border-light)] bg-[var(--bg-standard)] shadow-sm group-hover:shadow-md transition-all">
                            <div className="w-full h-full pointer-events-none flex items-center justify-center">
                              <CustomAvatar3D {...avatar} isSpeaking={false} />
                            </div>
                          </div>
                          <span className="text-[11px] font-medium tracking-wide text-[var(--text-body)] opacity-80 group-hover:opacity-100 group-hover:text-[var(--trust-blue)] transition-colors truncate w-full text-center">
                            {avatar.name || ((avatar as any).gender === 'female' ? 'Female' : 'Male') + ' ' + avatar.id?.replace(/[a-z]/g, '')}
                          </span>
                        </button>
                        {presetTab === 'custom' && (
                          <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(avatar, null, 2));
                                const downloadAnchorNode = document.createElement('a');
                                downloadAnchorNode.setAttribute("href", dataStr);
                                downloadAnchorNode.setAttribute("download", (avatar.name || 'custom-avatar') + ".json");
                                document.body.appendChild(downloadAnchorNode);
                                downloadAnchorNode.click();
                                downloadAnchorNode.remove();
                              }}
                              className="bg-[var(--trust-blue)] text-white rounded-full p-1 shadow-md hover:bg-blue-600"
                              title="Download JSON"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this custom avatar?')) {
                                  deleteCustomAvatar(avatar.id!).then(() => {
                                    setCustomAvatars(prev => prev.filter(a => a.id !== avatar.id));
                                  });
                                }
                              }}
                              className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
