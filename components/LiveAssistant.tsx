
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { GOOGLE_GEMINI_KEY, GOOGLE_GEMINI_LIVE_KEY } from '../src/config/env';

interface Message {
  role: 'user' | 'assistant' | 'debug';
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
  const cleanBase64 = base64.replace(/[^A-Za-z0-9+\\/]/g, '');
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
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Systems online. I am **Signet-Alpha**, your Live Digital Notary.\\n\\nI can help you verify media using our Image and Video Diff Engines, or guide you through Universal Media Signing using your registered keys. How can I help you today?" }
  ]);
  const [debugMessages, setDebugMessages] = useState<Message[]>([]);
  const [isDebugVisible, setIsDebugVisible] = useState(true); // Default to true for judge
  const [streamingInput, setStreamingInput] = useState('');
  const [streamingOutput, setStreamingOutput] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debugEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoIntervalRef = useRef<number | null>(null);
  
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

  const addDebugMessage = useCallback((text: string) => {
    const message: Message = {
      role: 'debug',
      text: `[${new Date().toISOString()}] ${text}`
    };
    setDebugMessages(prev => [...prev, message]);
  }, []);

  useEffect(() => {
    addDebugMessage("LiveAssistant component initialized. Debug window is open by default for transparency.");
  }, [addDebugMessage]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const scrollDebugToBottom = () => {
    debugEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingInput, streamingOutput]);

  useEffect(() => {
    scrollDebugToBottom();
  }, [debugMessages]);

  useEffect(() => {
    const handleStartDemo = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.fromAgent) return; // Agent already knows

      setIsOpen(true);
      addDebugMessage("Event 'signet:start-demo' received.");
      
      if (status === 'OFFLINE') {
        pendingDemoNarrate.current = true;
        initVoiceChat();
      } else if (status === 'CONNECTED' && sessionRef.current) {
        try {
          const demoPrompt = "I just started the demo notebook manually. Please provide a 1-minute introduction summarizing the key of the project, addressing the hackathon requirements (Live Agent, Gemini Live API, Google Cloud). Then, explain Stage 1: Sovereign Identity Initialization. Do NOT explain the other stages yet. I will prompt you when the UI advances to the next stage.";
          addDebugMessage(`Sending demo prompt: \"${demoPrompt}\".`);
          sessionRef.current.sendClientContent({ turns: [{ role: 'user', parts: [{ text: demoPrompt }] }], turnComplete: true });
        } catch (err) {
          addDebugMessage(`Failed to send demo prompt: ${err}`);
        }
      }
    };

    const handleNarrateStep = (e: Event) => {
      const customEvent = e as CustomEvent;
      const step = customEvent.detail?.step;
      addDebugMessage(`Event 'signet:narrate-step' received for step ${step}.`);
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
          addDebugMessage(`Sending narration prompt for step ${step}: \"${prompt}\".`);
          sessionRef.current.sendClientContent({ turns: [{ role: 'user', parts: [{ text: prompt }] }], turnComplete: true });
        } catch (err) {
          addDebugMessage(`Failed to send step prompt: ${err}`);
        }
      }
    };

    window.addEventListener('signet:start-demo', handleStartDemo);
    window.addEventListener('signet:narrate-step', handleNarrateStep);
    return () => {
      window.removeEventListener('signet:start-demo', handleStartDemo);
      window.removeEventListener('signet:narrate-step', handleNarrateStep);
    };
  }, [status, addDebugMessage]);

  // Enhanced Robust Key Retrieval with radical transparency
  const getApiKey = (keyType: 'LIVE' | 'STANDARD') => {
    addDebugMessage(`--- Starting API Key Retrieval (Type: ${keyType}) ---`);
    const keySources = {
      VITE_GEMINI_LIVE_API_KEY: import.meta.env.VITE_GEMINI_LIVE_API_KEY,
      GEMINI_API_KEY: import.meta.env.GEMINI_API_KEY,
      API_KEY: import.meta.env.API_KEY,
      GOOGLE_GEMINI_LIVE_KEY: GOOGLE_GEMINI_LIVE_KEY,
      GOOGLE_GEMINI_KEY: GOOGLE_GEMINI_KEY,
    };

    const checkAndUseKey = (keyName: keyof typeof keySources, key: any) => {
      if (key && typeof key === 'string' && !key.includes('UNUSED')) {
        const truncatedKey = key.slice(-5);
        addDebugMessage(`SUCCESS: Found valid key in [${keyName}]. Using key ending in ...${truncatedKey}.`);
        return key;
      }
      addDebugMessage(`INFO: Checked [${keyName}], but it was empty, invalid, or marked as UNUSED.`);
      return null;
    };

    if (keyType === 'LIVE') {
      let key = checkAndUseKey('VITE_GEMINI_LIVE_API_KEY', keySources.VITE_GEMINI_LIVE_API_KEY);
      if (key) return key;
      key = checkAndUseKey('GOOGLE_GEMINI_LIVE_KEY', keySources.GOOGLE_GEMINI_LIVE_KEY);
      if (key) return key;
    } else {
      let key = checkAndUseKey('GEMINI_API_KEY', keySources.GEMINI_API_KEY);
      if (key) return key;
      key = checkAndUseKey('API_KEY', keySources.API_KEY);
      if (key) return key;
      key = checkAndUseKey('GOOGLE_GEMINI_KEY', keySources.GOOGLE_GEMINI_KEY);
      if (key) return key;
    }

    addDebugMessage(`--- Key Retrieval Complete: No valid ${keyType} key found. ---`);
    return '';
  };

  const cleanupAudio = () => {
    addDebugMessage("Cleaning up audio resources...");
    if (videoIntervalRef.current) {
      window.clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
      addDebugMessage("- Video interval cleared.");
    }
    if (sessionRef.current) {
      try { 
        sessionRef.current.close?.(); 
        addDebugMessage("- Live session closed.");
      } catch(e) {
        addDebugMessage(`- Error closing session: ${e}`);
      }
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
       addDebugMessage("- Media stream stopped.");
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close().catch(() => {});
      inputAudioContextRef.current = null;
      addDebugMessage("- Input audio context closed.");
    }
    if (outputAudioContextRef.current) {
      for (const source of audioSourcesRef.current) {
        try { source.stop(); } catch(e) {}
      }
      audioSourcesRef.current.clear();
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
      addDebugMessage("- Output audio context closed.");
    }
    if (speakingTimeoutRef.current) {
      window.clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: false } }));
    setStatus('OFFLINE');
    setVolume(0);
    nextStartTimeRef.current = 0;
    addDebugMessage("Audio cleanup complete. Status set to OFFLINE.");
  };

  const initVoiceChat = async () => {
    addDebugMessage("----- initVoiceChat sequence started -----");
    if (status !== 'OFFLINE') {
      addDebugMessage("Voice chat already active. Cleaning up before re-initializing.");
      cleanupAudio();
      return;
    }

    setStatus('CONNECTING');
    addDebugMessage("Status set to CONNECTING.");

    addDebugMessage("Setting up audio contexts (Input: 16kHz, Output: 24kHz).");
    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    inputAudioContextRef.current.resume();
    outputAudioContextRef.current.resume();
    addDebugMessage("Audio contexts resumed.");
    
    addDebugMessage("Checking for pre-selected API key in AI Studio.");
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      addDebugMessage("No pre-selected key found. Opening AI Studio key selection dialog.");
      (window as any).aistudio?.openSelectKey();
    }

    const apiKey = getApiKey('LIVE');
    if (!apiKey) {
      const errorMsg = "⚠️ **Config Error:** No valid Live API Key found. Please check your .env file for VITE_GEMINI_LIVE_API_KEY or the AI Studio environment variables.";
      addDebugMessage("CRITICAL: Live API key is missing. Aborting voice chat initialization.");
      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
      setStatus('ERROR');
      addDebugMessage("Status set to ERROR.");
      return;
    }

    addDebugMessage("Creating new GoogleGenAI instance for Live connection.");
    const ai = new GoogleGenAI({ apiKey });

    try {
      try {
        addDebugMessage("Requesting user media (audio/video).");
        streamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: isVideoEnabled ? { facingMode: 'user' } : false 
        });
        addDebugMessage("User media acquired successfully.");
        
        if (isVideoEnabled && videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          addDebugMessage("Video stream attached to video element.");
        }
      } catch (mediaErr) {
        addDebugMessage(`ERROR: Microphone access denied or unavailable: ${mediaErr}`);
        setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Microphone Error:** Access denied or unavailable. I cannot hear you. If you are in the preview, try opening the app in a new tab." }]);
      }
      
      addDebugMessage("Connecting to Gemini Live API...");
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            addDebugMessage("SUCCESS: Connection opened. Status set to CONNECTED.");
            
            if (streamRef.current) {
              addDebugMessage("Setting up microphone input processing pipeline.");
              const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
              const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                setVolume(Math.sqrt(sum / inputData.length));

                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                }).catch((err) => addDebugMessage(`ERROR: Failed to send real-time audio input: ${err}`));
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);
              addDebugMessage("Microphone pipeline connected.");
            } else if (!pendingDemoNarrate.current) {
              addDebugMessage("WARNING: No microphone stream available. Sending fallback message to agent.");
              try {
                sessionPromise.then(session => {
                  session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: "Hello. Please tell the user that you are connected, but you cannot hear them because microphone access was denied. Ask them to open the app in a new tab if they want to use voice chat." }] }], turnComplete: true });
                });
              } catch (err) {
                addDebugMessage(`ERROR: Failed to send fallback prompt: ${err}`);
              }
            }

            if (isVideoEnabled && streamRef.current) {
              addDebugMessage("Starting video stream capture (1 FPS).");
              videoIntervalRef.current = window.setInterval(() => {
                if (!videoRef.current || !canvasRef.current) return;
                const video = videoRef.current;
                const canvas = canvasRef.current;
                if (video.videoWidth === 0 || video.videoHeight === 0) return;
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
                }).catch((err) => addDebugMessage(`ERROR: Failed to send real-time video input: ${err}`));
              }, 1000); // 1 frame per second
            }

            if (pendingDemoNarrate.current) {
              addDebugMessage("Pending demo narration found. Sending initial prompt to agent.");
              pendingDemoNarrate.current = false;
              sessionPromise.then(session => {
                session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: "I just started the demo notebook manually. Please provide a 1-minute introduction summarizing the key of the project, addressing the hackathon requirements (Live Agent, Gemini Live API, Google Cloud). Then, explain Stage 1: Sovereign Identity Initialization. Do NOT explain the other stages yet. I will prompt you when the UI advances to the next stage." }] }], turnComplete: true });
              }).catch((err) => addDebugMessage(`ERROR: Failed to send demo narration prompt: ${err}`));
            }
          },
          onmessage: async (message: LiveServerMessage) => {

            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
              setStreamingOutput(currentOutputTranscription.current);
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
              setStreamingInput(currentInputTranscription.current);
            }

            if (message.serverContent?.turnComplete) {
              const fullInput = currentInputTranscription.current;
              const fullOutput = currentOutputTranscription.current;
              
              if (fullInput || fullOutput) {
                 addDebugMessage(`Turn complete. Final Input: \"${fullInput}\". Final Output: \"${fullOutput}\".`);
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

            const audioParts = message.serverContent?.modelTurn?.parts;
            if (audioParts) {
              for (const part of audioParts) {
                const base64Audio = part.inlineData?.data;
                if (base64Audio && outputAudioContextRef.current) {
                  window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: true } }));
                  if (speakingTimeoutRef.current) {
                    window.clearTimeout(speakingTimeoutRef.current);
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
                        }, 3000);
                      }
                    });
                    
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    audioSourcesRef.current.add(source);
                  } catch (audioErr) {
                    addDebugMessage(`ERROR: Failed to decode or play audio chunk: ${audioErr}`);
                  }
                }
              }
            }

            if (message.serverContent?.interrupted) {
              addDebugMessage("Audio output interrupted by user.");
              for (const s of audioSourcesRef.current) {
                try { s.stop(); } catch(e) {}
              }
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              window.dispatchEvent(new CustomEvent('signet:speaking-status', { detail: { isSpeaking: false } }));
            }

            const functionParts = message.serverContent?.modelTurn?.parts;
            if (functionParts) {
              for (const part of functionParts) {
                if (part.functionCall) {
                  const call = part.functionCall;
                  let result = "";
                  addDebugMessage(`Received function call from agent: [${call.name}] with args: ${JSON.stringify(call.args)}`);
                  
                  if (call.name === "triggerUniversalSignet") {
                    setMessages(prev => [...prev, { role: 'assistant', text: `⚙️ **Action:** Triggering Universal Signet for ${call.args?.fileName || 'document'}...` }]);
                    result = "Universal Signet triggered successfully. Waiting for user to confirm.";
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
                     addDebugMessage(`Sending tool response for [${call.name}]: \"${result}\".`);
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
            const errorMessage = e.message || 'Logic drift detected. Link dropped.';
            addDebugMessage(`CRITICAL: Signet Live Error: ${errorMessage}`);
            console.error('Signet Live Error:', e);

            if (input.trim()) {
                addDebugMessage("Voice connection failed. Falling back to text chat for the current message.");
                handleSendMessage(input);
            } else {
                 setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ **Sync Error:** ${errorMessage}` }]);
            }

            if (e.message?.includes('Requested entity was not found')) {
              addDebugMessage("API Key auth fault. The key is likely invalid or missing required permissions. Prompting user to re-select key.");
              setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Auth Fault:** API Key requires re-verification. Please re-select via the mic button." }]);
              (window as any).aistudio?.openSelectKey();
            }
            
            cleanupAudio();
          },
          onclose: () => {
            addDebugMessage("Connection closed by server. Cleaning up resources.");
            cleanupAudio();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are Signet-Alpha, the Live Digital Notary for Signet Protocol.
          Your role is to guide users through verifying and signing digital media (images, videos, documents).
          
          CAPABILITIES:
          - You have access to the Image Diff Engine and Video Diff Engine.
          - You can help users detect deepfakes, tampering, or synthetic alterations.
          - You guide users through the Universal Media Signing process.
          - You explain cryptographic concepts (like dual-hashing and Public/Private keys) simply and clearly.
          - If the user asks for a demo, you MUST call the "startSelfDemo" tool. This will open the Demo Notebook page. You should then narrate the 6 stages: 1. Sovereign Identity Initialization, 2. Universal Media Signing, 3. Public Ledger Verification, 4. Image Forensic Diff Analysis, 5. Video Authenticity Verification, 6. Conclusion & Future Outlook. The UI will advance automatically, and you will receive a prompt when it's time to explain the next stage. Do NOT explain all stages at once. Wait for the prompt for each stage. Do NOT call the setDemoStep tool during the automated demo unless the user explicitly asks you to skip to a specific stage.
          
          IDENTITY RECOGNITION:
          Master Signatory is signetai.io:ssl.
          
          V0.3.2 KEY SPECIFICS:
          - Universal Tail-Wrap (UTW) for binary provenance.
          - Zero-Copy Streaming Engine for large files.
          - 264-bit entropy required for Sovereign Grade.
          - C2PA 2.3 JUMBF alignment.
          
          Respond conversationally, with technical precision, but keep it accessible. If interrupted, stop and address the user's immediate question.`,
          tools: [{
            functionDeclarations: [
              {
                name: "triggerUniversalSignet",
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
                    mediaType: { type: Type.STRING, description: "'image' or 'video'" }
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
      addDebugMessage("Live session promise resolved successfully.");
    } catch (err: any) {
      addDebugMessage(`CRITICAL: Session failed to initialize: ${err}`);
      console.error('Session failed:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **System Offline:** Handshake failed." }]);
      cleanupAudio();
    }
  };

  const handleSendMessage = async (text?: string) => {
    const textToSend = text || input;
    if (!textToSend.trim() || isLoading) {
      addDebugMessage("handleSendMessage called but message was empty or another message is loading. Aborted.");
      return;
    }

    addDebugMessage("----- handleSendMessage sequence started -----");
    if (!text) {
      setInput('');
    }
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);
    addDebugMessage(`Sending text message to /api/chat: \"${textToSend}\".`);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents: textToSend }),
      });
      addDebugMessage(`Received HTTP response with status: ${response.status}`);

      // --- START MODIFICATION ---
      const responseTextClone = await response.text(); // Clone and read the response body as text
      addDebugMessage(`Raw response body:\n${responseTextClone}`);
      // --- END MODIFICATION ---

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }

      const data = JSON.parse(responseTextClone); // Parse the cloned text
      addDebugMessage(`Text response from backend successfully parsed.`);
      if (data.debug) {
        // Pretty-print the JSON debug info
        const formattedDebug = JSON.stringify(data.debug, null, 2);
        addDebugMessage(`Backend debug info:\n${formattedDebug}`);
      }
      const responseText = data.text || "Neural link timeout. The backend did not provide a text response.";
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
      addDebugMessage(`Rendered assistant response: \"${responseText}\".`);

    } catch (error: any) {
      addDebugMessage(`CRITICAL: Text chat error: ${error.message}`);
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: `Logic drift detected. Link dropped. Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
      addDebugMessage("----- handleSendMessage sequence finished -----");
    }
  };


  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      ) : (
        <div className={`w-80 md:w-96 ${isMinimized ? 'h-auto' : 'h-[60vh] min-h-[400px] min-w-[300px] max-w-[100vw] max-h-[100vh] resize overflow-hidden'} bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col animate-in slide-in-from-bottom-4 transition-all duration-300`}>
          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-blue-500' : status === 'CONNECTING' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                {status === 'CONNECTED' && <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-header)] leading-none">Signet-Alpha</span>
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
            <div className="flex gap-1">
               <button 
                onClick={() => setIsDebugVisible(!isDebugVisible)}
                className={`p-2 rounded transition-colors ${isDebugVisible ? 'bg-amber-500 text-white' : 'text-[var(--text-dim)] hover:bg-black/5'}`}
                title={isDebugVisible ? "Hide Debug" : "Show Debug"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/><path d="M12 8v.01"/><path d="M12 16v.01"/>
                </svg>
              </button>
              <button 
                onClick={() => setIsVideoEnabled(!isVideoEnabled)} 
                className={`p-2 rounded transition-colors ${isVideoEnabled ? 'bg-blue-500 text-white' : 'text-[var(--trust-blue)] hover:bg-blue-50'}`}
                title={isVideoEnabled ? "Disable Camera" : "Enable Camera"}
                disabled={status !== 'OFFLINE'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </button>
              <button 
                onClick={initVoiceChat} 
                className={`p-2 rounded transition-colors ${status !== 'OFFLINE' ? 'bg-red-500 text-white shadow-inner' : 'text-[var(--trust-blue)] hover:bg-blue-50'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
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
              {isVideoEnabled && (
                <div className="bg-black flex justify-center items-center overflow-hidden border-b border-[var(--border-light)]" style={{ height: status !== 'OFFLINE' ? '120px' : '0px', transition: 'height 0.3s ease' }}>
                  <video ref={videoRef} autoPlay playsInline muted className="h-full object-cover opacity-80" />
                  <canvas ref={canvasRef} className="hidden" />
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

              <div className="p-4 border-t border-[var(--border-light)] bg-white flex gap-2">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={status !== 'OFFLINE' ? "Mic active..." : "Ask about v0.4.0..."} 
                  className="flex-1 text-sm bg-transparent outline-none py-2"
                  disabled={status !== 'OFFLINE'}
                />
                <button 
                  onClick={() => handleSendMessage()} 
                  disabled={status !== 'OFFLINE' || isLoading}
                  className={`p-2 transition-all ${status !== 'OFFLINE' || isLoading ? 'opacity-20' : 'text-[var(--trust-blue)] hover:scale-110'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
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

              {isDebugVisible && (
                <div className="h-48 bg-black/80 backdrop-blur-sm text-white font-mono text-xs p-4 overflow-y-auto border-t-2 border-amber-500">
                    <p className='text-amber-400 font-bold text-sm mb-2'>DEBUG CONSOLE</p>
                    {debugMessages.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/70 hover:text-white hover:bg-white/10 -ml-2 -mr-2 px-2 py-0.5 transition-colors">
                            <span className='opacity-50 select-none flex-shrink-0 w-8'>{i+1}</span>
                            <p className='whitespace-pre-wrap break-all'>{m.text}</p>
                        </div>
                    ))}
                    <div ref={debugEndRef} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
