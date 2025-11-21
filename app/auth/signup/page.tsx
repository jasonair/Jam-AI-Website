'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, Gift, Check, X } from 'lucide-react';

// Password Requirement Component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      )}
      <span className={`text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {text}
      </span>
    </div>
  );
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referrerEmail, setReferrerEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password validation checks
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  // Check for referral code in URL on component mount
  useEffect(() => {
    const code = searchParams.get('referral_code');
    if (code) {
      validateReferralCode(code);
    }
  }, [searchParams]);

  const validateReferralCode = async (code: string) => {
    try {
      const response = await fetch('/api/referral/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode: code }),
      });

      const data = await response.json();
      if (data.valid) {
        setReferralCode(code);
        setReferralValid(true);
        setReferrerEmail(data.referrerEmail);
      } else {
        setReferralValid(false);
      }
    } catch (err) {
      console.error('Error validating referral code:', err);
      setReferralValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      setLoading(false);
      return;
    }

    try {
      const newUser = await signUp(formData.email, formData.password, formData.displayName);

      // Redeem referral code if provided
      if (referralCode && referralValid && newUser) {
        try {
          const response = await fetch('/api/referral/redeem', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              referralCode,
              referredUserId: newUser.uid,
              referredUserEmail: formData.email,
            }),
          });

          if (response.ok) {
            console.log('Referral code redeemed successfully');
          }
        } catch (referralErr) {
          console.error('Error redeeming referral code:', referralErr);
          // Don't block signup if referral redemption fails
        }
      }

      router.push('/auth/success');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
              <h1 className="text-4xl font-bold mb-4">Join Jam AI</h1>
              <p className="text-lg text-blue-100 mb-8">
                Start with a 14-day Pro trial on our free plan and experience the power of <span className="font-bold text-white">Jam AI</span>
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span>14-day Pro trial included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span>100 free credits per month after trial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 md:hidden">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Start your 14-day Pro trial with <span className="font-bold text-blue-600 dark:text-blue-400">Jam AI</span>
              </p>
            </div>

            {/* Sign Up Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              {/* Referral Code Banner */}
              {referralValid && (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                        Referral code applied! 🎉
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        You&apos;ll receive <strong>250 bonus credits</strong> when you subscribe to a paid plan.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {referralValid === false && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Invalid referral code. You can still sign up normally.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

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
                      onFocus={() => setShowPasswordRequirements(true)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Password Requirements */}
                  {showPasswordRequirements && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
                      <div className="space-y-1">
                        <PasswordRequirement met={passwordRequirements.minLength} text="At least 8 characters" />
                        <PasswordRequirement met={passwordRequirements.hasUppercase} text="One uppercase letter" />
                        <PasswordRequirement met={passwordRequirements.hasLowercase} text="One lowercase letter" />
                        <PasswordRequirement met={passwordRequirements.hasNumber} text="One number" />
                        <PasswordRequirement met={passwordRequirements.hasSpecialChar} text="One special character (!@#$%^&*)" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
