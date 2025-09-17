// src/components/common/Spinner.jsx
import React from 'react';

const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4"
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`${spinnerSize} border-gray-300 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-500 rounded-full animate-spin ${className}`}></div>
  );
};

export default Spinner;