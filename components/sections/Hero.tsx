'use client';

import { ArrowDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function Hero() {
  const scrollToLearnMore = () => {
    const valueSection = document.getElementById('value-section');
    valueSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDownload = () => {
    const downloadButton = document.querySelector('[data-download-button]');
    if (downloadButton) {
      downloadButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
            Build your AI dream team
            <br />
            <span className="text-accent">in one shared space.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-balance">
            Name your AI specialists, choose their expertise, and chat with your whole team — all in one visual workspace where you can see everyone's insights at once.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="min-w-[200px]" onClick={scrollToDownload}>
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
            macOS (M1+) • Built for creative thinkers
          </p>
        </div>
      </Container>
    </section>
  );
}
