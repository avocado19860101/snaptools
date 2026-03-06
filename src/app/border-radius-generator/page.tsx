'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const presets: { name: string; values: [number, number, number, number] }[] = [
  { name: 'None', values: [0, 0, 0, 0] },
  { name: 'Rounded', values: [8, 8, 8, 8] },
  { name: 'Large', values: [20, 20, 20, 20] },
  { name: 'Pill', values: [999, 999, 999, 999] },
  { name: 'Circle', values: [50, 50, 50, 50] },
  { name: 'Blob', values: [30, 70, 50, 20] },
  { name: 'Leaf', values: [0, 50, 0, 50] },
  { name: 'Ticket', values: [20, 20, 0, 0] },
];

const faqItems = [
  { q: 'What is border-radius?', a: 'CSS border-radius rounds the corners of an element. You can set each corner independently or all at once.' },
  { q: 'What does linking corners do?', a: 'When linked, changing one corner updates all four corners to the same value. Unlink to set each independently.' },
  { q: 'What unit does border-radius use?', a: 'This tool uses pixels (px). For the circle preset, 50% is typically used, which we represent as a large px value.' },
  { q: 'Can I use percentages instead?', a: 'The generated CSS uses pixel values. You can manually change "px" to "%" in your stylesheet if needed.' },
  { q: 'How do I make a perfect circle?', a: 'Set all corners to 50% (or use the Circle preset) and ensure the element has equal width and height.' },
];

export default function BorderRadiusGenerator() {
  const [corners, setCorners] = useState<[number, number, number, number]>([12, 12, 12, 12]);
  const [linked, setLinked] = useState(true);

  const labels = ['Top Left', 'Top Right', 'Bottom Right', 'Bottom Left'];

  const updateCorner = (idx: number, val: number) => {
    if (linked) {
      setCorners([val, val, val, val]);
    } else {
      setCorners(c => { const n = [...c] as [number, number, number, number]; n[idx] = val; return n; });
    }
  };

  const cssValue = corners.every(c => c === corners[0]) ? `${corners[0]}px` : corners.map(c => `${c}px`).join(' ');
  const cssCode = `border-radius: ${cssValue};`;

  return (
    <ToolLayout
      title="Border Radius Generator"
      description={[
        'Generate CSS border-radius values visually. Adjust each corner independently or link them together.',
        'Live preview with presets for common shapes like pill, circle, and blob. Copy the CSS with one click.',
      ]}
      howTo={{ steps: [
        'Drag the sliders to set the border radius for each corner.',
        'Toggle the link button to control all corners together or independently.',
        'Try presets for common shapes like pill, circle, or blob.',
        'Copy the generated CSS code and use it in your project.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Border Radius Generator', url: 'https://snaptools.dev/border-radius-generator',
        description: 'Free CSS border-radius generator with visual preview and presets.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Preview</h2>
        <div className="flex justify-center p-12 glass rounded-2xl mb-6">
          <div
            className="w-48 h-48 bg-gradient-to-br from-primary-400 to-violet-500"
            style={{ borderRadius: cssValue }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {presets.map(p => (
            <Button key={p.name} variant="ghost" size="sm" onClick={() => { setCorners([...p.values]); setLinked(p.values.every(v => v === p.values[0])); }}>
              {p.name}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={linked} onChange={e => setLinked(e.target.checked)} className="rounded" />
            Link all corners
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {corners.map((val, i) => (
            <label key={i} className="block text-sm text-gray-500">
              {labels[i]}: {val}px
              <input type="range" min={0} max={200} value={val} onChange={e => updateCorner(i, +e.target.value)} className="w-full mt-1 accent-primary-500" />
            </label>
          ))}
        </div>
      </Card>

      <Card padding="lg" className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-900">CSS Code</h2>
          <CopyButton text={cssCode} label="Copy CSS" />
        </div>
        <pre className="p-4 rounded-xl glass font-mono text-sm text-gray-700">{cssCode}</pre>
      </Card>
    </ToolLayout>
  );
}
