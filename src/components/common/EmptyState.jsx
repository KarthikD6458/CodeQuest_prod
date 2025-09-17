// src/components/common/EmptyState.jsx
import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  ctaText, 
  onCtaClick,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center ${className}`}>
      {Icon && <Icon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />}
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        {description}
      </p>
      
      {ctaText && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;