import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'SnapTools - Free Online Tools', template: '%s | SnapTools' },
  description: 'Free online tools for image resizing, QR codes, password generation, and more. All processing happens in your browser — fast, private, and free.',
  metadataBase: new URL('https://snaptools.dev'),
  openGraph: { type: 'website', locale: 'en_US', siteName: 'SnapTools' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
