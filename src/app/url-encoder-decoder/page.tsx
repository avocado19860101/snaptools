'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is URL encoding?', a: 'URL encoding (also called percent-encoding) converts special characters into a format that can be safely transmitted in URLs. For example, spaces become %20 and ampersands become %26.' },
  { q: 'When should I URL-encode text?', a: 'URL encoding is needed when passing special characters in query parameters, form data, or any part of a URL. It ensures characters like &, =, ?, and spaces are interpreted correctly.' },
  { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'This tool uses encodeURIComponent, which encodes all special characters including /, ?, &, and =. Use this when encoding individual parameter values.' },
  { q: 'Is my data sent to a server?', a: 'No. All encoding and decoding happens entirely in your browser using JavaScript. Your data never leaves your device.' },
  { q: 'Can I encode entire URLs?', a: 'Yes, but note that this tool encodes all special characters including slashes and colons. For encoding just the query parameters of a URL, paste only the parameter values.' },
];

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    try {
      setError('');
      setOutput(encodeURIComponent(input));
    } catch {
      setError('Failed to encode the input.');
    }
  };

  const decode = () => {
    try {
      setError('');
      setOutput(decodeURIComponent(input));
    } catch {
      setError('Invalid URL-encoded string. Please check your input.');
    }
  };

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description={[
        'Encode or decode URL strings instantly. Convert special characters to percent-encoded format or decode them back to readable text.',
        'All processing happens in your browser. Your data is never sent to any server.',
      ]}
      howTo={{
        steps: [
          'Paste or type your text in the input area.',
          'Click "Encode" to URL-encode the text, or "Decode" to decode a URL-encoded string.',
          'View the result in the output area.',
          'Click "Copy" to copy the result to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'URL Encoder / Decoder', url: 'https://snaptools.dev/url-encoder-decoder',
        description: 'Free online URL encoder and decoder. Encode special characters for URLs or decode percent-encoded strings.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">URL Encode / Decode</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={5}
            placeholder="Enter text to encode or URL-encoded string to decode..."
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
