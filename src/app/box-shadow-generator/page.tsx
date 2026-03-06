'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

interface Shadow { x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean; }

const defaultShadow = (): Shadow => ({ x: 4, y: 4, blur: 10, spread: 0, color: '#000000', opacity: 25, inset: false });

const presets: { name: string; shadows: Shadow[] }[] = [
  { name: 'Subtle', shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false }] },
  { name: 'Medium', shadows: [{ x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 20, inset: false }] },
  { name: 'Large', shadows: [{ x: 0, y: 10, blur: 30, spread: -5, color: '#000000', opacity: 25, inset: false }] },
  { name: 'Sharp', shadows: [{ x: 5, y: 5, blur: 0, spread: 0, color: '#000000', opacity: 30, inset: false }] },
  { name: 'Inset', shadows: [{ x: 0, y: 2, blur: 8, spread: 0, color: '#000000', opacity: 20, inset: true }] },
  { name: 'Layered', shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false }, { x: 0, y: 8, blur: 24, spread: 0, color: '#000000', opacity: 15, inset: false }] },
];

const faqItems = [
  { q: 'What is a CSS box shadow?', a: 'Box shadow adds shadow effects around an element\'s frame. You can set multiple shadows with different offsets, blur, spread, and colors.' },
  { q: 'Can I add multiple shadow layers?', a: 'Yes! Click "Add Layer" to add multiple shadows. Each layer has independent controls. CSS supports unlimited layers.' },
  { q: 'What does the inset option do?', a: 'The inset keyword makes the shadow appear inside the element instead of outside, creating an inner shadow effect.' },
  { q: 'How do I use the generated CSS?', a: 'Copy the generated box-shadow CSS value and paste it into your stylesheet or inline styles.' },
  { q: 'Are the presets customizable?', a: 'Yes! Select a preset to start, then adjust any slider to customize it to your needs.' },
];

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function shadowToCSS(s: Shadow): string {
  return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`;
}

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([defaultShadow()]);

  const update = (idx: number, key: keyof Shadow, val: number | string | boolean) => {
    setShadows(s => s.map((sh, i) => i === idx ? { ...sh, [key]: val } : sh));
  };
  const remove = (idx: number) => setShadows(s => s.filter((_, i) => i !== idx));
  const cssValue = shadows.map(shadowToCSS).join(', ');
  const cssCode = `box-shadow: ${cssValue};`;

  return (
    <ToolLayout
      title="Box Shadow Generator"
      description={[
        'Create custom CSS box shadows visually with sliders. Add multiple layers, adjust colors, and copy the CSS.',
        'Real-time preview with controls for offset, blur, spread, color, opacity, and inset. Start from presets or build from scratch.',
      ]}
      howTo={{ steps: [
        'Adjust the sliders for X/Y offset, blur radius, spread, color, and opacity.',
        'Toggle "Inset" for inner shadows. Add more layers with "Add Layer".',
        'Use a preset as a starting point and customize from there.',
        'Copy the generated CSS code and use it in your project.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Box Shadow Generator', url: 'https://snaptools.dev/box-shadow-generator',
        description: 'Free CSS box shadow generator with live preview, multiple layers, and presets.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Preview</h2>
        <div className="flex justify-center p-12 glass rounded-2xl mb-6">
          <div className="w-48 h-48 bg-white rounded-2xl" style={{ boxShadow: cssValue }} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {presets.map(p => (
            <Button key={p.name} variant="ghost" size="sm" onClick={() => setShadows(p.shadows.map(s => ({ ...s })))}>
              {p.name}
            </Button>
          ))}
        </div>

        {shadows.map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Layer {i + 1}</span>
              {shadows.length > 1 && <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">×</button>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {([['x', 'X Offset', -50, 50], ['y', 'Y Offset', -50, 50], ['blur', 'Blur', 0, 100], ['spread', 'Spread', -50, 50]] as const).map(([key, label, min, max]) => (
                <label key={key} className="block text-xs text-gray-500">
                  {label}: {s[key]}px
                  <input type="range" min={min} max={max} value={s[key]} onChange={e => update(i, key, +e.target.value)} className="w-full mt-1 accent-primary-500" />
                </label>
              ))}
              <label className="block text-xs text-gray-500">
                Opacity: {s.opacity}%
                <input type="range" min={0} max={100} value={s.opacity} onChange={e => update(i, 'opacity', +e.target.value)} className="w-full mt-1 accent-primary-500" />
              </label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Color</label>
                <input type="color" value={s.color} onChange={e => update(i, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <label className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                  <input type="checkbox" checked={s.inset} onChange={e => update(i, 'inset', e.target.checked)} className="rounded" /> Inset
                </label>
              </div>
            </div>
          </div>
        ))}

        <Button variant="ghost" onClick={() => setShadows(s => [...s, defaultShadow()])}>+ Add Layer</Button>
      </Card>

      <Card padding="lg" className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-900">CSS Code</h2>
          <CopyButton text={cssCode} label="Copy CSS" />
        </div>
        <pre className="p-4 rounded-xl glass font-mono text-sm text-gray-700 overflow-x-auto">{cssCode}</pre>
      </Card>
    </ToolLayout>
  );
}
