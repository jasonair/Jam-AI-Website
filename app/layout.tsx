import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Jam AI - Turn chat into a canvas your brain can follow',
  description: 'Jam AI maps every conversation into nodes you can branch, connect, and ship from — no more endless scroll.',
  keywords: ['AI', 'chat', 'mind map', 'productivity', 'creative thinking'],
  authors: [{ name: 'Jam AI' }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Jam AI - Turn chat into a canvas your brain can follow',
    description: 'Jam AI maps every conversation into nodes you can branch, connect, and ship from — no more endless scroll.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
