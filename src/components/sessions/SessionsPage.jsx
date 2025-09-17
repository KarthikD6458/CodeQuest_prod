// src/components/sessions/SessionsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  StopCircle, 
  Users, 
  Building, 
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Filter,
  RefreshCw,
  PlayCircle,
  Settings,
  TrendingUp,
  Award,
  Zap,
  Code2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';
import { sessionsAPI } from '../../services/api';
import { formatDate, formatTimeAgo } from '../../services/utils';
import SessionCard from './SessionCard';
import SessionRow from './SessionRow';
import CreateSessionModal from './CreateSessionModal';
import SessionResultsModal from './SessionResultsModal';
import DeleteSessionModal from './DeleteSessionModal';
import EmptyState from '../common/EmptyState';
import Spinner from '../common/Spinner';

const SessionsPage = ({ action }) => {
  const navigate = useNavigate();
  const { 
    sessions, 
    activeSession, 
    loadSessions, 
    createSession, 
    endSession,
    sessionsLoading,
    exportSessionsData
  } = useApp();
  
  // State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [filters, setFilters] = useState({
    candidate_name: '',
    company_name: '',
    date_from: '',
    date_to: '',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Handle /sessions/new route
  useEffect(() => {
    if (action === 'new') {
      setShowCreateModal(true);
    }
  }, [action]);

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      if (filters.candidate_name && !session.candidate_name.toLowerCase().includes(filters.candidate_name.toLowerCase())) {
        return false;
      }
      if (filters.company_name && !session.company_name.toLowerCase().includes(filters.company_name.toLowerCase())) {
        return false;
      }
      if (filters.date_from && new Date(session.session_date) < new Date(filters.date_from)) {
        return false;
      }
      if (filters.date_to && new Date(session.session_date) > new Date(filters.date_to)) {
        return false;
      }
      if (filters.status === 'active' && !session.is_active) {
        return false;
      }
      if (filters.status === 'completed' && session.is_active) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy.includes('date') || sortBy.includes('at')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });

  // Get session statistics
  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.is_active).length;
    const completedSessions = sessions.filter(s => !s.is_active).length;
    const totalSearches = sessions.reduce((acc, session) => acc + (session.total_searches || 0), 0);
    const avgSearchesPerSession = totalSessions > 0 ? Math.round(totalSearches / totalSessions) : 0;
    
    // Get recent session dates for chart
    const last7Days = Array(7).fill().map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const sessionsPerDay = last7Days.map(date => {
      return {
        date: date,
        count: sessions.filter(s => s.created_at.split('T')[0] === date).length
      };
    });
    
    return {
      totalSessions,
      activeSessions,
      completedSessions,
      totalSearches,
      avgSearchesPerSession,
      sessionsPerDay
    };
  };

  const stats = getSessionStats();

  // Handle session creation
  const handleCreateSession = async (data) => {
    try {
      const result = await createSession(data);
      if (result.success) {
        setShowCreateModal(false);
        navigate('/sessions');
        toast.success('Session created successfully!');
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create session');
    }
  };

  // Handle session end
  const handleEndSession = async (sessionId, formatType = 'md') => {
    try {
      const result = await endSession(sessionId, formatType);
      if (result.success && result.documentPath) {
        const fullUrl = `${window.location.origin}${result.documentPath}`;
        window.open(fullUrl, '_blank');
        toast.success('Session ended and report generated');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to end session');
    }
  };

  // Handle session delete
  const handleDeleteSession = async (sessionId) => {
    try {
      setShowDeleteModal(false);
      setSessionToDelete(null);
      
      // In a real app, you would call an API here
      // For now, just reload sessions as a mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadSessions();
      
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    }
  };

  // Load session results
  const loadSessionResults = async (sessionId) => {
    try {
      setLoadingResults(true);
      const response = await sessionsAPI.getSessionResults(sessionId);
      setSessionResults(response.data);
    } catch (error) {
      console.error('Failed to load session results:', error);
      toast.error('Failed to load session results');
    } finally {
      setLoadingResults(false);
    }
  };

  // Handle view session results
  const handleViewResults = (session) => {
    setSelectedSession(session);
    setShowResultsModal(true);
    loadSessionResults(session.id);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      candidate_name: '',
      company_name: '',
      date_from: '',
      date_to: '',
      status: 'all'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Interview Sessions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your coding interview sessions and track progress
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => loadSessions()}
              disabled={sessionsLoading}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${sessionsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <AnimatePresence>
        {isSummaryVisible && (
          <motion.div
            initial={{ opacity: 0, height: 'auto' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSessions}</p>
                    <p className="text-blue-100">Total Sessions</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center text-blue-200">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">All time</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.activeSessions}</p>
                    <p className="text-green-100">Active Now</p>
                  </div>
                  <PlayCircle className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center text-green-200">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">Ongoing sessions</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.completedSessions}</p>
                    <p className="text-purple-100">Completed</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center text-purple-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Finished sessions</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSearches}</p>
                    <p className="text-orange-100">Total Searches</p>
                  </div>
                  <Search className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center text-orange-200">
                  <Code2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">Coding solutions</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.avgSearchesPerSession}</p>
                    <p className="text-teal-100">Avg per Session</p>
                  </div>
                  <Zap className="h-8 w-8 text-teal-200" />
                </div>
                <div className="mt-4 flex items-center text-teal-200">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">Efficiency metric</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Stats Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsSummaryVisible(!isSummaryVisible)}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1 py-1 px-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {isSummaryVisible ? (
            <>
              <span>Hide Statistics</span>
              <ChevronUpIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show Statistics</span>
              <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Active Session Banner */}
      {activeSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <PlayCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Active Session: {activeSession.candidate_name}
                </h3>
                <p className="text-green-100">
                  {activeSession.company_name} • Started: {formatDate(activeSession.session_date)}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/search')}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 border border-white/20 flex items-center transition-all"
              >
                <Search className="h-4 w-4 mr-2" />
                Continue Session
              </button>
              <button
                onClick={() => handleEndSession(activeSession.id, 'md')}
                className="bg-red-500/80 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center transition-all"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                End Session
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Candidate Name
            </label>
            <input
              type="text"
              value={filters.candidate_name}
              onChange={(e) => setFilters(prev => ({ ...prev, candidate_name: e.target.value }))}
              placeholder="Search candidates..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company
            </label>
            <input
              type="text"
              value={filters.company_name}
              onChange={(e) => setFilters(prev => ({ ...prev, company_name: e.target.value }))}
              placeholder="Search companies..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Sessions</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center transition-colors"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="created_at">Created Date</option>
                <option value="session_date">Session Date</option>
                <option value="candidate_name">Candidate</option>
                <option value="company_name">Company</option>
                <option value="total_searches">Total Searches</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
            
            <button
              onClick={() => exportSessionsData('json')}
              className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export JSON
            </button>
            
            <button
              onClick={() => exportSessionsData('csv')}
              className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sessions Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {sessionsLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Sessions Found"
            description="Create your first session to get started"
            ctaText="Create Your First Session"
            onCtaClick={() => setShowCreateModal(true)}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                onViewResults={handleViewResults}
                onEndSession={handleEndSession}
                onDelete={(session) => {
                  setSessionToDelete(session);
                  setShowDeleteModal(true);
                }}
                delay={index * 0.1}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Sessions ({filteredSessions.length})
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Searches
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      onViewResults={handleViewResults}
                      onEndSession={handleEndSession}
                      onDelete={(session) => {
                        setSessionToDelete(session);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Session Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateSessionModal
            onClose={() => {
              setShowCreateModal(false);
              if (action === 'new') {
                navigate('/sessions');
              }
            }}
            onSubmit={handleCreateSession}
          />
        )}
      </AnimatePresence>

      {/* Session Results Modal */}
      <AnimatePresence>
        {showResultsModal && selectedSession && (
          <SessionResultsModal
            session={selectedSession}
            results={sessionResults}
            loading={loadingResults}
            onClose={() => {
              setShowResultsModal(false);
              setSelectedSession(null);
              setSessionResults([]);
            }}
            onEndSession={handleEndSession}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && sessionToDelete && (
          <DeleteSessionModal
            session={sessionToDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setSessionToDelete(null);
            }}
            onConfirm={() => handleDeleteSession(sessionToDelete.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Missing icon components
const ChevronUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default SessionsPage;