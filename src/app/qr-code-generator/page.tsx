'use client';
import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button } from '@/components/ui';

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
    <ToolLayout
      title="QR Code Generator"
      description={[
        'Create QR codes instantly for any URL, text, or data. QR codes are widely used for sharing links, contact information, Wi-Fi passwords, and more.',
        'Our generator creates high-quality QR codes right in your browser. No data is sent to any server.',
      ]}
      howTo={{
        steps: [
          'Type or paste your URL, text, or data into the text box.',
          'Click "Generate QR Code" to create your code instantly.',
          'Preview the QR code and click "Download QR Code" to save it as a PNG file.',
          'Print it, share it digitally, or embed it in documents.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'QR Code Generator', url: 'https://snaptools.dev/qr-code-generator',
        description: 'Free online QR code generator. Create QR codes for any text or URL.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Generate QR Code</h2>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setGenerated(false); }}
          placeholder="Enter URL or text here..."
          className="w-full rounded-xl backdrop-blur-lg bg-white/50 border border-white/40 px-4 py-3 mb-5 h-28 resize-none text-gray-900 placeholder-gray-400 focus:bg-white/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        <Button onClick={generate} disabled={!text.trim()} size="lg">Generate QR Code</Button>
        <div className="mt-6 flex flex-col items-center">
          <canvas ref={canvasRef} className={`${generated ? 'rounded-xl shadow-md' : 'hidden'}`} />
          {generated && (
            <Button variant="success" size="lg" onClick={download} className="mt-4">Download QR Code</Button>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
}
