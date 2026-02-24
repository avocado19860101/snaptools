'use client';
import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

const faqItems = [
  { q: 'What can I encode in a QR code?', a: 'You can encode any text, URL, email address, phone number, Wi-Fi credentials, or any other text-based data.' },
  { q: 'Can I customize the QR code color?', a: 'Currently the tool generates standard black-on-white QR codes for maximum compatibility with all scanners.' },
  { q: 'What size should my QR code be?', a: 'For print, use at least 300px. For digital use, 200-400px is typically sufficient. Larger sizes scan more reliably.' },
  { q: 'Do QR codes expire?', a: 'No. QR codes are simply encoded data — they never expire. The content they link to (like a URL) may change, but the code itself is permanent.' },
];

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    if (!text.trim() || !canvasRef.current) return;
    await QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2 });
    setGenerated(true);
  };

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Code Generator</h1>
      <p className="text-gray-600 mb-2">Create QR codes instantly for any URL, text, or data. QR codes are widely used for sharing links, contact information, Wi-Fi passwords, and more. Simply scan with any smartphone camera to access the encoded content.</p>
      <p className="text-gray-600 mb-8">Our generator creates high-quality QR codes right in your browser. No data is sent to any server, and your QR codes are ready to download in PNG format for print or digital use.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate QR Code</h2>
        <textarea value={text} onChange={e => { setText(e.target.value); setGenerated(false); }} placeholder="Enter URL or text here..." className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 h-28 resize-none" />
        <button onClick={generate} disabled={!text.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium px-6 py-3 rounded-lg transition-colors">Generate QR Code</button>
        <div className="mt-6 flex flex-col items-center">
          <canvas ref={canvasRef} className={generated ? '' : 'hidden'} />
          {generated && (
            <button onClick={download} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg">Download QR Code</button>
          )}
        </div>
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the QR Code Generator</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Type or paste your URL, text, or data into the text box.</li>
          <li>Click &quot;Generate QR Code&quot; to create your code instantly.</li>
          <li>Preview the QR code and click &quot;Download QR Code&quot; to save it as a PNG file.</li>
          <li>Print it, share it digitally, or embed it in documents.</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'QR Code Generator', url: 'https://snaptools.dev/qr-code-generator',
        description: 'Free online QR code generator. Create QR codes for any text or URL.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}} />
    </div>
  );
}
