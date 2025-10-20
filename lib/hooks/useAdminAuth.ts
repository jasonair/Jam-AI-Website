'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import { isAdmin as checkIsAdmin } from '../adminStore';

export interface AdminAuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    error: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin in Firestore
        const isAdmin = await checkIsAdmin(user.uid);
        
        setAuthState({
          user,
          loading: false,
          isAdmin,
          error: null
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check admin status in Firestore
      const isAdmin = await checkIsAdmin(userCredential.user.uid);
      
      if (!isAdmin) {
        await firebaseSignOut(auth);
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
          error: 'Access denied. Admin privileges required.'
        });
        return false;
      }
      
      setAuthState({
        user: userCredential.user,
        loading: false,
        isAdmin: true,
        error: null
      });
      return true;
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        isAdmin: false,
        error: error.message || 'Failed to sign in'
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthState({
        user: null,
        loading: false,
        isAdmin: false,
        error: null
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to sign out'
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signOut
  };
}
