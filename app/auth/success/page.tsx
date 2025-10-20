'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getIdToken } from 'firebase/auth';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { openMacAppWithAuth, isMacOS, MAC_APP_DOWNLOAD_URL } from '@/lib/deepLink';
import { ExternalLink, Download, CheckCircle } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      try {
        // Get ID token
        const token = await getIdToken(user);
        setIdToken(token);

        // If on macOS, try to open the app
        if (isMacOS()) {
          const success = await openMacAppWithAuth(token, user.uid);
          if (success) {
            setStatus('success');
          } else {
            setStatus('error');
            setErrorMessage('Could not open Mac app. Please ensure it is installed.');
          }
        } else {
          setStatus('success');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setStatus('error');
        setErrorMessage('Failed to authenticate. Please try again.');
      }
    };

    handleAuth();
  }, [user, router]);

  const handleRetryMacApp = () => {
    if (user && idToken) {
      openMacAppWithAuth(idToken, user.uid);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Section>
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
              {status === 'loading' && (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-6"></div>
                  <h1 className="text-2xl font-bold mb-2">Authenticating...</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we set up your account
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold mb-2">Success!</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {isMacOS()
                      ? 'Opening Jam AI app... If it doesn\'t open automatically, click the button below.'
                      : 'Your account is ready! Visit the account page to manage your settings.'}
                  </p>

                  <div className="space-y-3">
                    {isMacOS() && (
                      <>
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleRetryMacApp}
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Open Mac App
                        </Button>

                        <a
                          href={MAC_APP_DOWNLOAD_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button variant="outline" className="w-full">
                            <Download className="w-5 h-5 mr-2" />
                            Download Mac App
                          </Button>
                        </a>
                      </>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/account')}
                    >
                      Go to Account
                    </Button>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>

                  <div className="space-y-3">
                    {isMacOS() && (
                      <>
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleRetryMacApp}
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Try Opening App Again
                        </Button>

                        <a
                          href={MAC_APP_DOWNLOAD_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button variant="outline" className="w-full">
                            <Download className="w-5 h-5 mr-2" />
                            Download Mac App
                          </Button>
                        </a>
                      </>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/account')}
                    >
                      Go to Account
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
