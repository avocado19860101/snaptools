'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'Does this support Unicode characters?', a: 'Yes. The tool encodes text using UTF-8, so emojis, accented characters, and other Unicode are fully supported.' },
  { q: 'What does "with spaces" mean?', a: 'When enabled, each byte is separated by a space (e.g., "01001000 01101001"). Without spaces, all bits are concatenated.' },
  { q: 'Can I convert binary back to text?', a: 'Yes. Switch to the "Binary → Text" tab, paste binary digits (with or without spaces), and get the original text back.' },
  { q: 'Is my text sent to a server?', a: 'No. All encoding and decoding happens directly in your browser. Your data stays private.' },
  { q: 'Why are some characters more than 8 bits?', a: 'UTF-8 encodes characters beyond ASCII using 2–4 bytes. Each byte is shown as 8 bits, so a single character may produce 16–32 bits.' },
];

function textToBinary(text: string, spaces: boolean): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const bins = Array.from(bytes).map(b => b.toString(2).padStart(8, '0'));
  return bins.join(spaces ? ' ' : '');
}

function binaryToText(bin: string): string {
  const clean = bin.replace(/[^01]/g, '');
  if (clean.length % 8 !== 0) return '⚠️ Binary length must be a multiple of 8';
  const bytes = new Uint8Array(clean.length / 8);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
  }
  return new TextDecoder().decode(bytes);
}

export default function TextToBinary() {
  const [mode, setMode] = useState<'text2bin' | 'bin2text'>('text2bin');
  const [input, setInput] = useState('');
  const [spaces, setSpaces] = useState(true);

  const output = mode === 'text2bin' ? textToBinary(input, spaces) : binaryToText(input);

  return (
    <ToolLayout
      title="Text to Binary Converter"
      description={[
        'Convert any text to binary representation and vice versa. Supports full Unicode via UTF-8 encoding.',
        'All processing happens in your browser — your text is never uploaded anywhere. Toggle spaces between bytes for readability.',
      ]}
      howTo={{
        steps: [
          'Choose "Text → Binary" or "Binary → Text" mode using the tabs.',
          'Type or paste your input in the text area.',
          'The converted output appears instantly below.',
          'Toggle "Spaces between bytes" for readability. Click Copy to copy the result.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Text to Binary Converter', url: 'https://snaptools.dev/text-to-binary',
        description: 'Free text to binary converter with Unicode UTF-8 support. Convert text to binary and binary to text.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Convert</h2>

        <div className="flex gap-2 mb-5">
          <Button variant={mode === 'text2bin' ? 'primary' : 'ghost'} onClick={() => { setMode('text2bin'); setInput(''); }}>Text → Binary</Button>
          <Button variant={mode === 'bin2text' ? 'primary' : 'ghost'} onClick={() => { setMode('bin2text'); setInput(''); }}>Binary → Text</Button>
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'text2bin' ? 'Type text here...' : 'Paste binary here (e.g., 01001000 01101001)...'}
          className="w-full min-h-[120px] rounded-xl p-4 bg-white/50 border border-white/40 text-gray-900 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/20 mb-4"
        />

        {mode === 'text2bin' && (
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <input type="checkbox" checked={spaces} onChange={e => setSpaces(e.target.checked)} className="rounded" />
            Spaces between bytes
          </label>
        )}

        {input && (
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{mode === 'text2bin' ? 'Binary Output' : 'Text Output'}</span>
              <CopyButton text={output} />
            </div>
            <div className="font-mono text-gray-900 break-all whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
