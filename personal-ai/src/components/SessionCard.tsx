'use client';

import { KeyboardEvent } from 'react';

interface SessionCardProps {
  sessionId: string;
  sessionName?: string;
  onClick: () => void;
}

export function SessionCard({ sessionId, sessionName = "New Chat", onClick }: SessionCardProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open chat session ${sessionId}`}
      className="p-4 sm:p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 
                 transition-all duration-200 cursor-pointer group 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <svg 
              className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {sessionName}
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400 truncate">
            {sessionId}
          </p>
        </div>
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500 
                     group-hover:text-blue-600 dark:group-hover:text-blue-400 
                     transition-all duration-200 flex-shrink-0 
                     group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
