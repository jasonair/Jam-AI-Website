import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Usage tracking utilities for updating user metrics
 * These can be called from the Mac app or web app
 */

export interface UsageMetrics {
  nodesCreated?: number;
  aiMessages?: number;
  notesCreated?: number;
  childNodes?: number;
  expandActions?: number;
  creditsUsed?: number;
  totalProjectsCreated?: number;
}

/**
 * Update user usage metrics
 * @param uid User ID
 * @param metrics Object containing metrics to increment
 */
export const updateUserUsage = async (uid: string, metrics: UsageMetrics): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Build the update object with increment operations
    const updates: any = {};
    
    if (metrics.nodesCreated) {
      updates['usage.nodesCreated'] = increment(metrics.nodesCreated);
    }
    if (metrics.aiMessages) {
      updates['usage.aiMessages'] = increment(metrics.aiMessages);
    }
    if (metrics.notesCreated) {
      updates['usage.notesCreated'] = increment(metrics.notesCreated);
    }
    if (metrics.childNodes) {
      updates['usage.childNodes'] = increment(metrics.childNodes);
    }
    if (metrics.expandActions) {
      updates['usage.expandActions'] = increment(metrics.expandActions);
    }
    if (metrics.creditsUsed) {
      updates.creditsUsed = increment(metrics.creditsUsed);
    }
    if (metrics.totalProjectsCreated) {
      updates['metadata.totalProjectsCreated'] = increment(metrics.totalProjectsCreated);
    }

    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user usage:', error);
    throw error;
  }
};

/**
 * Update team member count
 * @param uid User ID
 * @param count New team member count
 */
export const updateTeamMemberCount = async (uid: string, count: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      teamMembers: count,
    });
  } catch (error) {
    console.error('Error updating team member count:', error);
    throw error;
  }
};

/**
 * Check if user has enough credits
 * @param uid User ID
 * @param creditsNeeded Credits required for operation
 * @returns true if user has enough credits
 */
export const hasEnoughCredits = async (uid: string, creditsNeeded: number): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }

    const userData = userSnap.data();
    const creditsAvailable = userData.creditsTotal - userData.creditsUsed;
    
    return creditsAvailable >= creditsNeeded;
  } catch (error) {
    console.error('Error checking credits:', error);
    return false;
  }
};

/**
 * Deduct credits from user account
 * @param uid User ID
 * @param credits Credits to deduct
 */
export const deductCredits = async (uid: string, credits: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      creditsUsed: increment(credits),
    });
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw error;
  }
};

/**
 * Reset monthly credits (to be called by a scheduled function)
 * @param uid User ID
 */
export const resetMonthlyCredits = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      creditsUsed: 0,
    });
  } catch (error) {
    console.error('Error resetting credits:', error);
    throw error;
  }
};
