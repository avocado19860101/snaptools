'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is HTML encoding?', a: 'HTML encoding converts special characters like <, >, &, ", and \' into their HTML entity equivalents so they display correctly in web pages and don\'t break HTML markup.' },
  { q: 'When should I HTML encode text?', a: 'You should encode text when displaying user input in HTML to prevent XSS attacks, when including special characters in HTML attributes, or when writing code examples in web pages.' },
  { q: 'What are numeric HTML entities?', a: 'Numeric entities like &#60; represent characters by their Unicode code point number. They work the same as named entities like &lt; but can represent any Unicode character.' },
  { q: 'Is my text sent to a server?', a: 'No. All encoding and decoding happens entirely in your browser using JavaScript. No data is transmitted anywhere.' },
  { q: 'What characters are encoded?', a: 'The encoder converts & to &amp;, < to &lt;, > to &gt;, " to &quot;, and \' to &#39;. These are the five characters that have special meaning in HTML.' },
];

function htmlEncode(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function htmlDecode(str: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

export default function HtmlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(htmlEncode(input));
  const decode = () => setOutput(htmlDecode(input));
  const clear = () => { setInput(''); setOutput(''); };

  return (
    <ToolLayout
      title="HTML Encode/Decode"
      description={[
        'Encode special characters to HTML entities or decode HTML entities back to readable text. Essential for web development and preventing XSS.',
        'Supports all named entities (&lt;, &amp;, etc.) and numeric entities (&#60;, &#x3C;). Everything runs in your browser.',
      ]}
      howTo={{
        steps: [
          'Paste or type your text in the input area.',
          'Click "Encode" to convert special characters to HTML entities.',
          'Click "Decode" to convert HTML entities back to characters.',
          'Copy the result with the copy button or clear both fields.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'HTML Encode/Decode', url: 'https://snaptools.dev/html-encoder-decoder',
        description: 'Encode and decode HTML entities online. Free HTML encoder and decoder tool.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Input</h2>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={6}
          placeholder='Enter text to encode or HTML entities to decode, e.g. <div class="hello">'
          className="w-full glass rounded-xl p-4 text-sm font-mono text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 mb-4"
        />
        <div className="flex gap-3 mb-6">
          <Button onClick={encode} size="lg">Encode →</Button>
          <Button onClick={decode} size="lg" variant="secondary">Decode →</Button>
          <Button onClick={clear} variant="ghost" size="lg">Clear</Button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3">Output</h2>
        <div className="relative">
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full glass rounded-xl p-4 text-sm font-mono text-gray-700 resize-none focus:outline-none"
          />
          {output && (
            <div className="absolute top-2 right-2">
              <CopyButton text={output} />
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
}
