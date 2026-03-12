import React from 'react';
import Markdown from 'react-markdown';
import hackathonContent from '../Hackathon.md?raw';

export const HackathonView: React.FC = () => {
  return (
    <div className="py-12 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <header className="mb-16 pb-12 border-b border-[var(--border-light)]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] border border-[var(--border-light)] mb-8">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-body)] opacity-60"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
           <span className="font-sans text-xs font-medium text-[var(--text-body)] opacity-80 uppercase tracking-wider">Project Documentation</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-header)] mb-6 font-sans">
          Hackathon Submission
        </h1>
        <p className="text-lg text-[var(--text-body)] opacity-70 max-w-2xl leading-relaxed font-sans mb-8">
          The official documentation and technical overview for the SignetAI project.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#demo" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--trust-blue)] text-white rounded-lg font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 3l14 9-14 9V3z"/>
            </svg>
            Play Live Voice Presentation
          </a>
          <button 
            onClick={() => {
              // Trigger the Live Assistant orb if it's closed, or just alert the user
              const orb = document.querySelector('.fixed.bottom-6.right-6 button');
              if (orb) (orb as HTMLElement).click();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-sidebar)] border border-[var(--trust-blue)] text-[var(--trust-blue)] rounded-lg font-bold hover:bg-blue-500/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            Talk to Live Agent Now
          </button>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/4 shrink-0 order-2 lg:order-1">
          <div className="sticky top-24 space-y-8">
            <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm">
              <h4 className="font-sans text-xs font-bold text-[var(--text-header)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--trust-blue)]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Project Details
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col gap-1">
                  <span className="text-[var(--text-body)] opacity-60 text-xs uppercase tracking-wider font-medium">Status</span>
                  <span className="font-medium text-[var(--text-header)] flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Completed
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-[var(--text-body)] opacity-60 text-xs uppercase tracking-wider font-medium">Category</span>
                  <span className="font-medium text-[var(--text-header)] text-sm">Security & AI</span>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="text-[var(--text-body)] opacity-60 text-xs uppercase tracking-wider font-medium">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">React</span>
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">Gemini Live API</span>
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">Firebase</span>
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">Web Crypto</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm">
              <h4 className="font-sans text-xs font-bold text-[var(--text-header)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--trust-blue)]"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Important Links
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://github.com/shengliangsong-ai/signetai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors font-medium group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 group-hover:opacity-100 transition-opacity"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://devpost.com/software/signet-ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors font-medium group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 group-hover:opacity-100 transition-opacity"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    Devpost Submission
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:w-3/4 order-1 lg:order-2">
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[var(--text-header)]
                 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[var(--border-light)]
                 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                 prose-p:text-[var(--text-body)] prose-p:leading-relaxed prose-p:mb-6
                 prose-a:text-[var(--trust-blue)] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                 prose-strong:text-[var(--text-header)] prose-strong:font-semibold
                 prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:space-y-2
                 prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6 prose-ol:space-y-2
                 prose-li:text-[var(--text-body)] prose-li:leading-relaxed prose-li:marker:text-[var(--text-body)] prose-li:marker:opacity-50
                 prose-blockquote:border-l-2 prose-blockquote:border-[var(--trust-blue)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--text-body)] prose-blockquote:opacity-80 prose-blockquote:bg-transparent prose-blockquote:py-2
                 prose-code:text-[var(--text-header)] prose-code:bg-[var(--bg-sidebar)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-[var(--border-light)]
                 prose-pre:bg-[var(--bg-sidebar)] prose-pre:border prose-pre:border-[var(--border-light)] prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-sm
                 prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-[var(--border-light)] prose-img:w-full
                 prose-hr:border-[var(--border-light)] prose-hr:my-10">
            <Markdown>{hackathonContent}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
