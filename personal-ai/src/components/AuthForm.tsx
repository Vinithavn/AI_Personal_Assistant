'use client';

import { useState, FormEvent } from 'react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (username: string, password: string) => Promise<void>;
  error?: string;
}

export function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Form validation
    setValidationError('');
    
    if (!username.trim()) {
      setValidationError('Username is required');
      return;
    }
    
    if (!password) {
      setValidationError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(username, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-5 w-full max-w-md"
      aria-label={mode === 'login' ? 'Login form' : 'Signup form'}
    >
      <div>
        <label 
          htmlFor="username" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
          aria-required="true"
          aria-invalid={!!validationError || !!error}
          aria-describedby={validationError || error ? 'form-error' : undefined}
          className="w-full px-4 py-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                     dark:bg-gray-900 dark:text-white transition-all"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          aria-required="true"
          aria-invalid={!!validationError || !!error}
          aria-describedby={validationError || error ? 'form-error' : undefined}
          className="w-full px-4 py-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                     dark:bg-gray-900 dark:text-white transition-all"
          placeholder="Enter your password"
        />
      </div>

      {(validationError || error) && (
        <div 
          id="form-error"
          role="alert"
          aria-live="polite"
          className="p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in"
        >
          <div className="flex items-start gap-2">
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
            <p className="text-sm text-red-700 dark:text-red-300">{validationError || error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                   text-white font-medium text-base rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   disabled:bg-gray-400 disabled:cursor-not-allowed 
                   transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg 
              className="animate-spin h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{mode === 'login' ? 'Logging in...' : 'Signing up...'}</span>
          </span>
        ) : (
          mode === 'login' ? 'Log In' : 'Sign Up'
        )}
      </button>
    </form>
  );
}
