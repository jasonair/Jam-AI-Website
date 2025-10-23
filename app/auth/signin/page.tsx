'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Mail, Lock } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      router.push('/auth/success');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left Column - Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <Image 
                src="/images/jam-ai-logo-white.svg" 
                alt="Jam AI Logo" 
                width={64} 
                height={64}
                style={{ height: 'auto' }}
                className="object-contain mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-lg text-blue-100 mb-8">
                Sign in to your <span className="font-bold text-white">Jam AI</span> account and continue your journey with us.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span>View your account activity and usage stats</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span>Manage your subscription and billing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span>Earn bonus credits by inviting friends</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 md:hidden">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your <span className="font-bold text-blue-600 dark:text-blue-400">Jam AI</span> account
              </p>
            </div>

            {/* Sign In Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/auth/reset-password" className="text-sm text-accent hover:text-accent-hover">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-accent hover:text-accent-hover font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
