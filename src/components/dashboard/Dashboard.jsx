// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Code, 
  Sparkles,
  Brain,
  Zap,
  Star, 
  Clock,
  FileText,
  Bell,
  TrendingUp,
  Check,
  Upload,
  Camera,
  Lightbulb,
  Rocket,
  Code2,
  Layout,
  PlayCircle,
  Users,
  Award,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { formatDate, formatTimeAgo } from '../../services/utils';
import Spinner from '../common/Spinner';
import StatsCard from './StatsCard';
import ActivityCard from './ActivityCard';
import RecentSessionCard from './RecentSessionCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { activeSession, sessions, notifications, unreadCount, loadSessions, loadNotifications } = useApp();
  const navigate = useNavigate();
  
  // State
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadSessions(),
          loadNotifications()
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Create combined activity feed
  useEffect(() => {
    // Create combined activity feed
    const sessionsActivity = sessions.slice(0, 5).map(session => ({
      type: 'session',
      id: `session-${session.id}`,
      title: `Session: ${session.candidate_name}`,
      subtitle: `Company: ${session.company_name}`,
      date: session.created_at,
      data: session
    }));
    
    const notificationsActivity = notifications.slice(0, 5).map(notification => ({
      type: 'notification',
      id: `notification-${notification.id}`,
      title: notification.message,
      date: notification.created_at,
      is_read: notification.is_read,
      data: notification
    }));
    
    // Combine and sort by date
    const combined = [...sessionsActivity, ...notificationsActivity]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
    
    setRecentActivity(combined);
  }, [sessions, notifications]);

  // Sample resources for learning
  const learningResources = [
    {
      title: "Mastering Code Interviews",
      description: "Essential strategies for technical interviews",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      url: "#mastering-code"
    },
    {
      title: "Algorithm Deep Dive",
      description: "Understanding time & space complexity",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      url: "#algorithms"
    },
    {
      title: "System Design Principles",
      description: "Architecture patterns for scalable systems",
      icon: Layout,
      color: "from-green-500 to-teal-500",
      url: "#system-design"
    }
  ];

  // Stats
  const stats = {
    totalSessions: sessions.length,
    activeSessions: sessions.filter(s => s.is_active).length,
    completedSessions: sessions.filter(s => !s.is_active).length,
    totalSearches: sessions.reduce((acc, session) => acc + (session.total_searches || 0), 0)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username || 'User'}</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Your AI-powered coding interview assistant
        </p>
      </motion.div>

      {/* Active Session Banner */}
      {activeSession ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 animate-pulse" />
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
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  No Active Session
                </h3>
                <p className="text-blue-100">
                  Start a new session to begin coding interviews
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/sessions/new')}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 border border-white/20 flex items-center transition-all"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Start New Session
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/search"
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg transform transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <Search className="h-10 w-10 mb-4" />
                    <h3 className="font-bold mb-1">New Search</h3>
                    <p className="text-sm text-blue-100">Ask a coding question</p>
                  </div>
                </Link>
                
                <Link
                  to="/sessions"
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg transform transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <Calendar className="h-10 w-10 mb-4" />
                    <h3 className="font-bold mb-1">Manage Sessions</h3>
                    <p className="text-sm text-purple-100">View all interviews</p>
                  </div>
                </Link>
                
                <Link
                  to="/notifications"
                  className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 shadow-lg transform transition-all hover:scale-105 relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <Bell className="h-10 w-10 mb-4" />
                    <h3 className="font-bold mb-1">Notifications</h3>
                    <p className="text-sm text-pink-100">Stay updated</p>
                  </div>
                  
                  {unreadCount > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                      <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Image Upload</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Upload code screenshots</p>
                    </div>
                  </div>
                  <Link
                    to="/search"
                    className="flex items-center justify-center py-2 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Images
                  </Link>
                </div>
                
                <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                      <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Saved Solutions</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">View your favorites</p>
                    </div>
                  </div>
                  <Link
                    to="/questions"
                    className="flex items-center justify-center py-2 px-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Saved Solutions
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Learning Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                Learning Resources
              </h2>
              
              <div className="space-y-4">
                {learningResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-750 dark:to-gray-700 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center text-white shadow-md mr-4`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{resource.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Activity Feed & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Your Stats
              </h2>
              
              <div className="space-y-4">
                <StatsCard 
                  icon={Calendar} 
                  iconColor="text-blue-600 dark:text-blue-400" 
                  bgColor="bg-blue-50 dark:bg-blue-900/20"
                  title="Total Sessions" 
                  value={stats.totalSessions} 
                />
                
                <StatsCard 
                  icon={Code2} 
                  iconColor="text-purple-600 dark:text-purple-400" 
                  bgColor="bg-purple-50 dark:bg-purple-900/20"
                  title="Solutions Generated" 
                  value={stats.totalSearches} 
                />
                
                <StatsCard 
                  icon={Check} 
                  iconColor="text-green-600 dark:text-green-400" 
                  bgColor="bg-green-50 dark:bg-green-900/20"
                  title="Completed Interviews" 
                  value={stats.completedSessions} 
                />
                
                <StatsCard 
                  icon={PlayCircle} 
                  iconColor="text-orange-600 dark:text-orange-400" 
                  bgColor="bg-orange-50 dark:bg-orange-900/20"
                  title="Active Sessions" 
                  value={stats.activeSessions} 
                />
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                )}
                
                {recentActivity.length > 0 && (
                  <div className="text-center mt-2">
                    <Link
                      to={recentActivity[0].type === 'session' ? '/sessions' : '/notifications'}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View all {recentActivity[0].type === 'session' ? 'sessions' : 'notifications'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Recent Sessions
                </h2>
                
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <RecentSessionCard key={session.id} session={session} />
                  ))}
                  
                  <div className="text-center mt-4">
                    <Link
                      to="/sessions"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View all sessions
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;