'use client';

import { useState, KeyboardEvent, FormEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 
                 p-3 sm:p-4 shadow-lg"
      aria-label="Message input form"
    >
      <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type your message..."
            rows={1}
            aria-label="Message input"
            aria-describedby="input-hint"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                       border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed 
                       dark:bg-gray-800 dark:text-white
                       resize-none transition-all"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          {message.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
              {message.length}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          aria-label={disabled ? 'Sending message' : 'Send message'}
          aria-busy={disabled}
          className="flex-shrink-0 p-2.5 sm:p-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                     text-white font-medium rounded-xl shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed 
                     transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {disabled ? (
            <svg 
              className="animate-spin h-5 w-5 sm:h-6 sm:w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          )}
        </button>
      </div>
      
      <p 
        id="input-hint" 
        className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center sm:text-left"
      >
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">Enter</kbd> to send, 
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs ml-1">Shift+Enter</kbd> for new line
      </p>
    </form>
  );
}
