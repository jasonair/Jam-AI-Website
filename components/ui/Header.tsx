'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { Menu, X, User } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('/images/jam-ai-logo-blue.svg');

  useEffect(() => {
    setLogoSrc(theme === 'dark' ? '/images/jam-ai-logo-white.svg' : '/images/jam-ai-logo-blue.svg');
  }, [theme]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-accent">
            <Image 
              src={logoSrc} 
              alt="Jam AI Logo" 
              width={32} 
              height={32}
              style={{ height: 'auto' }}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/pricing" 
              className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
            >
              Pricing
            </Link>
            <ThemeToggle />
            
            {!loading && (
              <>
                {user ? (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => router.push('/account')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Link 
                      href="/auth/signin" 
                      className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
                    >
                      Sign In
                    </Link>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => router.push('/auth/signup')}
                    >
                      Start Free Trial
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3">
            <Link 
              href="/pricing" 
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex justify-center py-2">
              <ThemeToggle />
            </div>
            
            {!loading && (
              <>
                {user ? (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/account');
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Link 
                      href="/auth/signin" 
                      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push('/auth/signup');
                      }}
                    >
                      Start Free Trial
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
