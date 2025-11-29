'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signInWithGoogleVCU } from '@/lib/auth';

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    setError('');
    setIsSigningIn(true);

    const result = await signInWithGoogleVCU();

    if (result.success) {
      // Success! Will redirect via useEffect when user state updates
    } else {
      // Error - show message and stop loading
      setError(result.error || 'Failed to sign in');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-yellow-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            🐏 RamTrade
          </h1>
          <p className="text-lg text-gray-600">
            VCU Student Marketplace
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Sign In
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Sign in with your <span className="font-semibold">@vcu.edu</span> email to get started
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSigningIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-6">
            Only <span className="font-semibold">@vcu.edu</span> email addresses are allowed
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Unofficial student marketplace. Not affiliated with VCU.
        </p>
      </div>
    </main>
  );
}