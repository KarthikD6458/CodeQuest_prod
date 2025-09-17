// src/components/notifications/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Link as LinkIcon, 
  ExternalLink,
  Mail,
  MailOpen,
  Trash2,
  Inbox,
  Check,
  AlertCircle,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';
import { formatTimeAgo } from '../../services/utils';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import ErrorBoundary from '../common/ErrorBoundary';

const NotificationsContent = () => {
  const { notifications, unreadCount, notificationsLoading, loadNotifications, markNotificationsRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  
  // State
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'unread') {
      return !notification.is_read;
    } else if (selectedFilter === 'read') {
      return notification.is_read;
    }
    return true;
  });
  
  // Handle selecting all notifications
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };
  
  // Handle selecting a notification
  const handleSelectNotification = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  // Handle marking selected notifications as read
  const handleMarkSelectedAsRead = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await markNotificationsRead(selectedIds);
      toast.success('Notifications marked as read');
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };
  
  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markNotificationsRead([notification.id]);
    }
    
    // Navigate to action URL if available
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };
  
  // Get icon for notification type
  const getNotificationIcon = (notification) => {
    const type = notification.notification_type || 'general';
    
    switch (type) {
      case 'session':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejection':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'collaboration':
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      case 'welcome':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
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
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
              >
                <MailOpen className="h-4 w-4 mr-2" />
                Mark All Read
              </button>
            )}
            
            <button
              onClick={loadNotifications}
              disabled={notificationsLoading}
              className="px-4 py-2 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${notificationsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === 'unread'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setSelectedFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === 'read'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Read
            </button>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkSelectedAsRead}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Selected as Read ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {notificationsLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications"
            description={
              selectedFilter === 'all'
                ? "You don't have any notifications yet"
                : selectedFilter === 'unread'
                ? "You don't have any unread notifications"
                : "You don't have any read notifications"
            }
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedFilter === 'all' ? 'All Notifications' : 
                 selectedFilter === 'unread' ? 'Unread Notifications' : 'Read Notifications'}
              </h3>
              
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
              >
                {selectedIds.length === filteredNotifications.length 
                  ? 'Deselect All' 
                  : 'Select All'}
              </button>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-start ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="mr-4 mt-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="mr-4 mt-1">
                    {getNotificationIcon(notification)}
                  </div>
                  
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className={`text-gray-900 dark:text-white ${!notification.is_read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTimeAgo(notification.created_at)}
                      
                      {notification.action_url && (
                        <span className="ml-3 flex items-center text-blue-600 dark:text-blue-400">
                          <LinkIcon className="h-4 w-4 mr-1" />
                          View details
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {!notification.is_read ? (
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Wrap with ErrorBoundary
const NotificationsPage = () => (
  <ErrorBoundary fallback={
    <div className="container mx-auto px-4 py-12 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something Went Wrong</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We encountered an error while loading your notifications.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Refresh Page
      </button>
    </div>
  }>
    <NotificationsContent />
  </ErrorBoundary>
);

export default NotificationsPage;