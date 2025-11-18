'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/sessions');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
                    dark:from-gray-900 dark:to-gray-800">
      <div className="text-center" role="status" aria-live="polite">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-900 opacity-25"></div>
        </div>
        <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
          Loading...
        </p>
        <span className="sr-only">Loading application</span>
      </div>
    </div>
  );
}
