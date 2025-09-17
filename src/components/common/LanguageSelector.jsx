// src/components/common/LanguageSelector.jsx
import React from 'react';

const LANGUAGES = [
  { value: 'all', label: 'All Languages' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'csharp', label: 'C#', icon: '#️⃣' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'swift', label: 'Swift', icon: '🦅' },
  { value: 'kotlin', label: 'Kotlin', icon: '🎯' },
  { value: 'rust', label: 'Rust', icon: '🦀' }
];

const LanguageSelector = ({ 
  value, 
  onChange, 
  disabled = false,
  className = ""
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${className}`}
    >
      {LANGUAGES.map((language) => (
        <option key={language.value} value={language.value}>
          {language.icon ? `${language.icon} ` : ''}{language.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;