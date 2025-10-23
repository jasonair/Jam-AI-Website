'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function BetaGate() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const functions = getFunctions();
      const checkBetaStatus = httpsCallable(functions, 'checkBetaStatus');
      const result = await checkBetaStatus({ email });

      const status = (result.data as { status: string }).status;

      if (status === 'approved') {
        router.push(`/auth/signin?email=${encodeURIComponent(email)}`);
      } else if (status === 'pending') {
        setMessage('You are on the waitlist! We will notify you when access is granted.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
            <div className="text-center">
        <div className="flex justify-center mb-8">
          <Image
            src={'/images/jam-ai-logo-blue.svg'}
            alt="Jam AI Logo"
            width={200}
            height={80}
            priority
            className="w-48 h-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Jam AI is Coming Soon</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Sign up for our beta to get early access.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center w-full max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-grow w-full sm:w-auto px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={loading}
          />
          <Button type="submit" size="md" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Checking...' : 'Continue'}
          </Button>
        </form>
        {message && <p className="text-green-600 dark:text-green-400 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
