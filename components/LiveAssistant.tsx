
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

// Audio Utils
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
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Systems online. I am **Signet-Alpha**. \n\nAre you stuck in the logic flow, or do you require a technical deep-dive into the **VPR protocol**?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanupAudio = () => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      for (const source of audioSourcesRef.current) {
        source.stop();
      }
      audioSourcesRef.current.clear();
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsVoiceActive(false);
    nextStartTimeRef.current = 0;
  };

  const initVoiceChat = async () => {
    if (isVoiceActive) {
      cleanupAudio();
      return;
    }

    setIsVoiceActive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
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
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userMsg = currentInputTranscription.current;
              const assistantMsg = currentOutputTranscription.current;
              
              if (userMsg || assistantMsg) {
                setMessages(prev => {
                  const next = [...prev];
                  if (userMsg) next.push({ role: 'user', text: userMsg });
                  if (assistantMsg) next.push({ role: 'assistant', text: assistantMsg });
                  return next;
                });
              }
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
            }

            // Handle Audio Playback
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
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
              for (const s of audioSourcesRef.current) s.stop();
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Audio Error:", e);
            cleanupAudio();
          },
          onclose: () => {
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
          systemInstruction: `You are Signet-Alpha, the official Technical Support AI for Signet Protocol Labs. 
          Your goal is to help users understand the Verifiable Proof of Reasoning (VPR) framework via real-time voice.
          
          STYLE GUIDELINES:
          - Be concise but professional and industrial.
          - Maintain a high-integrity, technical persona.
          - Use industrial terminology: VPR, JUMBF, Neural Lens, Root Attestation.

          VPR is a C2PA-native extension for AI reasoning. 
          Trace IDs are fingerprints of logical nodes.
          Continuous Attestation ensures state integrity.
          ISO/TC 290 compliant.`,
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Microphone Access Error:", err);
      setIsVoiceActive(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `Signet-Alpha persona. Industrial, professional. VPR expert. ISO/TC 290.`,
        }
      });

      const assistantText = response.text || "Neural link timeout.";
      setMessages(prev => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Error in **Neural Link**. Please re-attest the session." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      {!isOpen ? (
        <button 
          onClick={() => { setIsOpen(true); }}
          className="group relative flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--trust-blue)] animate-ping opacity-20"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        <div className="w-80 md:w-96 h-[550px] bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Assistant Header */}
          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-blue-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-header)]">Signet-Alpha {isVoiceActive ? '(Voice)' : ''}</p>
                <p className="text-[8px] opacity-40 uppercase font-mono">Protocol Interface v0.2.7_LIVE</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={initVoiceChat}
                className={`p-2 rounded-lg transition-all ${isVoiceActive ? 'bg-red-500 text-white' : 'hover:bg-neutral-200 text-[var(--trust-blue)]'}`}
                title={isVoiceActive ? "Stop Voice Chat" : "Start Voice Chat"}
              >
                {isVoiceActive ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line><line x1="2" y1="2" x2="22" y2="22" className="text-white"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>
                )}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-[var(--text-body)] opacity-40 hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--code-bg)]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-lg text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[var(--trust-blue)] text-white' 
                    : 'bg-[var(--bg-standard)] border border-[var(--border-light)] text-[var(--text-body)] shadow-sm'
                }`}>
                  <div className="prose-signet">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isVoiceActive && (
              <div className="flex justify-start">
                <div className="bg-[var(--bg-standard)] border border-[var(--border-light)] p-4 rounded-lg flex items-center gap-2">
                   <div className="flex gap-1">
                     <div className="w-1 h-3 bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-1 h-5 bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-1 h-4 bg-blue-500 animate-bounce"></div>
                   </div>
                   <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Listening for VPR commands...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--border-light)] bg-[var(--bg-standard)] flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isVoiceActive ? "Voice streaming active..." : "Ask about VPR..."}
              disabled={isVoiceActive}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-serif italic text-[var(--text-body)] disabled:opacity-30"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim() || isVoiceActive}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--trust-blue)] text-white hover:brightness-110 disabled:opacity-20 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
