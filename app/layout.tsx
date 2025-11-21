import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.usejamai.com'),
  title: 'Jam AI - Build your AI dream team',
  description: 'Name your AI specialists, choose their expertise, and chat with your whole team — all in Jam AI.',
  openGraph: {
    title: 'Jam AI - Build your AI dream team',
    description: 'Name your AI specialists, choose their expertise, and chat with your whole team — all in Jam AI.',
    url: 'https://www.usejamai.com',
    siteName: 'Jam AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jam AI Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jam AI - Build your AI dream team',
    description: 'Name your AI specialists, choose their expertise, and chat with your whole team — all in Jam AI.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
