'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getActiveListings, Listing } from '@/lib/firestore';
import ListingCard from '@/components/ListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const [user, authLoading] = useAuthState(auth);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const result = await getActiveListings(100);
      
      if (result.success) {
        setAllListings(result.listings);
        setFilteredListings(result.listings);
      } else {
        setError(result.error || 'Failed to load listings');
      }
      
      setLoading(false);
    }

    fetchListings();
  }, []);

  useEffect(() => {
    let filtered = [...allListings];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((listing) => listing.category === selectedCategory);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((listing) => listing.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((listing) => listing.price <= max);
      }
    }

    setFilteredListings(filtered);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, allListings]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-yellow-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Welcome to RamTrade 🐏
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Buy and sell with VCU students
            </p>
            
            {user ? (
              <a href="/create-listing" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition">
                Create a Listing
              </a>
            ) : (
              <a href="/auth/login" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition">
                Sign In to Get Started
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onClearFilters={handleClearFilters}
        />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery || selectedCategory || minPrice || maxPrice
              ? 'Search Results'
              : 'Recent Listings'}
          </h2>
          <p className="text-gray-600">
            {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredListings.length === 0 && allListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No listings yet. Be the first to post!
            </p>
            {user && (
              <a href="/create-listing" className="inline-block bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
                Create First Listing
              </a>
            )}
          </div>
        )}

        {!loading && !error && filteredListings.length === 0 && allListings.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No listings match your filters
            </p>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:underline"
            >
              Clear filters to see all listings
            </button>
          </div>
        )}

        {!loading && !error && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 pb-8 border-t border-gray-200 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6 text-sm">
              <a href="/legal/terms" className="text-gray-600 hover:text-gray-900 underline">
                Terms of Service
              </a>
              <a href="/legal/privacy" className="text-gray-600 hover:text-gray-900 underline">
                Privacy Policy
              </a>
            </div>
            <p className="text-center text-sm text-gray-500">
              Unofficial student marketplace. Not affiliated with or endorsed by Virginia Commonwealth University (VCU).
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}