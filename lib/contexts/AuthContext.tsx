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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/**
 * User profile data structure
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'trial' | 'free' | 'pro' | 'teams' | 'enterprise';
  creditsTotal: number;
  creditsUsed: number;
  teamMembers: number;
  teamMembersLimit: number;
  trialEndDate?: string;
  createdAt: string;
  usage: {
    nodesCreated: number;
    aiMessages: number;
    notesCreated: number;
    childNodes: number;
    expandActions: number;
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
    case 'trial':
      return { creditsTotal: 1000, teamMembersLimit: 3 };
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
 * Calculate trial end date (7 days from now)
 */
const getTrialEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user profile from Firestore
   */
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      if (!db) {
        console.error('Firestore is not initialized');
        return null;
      }
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile;
        console.log('✓ Profile found for user:', uid);
        console.log('Profile data:', profileData);
        
        // Check if profile needs migration (missing new fields)
        if (!profileData.creditsTotal || !profileData.usage) {
          console.log('⚠️ Profile needs migration, updating...');
          const planDetails = getPlanDetails(profileData.plan || 'trial');
          const updatedProfile: UserProfile = {
            ...profileData,
            creditsTotal: profileData.creditsTotal || planDetails.creditsTotal,
            creditsUsed: profileData.creditsUsed || 0,
            teamMembers: profileData.teamMembers || 0,
            teamMembersLimit: profileData.teamMembersLimit || planDetails.teamMembersLimit,
            usage: profileData.usage || {
              nodesCreated: 0,
              aiMessages: 0,
              notesCreated: 0,
              childNodes: 0,
              expandActions: 0,
            },
          };
          await setDoc(doc(db, 'users', uid), updatedProfile, { merge: true });
          console.log('✓ Profile migrated successfully');
          return updatedProfile;
        }
        
        return profileData;
      }
      console.log('✗ Profile not found for user:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  /**
   * Create initial user profile
   */
  const createUserProfile = async (user: User, displayName: string): Promise<void> => {
    try {
      if (!db) {
        console.error('Firestore is not initialized - cannot create profile');
        throw new Error('Firestore not initialized');
      }

      const planDetails = getPlanDetails('trial');
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        photoURL: user.photoURL || undefined,
        plan: 'trial',
        creditsTotal: planDetails.creditsTotal,
        creditsUsed: 0,
        teamMembers: 0,
        teamMembersLimit: planDetails.teamMembersLimit,
        trialEndDate: getTrialEndDate(),
        createdAt: new Date().toISOString(),
        usage: {
          nodesCreated: 0,
          aiMessages: 0,
          notesCreated: 0,
          childNodes: 0,
          expandActions: 0,
        },
      };

      console.log('Creating profile for user:', user.email, profile);
      await setDoc(doc(db, 'users', user.uid), profile);
      console.log('✓ Profile created successfully');
      setUserProfile(profile);
    } catch (error) {
      console.error('✗ Error creating user profile:', error);
      throw error;
    }
  };

  /**
   * Sign up with email and password
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
   * Sign in with email and password
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
   * Sign in with Google
   */
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const profile = await fetchUserProfile(result.user.uid);
      if (!profile) {
        await createUserProfile(result.user, result.user.displayName || 'User');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  /**
   * Refresh user profile from Firestore
   */
  const refreshUserProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth) {
      console.error('Firebase Auth is not initialized. Please check your .env.local file.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        let profile = await fetchUserProfile(user.uid);
        
        // If profile doesn't exist, create it (for existing users or Google sign-ins)
        if (!profile) {
          console.log('Profile not found, creating new profile for user:', user.email);
          await createUserProfile(user, user.displayName || 'User');
          profile = await fetchUserProfile(user.uid);
        }
        
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
