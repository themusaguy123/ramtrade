'use client';

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Sign in with Google (VCU email only)
export async function signInWithGoogleVCU() {
  try {
    const provider = new GoogleAuthProvider();
    
    // Force account selection every time
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if email ends with @vcu.edu
    if (!user.email?.endsWith('@vcu.edu')) {
      // Not a VCU email - sign them out immediately
      await firebaseSignOut(auth);
      throw new Error('You must use a @vcu.edu email address to sign in.');
    }

    // Check if this is first time login (create user doc if needed)
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // First time user - create their document
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        phone: null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        blocked: false,
      });
    } else {
      // Existing user - update last login
      await setDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
    }

    return { success: true, user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

// Sign out
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}