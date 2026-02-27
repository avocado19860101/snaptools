'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is a text repeater used for?', a: 'Text repeaters are popular for creating repeated messages for social media, testing input fields, generating placeholder content, or just having fun with friends on WhatsApp and other platforms.' },
  { q: 'Is there a limit on repetitions?', a: 'You can repeat text up to 10,000 times. Very large outputs may take a moment to generate depending on the text length.' },
  { q: 'Can I use custom separators?', a: 'Yes! Choose from new line, space, comma, or enter any custom separator text you like.' },
  { q: 'Does this work with emojis?', a: 'Absolutely. You can repeat any text including emojis, special characters, and Unicode symbols.' },
  { q: 'Is my text stored anywhere?', a: 'No. Everything runs in your browser. Your text is never sent to any server.' },
];

const separatorOptions = [
  { label: 'New Line', value: '\n' },
  { label: 'Space', value: ' ' },
  { label: 'Comma', value: ', ' },
  { label: 'No Separator', value: '' },
  { label: 'Custom', value: '__custom__' },
];

export default function TextRepeater() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(10);
  const [sepChoice, setSepChoice] = useState('\n');
  const [customSep, setCustomSep] = useState('');

  const separator = sepChoice === '__custom__' ? customSep : sepChoice;
  const output = useMemo(() => {
    if (!text || count < 1) return '';
    return Array(Math.min(count, 10000)).fill(text).join(separator);
  }, [text, count, separator]);

  return (
    <ToolLayout
      title="Text Repeater"
      description={[
        'Repeat any text multiple times with custom separators. Perfect for WhatsApp, social media, or testing.',
        'Generate repeated text instantly in your browser. Choose your separator, set the count, and copy the result.',
      ]}
      howTo={{ steps: [
        'Enter the text you want to repeat.',
        'Set the number of repetitions (1–10,000).',
        'Choose a separator: new line, space, comma, or custom.',
        'Copy the generated output with one click.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Text Repeater', url: 'https://snaptools.dev/text-repeater',
        description: 'Free online text repeater. Repeat text multiple times with custom separators.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Repeat Text</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text to repeat</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[80px] resize-y"
              placeholder="Enter your text here..."
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="w-40">
              <Input label="Repetitions" type="number" min={1} max={10000} value={count} onChange={e => setCount(Math.max(1, Math.min(10000, +e.target.value)))} />
            </div>
            <div className="w-48">
              <Select label="Separator" value={sepChoice} onChange={e => setSepChoice(e.target.value)} options={separatorOptions} />
            </div>
            {sepChoice === '__custom__' && (
              <div className="w-40">
                <Input label="Custom separator" value={customSep} onChange={e => setCustomSep(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {output && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">{output.length.toLocaleString()} characters</span>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 min-h-[160px] resize-y text-sm font-mono"
            />
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
