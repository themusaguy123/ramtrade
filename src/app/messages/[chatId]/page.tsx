'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { sendMessage, Message } from '@/lib/chat';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getListing } from '@/lib/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReportModal from '@/components/ReportModal';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [loadingChat, setLoadingChat] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchChatDetails() {
      if (!user) return;

      try {
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (!chatDoc.exists()) {
          alert('Chat not found');
          router.push('/messages');
          return;
        }

        const chatData = chatDoc.data();

        const otherUserId = chatData.participants.find((id: string) => id !== user.uid);
        if (otherUserId) {
          const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
          const userData = otherUserDoc.data();
          setOtherUser({ ...userData, uid: otherUserId });
        }

        const listingResult = await getListing(chatData.listingId);
        if (listingResult.success) {
          setListing(listingResult.listing);
        }

        setLoadingChat(false);
      } catch (error) {
        console.error('Error fetching chat:', error);
        setLoadingChat(false);
      }
    }

    if (user && chatId) {
      fetchChatDetails();
    }
  }, [user, chatId, router]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    setSending(true);
    const result = await sendMessage(chatId, user.uid, messageText.trim());

    if (result.success) {
      setMessageText('');
    } else {
      alert('Failed to send message: ' + result.error);
    }

    setSending(false);
  };

  if (loading || loadingChat) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/messages')} className="text-gray-600 hover:text-gray-900">
              ← Back
            </button>

            {otherUser && (
              <div className="flex items-center gap-3">
                {otherUser.photoURL ? (
                  <img src={otherUser.photoURL} alt={otherUser.displayName} className="w-10 h-10 rounded-full border-2 border-gray-300" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    {otherUser.displayName[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{otherUser.displayName}</p>
                  {listing && <p className="text-xs text-gray-600">Re: {listing.title}</p>}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={() => setShowReportModal(true)} className="text-red-600 hover:text-red-700 text-sm font-semibold">
            🚩 Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No messages yet. Say hi!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === user.uid;
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? 'bg-black text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !messageText.trim()}
              className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {user && otherUser && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportType="chat"
          reportedUserId={otherUser.uid}
          chatId={chatId}
          reporterId={user.uid}
        />
      )}
    </main>
  );
}