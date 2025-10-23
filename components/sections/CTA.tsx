'use client';

import { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { downloadApp } from '@/lib/downloadApp';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export default function CTA() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleStartTrial = () => {
    if (user) {
      router.push('/account');
    } else {
      router.push('/auth/signup');
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      setDownloadError(null);
      await downloadApp('landing', user?.uid);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError('Failed to download. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };
  return (
    <Section className="bg-gradient-to-br from-accent/10 via-purple-50 to-blue-50 dark:from-accent/5 dark:via-purple-950/20 dark:to-blue-950/20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-blue-600 p-12 sm:p-16 text-center text-white shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold">
              Start your first Jam.
            </h2>

            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto">
              Build ideas like you think — in <span className="font-bold text-white">Jam AI</span>, not in threads.
            </p>

            {downloadError && (
              <div className="max-w-md mx-auto p-3 bg-red-500/20 border border-red-300 rounded-lg">
                <p className="text-sm text-white">{downloadError}</p>
              </div>
            )}

            {!loading && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="min-w-[220px] bg-white text-accent hover:bg-gray-100"
                  data-download-button
                  onClick={handleDownload}
                  disabled={downloadLoading}
                >
                  <Download className="mr-2 h-5 w-5" />
                  {downloadLoading ? 'Preparing...' : 'Download for macOS'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[220px] border-2 border-white text-white hover:bg-white/10"
                  onClick={handleStartTrial}
                >
                  {user ? 'Go to Account' : 'Start for Free'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
