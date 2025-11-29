import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export type Chat = {
  id: string;
  participants: string[];
  listingId: string;
  createdAt: Timestamp;
  lastMessage: string;
  lastMessageAt: Timestamp;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
};

// Find or create a chat between two users for a listing
export async function findOrCreateChat(
  buyerId: string,
  sellerId: string,
  listingId: string
) {
  try {
    // Check if chat already exists
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', buyerId),
      where('listingId', '==', listingId)
    );

    const querySnapshot = await getDocs(q);
    
    // Filter to find exact match (both participants)
    const existingChat = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      return (
        data.participants.includes(buyerId) &&
        data.participants.includes(sellerId)
      );
    });

    if (existingChat) {
      return { success: true, chatId: existingChat.id };
    }

    // Create new chat
    const newChat = await addDoc(chatsRef, {
      participants: [buyerId, sellerId],
      listingId,
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
    });

    return { success: true, chatId: newChat.id };
  } catch (error: any) {
    console.error('Error finding/creating chat:', error);
    return { success: false, error: error.message };
  }
}

// Get all chats for a user
export async function getUserChats(userId: string) {
  try {
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const chats: Chat[] = [];

    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });

    return { success: true, chats };
  } catch (error: any) {
    console.error('Error getting chats:', error);
    return { success: false, error: error.message, chats: [] };
  }
}

// Send a message
export async function sendMessage(chatId: string, senderId: string, text: string) {
  try {
    // Add message to subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });

    // Update chat's last message
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
}