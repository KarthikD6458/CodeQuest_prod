// src/components/admin/UserDeleteModal.jsx
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Spinner from '../common/Spinner';

const UserDeleteModal = ({ user, onClose, onUserDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  
  // Handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      // In a real app, you would make an API call here
      // For now, let's simulate a successful deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUserDeleted();
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete User
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
            Confirm User Deletion
          </h4>
          
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            Are you sure you want to delete the user <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>? This action cannot be undone.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              All associated data for this user will be permanently deleted. This includes session history, saved items, and personal settings.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDeleteModal;