// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Calendar, 
  FileText, 
  Bell, 
  Settings, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight,
  Code,
  Users,
  User,
  Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';

const Sidebar = ({ onCollapse }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (onCollapse) {
      onCollapse(newCollapsed);
    }
  };
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div 
      className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed top-0 left-0 z-20 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              CodeQuest
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="flex items-center justify-center w-full">
            <Logo className="h-8 w-auto" />
          </Link>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          <SidebarLink 
            to="/dashboard" 
            icon={Home} 
            text="Dashboard" 
            active={isActive('/dashboard')} 
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/search" 
            icon={Search} 
            text="Search" 
            active={isActive('/search')} 
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/sessions" 
            icon={Calendar} 
            text="Sessions" 
            active={isActive('/sessions')} 
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/questions" 
            icon={Code} 
            text="Code Library" 
            active={isActive('/questions')} 
            collapsed={collapsed}
          />
          <SidebarLink 
            to="/notifications" 
            icon={Bell} 
            text="Notifications" 
            active={isActive('/notifications')} 
            collapsed={collapsed}
          />
        </nav>
        
        <div className="mt-8">
          <h3 className={`px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'More' : 'More Options'}
          </h3>
          <nav className="mt-2 px-2 space-y-1">
            <SidebarLink 
              to="/settings" 
              icon={Settings} 
              text="Settings" 
              active={isActive('/settings')} 
              collapsed={collapsed}
            />
            {isAdmin() && (
              <SidebarLink 
                to="/admin" 
                icon={BarChart2} 
                text="Admin" 
                active={isActive('/admin')} 
                collapsed={collapsed}
              />
            )}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon: Icon, text, active, collapsed }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-3 rounded-md transition-colors ${
        active
          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className={`${collapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'} flex-shrink-0`} />
      {!collapsed && <span className="truncate">{text}</span>}
    </Link>
  );
};

export default Sidebar;