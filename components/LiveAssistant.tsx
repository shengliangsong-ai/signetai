import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { GOOGLE_GEMINI_KEY } from '../private_keys.ts';
import { Notebook } from './Notebook';

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
    { role: 'assistant', text: "Systems online. I am **Signet-Alpha**, your Live Digital Notary.\n\nI can help you verify media using our Image and Video Diff Engines, or guide you through Universal Media Signing using your registered keys. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio & Session Refs
  const sessionRef = useRef<any>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
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

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Optionally select a voice
      const voices = window.speechSynthesis.getVoices();
      const desiredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
      if (desiredVoice) {
        utterance.voice = desiredVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech API not supported.");
    }
  };

  useEffect(() => {
    const handleSpeak = (e: CustomEvent) => {
      speak(e.detail.text);
    };
    // Ensure voices are loaded
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded, now safe to speak
      };
    }

    window.addEventListener('signet:speak', handleSpeak as EventListener);
    return () => {
      window.removeEventListener('signet:speak', handleSpeak as EventListener);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Robust Key Retrieval
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
    if (sessionRef.current) {
      try { sessionRef.current.close?.(); } catch(e) {}
      sessionRef.current = null;
    }
    sessionPromiseRef.current = null;
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
    setStatus('OFFLINE');
    setVolume(0);
    nextStartTimeRef.current = 0;
  };

  const initVoiceChat = async () => {
    // TEMPORARILY DISABLED PENDING API FIX
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: "🎙️ Voice chat is temporarily unavailable while we resolve the API configuration. Please use text chat for now."
    }]);
    return;
  };

  const handleSendMessage = async () => {
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    if (status !== 'OFFLINE') return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Config Error:** No valid API Key found." }]);
      return;
    }

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // --- NEW: Using Vertex AI via fetch ---
    const YOUR_PROJECT_ID = "signetai"; 
    const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
    const MODEL_ID = "gemini-1.0-pro";
    const url = `https://${API_ENDPOINT}/v1/projects/${YOUR_PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:streamGenerateContent`;

    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: textToSend }]
      }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey, // Correct header for API Key authentication
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Vertex AI API Error Body:", errorBody);
        const errorMessage = errorBody.error?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const responseText = await response.text();
      // The response from a streaming endpoint is a JSON array, often returned as a single string.
      const data = JSON.parse(responseText);
      
      let fullText = '';
      if (Array.isArray(data)) {
        for (const chunk of data) {
          const part = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (part) {
            fullText += part;
          }
        }
      }

      if (fullText) {
        setMessages(prev => [...prev, { role: 'assistant', text: fullText }]);
      } else {
        console.error("No text found in Vertex AI response", data);
        setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I received an empty response from the server." }]);
      }

    } catch (err: any) {
      console.error("Text chat failed (Vertex AI):", err);
       if (err.message.includes("does not have permission")) {
         setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Permission Denied:** Your API key may not have permission for Vertex AI. In the Google Cloud console, check your API key's 'API restrictions' and ensure 'Vertex AI API' is enabled."}]);
       } else if (err.message.includes("project") && err.message.includes("not found")) {
         setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Project Not Found:** The Project ID seems incorrect. Please edit `LiveAssistant.tsx` and replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID."}]);
       } else if (err.message.includes("API key not valid")) {
        setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Invalid API Key:** The API key is not valid for the selected project. Please verify the key in `private_keys.ts`." }]);
       } else {
         setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ **API Error:** ${err.message}` }]);
       }
    }
    setIsLoading(false);
  };


  return (
    <div className="fixed bottom-8 left-8 z-[150] font-sans">
      {isNotebookOpen && <Notebook onClose={() => setIsNotebookOpen(false)} />}
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-14 h-14 bg-[var(--trust-blue)] text-white rounded-full shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      ) : (
        <div className="w-80 md:w-96 h-auto bg-[var(--bg-standard)] border border-[var(--border-light)] shadow-2xl rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          
          <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
            {/* Status and Title */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
               <button 
                onClick={() => setIsNotebookOpen(true)}
                className="text-xs font-semibold uppercase tracking-wider text-[var(--text-header)] opacity-60 hover:opacity-100 px-3 py-1 rounded-md hover:bg-[var(--bg-subtle)] transition-colors"
                title="Start Demo Notebook"
              >
                Demo
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
              <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 p-2 ml-1">✕</button>
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
              placeholder={status === 'OFFLINE' ? "Ask a question or start voice..." : "Voice chat is active..."} 
              className="flex-1 text-sm bg-transparent outline-none py-2"
              disabled={status !== 'OFFLINE' || isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={status !== 'OFFLINE' || isLoading || !input.trim()}
              className={`p-2 transition-all ${status !== 'OFFLINE' || isLoading || !input.trim() ? 'opacity-20 cursor-not--allowed' : 'text-[var(--trust-blue)] hover:scale-110'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};
