import Link from 'next/link';
import { Listing } from '@/lib/firestore';

type ListingCardProps = {
  listing: Listing;
};

export default function ListingCard({ listing }: ListingCardProps) {
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(listing.price);

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            {listing.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {listing.title}
          </h3>

          {/* Price */}
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formattedPrice}
          </p>

          {/* Condition */}
          <p className="text-sm text-gray-600 mb-2">
            Condition: <span className="font-medium">{listing.condition}</span>
          </p>

          {/* Location & Date */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              📍 {listing.locationHint}
            </span>
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}