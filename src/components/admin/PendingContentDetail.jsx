// src/components/admin/PendingContentDetail.jsx (continued)
import React, { useState } from 'react';
import { 
  X, 
  Check, 
  XCircle, 
  Clock, 
  User, 
  Edit, 
  AlertTriangle,
  MessageSquare,
  Code,
  FileText
} from 'lucide-react';
import { formatTimeAgo, formatDate } from '../../services/utils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Markdown from '../common/Markdown';

const PendingContentDetail = ({ item, onApprove, onReject, onClose }) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Handle approve
  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(item.id, adminNotes);
    setProcessing(false);
  };
  
  // Handle reject
  const handleReject = async () => {
    setProcessing(true);
    await onReject(item.id, adminNotes);
    setProcessing(false);
  };
  
  // Get content type icon
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'question':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'solution':
        return <Code className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center">
          {getContentTypeIcon(item.content_type)}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white ml-2">
            {item.content_type === 'question' ? 'Code Question' : 'Code Solution'} Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Meta Info */}
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Submitted By</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {item.submitter_username}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Submitted</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatDate(item.created_at)} ({formatTimeAgo(item.created_at)})
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Content Type</span>
              <span className="text-sm text-gray-900 dark:text-white capitalize">
                {item.content_type}
              </span>
            </div>
            
            {item.language && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
                <span className="text-sm text-gray-900 dark:text-white uppercase">
                  {item.language}
                </span>
              </div>
            )}
            
            {item.difficulty && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                <span className="text-sm text-gray-900 dark:text-white capitalize">
                  {item.difficulty}
                </span>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              {item.content_data?.title || item.content_data?.question_text || 'Content'}
            </h4>
            
            {/* Code Block */}
            {item.content_data?.code_snippet && (
              <div className="mb-4">
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium uppercase">
                      {item.language || 'code'}
                    </span>
                  </div>
                  <SyntaxHighlighter
                    language={item.language || 'javascript'}
                    style={vs2015}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '14px',
                      padding: '1rem'
                    }}
                  >
                    {item.content_data.code_snippet}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
            
            {/* Explanation */}
            {item.content_data?.explanation && (
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mt-4 prose prose-sm dark:prose-invert max-w-none">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Explanation
                </h5>
                <Markdown>{item.content_data.explanation}</Markdown>
              </div>
            )}
            
            {/* Tags */}
            {item.content_data?.tags && item.content_data.tags.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tags
                </h5>
                <div className="flex flex-wrap gap-2">
                  {item.content_data.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Submitter Notes */}
            {item.submitter_notes && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-blue-500" />
                  Submitter Notes
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {item.submitter_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Admin Notes
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Add notes about this content review..."
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleReject}
              disabled={processing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center disabled:opacity-70"
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Reject
            </button>
            
            <button
              onClick={handleApprove}
              disabled={processing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-70"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingContentDetail;