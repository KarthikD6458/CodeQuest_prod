// src/components/sessions/CollaboratorModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Spinner from '../common/Spinner';

const CollaboratorModal = ({ 
  sessionId, 
  existingCollaborators = [], 
  onClose, 
  onAddCollaborator 
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('observer');
  const [adding, setAdding] = useState(false);
  
  // Existing collaborator IDs
  const existingCollaboratorIds = existingCollaborators.map(c => c.user_id);
  
  // Effect to search users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
      
      try {
        setLoading(true);
        
        // In a real app, you would make an API call here
        // For now, let's mock some results
        setTimeout(() => {
          const mockUsers = [
            { id: '1', username: 'john_doe', email: 'john@example.com' },
            { id: '2', username: 'jane_smith', email: 'jane@example.com' },
            { id: '3', username: 'bob_johnson', email: 'bob@example.com' },
            { id: '4', username: 'alice_williams', email: 'alice@example.com' },
            { id: '5', username: 'charlie_brown', email: 'charlie@example.com' },
          ];
          
          const filteredUsers = mockUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          setSearchResults(filteredUsers);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error searching users:', error);
        setLoading(false);
      }
    };
    
    searchUsers();
  }, [searchTerm]);
  
  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  
  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  
  // Handle add collaborator
  const handleAddCollaborator = async () => {
    if (!selectedUser) return;
    
    try {
      setAdding(true);
      await onAddCollaborator(selectedUser.id, selectedRole);
      setAdding(false);
      onClose();
    } catch (error) {
      console.error('Error adding collaborator:', error);
      setAdding(false);
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
        <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Add Collaborator
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          {/* Search Results */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Results
            </h4>
            
            {loading ? (
              <div className="py-4 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                {searchTerm.length < 2 
                  ? 'Type at least 2 characters to search' 
                  : 'No users found'}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map(user => {
                  const isExistingCollaborator = existingCollaboratorIds.includes(user.id);
                  
                  return (
                    <div 
                      key={user.id} 
                      className={`p-3 ${
                        selectedUser?.id === user.id 
                          ? 'bg-purple-50 dark:bg-purple-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      } rounded-lg mb-2 cursor-pointer flex items-center justify-between ${
                        isExistingCollaborator ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => !isExistingCollaborator && handleSelectUser(user)}
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      
                      {isExistingCollaborator ? (
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                          Already added
                        </span>
                      ) : selectedUser?.id === user.id ? (
                        <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Role Selection */}
          {selectedUser && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Collaborator Role
              </label>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="lead">Lead Interviewer</option>
                <option value="evaluator">Evaluator</option>
                <option value="observer">Observer</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {selectedRole === 'lead' 
                  ? 'Can manage the session, add/remove collaborators, and end the session'
                  : selectedRole === 'evaluator'
                  ? 'Can add questions, evaluate solutions, and add notes'
                  : 'Can view the session but cannot make changes'}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            
            <button
              onClick={handleAddCollaborator}
              disabled={!selectedUser || adding}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adding ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-1.5" />
              )}
              Add Collaborator
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CollaboratorModal;