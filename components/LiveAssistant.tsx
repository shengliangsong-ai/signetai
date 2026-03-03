import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { GOOGLE_GEMINI_KEY } from '../private_keys.ts';
import { Notebook } from './Notebook';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface DisplayMessage {
  role: 'user' | 'assistant';
  text: string;
}

type ConnectionStatus = 'OFFLINE' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>('OFFLINE');
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'assistant', text: "Systems online. I am **Signet-Alpha**, your Live Digital Notary.\n\nI can help you verify media using our Image and Video Diff Engines, or guide you through Universal Media Signing using your registered keys. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getApiKey = () => {
    // This project uses a CI step to generate private_keys.ts
    // This is the correct way to access the key for this project.
    if (GOOGLE_GEMINI_KEY && GOOGLE_GEMINI_KEY.startsWith('AIza')) {
      return GOOGLE_GEMINI_KEY;
    }
    console.warn("LiveAssistant: No valid API Key found in private_keys.ts");
    return '';
  };

  useEffect(() => {
    const apiKey = getApiKey();
    if (apiKey) {
      setStatus('CONNECTING');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      chat.current = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
      setStatus('CONNECTED');
    } else {
        setStatus('ERROR');
        setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Config Error:** No valid API Key found." }]);
    }
  }, []);

  const initVoiceChat = async () => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: "🎙️ Voice chat is temporarily unavailable while we resolve the API configuration. Please use text chat for now."
    }]);
    return;
  };

  const handleSendMessage = async () => {
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    if (!chat.current) {
        setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ **Initialization Error:** Chat service not available. Please check API key." }]);
        return;
    }

    const userMessage: DisplayMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.current.sendMessage(textToSend);
      const response = await result.response;
      const text = response.text();
      setMessages(prev => [...prev, { role: 'assistant', text }]);
    } catch (err: any) {
      console.error("Chat send message failed:", err);
      let errorMessage = "An unexpected error occurred.";
      if (err.message) {
          if (err.message.includes("API key not valid")) {
              errorMessage = "⚠️ **Authentication Error:** The API key is not valid. Please check the `GOOGLE_GEMINI_KEY` in your environment or `private_keys.ts` file.";
          } else if (err.message.includes("location is not supported")) {
              errorMessage = "⚠️ **Location Error:** Your current location is not supported for this API.";
          } else if (err.message.includes("permission denied")) {
              errorMessage = "⚠️ **Permission Denied:** The API key does not have permission to use the Generative Language API. Please enable it in the Google Cloud Console.";
          } else {
              errorMessage = `⚠️ **API Error:** ${err.message}`;
          }
      }
      setMessages(prev => [...prev, { role: 'assistant', text: errorMessage }]);
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
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-green-500' : status === 'CONNECTING' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`}></div>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-header)] leading-none">Signet-Alpha</span>
                 <span className="font-mono text-[7px] opacity-40 uppercase tracking-tighter">{status}</span>
              </div>
            </div>

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
                className={`p-2 rounded transition-colors text-[var(--trust-blue)] hover:bg-[var(--bg-subtle)]'}`}
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
              placeholder={"Ask a question or start voice..."} 
              className="flex-1 text-sm bg-transparent outline-none py-2"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className={`p-2 transition-all ${isLoading || !input.trim() ? 'opacity-20 cursor-not--allowed' : 'text-[var(--trust-blue)] hover:scale-110'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};
