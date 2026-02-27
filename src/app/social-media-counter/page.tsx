'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card } from '@/components/ui';

const faqItems = [
  { q: 'Are these character limits accurate?', a: 'Yes. We keep the limits updated to match each platform\'s current specifications as of 2024.' },
  { q: 'Do emojis count as one character?', a: 'It depends on the platform. Most platforms count emojis as 2 characters (due to Unicode encoding), but our counter uses JavaScript string length which may vary.' },
  { q: 'Does this tool save my text?', a: 'No. Everything runs in your browser and nothing is sent to any server.' },
  { q: 'How is reading time calculated?', a: 'Reading time is estimated at 200 words per minute, which is the average adult reading speed.' },
  { q: 'Can I use this for other platforms?', a: 'The limits shown cover the most popular platforms. For others, you can use the character count directly.' },
];

const platforms = [
  { name: 'Twitter / X', limit: 280, color: '#1DA1F2' },
  { name: 'Instagram Caption', limit: 2200, color: '#E4405F' },
  { name: 'Facebook Post', limit: 63206, color: '#1877F2' },
  { name: 'YouTube Title', limit: 100, color: '#FF0000' },
  { name: 'YouTube Description', limit: 5000, color: '#FF0000' },
  { name: 'LinkedIn Post', limit: 3000, color: '#0A66C2' },
  { name: 'TikTok Caption', limit: 2200, color: '#000000' },
];

export default function SocialMediaCounter() {
  const [text, setText] = useState('');

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snaptools-social-draft');
      if (saved) setText(saved);
    } catch { /* ignore */ }
  }, []);

  // Auto-save draft as user types
  useEffect(() => {
    localStorage.setItem('snaptools-social-draft', text);
  }, [text]);

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <ToolLayout
      title="Social Media Character Counter"
      description={[
        'Check your text against character limits for Twitter, Instagram, Facebook, YouTube, LinkedIn, and TikTok.',
        'See live character counts, word counts, and estimated reading time as you type.',
      ]}
      howTo={{ steps: [
        'Type or paste your text in the textarea.',
        'View character counts against each platform\'s limit in real-time.',
        'Color-coded progress bars show green (safe), yellow (near limit), and red (over limit).',
        'Check word count and estimated reading time at the top.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Social Media Character Counter', url: 'https://snaptools.dev/social-media-counter',
        description: 'Check text against social media character limits. Twitter, Instagram, Facebook, and more.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Character Counter</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[150px]"
          placeholder="Type or paste your text here..."
        />
        <div className="flex gap-6 mt-3 text-sm text-gray-500">
          <span>{chars.toLocaleString()} characters</span>
          <span>{words.toLocaleString()} words</span>
          <span>~{readingTime} min read</span>
        </div>

        <div className="mt-6 space-y-3">
          {platforms.map(p => {
            const pct = Math.min((chars / p.limit) * 100, 100);
            const over = chars > p.limit;
            const barColor = over ? '#EF4444' : pct > 80 ? '#F59E0B' : p.color;
            return (
              <div key={p.name} className="glass rounded-xl px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{p.name}</span>
                  <span className={`text-sm font-mono ${over ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {chars.toLocaleString()} / {p.limit.toLocaleString()}
                    {over && ` (−${(chars - p.limit).toLocaleString()})`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </ToolLayout>
  );
}
