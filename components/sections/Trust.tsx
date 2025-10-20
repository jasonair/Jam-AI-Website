import { Quote, Shield, Lock, Heart } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

const trustBadges = [
  { icon: Lock, text: 'Private by design' },
  { icon: Shield, text: 'Built with Firebase & Stripe security' },
  { icon: Heart, text: 'Loved by early creators' },
];

export default function Trust() {
  return (
    <Section spacing="md" className="bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Testimonial */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
              <Quote className="w-8 h-8 text-accent" />
            </div>
            <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4">
              "Finally a chat I don't get lost in."
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">
              — Beta User, Designer
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
