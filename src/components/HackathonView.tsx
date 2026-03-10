import React from 'react';
import Markdown from 'react-markdown';
import hackathonContent from '../../Hackathon.md?raw';

export const HackathonView: React.FC = () => {
  return (
    <div className="py-12 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <header className="mb-16 border-b border-[var(--border-light)] pb-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--admonition-bg)] border border-[var(--trust-blue)] mb-8 shadow-[0_0_15px_rgba(0,85,255,0.15)]">
           <div className="w-2 h-2 rounded-full bg-[var(--trust-blue)] animate-pulse"></div>
           <span className="font-mono text-[10px] text-[var(--trust-blue)] font-bold uppercase tracking-widest">Project Documentation</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--text-header)] mb-6">
          Hackathon <span className="text-[var(--trust-blue)] italic">Submission</span>
        </h1>
        <p className="text-xl text-[var(--text-body)] opacity-80 max-w-2xl leading-relaxed font-serif">
          The official documentation and technical overview for the SignetAI project.
        </p>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/4 shrink-0 order-2 lg:order-1">
          <div className="sticky top-24 space-y-10">
            <div>
              <h4 className="font-mono text-xs text-[var(--text-body)] opacity-50 uppercase tracking-widest mb-4 font-bold">Project Details</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col">
                  <span className="text-[var(--text-body)] opacity-70 mb-1">Status</span>
                  <span className="font-medium text-[var(--text-header)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Completed
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="text-[var(--text-body)] opacity-70 mb-1">Category</span>
                  <span className="font-medium text-[var(--text-header)]">Security & AI</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-[var(--text-body)] opacity-70 mb-1">Tech Stack</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded text-xs text-[var(--text-header)]">React</span>
                    <span className="px-2 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded text-xs text-[var(--text-header)]">Gemini Live API</span>
                    <span className="px-2 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded text-xs text-[var(--text-header)]">Firebase</span>
                    <span className="px-2 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded text-xs text-[var(--text-header)]">Web Crypto</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-mono text-xs text-[var(--text-body)] opacity-50 uppercase tracking-widest mb-4 font-bold">Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="flex items-center gap-2 text-[var(--trust-blue)] hover:underline font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-[var(--trust-blue)] hover:underline font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
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
                 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-[var(--border-light)]
                 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                 prose-p:text-[var(--text-body)] prose-p:leading-loose prose-p:mb-8
                 prose-a:text-[var(--trust-blue)] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                 prose-strong:text-[var(--text-header)] prose-strong:font-bold
                 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:space-y-3
                 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8 prose-ol:space-y-3
                 prose-li:text-[var(--text-body)] prose-li:leading-relaxed prose-li:marker:text-[var(--trust-blue)]
                 prose-blockquote:border-l-4 prose-blockquote:border-[var(--trust-blue)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--text-body)] prose-blockquote:opacity-80 prose-blockquote:bg-[var(--admonition-bg)] prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                 prose-code:text-[var(--trust-blue)] prose-code:bg-[var(--bg-sidebar)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                 prose-pre:bg-[var(--bg-sidebar)] prose-pre:border prose-pre:border-[var(--border-light)] prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-sm
                 prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-[var(--border-light)] prose-img:w-full
                 prose-hr:border-[var(--border-light)] prose-hr:my-12">
            <Markdown>{hackathonContent}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
