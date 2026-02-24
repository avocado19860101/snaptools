import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 backdrop-blur-xl bg-white/40 border-t border-white/30">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ SnapTools</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Free online tools for everyday tasks. All processing happens in your browser — your files never leave your device.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Image Resizer', href: '/image-resizer' },
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'QR Code Generator', href: '/qr-code-generator' },
                { name: 'Word Counter', href: '/word-counter' },
                { name: 'Password Generator', href: '/password-generator' },
                { name: 'Color Picker', href: '/color-picker' },
                { name: 'Text Case Converter', href: '/text-case-converter' },
              ].map(t => (
                <li key={t.href}>
                  <Link href={t.href} className="text-gray-500 hover:text-primary-600 transition-colors">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
              ].map(t => (
                <li key={t.href}>
                  <Link href={t.href} className="text-gray-500 hover:text-primary-600 transition-colors">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/30 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SnapTools. All rights reserved. All processing is done locally in your browser.
        </div>
      </div>
    </footer>
  );
}
