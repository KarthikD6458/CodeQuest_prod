// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Load user on initial mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await authAPI.getMe();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Login user
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(username, password);
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Get user data
      const userResponse = await authAPI.getMe();
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${userResponse.data.username}!`);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to log in';
      
      if (error.response) {
        errorMessage = error.response.data.detail || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      await authAPI.register(userData);
      
      toast.success('Registration successful! Please log in.');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to register';
      
      if (error.response) {
        errorMessage = error.response.data.detail || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth');
    toast.success('Logged out successfully');
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'superadmin');
  };
  
  // Check if user is superadmin
  const isSuperAdmin = () => {
    return user && user.role === 'superadmin';
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};