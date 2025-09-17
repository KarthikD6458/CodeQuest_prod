// src/components/questions/QuestionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  Star, 
  Clock, 
  Eye, 
  Tag,
  ThumbsUp,
  BookmarkCheck
} from 'lucide-react';
import { formatTimeAgo } from '../../services/utils';

const QuestionCard = ({ question, delay = 0 }) => {
  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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
  
  // Get language icon/label
  const getLanguageLabel = (language) => {
    const languageMap = {
      'python': { icon: '🐍', label: 'Python' },
      'javascript': { icon: '🟨', label: 'JavaScript' },
      'typescript': { icon: '🔷', label: 'TypeScript' },
      'java': { icon: '☕', label: 'Java' },
      'csharp': { icon: '#️⃣', label: 'C#' },
      'cpp': { icon: '⚡', label: 'C++' },
      'go': { icon: '🐹', label: 'Go' },
      'ruby': { icon: '💎', label: 'Ruby' },
      'swift': { icon: '🦅', label: 'Swift' },
      'kotlin': { icon: '🎯', label: 'Kotlin' },
      'rust': { icon: '🦀', label: 'Rust' }
    };
    
    return languageMap[language.toLowerCase()] || { icon: '📄', label: language.toUpperCase() };
  };
  
  const languageInfo = getLanguageLabel(question.language);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
    >
      <Link to={`/questions/${question.id}`} className="block">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-lg mr-2">{languageInfo.icon}</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {languageInfo.label}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {question.question_text}
          </h3>
          
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
              {question.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs">
                  +{question.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {question.view_count || 0}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {question.like_count || 0}
              </span>
            </div>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTimeAgo(question.created_at)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuestionCard;