// src/contexts/AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  sessionsAPI, 
  notificationsAPI, 
  codeQuestionsAPI 
} from '../services/api';
import { exportToJSON, exportToCSV } from '../services/utils';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [codeQuestions, setCodeQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  
  // Load active session on auth change
  useEffect(() => {
    if (isAuthenticated) {
      loadActiveSession();
      loadNotifications();
    }
  }, [isAuthenticated]);
  
  // Session management
  const loadSessions = async () => {
    if (!isAuthenticated) return;
    
    try {
      setSessionsLoading(true);
      const response = await sessionsAPI.getSessions();
      setSessions(response.data || []);
      return true;
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
      return false;
    } finally {
      setSessionsLoading(false);
    }
  };
  
  const loadActiveSession = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await sessionsAPI.getActiveSession();
      setActiveSession(response.data);
    } catch (error) {
      console.error('Failed to load active session:', error);
      setActiveSession(null);
    }
  };
  
  const createSession = async (sessionData) => {
    try {
      const response = await sessionsAPI.createSession(sessionData);
      setSessions(prev => [response.data, ...prev]);
      setActiveSession(response.data);
      return { success: true, session: response.data };
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create session');
      return { success: false, error };
    }
  };
  
  const endSession = async (sessionId, formatType = 'md') => {
    try {
      const response = await sessionsAPI.endSession(sessionId, formatType);
      
      // Update sessions list
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId ? { ...session, is_active: false } : session
        )
      );
      
      // If this was the active session, clear it
      if (activeSession && activeSession.id === sessionId) {
        setActiveSession(null);
      }
      
      return { success: true, documentPath: response.data.document_path };
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to end session');
      return { success: false, error };
    }
  };
  
  const getSessionById = async (sessionId) => {
    try {
      const response = await sessionsAPI.getSession(sessionId);
      return { success: true, session: response.data };
    } catch (error) {
      console.error('Failed to get session:', error);
      toast.error('Failed to get session details');
      return { success: false, error };
    }
  };
  
  const exportSessionsData = (format = 'json') => {
    if (format === 'json') {
      exportToJSON(sessions, 'codequest_sessions');
    } else if (format === 'csv') {
      const headers = ['id', 'candidate_name', 'company_name', 'session_date', 'is_active', 'total_searches'];
      exportToCSV(sessions, headers, 'codequest_sessions');
    }
  };
  
  // Notifications
  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setNotificationsLoading(true);
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };
  
  const markNotificationsRead = async (notificationIds) => {
    try {
      await notificationsAPI.markNotificationsRead(notificationIds);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      // Update unread count
      const updatedUnreadCount = notifications.filter(
        notification => !notification.is_read && !notificationIds.includes(notification.id)
      ).length;
      
      setUnreadCount(updatedUnreadCount);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      return { success: false, error };
    }
  };
  
  const markAllNotificationsRead = async () => {
    try {
      await notificationsAPI.markAllNotificationsRead();
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
      setUnreadCount(0);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return { success: false, error };
    }
  };
  
  // Code Questions
  const loadCodeQuestions = async (filters = {}) => {
    try {
      setQuestionsLoading(true);
      const response = await codeQuestionsAPI.getQuestions(filters);
      setCodeQuestions(response.data.items || []);
      return { success: true, questions: response.data.items, total: response.data.total };
    } catch (error) {
      console.error('Failed to load code questions:', error);
      setCodeQuestions([]);
      return { success: false, error };
    } finally {
      setQuestionsLoading(false);
    }
  };
  
  const getQuestionById = async (questionId) => {
    try {
      const response = await codeQuestionsAPI.getQuestion(questionId);
      return { success: true, question: response.data };
    } catch (error) {
      console.error('Failed to get question:', error);
      toast.error('Failed to load question details');
      return { success: false, error };
    }
  };
  
  return (
    <AppContext.Provider
      value={{
        // Sessions
        sessions,
        activeSession,
        sessionsLoading,
        loadSessions,
        loadActiveSession,
        createSession,
        endSession,
        getSessionById,
        exportSessionsData,
        
        // Notifications
        notifications,
        unreadCount,
        notificationsLoading,
        loadNotifications,
        markNotificationsRead,
        markAllNotificationsRead,
        
        // Code Questions
        codeQuestions,
        questionsLoading,
        loadCodeQuestions,
        getQuestionById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};