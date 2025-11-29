'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getListingsBySeller, Listing } from '@/lib/firestore';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';

type UserData = {
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: any;
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [currentUser] = useAuthState(auth);
  const userId = params.uid as string;

  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      try {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (!userDoc.exists()) {
          setError('User not found');
          setLoading(false);
          return;
        }

        setProfileUser(userDoc.data() as UserData);

        // Get user's listings
        const listingsResult = await getListingsBySeller(userId);
        
        if (listingsResult.success) {
          // Only show active listings
          const activeListings = listingsResult.listings.filter(l => l.isActive);
          setListings(activeListings);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
        setLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'User not found'}
          </h1>
          <a href="/" className="text-blue-600 hover:underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === userId;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            {/* Avatar */}
            {profileUser.photoURL ? (
              <img
                src={profileUser.photoURL}
                alt={profileUser.displayName}
                className="w-24 h-24 rounded-full border-4 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-semibold border-4 border-gray-300">
                {profileUser.displayName[0]}
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileUser.displayName}
                {isOwnProfile && (
                  <span className="text-sm font-normal text-gray-600 ml-3">
                    (Your Profile)
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mb-1">{profileUser.email}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(profileUser.createdAt)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {listings.length}
                </p>
                <p className="text-sm text-gray-600">Active Listings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {listings.reduce((sum, l) => sum + l.price, 0).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Total Value ($)</p>
              </div>
              <div className="text-center sm:block hidden">
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(listings.map(l => l.category)).size}
                </p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? 'Your Active Listings' : `${profileUser.displayName}'s Listings`}
          </h2>

          {listings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {isOwnProfile 
                  ? "You don't have any active listings yet"
                  : "This user doesn't have any active listings"
                }
              </p>
              {isOwnProfile && (
                
                  <a href="/create-listing" className="inline-block bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
  Create Your First Listing
</a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}