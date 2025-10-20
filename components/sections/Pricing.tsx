import { Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  current?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    tagline: 'Jam with two AIs — just enough to start.',
    price: '$0',
    features: [
      '500 credits / month',
      '2 AI team members',
      'Junior & Intermediate levels',
    ],
    cta: 'Select',
  },
  {
    name: 'Trial',
    tagline: 'Full power for your first 7 days.',
    price: 'Free',
    period: '7 days',
    features: [
      '1,000 credits / month',
      '3 AI team members',
      'All experience levels',
    ],
    cta: 'Your Current Plan',
    current: true,
  },
  {
    name: 'Premium',
    tagline: 'Go further with five AIs and deeper credits.',
    price: '$19',
    period: '/month',
    features: [
      '5,000 credits / month',
      '5 AI team members',
      'All experience levels',
    ],
    cta: 'Select',
    highlighted: true,
  },
  {
    name: 'Pro',
    tagline: 'For teams who want unlimited momentum.',
    price: '$49',
    period: '/month',
    features: [
      '20,000 credits / month',
      '10 AI team members',
      'All experience levels',
    ],
    cta: 'Select',
  },
];

export default function Pricing() {
  return (
    <Section id="pricing-section" className="bg-gray-50 dark:bg-gray-900">
      <Container size="xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Plans for every kind of creator
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Start free. Upgrade when you need more credits, more AI team members, or deeper experience levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${
                plan.highlighted
                  ? 'border-accent bg-white dark:bg-gray-800 shadow-2xl scale-105'
                  : plan.current
                  ? 'border-green-500 bg-white dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-accent'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                  Popular
                </div>
              )}

              <div className="space-y-6">
                {/* Plan name */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.highlighted ? 'primary' : plan.current ? 'secondary' : 'outline'}
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            All paid plans include priority AI processing, private share links, and export tools.
          </p>
        </div>
      </Container>
    </Section>
  );
}
