
import React from 'react';
import { TridentScore, TridentConfig } from '../src/lib/trident-engine';

interface ScoreCompositionTableProps {
  score: {
    breakdown: TridentScore['breakdown'];
    config: TridentConfig;
  };
}

export const ScoreCompositionTable: React.FC<ScoreCompositionTableProps> = ({ score }) => {
  const { breakdown, config } = score;

  const analysisRows = [
    { name: 'pHash', ...breakdown.pHash },
    { name: 'SSIM', ...breakdown.ssim },
    { name: 'Features', ...breakdown.features },
    { name: 'Semantic', ...breakdown.semantic },
  ];

  return (
    <div className="border border-[var(--border-light)] rounded bg-white/60 p-3">
      <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Score Composition (Mode: {config.mode})</h5>
      <table className="w-full text-[10px] font-mono">
        <thead>
          <tr className="border-b border-[var(--border-light)]">
            <th className="py-1 pr-2 text-left opacity-60">Component</th>
            <th className="py-1 px-2 text-right opacity-60">Weight</th>
            <th className="py-1 pl-2 text-right opacity-60">Contribution</th>
          </tr>
        </thead>
        <tbody>
          {analysisRows.map(row => (
            <tr key={row.name} className="border-b border-[var(--border-light)]">
              <td className="py-1 pr-2 font-bold">{row.name}</td>
              <td className="py-1 px-2 text-right">{(row.weight * 100).toFixed(0)}%</td>
              <td className="py-1 pl-2 font-bold text-right">{row.contribution.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
