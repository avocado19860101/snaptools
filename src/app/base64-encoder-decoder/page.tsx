'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is Base64 encoding?', a: 'Base64 is a binary-to-text encoding scheme that converts binary data into an ASCII string format using 64 characters (A-Z, a-z, 0-9, +, /). It is commonly used to embed binary data in text-based formats like JSON, HTML, or email.' },
  { q: 'Does this tool support Unicode text?', a: 'Yes! This tool properly handles Unicode characters (including emoji and non-Latin scripts) by using TextEncoder/TextDecoder, unlike basic btoa/atob which only support Latin-1.' },
  { q: 'Is my data sent to a server?', a: 'No. All encoding and decoding is performed entirely in your browser using JavaScript. Your data never leaves your device.' },
  { q: 'What is the maximum input size?', a: 'There is no hard limit, but very large inputs (over 10MB) may slow down your browser. For typical text encoding/decoding, performance is instant.' },
  { q: 'Can I encode files to Base64?', a: 'This tool is designed for text encoding/decoding. For file-to-Base64 conversion, you would need to first read the file content and paste it here.' },
];

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    try {
      setError('');
      const bytes = new TextEncoder().encode(input);
      let binary = '';
      bytes.forEach(b => binary += String.fromCharCode(b));
      setOutput(btoa(binary));
    } catch {
      setError('Failed to encode the input.');
    }
  };

  const decode = () => {
    try {
      setError('');
      const binary = atob(input);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      setOutput(new TextDecoder().decode(bytes));
    } catch {
      setError('Invalid Base64 string. Please check your input.');
    }
  };

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description={[
        'Encode text to Base64 or decode Base64 strings back to text instantly. Supports Unicode characters including emoji.',
        'All processing happens in your browser. Your data is never sent to any server.',
      ]}
      howTo={{
        steps: [
          'Paste or type your text in the input area.',
          'Click "Encode" to convert text to Base64, or "Decode" to convert Base64 back to text.',
          'View the result in the output area.',
          'Click "Copy" to copy the result to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Base64 Encoder / Decoder', url: 'https://snaptools.dev/base64-encoder-decoder',
        description: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text with Unicode support.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Base64 Encode / Decode</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={5}
            placeholder="Enter text to encode or Base64 string to decode..."
            className="block w-full rounded-xl backdrop-blur-lg bg-white/50 border border-white/40 px-4 py-2.5 text-gray-900 transition-all duration-200 focus:bg-white/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-y font-mono text-sm"
          />
        </div>

        <div className="flex gap-3 mb-5">
          <Button onClick={encode}>Encode</Button>
          <Button onClick={decode} variant="ghost">Decode</Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Output</label>
              <CopyButton text={output} />
            </div>
            <textarea
              value={output}
              readOnly
              rows={5}
              className="block w-full rounded-xl backdrop-blur-lg bg-white/30 border border-white/40 px-4 py-2.5 text-gray-900 resize-y font-mono text-sm"
            />
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
