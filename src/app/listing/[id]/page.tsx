'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { getListing, Listing } from '@/lib/firestore';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReportModal from '@/components/ReportModal';

type UserData = {
  displayName: string;
  email: string;
  photoURL?: string;
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const listingResult = await getListing(listingId);
      
      if (!listingResult.success || !listingResult.listing) {
        setError(listingResult.error || 'Listing not found');
        setLoading(false);
        return;
      }

      setListing(listingResult.listing);

      try {
        const sellerDoc = await getDoc(doc(db, 'users', listingResult.listing.sellerId));
        if (sellerDoc.exists()) {
          setSeller(sellerDoc.data() as UserData);
        }
      } catch (err) {
        console.error('Error fetching seller:', err);
      }

      setLoading(false);
    }

    if (listingId) {
      fetchData();
    }
  }, [listingId]);

  const handleMessageSeller = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.uid === listing?.sellerId) {
      alert('This is your own listing!');
      return;
    }

    const { findOrCreateChat } = await import('@/lib/chat');
    const result = await findOrCreateChat(user.uid, listing.sellerId, listingId);

    if (result.success && result.chatId) {
      router.push(`/messages/${result.chatId}`);
    } else {
      alert('Failed to start chat: ' + result.error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Listing not found'}
          </h1>
          <a href="/" className="text-blue-600 hover:underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  const isOwnListing = user?.uid === listing.sellerId;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.push('/')} className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2">
          ← Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              {listing.images && listing.images.length > 0 ? (
                <img src={listing.images[selectedImageIndex]} alt={listing.title} className="w-full h-96 object-cover" />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>

            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {listing.images.map((image, index) => (
                  <button key={index} onClick={() => setSelectedImageIndex(index)} className={`rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-black' : 'border-gray-300'}`}>
                    <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full mb-4">
                {listing.category}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>

              <p className="text-4xl font-bold text-gray-900 mb-6">
                {formatPrice(listing.price)}
              </p>

              <div className="border-t border-b border-gray-200 py-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-semibold text-gray-900">{listing.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900">📍 {listing.locationHint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold text-gray-900">{formatDate(listing.createdAt)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>

              {!isOwnListing && (
                <div className="space-y-3">
                  <button onClick={handleMessageSeller} className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition">
                    Message Seller
                  </button>
                  <button onClick={() => setShowReportModal(true)} className="w-full bg-white text-red-600 font-semibold py-2 px-6 rounded-lg border-2 border-red-600 hover:bg-red-50 transition">
                    🚩 Report Listing
                  </button>
                </div>
              )}

              {isOwnListing && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                    <p className="font-semibold">This is your listing</p>
                  </div>
                  
                  {listing.isActive ? (
                    <button
                      onClick={async () => {
                        if (confirm('Mark this listing as sold/inactive? It will be hidden from the feed.')) {
                          const { updateListingStatus } = await import('@/lib/firestore');
                          const result = await updateListingStatus(listingId, false);
                          if (result.success) {
                            alert('Listing marked as inactive!');
                            router.push('/');
                          } else {
                            alert('Error: ' + result.error);
                          }
                        }
                      }}
                      className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition"
                    >
                      Mark as Sold/Inactive
                    </button>
                  ) : (
                    <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded text-center">
                      <p className="font-semibold">This listing is inactive</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {seller && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h2>
                <a href={`/profile/${listing.sellerId}`} className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition">
                  {seller.photoURL ? (
                    <img src={seller.photoURL} alt={seller.displayName} className="w-16 h-16 rounded-full border-2 border-gray-300" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-semibold">
                      {seller.displayName[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{seller.displayName}</p>
                    <p className="text-sm text-gray-600">{seller.email}</p>
                    <p className="text-xs text-blue-600 mt-1">View profile →</p>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportType="listing"
          reportedUserId={listing.sellerId}
          listingId={listingId}
          reporterId={user.uid}
        />
      )}
    </main>
  );
}