'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card } from '@/components/ui';

const faqItems = [
  { q: 'Are these character limits accurate?', a: 'Yes, the limits reflect the current official limits for each platform as of 2024. Platforms may update their limits over time.' },
  { q: 'Does Twitter count URLs as full length?', a: 'Twitter shortens URLs to 23 characters regardless of actual length. This tool counts raw characters, so your actual remaining count may differ with links.' },
  { q: 'Are emojis counted as one character?', a: 'Most platforms count emojis as 2 characters. This tool uses JavaScript\'s string length which may count some emojis as 2. Twitter uses its own counting.' },
  { q: 'What is reading time based on?', a: 'Reading time is estimated at 200 words per minute, which is the average adult reading speed.' },
  { q: 'Is my text stored anywhere?', a: 'No. Everything runs locally in your browser. Your text is never sent to any server.' },
];

const platforms = [
  { name: 'Twitter / X', limit: 280, icon: '𝕏' },
  { name: 'Instagram Caption', limit: 2200, icon: '📸' },
  { name: 'Facebook Post', limit: 63206, icon: '📘' },
  { name: 'YouTube Title', limit: 100, icon: '▶️' },
  { name: 'YouTube Description', limit: 5000, icon: '▶️' },
  { name: 'LinkedIn Post', limit: 3000, icon: '💼' },
  { name: 'TikTok Caption', limit: 2200, icon: '🎵' },
];

function barColor(pct: number) {
  if (pct < 0.7) return 'bg-green-500';
  if (pct < 0.9) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function SocialMediaCounter() {
  const [text, setText] = useState('');
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <ToolLayout
      title="Social Media Character Counter"
      description={[
        'Check your text against character limits for Twitter, Instagram, Facebook, YouTube, LinkedIn, and TikTok.',
        'See real-time progress bars, word count, and reading time estimate. Never exceed a character limit again.',
      ]}
      howTo={{ steps: [
        'Type or paste your text into the text area.',
        'See character counts and progress bars for each platform in real-time.',
        'Green means safe, yellow means approaching the limit, red means near or over.',
        'Check word count and estimated reading time at the top.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Social Media Character Counter', url: 'https://snaptools.dev/social-media-counter',
        description: 'Free social media character counter for Twitter, Instagram, Facebook, YouTube, LinkedIn, and TikTok.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Your Text</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[140px] resize-y"
          placeholder="Type or paste your text here..."
        />
        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <span>{chars.toLocaleString()} characters</span>
          <span>{words.toLocaleString()} words</span>
          <span>~{readingTime} min read</span>
        </div>

        <div className="mt-6 space-y-4">
          {platforms.map(p => {
            const pct = Math.min(chars / p.limit, 1);
            const over = chars > p.limit;
            return (
              <div key={p.name} className="glass rounded-xl px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{p.icon} {p.name}</span>
                  <span className={`text-sm font-mono ${over ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                    {chars.toLocaleString()} / {p.limit.toLocaleString()}
                    {over && ` (${(chars - p.limit).toLocaleString()} over)`}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${barColor(pct)}`} style={{ width: `${pct * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </ToolLayout>
  );
}
