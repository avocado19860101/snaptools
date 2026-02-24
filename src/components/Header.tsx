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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* AdSense placeholder */}
      {/* <div className="w-full h-[90px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Ad Space - Header Banner</div> */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">🛠️ SnapTools</Link>
          <div className="hidden md:flex gap-1">
            {tools.map(t => (
              <Link key={t.href} href={t.href} className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">{t.name}</Link>
            ))}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {tools.map(t => (
              <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg">{t.name}</Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
