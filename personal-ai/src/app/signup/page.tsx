'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (username: string, password: string) => {
    try {
      setError('');
      setSuccess(false);
      await signup(username, password);
      // Display success message on successful signup
      setSuccess(true);
      showToast('Account created successfully! Redirecting to login...', 'success');
      // Redirect to login page after a brief delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      // Display error message on failure
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 
                    dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 
                          rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <svg 
                className="w-10 h-10 sm:w-12 sm:h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Get Started
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create your account to start using AI Personal Assistant
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div 
            role="alert"
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
                     rounded-xl shadow-sm animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <svg 
                className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Account created successfully! Redirecting to login...
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <AuthForm mode="signup" onSubmit={handleSignup} error={error} />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 
                       dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
