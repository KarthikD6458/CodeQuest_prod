// src/components/sessions/CollaboratorBadge.jsx
import React from 'react';
import { X, UserCheck, Users, Eye } from 'lucide-react';

const CollaboratorBadge = ({ collaborator, onRemove }) => {
  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'lead':
        return <UserCheck className="h-3 w-3" />;
      case 'evaluator':
        return <Users className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };
  
  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'evaluator':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(collaborator.role)}`}>
      <span className="mr-1">
        {getRoleIcon(collaborator.role)}
      </span>
      {collaborator.username}
      {onRemove && (
        <button
          onClick={() => onRemove(collaborator.user_id)}
          className="ml-1 inline-flex items-center justify-center rounded-full h-4 w-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default CollaboratorBadge;