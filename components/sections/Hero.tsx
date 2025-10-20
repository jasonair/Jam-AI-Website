'use client';

import { ArrowDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function Hero() {
  const scrollToLearnMore = () => {
    const valueSection = document.getElementById('value-section');
    valueSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <Container className="relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Turn chat into a canvas
            <br />
            <span className="text-accent">your brain can follow.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-balance">
            Jam AI maps every conversation into nodes you can branch, connect, and ship from — no more endless scroll.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="min-w-[200px]">
              Start Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="min-w-[200px]"
              onClick={scrollToLearnMore}
            >
              Learn More <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Tagline */}
          <p className="text-sm text-gray-500 dark:text-gray-500 pt-4">
            Works on macOS • Built for creative thinkers • Private by design
          </p>

          {/* Visual representation */}
          <div className="pt-12 animate-slide-up">
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                {/* Mind map visualization */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-32 h-16 bg-accent/10 border-2 border-accent rounded-lg flex items-center justify-center text-sm font-medium">
                      Chat Message
                    </div>
                    <div className="text-2xl text-accent">→</div>
                    <div className="w-32 h-16 bg-accent border-2 border-accent rounded-lg flex items-center justify-center text-sm font-medium text-white">
                      Node
                    </div>
                  </div>
                  <div className="flex items-start justify-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-2 h-12 bg-accent/30" />
                      <div className="w-24 h-12 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg flex items-center justify-center text-xs">
                        Branch 1
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-2 h-12 bg-accent/30" />
                      <div className="w-24 h-12 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg flex items-center justify-center text-xs">
                        Branch 2
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-2 h-12 bg-accent/30" />
                      <div className="w-24 h-12 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center justify-center text-xs">
                        Branch 3
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
