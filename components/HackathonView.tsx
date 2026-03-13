import React from "react";

export const HackathonView: React.FC = () => {
  return (
    <div className="py-12 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <header className="mb-16 pb-12 border-b border-[var(--border-light)]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] border border-[var(--border-light)] mb-8">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--text-body)] opacity-60"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="font-sans text-xs font-medium text-[var(--text-body)] opacity-80 uppercase tracking-wider">
            Project Documentation
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-header)] mb-6 font-sans">
          Hackathon Submission
        </h1>
        <p className="text-lg text-[var(--text-body)] opacity-70 max-w-2xl leading-relaxed font-sans mb-8">
          The official documentation and technical overview for the SignetAI
          project.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--trust-blue)] text-white rounded-lg font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
            Play Live Voice Presentation
          </a>
          <button
            onClick={() => {
              // Trigger the Live Assistant orb if it's closed
              const orb = document.querySelector(
                ".fixed.bottom-8.left-8 button",
              );
              if (orb) (orb as HTMLElement).click();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-sidebar)] border border-[var(--trust-blue)] text-[var(--trust-blue)] rounded-lg font-bold hover:bg-blue-500/10 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
            Talk to Live Agent Now
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/4 shrink-0 order-2 lg:order-1">
          <div className="sticky top-24 space-y-8">
            <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm">
              <h4 className="font-sans text-xs font-bold text-[var(--text-header)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--trust-blue)]"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Project Details
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col gap-1">
                  <span className="text-[var(--text-body)] opacity-60 text-xs uppercase tracking-wider font-medium">
                    Status
                  </span>
                  <span className="font-medium text-[var(--text-header)] flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Completed
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-[var(--text-body)] opacity-60 text-xs uppercase tracking-wider font-medium">
                    Category
                  </span>
                  <span className="font-medium text-[var(--text-header)] text-sm">
                    Security & AI
                  </span>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="text-[var(--text-body)] opacity-60 text-xs uppercase tracking-wider font-medium">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">
                      React
                    </span>
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">
                      Gemini Live API
                    </span>
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">
                      Firebase
                    </span>
                    <span className="px-2.5 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-md text-xs font-medium text-[var(--text-header)]">
                      Web Crypto
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm">
              <h4 className="font-sans text-xs font-bold text-[var(--text-header)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--trust-blue)]"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Important Links
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://github.com/shengliangsong-ai/signetai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors font-medium group"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://devpost.com/software/signet-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors font-medium group"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    Devpost Submission
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:w-3/4 order-1 lg:order-2">
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[var(--text-header)]
                 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[var(--border-light)]
                 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                 prose-h4:text-xl prose-h4:font-bold prose-h4:mt-10 prose-h4:mb-4 prose-h4:text-[var(--trust-blue)]
                 prose-p:text-[var(--text-body)] prose-p:leading-relaxed prose-p:mb-8
                 prose-a:text-[var(--trust-blue)] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                 prose-strong:text-[var(--text-header)] prose-strong:font-semibold
                 prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:space-y-2
                 prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6 prose-ol:space-y-2
                 prose-li:text-[var(--text-body)] prose-li:leading-relaxed prose-li:marker:text-[var(--text-body)] prose-li:marker:opacity-50
                 prose-blockquote:border-l-2 prose-blockquote:border-[var(--trust-blue)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--text-body)] prose-blockquote:opacity-80 prose-blockquote:bg-transparent prose-blockquote:py-2
                 prose-code:text-[var(--text-header)] prose-code:bg-[var(--bg-sidebar)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-[var(--border-light)]
                 prose-pre:bg-[var(--bg-sidebar)] prose-pre:border prose-pre:border-[var(--border-light)] prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-sm
                 prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-[var(--border-light)] prose-img:w-full
                 prose-hr:border-[var(--border-light)] prose-hr:my-10"
          >
            <div className="bg-[var(--bg-sidebar)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm mb-12">
              <blockquote className="text-xl leading-relaxed text-[var(--text-header)] font-medium m-0 border-l-4 border-[var(--trust-blue)] pl-6 py-2">
                <strong>SignetAI</strong> is a multimodal, real-time AI agent that
                acts as a cryptographic notary and deepfake detector for digital
                assets. Operating as a robust multi-page application, it leverages
                the <strong>Gemini Live API</strong> to provide a seamless,
                voice-first experience.
              </blockquote>
            </div>

            <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-[var(--text-header)]">
              <div className="p-2 bg-blue-500/10 rounded-lg text-[var(--trust-blue)]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              Hackathon Requirements Checklist
            </h3>
            <div className="bg-[var(--bg-standard)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm mb-16">
              <ul className="space-y-4 m-0 list-none pl-0">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Category:</strong> Live Agents (Real-time Interaction
                    with Audio/Vision)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Mandatory Tech:</strong> Gemini Live API (
                    <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">gemini-2.5-flash-native-audio-preview</code>)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Google Cloud:</strong> Firebase Hosting, Firestore
                    Database, Firebase Storage
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Text Description:</strong> Provided below in this
                    document.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Public Code Repository:</strong>{" "}
                    <a
                      href="https://github.com/shengliangsong-ai/signetai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--trust-blue)] hover:underline font-medium"
                    >
                      shengliangsong-ai/signetai
                    </a>{" "}
                    <span className="text-sm opacity-70">(Includes spin-up instructions in <code>README.md</code>)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Proof of Google Cloud Deployment:</strong> See{" "}
                    <a
                      href="https://github.com/shengliangsong-ai/signetai/tree/main/.github/workflows"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--trust-blue)] hover:underline font-medium"
                    >
                      <code>.github/workflows</code>
                    </a>{" "}
                    for automated Firebase deployment, and{" "}
                    <a
                      href="https://github.com/shengliangsong-ai/signetai/blob/main/src/config/env.ts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--trust-blue)] hover:underline font-medium"
                    >
                      <code>src/config/env.ts</code>
                    </a>{" "}
                    for Firebase initialization.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Architecture Diagram:</strong>{" "}
                    <a
                      href="https://raw.githubusercontent.com/shengliangsong-ai/signetai/refs/heads/main/public/signet_technical_architecture.svg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--trust-blue)] hover:underline font-medium"
                    >
                      signet_technical_architecture.svg
                    </a>{" "}
                    <span className="text-sm opacity-70">(Also available in the "Introduction" section of the app).</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-emerald-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Demonstration Video:</strong> Available via the "Run
                    Demo" button in the top menu (4-minute interactive Live Agent
                    narration).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-purple-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>
                  <div>
                    <strong className="text-[var(--text-header)]">Bonus - Automated Cloud Deployment:</strong> CI/CD
                    pipeline implemented via GitHub Actions (
                    <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">.github/workflows/firebase-hosting-merge.yml</code>).
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">Inspiration</h2>
            <p className="text-lg leading-relaxed mb-6">
              In the era of generative AI, the line between reality and
              synthetic media has vanished. Deepfakes, AI-generated legal
              documents, and synthetic voice clones are eroding trust in digital
              intelligence. We realized that the world needs a decentralized,
              universally accessible "chain of custody" for digital assets.
              However, cryptographic signing is notoriously complex and
              intimidating for the average user.
            </p>
            <p className="text-lg leading-relaxed mb-12">
              We were inspired to build <strong className="text-[var(--text-header)]">SignetAI</strong> to bridge this
              gap. By combining Google's Gemini Live API with cryptographic
              hashing, we envisioned a "Live Digital Notary"—an AI agent that
              can see, hear, and converse with users in real-time, guiding them
              through the complex process of verifying and signing digital
              intelligence as naturally as talking to a human expert.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">What it does</h2>
            <div className="grid gap-6 mb-12">
              <div className="bg-[var(--bg-sidebar)] p-6 rounded-xl border border-[var(--border-light)]">
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-3 flex items-center gap-2">
                  <span className="text-[var(--trust-blue)]">01.</span> Dynamic 3D Avatar
                </h4>
                <p className="m-0">
                  The Live Agent features a
                  responsive 3D human-like avatar that reacts to the conversation.
                  It includes real-time lip-syncing when the agent speaks, natural
                  eye movements (blinking), head bobbing, and automatically
                  switches its gender appearance based on the selected voice
                  (e.g., female for Zephyr/Kore, male for Puck/Charon/Fenrir).
                </p>
              </div>
              <div className="bg-[var(--bg-sidebar)] p-6 rounded-xl border border-[var(--border-light)]">
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-3 flex items-center gap-2">
                  <span className="text-[var(--trust-blue)]">02.</span> Multimodal Verification & Diff Engine
                </h4>
                <p className="m-0">
                  Users
                  can upload or show images and videos. Our custom{" "}
                  <strong className="text-[var(--text-header)]">Image and Video Diff Engines</strong> work alongside
                  Gemini's vision capabilities to detect tampering, compare
                  versions, and identify synthetic alterations. The agent "sees"
                  the content and explains any anomalies naturally.
                </p>
              </div>
              <div className="bg-[var(--bg-sidebar)] p-6 rounded-xl border border-[var(--border-light)]">
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-3 flex items-center gap-2">
                  <span className="text-[var(--trust-blue)]">03.</span> Real-Time Guidance
                </h4>
                <p className="m-0">
                  The agent talks the user
                  through the verification and signing process, explaining complex
                  cryptographic concepts on the fly. Because it uses the Live API,
                  users can interrupt the agent at any time to ask questions
                  (e.g.,{" "}
                  <em className="text-[var(--text-header)] opacity-80">
                    "Wait, what exactly did the video diff engine find at
                    timestamp 0:15?"
                  </em>
                  ).
                </p>
              </div>
              <div className="bg-[var(--bg-sidebar)] p-6 rounded-xl border border-[var(--border-light)]">
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-3 flex items-center gap-2">
                  <span className="text-[var(--trust-blue)]">04.</span> Universal Media Signing & Key Management
                </h4>
                <p className="m-0">
                  Once
                  verified, the agent executes a function call to trigger our{" "}
                  <strong className="text-[var(--text-header)]">Universal Sign Engine</strong> (supporting images,
                  videos, and any document). It utilizes our built-in{" "}
                  <strong className="text-[var(--text-header)]">Public/Private Key Registration</strong> system to
                  generate a dual-hash signature of the asset and securely logs
                  the transaction to our Google Cloud backend (Firebase
                  Firestore), creating an immutable record of authenticity.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">How we built it</h2>
            <p className="text-lg leading-relaxed mb-8">
              SignetAI is built as a modern, serverless multi-page application
              deployed via automated GitHub Actions to{" "}
              <strong className="text-[var(--text-header)]">Firebase Web Hosting</strong>.
            </p>

            <h3 className="text-2xl font-bold mb-6 text-[var(--text-header)]">The Core Architecture:</h3>
            <ol className="space-y-6 mb-12 list-decimal pl-6 marker:text-[var(--trust-blue)] marker:font-bold">
              <li className="pl-2">
                <strong className="text-[var(--text-header)]">Frontend:</strong> React, TypeScript, and Tailwind CSS,
                structured as a multi-page application for scalable routing and
                distinct workspaces (Signing, Verifying, Key Management).
              </li>
              <li className="pl-2">
                <strong className="text-[var(--text-header)]">The Live Agent:</strong> We utilized the{" "}
                <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">@google/genai</code> SDK to establish a WebSocket
                connection to <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">gemini-2.5-flash-native-audio-preview</code>
                . We implemented the Web Audio API to capture raw PCM audio from
                the user's microphone and stream it to Gemini, while
                simultaneously decoding and playing back Gemini's audio
                responses.
              </li>
              <li className="pl-2">
                <strong className="text-[var(--text-header)]">Advanced Engines:</strong> We integrated our proprietary
                Image Diff and Video Diff engines directly into the agent's
                toolset, allowing it to perform pixel-perfect comparisons and
                semantic analysis of media.
              </li>
              <li className="pl-2">
                <strong className="text-[var(--text-header)]">Backend & Storage:</strong> We use{" "}
                <strong className="text-[var(--text-header)]">Google Cloud</strong> via Firebase. Firestore serves as
                our real-time database to store the cryptographic signatures and
                public keys, while Firebase Storage handles any associated
                media.
              </li>
              <li className="pl-2">
                <strong className="text-[var(--text-header)]">Cryptography:</strong> We implemented client-side
                hashing and a full Public/Private Key Registration system using
                the Web Crypto API to ensure files never leave the user's device
                unencrypted. The core hashing mechanism relies on a dual-hash
                approach:
              </li>
            </ol>

            <div className="bg-[var(--bg-sidebar)] p-6 rounded-xl overflow-x-auto mb-16 shadow-sm border border-[var(--border-light)]">
              <pre className="m-0 font-mono text-sm bg-transparent border-none p-0 shadow-none">
                <code className="text-[var(--text-header)]"><span className="text-[var(--trust-blue)]">H_final</span> = <span>SHA-256</span>( <span>SHA-256</span>(<span className="text-[var(--trust-blue)]">Data</span>) || <span className="text-[var(--trust-blue)]">Metadata</span> )</code>
              </pre>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">Challenges we ran into</h2>
            
            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  API Key Configuration & Security Restrictions
                </h4>
                <p className="leading-relaxed">
                  We discovered that the Gemini Live API and standard Gemini API
                  requests require fundamentally different security configurations
                  in Google Cloud. The Diff Engines use standard HTTP requests (
                  <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">fetch</code>), which automatically send the{" "}
                  <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">Referer</code> header, allowing us to secure the API key
                  using HTTP referrer restrictions (whitelisting our AI Studio
                  preview URLs and <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">https://www.signetai.io/*</code>). However,
                  the Live Agent connects via WebSockets (<code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">wss://</code>), and
                  browsers do not send the <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">Referer</code> header when opening
                  a WebSocket connection. This resulted in{" "}
                  <code className="bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono border border-red-500/20">Requests from referer &lt;empty&gt; are blocked</code>{" "}
                  errors. To solve this, we had to architect the system to support
                  two separate API keys: one restricted key for standard HTTP
                  requests, and one unrestricted key specifically for the Live API
                  WebSocket connection.
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Real-time Audio Streaming
                </h4>
                <p className="leading-relaxed">
                  Integrating real-time, bidirectional audio streaming in the
                  browser was our biggest hurdle. Managing the{" "}
                  <code className="bg-[var(--bg-sidebar)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-light)]">AudioContext</code>, ensuring precise sample rates (16kHz
                  for input, 24kHz for output), and handling raw PCM
                  encoding/decoding without relying on high-level abstractions
                  required deep dives into browser audio APIs.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[var(--text-header)] mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Multimodal Synchronization
                </h4>
                <p className="leading-relaxed">
                  Additionally, synchronizing visual frames with the audio stream
                  over the Live API WebSocket connection while maintaining low
                  latency was challenging. We had to implement careful throttling to
                  ensure we didn't overwhelm the connection while still providing
                  the agent with enough visual context to be helpful.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">Accomplishments that we're proud of</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-[var(--bg-sidebar)] to-[var(--bg-standard)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-[var(--trust-blue)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <h4 className="text-lg font-bold text-[var(--text-header)] mb-2">Zero-Latency Feel</h4>
                <p className="text-sm m-0">
                  Successfully implementing
                  the Gemini Live API to create an agent that feels truly
                  conversational and handles interruptions gracefully.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[var(--bg-sidebar)] to-[var(--bg-standard)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-[var(--text-header)] mb-2">Client-Side Security</h4>
                <p className="text-sm m-0">
                  Ensuring that all
                  cryptographic hashing happens locally on the user's device
                  before any metadata is sent to Google Cloud, preserving absolute
                  privacy.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[var(--bg-sidebar)] to-[var(--bg-standard)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h4 className="text-lg font-bold text-[var(--text-header)] mb-2">Automated CI/CD</h4>
                <p className="text-sm m-0">
                  Setting up a robust GitHub
                  Actions workflow that automatically builds and deploys our
                  application to Firebase Hosting on every merge to the main
                  branch.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">What we learned</h2>
            <div className="bg-[var(--bg-sidebar)] p-8 rounded-2xl border border-[var(--border-light)] shadow-sm mb-12">
              <p className="text-lg leading-relaxed m-0 italic">
                "We gained a profound understanding of the complexities of
                real-time multimodal AI. Moving from traditional
                'text-in/text-out' LLM interactions to continuous, stateful
                WebSocket connections completely changed our mental model of
                application architecture. We also learned how powerful the
                combination of Google's GenAI SDK and Firebase can be for rapidly
                prototyping and deploying scalable, serverless applications."
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-8 text-[var(--text-header)] border-b pb-4 border-[var(--border-light)]">What's next for Signet AI</h2>
            <p className="text-xl font-medium text-[var(--trust-blue)] mb-8">
              Our vision is to make SignetAI the standard protocol for restoring
              accountability to the AI era.
            </p>
            <div className="space-y-6 mb-16">
              <div className="flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center shrink-0 font-bold text-[var(--text-header)]">1</div>
                <div>
                  <h4 className="text-xl font-bold text-[var(--text-header)] mb-2">Cross-Application Workflows</h4>
                  <p className="leading-relaxed m-0">
                    We plan to expand
                    the agent's capabilities to act as a UI Navigator, allowing it
                    to observe a user's screen and automatically verify content
                    across different platforms (e.g., verifying a news article
                    directly on a publisher's website).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center shrink-0 font-bold text-[var(--text-header)]">2</div>
                <div>
                  <h4 className="text-xl font-bold text-[var(--text-header)] mb-2">Decentralized Anchoring</h4>
                  <p className="leading-relaxed m-0">
                    While we currently use
                    Firestore for speed and reliability, we plan to periodically
                    anchor our cryptographic proofs to a public blockchain for
                    ultimate immutability.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center shrink-0 font-bold text-[var(--text-header)]">3</div>
                <div>
                  <h4 className="text-xl font-bold text-[var(--text-header)] mb-2">Enterprise Integrations</h4>
                  <p className="leading-relaxed m-0">
                    Developing APIs so
                    organizations can embed the Signet Live Notary directly into
                    their existing document management systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
