import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
export function initAdmin() {
  if (admin.apps.length === 0) {
    try {
      // In production, credentials are automatically loaded from environment
      // For local development, you may need a service account key
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        // Use default credentials (works in Cloud Functions, etc.)
        admin.initializeApp();
      }
      console.log('Firebase Admin initialized');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
    }
  }
}

// Export the Firestore database
export const db = admin.firestore();

// Export the auth
export const auth = admin.auth();
