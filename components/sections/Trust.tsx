'use client';

import { useState, useEffect } from 'react';
import { Quote, Shield, Lock, Heart } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

const testimonials = [
  {
    quote: "Finally a chat I don't get lost in.",
    author: "Sarah Chen",
    role: "Product Designer"
  },
  {
    quote: "Having multiple AI specialists in one workspace changed how I approach complex problems.",
    author: "Marcus Rodriguez",
    role: "Software Engineer"
  },
  {
    quote: "The visual canvas makes it so easy to see connections between different ideas. Game changer.",
    author: "Emma Thompson",
    role: "Content Strategist"
  },
  {
    quote: "I can finally keep track of all my AI conversations without endless scrolling.",
    author: "Alex Kumar",
    role: "Startup Founder"
  },
  {
    quote: "Being able to name each AI team member and see their responses side-by-side is brilliant.",
    author: "Jordan Lee",
    role: "Marketing Manager"
  },
  {
    quote: "The spatial organization of conversations helps me think more clearly about my projects.",
    author: "Taylor Brooks",
    role: "UX Researcher"
  },
];

const trustBadges = [
  { icon: Lock, text: 'Private by design' },
  { icon: Shield, text: 'Built with Firebase & Stripe security' },
  { icon: Heart, text: 'Loved by early Jam AI creators' },
];

export default function Trust() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Section spacing="md" className="bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="text-center mb-12 relative min-h-[200px] flex items-center justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6 absolute top-0 left-1/2 -translate-x-1/2">
              <Quote className="w-8 h-8 text-accent" />
            </div>
            <div
              className={`transition-opacity duration-500 pt-24 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
            >
              <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                &quot;{testimonials[currentIndex].quote}&quot;
              </blockquote>
              <p className="text-gray-600 dark:text-gray-400">
                — {testimonials[currentIndex].author}, {testimonials[currentIndex].role}
              </p>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 500);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'w-8 bg-accent'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
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
