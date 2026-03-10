
import React from 'react';

const SignetLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a2f35"/>
        <stop offset="100%" stopColor="#000000"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="128" fill="url(#logo_grad)"/>
    <path d="M0 440h512v72H0z" fill="#0055FF" fillOpacity="0.9"/>
    <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="280" fill="#FFFFFF" letterSpacing="-14">SA</text>
    <circle cx="400" cy="110" r="28" fill="#0055FF" stroke="#1B1F23" strokeWidth="20"/>
  </svg>
);

export default SignetLogo;
