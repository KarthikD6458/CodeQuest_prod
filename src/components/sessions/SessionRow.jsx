// src/components/sessions/SessionRow.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  StopCircle, 
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../services/utils';

const SessionRow = ({ 
  session, 
  onViewResults, 
  onEndSession, 
  onDelete 
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {session.candidate_name}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{session.company_name}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(session.session_date)}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          session.is_active
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {session.is_active ? 'Active' : 'Completed'}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {session.total_searches || 0}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatTimeAgo(session.created_at)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <Link
            to={`/sessions/${session.id}`}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
          
          <button
            onClick={() => onViewResults(session)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="sr-only">Results</span>
          </button>
          
          {session.is_active && (
            <button
              onClick={() => onEndSession(session.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
            >
              <StopCircle className="h-4 w-4" />
              <span className="sr-only">End</span>
            </button>
          )}
          
          <button
            onClick={() => onDelete(session)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SessionRow;