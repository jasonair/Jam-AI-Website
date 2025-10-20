/**
 * Firestore-based Admin Management
 * 
 * Alternative to Firebase custom claims that doesn't require Admin SDK.
 * Stores admin status in Firestore collection.
 */

import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const ADMINS_COLLECTION = 'admins';

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, userId));
    return adminDoc.exists() && adminDoc.data()?.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Set a user as admin
 * Only callable by existing admins (check in your component)
 */
export async function setAdmin(userId: string, email: string): Promise<void> {
  await setDoc(doc(db, ADMINS_COLLECTION, userId), {
    isAdmin: true,
    email,
    grantedAt: new Date().toISOString(),
  });
}

/**
 * Remove admin status
 */
export async function removeAdmin(userId: string): Promise<void> {
  await deleteDoc(doc(db, ADMINS_COLLECTION, userId));
}

/**
 * Get all admins
 */
export async function getAllAdmins(): Promise<Array<{ uid: string; email: string; grantedAt: string }>> {
  const adminsSnapshot = await getDocs(collection(db, ADMINS_COLLECTION));
  return adminsSnapshot.docs.map(doc => ({
    uid: doc.id,
    email: doc.data().email,
    grantedAt: doc.data().grantedAt,
  }));
}
