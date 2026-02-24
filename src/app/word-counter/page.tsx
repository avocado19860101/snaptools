'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

const faqItems = [
  { q: 'How are words counted?', a: 'Words are counted by splitting text on whitespace. Multiple spaces and line breaks are handled correctly.' },
  { q: 'Does it count special characters?', a: 'Yes, all characters including spaces, punctuation, and special symbols are counted in the character count. Characters without spaces excludes whitespace.' },
  { q: 'Can I use this for essays and assignments?', a: 'Absolutely! This tool is perfect for checking word counts on essays, blog posts, social media captions, and any text-based content.' },
  { q: 'What counts as a sentence?', a: 'Sentences are counted based on periods (.), exclamation marks (!), and question marks (?). Abbreviations may slightly affect the count.' },
];

export default function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim().length > 0 ? 1 : 0) : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const stats = [
    { label: 'Words', value: words },
    { label: 'Characters', value: chars },
    { label: 'Characters (no spaces)', value: charsNoSpace },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs || (text.trim() ? 1 : 0) },
    { label: 'Reading Time', value: `${readingTime} min` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Word & Character Counter</h1>
      <p className="text-gray-600 mb-2">Instantly count words, characters, sentences, and paragraphs in any text. Essential for writers, students, and content creators who need to meet specific word count requirements for essays, blog posts, social media, and more.</p>
      <p className="text-gray-600 mb-8">Simply paste or type your text below and see real-time statistics. The tool also estimates reading time based on an average reading speed of 200 words per minute.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Paste Your Text</h2>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your text here..." className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 h-48 resize-y" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{s.value}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Word Counter</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Type or paste your text into the text area above.</li>
          <li>Statistics update automatically in real time — no button needed.</li>
          <li>Use the word count, character count, and reading time for your needs.</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Word Counter', url: 'https://snaptools.dev/word-counter',
        description: 'Free online word and character counter with reading time estimation.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}} />
    </div>
  );
}
