// src/components/sessions/SearchResultsList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  MessageSquare, 
  Clock, 
  User, 
  Eye, 
  Star, 
  Edit
} from 'lucide-react';
import { formatTimeAgo } from '../../services/utils';

const SearchResultsList = ({ results, sessionId, onNoteAdded }) => {
  // Add note to search result
  const handleAddNote = async (searchResultId) => {
    // In a real app, you would show a modal or input field to add a note
    // For now, we'll just add a placeholder note
    console.log('Add note for search result:', searchResultId);
    
    // Notify parent if callback provided
    if (onNoteAdded) {
      onNoteAdded();
    }
  };
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {results.map((result, index) => (
        <div key={index} className="p-6">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <Code className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {result.question_text || `Search ${index + 1}`}
              </h4>
              
              {/* Language and metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                {result.language && (
                  <span className="flex items-center">
                    <Code className="h-4 w-4 mr-1" />
                    {result.language.toUpperCase()}
                  </span>
                )}
                
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTimeAgo(result.created_at)}
                </span>
                
                {result.user && (
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {result.user}
                  </span>
                )}
                
                {result.notes_count > 0 && (
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {result.notes_count} note{result.notes_count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              {/* Code preview */}
              {result.code_snippet && (
                <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                    <code>
                      {result.code_snippet.length > 300 
                        ? result.code_snippet.substring(0, 300) + '...' 
                        : result.code_snippet}
                    </code>
                  </pre>
                </div>
              )}
              
              {/* Explanation preview */}
              {result.explanation && (
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  {result.explanation}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleAddNote(result.id)}
                  className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800/30"
                >
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  Add Note
                </button>
                
                <Link 
                  to={`/search?result=${result.id}`}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/30"
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  View Details
                </Link>
                
                <button
                  className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800/30"
                >
                  <Star className="h-4 w-4 mr-1.5" />
                  Save Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsList;