// src/components/questions/QuestionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Code, 
  Tag, 
  Eye, 
  ThumbsUp, 
  Share, 
  Clock, 
  Download,
  Copy,
  Check,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { codeQuestionsAPI } from '../../services/api';
import { formatDate, formatTimeAgo, copyToClipboard } from '../../services/utils';
import Markdown from '../common/Markdown';
import Spinner from '../common/Spinner';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Load question data
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        const response = await codeQuestionsAPI.getQuestion(questionId);
        setQuestion(response.data);
      } catch (error) {
        console.error('Failed to load question:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestion();
  }, [questionId]);
  
  // Handle copy code to clipboard
  const handleCopyCode = async () => {
    if (!question) return;
    
    const success = await copyToClipboard(question.code_snippet);
    
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  // Handle like/unlike
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // In a real implementation, you would call an API here
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Question Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The question you're looking for does not exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/questions')}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/questions')}
          className="mr-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Code Question
          </h1>
          <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
            <span className="mr-3">{question.language.toUpperCase()}</span>
            <span className="mr-3">•</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="mx-3">•</span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTimeAgo(question.created_at)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Question and Code */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {question.question_text}
              </h2>
              
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm"
                    >
                      <Tag className="h-3.5 w-3.5 mr-1.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mb-6">
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">
                      {question.language.toUpperCase()}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-gray-300 hover:text-white transition-colors"
                      title="Copy Code"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={question.language}
                    style={vs2015}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '14px',
                      padding: '1rem'
                    }}
                  >
                    {question.code_snippet}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Explanation
              </h3>
            </div>
            
            <div className="p-6 prose prose-slate dark:prose-invert max-w-none">
              <Markdown>{question.explanation}</Markdown>
            </div>
            
            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleLikeToggle}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isLiked
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4 mr-1.5" />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
                
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              
              <div>
                <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Share className="h-4 w-4 mr-1.5" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden sticky top-24"
          >
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Question Info
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Language</span>
                  <span className="text-gray-900 dark:text-white">
                    {question.language.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Added On</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(question.created_at)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Views</span>
                  <span className="text-gray-900 dark:text-white">
                    {question.view_count || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Likes</span>
                  <span className="text-gray-900 dark:text-white">
                    {question.like_count || 0}
                  </span>
                </div>
                
                {question.complexity_score && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Complexity</span>
                    <span className="text-gray-900 dark:text-white">
                      {question.complexity_score.toFixed(1)}/10
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center">
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Save Question
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;