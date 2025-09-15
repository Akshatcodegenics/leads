'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail } from 'lucide-react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn('email', { email, callbackUrl: '/buyers' });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('demo', { callbackUrl: '/buyers' });
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Check your email</h3>
        <p className="mt-1 text-sm text-gray-500">
          We've sent a magic link to {email}
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="form-input"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading || !email}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Demo Login'}
        </button>
      </div>
    </form>
  );
}
