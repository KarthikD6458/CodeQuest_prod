// src/components/search/ResponseCard.jsx
import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  MessageCircle, 
  Bookmark,
  BookmarkCheck,
  Code
} from 'lucide-react';
import toast from 'react-hot-toast';
import { searchAPI } from '../../services/api';
import { formatTimeAgo } from '../../services/utils';

// Simple markdown formatter
const SimpleMarkdown = ({ content }) => {
  if (!content) return null;
  
  // Split by double newlines for paragraphs
  const paragraphs = content.split('\n\n');
  
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {paragraphs.map((paragraph, i) => {
        if (paragraph.startsWith('### ')) {
          // h3 heading
          return <h3 key={i} className="text-lg font-semibold mt-4">{paragraph.substring(4)}</h3>;
        } else if (paragraph.startsWith('## ')) {
          // h2 heading
          return <h2 key={i} className="text-xl font-semibold mt-4">{paragraph.substring(3)}</h2>;
        } else if (paragraph.startsWith('# ')) {
          // h1 heading
          return <h1 key={i} className="text-2xl font-bold mt-4">{paragraph.substring(2)}</h1>;
        } else if (paragraph.startsWith('- ')) {
          // unordered list
          const items = paragraph.split('\n- ');
          return (
            <ul key={i} className="list-disc pl-5 mt-2">
              {items.map((item, j) => (
                <li key={j} className="mt-1">{item.replace(/^- /, '')}</li>
              ))}
            </ul>
          );
        } else if (paragraph.startsWith('1. ')) {
          // ordered list
          const items = paragraph.split('\n');
          return (
            <ol key={i} className="list-decimal pl-5 mt-2">
              {items.map((item, j) => (
                <li key={j} className="mt-1">{item.replace(/^\d+\.\s/, '')}</li>
              ))}
            </ol>
          );
        } else if (paragraph.startsWith('```')) {
          // code block - but we handle these separately
          return null;
        } else if (paragraph.startsWith('>')) {
          // blockquote
          return <blockquote key={i} className="border-l-4 border-gray-300 pl-4 italic my-4">{paragraph.substring(2)}</blockquote>;
        } else if (paragraph.startsWith('---')) {
          // horizontal rule
          return <hr key={i} className="my-4 border-t border-gray-300 dark:border-gray-700" />;
        } else {
          // regular paragraph
          return <p key={i} className="my-2">{paragraph}</p>;
        }
      })}
    </div>
  );
};

const ResponseCard = ({ response, onFollowUpClick }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Filter valid code blocks
  const getValidCodeBlocks = () => {
    if (!response || !response.clean_code_blocks) return [];
    
    return response.clean_code_blocks.filter(block => 
      block && block.code && block.code.trim() !== "" && 
      !["Statement", "Restatement", "text"].includes(block.language)
    );
  };
  
  // Find code blocks in the explanation
  const extractCodeFromExplanation = () => {
    if (!response || !response.explanation) return [];
    
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const matches = [];
    let match;
    
    while ((match = codeBlockRegex.exec(response.explanation)) !== null) {
      matches.push({
        language: match[1] || "text",
        code: match[2].trim()
      });
    }
    
    return matches;
  };
  
  // Combine both sources of code blocks
  const validCodeBlocks = getValidCodeBlocks();
  const explanationCodeBlocks = extractCodeFromExplanation();
  
  // Use explanation code blocks if no valid code blocks found
  const codeBlocksToDisplay = validCodeBlocks.length > 0 ? validCodeBlocks : explanationCodeBlocks;
  
  // Handle copy code to clipboard
  const handleCopyCode = () => {
    if (codeBlocksToDisplay.length === 0) {
      toast.error('No code to copy');
      return;
    }
    
    const codeToCopy = codeBlocksToDisplay.map(block => block.code).join('\n\n');
    
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        setIsCopied(true);
        toast.success('Code copied to clipboard!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        toast.error('Failed to copy code');
      });
  };
  
  // Handle save to starred/favorites
  const handleSaveSolution = async () => {
    try {
      setIsSubmitting(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('question_text', response.question_text || '');
      formData.append('code_blocks', JSON.stringify(response.code_blocks || []));
      formData.append('explanation', response.explanation || '');
      formData.append('difficulty', response.difficulty || 'medium');
      formData.append('language', response.language || 'text');
      formData.append('search_hash', response.search_hash || '');
      formData.append('image_paths', JSON.stringify(response.image_paths || []));
      formData.append('approach_type', response.approach_type || 'original');
      
      if (response.session_id) {
        formData.append('session_id', response.session_id);
      }
      
      if (response.original_query) {
        formData.append('original_query', response.original_query);
      }
      
      // Submit for approval
      await searchAPI.submitForApproval(formData);
      
      setIsSaved(true);
      toast.success('Solution saved successfully!');
      
    } catch (error) {
      console.error('Failed to save solution:', error);
      toast.error('Failed to save solution');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format the explanation by removing code blocks
  const formatExplanation = (explanation) => {
    if (!explanation) return '';
    return explanation.replace(/```(\w+)?\n[\s\S]*?```/g, '');
  };
  
  if (!response) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {response.question_text || "Code Solution"}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Code className="h-4 w-4 mr-1" />
            <span className="uppercase">{response.language || "text"}</span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(response.created_at)}</span>
          </div>
        </div>
      </div>
      
      {/* Code Blocks */}
      <div className="p-6">
        {codeBlocksToDisplay.length > 0 ? (
          codeBlocksToDisplay.map((block, index) => (
            <div key={index} className="mb-6">
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-300 font-medium">
                    {block.language.toUpperCase()}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-gray-300 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {isCopied ? (
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
          ))
        ) : (
          <div className="mb-6 text-gray-600 dark:text-gray-400 italic">
            No code blocks available. See explanation below for details.
          </div>
        )}
        
        {/* Explanation */}
        {response.explanation && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Explanation</h4>
            <SimpleMarkdown content={formatExplanation(response.explanation)} />
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-600 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex space-x-2">
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-1.5 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Code
              </>
            )}
          </button>
          
          <button
            onClick={onFollowUpClick}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            Follow-up
          </button>
        </div>
        
        <button
          onClick={handleSaveSolution}
          disabled={isSubmitting || isSaved}
          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isSaved
              ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
              : 'text-purple-700 bg-purple-100 hover:bg-purple-200 dark:text-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-800/30'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="h-4 w-4 mr-1.5" />
              Saved
            </>
          ) : isSubmitting ? (
            <>
              <div className="h-4 w-4 mr-1.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-1.5" />
              Star Solution
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResponseCard;