import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SnapTools - Free Online Tools for Everyday Tasks',
  description: 'Resize images, generate QR codes, create passwords, convert colors, and more — all free and processed in your browser.',
};

const tools = [
  { name: 'Image Resizer', desc: 'Resize any image to exact dimensions. Fast and free.', href: '/image-resizer', icon: '🖼️' },
  { name: 'Image Compressor', desc: 'Compress images to reduce file size without losing quality.', href: '/image-compressor', icon: '📦' },
  { name: 'QR Code Generator', desc: 'Create QR codes for URLs, text, or any data instantly.', href: '/qr-code-generator', icon: '📱' },
  { name: 'Word Counter', desc: 'Count words, characters, sentences, and paragraphs.', href: '/word-counter', icon: '📝' },
  { name: 'Password Generator', desc: 'Generate strong, secure passwords with custom options.', href: '/password-generator', icon: '🔐' },
  { name: 'Color Picker', desc: 'Pick colors and convert between HEX, RGB, and HSL.', href: '/color-picker', icon: '🎨' },
  { name: 'Text Case Converter', desc: 'Convert text to UPPERCASE, lowercase, Title Case, and more.', href: '/text-case-converter', icon: '🔤' },
];

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Free Online Tools for <span className="text-blue-600">Everyday Tasks</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Resize images, generate QR codes, create secure passwords, and more. All tools run directly in your browser — no uploads, no sign-ups, completely free.</p>
        </div>
      </section>
      {/* <AdPlaceholder slot="below-hero" /> */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">All Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(t => (
            <Link key={t.href} href={t.href} className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">{t.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">{t.name}</h3>
              <p className="text-gray-600">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why SnapTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div><div className="text-3xl mb-3">🔒</div><h3 className="font-semibold text-lg mb-2">100% Private</h3><p className="text-gray-600">Your files never leave your device. Everything is processed locally in your browser.</p></div>
            <div><div className="text-3xl mb-3">⚡</div><h3 className="font-semibold text-lg mb-2">Lightning Fast</h3><p className="text-gray-600">No waiting for server uploads. Tools work instantly on your device.</p></div>
            <div><div className="text-3xl mb-3">💰</div><h3 className="font-semibold text-lg mb-2">Completely Free</h3><p className="text-gray-600">No sign-ups, no subscriptions, no hidden fees. Free forever.</p></div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SnapTools',
        url: 'https://snaptools.dev',
        description: 'Free online tools for everyday tasks',
        potentialAction: { '@type': 'SearchAction', target: 'https://snaptools.dev/?q={search_term_string}', 'query-input': 'required name=search_term_string' }
      })}} />
    </>
  );
}
