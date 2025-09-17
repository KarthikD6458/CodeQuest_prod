// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages and Components
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import SearchPage from './components/search/SearchPage';
import SessionsPage from './components/sessions/SessionsPage';
import SessionDetail from './components/sessions/SessionDetail';
import AdminDashboard from './components/admin/AdminDashboard';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import NotificationsPage from './components/notifications/NotificationsPage';
import CodeQuestionsPage from './components/questions/CodeQuestionsPage';
import QuestionDetail from './components/questions/QuestionDetail';
import SettingsPage from './components/settings/SettingsPage';
import NotFound from './components/common/NotFound';
import MobileNav from './components/layout/MobileNav';

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} />
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'content sidebar-collapsed' : 'content'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

// Admin Route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} />
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'content sidebar-collapsed' : 'content'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary fallback={<div className="p-6">Something went wrong. Please refresh the page.</div>}>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: 'white',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />

              <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              
              <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
              <Route path="/sessions/new" element={<ProtectedRoute><SessionsPage action="new" /></ProtectedRoute>} />
              <Route path="/sessions/:sessionId" element={<ProtectedRoute><SessionDetail /></ProtectedRoute>} />
              
              <Route path="/questions" element={<ProtectedRoute><CodeQuestionsPage /></ProtectedRoute>} />
              <Route path="/questions/:questionId" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
              
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;