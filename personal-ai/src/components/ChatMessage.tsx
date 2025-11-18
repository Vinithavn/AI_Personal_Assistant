'use client';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  const isTyping = content === 'AI is thinking...';
  
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6 px-2 sm:px-0 animate-fade-in`}
      role="article"
      aria-label={`Message from ${isUser ? 'you' : 'AI assistant'}`}
    >
      <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar and message container */}
        <div className="flex items-start gap-2 sm:gap-3">
          {!isUser && (
            <div 
              className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                         flex items-center justify-center shadow-sm"
              aria-hidden="true"
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
          
          <div className="flex-1">
            <div
              className={`rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-sm ${
                isUser
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
              }`}
            >
              {isTyping ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic ml-2">
                    AI is thinking...
                  </span>
                </div>
              ) : (
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {content}
                </p>
              )}
            </div>
            
            {/* Timestamp - hide for typing indicator */}
            {!isTyping && (
              <div className={`flex items-center mt-1.5 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="font-medium">{isUser ? 'You' : 'AI Assistant'}</span>
                  <span aria-hidden="true">•</span>
                  <time dateTime={timestamp.toISOString()}>
                    {formatTimestamp(timestamp)}
                  </time>
                </span>
              </div>
            )}
          </div>

          {isUser && (
            <div 
              className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 
                         flex items-center justify-center shadow-sm"
              aria-hidden="true"
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
