'use client';
import { useState, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const PRESETS = [
  { label: '16:9', w: 16, h: 9 },
  { label: '4:3', w: 4, h: 3 },
  { label: '1:1', w: 1, h: 1 },
  { label: '21:9', w: 21, h: 9 },
  { label: '9:16', w: 9, h: 16 },
  { label: '3:2', w: 3, h: 2 },
];

const faqItems = [
  { q: 'What is an aspect ratio?', a: 'An aspect ratio is the proportional relationship between the width and height of an image or screen. For example, 16:9 means the width is 16 units for every 9 units of height.' },
  { q: 'How does locking the ratio work?', a: 'When the ratio is locked, changing either width or height automatically calculates the other dimension to maintain the same proportions.' },
  { q: 'What are common aspect ratios?', a: '16:9 (widescreen), 4:3 (traditional TV), 1:1 (square), 21:9 (ultrawide), and 9:16 (vertical video) are the most commonly used ratios.' },
  { q: 'Can I use decimal dimensions?', a: 'Yes, you can enter decimal values. The calculator will compute the ratio and maintain proportions accurately.' },
  { q: 'Is this tool free to use?', a: 'Yes, completely free with no sign-up required. All calculations happen in your browser.' },
];

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [locked, setLocked] = useState(false);
  const [lockedRatio, setLockedRatio] = useState<number | null>(null);

  const ratio = width && height ? (() => {
    const d = gcd(Math.round(width), Math.round(height));
    return `${Math.round(width) / d}:${Math.round(height) / d}`;
  })() : '—';

  const lockRatio = () => {
    if (!locked && width && height) {
      setLockedRatio(width / height);
      setLocked(true);
    } else {
      setLocked(false);
      setLockedRatio(null);
    }
  };

  const updateWidth = useCallback((w: number) => {
    setWidth(w);
    if (locked && lockedRatio) setHeight(Math.round(w / lockedRatio));
  }, [locked, lockedRatio]);

  const updateHeight = useCallback((h: number) => {
    setHeight(h);
    if (locked && lockedRatio) setWidth(Math.round(h * lockedRatio));
  }, [locked, lockedRatio]);

  const applyPreset = (w: number, h: number) => {
    setWidth(w * 120);
    setHeight(h * 120);
    setLockedRatio(w / h);
    setLocked(true);
  };

  const previewW = 240;
  const previewH = width && height ? Math.round((previewW / width) * height) : previewW;
  const clampedH = Math.min(previewH, 300);
  const displayW = previewH > 300 ? Math.round((300 / previewH) * previewW) : previewW;

  return (
    <ToolLayout
      title="Aspect Ratio Calculator"
      description={[
        'Calculate and convert aspect ratios instantly. Enter width and height to find the ratio, or lock a ratio and resize proportionally.',
        'Perfect for designers, developers, and video editors working with screens, images, and video dimensions.',
      ]}
      howTo={{
        steps: [
          'Enter width and height values in pixels (or any unit).',
          'The aspect ratio is automatically calculated and displayed.',
          'Click "Lock Ratio" to maintain proportions when changing dimensions.',
          'Use presets like 16:9, 4:3, or 1:1 for common ratios.',
          'View the visual preview to see the shape of your dimensions.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Aspect Ratio Calculator', url: 'https://snaptools.dev/aspect-ratio-calculator',
        description: 'Free online aspect ratio calculator. Calculate, lock, and convert aspect ratios.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Calculate Aspect Ratio</h2>

        <div className="flex flex-wrap gap-4 items-end mb-5">
          <div className="w-36">
            <Input label="Width" type="number" value={width} onChange={e => updateWidth(+e.target.value)} />
          </div>
          <span className="pb-3 text-gray-400 font-bold">×</span>
          <div className="w-36">
            <Input label="Height" type="number" value={height} onChange={e => updateHeight(+e.target.value)} />
          </div>
          <div className="pb-1">
            <Button variant={locked ? 'primary' : 'ghost'} onClick={lockRatio}>
              {locked ? '🔒 Locked' : '🔓 Lock Ratio'}
            </Button>
          </div>
        </div>

        <div className="glass rounded-xl p-4 mb-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Aspect Ratio</p>
          <p className="text-3xl font-bold text-gray-900">{ratio}</p>
          <p className="text-sm text-gray-400 mt-1">{width} × {height} px</p>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <Button key={p.label} variant="ghost" size="sm" onClick={() => applyPreset(p.w, p.h)}>{p.label}</Button>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 flex items-center justify-center">
          <div
            style={{ width: displayW, height: clampedH }}
            className="border-2 border-primary-500 rounded-lg bg-primary-500/10 flex items-center justify-center transition-all duration-300"
          >
            <span className="text-sm text-primary-600 font-medium">{width} × {height}</span>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
}
