
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { GOOGLE_GEMINI_KEY, GOOGLE_GEMINI_LIVE_KEY } from '../src/config/env';
import { CustomAvatar3D } from './CustomAvatar3D';
import { avatars, AvatarConfig } from '../constants/avatars';
import { loadAvatarConfig, SavedAvatarConfig } from '../services/avatarDb';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

type ConnectionStatus = 'OFFLINE' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

// --- Manual Encoding/Decoding (Instruction mandated) ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const cleanBase64 = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const paddedBase64 = cleanBase64.padEnd(cleanBase64.length + (4 - cleanBase64.length % 4) % 4, '=');
  const binaryString = atob(paddedBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): AudioBuffer {
  const dataView = new DataView(data.buffer);
  const frameCount = Math.floor(data.length / 2 / numChannels);
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataView.getInt16((i * numChannels + channel) * 2, true) / 32768.0;
    }
  }
  return buffer;
}

export const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>('OFFLINE');
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingInput, setStreamingInput] = useState('');
  const [streamingOutput, setStreamingOutput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [selectedAvatarId, setSelectedAvatarId] = useState('f1');
  const [customAvatar, setCustomAvatar] = useState<SavedAvatarConfig | null>(null);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [presetTab, setPresetTab] = useState<'all' | 'female' | 'male'>('all');
  const [presetSearch, setPresetSearch] = useState('');
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [isGeneratingFromSearch, setIsGeneratingFromSearch] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCustomAvatar = async () => {
      try {
        const saved = await loadAvatarConfig();
        if (saved) {
          setCustomAvatar(saved);
          setSelectedVoice(saved.voice || 'Zephyr');
        }
      } catch (err) {
        console.error("Failed to load custom avatar for Live Assistant", err);
      }
    };
    loadCustomAvatar();
  }, [isOpen]);
  
  // Audio Refs
  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Transcripts
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  const pendingDemoNarrate = useRef(false);
  const speakingTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingInput, streamingOutput]);

  useEffect(() => {
    const handleSpeaking = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsAgentSpeaking(customEvent.detail?.isSpeaking || false);
    };
    window.addEventListener('signet:speaking-status', handleSpeaking);
    return () => window.removeEventListener('signet:speaking-status', handleSpeaking);
  }, []);

  useEffect(() => {
    const handleStartDemo = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.fromAgent) return; // Agent already knows

      setIsOpen(true);
      
      if (status === 'OFFLINE') {
        pendingDemoNarrate.current = true;
        initVoiceChat();
      } else if (status === 'CONNECTED' && sessionRef.current) {
        try {
          sessionRef.current.sendClientContent({ turns: [{ role: 'user', parts: [{ text: "I just started the demo notebook manually. Please provide a 1-minute introduction summarizing the key of the project, addressing the hackathon requirements (Live Agent, Gemini Live API, Google Cloud). Then, explain Stage 1: Sovereign Identity Initialization. Do NOT explain the other stages yet. I will prompt you when the UI advances to the next stage." }] }], turnComplete: true });
        } catch (err) {
          console.error("Failed to send demo prompt:", err);
        }
      }
    };

    const handleNarrateStep = (e: Event) => {
      const customEvent = e as CustomEvent;
      const step = customEvent.detail?.step;
      if (status === 'CONNECTED' && sessionRef.current) {
        try {
          let prompt = `The demo has automatically advanced to stage ${step}. Please explain this stage briefly to the user. Do NOT explain any subsequent stages. I will prompt you again when the UI advances.`;
          if (step === 2) {
            prompt = `The demo has automatically advanced to stage 2: Universal Media Signing (C2PA+). Please explain how we inject a C2PA-compliant manifest directly into the asset's JUMBF boxes, and point out the 'org.signetai.vpr' assertion where our proprietary Visual Provenance Record is stored. Aim for about 30 seconds of speaking. Do NOT explain any subsequent stages. I will prompt you again when the UI advances.`;
          } else if (step === 3) {
            prompt = `The demo has automatically advanced to stage 3: Public Ledger Verification. Please explain how we verify the signature against our distributed ledger to ensure the asset hasn't been backdated or re-signed, acting as a Proof of Existence. Aim for about 30 seconds of speaking. Do NOT explain any subsequent stages. I will prompt you again when the UI advances.`;
          } else if (step === 4) {
            prompt = `The demo has automatically advanced to stage 4: Image Forensic Diff Analysis. Please provide a detailed explanation of how the Trident Engine performs deterministic pixel-perfect diffs for static images to detect deepfakes or synthetic alterations. Explain the SSIM map and the score composition. Aim for about 45 seconds of speaking. Do NOT explain any subsequent stages. I will prompt you again when the UI advances.`;
          } else if (step === 5) {
            prompt = `The demo has automatically advanced to stage 5: Video Authenticity Verification. Please provide a detailed explanation of how the Trident Engine performs frame-by-frame temporal analysis for video authenticity to detect deepfakes. Aim for about 45 seconds of speaking. Do NOT explain any subsequent stages. I will prompt you again when the UI advances.`;
          } else if (step === 6) {
            prompt = `The demo has automatically advanced to stage 6: Conclusion & Future Outlook. Please wrap up the demo. Emphasize that Signet is ready for integration today, bringing transparency back to the digital world. Thank the audience for their time. Aim for about 30 seconds of speaking.`;
          }
          sessionRef.current.sendClientContent({ turns: [{ role: 'user', parts: [{ text: prompt }] }], turnComplete: true });
        } catch (err) {
          console.error("Failed to send step prompt:", err);
        }
      }
    };

    window.addEventListener('signet:start-demo', handleStartDemo);
    window.addEventListener('signet:narrate-step', handleNarrateStep);
    return () => {
      window.removeEventListener('signet:start-demo', handleStartDemo);
      window.removeEventListener('signet:narrate-step', handleNarrateStep);
    };
  }, [status]);

  // Robust Key Retrieval
  const getApiKey = () => {
    try {
      const viteLiveKey = import.meta.env.VITE_GEMINI_LIVE_API_KEY;
      if (viteLiveKey && !viteLiveKey.includes('UNUSED')) {
        return viteLiveKey;
      }
      const liveKey = process.env.VITE_GEMINI_LIVE_API_KEY;
      if (liveKey && !liveKey.includes('UNUSED')) {
        return liveKey;
      }
      const userKey = process.env.API_KEY;
      if (userKey && !userKey.includes('UNUSED')) {
        return userKey;
      }
      const envKey = process.env.GEMINI_API_KEY;
      if (envKey && !envKey.includes('UNUSED')) {
        return envKey;
      }
    } catch (e) {
      // Ignore process is not defined error
    }
    if (GOOGLE_GEMINI_LIVE_KEY && !GOOGLE_GEMINI_LIVE_KEY.includes('UNUSED')) {
      return GOOGLE_GEMINI_LIVE_KEY;
    }
    if (GOOGLE_GEMINI_KEY && !GOOGLE_GEMINI_KEY.includes('UNUSED')) {
      return GOOGLE_GEMINI_KEY;
    }
    console.warn("LiveAssistant: No valid API Key found.");
    return '';
  };

  const cleanupAudio = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close?.(); } catch(e) {}
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close().catch(() => {});
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      for (const source of audioSourcesRef.current) {
        try { source.stop(); } catch(e) {}
      }
      audioSourcesRef.current.clear();
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    if (speakingTimeoutRef.current) {
      window.clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: false } }));
    setStatus('OFFLINE');
    setVolume(0);
    nextStartTimeRef.current = 0;
  };

  const handleAIGenerate = async (query: string) => {
    setIsGeneratingFromSearch(true);
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a 3D avatar configuration based on this search query: "${query}".
        Return ONLY a valid JSON object with these exact keys and appropriate values.
        String values must be chosen from the allowed options if applicable.
        Numeric values should be between 40 and 60.
        Colors should be hex codes.
        CRITICAL: Ensure high contrast between the background theme (bgTheme) and the skinColor/clothesColor. If the skin or clothes are dark, use a 'light' bgTheme. If they are light, use a 'dark' bgTheme.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gender: { type: Type.STRING, enum: ['male', 'female'], description: "The gender of the person" },
              age: { type: Type.NUMBER, description: "Age between 18 and 80" },
              skinColor: { type: Type.STRING, description: "Hex color code" },
              hairColor: { type: Type.STRING, description: "Hex color code" },
              eyeColor: { type: Type.STRING, description: "Hex color code" },
              hairStyle: { type: Type.STRING, enum: ['short', 'long', 'bald', 'curly', 'buzzcut', 'dreadlocks', 'mohawk', 'spiky', 'wavy', 'bun', 'ponytail', 'fade', 'afro'] },
              eyeStyle: { type: Type.STRING, enum: ['normal', 'glasses', 'sunglasses'] },
              noseStyle: { type: Type.STRING, enum: ['small', 'wide', 'pointed', 'button', 'aquiline', 'snub', 'roman', 'flat', 'broad', 'thin'] },
              mouthStyle: { type: Type.STRING, enum: ['smile', 'neutral', 'sad', 'smirk', 'open', 'surprised', 'pout', 'laugh', 'thin', 'wide'] },
              clothesStyle: { type: Type.STRING, enum: ['tshirt', 'suit', 'hoodie', 'sweater', 'jacket', 'tanktop', 'dress', 'shirt', 'turtleneck', 'vneck', 'doctor', 'chef', 'police', 'astronaut', 'construction', 'ninja', 'wizard', 'cyberpunk', 'sports', 'military', 'royal', 'farmer', 'kimono', 'hanfu', 'sari', 'dashiki', 'poncho', 'qipao', 'dirndl', 'kilt'] },
              clothesColor: { type: Type.STRING, description: "Hex color code" },
              bgTheme: { type: Type.STRING, enum: ['light', 'dark', 'gradient', 'neon'] },
              headwear: { type: Type.STRING, enum: ['none', 'cap', 'beanie', 'hijab', 'turban', 'sombrero', 'conical', 'crown', 'cowboy', 'headband'] },
              facialHairStyle: { type: Type.STRING, enum: ['none', 'stubble', 'mustache', 'beard', 'goatee'] },
              facialHairColor: { type: Type.STRING, description: "Hex color code" },
              faceWidth: { type: Type.NUMBER, description: "40 to 60" },
              eyeSize: { type: Type.NUMBER, description: "40 to 60" },
              eyeAngle: { type: Type.NUMBER, description: "40 to 60" },
              eyeDistance: { type: Type.NUMBER, description: "40 to 60" },
              eyelidHeight: { type: Type.NUMBER, description: "40 to 60" },
              upperLashes: { type: Type.STRING, enum: ['none', 'short', 'long', 'thick'] },
              lowerLashes: { type: Type.STRING, enum: ['none', 'short', 'long'] },
              noseWidth: { type: Type.NUMBER, description: "40 to 60" },
              noseHeight: { type: Type.NUMBER, description: "40 to 60" },
              noseAngle: { type: Type.NUMBER, description: "40 to 60" },
              noseTipSize: { type: Type.NUMBER, description: "40 to 60" },
              mouthFullness: { type: Type.NUMBER, description: "40 to 60" },
              mouthWidth: { type: Type.NUMBER, description: "40 to 60" },
              mouthHeight: { type: Type.NUMBER, description: "40 to 60" }
            },
            required: ["gender", "age", "skinColor", "hairColor", "eyeColor", "hairStyle", "eyeStyle", "noseStyle", "mouthStyle", "clothesStyle", "clothesColor", "bgTheme", "headwear", "facialHairStyle", "facialHairColor", "faceWidth", "eyeSize", "eyeAngle", "eyeDistance", "eyelidHeight", "upperLashes", "lowerLashes", "noseWidth", "noseHeight", "noseAngle", "noseTipSize", "mouthFullness", "mouthWidth", "mouthHeight"]
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      const newAvatar: SavedAvatarConfig = {
        ...data,
        id: 'ai-generated',
        name: 'AI Generated',
        voice: data.gender === 'female' ? 'Zephyr' : 'Puck',
        lastModified: Date.now()
      };
      setCustomAvatar(newAvatar);
      setSelectedVoice(newAvatar.voice || 'Zephyr');
      setPresetSearch('');
      setShowSettings(false);
    } catch (e) {
      console.error("Failed to generate avatar from search:", e);
    } finally {
      setIsGeneratingFromSearch(false);
    }
  };

  const initVoiceChat = async () => {
    if (status !== 'OFFLINE') {
      cleanupAudio();
      return;
    }

    setStatus('CONNECTING');

    // 1. Setup Audio Contexts
    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    inputAudioContextRef.current.resume();
    outputAudioContextRef.current.resume();
    
    // 2. Resolve API Key selection (Race condition handling)
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      // Per instructions: assume selection successful after trigger and proceed
      (window as any).aistudio?.openSelectKey();
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Config Error:** No valid API Key found. Please check .env or environment variables for VITE_GEMINI_LIVE_API_KEY or GEMINI_API_KEY." }]);
      return;
    }

    // Always create new instance for the most up-to-date key
    const ai = new GoogleGenAI({ apiKey });

    try {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: false 
        });
      } catch (mediaErr) {
        console.warn("Microphone access denied or unavailable. Connecting without audio input.", mediaErr);
        setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Microphone Error:** Access denied or unavailable. I cannot hear you. If you are in the preview, try opening the app in a new tab." }]);
        // We will proceed without streamRef.current
      }
      
      const actualVoiceName = selectedVoice.split('-')[0];
      const isChinese = selectedVoice.endsWith('-CN');

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            
            if (streamRef.current) {
              const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
              const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Volume visualization
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                setVolume(Math.sqrt(sum / inputData.length));

                // PCM Blob preparation
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                // Rely solely on sessionPromise to prevent stale closure issues
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                }).catch(() => {});
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);
              
              if (!pendingDemoNarrate.current) {
                sessionPromise.then(session => {
                  session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: "Hello. Please introduce yourself briefly as Signet-Alpha, the Live Digital Notary, and ask how you can help the user today." }] }], turnComplete: true });
                }).catch(() => {});
              }
            } else if (!pendingDemoNarrate.current) {
              // Fallback prompt if mic failed and it's not a demo narration
              try {
                sessionPromise.then(session => {
                  session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: "Hello. Please tell the user that you are connected, but you cannot hear them because microphone access was denied. Ask them to open the app in a new tab if they want to use voice chat." }] }], turnComplete: true });
                });
              } catch (err) {
                console.error("Failed to send fallback prompt:", err);
              }
            }

            if (pendingDemoNarrate.current) {
              pendingDemoNarrate.current = false;
              sessionPromise.then(session => {
                session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: "I just started the demo notebook manually. Please provide a 1-minute introduction summarizing the key of the project, addressing the hackathon requirements (Live Agent, Gemini Live API, Google Cloud). Then, explain Stage 1: Sovereign Identity Initialization. Do NOT explain the other stages yet. I will prompt you when the UI advances to the next stage." }] }], turnComplete: true });
              }).catch(() => {});
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            // 1. Process Transcriptions
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
              setStreamingOutput(currentOutputTranscription.current);
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
              setStreamingInput(currentInputTranscription.current);
            }

            // 2. Handle Turn Completion (Capture local variables to avoid async loss)
            if (message.serverContent?.turnComplete) {
              const fullInput = currentInputTranscription.current;
              const fullOutput = currentOutputTranscription.current;
              
              if (fullInput || fullOutput) {
                setMessages(prev => {
                  const next = [...prev];
                  if (fullInput) next.push({ role: 'user', text: fullInput });
                  if (fullOutput) next.push({ role: 'assistant', text: fullOutput });
                  return next;
                });
              }
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
              setStreamingInput('');
              setStreamingOutput('');
            }

            // 3. Process Model Audio Output
            const audioParts = message.serverContent?.modelTurn?.parts;
            if (audioParts) {
              for (const part of audioParts) {
                const base64Audio = part.inlineData?.data;
                if (base64Audio && outputAudioContextRef.current) {
                  window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: true } }));
                  if (speakingTimeoutRef.current) {
                    window.clearTimeout(speakingTimeoutRef.current);
                    speakingTimeoutRef.current = null;
                  }

                  try {
                    const ctx = outputAudioContextRef.current;
                    if (ctx.state === 'suspended') {
                      await ctx.resume();
                    }
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                    
                    const audioBuffer = decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(ctx.destination);
                    source.addEventListener('ended', () => {
                      audioSourcesRef.current.delete(source);
                      if (audioSourcesRef.current.size === 0) {
                        speakingTimeoutRef.current = window.setTimeout(() => {
                          if (audioSourcesRef.current.size === 0) {
                            window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: false } }));
                          }
                        }, 3000); // 3.0s debounce to allow for network gaps between chunks and natural pauses
                      }
                    });
                    
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    audioSourcesRef.current.add(source);
                  } catch (audioErr) {
                    console.error("Failed to decode or play audio chunk:", audioErr);
                  }
                }
              }
            }

            // 4. Handle Interruptions
            if (message.serverContent?.interrupted) {
              for (const s of audioSourcesRef.current) {
                try { s.stop(); } catch(e) {}
              }
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: false } }));
            }

            // 5. Handle Function Calls
            const functionParts = message.serverContent?.modelTurn?.parts;
            if (functionParts) {
              for (const part of functionParts) {
                if (part.functionCall) {
                  const call = part.functionCall;
                  let result = "";
                  
                  if (call.name === "triggerUniversalSigner") {
                    setMessages(prev => [...prev, { role: 'assistant', text: `⚙️ **Action:** Triggering Universal Signer for ${call.args?.fileName || 'document'}...` }]);
                    result = "Universal Signer triggered successfully. Waiting for user to confirm.";
                  } else if (call.name === "runDiffEngine") {
                    setMessages(prev => [...prev, { role: 'assistant', text: `⚙️ **Action:** Running ${call.args?.mediaType || 'media'} Diff Engine...` }]);
                    result = "Diff Engine analysis complete. No tampering detected. Media is authentic.";
                  } else if (call.name === "startSelfDemo") {
                    setMessages(prev => [...prev, { role: 'assistant', text: `⚙️ **Action:** Opening Demo Notebook...` }]);
                    window.location.hash = '#demo';
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('signet:start-demo', { detail: { fromAgent: true } }));
                    }, 500);
                    result = "Demo Notebook opened. The UI will advance automatically. Please provide a 1-minute introduction summarizing the key of the project, addressing the hackathon requirements (Live Agent, Gemini Live API, Google Cloud). Then, explain Stage 1: Sovereign Identity Initialization. Do NOT explain the other stages yet. I will prompt you when the UI advances to the next stage.";
                  } else if (call.name === "setDemoStep") {
                    const stepNum = call.args?.stepNumber;
                    setMessages(prev => [...prev, { role: 'assistant', text: `⚙️ **Action:** Advancing to Step ${stepNum}...` }]);
                    window.dispatchEvent(new CustomEvent('signet:set-step', { detail: { step: stepNum } }));
                    result = `Step ${stepNum} is now visible on screen. Please explain it, and then immediately call setDemoStep for the next step without waiting for user input.`;
                  }

                  if (result && sessionRef.current) {
                    sessionRef.current.sendToolResponse({
                      functionResponses: [{
                        name: call.name,
                        id: call.id,
                        response: { result }
                      }]
                    });
                  }
                }
              }
            }
          },
          onerror: (e: any) => {
            console.error('Signet Live Error:', e);
            if (e.message?.includes('Requested entity was not found')) {
              setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Auth Fault:** API Key requires re-verification. Please re-select via the mic button." }]);
              (window as any).aistudio?.openSelectKey();
            } else {
              setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ **Sync Error:** ${e.message || 'Logic drift detected'}` }]);
            }
            cleanupAudio();
          },
          onclose: () => cleanupAudio()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: actualVoiceName } },
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are ${customAvatar ? customAvatar.name : 'Signet-Alpha'}, the Live Digital Notary for Signet Protocol.${isChinese ? '\n\nCRITICAL: You MUST speak ONLY in Chinese (Mandarin). All your responses must be in Chinese.' : ''}
          Your role is to guide users through verifying and signing digital media (images, videos, documents).
          
          CAPABILITIES:
          - You have access to the Image Diff Engine and Video Diff Engine.
          - You can help users detect deepfakes, tampering, or synthetic alterations.
          - You guide users through the Universal Media Signing process.
          - You explain cryptographic concepts (like dual-hashing and Public/Private keys) simply and clearly.
          - If the user asks for a demo, you MUST call the "startSelfDemo" tool. This will open the Demo Notebook page. You should then narrate the 6 stages: 1. Sovereign Identity Initialization, 2. Universal Media Signing, 3. Public Ledger Verification, 4. Image Forensic Diff Analysis, 5. Video Authenticity Verification, 6. Conclusion & Future Outlook. The UI will advance automatically, and you will receive a prompt when it's time to explain the next stage. Do NOT explain all stages at once. Wait for the prompt for each stage. Do NOT call the setDemoStep tool during the automated demo unless the user explicitly asks you to skip to a specific stage.
          
          IDENTITY RECOGNITION:
          Master Signatory is signetai.io:ssl.
          
          V0.4.0 KEY SPECIFICS:
          - Universal Tail-Wrap (UTW) for binary provenance.
          - Zero-Copy Streaming Engine for large files.
          - 264-bit entropy required for Sovereign Grade.
          - C2PA 2.3 JUMBF alignment.
          
          Respond conversationally, with technical precision, but keep it accessible. If interrupted, stop and address the user's immediate question.`,
          tools: [{
            functionDeclarations: [
              {
                name: "triggerUniversalSigner",
                description: "Trigger the Universal Media Signing process for a document or media file.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    fileName: { type: Type.STRING, description: "The name of the file being signed." }
                  },
                  required: ["fileName"]
                }
              },
              {
                name: "runDiffEngine",
                description: "Run the Image or Video Diff Engine to detect deepfakes or tampering.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    mediaType: { type: Type.STRING, description: "Type of media: 'image' or 'video'" }
                  },
                  required: ["mediaType"]
                }
              },
              {
                name: "startSelfDemo",
                description: "Start the automated self-demo sequence. Call this when the user asks for a demo.",
              },
              {
                name: "setDemoStep",
                description: "Advance the demo to a specific step (1 to 6). Call this right before you start explaining that step.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.NUMBER, description: "The step number to display (1 to 5)" }
                  },
                  required: ["stepNumber"]
                }
              }
            ]
          }]
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Session failed:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **System Offline:** Handshake failed." }]);
      cleanupAudio();
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      {!isOpen ? (
        <button onClick={() => {
          setIsOpen(true);
          if (status === 'OFFLINE') {
            initVoiceChat();
          }
        }} className="flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      ) : (
        <div className={`w-96 md:w-[450px] ${isMinimized ? 'h-auto' : 'h-[85vh] min-h-[600px] min-w-[350px] max-w-[100vw] max-h-[100vh] resize overflow-hidden'} bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col animate-in slide-in-from-bottom-4 transition-all duration-300`}>
          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-blue-500' : status === 'CONNECTING' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                {status === 'CONNECTED' && <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-header)] leading-none">
                  {customAvatar ? customAvatar.name : 'Signet-Alpha'}
                </span>
                <div className="flex gap-0.5 mt-1 h-2 items-end">
                  {status === 'CONNECTED' ? (
                    [1,2,3,4,5].map(i => (
                      <div 
                        key={i} 
                        className="w-1 bg-blue-500 transition-all duration-75" 
                        style={{ height: `${Math.max(20, volume * 500 * (0.8 + Math.random() * 0.4))}%` }}
                      ></div>
                    ))
                  ) : (
                    <span className="font-mono text-[7px] opacity-40 uppercase tracking-tighter">
                      {status === 'CONNECTING' ? 'Syncing...' : 'Ready'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <select 
                value={selectedVoice} 
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="text-[10px] bg-transparent border border-[var(--border-light)] rounded px-1 py-1 text-[var(--text-header)] outline-none cursor-pointer"
                disabled={status !== 'OFFLINE'}
                title="Select Voice (Disconnect to change)"
              >
                <option value="Zephyr">Zephyr (Female)</option>
                <option value="Kore">Kore (Female)</option>
                <option value="Puck">Puck (Male)</option>
                <option value="Charon">Charon (Male)</option>
                <option value="Fenrir">Fenrir (Male)</option>
                <option value="Zephyr-CN">Zephyr (Female - Chinese)</option>
                <option value="Fenrir-CN">Fenrir (Male - Chinese)</option>
              </select>
              <button 
                onClick={initVoiceChat} 
                className={`p-2 rounded transition-colors ${status !== 'OFFLINE' ? 'bg-red-500 text-white shadow-inner' : 'text-[var(--trust-blue)] hover:bg-blue-50'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className="opacity-40 hover:opacity-100 p-2" title="Settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </button>
              <button onClick={() => setIsMinimized(!isMinimized)} className="opacity-40 hover:opacity-100 p-2">
                {isMinimized ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                )}
              </button>
              <button onClick={() => { setIsOpen(false); setIsMinimized(false); }} className="opacity-40 hover:opacity-100 p-2">✕</button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {showSettings && (
                <div className="p-4 bg-[var(--bg-standard)] border-b border-[var(--border-light)] shrink-0 max-h-[400px] overflow-y-auto flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-body)] opacity-60">Select Avatar</h4>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex bg-[var(--bg-sidebar)] p-1 rounded-md border border-[var(--border-light)]">
                      {(['all', 'female', 'male'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setPresetTab(tab)}
                          className={`flex-1 px-2 py-1 text-[10px] font-medium rounded capitalize transition-all ${presetTab === tab ? 'bg-[var(--trust-blue)] text-white shadow-sm' : 'text-[var(--text-body)] hover:bg-[var(--bg-standard)] opacity-70 hover:opacity-100'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <div className="relative w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-body)] opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={presetSearch}
                          onChange={(e) => setPresetSearch(e.target.value)}
                          className="w-full pl-7 pr-2 py-1 text-[10px] bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-[var(--text-body)] focus:outline-none focus:ring-1 focus:ring-[var(--trust-blue)]"
                        />
                      </div>
                      <button 
                        onClick={() => setShowSearchHelp(!showSearchHelp)}
                        className="p-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md hover:bg-[var(--bg-standard)] transition-colors text-[var(--text-body)] opacity-70 hover:opacity-100"
                        title="Search Usage Manual"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                      </button>
                    </div>
                  </div>

                  {showSearchHelp && (
                    <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md p-2 text-[10px] text-[var(--text-body)] animate-in fade-in slide-in-from-top-1 max-h-[60vh] overflow-y-auto">
                      <strong className="block text-[var(--trust-blue)] mb-1">How to Search</strong>
                      <ul className="list-disc pl-3 opacity-80 space-y-1">
                        <li>Names: "Emm" (matches Emma)</li>
                        <li>Careers: "engineer", "doctor"</li>
                        <li>Hobbies: "cooking", "runner"</li>
                        <li>Features: "glasses", "beard"</li>
                      </ul>
                      <p className="mt-2 opacity-80 mb-3">If no results match, click "Generate with AI" to create one instantly!</p>
                      
                      <div className="border-t border-[var(--border-light)] pt-2">
                        <strong className="block text-[var(--trust-blue)] mb-1">Programmatic API</strong>
                        <p className="opacity-80 mb-2">Supported values for <code>&lt;CustomAvatar3D /&gt;</code>:</p>
                        <div className="space-y-1 opacity-80">
                          <p><span className="font-semibold">hairStyle:</span> 'short'|'long'|'bald'|'curly'|'buzzcut'|'dreadlocks'|'mohawk'|'spiky'|'wavy'|'bun'|'ponytail'|'fade'|'afro'</p>
                          <p><span className="font-semibold">eyeStyle:</span> 'normal'|'glasses'|'sunglasses'</p>
                          <p><span className="font-semibold">noseStyle:</span> 'small'|'wide'|'pointed'|'button'|'aquiline'|'snub'|'roman'|'flat'|'broad'|'thin'</p>
                          <p><span className="font-semibold">mouthStyle:</span> 'smile'|'neutral'|'sad'|'smirk'|'open'|'surprised'|'pout'|'laugh'|'thin'|'wide'</p>
                          <p><span className="font-semibold">clothesStyle:</span> 'tshirt'|'suit'|'hoodie'|'sweater'|'jacket'|'tanktop'|'dress'|'shirt'|'turtleneck'|'vneck'|'doctor'|'chef'|'police'|'astronaut'|'construction'|'ninja'|'wizard'|'cyberpunk'|'sports'|'military'|'royal'|'farmer'|'kimono'|'hanfu'|'sari'|'dashiki'|'poncho'|'qipao'|'dirndl'|'kilt'</p>
                          <p><span className="font-semibold">headwear:</span> 'none'|'cap'|'beanie'|'hijab'|'turban'|'sombrero'|'conical'|'crown'|'cowboy'|'headband'</p>
                          <p><span className="font-semibold">facialHairStyle:</span> 'none'|'stubble'|'mustache'|'beard'|'goatee'</p>
                          <p><span className="font-semibold">bgTheme:</span> 'light'|'dark'|'gradient'|'neon'</p>
                          <p><span className="font-semibold">Colors:</span> hairColor, skinColor, eyeColor, clothesColor, facialHairColor</p>
                          <p><span className="font-semibold">Numeric (0-100):</span> faceWidth, eyeSize, eyeAngle, eyeDistance, eyelidHeight, noseWidth, noseHeight, noseAngle, noseTipSize, mouthFullness, mouthWidth, mouthHeight</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-4 p-2">
                    {(() => {
                      const filteredAvatars = avatars.filter(avatar => {
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
                          <div className="col-span-4 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[var(--border-light)] rounded-lg">
                            <p className="text-[10px] text-[var(--text-body)] opacity-70 mb-3">
                              No avatars found for "{presetSearch}".
                            </p>
                            <button
                              onClick={() => handleAIGenerate(presetSearch)}
                              disabled={isGeneratingFromSearch}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--trust-blue)] text-white text-[10px] font-medium rounded-md hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isGeneratingFromSearch ? (
                                <>
                                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                                  Generate AI Avatar
                                </>
                              )}
                            </button>
                          </div>
                        );
                      }

                      return filteredAvatars.map((avatar: AvatarConfig) => (
                        <button 
                          key={avatar.id}
                          onClick={() => {
                            setSelectedAvatarId(avatar.id);
                            setCustomAvatar(null);
                            if (avatar.gender === 'female') {
                              if (!selectedVoice.includes('Zephyr') && !selectedVoice.includes('Kore')) {
                                setSelectedVoice('Zephyr');
                              }
                            } else {
                              if (!selectedVoice.includes('Puck') && !selectedVoice.includes('Charon') && !selectedVoice.includes('Fenrir')) {
                                setSelectedVoice('Puck');
                              }
                            }
                          }}
                          className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all group ${selectedAvatarId === avatar.id ? 'border-[var(--trust-blue)] shadow-[0_0_15px_rgba(0,85,255,0.4)] scale-105' : 'border-transparent hover:border-[var(--border-light)] hover:scale-105'}`}
                          title={avatar.name || `${avatar.gender === 'female' ? 'Female' : 'Male'} ${avatar.id.replace(/[a-z]/g, '')}`}
                        >
                          <div className="w-full h-full pointer-events-none flex items-center justify-center">
                            <CustomAvatar3D {...avatar} isSpeaking={false} />
                          </div>
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}
              {status !== 'OFFLINE' && (
                <div className="flex flex-col items-center justify-center py-6 border-b border-[var(--border-light)] bg-[var(--bg-standard)] shrink-0 relative overflow-hidden">
                  {isAgentSpeaking && <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>}
                  
                  <div className={`relative w-24 h-24 rounded-full flex items-center justify-center bg-[var(--code-bg)] border-2 transition-all duration-300 z-10 ${isAgentSpeaking ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110' : 'border-[var(--border-light)]'}`}>
                    {isAgentSpeaking && (
                      <>
                        <div className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-20 duration-1000"></div>
                        <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-10 duration-700 delay-150"></div>
                      </>
                    )}
                    {customAvatar ? (
                      <CustomAvatar3D {...customAvatar} isSpeaking={isAgentSpeaking} />
                    ) : (
                      <CustomAvatar3D {...(avatars.find(a => a.id === selectedAvatarId) || avatars[0])} isSpeaking={isAgentSpeaking} />
                    )}
                  </div>
                  <span className={`mt-4 text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 z-10 ${isAgentSpeaking ? 'text-blue-500 font-bold' : 'text-slate-500'}`}>
                    {isAgentSpeaking ? `${customAvatar ? customAvatar.name : (avatars.find(a => a.id === selectedAvatarId)?.name || 'Signet-Alpha')} Speaking...` : 'Listening...'}
                  </span>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--code-bg)]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-lg text-sm shadow-sm ${m.role === 'user' ? 'bg-[var(--trust-blue)] text-white shadow-blue-500/20' : 'bg-white border border-[var(--border-light)]'}`}>
                      <div className="prose-signet">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {streamingInput && (
                  <div className="flex justify-end">
                    <div className="max-w-[90%] p-4 rounded-lg text-sm shadow-sm bg-[var(--trust-blue)] text-white shadow-blue-500/20 opacity-70">
                      <div className="prose-signet">
                        <ReactMarkdown>{streamingInput}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                
                {streamingOutput && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%] p-4 rounded-lg text-sm shadow-sm bg-white border border-[var(--border-light)] opacity-70">
                      <div className="prose-signet">
                        <ReactMarkdown>{streamingOutput}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {status !== 'OFFLINE' && (
                <div className={`px-4 py-2 border-t flex justify-between items-center ${status === 'CONNECTED' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
                   <p className={`font-mono text-[8px] uppercase tracking-widest font-bold flex items-center gap-2 ${status === 'CONNECTED' ? 'text-blue-600' : 'text-amber-600'}`}>
                     <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'CONNECTED' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                     {status === 'CONNECTED' ? 'Neural Link: Deterministic' : 'Establishing Handshake...'}
                   </p>
                   <span className="font-mono text-[7px] opacity-40 uppercase tracking-widest font-bold">HEARTBEAT_SYNC</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
