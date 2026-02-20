import React, { useMemo } from 'react';
import { AuditResult, FrameCandidate } from './scoring';

interface FrameAnalysisTableProps {
  auditResult: AuditResult;
  candidates: FrameCandidate[];
  onBack: () => void;
}

export const FrameAnalysisTable: React.FC<FrameAnalysisTableProps> = ({ auditResult, candidates, onBack }) => {
  // Helper to find candidate details
  const getCandidate = (id: string) => candidates.find(c => c.id === id);

  // Helper to parse timestamp from ID or Label
  const getTimestamp = (str: string): number => {
    const frameMatch = str.match(/frame_(\d+)/);
    if (frameMatch) return parseInt(frameMatch[1]);
    
    const labelMatch = str.match(/T\+(\d+)s/);
    if (labelMatch) return parseInt(labelMatch[1]);
    
    return 0;
  };

  // Compute Global Stats
  const stats = useMemo(() => {
    if (!auditResult.frameDetails) return null;
    
    const drifts: number[] = [];
    let matchCount = 0;
    let totalDist = 0;

    auditResult.frameDetails.forEach(row => {
      if (row.isMatch) matchCount++;
      totalDist += row.visualDistance;
      
      const refTime = getTimestamp(row.refLabel);
      const cand = getCandidate(row.bestCandId);
      if (cand && cand.timestamp !== undefined) {
        drifts.push(cand.timestamp - refTime);
      }
    });

    const avgDist = totalDist / auditResult.frameDetails.length;
    
    // Median Drift (Global Shift)
    drifts.sort((a, b) => a - b);
    const medianDrift = drifts.length > 0 
      ? drifts[Math.floor(drifts.length / 2)] 
      : 0;

    return { matchCount, avgDist, medianDrift, total: auditResult.frameDetails.length };
  }, [auditResult, candidates]);

  if (!auditResult.frameDetails || auditResult.frameDetails.length === 0) {
    return <div className="p-8 text-center opacity-50">No frame data available.</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-standard)] p-8 animate-in fade-in duration-500 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-light)] pb-6">
          <div>
            <button 
              onClick={onBack}
              className="text-[10px] font-mono uppercase font-bold text-[var(--trust-blue)] hover:underline mb-3 flex items-center gap-1"
            >
              <span>←</span> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold italic font-serif text-[var(--text-header)] mb-2">
              Frame Analysis <span className="opacity-40 not-italic">Visual Chain</span>
            </h1>
            <p className="font-mono text-[11px] uppercase opacity-60 tracking-widest">
              Temporal Alignment & Visual Drift Report
            </p>
          </div>

          {/* Global Stats Cards */}
          {stats && (
            <div className="flex gap-4">
              <div className="bg-white border border-[var(--border-light)] rounded-lg p-3 min-w-[100px]">
                <div className="text-[9px] font-mono uppercase opacity-50 mb-1">Global Shift</div>
                <div className={`text-xl font-bold font-mono ${stats.medianDrift === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {stats.medianDrift > 0 ? '+' : ''}{stats.medianDrift}s
                </div>
              </div>
              <div className="bg-white border border-[var(--border-light)] rounded-lg p-3 min-w-[100px]">
                <div className="text-[9px] font-mono uppercase opacity-50 mb-1">Avg Visual Δ</div>
                <div className="text-xl font-bold font-mono">
                  {stats.avgDist.toFixed(3)}
                </div>
              </div>
              <div className="bg-white border border-[var(--border-light)] rounded-lg p-3 min-w-[100px]">
                <div className="text-[9px] font-mono uppercase opacity-50 mb-1">Match Rate</div>
                <div className="text-xl font-bold font-mono">
                  {stats.matchCount}/{stats.total}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Table */}
        <div className="border border-[var(--border-light)] rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header)] border-b border-[var(--border-light)] text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4 w-1/3">Reference Anchor (Source A)</th>
                <th className="p-4 w-1/3">Best Candidate (Source B)</th>
                <th className="p-4 text-center">Alignment</th>
                <th className="p-4 text-right">Visual Diff (Δ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {auditResult.frameDetails.map((row, idx) => {
                const candidate = getCandidate(row.bestCandId);
                const refTime = getTimestamp(row.refLabel);
                const candTime = candidate?.timestamp ?? -1;
                const drift = candTime !== -1 ? candTime - refTime : null;
                
                // Drift Visualization
                const isAligned = drift === (stats?.medianDrift || 0);
                const driftColor = drift === 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                   Math.abs(drift || 0) <= 2 ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                   'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors group">
                    <td className="p-4 font-mono text-xs opacity-30 text-center">{idx + 1}</td>
                    
                    {/* Reference Column */}
                    <td className="p-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-20 bg-black rounded-md overflow-hidden border border-neutral-200 relative shadow-sm shrink-0">
                          {row.refMeta?.url ? (
                            <img src={row.refMeta.url} className="w-full h-full object-cover" alt="Ref" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[8px] text-white/50">NO IMG</div>
                          )}
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded font-mono backdrop-blur-sm">
                            {row.refLabel}
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="font-bold text-sm font-serif text-neutral-800">Reference Frame</div>
                          <div className="font-mono text-[10px] text-neutral-500 mt-1">
                            Timestamp: <span className="text-neutral-900 font-bold">{refTime}s</span>
                          </div>
                          <div className="font-mono text-[10px] text-neutral-400 mt-0.5">
                            Size: {row.refMeta?.size || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Candidate Column */}
                    <td className="p-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-20 bg-black rounded-md overflow-hidden border border-neutral-200 relative shadow-sm shrink-0">
                          {candidate?.imageUrl ? (
                            <img src={candidate.imageUrl} className="w-full h-full object-cover" alt="Cand" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[8px] text-white/50">NO IMG</div>
                          )}
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded font-mono backdrop-blur-sm">
                            {candidate ? `T+${candidate.timestamp}s` : 'No Match'}
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="font-bold text-sm font-serif text-neutral-800">
                            {candidate ? 'Matched Candidate' : 'No Candidate Found'}
                          </div>
                          {candidate && (
                            <>
                              <div className="font-mono text-[10px] text-neutral-500 mt-1">
                                Timestamp: <span className="text-neutral-900 font-bold">{candTime}s</span>
                              </div>
                              <div className="font-mono text-[10px] text-neutral-400 mt-0.5 truncate max-w-[120px]" title={row.bestCandId}>
                                ID: {row.bestCandId}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Alignment / Drift */}
                    <td className="p-4 text-center align-middle">
                      {drift !== null ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className={`font-mono text-xs font-bold px-2 py-1 rounded border ${driftColor}`}>
                            {drift > 0 ? `+${drift}s` : `${drift}s`}
                          </div>
                          <span className="text-[9px] font-mono uppercase opacity-40">
                            {drift === 0 ? 'Perfect Sync' : 'Temporal Shift'}
                          </span>
                        </div>
                      ) : (
                        <span className="opacity-20 font-mono text-xs">—</span>
                      )}
                    </td>

                    {/* Visual Diff */}
                    <td className="p-4 text-right align-middle">
                      <div className="flex flex-col items-end gap-1">
                        <div className="font-mono font-bold text-xl tracking-tight text-neutral-800">
                          {row.visualDistance.toFixed(4)}
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          row.isMatch 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {row.isMatch ? 'MATCH' : 'MISS'}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Debug Info */}
        <div className="bg-[var(--code-bg)] border border-[var(--border-light)] rounded-xl p-6 font-mono text-[10px] text-[var(--text-body)] opacity-60">
           <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
              <h3 className="uppercase font-bold tracking-widest">System Trace</h3>
           </div>
           <p>
             Alignment logic uses a multi-frame consensus window. Global shift is calculated via median drift. 
             Visual distance (Δ) is a fusion of pHash (Mean) and dHash (Gradient) Hamming distances.
           </p>
        </div>

      </div>
    </div>
  );
};
