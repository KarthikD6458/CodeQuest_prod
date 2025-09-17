// src/components/sessions/SessionResultsModal.jsx
import React, { useState } from 'react';
import { X, Download, Search, Code, Eye, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate, formatTimeAgo } from '../../services/utils';
import Spinner from '../common/Spinner';

const SessionResultsModal = ({ session, results, loading, onClose, onEndSession }) => {
  // State
  const [selectedFormat, setSelectedFormat] = useState('md');
  const [endingSession, setEndingSession] = useState(false);
  
  // Handle download report
  const handleDownloadReport = () => {
    // If session is still active, end it first
    if (session.is_active) {
      handleEndSession();
    } else {
      // In a real app, you would call an API to get the report in the selected format
      console.log('Download report in format:', selectedFormat);
    }
  };
  
  // Handle end session
  const handleEndSession = async () => {
    try {
      setEndingSession(true);
      await onEndSession(session.id, selectedFormat);
      setEndingSession(false);
    } catch (error) {
      console.error('Error ending session:', error);
      setEndingSession(false);
    }
  };
  
  // Format selection
  const formatOptions = [
    { value: 'md', label: 'Markdown (.md)' },
    { value: 'pdf', label: 'PDF Document (.pdf)' },
    { value: 'docx', label: 'Word Document (.docx)' },
    { value: 'html', label: 'HTML (.html)' },
    { value: 'json', label: 'JSON (.json)' },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Session Results: {session.candidate_name}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Session Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Candidate</p>
                <p className="font-medium text-gray-900 dark:text-white">{session.candidate_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                <p className="font-medium text-gray-900 dark:text-white">{session.company_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(session.session_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {session.is_active ? 'Active' : 'Completed'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Results List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h4>
              <p className="text-gray-600 dark:text-gray-300">
                This session doesn't have any search results yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Search Results ({results.length})
              </h4>
              
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.question_text || `Search ${index + 1}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(result.created_at)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start space-x-2">
                        <Code className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {result.language && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                                {result.language.toUpperCase()}
                              </span>
                            )}
                            {result.code_blocks ? `${result.code_blocks.length} code blocks` : 'Solution'}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {result.explanation?.substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <button
                          className="inline-flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Format
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="block w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {formatOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Close
              </button>
              
              <button
                onClick={handleDownloadReport}
                disabled={endingSession}
                className={`px-4 py-2 rounded-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed ${
                  session.is_active 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {endingSession ? (
                  <Spinner size="sm" className="mr-2" />
                ) : session.is_active ? (
                  <StopCircle className="h-4 w-4 mr-1.5" />
                ) : (
                  <Download className="h-4 w-4 mr-1.5" />
                )}
                {session.is_active ? 'End Session & Generate Report' : 'Download Report'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionResultsModal;