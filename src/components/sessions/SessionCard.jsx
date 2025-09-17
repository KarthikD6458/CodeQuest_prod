// src/components/sessions/SessionCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Building, 
  Clock, 
  Search, 
  Eye, 
  StopCircle, 
  Trash2,
  ChevronRight,
  Users
} from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../services/utils';

const SessionCard = ({ 
  session, 
  onViewResults, 
  onEndSession,
  onDelete,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Status bar */}
      <div className={`h-2 ${
        session.is_active 
          ? 'bg-green-500' 
          : 'bg-gray-300 dark:bg-gray-600'
      }`}></div>
      
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
            {session.candidate_name}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            session.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {session.is_active ? 'Active' : 'Completed'}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="truncate">{session.company_name}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span>{formatDate(session.session_date)}</span>
          </div>
          
          <div className="flex items-center">
            <Search className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span>{session.total_searches || 0} search{session.total_searches !== 1 ? 'es' : ''}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span>Created {formatTimeAgo(session.created_at)}</span>
          </div>
          
          {session.collaborators && session.collaborators.length > 0 && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span>{session.collaborators.length} collaborator{session.collaborators.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/sessions/${session.id}`}
            className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800/30 flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Link>
          
          <button
            onClick={() => onViewResults(session)}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/30 flex items-center"
          >
            <Search className="h-4 w-4 mr-1" />
            View Results
          </button>
          
          {session.is_active && (
            <button
              onClick={() => onEndSession(session.id)}
              className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/30 flex items-center"
            >
              <StopCircle className="h-4 w-4 mr-1" />
              End
            </button>
          )}
          
          <button
            onClick={() => onDelete(session)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;