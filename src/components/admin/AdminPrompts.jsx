// src/components/admin/AdminPrompts.jsx
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Check,
  AlertCircle,
  Code,
  RefreshCw
} from 'lucide-react';
import { adminAPI, promptsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const AdminPrompts = () => {
  // State
  const [prompts, setPrompts] = useState([]);
  const [followUpPrompts, setFollowUpPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('regular');
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    prompt_type: 'regular',
    display_order: 0,
    is_active: true
  });
  
  // Load prompts on mount
  useEffect(() => {
    loadPrompts();
  }, [activeTab]);
  
  // Load prompts
  const loadPrompts = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.getAdminPrompts({
        prompt_type: activeTab,
        is_active: null
      });
      
      if (activeTab === 'regular') {
        setPrompts(response.data.items);
      } else {
        setFollowUpPrompts(response.data.items);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };
  
  // Reload all prompts
  const reloadAllPrompts = async () => {
    try {
      setRefreshing(true);
      await adminAPI.reloadPrompts();
      toast.success('Prompts reloaded successfully');
      await loadPrompts();
    } catch (error) {
      console.error('Failed to reload prompts:', error);
      toast.error('Failed to reload prompts');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Start editing a prompt
  const handleEditPrompt = (prompt) => {
    setEditingPrompt(prompt.id);
    setFormData({
      name: prompt.name,
      description: prompt.description || '',
      content: prompt.content,
      prompt_type: prompt.prompt_type,
      display_order: prompt.display_order || 0,
      is_active: prompt.is_active
    });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPrompt(null);
    resetForm();
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      content: '',
      prompt_type: activeTab,
      display_order: 0,
      is_active: true
    });
  };
  
  // Open create modal
  const handleOpenCreateModal = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      prompt_type: activeTab
    }));
    setShowCreateModal(true);
  };
  
  // Close create modal
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };
  
  // Create new prompt
  const handleCreatePrompt = async () => {
    try {
      if (!formData.name || !formData.content) {
        toast.error('Name and content are required');
        return;
      }
      
      const response = await adminAPI.createPrompt(formData);
      toast.success('Prompt created successfully');
      handleCloseCreateModal();
      await loadPrompts();
    } catch (error) {
      console.error('Failed to create prompt:', error);
      toast.error('Failed to create prompt');
    }
  };
  
  // Update prompt
  const handleUpdatePrompt = async (promptId) => {
    try {
      if (!formData.name || !formData.content) {
        toast.error('Name and content are required');
        return;
      }
      
      const response = await adminAPI.updatePrompt(promptId, formData);
      toast.success('Prompt updated successfully');
      setEditingPrompt(null);
      await loadPrompts();
    } catch (error) {
      console.error('Failed to update prompt:', error);
      toast.error('Failed to update prompt');
    }
  };
  
  // Delete prompt
  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    try {
      await adminAPI.deletePrompt(promptId);
      toast.success('Prompt deleted successfully');
      await loadPrompts();
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };
  
  // Toggle prompt active status
  const handleToggleActive = async (prompt) => {
    try {
      const updatedData = {
        ...prompt,
        is_active: !prompt.is_active
      };
      
      await adminAPI.updatePrompt(prompt.id, updatedData);
      toast.success(`Prompt ${updatedData.is_active ? 'activated' : 'deactivated'} successfully`);
      await loadPrompts();
    } catch (error) {
      console.error('Failed to update prompt status:', error);
      toast.error('Failed to update prompt status');
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prompt Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage AI prompt templates for different use cases
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={reloadAllPrompts}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 flex items-center disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Reload Prompts
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Prompt
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('regular')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'regular'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Regular Prompts
          </button>
          <button
            onClick={() => setActiveTab('follow_up')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'follow_up'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Follow-up Prompts
          </button>
        </div>
        
        {/* Prompts List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : activeTab === 'regular' ? (
            <>
              {prompts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Prompts Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first prompt to get started.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Prompt
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {prompts.map((prompt) => (
                    <div 
                      key={prompt.id} 
                      className={`bg-white dark:bg-gray-800 border ${
                        prompt.is_active 
                          ? 'border-gray-200 dark:border-gray-700' 
                          : 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10'
                      } rounded-lg p-4`}
                    >
                      {editingPrompt === prompt.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Prompt name (e.g., 'main', 'debugging')"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Short description"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Content *
                            </label>
                            <textarea
                              name="content"
                              value={formData.content}
                              onChange={handleInputChange}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              placeholder="Prompt content..."
                            ></textarea>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="is_active"
                              name="is_active"
                              checked={formData.is_active}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Active
                            </label>
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdatePrompt(prompt.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              Update Prompt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {prompt.name}
                              </h4>
                              {!prompt.is_active && (
                                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleActive(prompt)}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  prompt.is_active 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                                title={prompt.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {prompt.is_active ? (
                                  <Check className="h-5 w-5" />
                                ) : (
                                  <X className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditPrompt(prompt)}
                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeletePrompt(prompt.id)}
                                className="p-1 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          
                          {prompt.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {prompt.description}
                            </p>
                          )}
                          
                          <div className="mt-2 bg-gray-50 dark:bg-gray-750 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                              {prompt.content.length > 200 
                                ? prompt.content.substring(0, 200) + '...' 
                                : prompt.content}
                            </pre>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {followUpPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Follow-up Prompts Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first follow-up prompt to get started.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Follow-up Prompt
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {followUpPrompts.map((prompt) => (
                    <div 
                      key={prompt.id} 
                      className={`bg-white dark:bg-gray-800 border ${
                        prompt.is_active 
                          ? 'border-gray-200 dark:border-gray-700' 
                          : 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10'
                      } rounded-lg p-4`}
                    >
                      {editingPrompt === prompt.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Prompt type (e.g., 'time_complexity', 'debugging')"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Display Text *
                            </label>
                            <input
                              type="text"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Text shown to the user (e.g., 'Can you optimize the time complexity?')"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Content *
                            </label>
                            <textarea
                              name="content"
                              value={formData.content}
                              onChange={handleInputChange}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                              placeholder="Prompt content to be sent to AI..."
                            ></textarea>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Display Order
                            </label>
                            <input
                              type="number"
                              name="display_order"
                              value={formData.display_order}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Order in the list (lower numbers appear first)"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="is_active"
                              name="is_active"
                              checked={formData.is_active}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Active
                            </label>
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdatePrompt(prompt.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              Update Prompt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {prompt.name}
                              </h4>
                              {!prompt.is_active && (
                                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                                  Inactive
                                </span>
                              )}
                              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                                Order: {prompt.display_order || 0}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleActive(prompt)}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  prompt.is_active 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                                title={prompt.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {prompt.is_active ? (
                                  <Check className="h-5 w-5" />
                                ) : (
                                  <X className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditPrompt(prompt)}
                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeletePrompt(prompt.id)}
                                className="p-1 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg mb-3">
                            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                            <p className="text-blue-800 dark:text-blue-300">
                              {prompt.description || "Follow-up prompt"}
                            </p>
                          </div>
                          
                          <div className="mt-2 bg-gray-50 dark:bg-gray-750 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                              {prompt.content.length > 200 
                                ? prompt.content.substring(0, 200) + '...' 
                                : prompt.content}
                            </pre>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Create Prompt Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                Create {activeTab === 'follow_up' ? 'Follow-up' : 'Regular'} Prompt
              </h3>
              <button
                onClick={handleCloseCreateModal}
                className="text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={activeTab === 'follow_up' ? "Prompt type (e.g., 'time_complexity')" : "Prompt name (e.g., 'main')"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {activeTab === 'follow_up' ? 'Display Text *' : 'Description'}
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={activeTab === 'follow_up' ? "Text shown to the user" : "Short description"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="Prompt content..."
                ></textarea>
              </div>
              
              {activeTab === 'follow_up' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Order in the list (lower numbers appear first)"
                  />
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="create_is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="create_is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePrompt}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrompts;