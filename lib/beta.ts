import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Checks if a user has been granted beta access.
 * @param email The user's email address.
 * @returns A promise that resolves to true if the user has access, false otherwise.
 */
export const checkBetaAccess = async (email: string): Promise<boolean> => {
  if (!email) {
    return false;
  }

  try {
    const signupsCollection = collection(db, 'beta_signups');
    const q = query(signupsCollection, where('email', '==', email), where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking beta access:', error);
    return false;
  }
};
