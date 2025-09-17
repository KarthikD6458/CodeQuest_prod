// src/components/search/AlternativeButtons.jsx
import React, { useState } from 'react';
import { 
  Zap, 
  FileText, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { searchAPI } from '../../services/api';
import ResponseCard from './ResponseCard';

const AlternativeButtons = ({ 
  questionText, 
  currentCode, 
  currentExplanation, 
  language, 
  sessionId 
}) => {
  const [loading, setLoading] = useState(false);
  const [activeApproach, setActiveApproach] = useState(null); // optimized, simplified, different
  const [alternativeResponse, setAlternativeResponse] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate alternative solution
  const generateAlternative = async (approach) => {
    if (loading) return;
    
    try {
      setLoading(true);
      setActiveApproach(approach);
      setError(null);
      
      // Create form data
      const formData = new FormData();
      formData.append('question_text', questionText || '');
      formData.append('current_code', currentCode || '');
      formData.append('current_explanation', currentExplanation || '');
      formData.append('language', language || 'python');
      formData.append('approach_type', approach);
      
      if (sessionId) {
        formData.append('session_id', sessionId);
      }
      
      // Generate alternative
      const response = await searchAPI.generateAlternative(formData);
      setAlternativeResponse(response.data);
      
    } catch (error) {
      console.error('Failed to generate alternative:', error);
      setError('Failed to generate alternative solution. Please try again.');
      toast.error('Failed to generate alternative solution');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle follow-up toggle
  const handleFollowUpToggle = () => {
    setShowFollowUp(prev => !prev);
  };
  
  return (
    <div className="space-y-6 mt-6">
      {/* Alternative Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => generateAlternative('optimized')}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
            loading && activeApproach === 'optimized'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/30'
          }`}
        >
          {loading && activeApproach === 'optimized' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 dark:border-blue-300 mr-2"></div>
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Optimized Approach
        </button>
        
        <button
          onClick={() => generateAlternative('simplified')}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
            loading && activeApproach === 'simplified'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/30'
          }`}
        >
          {loading && activeApproach === 'simplified' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 dark:border-green-300 mr-2"></div>
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Simplified Approach
        </button>
        
        <button
          onClick={() => generateAlternative('different')}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
            loading && activeApproach === 'different'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/30'
          }`}
        >
          {loading && activeApproach === 'different' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 dark:border-purple-300 mr-2"></div>
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Alternative Approach
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Alternative Solution */}
      {alternativeResponse && (
        <div className="mt-8">
          <div className="mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {alternativeResponse.approach_type === 'optimized' && 'Optimized Approach'}
              {alternativeResponse.approach_type === 'simplified' && 'Simplified Approach'}
              {alternativeResponse.approach_type === 'different' && 'Alternative Approach'}
            </h3>
          </div>
          
          <ResponseCard
            response={alternativeResponse}
            onFollowUpClick={handleFollowUpToggle}
          />
        </div>
      )}
    </div>
  );
};

export default AlternativeButtons;