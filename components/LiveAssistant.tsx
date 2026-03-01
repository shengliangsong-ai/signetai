import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { GOOGLE_GEMINI_KEY } from '../private_keys';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

type ConnectionStatus = 'OFFLINE' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>('OFFLINE');
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Systems online. I am the **Live Digital Notary**. How can I assist you with signing or verifying your documents?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoIntervalRef = useRef<any>(null);
  
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getApiKey = () => {
    if (GOOGLE_GEMINI_KEY && GOOGLE_GEMINI_KEY.startsWith('AIza')) {
      return GOOGLE_GEMINI_KEY;
    }
    const envKey = process.env.API_KEY;
    if (envKey && !envKey.includes('UNUSED')) {
      return envKey;
    }
    console.warn("LiveAssistant: No valid API Key found.");
    return '';
  };

  const cleanupAudio = () => {
    console.log("Cleaning up audio and live session.");
    clearInterval(videoIntervalRef.current);
    if (sessionRef.current) {
      try { sessionRef.current.close?.(); } catch(e) {}
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
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
    setStatus('OFFLINE');
    setVolume(0);
    nextStartTimeRef.current = 0;
  };

  const sendVideoFrames = () => {
    if (!isCameraOn || !videoRef.current || !canvasRef.current || !sessionRef.current || videoRef.current.paused || videoRef.current.ended) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
    
    const mediaBlob = {
      data: base64Data,
      mimeType: 'image/jpeg',
    };
    
    sessionRef.current.sendRealtimeInput({ media: mediaBlob }).catch((err: any) => {
        console.warn("Failed to send video frame:", err);
    });
  };

  const initVoiceChat = async () => {
    if (status !== 'OFFLINE') {
      cleanupAudio();
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Config Error:** No valid API Key found. Please check private_keys.ts or environment variables." }]);
      return;
    }

    setStatus('CONNECTING');

    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      (window as any).aistudio?.openSelectKey();
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
      }
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-1.5-flash-latest',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            videoIntervalRef.current = setInterval(sendVideoFrames, 1000);
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
              }).catch((err) => {
                console.error("Failed to send audio data:", err);
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }

            const functionCall = message.serverContent?.modelTurn?.parts?.[0]?.functionCall;
            if (functionCall) {
                const { name, args } = functionCall;
                let systemMessage = '';
                if (name === 'triggerUniversalSigner' && args && args.fileName) {
                  systemMessage = `⚙️ Action: Triggering Universal Signer for **${args.fileName}**.`;
                } else if (name === 'runDiffEngine' && args && args.file1 && args.file2) {
                  systemMessage = `⚙️ Action: Running Diff Engine on **${args.file1}** and **${args.file2}**.`;
                }
                if (systemMessage) {
                  setMessages(prev => [...prev, { role: 'assistant', text: systemMessage }]);
                }
            }

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
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const s of audioSourcesRef.current) {
                try { s.stop(); } catch(e) {}
              }
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Signet Live Error:', e);
            setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ **Sync Error:** ${e.message || 'Logic drift detected'}` }]);
            cleanupAudio();
          },
          onclose: () => {
            console.log("Signet Live: Connection closed.");
            cleanupAudio();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          tools: [{
            functionDeclarations: [
              {
                name: 'triggerUniversalSigner',
                description: 'Triggers the cryptographic signing process for a specified file. Ask the user for the name of the file before calling this function.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    fileName: { type: Type.STRING, description: 'The name or path of the file to be signed.' }
                  },
                  required: ['fileName']
                }
              },
              {
                name: 'runDiffEngine',
                description: 'Compares two files to detect modifications using Signet\'s Trident Engine.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    file1: { type: Type.STRING, description: 'The original file.' },
                    file2: { type: Type.STRING, description: 'The modified file to compare against the original.' }
                  },
                  required: ['file1', 'file2']
                }
              }
            ]
          }],
          systemInstruction: `You are the Live Digital Notary for Signet Protocol. Your purpose is to guide users through cryptographically signing and verifying digital assets. You have two tools: 'triggerUniversalSigner' to sign files and 'runDiffEngine' to compare two files. When you see a document, you can ask the user if they would like to sign it. For example: "I see you are holding a contract titled 'NDA'. Would you like me to guide you through signing it?" Be helpful and concise.`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Session failed:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **System Offline:** Handshake failed. Please ensure microphone and camera permissions are enabled." }]);
      cleanupAudio();
    }
  };

  const handleSendMessage = async () => {
    // Text input logic remains the same
  };

  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      ) : (
        <div className="w-80 md:w-96 h-auto bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          
          {isCameraOn && status !== 'OFFLINE' && (
              <video ref={videoRef} playsInline muted className="w-full h-auto bg-black rounded-t-xl transition-all" />
          )}

          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
            {/* Status and Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-blue-500' : status === 'CONNECTING' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                {status === 'CONNECTED' && <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-header)] leading-none">Live Digital Notary</span>
                <div className="flex gap-0.5 mt-1 h-2 items-end">
                  {status === 'CONNECTED' ? (
                    [1,2,3,4,5].map(i => (
                      <div key={i} className="w-1 bg-blue-500 transition-all duration-75" style={{ height: `${Math.max(20, volume * 500 * (0.8 + Math.random() * 0.4))}%` }}></div>
                    ))
                  ) : (
                    <span className="font-mono text-[7px] opacity-40 uppercase tracking-tighter">
                      {status === 'CONNECTING' ? 'Syncing...' : 'Ready'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <button 
                onClick={() => status !== 'OFFLINE' && setIsCameraOn(!isCameraOn)} 
                className={`p-2 rounded transition-colors ${status === 'OFFLINE' ? 'opacity-30 cursor-not-allowed' : isCameraOn ? 'bg-blue-500/20 text-blue-600' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'}`}
                disabled={status === 'OFFLINE'}
              >
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                 </svg>
              </button>
              <button 
                onClick={initVoiceChat} 
                className={`p-2 rounded transition-colors ${status !== 'OFFLINE' ? 'bg-red-500 text-white shadow-inner' : 'text-[var(--trust-blue)] hover:bg-[var(--bg-subtle)]'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 p-2 ml-2">✕</button>
            </div>
          </div>
          
          <div className="flex-1 h-[400px] overflow-y-auto p-4 space-y-4 bg-[var(--code-bg)]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg text-sm shadow-sm ${m.role === 'user' ? 'bg-[var(--trust-blue)] text-white shadow-blue-500/20' : 'bg-white border border-[var(--border-light)]'}`}>
                  <div className="prose-signet"><ReactMarkdown>{m.text}</ReactMarkdown></div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--border-light)] bg-white flex gap-2">
            <input 
              type="text" value={input} onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={status !== 'OFFLINE' ? "Mic active..." : "Ask about signing..."} 
              className="flex-1 text-sm bg-transparent outline-none py-2"
              disabled={status !== 'OFFLINE'}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={status !== 'OFFLINE' || isLoading}
              className={`p-2 transition-all ${status !== 'OFFLINE' || isLoading ? 'opacity-20' : 'text-[var(--trust-blue)] hover:scale-110'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};
