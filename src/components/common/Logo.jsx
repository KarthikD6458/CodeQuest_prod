// src/components/common/Logo.jsx
import React from 'react';

const Logo = ({ className = 'h-8 w-auto' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path 
        d="M12 0L3 7v10l9 7 9-7V7L12 0zm0 4.2L18 8v8l-6 4.8-6-4.8V8l6-3.8z" 
        fill="url(#logo-gradient)" 
      />
      <path 
        d="M7.5 10.5l3 3-3 3M16.5 10.5l-3 3 3 3M13.5 9l-3 9" 
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none" 
      />
    </svg>
  );
};

export default Logo;