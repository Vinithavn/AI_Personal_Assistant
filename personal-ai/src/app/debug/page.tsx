'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserFacts } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function DebugPageContent() {
  const { user } = useAuth();
  const [facts, setFacts] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFacts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserFacts(user);
      setFacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load facts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Debug: User Facts
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Username:</span> {user}
            </p>
          </div>

          <button
            onClick={loadFacts}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                     text-white font-semibold rounded-lg shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-all duration-200"
          >
            {loading ? 'Loading...' : 'Load User Facts'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                        rounded-xl p-4 mb-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {facts && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Stored Facts
            </h2>
            
            {Array.isArray(facts) && facts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No facts stored yet.</p>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(facts, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DebugPage() {
  return (
    <ProtectedRoute>
      <DebugPageContent />
    </ProtectedRoute>
  );
}
