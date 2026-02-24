'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select, CopyButton } from '@/components/ui';

const DIRECTIONS = [
  { value: 'to right', label: 'To Right →' },
  { value: 'to left', label: 'To Left ←' },
  { value: 'to bottom', label: 'To Bottom ↓' },
  { value: 'to top', label: 'To Top ↑' },
  { value: 'to bottom right', label: 'To Bottom Right ↘' },
  { value: 'to top right', label: 'To Top Right ↗' },
  { value: '135deg', label: 'Diagonal 135°' },
  { value: 'radial', label: 'Radial (Circle)' },
];

const PRESETS = [
  { name: 'Sunset', colors: ['#f093fb', '#f5576c'] },
  { name: 'Ocean', colors: ['#4facfe', '#00f2fe'] },
  { name: 'Forest', colors: ['#38ef7d', '#11998e'] },
  { name: 'Fire', colors: ['#f12711', '#f5af19'] },
  { name: 'Purple Haze', colors: ['#7028e4', '#e5b2ca'] },
  { name: 'Cool Blues', colors: ['#2193b0', '#6dd5ed'] },
  { name: 'Midnight', colors: ['#232526', '#414345'] },
  { name: 'Rainbow', colors: ['#ff0000', '#ffaa00', '#00ff00', '#0066ff'] },
];

const faqItems = [
  { q: 'What CSS gradient types are supported?', a: 'We support linear gradients with any direction and radial gradients. You can create gradients with 2 to 4 color stops.' },
  { q: 'Can I use the generated CSS in any project?', a: 'Yes! The generated CSS uses standard syntax supported by all modern browsers. Simply copy and paste it into your stylesheet.' },
  { q: 'How do I add more colors?', a: 'Click "Add Color" to add up to 4 color stops. Click the × button next to a color to remove it (minimum 2 colors required).' },
  { q: 'Do I need vendor prefixes?', a: 'No. Modern browsers all support the standard gradient syntax without prefixes. The generated code works in Chrome, Firefox, Safari, and Edge.' },
  { q: 'Can I save my gradients?', a: 'Currently you can copy the CSS code. We recommend saving your favorite gradients in a CSS file or design system for reuse.' },
];

export default function CSSGradientGenerator() {
  const [colors, setColors] = useState(['#667eea', '#764ba2']);
  const [direction, setDirection] = useState('to right');

  const cssValue = direction === 'radial'
    ? `radial-gradient(circle, ${colors.join(', ')})`
    : `linear-gradient(${direction}, ${colors.join(', ')})`;

  const cssCode = `background: ${cssValue};`;

  const updateColor = (i: number, val: string) => {
    const next = [...colors];
    next[i] = val;
    setColors(next);
  };

  const addColor = () => { if (colors.length < 4) setColors([...colors, '#ffffff']); };
  const removeColor = (i: number) => { if (colors.length > 2) setColors(colors.filter((_, j) => j !== i)); };

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description={[
        'Create beautiful CSS gradients visually. Pick colors, choose a direction, and copy the CSS code for your website.',
        'Supports linear and radial gradients with up to 4 color stops. All processing happens in your browser.',
      ]}
      howTo={{
        steps: [
          'Choose colors using the color pickers (2–4 colors supported).',
          'Select a gradient direction — linear or radial.',
          'Preview the gradient live as you adjust settings.',
          'Try preset gradients for quick inspiration.',
          'Copy the generated CSS code with one click.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'CSS Gradient Generator', url: 'https://snaptools.dev/css-gradient-generator',
        description: 'Free online CSS gradient generator. Create linear and radial gradients visually.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Design Your Gradient</h2>

        {/* Preview */}
        <div className="rounded-2xl h-48 mb-6 border border-white/30 shadow-inner" style={{ background: cssValue }} />

        {/* Colors */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Colors</p>
          <div className="flex flex-wrap gap-3 items-center">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                <input type="color" value={c} onChange={e => updateColor(i, e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input type="text" value={c} onChange={e => updateColor(i, e.target.value)}
                  className="w-20 text-sm font-mono bg-transparent border-0 text-gray-700 focus:outline-none" />
                {colors.length > 2 && (
                  <button onClick={() => removeColor(i)} className="text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                )}
              </div>
            ))}
            {colors.length < 4 && (
              <Button variant="ghost" size="sm" onClick={addColor}>+ Add Color</Button>
            )}
          </div>
        </div>

        {/* Direction */}
        <div className="mb-5 w-64">
          <Select label="Direction" value={direction} onChange={e => setDirection(e.target.value)} options={DIRECTIONS} />
        </div>

        {/* Presets */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.name} onClick={() => { setColors([...p.colors]); }}
                className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white/40 text-gray-600 hover:bg-white/60 transition-all"
                title={p.name}>
                <span className="inline-block w-4 h-4 rounded-full mr-1.5 align-middle border border-white/40"
                  style={{ background: `linear-gradient(to right, ${p.colors.join(', ')})` }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="glass rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">CSS Code</p>
            <CopyButton text={cssCode} />
          </div>
          <pre className="text-sm font-mono text-gray-800 bg-white/30 rounded-lg p-3 overflow-x-auto">{cssCode}</pre>
        </div>
      </Card>
    </ToolLayout>
  );
}
