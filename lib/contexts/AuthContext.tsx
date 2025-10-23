'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/**
 * User profile data structure
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'pro' | 'teams' | 'enterprise';
  credits?: number; // Current available credits (synced from Stripe)
  creditsTotal: number;
  creditsUsed: number;
  teamMembers: number;
  teamMembersLimit: number;
  trialEndDate?: string;
  createdAt: string;
  metadata?: {
    totalNodesCreated?: number;
    totalMessagesGenerated?: number;
    totalNotesCreated?: number;
    totalChildNodesCreated?: number;
    totalExpandActions?: number;
    totalTeamMembersUsed?: number;
    totalProjectsCreated?: number;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Get plan details based on plan type
 */
const getPlanDetails = (planType: UserProfile['plan']) => {
  switch (planType) {
    case 'free':
      return { creditsTotal: 25, teamMembersLimit: 3 };
    case 'pro':
      return { creditsTotal: 500, teamMembersLimit: 12 };
    case 'teams':
      return { creditsTotal: 1500, teamMembersLimit: -1 }; // -1 = unlimited
    case 'enterprise':
      return { creditsTotal: 5000, teamMembersLimit: -1 }; // -1 = unlimited
    default:
      return { creditsTotal: 25, teamMembersLimit: 3 };
  }
};

/**
 * Calculate trial end date (14 days from now)
 */
const getTrialEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Create initial user profile in Firestore.
   */
  const createUserProfile = async (user: User, displayName: string): Promise<void> => {
    try {
      if (!db) {
        console.error('Firestore is not initialized - cannot create profile');
        throw new Error('Firestore not initialized');
      }

      const planDetails = getPlanDetails('free');
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        photoURL: user.photoURL || undefined,
        plan: 'free',
        creditsTotal: planDetails.creditsTotal,
        creditsUsed: 0,
        teamMembers: 0,
        teamMembersLimit: planDetails.teamMembersLimit,
        trialEndDate: getTrialEndDate(),
        createdAt: new Date().toISOString(),
        metadata: {
          totalNodesCreated: 0,
          totalMessagesGenerated: 0,
          totalNotesCreated: 0,
          totalChildNodesCreated: 0,
          totalExpandActions: 0,
          totalTeamMembersUsed: 0,
          totalProjectsCreated: 0,
        },
      };

      console.log('Creating profile for user:', user.email, profile);
      await setDoc(doc(db, 'users', user.uid), profile);
      console.log('✓ Profile created successfully');
    } catch (error) {
      console.error('✗ Error creating user profile:', error);
      throw error;
    }
  };

  /**
   * Sign up with email and password.
   */
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await createUserProfile(userCredential.user, displayName);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  /**
   * Sign in with email and password.
   */
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  /**
   * Sign in with Google.
   */
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await createUserProfile(result.user, result.user.displayName || 'User');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  /**
   * Sign out.
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  /**
   * Refresh user profile from Firestore.
   * This function is kept for manual refresh actions, e.g., after a Stripe sync.
   */
  const refreshUserProfile = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    }
  };

  /**
   * Listen to auth state changes and user profile updates in real-time.
   */
  useEffect(() => {
    if (!auth || !db) {
      console.error('Firebase Auth or Firestore is not initialized.');
      setLoading(false);
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    let profileUnsubscribe: (() => void) | undefined;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      profileUnsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not Firestore
          console.log('User profile not found in Firestore, creating one...');
          createUserProfile(user, user.displayName || 'User');
        }
      });
    } else {
      // User is signed out, clear profile
      setUserProfile(null);
    }

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [user]);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
