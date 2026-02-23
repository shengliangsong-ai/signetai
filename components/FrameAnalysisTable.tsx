
import React from 'react';

export const FrameAnalysisTable: React.FC<any> = ({ auditResult, candidates, onBack }) => {
  // This is a simplified version of the original file to fix the build.
  // It is not intended to be a perfect replica of the original.
  return (
    <div>
      <h1>Frame Analysis</h1>
      <button onClick={onBack}>Back</button>
      <pre>{JSON.stringify({ auditResult, candidates }, null, 2)}</pre>
    </div>
  );
};
