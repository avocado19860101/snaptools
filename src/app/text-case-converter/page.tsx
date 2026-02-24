'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What text cases are available?', a: 'We support UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.' },
  { q: 'Can I convert long texts?', a: 'Yes! There is no practical limit. The conversion happens instantly in your browser regardless of text length.' },
  { q: 'What is camelCase?', a: 'camelCase is a naming convention where words are joined without spaces, and each word after the first starts with a capital letter. Example: "helloWorld".' },
  { q: 'Is any data sent to a server?', a: 'No. All text conversion happens locally in your browser. Your text never leaves your device.' },
];

const toTitle = (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
const toSentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const toWords = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim().split(/\s+/);
const toCamel = (s: string) => { const w = toWords(s); return w.map((x, i) => i === 0 ? x.toLowerCase() : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(''); };
const toPascal = (s: string) => toWords(s).map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('');
const toSnake = (s: string) => toWords(s).join('_').toLowerCase();
const toKebab = (s: string) => toWords(s).join('-').toLowerCase();
const toConstant = (s: string) => toWords(s).join('_').toUpperCase();

const conversions = [
  { name: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
  { name: 'lowercase', fn: (s: string) => s.toLowerCase() },
  { name: 'Title Case', fn: toTitle },
  { name: 'Sentence case', fn: toSentence },
  { name: 'camelCase', fn: toCamel },
  { name: 'PascalCase', fn: toPascal },
  { name: 'snake_case', fn: toSnake },
  { name: 'kebab-case', fn: toKebab },
  { name: 'CONSTANT_CASE', fn: toConstant },
];

export default function TextCaseConverter() {
  const [text, setText] = useState('');

  return (
    <ToolLayout
      title="Text Case Converter"
      description={[
        'Quickly convert text between different cases: UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
        'Type or paste your text below and see all conversions instantly. Everything runs locally in your browser.',
      ]}
      howTo={{
        steps: [
          'Type or paste your text into the text area.',
          'All case conversions appear automatically below your input.',
          'Click the copy button on any conversion to copy the result.',
          'Paste wherever you need it!',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Text Case Converter', url: 'https://snaptools.dev/text-case-converter',
        description: 'Free online text case converter. Convert between uppercase, lowercase, camelCase, and more.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Enter Your Text</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full rounded-xl backdrop-blur-lg bg-white/50 border border-white/40 px-4 py-3 mb-6 h-32 resize-y text-gray-900 placeholder-gray-400 focus:bg-white/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        {text.trim() && (
          <div className="space-y-3">
            {conversions.map(c => {
              const val = c.fn(text);
              return (
                <div key={c.name} className="glass-subtle rounded-xl p-4 flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-400 mb-1">{c.name}</div>
                    <div className="font-mono text-gray-900 break-all">{val}</div>
                  </div>
                  <CopyButton text={val} className="ml-4 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
