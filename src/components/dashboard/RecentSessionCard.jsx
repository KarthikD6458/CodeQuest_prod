// src/components/dashboard/RecentSessionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Building, 
  Search, 
  Clock
} from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../services/utils';

const RecentSessionCard = ({ session }) => {
  return (
    <Link 
      to={`/sessions/${session.id}`}
      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
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
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span className="truncate">{session.company_name}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span>{formatDate(session.session_date)}</span>
        </div>
        
        <div className="flex items-center">
          <Search className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span>{session.total_searches || 0} search{session.total_searches !== 1 ? 'es' : ''}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span>{formatTimeAgo(session.created_at)}</span>
        </div>
      </div>
    </Link>
  );
};

export default RecentSessionCard;