// src/components/common/Markdown.jsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Simple fallback markdown renderer
const SimpleFallbackMarkdown = ({ children, className = "" }) => {
  // This is a very simplified markdown fallback that just renders text with code blocks
  const renderText = (text) => {
    // Basic code block detection with triple backticks
    const parts = text.split(/```([\s\S]*?)```/);
    return parts.map((part, i) => {
      if (i % 2 === 0) {
        // Regular text
        return <p key={i} className="mb-4">{part}</p>;
      } else {
        // Code block
        return (
          <div key={i} className="mb-4">
            <SyntaxHighlighter
              style={vscDarkPlus}
              language="javascript"
              customStyle={{
                borderRadius: '0.375rem',
                fontSize: '14px',
                padding: '1rem'
              }}
            >
              {part.trim()}
            </SyntaxHighlighter>
          </div>
        );
      }
    });
  };

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {typeof children === 'string' ? renderText(children) : children}
    </div>
  );
};

// Attempt to dynamically import react-markdown and its plugins
const Markdown = ({ children, className = "" }) => {
  // If the markdown is empty or not a string, render nothing
  if (!children || typeof children !== 'string') {
    return null;
  }
  
  try {
    // Try to use the imported libraries if available
    const ReactMarkdown = require('react-markdown');
    const remarkGfm = require('remark-gfm');
    const rehypeRaw = require('rehype-raw');
    
    return (
      <ReactMarkdown
        className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md overflow-hidden"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            );
          },
          a: ({ node, children, ...props }) => (
            <a 
              {...props} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-300 dark:border-gray-700" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ node, children, ...props }) => (
            <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left" {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props}>
              {children}
            </td>
          )
        }}
      >
        {children}
      </ReactMarkdown>
    );
  } catch (error) {
    // Fallback to simple renderer if packages aren't installed
    console.warn('Markdown libraries not available, using fallback renderer', error);
    return <SimpleFallbackMarkdown className={className}>{children}</SimpleFallbackMarkdown>;
  }
};

export default Markdown;