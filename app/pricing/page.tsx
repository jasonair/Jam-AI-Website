'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'trial',
      name: 'Trial',
      price: 'Free',
      period: '7 days',
      credits: 1000,
      teamMembers: 3,
      features: [
        '1,000 credits',
        '3 AI team members',
        'All experience levels',
        'Full feature access',
      ],
      popular: true,
    },
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      credits: 500,
      teamMembers: 2,
      features: [
        '500 credits/month',
        '2 AI team members',
        'Junior & Intermediate',
        'Basic features',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29',
      period: 'per month',
      credits: 5000,
      teamMembers: 5,
      features: [
        '5,000 credits/month',
        '5 AI team members',
        'All experience levels',
        'Priority support',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$99',
      period: 'per month',
      credits: 20000,
      teamMembers: 10,
      features: [
        '20,000 credits/month',
        '10 AI team members',
        'All experience levels',
        'Dedicated support',
        'Custom integrations',
      ],
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      // Redirect to signup with plan parameter
      router.push(`/auth/signup?plan=${planId}`);
    } else {
      // Redirect to account page to manage plan
      router.push(`/account?upgrade=${planId}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Section>
        <Container size="lg">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start with a 7-day trial. No credit card required. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-200 hover:shadow-xl flex flex-col ${
                  plan.popular
                    ? 'border-accent shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-accent text-white text-sm font-bold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full mt-auto"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {user ? 'Switch to ' + plan.name : 'Get Started'}
                </Button>
              </div>
            ))}
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
                  After your 7-day trial, you'll automatically move to the Free plan. 
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
