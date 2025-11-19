'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { downloadApp } from '@/lib/downloadApp';
import Header from '@/components/ui/Header';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import ReferralProgram from '@/components/ReferralProgram';
import {
  User as UserIcon,
  FileText,
  MessageSquare,
  GitBranch,
  Users,
  Maximize2,
  LayoutGrid,
  LogOut,
  CreditCard,
  Settings,
  Download
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut, refreshUserProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const hasSynced = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to signin...');
      router.push('/auth/signin');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user && userProfile && !hasSynced.current) {
      hasSynced.current = true;
      handleSyncSubscription();
    }
  }, [user, userProfile]);


  if (loading || !userProfile) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Loading your account...</p>
            {!loading && !userProfile && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Tip:</strong> If this page is stuck loading, please ensure:
                </p>
                <ul className="text-xs text-left text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 ml-4">
                  <li>• Firebase credentials are set in .env.local</li>
                  <li>• You're signed in (try signing out and back in)</li>
                  <li>• Check the browser console for errors</li>
                </ul>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Go to Home
                </button>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    // Redirect to pricing page to upgrade
    router.push(`/pricing`);
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      setPortalLoading(true);
      setError(null);
      setSyncSuccess(null);

      // Create portal session using simplified endpoint
      const response = await fetch('/api/create-portal-session-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to access billing portal');
      }

      const { url } = await response.json();

      // Redirect to Stripe Customer Portal
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (err: any) {
      console.error('Error accessing billing portal:', err);
      setError(err.message || 'Failed to access billing portal. Please try again.');
      setPortalLoading(false);
    }
  };

  const handleSyncSubscription = async (isManual = false) => {
    if (!user || !userProfile) return;

    try {
      setSyncLoading(true);
      setError(null);
      setSyncSuccess(null);

      // Call simplified sync endpoint
      const response = await fetch('/api/sync-subscription-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync subscription');
      }

      const data = await response.json();

      // Update Firestore directly using client SDK
      if (data.updateNeeded) {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');

        await updateDoc(doc(db, 'users', user.uid), {
          ...data.updateNeeded,
          updatedAt: new Date().toISOString(),
        });

        if (isManual) {
          setSyncSuccess(`✅ Synced to ${data.plan.toUpperCase()} plan with ${data.credits} credits`);
        }
        // Refresh user profile to show updated data
        await refreshUserProfile();
      } else if (isManual) {
        setSyncSuccess(data.message);
      }
    } catch (err: any) {
      console.error('Error syncing subscription:', err);
      setError(err.message || 'Failed to sync subscription. Please try again.');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      setDownloadError(null);
      await downloadApp('account', user?.uid);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError('Failed to download. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Read the actual 'credits' field from Firestore (synced by Stripe webhook)
  const creditsAvailable = userProfile.credits || 0;
  const creditsUsed = (userProfile.creditsTotal || 0) - creditsAvailable;
  const creditsPercentage = userProfile.creditsTotal
    ? (creditsUsed / userProfile.creditsTotal) * 100
    : 0;

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  // Calculate trial info if applicable
  const trialDaysRemaining = userProfile.trialEndDate
    ? Math.ceil((new Date(userProfile.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Usage start date
  const usageStartDate = new Date(userProfile.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Plans configuration - Updated to match main pricing page
  const currentPlan = (userProfile.plan || 'trial') as 'trial' | 'free' | 'pro' | 'teams' | 'enterprise';
  const plans = [
    {
      id: 'free',
      name: 'Free',
      credits: 100,
      teamMembers: 3,
      features: ['Junior & Intermediate', 'Local model + Gemini 2.0 Flash-Lite', 'Basic web search', 'Community support'],
      isCurrent: currentPlan === 'free',
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 1000,
      teamMembers: 12,
      features: ['All experience levels', 'Gemini 2.5 Flashlight plus Gemini 2.5 Pro', 'Perplexity search', 'Image generation', 'Priority support'],
      isCurrent: currentPlan === 'pro',
      highlighted: true,
    },
    {
      id: 'teams',
      name: 'Teams',
      credits: 1500,
      teamMembers: 'Unlimited',
      features: ['Shared credit pool & add-on purchasing', 'Create Teams from multiple AI Team Members'],
      isCurrent: currentPlan === 'teams',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 5000,
      teamMembers: 'Unlimited',
      features: ['Private Gemini Vertex', 'Dedicated account manager'],
      isCurrent: currentPlan === 'enterprise',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Section>
          <Container size="md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            </div>

            <div className="space-y-6">
              {/* User Profile Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6 mb-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {userProfile.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt={userProfile.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-white" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{userProfile.displayName}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{userProfile.email}</p>
                    <span className="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-md">
                      ⭐ {userProfile.plan ? userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1) : 'Trial'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Download App Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Download Jam AI</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get the desktop app for the best experience
                    </p>
                  </div>
                  <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                {downloadError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{downloadError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Jam AI for macOS</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Version 1.0 • ~60 MB • Apple Silicon Compatible</p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={handleDownload}
                      disabled={downloadLoading}
                      className="min-w-[150px]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloadLoading ? 'Preparing...' : 'Download'}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>System Requirements:</strong> macOS 11.0 or later with Apple Silicon (M1, M2, M3) or Intel processor
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Management Section - Only show for paid plans */}
              {(currentPlan === 'pro' || currentPlan === 'teams' || currentPlan === 'enterprise') && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Subscription Management</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your billing, payment methods, and view invoices
                      </p>
                    </div>
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {syncSuccess && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 text-sm">{syncSuccess}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={handleManageSubscription}
                      disabled={portalLoading || syncLoading}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {portalLoading ? 'Loading...' : 'Manage Billing'}
                    </Button>

                  </div>

                  <div className="space-y-4 mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      You'll be redirected to our secure billing portal where you can:
                    </p>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 ml-4">
                      <li>• Update payment methods</li>
                      <li>• View and download invoices</li>
                      <li>• Cancel or modify your subscription</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Credits Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-6">Credits</h2>

                {/* Credits Display */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">
                      {creditsAvailable.toLocaleString()} / {userProfile.creditsTotal.toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">left</span>
                    <span className="ml-auto text-gray-600 dark:text-gray-400">
                      {creditsUsed.toLocaleString()} used
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressBarColor(creditsPercentage)} transition-all duration-500`}
                      style={{ width: `${creditsPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Usage Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Usage since {usageStartDate}</span>
                  {trialDaysRemaining !== null && (
                    <span>Trial ends in {trialDaysRemaining} days ({new Date(userProfile.trialEndDate!).toLocaleDateString()})</span>
                  )}
                </div>
              </div>

              {/* Referral Program Section */}
              {user && <ReferralProgram userId={user.uid} userEmail={user.email || ''} />}

              {/* Account Activity Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4">Account Activity</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Your JamAI usage this month</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Nodes Created */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">Nodes Created</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalNodesCreated || 0}</p>
                  </div>

                  {/* AI Messages */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-sm">AI Messages</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalMessagesGenerated || 0}</p>
                  </div>

                  {/* Notes Created */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">Notes Created</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalNotesCreated || 0}</p>
                  </div>

                  {/* Child Nodes */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <GitBranch className="w-5 h-5" />
                      <span className="text-sm">Child Nodes</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalChildNodesCreated || 0}</p>
                  </div>

                  {/* Expand Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <Maximize2 className="w-5 h-5" />
                      <span className="text-sm">Expand Actions</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalExpandActions || 0}</p>
                  </div>

                  {/* AI Team Members Used */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5" />
                      <span className="text-sm">AI Team Members Used</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalTeamMembersUsed || 0}</p>
                  </div>

                  {/* Projects Created */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                      <LayoutGrid className="w-5 h-5" />
                      <span className="text-sm">Jams Created</span>
                    </div>
                    <p className="text-4xl font-bold">{userProfile.metadata?.totalProjectsCreated || 0}</p>
                  </div>
                </div>
              </div>

              {/* Plans Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Plans</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Your Plan:</span>
                    <span className="px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-lg">
                      {userProfile.plan ? userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1) : 'Trial'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col ${plan.isCurrent
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      {/* Plan Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        {plan.isCurrent && (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Your Current Plan
                          </span>
                        )}
                      </div>

                      {/* Plan Details */}
                      <div className="mb-4 flex-grow">
                        <p className="text-3xl font-bold mb-2">
                          {plan.credits.toLocaleString()}{' '}
                          <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                            credits/month
                          </span>
                        </p>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>• {plan.teamMembers} AI team members</li>
                          {plan.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      {!plan.isCurrent && (
                        <Button
                          variant="primary"
                          className="w-full mt-auto"
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <a
                href="/"
                className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
              >
                ← Back to Home
              </a>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
