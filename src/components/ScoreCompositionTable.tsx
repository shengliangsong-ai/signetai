import React from 'react';

export const ScoreCompositionTable: React.FC<{ score: any }> = ({ score }) => {
  return (
    <div className="border border-[var(--border-light)] rounded bg-white/60 p-3">
      <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Analysis Breakdown</h5>
      <table className="w-full text-[10px] font-mono">
        <tbody>
          <tr className="border-b border-[var(--border-light)]">
            <td className="py-1 pr-2 opacity-60">Structural Similarity</td>
            <td className="py-1 font-bold text-right">{score.breakdown.structural}%</td>
          </tr>
          <tr className="border-b border-[var(--border-light)]">
            <td className="py-1 pr-2 opacity-60">Perceptual Similarity</td>
            <td className="py-1 font-bold text-right">{score.breakdown.perceptual}%</td>
          </tr>
          <tr>
            <td className="py-1 pr-2 opacity-60">Semantic Similarity</td>
            <td className="py-1 font-bold text-right">{score.breakdown.semantic}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
