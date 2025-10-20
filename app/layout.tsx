import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jam AI - Turn chat into a canvas your brain can follow',
  description: 'Jam AI maps every conversation into nodes you can branch, connect, and ship from — no more endless scroll.',
  keywords: ['AI', 'chat', 'mind map', 'productivity', 'creative thinking'],
  authors: [{ name: 'Jam AI' }],
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
      <body>{children}</body>
    </html>
  );
}
