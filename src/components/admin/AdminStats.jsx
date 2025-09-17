// src/components/admin/AdminStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Search, 
  Calendar, 
  CheckCircle, 
  User,
  Code,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { formatNumber } from '../../services/utils';

const AdminStats = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard 
          title="Total Users" 
          value={formatNumber(stats.totalUsers)} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Total Sessions" 
          value={formatNumber(stats.totalSessions)} 
          icon={Calendar} 
          color="bg-purple-500" 
        />
        <StatsCard 
          title="Total Questions" 
          value={formatNumber(stats.totalQuestions)} 
          icon={FileText} 
          color="bg-green-500" 
        />
        <StatsCard 
          title="Pending Content" 
          value={formatNumber(stats.pendingContent)} 
          icon={Search} 
          color="bg-orange-500" 
        />
      </motion.div>
      
      {/* Charts and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Distribution
            </h3>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">Regular Users</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(stats.roleStats?.user || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">Admins</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(stats.roleStats?.admin || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300">SuperAdmins</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(stats.roleStats?.superadmin || 0)}
              </span>
            </div>
            
            {/* Active Users */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Recently Active Users</h4>
              <div className="space-y-3">
                {stats.activeUsers?.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.last_login).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 border-b border-green-200 dark:border-green-800">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" />
              Monthly Session Activity
            </h3>
          </div>
          
          <div className="p-6">
            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end space-x-2">
              {stats.monthlySessionCounts?.map((item, index) => {
                const height = item.count ? `${(item.count / Math.max(...stats.monthlySessionCounts.map(d => d.count))) * 100}%` : '5%';
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center mb-2">
                      <div 
                        className="w-full bg-green-500 rounded-t-md transition-all duration-500"
                        style={{ height }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumber(stats.activeSessions)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Searches</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalSessions ? (stats.totalSearches / stats.totalSessions).toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Language Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Language Distribution
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.languageStats || {}).map(([language, count]) => (
              <div 
                key={language} 
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {language.toUpperCase()}
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(count)}
                </span>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(stats.languageStats))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className={`${color} h-2`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className={`${color} bg-opacity-20 dark:bg-opacity-30 p-2 rounded-lg`}>
            <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminStats;