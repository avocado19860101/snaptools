'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

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
  const [copied, setCopied] = useState('');

  const copy = (val: string, name: string) => {
    navigator.clipboard.writeText(val);
    setCopied(name);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Text Case Converter</h1>
      <p className="text-gray-600 mb-2">Quickly convert text between different cases: UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more. Perfect for writers who accidentally typed in caps lock, developers formatting variable names, or anyone who needs text in a specific format.</p>
      <p className="text-gray-600 mb-8">Type or paste your text below and see all conversions instantly. Click any result to copy it to your clipboard. Everything runs locally in your browser.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Enter Your Text</h2>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your text here..." className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 h-32 resize-y" />
        {text.trim() && (
          <div className="space-y-3">
            {conversions.map(c => {
              const val = c.fn(text);
              return (
                <button key={c.name} onClick={() => copy(val, c.name)} className="w-full text-left bg-gray-50 hover:bg-blue-50 rounded-lg p-4 flex justify-between items-start transition-colors">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{c.name}</div>
                    <div className="font-mono text-gray-900 break-all">{val}</div>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{copied === c.name ? '✓ Copied!' : 'Copy'}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Text Case Converter</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Type or paste your text into the text area above.</li>
          <li>All case conversions appear automatically below your input.</li>
          <li>Click any conversion to copy the result to your clipboard.</li>
          <li>Paste wherever you need it!</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Text Case Converter', url: 'https://snaptools.dev/text-case-converter',
        description: 'Free online text case converter. Convert between uppercase, lowercase, camelCase, and more.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}} />
    </div>
  );
}
