// src/components/sessions/SessionSelector.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatDate } from '../../services/utils';

const SessionSelector = ({ selectedSessionId, onSessionChange }) => {
  const { sessions, activeSession, loadSessions } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  
  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);
  
  // Set active session as selected if no session is selected
  useEffect(() => {
    if (!selectedSessionId && activeSession) {
      onSessionChange(activeSession.id);
    }
  }, [selectedSessionId, activeSession]);
  
  // Get selected session data
  const selectedSession = selectedSessionId 
    ? sessions.find(s => s.id === selectedSessionId) 
    : activeSession;
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle session selection
  const handleSessionSelect = (sessionId) => {
    onSessionChange(sessionId);
    setIsOpen(false);
  };
  
  // Filter active sessions only
  const activeSessions = sessions.filter(s => s.is_active);
  
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full md:w-64"
        onClick={toggleDropdown}
      >
        <div className="flex items-center truncate">
          <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 truncate">
            {selectedSession 
              ? selectedSession.candidate_name
              : 'Select a session'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {activeSessions.length > 0 ? (
            <ul>
              {activeSessions.map(session => (
                <li 
                  key={session.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedSessionId === session.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                  onClick={() => handleSessionSelect(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {session.candidate_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {session.company_name} • {formatDate(session.session_date)}
                      </div>
                    </div>
                    {selectedSessionId === session.id && (
                      <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
              No active sessions found
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-1 py-2 px-4">
            <Link
              to="/sessions/new"
              className="flex items-center justify-center w-full text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Session
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionSelector;