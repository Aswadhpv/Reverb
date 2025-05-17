import React from 'react';
import './LogoR.css';

const LogoR = () => (
    <span
        className="text-4xl font-extrabold animate-breathing"
        style={{
            fontFamily: '"Fira Code", "Courier New", monospace',
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}
    >
    R
  </span>
);

export default LogoR;
