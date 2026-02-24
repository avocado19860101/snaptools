'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card } from '@/components/ui';

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
    { label: 'No Spaces', value: charsNoSpace },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs || (text.trim() ? 1 : 0) },
    { label: 'Reading Time', value: `${readingTime} min` },
  ];

  return (
    <ToolLayout
      title="Word & Character Counter"
      description={[
        'Instantly count words, characters, sentences, and paragraphs in any text. Essential for writers, students, and content creators.',
        'Simply paste or type your text below and see real-time statistics. Reading time is estimated at 200 words per minute.',
      ]}
      howTo={{
        steps: [
          'Type or paste your text into the text area above.',
          'Statistics update automatically in real time — no button needed.',
          'Use the word count, character count, and reading time for your needs.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Word Counter', url: 'https://snaptools.dev/word-counter',
        description: 'Free online word and character counter with reading time estimation.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Paste Your Text</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full rounded-xl backdrop-blur-lg bg-white/50 border border-white/40 px-4 py-3 mb-6 h-48 resize-y text-gray-900 placeholder-gray-400 focus:bg-white/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="glass-subtle rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </ToolLayout>
  );
}
