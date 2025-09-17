// src/components/settings/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Key, 
  Moon, 
  Sun, 
  Bell, 
  Code,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { userSettingsAPI } from '../../services/api';
import Spinner from '../common/Spinner';

const SettingsPage = () => {
  const { user } = useAuth();
  const { darkMode, setTheme } = useTheme();
  
  // State
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'system',
    preferredLanguage: 'python',
    notificationsEnabled: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch preferences from the API
        // const response = await userSettingsAPI.getPreferences();
        // setPreferences(response.data);
        
        // Mock preferences
        setPreferences({
          theme: localStorage.getItem('theme') || 'system',
          preferredLanguage: 'python',
          notificationsEnabled: true
        });
        
        // Set initial profile data
        if (user) {
          setProfile({
            username: user.username || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user]);
  
  // Handle profile changes
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle preference changes
  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update theme immediately
    if (field === 'theme') {
      setTheme(value);
    }
  };
  
  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Validate password fields
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setSaveError('New passwords do not match');
      setTimeout(() => setSaveError(false), 3000);
      return;
    }
    
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(false);
      
      // In a real implementation, you would call the API
      // await userSettingsAPI.updateProfile(profile);
      
      // Mock successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      
      // Clear password fields
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError('Failed to save profile changes');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setSaveError(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };
  
  // Save preferences
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(false);
      
      // In a real implementation, you would call the API
      // await userSettingsAPI.updatePreferences(preferences);
      
      // Mock successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save theme to localStorage
      localStorage.setItem('theme', preferences.theme);
      
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveError('Failed to save preferences');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setSaveError(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account preferences and settings
        </p>
      </motion.div>
      
      {/* Settings Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </span>
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => handleProfileChange('username', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={profile.currentPassword}
                          onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={profile.newPassword}
                        onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={profile.confirmPassword}
                        onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                {saveSuccess && (
                  <div className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Profile updated successfully
                  </div>
                )}
                
                {saveError && (
                  <div className="text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    {typeof saveError === 'string' ? saveError : 'Failed to update profile'}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center ml-auto disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          
          {/* Preferences */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`cursor-pointer border rounded-lg p-3 text-center ${
                        preferences.theme === 'light'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                      onClick={() => handlePreferenceChange('theme', 'light')}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <span className="text-sm font-medium">Light</span>
                    </div>
                    
                    <div
                      className={`cursor-pointer border rounded-lg p-3 text-center ${
                        preferences.theme === 'dark'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                      onClick={() => handlePreferenceChange('theme', 'dark')}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                    
                    <div
                      className={`cursor-pointer border rounded-lg p-3 text-center ${
                        preferences.theme === 'system'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                      onClick={() => handlePreferenceChange('theme', 'system')}
                    >
                      <div className="flex justify-center mb-2">
                        <Sun className="h-6 w-6 text-yellow-500" />
                        <span className="mx-1">/</span>
                        <Moon className="h-6 w-6 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium">System</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Programming Language
                  </label>
                  <select
                    value={preferences.preferredLanguage}
                    onChange={(e) => handlePreferenceChange('preferredLanguage', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="ruby">Ruby</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="rust">Rust</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will be used as the default language for code examples
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enable or disable system notifications
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        id="toggle-notifications"
                        className="absolute w-0 h-0 opacity-0"
                        checked={preferences.notificationsEnabled}
                        onChange={(e) => handlePreferenceChange('notificationsEnabled', e.target.checked)}
                      />
                      <label
                        htmlFor="toggle-notifications"
                        className={`absolute w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
                          preferences.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-md transform ${
                            preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          } top-0.5`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                {saveSuccess && (
                  <div className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Preferences updated successfully
                  </div>
                )}
                
                {saveError && (
                  <div className="text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    {typeof saveError === 'string' ? saveError : 'Failed to update preferences'}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center ml-auto disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;