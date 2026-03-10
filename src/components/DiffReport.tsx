
import React from 'react';

// Based on the type definition from components/UniversalSigner.tsx
type VideoFrameSample = {
  index: number;
  t_sec: number;
  frame_size: string;
  p_hash_64: string;
  d_hash_64: string;
  preview_jpeg_data_url: string;
  capture_status: 'OK' | 'FAILED';
  capture_note?: string;
};

// Base64 encoded 1x1 blue pixel PNG. A real implementation would have a full JPEG thumbnail.
const placeholderA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// Base64 encoded 1x1 red pixel PNG.
const placeholderB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==';


// Mock data to simulate a completed analysis for the demo
const mockAnalysisResult = {
  deltaScore: 0.0011,
  interpretation: 'VISUALLY_CONSISTENT',
  samplesA: [
    { index: 1, t_sec: 0, p_hash_64: 'a3f4c1b9a8e7d6c5', d_hash_64: 'ff00ff00ff00ff00', preview_jpeg_data_url: placeholderA, capture_status: 'OK', frame_size: '1920x1080' },
    { index: 2, t_sec: 30, p_hash_64: 'b9c1d8e7f6a5b4c3', d_hash_64: 'ffff0000ffff0000', preview_jpeg_data_url: placeholderA, capture_status: 'OK', frame_size: '1920x1080' },
    { index: 3, t_sec: 60, p_hash_64: 'f0a9b8c7d6e5f4a3', d_hash_64: '0000ffff0000ffff', preview_jpeg_data_url: placeholderA, capture_status: 'OK', frame_size: '1920x1080' },
    { index: 4, t_sec: 90, p_hash_64: 'cce3d2a1b0c9d8e7', d_hash_64: 'ff0000ffffff0000', preview_jpeg_data_url: placeholderA, capture_status: 'OK', frame_size: '1920x1080' },
  ],
  samplesB: [
    { index: 1, t_sec: 0, p_hash_64: 'a3f4c1b9a8e7d6c5', d_hash_64: 'ff00ff00ff00ff00', preview_jpeg_data_url: placeholderB, capture_status: 'OK', frame_size: '1920x1080' },
    { index: 2, t_sec: 30, p_hash_64: 'b9c1d8e7f6a5b4c3', d_hash_64: 'ffff0000ffff0000', preview_jpeg_data_url: placeholderB, capture_status: 'OK', frame_size: '1920x1080' },
    { index: 3, t_sec: 60, p_hash_64: 'd8b3a9f0c7b8d6e5', d_hash_64: '0000ffff0000ffff', preview_jpeg_data_url: placeholderB, capture_status: 'OK', frame_size: '1920x1080' },
    { index: 4, t_sec: 90, p_hash_64: 'cce3d2a1b0c9d8e7', d_hash_64: 'ff0000ffffff0000', preview_jpeg_data_url: placeholderB, capture_status: 'OK', frame_size: '1920x1080' },
  ],
};

// Calculate the hamming distance between two hex hashes to quantify their difference.
const calculateHammingDistance = (hash1: string, hash2: string): number => {
    let distance = 0;
    const binary1 = BigInt(`0x${hash1}`).toString(2).padStart(64, '0');
    const binary2 = BigInt(`0x${hash2}`).toString(2).padStart(64, '0');
    for (let i = 0; i < 64; i++) {
        if (binary1[i] !== binary2[i]) {
            distance++;
        }
    }
    return distance / 64;
};

export const DiffReport: React.FC = () => {
  const { deltaScore, interpretation, samplesA, samplesB } = mockAnalysisResult;

  return (
    <div className="font-sans text-sm text-gray-300">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-green-900/50 border border-green-500/30 rounded-md">
            <div className="text-xs font-bold text-gray-400 mb-1">Overall Delta Score</div>
            <div className="font-mono text-2xl font-bold text-green-400">{deltaScore.toFixed(4)}%</div>
        </div>
        <div className="p-3 bg-green-900/50 border border-green-500/30 rounded-md">
            <div className="text-xs font-bold text-gray-400 mb-1">Interpretation</div>
            <div className="font-mono text-2xl font-bold text-green-400">{interpretation}</div>
        </div>
      </div>
      
      <div className="font-mono text-xs mb-2 text-gray-400 uppercase tracking-wider">Frame-by-Frame Analysis</div>
      <div className="overflow-x-auto border border-gray-700 rounded-lg bg-[var(--code-bg)]">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-xs uppercase text-gray-400">
            <tr>
              <th className="p-3">Anchor</th>
              <th className="p-3">Time</th>
              <th className="p-3">Source A Preview</th>
              <th className="p-3">Source B Preview</th>
              <th className="p-3">pHash Delta</th>
              <th className="p-3">Hashes (A/B)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {samplesA.map((sampleA, i) => {
              const sampleB = samplesB[i];
              const pHashDelta = calculateHammingDistance(sampleA.p_hash_64, sampleB.p_hash_64);
              const deltaColor = pHashDelta === 0 ? 'text-green-400' : pHashDelta < 0.1 ? 'text-amber-400' : 'text-red-400';

              return (
                <tr key={sampleA.index} className="hover:bg-gray-800/30">
                  <td className="p-3 font-bold">{sampleA.index}</td>
                  <td className="p-3">{sampleA.t_sec.toFixed(2)}s</td>
                  <td className="p-3"><img src={sampleA.preview_jpeg_data_url} alt={`Source A Frame ${sampleA.index}`} className="w-32 h-20 object-cover rounded-md border border-blue-500/50 bg-blue-900" /></td>
                  <td className="p-3"><img src={sampleB.preview_jpeg_data_url} alt={`Source B Frame ${sampleB.index}`} className="w-32 h-20 object-cover rounded-md border border-red-500/50 bg-red-900" /></td>
                  <td className={`p-3 font-mono font-bold text-lg ${deltaColor}`}>
                    {(pHashDelta * 100).toFixed(2)}%
                  </td>
                  <td className="p-3 font-mono text-gray-500 text-[10px] leading-tight">
                    <p>A: {sampleA.p_hash_64}</p>
                    <p>B: {sampleB.p_hash_64}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-center text-xs text-gray-500 mt-3 font-serif italic">
        NOTE: Previews are shown as solid colors for this demo. A real analysis would display the captured video thumbnails.
      </div>
    </div>
  );
};
