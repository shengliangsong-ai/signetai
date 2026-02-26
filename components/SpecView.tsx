
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { SPEC_PAGES } from './SpecContent';

export const SpecView: React.FC = () => {
  const [activePage, setActivePage] = useState(0);

  const handleDownload = async () => {
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
        doc.text("MASTER SIGNATORY ATTESTATION | Authorized by: signetai.io:ssl | PROVENANCE_ROOT: SHA256:7B8C...44A2", margin, pageHeight - 10);
        doc.text(`Page ${pageNo} of ${total}`, pageWidth - margin - 20, pageHeight - 10);
        doc.setTextColor(0);
    };

    // --- HELPER: HEADER ---
    const addHeader = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("SIGNET PROTOCOL v0.3.2_OFFICIAL", margin, 15);
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
    doc.text("VERSION 0.3.2", width/2, 230, { align: 'center' });
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
        ["Version:", "0.3.2"],
        ["Status:", "Active Draft / Implementation Ready"],
        ["Date:", new Date().toLocaleDateString()],
        ["Author:", "Signet Protocol Group"],
        ["Master Signatory:", "signetai.io:ssl"],
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
    doc.text("signetai.io:ssl", width/2, barcodeY + barcodeH + 35, { align: 'center' });

    // Public Key
    doc.setTextColor(100, 100, 100); 
    doc.setFont("courier", "normal");
    doc.text("SIGNED BY PUBLIC KEY:", width/2, barcodeY + barcodeH + 45, { align: 'center' });
    doc.setTextColor(0, 85, 255); 
    doc.setFontSize(8);
    // Display FULL key (v3.1)
    doc.text("ed25519:signet_v3.1_sovereign_5b9878a8583b7b38d719c7c8498f8981adc17bec0c311d76269e1275e4a8bdf9", width/2, barcodeY + barcodeH + 50, { align: 'center' });
    
    // --- SIGNATURE INJECTION (UTW) ---
    const pdfBuffer = doc.output('arraybuffer');
    
    const pdfHashBuffer = await crypto.subtle.digest('SHA-256', pdfBuffer);
    const pdfContentHash = Array.from(new Uint8Array(pdfHashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.document_provenance",
      "version": "0.3.2",
      "strategy": "POST_EOF_INJECTION",
      "asset": {
        "type": "application/pdf",
        "hash_algorithm": "SHA-256",
        "filename": "signet_spec_v0.3.2.pdf",
        "generated_by": "signetai.io",
        "content_hash": pdfContentHash,
        "byte_length": pdfBuffer.byteLength
      },
      "signature": {
        "signer": "signetai.io:ssl",
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
    a.download = "signet_spec_v0.3.2.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Signet Protocol</h1>
          <p className="text-xl opacity-60 max-w-2xl font-serif italic">Technical Specification v0.3.3</p>
        </div>
        <button 
          onClick={handleDownload}
          className="px-6 py-3 border border-[var(--trust-blue)] text-[var(--trust-blue)] font-mono text-[10px] uppercase font-bold rounded hover:bg-blue-500/10 transition-all flex items-center gap-2"
        >
          <span>⭳</span> Download PDF
        </button>
      </div>

      <div className="flex flex-col gap-16">
        {SPEC_PAGES.map((page, i) => (
          <div key={i} className="border-t border-[var(--border-light)] pt-12">
            <div className="mb-8">
              <span className="font-mono text-[10px] text-[var(--trust-blue)] uppercase tracking-[0.3em] font-bold">{page.category}</span>
              <h2 className="text-4xl font-serif italic font-bold text-[var(--text-header)]">{page.title}</h2>
            </div>
            <div className="prose prose-lg max-w-none prose-p:text-[var(--text-body)] prose-headings:text-[var(--text-header)]">
              {page.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
