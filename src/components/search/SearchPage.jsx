// src/components/search/SearchPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Send, 
  Star, 
  Clock, 
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  LoaderCircle,
  Copy,
  Zap,
  Brain,
  Code,
  MessageSquare,
  RefreshCw,
  Target, 
  Bug, 
  Check, 
  Bookmark, 
  BookmarkCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { searchAPI, promptsAPI } from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import SessionSelector from '../sessions/SessionSelector';
import LanguageSelector from '../common/LanguageSelector';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import ResponseCard from './ResponseCard';
import AlternativeButtons from './AlternativeButtons';
import FollowUpChat from './FollowUpChat';

const SearchPage = () => {
  const { activeSession } = useApp();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResponse, setSearchResponse] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const suggestionsTimeoutRef = useRef(null);
  
  // Set active session ID on component mount
  useEffect(() => {
    if (activeSession) {
      setSessionId(activeSession.id);
    }
  }, [activeSession]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
      
      // Revoke object URLs for previews
      previewImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [previewImages]);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxSize: 10485760, // 10MB
    onDrop: acceptedFiles => {
      // Create preview images
      const newPreviews = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);
      setUploadedImages(prev => [...prev, ...acceptedFiles]);
    },
    onDropRejected: rejectedFiles => {
      rejectedFiles.forEach(rejected => {
        if (rejected.errors[0].code === 'file-too-large') {
          toast.error(`File ${rejected.file.name} is too large (max 10MB)`);
        } else {
          toast.error(`File ${rejected.file.name} was rejected: ${rejected.errors[0].message}`);
        }
      });
    }
  });
  
  // Remove image from preview and uploaded images
  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index].preview);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle query change and fetch suggestions
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous timeout
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }
    
    if (value.length >= 3) {
      setIsLoadingSuggestions(true);
      suggestionsTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await searchAPI.getSuggestions(value, language);
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    
    // Set language if available
    if (suggestion.language && suggestion.language !== 'all') {
      setLanguage(suggestion.language);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate input
    if (!query.trim() && uploadedImages.length === 0) {
      toast.error('Please enter a query or upload an image');
      return;
    }
    
    if (!sessionId) {
      toast.error('Please select or create a session');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('query', query);
      formData.append('language_filter', language);
      formData.append('session_id', sessionId);
      
      // Add images
      uploadedImages.forEach(image => {
        formData.append('images', image);
      });
      
      // Submit search
      const response = await searchAPI.search(formData);
      
      if (!response.data) {
        throw new Error('No data received from the server');
      }
      
      console.log('Search response:', response.data);
      setSearchResponse(response.data);
      setUploadedImages([]);
      setPreviewImages([]);
      
      // Clear query after successful search
      setQuery('');
      
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to process search. Please try again.');
      toast.error('Failed to process search. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
  };
  
  // Handle session change
  const handleSessionChange = (sessionId) => {
    setSessionId(sessionId);
  };
  
  // Handle follow-up toggle
  const handleFollowUpToggle = () => {
    setShowFollowUp(prev => !prev);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Code Search
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ask programming questions or upload images of code to get AI-powered solutions
          </p>
        </motion.div>
        
        {/* Session Info & Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
        >
          <SessionSelector 
            selectedSessionId={sessionId} 
            onSessionChange={handleSessionChange} 
          />
          
          <LanguageSelector
            value={language}
            onChange={handleLanguageChange}
            className="w-full md:w-48"
          />
        </motion.div>
        
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Enter a programming question or code snippet..."
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onBlur={() => {
                  // Delay hiding suggestions to allow for clicks
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onFocus={() => {
                  if (query.length >= 3 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 max-h-80 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                      <LoaderCircle className="h-5 w-5 animate-spin mx-auto mb-2" />
                      Loading suggestions...
                    </div>
                  ) : (
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-start">
                            {suggestion.type === 'question' ? (
                              <FileText className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Code className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-gray-800 dark:text-gray-200">{suggestion.text}</p>
                              {suggestion.language && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Language: {suggestion.language.toUpperCase()}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            {/* Image Upload */}
            <div className="mb-4">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-2 py-4">
                  <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {isDragActive
                      ? "Drop images here..."
                      : "Drag & drop images here, or click to select files"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports: JPG, PNG, GIF, WEBP (max 10MB)
                  </p>
                </div>
              </div>
              
              {/* Preview Images */}
              {previewImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {previewImages.map((file, index) => (
                    <div 
                      key={index} 
                      className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <img 
                        src={file.preview} 
                        alt={`Preview ${index}`} 
                        className="h-20 w-20 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-black/80"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || (!query.trim() && uploadedImages.length === 0) || !sessionId}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        {/* Search Results */}
        {searchResponse && (
          <div className="mb-8">
            <ResponseCard 
              response={searchResponse}
              onFollowUpClick={handleFollowUpToggle}
            />
            
            {/* Alternative Solution Buttons */}
            {searchResponse.can_generate_alternative && (
              <AlternativeButtons 
                questionText={searchResponse.question_text || ""}
                currentCode={searchResponse.code_blocks && searchResponse.code_blocks[0] ? 
                  searchResponse.code_blocks[0].code || "" : ""}
                currentExplanation={searchResponse.explanation || ""}
                language={searchResponse.language || "python"}
                sessionId={sessionId}
              />
            )}
          </div>
        )}
        
        {/* Follow-up Chat */}
        {showFollowUp && searchResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8"
          >
            <FollowUpChat 
              previousResult={searchResponse}
              sessionId={sessionId}
              onClose={() => setShowFollowUp(false)}
            />
          </motion.div>
        )}
        
        {/* Empty State */}
        {!searchResponse && !isSubmitting && !error && (
          <EmptyState
            icon={Brain}
            title="Ask a programming question"
            description="Enter a query above or upload an image of code to get started"
            className="mt-12"
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;