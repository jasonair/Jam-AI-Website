'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { getStripe } from '@/lib/stripe';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'user / month',
      features: [
        '2-week Pro trial',
        '100 prompt credits / month',
        '3 AI Team Members (Junior & Intermediate)',
        'Local model + Gemini 2.0 Flash-Lite',
        'Basic web search',
        'Up to 3 saved Jams',
        'Community support',
      ],
      cta: 'Download',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      period: 'user / month',
      features: [
        'Everything in Free, plus:',
        '1,000 prompt credits / month',
        'Gemini 2.5 Flashlight plus Gemini 2.5 Pro',
        '12 AI Team Members per Jam (All experience levels)',
        'Perplexity search',
        'Image generation (low res)',
        'Priority support',
      ],
      cta: 'Select plan',
      popular: true,
    },
    {
      id: 'teams',
      name: 'Teams',
      price: '$30',
      period: 'user / month',
      features: [
        'Everything in Pro, plus:',
        '1,500 prompt credits / user / month',
        'Shared credit pool & add-on purchasing',
        'Unlimited AI Team Members',
        'Create Teams from multiple AI Team Members',
      ],
      cta: 'Select plan',
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: "Let's talk",
      period: 'Custom Pricing (start ≈ $99 / user / month)',
      features: [
        'Everything in Teams, plus:',
        '5,000 prompt credits / user / month',
        'Private Gemini Vertex',
        'Dedicated account manager',
      ],
      cta: 'View plan options',
      popular: false,
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    // Free plan - direct download
    if (planId === 'free') {
      if (!user) {
        router.push(`/auth/signup?plan=${planId}`);
      } else {
        router.push(`/account?upgrade=${planId}`);
      }
      return;
    }

    // Enterprise - contact form or page
    if (planId === 'enterprise') {
      // TODO: Redirect to contact page or open contact modal
      window.location.href = 'mailto:sales@jamair.com?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    // Paid plans (pro, teams) require authentication and Stripe checkout
    if (!user) {
      router.push(`/auth/signup?plan=${planId}`);
      return;
    }

    try {
      setLoading(planId);
      setError(null);

      // Get Firebase auth token
      const token = await user.getIdToken();

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout using the URL
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Error starting checkout:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Section>
        <Container size="xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Plans for every kind of creator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Start free. Upgrade when you need more credits, more AI team members, or deeper experience levels.
            </p>
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${plan.popular
                    ? 'border-accent bg-white dark:bg-gray-800 shadow-2xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-accent'
                  }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                    Popular
                  </div>
                )}

                <div className="flex flex-col justify-between min-h-[500px]">
                  {/* Plan Name */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.period}</span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={loading === plan.id}
                    >
                      {loading === plan.id ? 'Loading...' : plan.cta}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="mt-12 mb-12 text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              All paid plans include priority AI processing and faster response times.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-2">What are credits?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Credits are used for AI operations like generating responses, creating nodes, and expanding content.
                  Each operation uses a different amount of credits based on complexity.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-2">Can I change plans later?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time from your account settings.
                  Changes take effect immediately.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-2">What happens after my trial?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  After your 7-day trial, you&apos;ll automatically move to the Free plan.
                  You can upgrade to a paid plan anytime to get more credits and features.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-2">Do unused credits roll over?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Credits reset at the beginning of each billing cycle. We recommend choosing a plan
                  that matches your typical monthly usage.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
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
  );
}
