'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { getUserChats, Chat } from '@/lib/chat';
import { doc, getDoc } from 'firebase/firestore';
import { getListing } from '@/lib/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';

type ChatWithDetails = Chat & {
  otherUserName: string;
  otherUserPhoto?: string;
  listingTitle: string;
  listingImage?: string;
};

export default function MessagesPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchChats() {
      if (!user) return;

      setLoadingChats(true);
      const result = await getUserChats(user.uid);

      if (result.success) {
        // Fetch additional details for each chat
        const chatsWithDetails = await Promise.all(
          result.chats.map(async (chat) => {
            // Get other user
            const otherUserId = chat.participants.find((id) => id !== user.uid) || '';
            const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
            const otherUser = otherUserDoc.data();

            // Get listing
            const listingResult = await getListing(chat.listingId);
            const listing = listingResult.listing;

            return {
              ...chat,
              otherUserName: otherUser?.displayName || 'Unknown',
              otherUserPhoto: otherUser?.photoURL,
              listingTitle: listing?.title || 'Deleted listing',
              listingImage: listing?.images?.[0],
            };
          })
        );

        setChats(chatsWithDetails);
      }

      setLoadingChats(false);
    }

    if (user) {
      fetchChats();
    }
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading || loadingChats) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        {chats.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No messages yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Start a conversation by messaging a seller on a listing
            </p>
            <a href="/" className="inline-block bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
              Browse Listings
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {chats.map((chat) => (
              <a
                key={chat.id}
                href={`/messages/${chat.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                {/* Listing image */}
                <div className="w-16 h-16 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                  {chat.listingImage ? (
                    <img src={chat.listingImage} alt={chat.listingTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                </div>

                {/* User avatar */}
                <div className="w-12 h-12 flex-shrink-0">
                  {chat.otherUserPhoto ? (
                    <img src={chat.otherUserPhoto} alt={chat.otherUserName} className="w-full h-full rounded-full border-2 border-gray-300" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                      {chat.otherUserName[0]}
                    </div>
                  )}
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {chat.otherUserName}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(chat.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {chat.listingTitle}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-gray-400">→</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}