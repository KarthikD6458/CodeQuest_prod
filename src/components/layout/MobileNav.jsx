// src/components/layout/MobileNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Calendar, 
  Code,
  User
} from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-20">
      <div className="grid grid-cols-5 h-16">
        <MobileNavLink 
          to="/dashboard" 
          icon={Home} 
          text="Home" 
          active={isActive('/dashboard')} 
        />
        <MobileNavLink 
          to="/search" 
          icon={Search} 
          text="Search" 
          active={isActive('/search')} 
        />
        <MobileNavLink 
          to="/sessions" 
          icon={Calendar} 
          text="Sessions" 
          active={isActive('/sessions')} 
        />
        <MobileNavLink 
          to="/questions" 
          icon={Code} 
          text="Code" 
          active={isActive('/questions')} 
        />
        <MobileNavLink 
          to="/settings" 
          icon={User} 
          text="Profile" 
          active={isActive('/settings')} 
        />
      </div>
    </div>
  );
};

const MobileNavLink = ({ to, icon: Icon, text, active }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center ${
        active
          ? 'text-purple-600 dark:text-purple-400'
          : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{text}</span>
    </Link>
  );
};

export default MobileNav;