// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Clock, 
  Clipboard,
  Shield,
  Settings,
  RefreshCw,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import AdminStats from './AdminStats';
import AdminUsers from './AdminUsers';
import AdminPendingContent from './AdminPendingContent';
import AdminAuditLogs from './AdminAuditLogs';
import AdminSettings from './AdminSettings';
import AdminPrompts from './AdminPrompts';
import Spinner from '../common/Spinner';

const AdminDashboard = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load stats on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);
  
  // If not admin, redirect
  if (!isAdmin()) {
    navigate('/dashboard');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage users, content, and system settings
        </p>
      </div>
      
      {/* Admin Nav */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8 overflow-x-auto">
        <nav className="flex space-x-2">
          <AdminNavLink to="/admin" exact icon={BarChart2} label="Dashboard" />
          <AdminNavLink to="/admin/users" icon={Users} label="Users" />
          <AdminNavLink to="/admin/content" icon={FileText} label="Content" />
          <AdminNavLink to="/admin/prompts" icon={MessageSquare} label="Prompts" />
          <AdminNavLink to="/admin/audit-logs" icon={Clock} label="Audit Logs" />
          {isSuperAdmin() && (
            <AdminNavLink to="/admin/settings" icon={Settings} label="Settings" />
          )}
        </nav>
      </div>
      
      {/* Admin Content */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<AdminStats stats={stats} />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/content" element={<AdminPendingContent />} />
          <Route path="/prompts" element={<AdminPrompts />} />
          <Route path="/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      )}
    </div>
  );
};

// Admin Nav Link Component
const AdminNavLink = ({ to, exact, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => 
        `px-4 py-2 rounded-lg flex items-center whitespace-nowrap ${
          isActive 
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`
      }
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </NavLink>
  );
};

export default AdminDashboard;