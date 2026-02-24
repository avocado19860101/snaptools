import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ SnapTools</h3>
            <p className="text-gray-600 text-sm">Free online tools for everyday tasks. All processing happens in your browser — your files never leave your device.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/image-resizer" className="text-gray-600 hover:text-blue-600">Image Resizer</Link></li>
              <li><Link href="/image-compressor" className="text-gray-600 hover:text-blue-600">Image Compressor</Link></li>
              <li><Link href="/qr-code-generator" className="text-gray-600 hover:text-blue-600">QR Code Generator</Link></li>
              <li><Link href="/word-counter" className="text-gray-600 hover:text-blue-600">Word Counter</Link></li>
              <li><Link href="/password-generator" className="text-gray-600 hover:text-blue-600">Password Generator</Link></li>
              <li><Link href="/color-picker" className="text-gray-600 hover:text-blue-600">Color Picker</Link></li>
              <li><Link href="/text-case-converter" className="text-gray-600 hover:text-blue-600">Text Case Converter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SnapTools. All rights reserved. All processing is done locally in your browser.
        </div>
      </div>
    </footer>
  );
}
