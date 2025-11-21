'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useAuth } from '@/hooks/useAuth';
import { getSessionData, sendChatMessage, ApiError } from '@/lib/api';
import { Message, ApiMessage } from '@/lib/types';
import { useToast } from '@/contexts/ToastContext';

function ChatPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const sessionId = params.sessionId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch session history on mount
  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (!sessionId) return;

      try {
        setIsLoading(true);
        setError(null);
        const chatHistory = await getSessionData(sessionId);
        
        // Convert API messages to Message format
        const formattedMessages: Message[] = chatHistory.messages.map((msg: ApiMessage, index: number) => ({
          id: `${sessionId}-${index}`,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(), // API doesn't provide timestamps, use current time
        }));

        setMessages(formattedMessages);
      } catch (err) {
        let errorMessage = 'Failed to load session history';
        if (err instanceof ApiError) {
          if (err.status === 404) {
            errorMessage = 'Session not found';
          } else {
            errorMessage = err.message;
          }
        }
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionHistory();
  }, [sessionId, showToast]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!user || !sessionId) return;

    try {
      setIsSending(true);
      setError(null);

      // Display user message immediately
      const userMessage: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Add typing indicator
      const typingMessage: Message = {
        id: 'typing-indicator',
        role: 'assistant',
        content: 'AI is thinking...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, typingMessage]);

      // Send message to API
      const aiResponse = await sendChatMessage(sessionId, user, message);

      // Remove typing indicator and display AI response
      setMessages((prev) => prev.filter(msg => msg.id !== 'typing-indicator'));
      
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Remove typing indicator on error
      setMessages((prev) => prev.filter(msg => msg.id !== 'typing-indicator'));
      
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleBackToSessions = () => {
    router.push('/sessions');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">Loading chat history...</p>
          <span className="sr-only">Loading chat history</span>
        </div>
      </div>
    );
  }

  if (error && error === 'Session not found') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                        rounded-2xl p-6 sm:p-8 shadow-lg" role="alert">
            <svg
              className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 dark:text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Session Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              The session you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={handleBackToSessions}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                       text-white font-semibold rounded-xl shadow-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
                       px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={handleBackToSessions}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     transition-colors flex-shrink-0"
            aria-label="Back to sessions"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              Chat Session
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
              {sessionId}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium 
                   text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
                   border border-gray-300 dark:border-gray-600 rounded-lg 
                   hover:bg-gray-50 dark:hover:bg-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                   transition-all duration-200 flex-shrink-0"
        >
          <span className="hidden sm:inline">Logout</span>
          <svg 
            className="w-4 h-4 sm:hidden" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </button>
      </header>

      {/* Error message */}
      {error && error !== 'Session not found' && (
        <div 
          role="alert"
          className="mx-3 sm:mx-4 mt-3 sm:mt-4 bg-red-50 dark:bg-red-900/20 
                   border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4 
                   shadow-sm animate-fade-in"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <svg
              className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Messages container */}
      <div 
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center text-gray-500 dark:text-gray-400 max-w-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 
                            bg-gradient-to-br from-blue-100 to-purple-100 
                            dark:from-blue-900/20 dark:to-purple-900/20 
                            rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No messages yet
              </h2>
              <p className="text-sm sm:text-base">
                Start a conversation with your AI assistant
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="w-full">
        <ChatInput onSend={handleSendMessage} disabled={isSending} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  );
}
