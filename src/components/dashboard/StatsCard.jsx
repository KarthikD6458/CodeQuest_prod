// src/components/dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ icon: Icon, iconColor, bgColor, title, value }) => {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className={`flex items-center justify-center p-3 rounded-lg mr-4 ${bgColor}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;