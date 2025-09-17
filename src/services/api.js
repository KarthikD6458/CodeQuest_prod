// src/services/api.js
import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000
});

// Add request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  
  register: (userData) => api.post('/admin/users', userData),
  
  getMe: () => api.get('/me')
};

// Sessions API
export const sessionsAPI = {
  getSessions: (filters = {}) => api.get('/sessions', { params: filters }),
  
  getSession: (sessionId) => api.get(`/sessions/${sessionId}`),
  
  getActiveSession: () => api.get('/sessions/active'),
  
  createSession: (sessionData) => api.post('/sessions', sessionData),
  
  updateSession: (sessionId, sessionData) => api.put(`/sessions/${sessionId}`, sessionData),
  
  endSession: (sessionId, formatType = 'md') => 
    api.put(`/sessions/${sessionId}/end`, null, { params: { format_type: formatType } }),
  
  getSessionResults: (sessionId) => api.get(`/sessions/${sessionId}/results`),
  
  addCollaborator: (sessionId, userId, role) => 
    api.post(`/sessions/${sessionId}/collaborators`, { user_id: userId, role }),
  
  removeCollaborator: (sessionId, userId) => 
    api.delete(`/sessions/${sessionId}/collaborators/${userId}`),
  
  addNote: (sessionId, content, searchResultId = null) => 
    api.post(`/sessions/${sessionId}/notes`, { 
      session_id: sessionId, 
      content, 
      search_result_id: searchResultId 
    }),
  
  getNotes: (sessionId, searchResultId = null) => 
    api.get(`/sessions/${sessionId}/notes`, { 
      params: { search_result_id: searchResultId } 
    })
};

// Search API
export const searchAPI = {
  search: (formData) => {
    return api.post('/search', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  continueChat: (formData) => {
    return api.post('/continue-chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  generateAlternative: (formData) => {
    return api.post('/generate-alternative', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  submitForApproval: (formData) => {
    return api.post('/submit-for-approval', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  extractText: (formData) => {
    return api.post('/extract-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getSuggestions: (query, language = 'all') =>
    api.get('/suggestions', { params: { q: query, language_filter: language } })
};

// Code Questions API
export const codeQuestionsAPI = {
  getQuestions: (params = {}) => api.get('/code-questions', { params }),
  
  getQuestion: (questionId) => api.get(`/code-questions/${questionId}`),
  
  createQuestion: (formData) => {
    return api.post('/code-questions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updateQuestion: (questionId, formData) => {
    return api.put(`/code-questions/${questionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteQuestion: (questionId, permanent = false) => 
    api.delete(`/code-questions/${questionId}`, { 
      params: { permanent } 
    })
};

// Admin API
export const adminAPI = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  
  createUser: (userData) => api.post('/admin/users', userData),
  
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  getPendingContent: (params = {}) => api.get('/admin/pending-content', { params }),
  
  updatePendingContent: (contentId, status, adminNotes = '') => {
    const formData = new FormData();
    formData.append('status', status);
    formData.append('admin_notes', adminNotes);
    
    return api.put(`/admin/pending-content/${contentId}`, formData);
  },
  
  getStats: () => api.get('/admin/stats'),
  
  getAuditLogs: (params = {}) => api.get('/admin/audit-logs', { params }),
  
  // Prompt management endpoints
  getAdminPrompts: (params = {}) => api.get('/admin/prompts', { params }),
  
  getAdminPrompt: (promptId) => api.get(`/admin/prompts/${promptId}`),
  
  createPrompt: (promptData) => api.post('/admin/prompts', promptData),
  
  updatePrompt: (promptId, promptData) => api.put(`/admin/prompts/${promptId}`, promptData),
  
  deletePrompt: (promptId) => api.delete(`/admin/prompts/${promptId}`),
  
  reloadPrompts: () => api.post('/admin/prompts/reload')
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  
  markNotificationsRead: (ids) => api.put('/notifications/mark-read', { notification_ids: ids }),
  
  markAllNotificationsRead: () => api.put('/notifications/mark-all-read')
};

// User Settings API
export const userSettingsAPI = {
  getPreferences: () => api.get('/user/preferences'),
  
  updatePreferences: (preferences) => api.put('/user/preferences', preferences)
};

// Prompts API
export const promptsAPI = {
  getPrompts: (promptType = null) => 
    api.get('/prompts', { params: { prompt_type: promptType } }),
  
  updateFollowUpPrompts: (prompts) => api.put('/prompts/follow-up', prompts)
};

// Languages API
export const languagesAPI = {
  getLanguages: () => api.get('/languages')
};

// Health API
export const healthAPI = {
  checkHealth: () => api.get('/health')
};

export default api;