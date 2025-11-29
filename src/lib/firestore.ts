import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Listing type
export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  sellerId: string;
  locationHint: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  flaggedCount: number;
};

// Create a new listing
export async function createListing(listingData: {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  sellerId: string;
  locationHint: string;
}) {
  try {
    const docRef = await addDoc(collection(db, 'listings'), {
      ...listingData,
      isActive: true,
      flaggedCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating listing:', error);
    return { success: false, error: error.message };
  }
}

// Get a single listing by ID
export async function getListing(listingId: string) {
  try {
    const docRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { 
        success: true, 
        listing: { id: docSnap.id, ...docSnap.data() } as Listing 
      };
    } else {
      return { success: false, error: 'Listing not found' };
    }
  } catch (error: any) {
    console.error('Error getting listing:', error);
    return { success: false, error: error.message };
  }
}

// Get all active listings (for feed)
export async function getActiveListings(limitCount: number = 20) {
  try {
    const q = query(
      collection(db, 'listings'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];

    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() } as Listing);
    });

    return { success: true, listings };
  } catch (error: any) {
    console.error('Error getting listings:', error);
    return { success: false, error: error.message, listings: [] };
  }
}

// Get listings by seller
export async function getListingsBySeller(sellerId: string) {
  try {
    const q = query(
      collection(db, 'listings'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const listings: Listing[] = [];

    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() } as Listing);
    });

    return { success: true, listings };
  } catch (error: any) {
    console.error('Error getting seller listings:', error);
    return { success: false, error: error.message, listings: [] };
  }
}

// Update listing active status
export async function updateListingStatus(listingId: string, isActive: boolean) {
  try {
    const docRef = doc(db, 'listings', listingId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating listing status:', error);
    return { success: false, error: error.message };
  }
}