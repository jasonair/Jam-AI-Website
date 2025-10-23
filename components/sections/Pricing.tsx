import { Check } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import GridBackground from '@/components/ui/GridBackground';

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  isEnterprise?: boolean;
  id: string;
}

const plans: PricingPlan[] = [
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
    highlighted: true,
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
    isEnterprise: true,
  },
];

export default function Pricing() {
  return (
    <GridBackground className="bg-gray-50 dark:bg-gray-900" opacity="subtle" fadeEdges>
      <Section id="pricing-section">
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
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-accent'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                  Popular
                </div>
              )}

              <div className="flex flex-col justify-between min-h-[500px]">
                {/* Plan name */}
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
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link href="/pricing">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            All paid plans include priority AI processing and faster response times.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Compatible with macOS M1 and later. Intel processors are not supported.
          </p>
        </div>
      </Container>
      </Section>
    </GridBackground>
  );
}
