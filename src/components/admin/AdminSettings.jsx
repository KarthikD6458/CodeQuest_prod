// src/components/admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Database,
  Server,
  Shield,
  Zap,
  HardDrive,
  Key,
  Clock
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import Spinner from '../common/Spinner';

const AdminSettings = () => {
  // State
  const [settings, setSettings] = useState({
    general: {
      appName: 'CodeQuest',
      appDescription: 'AI-Powered Coding Interview Assistant',
      maintenanceMode: false,
      maxFileUploadSize: 10,
      defaultLanguage: 'python'
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 1440,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      passwordResetTimeout: 60
    },
    api: {
      gptModel: 'gpt-4.1-mini',
      gptEndpoint: 'https://admin-mdbaejl4-southeastasia.cognitiveservices.azure.com/',
      maxTokens: 4096,
      temperature: 0.7,
      rateLimitEnabled: true,
      rateLimitRequests: 100,
      rateLimitWindow: 60
    },
    database: {
      backupEnabled: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      maxConnections: 20,
      queryTimeout: 30
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch settings from the API
        // const response = await adminAPI.getSystemSettings();
        // setSettings(response.data);
        
        // For now, use mock data
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle setting change
  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(false);
      
      // In a real implementation, you would save settings to the API
      // await adminAPI.updateSystemSettings(settings);
      
      // Mock successful save
      setTimeout(() => {
        setSaving(false);
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaving(false);
      setSaveError(true);
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setSaveError(false);
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading system settings...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Configure and manage system settings
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {saveSuccess && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5 mr-1" />
              Settings saved successfully
            </div>
          )}
          
          {saveError && (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-1" />
              Failed to save settings
            </div>
          )}
          
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-70"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Settings Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'general'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'api'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              API & AI
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'database'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Database
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Application Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.appName}
                    onChange={(e) => handleSettingChange('general', 'appName', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    The name of the application shown in the UI
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Application Description
                  </label>
                  <input
                    type="text"
                    value={settings.general.appDescription}
                    onChange={(e) => handleSettingChange('general', 'appDescription', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Brief description of the application
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum File Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.general.maxFileUploadSize}
                    onChange={(e) => handleSettingChange('general', 'maxFileUploadSize', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum allowed file size for uploads in megabytes
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Programming Language
                  </label>
                  <select
                    value={settings.general.defaultLanguage}
                    onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
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
                    Default programming language for code examples
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Maintenance Mode
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When enabled, the site will be unavailable to non-admin users
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-maintenance"
                      className="absolute w-0 h-0 opacity-0"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                    />
                    <label
                      htmlFor="toggle-maintenance"
                      className={`absolute w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
                        settings.general.maintenanceMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-md transform ${
                          settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        } top-0.5`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="6"
                    max="24"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum number of characters required for passwords
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="10"
                    max="10080" // 1 week
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Time in minutes before a user is automatically logged out
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="20"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Number of failed login attempts before account lockout
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password Reset Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordResetTimeout}
                    onChange={(e) => handleSettingChange('security', 'passwordResetTimeout', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="5"
                    max="1440" // 24 hours
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Time in minutes before a password reset link expires
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Require two-factor authentication for all users
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-2fa"
                      className="absolute w-0 h-0 opacity-0"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    />
                    <label
                      htmlFor="toggle-2fa"
                      className={`absolute w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
                        settings.security.twoFactorAuth ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-md transform ${
                          settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        } top-0.5`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* API & AI Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GPT Model
                  </label>
                  <select
                    value={settings.api.gptModel}
                    onChange={(e) => handleSettingChange('api', 'gptModel', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                    <option value="gpt-4.1">GPT-4.1</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    AI model to use for code generation
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GPT Endpoint
                  </label>
                  <input
                    type="text"
                    value={settings.api.gptEndpoint}
                    onChange={(e) => handleSettingChange('api', 'gptEndpoint', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Azure OpenAI endpoint URL
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={settings.api.maxTokens}
                    onChange={(e) => handleSettingChange('api', 'maxTokens', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="256"
                    max="8192"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum number of tokens for AI responses
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperature
                  </label>
                  <input
                    type="range"
                    value={settings.api.temperature}
                    onChange={(e) => handleSettingChange('api', 'temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Precise (0.0)</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{settings.api.temperature.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Creative (1.0)</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rate Limit (requests)
                  </label>
                  <input
                    type="number"
                    value={settings.api.rateLimitRequests}
                    onChange={(e) => handleSettingChange('api', 'rateLimitRequests', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="10"
                    max="1000"
                    disabled={!settings.api.rateLimitEnabled}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum number of API requests per time window
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rate Limit Window (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.api.rateLimitWindow}
                    onChange={(e) => handleSettingChange('api', 'rateLimitWindow', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="1440"
                    disabled={!settings.api.rateLimitEnabled}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Time window in minutes for rate limiting
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      API Rate Limiting
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable rate limiting for API requests
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-rate-limit"
                      className="absolute w-0 h-0 opacity-0"
                      checked={settings.api.rateLimitEnabled}
                      onChange={(e) => handleSettingChange('api', 'rateLimitEnabled', e.target.checked)}
                    />
                    <label
                      htmlFor="toggle-rate-limit"
                      className={`absolute w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
                        settings.api.rateLimitEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-md transform ${
                          settings.api.rateLimitEnabled ? 'translate-x-6' : 'translate-x-1'
                        } top-0.5`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Database Settings */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.database.backupFrequency}
                    onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={!settings.database.backupEnabled}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    How often to perform database backups
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backup Retention (days)
                  </label>
                  <input
                    type="number"
                    value={settings.database.backupRetention}
                    onChange={(e) => handleSettingChange('database', 'backupRetention', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="365"
                    disabled={!settings.database.backupEnabled}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Number of days to keep backups
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Database Connections
                  </label>
                  <input
                    type="number"
                    value={settings.database.maxConnections}
                    onChange={(e) => handleSettingChange('database', 'maxConnections', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="5"
                    max="100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum number of concurrent database connections
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Query Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.database.queryTimeout}
                    onChange={(e) => handleSettingChange('database', 'queryTimeout', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="5"
                    max="300"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum time in seconds for a query to execute
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Automated Backups
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable scheduled database backups
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-backups"
                      className="absolute w-0 h-0 opacity-0"
                      checked={settings.database.backupEnabled}
                      onChange={(e) => handleSettingChange('database', 'backupEnabled', e.target.checked)}
                    />
                    <label
                      htmlFor="toggle-backups"
                      className={`absolute w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
                        settings.database.backupEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-md transform ${
                          settings.database.backupEnabled ? 'translate-x-6' : 'translate-x-1'
                        } top-0.5`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;