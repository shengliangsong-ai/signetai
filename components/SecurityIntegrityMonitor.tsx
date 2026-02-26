
import React from 'react';

const SecurityFeature: React.FC<{ title: string; value: string; status: string; statusColor: string }> = ({ title, value, status, statusColor }) => (
  <tr>
    <td className="p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-header)] font-bold">{title}</div>
      <div className="font-mono text-[10px] text-[var(--text-body)] opacity-60 italic">{value}</div>
    </td>
    <td className="p-3 text-right">
      <div className={`inline-block text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-1 border ${statusColor}`}>
        [{status}]
      </div>
    </td>
  </tr>
);

export const SecurityIntegrityMonitor: React.FC = () => {
  const confidence = 0.9997;
  const confidencePercentage = confidence * 100;

  return (
    <div className="space-y-6">
      <div className="border border-[var(--border-light)] rounded overflow-hidden">
        <table className="w-full text-[10px] text-left">
          <tbody className="divide-y divide-[var(--border-light)]">
            <SecurityFeature title="Referrer Shield" value="signetai.io only" status="ENFORCED" statusColor="text-green-400 border-green-400/50" />
            <SecurityFeature title="Local Vault" value="IndexedDB isolated" status="SEALED" statusColor="text-green-400 border-green-400/50" />
            <SecurityFeature title="Master Signatory" value="signetai.io:ssl" status="LOCKED" statusColor="text-green-400 border-green-400/50" />
            <SecurityFeature title="Project Isolation" value="signetai_prod" status="ACTIVE" statusColor="text-blue-400 border-blue-400/50" />
          </tbody>
        </table>
      </div>
      <div className="space-y-3 pt-2">
        <div className="w-full bg-[var(--border-light)] rounded-full h-1.5">
          <div 
            className="bg-[var(--trust-blue)] h-1.5 rounded-full" 
            style={{ width: `${confidencePercentage}%` }}
          ></div>
        </div>
        <div className="text-center">
          <span className="font-mono text-[10px] text-[var(--text-body)] opacity-60 tracking-widest">
            INTEGRITY CONFIDENCE: {confidence.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
};
