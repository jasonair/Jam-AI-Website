import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK immediately
function initAdmin() {
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
        // For development: use the project ID from client config
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        if (!projectId) {
          throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
        }
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectId,
        });
      }
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      // Try fallback initialization with just project ID
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId && admin.apps.length === 0) {
        try {
          admin.initializeApp({
            projectId: projectId,
          });
          console.log('Firebase Admin initialized with project ID only (limited functionality)');
        } catch (fallbackError) {
          console.error('Fallback initialization failed:', fallbackError);
        }
      }
    }
  }
}

// Initialize immediately when module loads
initAdmin();

// Export the Firestore database getter
export const db = () => admin.firestore();

// Export the auth getter
export const auth = () => admin.auth();

// Re-export initAdmin for manual initialization if needed
export { initAdmin };
