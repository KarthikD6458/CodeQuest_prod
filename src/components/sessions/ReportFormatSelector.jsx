// src/components/sessions/ReportFormatSelector.jsx
import React, { useState } from 'react';
import { X, Download, File, FileText, FileImage, FileCode, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportFormatSelector = ({ onClose, onSelect, isActive }) => {
  const [selectedFormat, setSelectedFormat] = useState('md');
  
  // Available formats
  const formats = [
    { 
      id: 'md', 
      name: 'Markdown', 
      extension: '.md', 
      icon: FileText,
      description: 'Simple text format with basic formatting'
    },
    { 
      id: 'pdf', 
      name: 'PDF Document', 
      extension: '.pdf', 
      icon: File,
      description: 'Portable document format for printing and sharing'
    },
    { 
      id: 'docx', 
      name: 'Word Document', 
      extension: '.docx', 
      icon: FileText,
      description: 'Microsoft Word format for easy editing'
    },
    { 
      id: 'html', 
      name: 'HTML', 
      extension: '.html', 
      icon: FileCode,
      description: 'Web format with rich formatting and styling'
    },
    { 
      id: 'json', 
      name: 'JSON', 
      extension: '.json', 
      icon: FileCode,
      description: 'Structured data format for programmatic access'
    }
  ];
  
  // Handle format selection
  const handleFormatSelect = (formatId) => {
    setSelectedFormat(formatId);
  };
  
  // Handle submit
  const handleSubmit = () => {
    onSelect(selectedFormat);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Download className="h-5 w-5 mr-2" />
            {isActive ? 'End Session & Generate Report' : 'Download Report'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {isActive 
              ? 'Choose a format for the session report. This will end the active session.'
              : 'Choose a format to download the session report.'}
          </p>
          
          <div className="space-y-2 mb-6">
            {formats.map(format => (
              <div
                key={format.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
                onClick={() => handleFormatSelect(format.id)}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${
                    selectedFormat === format.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <format.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {format.name} <span className="text-gray-500 dark:text-gray-400">{format.extension}</span>
                      </span>
                      {selectedFormat === format.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-1.5" />
              {isActive ? 'End & Generate' : 'Download'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportFormatSelector;