'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { auth, db } from '@/lib/firebase';

export default function TestFirebasePage() {
  const { user, userProfile, loading } = useAuth();

  const firebaseConfigured = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>

        <div className="space-y-4">
          {/* Firebase Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">1. Firebase Configuration</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={firebaseConfigured ? 'text-green-500' : 'text-red-500'}>
                  {firebaseConfigured ? '✓' : '✗'}
                </span>
                <span>Environment Variables: {firebaseConfigured ? 'Configured' : 'Missing'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={auth ? 'text-green-500' : 'text-red-500'}>
                  {auth ? '✓' : '✗'}
                </span>
                <span>Firebase Auth: {auth ? 'Initialized' : 'Not Initialized'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={db ? 'text-green-500' : 'text-red-500'}>
                  {db ? '✓' : '✗'}
                </span>
                <span>Firebase Firestore: {db ? 'Initialized' : 'Not Initialized'}</span>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">2. Authentication Status</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>User Authenticated:</strong> {user ? 'Yes' : 'No'}
              </div>
              {user && (
                <>
                  <div>
                    <strong>User Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>User ID:</strong> {user.uid}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">3. User Profile (Firestore)</h2>
            {userProfile ? (
              <div className="space-y-2 text-sm">
                <div className="text-green-500">✓ Profile Loaded</div>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(userProfile, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500">
                {loading ? 'Loading profile...' : 'No profile found'}
              </div>
            )}
          </div>

          {/* Instructions */}
          {!firebaseConfigured && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <h2 className="text-xl font-bold mb-4 text-red-800 dark:text-red-200">
                ⚠️ Firebase Not Configured
              </h2>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Your .env.local file is missing or incomplete. Please add:
              </p>
              <pre className="bg-red-100 dark:bg-red-950 p-4 rounded overflow-auto text-xs text-red-900 dark:text-red-100">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`}
              </pre>
              <p className="text-sm text-red-700 dark:text-red-300 mt-4">
                After adding credentials, restart the dev server: <code className="bg-red-200 dark:bg-red-900 px-2 py-1 rounded">npm run dev</code>
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back to Home
            </a>
            {!user && firebaseConfigured && (
              <a
                href="/auth/signup"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                Sign Up
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
