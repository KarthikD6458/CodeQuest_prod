// src/components/sessions/SessionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  Building, 
  Calendar, 
  Clock, 
  Search, 
  FileText, 
  Download,
  StopCircle,
  Play,
  UserPlus,
  Edit,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';
import { sessionsAPI } from '../../services/api';
import { formatDate, formatDateTime } from '../../services/utils';
import CollaboratorBadge from './CollaboratorBadge';
import CollaboratorModal from './CollaboratorModal';
import SessionNotesPanel from './SessionNotesPanel';
import SearchResultsList from './SearchResultsList';
import Spinner from '../common/Spinner';
import ReportFormatSelector from './ReportFormatSelector';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { endSession } = useApp();
  
  // State
  const [session, setSession] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReportFormatModal, setShowReportFormatModal] = useState(false);
  
  // Load session data
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);
        const response = await sessionsAPI.getSession(sessionId);
        setSession(response.data);
        
        // Load results
        await loadSessionResults();
      } catch (error) {
        console.error('Failed to load session:', error);
        toast.error('Failed to load session details');
        navigate('/sessions');
      } finally {
        setLoading(false);
      }
    };
    
    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId]);
  
  // Load session results
  const loadSessionResults = async () => {
    try {
      setResultsLoading(true);
      const response = await sessionsAPI.getSessionResults(sessionId);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to load session results:', error);
      toast.error('Failed to load session results');
    } finally {
      setResultsLoading(false);
    }
  };
  
  // Handle adding collaborator
  const handleAddCollaborator = async (userId, role) => {
    try {
      await sessionsAPI.addCollaborator(sessionId, userId, role);
      
      // Refresh session data
      const response = await sessionsAPI.getSession(sessionId);
      setSession(response.data);
      
      toast.success('Collaborator added successfully');
    } catch (error) {
      console.error('Failed to add collaborator:', error);
      toast.error('Failed to add collaborator');
    }
  };
  
  // Handle removing collaborator
  const handleRemoveCollaborator = async (userId) => {
    try {
      await sessionsAPI.removeCollaborator(sessionId, userId);
      
      // Refresh session data
      const response = await sessionsAPI.getSession(sessionId);
      setSession(response.data);
      
      toast.success('Collaborator removed successfully');
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
      toast.error('Failed to remove collaborator');
    }
  };
  
  // Handle ending session
  const handleEndSession = async (formatType) => {
    try {
      const result = await endSession(sessionId, formatType);
      if (result.success && result.documentPath) {
        const fullUrl = `${window.location.origin}${result.documentPath}`;
        window.open(fullUrl, '_blank');
        
        // Refresh session data
        const response = await sessionsAPI.getSession(sessionId);
        setSession(response.data);
        
        toast.success('Session ended and report generated');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to end session');
    }
    
    setShowReportFormatModal(false);
  };
  
  // Handle continuing session
  const handleContinueSession = () => {
    navigate('/search');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The session you're looking for does not exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/sessions')}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sessions
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/sessions')}
            className="mr-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {session.candidate_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {session.company_name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(session.session_date)}
              </div>
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-1" />
                {session.total_searches} questions
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Created {formatDateTime(session.created_at)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {session.is_active && (
            <button
              onClick={handleContinueSession}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Play className="h-4 w-4 mr-2" />
              Continue Session
            </button>
          )}
          
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-4 py-2 ${
              showNotes 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            } rounded-lg hover:bg-purple-700 hover:text-white flex items-center`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          
          <button
            onClick={() => setShowCollaboratorModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Manage Collaborators
          </button>
          
          {session.is_active ? (
            <button
              onClick={() => setShowReportFormatModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              End Session
            </button>
          ) : (
            <button
              onClick={() => setShowReportFormatModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </button>
          )}
        </div>
      </div>
      
      {/* Status & Collaborators */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${session.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} mr-2`}></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {session.is_active ? 'Active Session' : 'Completed Session'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 mr-1">Collaborators:</span>
            {session.collaborators && session.collaborators.length > 0 ? (
              session.collaborators.map((collab, index) => (
                <CollaboratorBadge 
                  key={index} 
                  collaborator={collab} 
                  onRemove={handleRemoveCollaborator}
                />
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm italic">No collaborators</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Session notes and results */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Session notes panel */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="w-full lg:w-1/3"
          >
            <SessionNotesPanel 
              sessionId={sessionId} 
              onNoteAdded={loadSessionResults}
            />
          </motion.div>
        )}
        
        {/* Session results */}
        <div className={`w-full ${showNotes ? 'lg:w-2/3' : 'lg:w-full'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Session Results ({results.length})
              </h3>
            </div>
            
            {resultsLoading ? (
              <div className="p-12 text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Loading session results...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Yet</h3>
                <p className="text-gray-600 dark:text-gray-300">No search results in this session yet</p>
                
                {session.is_active && (
                  <button
                    onClick={handleContinueSession}
                    className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Coding Search
                  </button>
                )}
              </div>
            ) : (
              <SearchResultsList 
                results={results} 
                sessionId={sessionId}
                onNoteAdded={loadSessionResults}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Collaborator Modal */}
      {showCollaboratorModal && (
        <CollaboratorModal
          sessionId={sessionId}
          existingCollaborators={session.collaborators || []}
          onClose={() => setShowCollaboratorModal(false)}
          onAddCollaborator={handleAddCollaborator}
        />
      )}
      
      {/* Report Format Modal */}
      {showReportFormatModal && (
        <ReportFormatSelector
          onClose={() => setShowReportFormatModal(false)}
          onSelect={handleEndSession}
          isActive={session.is_active}
        />
      )}
    </div>
  );
};

export default SessionDetail;