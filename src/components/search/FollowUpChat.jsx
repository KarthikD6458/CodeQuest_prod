// src/components/search/FollowUpChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Send, 
  Upload, 
  MessageSquare, 
  Copy, 
  Check,
  Zap,
  Brain,
  Target,
  Bug,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { searchAPI, promptsAPI } from '../../services/api';
import LanguageSelector from '../common/LanguageSelector';

// Simple markdown formatter
const formatMarkdown = (text) => {
  if (!text) return '';
  
  return text
    .replace(/### (.*?)\n/g, '<h3 class="text-lg font-semibold mt-4">$1</h3>')
    .replace(/## (.*?)\n/g, '<h2 class="text-xl font-semibold mt-4">$1</h2>')
    .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold mt-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
    .replace(/---/g, '<hr class="my-4"/>')
    .replace(/\n\n/g, '<br/><br/>');
};

const FollowUpChat = ({ previousResult, sessionId, onClose }) => {
  const [followUpPrompts, setFollowUpPrompts] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [language, setLanguage] = useState(previousResult?.language || 'all');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messageEndRef = useRef(null);
  
  // Load default follow-up prompts
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const response = await promptsAPI.getPrompts();
        if (response.data && response.data.default_follow_up_prompts) {
          setFollowUpPrompts(response.data.default_follow_up_prompts);
        } else {
          // Fallback default prompts
          setFollowUpPrompts([
            { type: "time_complexity", text: "Can you optimize the time complexity?" },
            { type: "space_complexity", text: "How can we reduce the memory usage?" },
            { type: "debugging", text: "What are common edge cases to watch for?" },
            { type: "alternative", text: "Is there a different approach to solve this?" },
            { type: "edge_case", text: "How would this handle very large inputs?" }
          ]);
        }
      } catch (error) {
        console.error('Failed to load follow-up prompts:', error);
        // Fallback prompts
        setFollowUpPrompts([
          { type: "time_complexity", text: "Can you optimize the time complexity?" },
          { type: "space_complexity", text: "How can we reduce the memory usage?" },
          { type: "debugging", text: "What are common edge cases to watch for?" },
          { type: "alternative", text: "Is there a different approach to solve this?" },
          { type: "edge_case", text: "How would this handle very large inputs?" }
        ]);
      }
    };
    
    loadPrompts();
    
    // Get valid code blocks (ignoring special types)
    const validCodeBlocks = (previousResult.clean_code_blocks || []).filter(block => 
      block && block.code && block.code.trim() !== "" && 
      !["Statement", "Restatement", "text"].includes(block.language)
    );
    
    // Add the original question to chat history
    setChatHistory([
      {
        type: 'original',
        question: previousResult.question_text || "Original question",
        code: validCodeBlocks,
        explanation: previousResult.explanation || ""
      }
    ]);
    
    // Clean up on unmount
    return () => {
      previewImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [previousResult]);
  
  // Scroll to bottom when chat history updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxSize: 10485760, // 10MB
    onDrop: acceptedFiles => {
      // Create preview images
      const newPreviews = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);
      setUploadedImages(prev => [...prev, ...acceptedFiles]);
    },
    onDropRejected: rejectedFiles => {
      rejectedFiles.forEach(rejected => {
        if (rejected.errors[0].code === 'file-too-large') {
          toast.error(`File ${rejected.file.name} is too large (max 10MB)`);
        } else {
          toast.error(`File ${rejected.file.name} was rejected: ${rejected.errors[0].message}`);
        }
      });
    }
  });
  
  // Remove image from preview and uploaded images
  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index].preview);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
  };
  
  // Handle sending follow-up message
  const handleSendMessage = async (questionText = null, approachType = 'debugging') => {
    const followUpText = questionText || message;
    
    if (!followUpText.trim() && uploadedImages.length === 0) {
      toast.error('Please enter a message or upload an image');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('previous_result', JSON.stringify(previousResult || {}));
      formData.append('follow_up_question', followUpText);
      formData.append('language_filter', language);
      formData.append('approach_type', approachType);
      
      if (sessionId) {
        formData.append('session_id', sessionId);
      }
      
      // Add images
      uploadedImages.forEach(image => {
        formData.append('images', image);
      });
      
      // Add question to chat history immediately for better UX
      setChatHistory(prev => [
        ...prev,
        {
          type: 'question',
          text: followUpText,
          images: previewImages.map(img => img.preview)
        }
      ]);
      
      // Submit follow-up
      const response = await searchAPI.continueChat(formData);
      
      // Filter valid code blocks
      const validCodeBlocks = (response.data.clean_code_blocks || []).filter(block => 
        block && block.code && block.code.trim() !== "" && 
        !["Statement", "Restatement", "text"].includes(block.language)
      );
      
      // Add response to chat history
      setChatHistory(prev => [
        ...prev,
        {
          type: 'answer',
          explanation: response.data.explanation || "",
          code: validCodeBlocks
        }
      ]);
      
      // Clear input
      setMessage('');
      setUploadedImages([]);
      setPreviewImages([]);
      
    } catch (error) {
      console.error('Follow-up error:', error);
      toast.error('Failed to process follow-up. Please try again.');
      
      // Remove the pending question
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle copying code
  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedIndex(index);
        toast.success('Code copied to clipboard!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        toast.error('Failed to copy code');
      });
  };
  
  // Handle follow-up prompt click
  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt.text, prompt.type);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-purple-600 dark:bg-purple-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-white mr-2" />
          <h3 className="text-lg font-semibold text-white">Follow-up Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Quick Prompts */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2">
          {followUpPrompts.map((prompt, index) => {
            // Select icon based on prompt type
            let Icon = MessageSquare;
            if (prompt.type === 'time_complexity') Icon = Zap;
            else if (prompt.type === 'space_complexity') Icon = Brain;
            else if (prompt.type === 'edge_case') Icon = Target;
            else if (prompt.type === 'debugging') Icon = Bug;
            else if (prompt.type === 'alternative') Icon = RefreshCw;
            
            return (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/30 whitespace-nowrap transition-colors disabled:opacity-50"
              >
                <Icon className="h-3 w-3 mr-1.5" />
                {prompt.text}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Chat History */}
      <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`${chat.type === 'question' ? 'ml-auto max-w-[80%]' : 'max-w-full'}`}>
            {chat.type === 'original' ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original Question:</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{chat.question}</p>
              </div>
            ) : chat.type === 'question' ? (
              <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-gray-900 dark:text-gray-100">{chat.text}</p>
                
                {/* Display image previews for questions */}
                {chat.images && chat.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chat.images.map((img, imgIndex) => (
                      <img 
                        key={imgIndex} 
                        src={img} 
                        alt={`Uploaded ${imgIndex}`} 
                        className="h-20 w-20 object-cover rounded-md border border-purple-200 dark:border-purple-800" 
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Display code blocks */}
                {chat.code && chat.code.length > 0 && chat.code.map((block, blockIndex) => (
                  <div key={blockIndex} className="mb-4">
                    <div className="rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm text-gray-300 font-medium">
                          {block.language.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleCopyCode(block.code, `${index}-${blockIndex}`)}
                          className="text-gray-300 hover:text-white transition-colors"
                          title="Copy Code"
                        >
                          {copiedIndex === `${index}-${blockIndex}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
                        {block.code}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Display explanation */}
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(chat.explanation) }}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messageEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-600 p-4">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <LanguageSelector
              value={language}
              onChange={handleLanguageChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          
          {/* Image Upload Button */}
          <div 
            {...getRootProps()} 
            className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        {/* Preview Images */}
        {previewImages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {previewImages.map((file, index) => (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <img 
                  src={file.preview} 
                  alt={`Preview ${index}`} 
                  className="h-16 w-16 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-black/80"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Message Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || (!message.trim() && uploadedImages.length === 0)}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FollowUpChat;