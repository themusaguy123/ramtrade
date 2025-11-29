'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    setShowDropdown(false);
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">🐏</span>
            <span className="text-xl font-bold text-gray-900">RamTrade</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Home
            </Link>

            {user && (
              <>
                <Link 
                  href="/create-listing" 
                  className="text-gray-700 hover:text-gray-900 font-medium transition"
                >
                  Create Listing
                </Link>
                <Link 
                  href="/messages" 
                  className="text-gray-700 hover:text-gray-900 font-medium transition"
                >
                  Messages
                </Link>
              </>
            )}

            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        href={`/profile/${user.uid}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Profile
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}