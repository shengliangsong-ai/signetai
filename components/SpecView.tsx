
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { SPEC_PAGES } from './SpecContent';
import { PersistenceService } from '../services/PersistenceService';

export const SpecView: React.FC = () => {
  const [activePage, setActivePage] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const handleDownload = async () => {
    let vault = await PersistenceService.getActiveVault();
    if (!vault) {
        vault = {
            identity: 'signetai.io:ssl',
            anchor: 'signetai.io:ssl',
            publicKey: 'ed25519:signet_v3.1_sovereign_5b9878a8583b7b38d719c7c8498f8981adc17bec0c311d76269e1275e4a8bdf9',
            mnemonic: '',
            timestamp: Date.now(),
            type: 'SOVEREIGN'
        } as any;
    }
    const activeVault = vault!;

    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const pageWidth = width;
    const pageHeight = height;
    const margin = 20;

    // --- HELPER: FOOTER ---
    const addFooter = (pageNo: number, total: number) => {
        doc.setFont("times", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`MASTER SIGNATORY ATTESTATION | Authorized by: ${activeVault.identity} | PROVENANCE_ROOT: SHA256:7B8C...44A2`, margin, pageHeight - 10);
        doc.text(`Page ${pageNo} of ${total}`, pageWidth - margin - 20, pageHeight - 10);
        doc.setTextColor(0);
    };

    // --- HELPER: HEADER ---
    const addHeader = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("SIGNET PROTOCOL v0.4.0_OFFICIAL", margin, 15);
        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(margin, 18, pageWidth - margin, 18);
        doc.setTextColor(0);
        
        doc.setFont("times", "bolditalic");
        doc.setFontSize(12);
        doc.text(title, margin, 25);
    };

    // --- PAGE 1: COVER PAGE ---
    // Background
    doc.setFillColor(255, 255, 255); // White
    doc.rect(0, 0, width, height, 'F');
    
    // Attempt to load Banner Image
    const bannerUrl = "https://www.signetai.io/public/signetai_banner.png"; 
    try {
        // We use fetch/blob approach to better handle CORS/Caching issues in some browsers
        const response = await fetch(bannerUrl, { mode: 'cors' });
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        
        const imgBitmap = await createImageBitmap(blob);
        
        // Calculate dimensions (Max width 160mm)
        const imgWidth = 160; 
        const imgHeight = (imgBitmap.height * imgWidth) / imgBitmap.width;
        
        // Draw to canvas to get base64 (jsPDF handles base64 reliably)
        const canvas = document.createElement('canvas');
        canvas.width = imgBitmap.width;
        canvas.height = imgBitmap.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(imgBitmap, 0, 0);
            const base64Img = canvas.toDataURL('image/png');
            doc.addImage(base64Img, 'PNG', width/2 - imgWidth/2, 60, imgWidth, imgHeight);
        }

    } catch (e) {
        console.warn("Banner image failed to load, using vector fallback.", e);
        // Fallback Vector Logo (Dark for white bg)
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(2);
        doc.roundedRect(width/2 - 40, 60, 80, 80, 10, 10, 'S'); 
        
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(80);
        doc.text("SA", width/2, 110, { align: 'center' });
        
        doc.setFillColor(0, 85, 255); 
        doc.circle(width/2 + 25, 75, 8, 'F');
    }

    // Title
    doc.setTextColor(0, 0, 0); // Black text for White BG
    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.text("SIGNET PROTOCOL", width/2, 180, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Verifiable Proof of Reasoning (VPR)", width/2, 195, { align: 'center' });
    
    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80); // Dark Grey
    doc.text("VERSION 0.4.0", width/2, 230, { align: 'center' });
    doc.text("ISO/TC 290 Alignment", width/2, 236, { align: 'center' });
    
    // Bottom Bar
    doc.setFillColor(0, 85, 255);
    doc.rect(0, height - 20, width, 20, 'F');
    doc.setTextColor(255, 255, 255); // White Text on Blue Bar
    doc.setFontSize(8);
    doc.text("CONFIDENTIAL - SIGNET PROTOCOL GROUP", width/2, height - 8, { align: 'center' });

    // --- PAGE 2: PROLOG / DOCUMENT CONTROL ---
    doc.addPage();
    doc.setTextColor(0);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Document Control", margin, 40);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const metaY = 60;
    const metaGap = 10;
    
    const metaData = [
        ["Document ID:", "SPC-VPR-2026-003"],
        ["Version:", "0.4.0"],
        ["Status:", "Active Draft / Implementation Ready"],
        ["Date:", new Date().toLocaleDateString()],
        ["Author:", "Signet Protocol Group"],
        ["Master Signatory:", activeVault.identity],
        ["Classification:", "Public Specification"]
    ];

    metaData.forEach((item, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(item[0], margin, metaY + (i * metaGap));
        doc.setFont("helvetica", "normal");
        doc.text(item[1], margin + 50, metaY + (i * metaGap));
    });

    doc.setLineWidth(0.5);
    doc.line(margin, 140, pageWidth - margin, 140);

    doc.setFont("times", "italic");
    doc.setFontSize(11);
    const abstract = "This document specifies the technical requirements for the Signet Protocol, a framework for ensuring the cryptographic provenance of AI-generated reasoning paths. It defines the schemas for JSON-LD manifests, Ed25519 identity binding, and Universal Tail-Wrap (UTW) injection strategies for binary assets.";
    const splitAbstract = doc.splitTextToSize(abstract, pageWidth - (margin * 2));
    doc.text(splitAbstract, margin, 155);

    addFooter(1, SPEC_PAGES.length + 4); 

    // --- PAGE 3: TABLE OF CONTENTS ---
    doc.addPage();
    addHeader("Table of Contents");
    
    let tocY = 40;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    SPEC_PAGES.forEach((page, i) => {
        if (tocY > pageHeight - 30) {
            doc.addPage();
            addHeader("Table of Contents (Cont.)");
            tocY = 40;
        }
        const title = page.title;
        const pageNum = (i + 4).toString(); 
        doc.text(title, margin, tocY);
        doc.text(pageNum, pageWidth - margin - 10, tocY, { align: 'right' });
        
        const titleWidth = doc.getTextWidth(title);
        const dotsStart = margin + titleWidth + 2;
        const dotsEnd = pageWidth - margin - 15;
        doc.setFontSize(8);
        doc.setTextColor(150);
        for (let d = dotsStart; d < dotsEnd; d += 2) {
            doc.text(".", d, tocY);
        }
        doc.setFontSize(11);
        doc.setTextColor(0);
        
        tocY += 10;
    });
    
    addFooter(2, SPEC_PAGES.length + 4);

    // --- CONTENT PAGES ---
    let currentPageNum = 3; 
    
    SPEC_PAGES.forEach((page, i) => {
        currentPageNum++;
        doc.addPage();
        addHeader(page.category);
        
        let cursorY = 40;
        
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text(page.title, margin, cursorY);
        cursorY += 15;
        
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.setLineHeightFactor(1.5);
        
        const splitBody = doc.splitTextToSize(page.text, pageWidth - (margin * 2));
        doc.text(splitBody, margin, cursorY);
        
        addFooter(currentPageNum, SPEC_PAGES.length + 4);
    });

    // --- BACK COVER ---
    doc.addPage();
    doc.setFillColor(255, 255, 255); 
    doc.rect(0, 0, width, height, 'F');
    
    // Improved Barcode Simulation (Code 128 / High Density)
    doc.setFillColor(0, 0, 0); 
    const barcodeW = 140; 
    const barcodeH = 15; 
    const barcodeY = height / 2 - (barcodeH / 2);
    const barcodeX = (width - barcodeW) / 2;
    
    let currX = barcodeX;
    const endX = barcodeX + barcodeW;
    let seed = 42; // Deterministic seed for consistent barcode look
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    while (currX < endX) {
        // Randomly determine bar width (thin to thick)
        const barWidth = (random() * 1.5) + 0.4; 
        // Randomly determine if it's a black bar or white space
        const isBar = random() > 0.4; 
        
        if (currX + barWidth > endX) break;

        if (isBar) {
            doc.rect(currX, barcodeY, barWidth, barcodeH, 'F');
        }
        currX += barWidth;
    }
    
    // Ensure boundary bars for clean look
    doc.rect(barcodeX, barcodeY, 2, barcodeH, 'F');
    doc.rect(endX - 2, barcodeY, 2, barcodeH, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.text("GENERATED BY: www.signetai.io", width/2, barcodeY + barcodeH + 10, { align: 'center' });
    doc.text(new Date().toISOString(), width/2, barcodeY + barcodeH + 16, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100); 
    
    // Human Readable Identity
    doc.text("SIGNED BY IDENTITY:", width/2, barcodeY + barcodeH + 30, { align: 'center' });
    doc.setTextColor(0, 0, 0); 
    doc.setFont("courier", "bold");
    doc.text(activeVault.identity, width/2, barcodeY + barcodeH + 35, { align: 'center' });

    // Public Key
    doc.setTextColor(100, 100, 100); 
    doc.setFont("courier", "normal");
    doc.text("SIGNED BY PUBLIC KEY:", width/2, barcodeY + barcodeH + 45, { align: 'center' });
    doc.setTextColor(0, 85, 255); 
    doc.setFontSize(8);
    // Display FULL key (v3.1)
    doc.text(activeVault.publicKey, width/2, barcodeY + barcodeH + 50, { align: 'center' });
    
    // --- SIGNATURE INJECTION (UTW) ---
    const pdfBuffer = doc.output('arraybuffer');
    
    const pdfHashBuffer = await crypto.subtle.digest('SHA-256', pdfBuffer);
    const pdfContentHash = Array.from(new Uint8Array(pdfHashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.document_provenance",
      "version": "0.4.0",
      "strategy": "POST_EOF_INJECTION",
      "asset": {
        "type": "application/pdf",
        "hash_algorithm": "SHA-256",
        "filename": "signet_spec_v0.4.0.pdf",
        "generated_by": "signetai.io",
        "content_hash": pdfContentHash,
        "byte_length": pdfBuffer.byteLength
      },
      "signature": {
        "signer": activeVault.identity,
        "anchor": activeVault.anchor,
        "key": activeVault.publicKey,
        "timestamp": new Date().toISOString(),
        "role": "MASTER_SIGNATORY",
        "note": "Self-signed specification artifact (UTW)"
      }
    };

    const injectionString = `
%SIGNET_VPR_START
${JSON.stringify(manifest, null, 2)}
%SIGNET_VPR_END
`;
    const encoder = new TextEncoder();
    const injectionBuffer = encoder.encode(injectionString);

    const combinedBuffer = new Uint8Array(pdfBuffer.byteLength + injectionBuffer.byteLength);
    combinedBuffer.set(new Uint8Array(pdfBuffer), 0);
    combinedBuffer.set(injectionBuffer, pdfBuffer.byteLength);

    const blob = new Blob([combinedBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "signet_spec_v0.4.0.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-12 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Mobile TOC (Collapsible) */}
        <div className="lg:hidden w-full">
          <details className="group bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm overflow-hidden">
            <summary className="p-4 font-sans text-sm font-bold text-[var(--text-header)] cursor-pointer flex justify-between items-center list-none">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--trust-blue)]"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                Table of Contents
              </div>
              <span className="group-open:rotate-180 transition-transform">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="p-4 pt-0 border-t border-[var(--border-light)] space-y-1 max-h-64 overflow-y-auto">
              {SPEC_PAGES.map((page, i) => {
                const isMajorSection = page.title.match(/^[0-9]+\.\s/);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setActivePage(i);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-sans rounded-md transition-all flex items-start gap-2 ${
                      activePage === i 
                        ? 'bg-[var(--trust-blue)]/10 text-[var(--trust-blue)] font-semibold' 
                        : 'text-[var(--text-body)] opacity-80 hover:opacity-100 hover:bg-[var(--bg-sidebar)]'
                    } ${isMajorSection && i !== 0 ? 'mt-2' : ''}`}
                  >
                    {page.title.includes('.') ? (
                      <>
                        <span className={`font-mono text-[11px] mt-0.5 shrink-0 ${activePage === i ? 'text-[var(--trust-blue)]' : 'text-[var(--text-body)] opacity-50'}`}>
                          {page.title.split('.')[0]}.
                        </span>
                        <span className="leading-tight">{page.title.split('.').slice(1).join('.').trim()}</span>
                      </>
                    ) : (
                      <span className="leading-tight">{page.title}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </details>
        </div>

        {/* Desktop TOC (Sticky) */}
        <div className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${isTocOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <div className="w-80 sticky top-24 space-y-6">
             <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm">
                <h3 className="font-sans text-sm font-bold text-[var(--text-header)] mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--trust-blue)]"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  Table of Contents
                </h3>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                   {SPEC_PAGES.map((page, i) => {
                      const isMajorSection = page.title.match(/^[0-9]+\.\s/);
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setActivePage(i);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-3 py-2 text-[13px] font-sans rounded-md transition-all flex items-start gap-2 ${
                            activePage === i 
                              ? 'bg-[var(--trust-blue)]/10 text-[var(--trust-blue)] font-semibold shadow-sm ring-1 ring-[var(--trust-blue)]/20' 
                              : 'text-[var(--text-body)] opacity-80 hover:opacity-100 hover:bg-[var(--bg-sidebar)] hover:translate-x-1'
                          } ${isMajorSection && i !== 0 ? 'mt-3' : ''}`}
                        >
                          {page.title.includes('.') ? (
                            <>
                              <span className={`font-mono text-[11px] mt-0.5 shrink-0 ${activePage === i ? 'text-[var(--trust-blue)]' : 'text-[var(--text-body)] opacity-50'}`}>
                                {page.title.split('.')[0]}.
                              </span>
                              <span className="leading-tight">{page.title.split('.').slice(1).join('.').trim()}</span>
                            </>
                          ) : (
                            <span className="leading-tight">{page.title}</span>
                          )}
                        </button>
                      );
                   })}
                </div>
             </div>
             
             <button 
               onClick={handleDownload}
               className="w-full py-3 bg-[var(--text-header)] text-[var(--bg-standard)] font-sans text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
               Download PDF Spec
             </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 bg-[var(--bg-standard)] rounded-xl lg:p-8 lg:border lg:border-[var(--border-light)] lg:shadow-sm transition-all duration-300">
           {/* Desktop TOC Toggle */}
           <div className="hidden lg:flex mb-6">
             <button 
               onClick={() => setIsTocOpen(!isTocOpen)}
               className="flex items-center gap-2 text-xs font-sans font-medium text-[var(--text-body)] opacity-60 hover:opacity-100 hover:text-[var(--trust-blue)] transition-colors"
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="9" y1="3" x2="9" y2="21"></line>
               </svg>
               {isTocOpen ? 'Hide Index' : 'Show Index'}
             </button>
           </div>

           {/* Spec Header (W3C Style) */}
           {activePage === 0 && (
             <div className="mb-12 pb-8 border-b-2 border-[var(--trust-blue)]">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-[var(--trust-blue)] rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">SA</div>
                 <div>
                   <h2 className="text-sm font-mono uppercase tracking-widest text-[var(--trust-blue)] font-bold">Signet Protocol Group</h2>
                   <p className="text-xs font-mono text-[var(--text-body)] opacity-60">Technical Specification Document</p>
                 </div>
               </div>
               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--text-header)] leading-tight mb-6">
                 Signet Protocol: Verifiable Proof of Reasoning (VPR)
               </h1>
               <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm font-mono">
                 <dt className="text-[var(--text-body)] opacity-60">Version:</dt>
                 <dd className="text-[var(--text-header)] font-bold">0.4.0 (Draft)</dd>
                 <dt className="text-[var(--text-body)] opacity-60">Date:</dt>
                 <dd className="text-[var(--text-header)]">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                 <dt className="text-[var(--text-body)] opacity-60">Editors:</dt>
                 <dd className="text-[var(--text-header)]">Signet Protocol Core Team</dd>
                 <dt className="text-[var(--text-body)] opacity-60">Status:</dt>
                 <dd className="text-amber-600 font-bold">Active Draft / Implementation Ready</dd>
               </dl>
             </div>
           )}

           {/* Page Header */}
           {activePage !== 0 && (
             <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-[var(--border-light)] pb-4 gap-4">
                <div>
                  <span className="font-mono text-[10px] text-[var(--trust-blue)] uppercase tracking-[0.3em] font-bold">{SPEC_PAGES[activePage].category}</span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-header)] mt-2">{SPEC_PAGES[activePage].title}</h1>
                </div>
                <span className="font-mono text-[10px] opacity-40 whitespace-nowrap">Page {activePage + 1} of {SPEC_PAGES.length}</span>
             </div>
           )}

           {/* Content */}
           <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
             prose-headings:font-serif prose-headings:font-bold prose-headings:text-[var(--text-header)]
             prose-p:text-[var(--text-body)] prose-p:leading-relaxed
             prose-a:text-[var(--trust-blue)] prose-a:no-underline hover:prose-a:underline
             prose-code:text-[var(--trust-blue)] prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal
             prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-gray-800 prose-pre:shadow-inner
             prose-strong:text-[var(--text-header)] prose-strong:font-bold
             prose-li:text-[var(--text-body)]
             prose-blockquote:border-l-4 prose-blockquote:border-[var(--trust-blue)] prose-blockquote:bg-[var(--bg-sidebar)] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-[var(--text-body)]">
              {SPEC_PAGES[activePage].content}
           </div>

           {/* Navigation Footer */}
           <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--border-light)]">
              <button 
                onClick={() => {
                  setActivePage(Math.max(0, activePage - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={activePage === 0}
                className="w-full sm:w-auto px-6 py-3 border border-[var(--border-light)] rounded font-mono text-xs uppercase font-bold tracking-widest text-[var(--text-header)] hover:bg-[var(--bg-sidebar)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                &larr; Previous Section
              </button>
              
              <span className="font-mono text-[10px] opacity-40 hidden sm:block">
                {activePage + 1} / {SPEC_PAGES.length}
              </span>

              <button 
                onClick={() => {
                  setActivePage(Math.min(SPEC_PAGES.length - 1, activePage + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={activePage === SPEC_PAGES.length - 1}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--trust-blue)] text-white rounded font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 transition-all shadow-sm"
              >
                Next Section &rarr;
              </button>
           </div>
           
           {/* Mobile Download Button */}
           <div className="mt-8 lg:hidden">
             <button 
               onClick={handleDownload}
               className="w-full py-4 bg-[var(--text-header)] text-[var(--bg-standard)] font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow-md flex items-center justify-center gap-2"
             >
               <span>⭳</span> Download PDF Spec
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
