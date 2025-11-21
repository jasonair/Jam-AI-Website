'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Gift, Check, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ReferralProgramProps {
  userId: string;
  userEmail: string;
}

export default function ReferralProgram({ userId, userEmail }: ReferralProgramProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReferralCode = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Import Firebase client SDK
      const { collection, query, where, getDocs, addDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const { generateReferralCode: genCode } = await import('@/lib/referrals');

      // Check if user already has a referral code
      const referralsRef = collection(db, 'referrals');
      const q = query(referralsRef, where('referrerId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingReferral = querySnapshot.docs[0].data();
        setReferralCode(existingReferral.referralCode);
        return;
      }

      // Generate new referral code
      const code = genCode(userId);

      // Create referral document
      await addDoc(referralsRef, {
        referrerId: userId,
        referrerEmail: userEmail,
        referralCode: code,
        createdAt: new Date().toISOString(),
        totalReferrals: 0,
        successfulReferrals: 0,
        totalCreditsEarned: 0,
      });

      setReferralCode(code);
    } catch (err: any) {
      console.error('Error generating referral code:', err);
      setError(err.message || 'Failed to generate referral code');
    } finally {
      setLoading(false);
    }
  }, [userId, userEmail]);

  useEffect(() => {
    generateReferralCode();
  }, [userId, generateReferralCode]);



  const getReferralLink = () => {
    if (!referralCode) return '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/auth/signup?referral_code=${referralCode}`;
  };

  const copyToClipboard = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-red-600 dark:text-red-400">
          <p>Error: {error}</p>
          <Button onClick={generateReferralCode} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Invite friends to Jam AI and get <span className="font-bold text-purple-600 dark:text-purple-400">250 bonus credits</span> when they subscribe to Pro.
          </p>
        </div>
        <Gift className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
      </div>

      {/* Referral Link */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Referral link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={getReferralLink()}
            readOnly
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            variant="primary"
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4">
        <h3 className="font-bold mb-3">How it works</h3>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2">
            <span className="font-bold text-purple-600 dark:text-purple-400">1.</span>
            <span>Share your unique referral link with friends</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-purple-600 dark:text-purple-400">2.</span>
            <span>They sign up using your link</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-purple-600 dark:text-purple-400">3.</span>
            <span>When they subscribe to a paid plan, you both get 250 credits</span>
          </li>
        </ol>
      </div>

      {/* Terms link */}
      <div className="text-center">
        <a
          href="/referral-terms"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          Terms of service
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
