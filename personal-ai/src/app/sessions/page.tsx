'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SessionCard } from '@/components/SessionCard';
import { useAuth } from '@/hooks/useAuth';
import { getUserSessions, createSession } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function SessionsPage() {
  return (
    <ProtectedRoute>
      <SessionsContent />
    </ProtectedRoute>
  );
}

function SessionsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<Array<{session_id: string, session_name: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getUserSessions(user);
        setSessions(response.sessions || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load sessions';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user, showToast]);

  const handleCreateSession = async () => {
    if (!user) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await createSession(user);
      // Update session list with new session
      setSessions((prev) => [...prev, {session_id: response.session_id, session_name: "New Chat"}]);
      showToast('New session created successfully!', 'success');
      // Navigate to the new chat session
      router.push(`/chat/${response.session_id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsCreating(false);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    router.push('/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">Loading sessions...</p>
          <span className="sr-only">Loading your sessions</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                My Sessions
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                Welcome back, <span className="font-medium">{user}</span>
              </p>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Message */}
        {error && (
          <div 
            role="alert"
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                     rounded-xl shadow-sm animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" 
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
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* New Session Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCreateSession}
            disabled={isCreating}
            aria-busy={isCreating}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                     text-white font-semibold text-sm sm:text-base rounded-xl shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-200 transform hover:scale-105 active:scale-95
                     flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                <span>New Session</span>
              </>
            )}
          </button>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 dark:text-gray-600"
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
              <h3 className="mt-6 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                No sessions yet
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                Get started by creating a new session to chat with your AI assistant.
              </p>
            </div>
          </div>
        ) : (
          <div 
            className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label="Your chat sessions"
          >
            {sessions.map((session) => (
              <SessionCard
                key={session.session_id}
                sessionId={session.session_id}
                sessionName={session.session_name}
                onClick={() => handleSessionClick(session.session_id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
