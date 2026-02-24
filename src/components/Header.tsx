'use client';
import Link from 'next/link';
import { useState } from 'react';

const tools = [
  { name: 'Image Resizer', href: '/image-resizer' },
  { name: 'Image Compressor', href: '/image-compressor' },
  { name: 'QR Code Generator', href: '/qr-code-generator' },
  { name: 'Word Counter', href: '/word-counter' },
  { name: 'Password Generator', href: '/password-generator' },
  { name: 'Color Picker', href: '/color-picker' },
  { name: 'Text Case Converter', href: '/text-case-converter' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            🛠️ SnapTools
          </Link>
          <div className="hidden md:flex gap-1">
            {tools.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                {t.name}
              </Link>
            ))}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 hover:bg-white/50 rounded-xl transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {tools.map(t => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-white/50 rounded-xl transition-colors"
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
