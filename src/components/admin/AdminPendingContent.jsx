// src/components/admin/AdminPendingContent.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Search, 
  Filter,
  Code,
  AlertTriangle,
  MessageSquare,
  Eye,
  RefreshCw
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatTimeAgo } from '../../services/utils';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import PendingContentDetail from './PendingContentDetail';

const AdminPendingContent = () => {
  // State
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    contentType: '',
    priority: '',
    search: ''
  });
  
  // Load pending content
  useEffect(() => {
    loadPendingContent();
  }, [filters.status, filters.contentType, filters.priority]);
  
  const loadPendingContent = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.getPendingContent({
        status: filters.status || undefined,
        content_type: filters.contentType || undefined,
        priority: filters.priority || undefined,
        q: filters.search || undefined
      });
      
      setPendingItems(response.data.items);
    } catch (error) {
      console.error('Failed to load pending content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    loadPendingContent();
  };
  
  // View item details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };
  
  // Handle approval/rejection
  const handleUpdateStatus = async (contentId, status, adminNotes = '') => {
    try {
      await adminAPI.updatePendingContent(contentId, status, adminNotes);
      
      // Update local state
      setPendingItems(prev => prev.filter(item => item.id !== contentId));
      
      // Close detail view if open
      if (showDetail && selectedItem?.id === contentId) {
        setShowDetail(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Failed to update content status:', error);
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'question':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'solution':
        return <Code className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Review and manage user-submitted content
          </p>
        </div>
        
        <button
          onClick={loadPendingContent}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search content..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>
          </div>
          
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="">All Status</option>
            </select>
          </div>
          
          <div>
            <select
              value={filters.contentType}
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="question">Questions</option>
              <option value="solution">Solutions</option>
            </select>
          </div>
          
          <div>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Content List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={showDetail ? 'lg:col-span-1' : 'lg:col-span-3'}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {filters.status === 'pending' ? 'Pending Content' : 
                 filters.status === 'approved' ? 'Approved Content' :
                 filters.status === 'rejected' ? 'Rejected Content' : 'All Content'}
              </h3>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Loading content...</p>
              </div>
            ) : pendingItems.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Content Found"
                description={`No ${filters.status || ''} content items to display`}
                className="p-8"
              />
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${
                      selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleViewDetails(item)}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {getContentTypeIcon(item.content_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(item.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium line-clamp-1">
                          {item.content_data?.question_text || item.content_data?.title || 'Untitled Content'}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <span>{item.submitter_username}</span>
                          <span className="mx-1">•</span>
                          <span className="capitalize">{item.content_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Detail View */}
        {showDetail && selectedItem && (
          <div className="lg:col-span-2">
            <PendingContentDetail
              item={selectedItem}
              onApprove={(id, notes) => handleUpdateStatus(id, 'approved', notes)}
              onReject={(id, notes) => handleUpdateStatus(id, 'rejected', notes)}
              onClose={() => {
                setShowDetail(false);
                setSelectedItem(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPendingContent;