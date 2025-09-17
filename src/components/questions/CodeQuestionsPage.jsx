// src/components/questions/CodeQuestionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  Search, 
  Filter, 
  Tag, 
  Clock, 
  Star, 
  Eye, 
  ChevronDown,
  BarChart2,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  Bookmark,
  ThumbsUp
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { codeQuestionsAPI } from '../../services/api';
import { formatDate, formatTimeAgo } from '../../services/utils';
import QuestionCard from './QuestionCard';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import LanguageSelector from '../common/LanguageSelector';

const CodeQuestionsPage = () => {
  // State
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    language: 'all',
    difficulty: '',
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const QUESTIONS_PER_PAGE = 12;
  
  // Load questions on mount and when filters change
  useEffect(() => {
    loadQuestions();
  }, [currentPage, filters.language, filters.difficulty, sortBy, sortOrder]);
  
  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      const response = await codeQuestionsAPI.getQuestions({
        q: search,
        language: filters.language !== 'all' ? filters.language : undefined,
        difficulty: filters.difficulty || undefined,
        tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        skip: (currentPage - 1) * QUESTIONS_PER_PAGE,
        limit: QUESTIONS_PER_PAGE
      });
      
      setQuestions(response.data.items);
      setTotalQuestions(response.data.total);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadQuestions();
  };
  
  // Handle language filter change
  const handleLanguageChange = (language) => {
    setFilters(prev => ({ ...prev, language }));
    setCurrentPage(1);
  };
  
  // Handle difficulty filter change
  const handleDifficultyChange = (difficulty) => {
    setFilters(prev => ({ 
      ...prev, 
      difficulty: prev.difficulty === difficulty ? '' : difficulty 
    }));
    setCurrentPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Code Library
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Browse and search for programming questions and solutions
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`ml-2 h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={loadQuestions}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
      >
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for code questions, algorithms, or concepts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="submit"
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="space-y-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <LanguageSelector
                  value={filters.language}
                  onChange={handleLanguageChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDifficultyChange('easy')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => handleDifficultyChange('medium')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handleDifficultyChange('hard')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.difficulty === 'hard'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="created_at">Date Added</option>
                    <option value="view_count">Most Viewed</option>
                    <option value="like_count">Most Liked</option>
                    <option value="complexity_score">Complexity</option>
                  </select>
                  <button
                    onClick={toggleSortOrder}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Questions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Questions Found"
            description="Try adjusting your search or filters to find questions"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CodeQuestionsPage;