'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

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
        // Check if user has admin claim
        const tokenResult = await user.getIdTokenResult();
        const isAdmin = tokenResult.claims.admin === true;
        
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
      
      // Check admin claim
      const tokenResult = await userCredential.user.getIdTokenResult();
      const isAdmin = tokenResult.claims.admin === true;
      
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
