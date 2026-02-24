'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

const faqItems = [
  { q: 'What color formats are supported?', a: 'The tool supports HEX, RGB, and HSL color formats with instant conversion between all three.' },
  { q: 'Can I copy color values?', a: 'Yes! Click any color value to copy it to your clipboard instantly.' },
  { q: 'What is HSL?', a: 'HSL stands for Hue, Saturation, Lightness. It is a more intuitive way to describe colors compared to RGB, and is widely used in CSS.' },
  { q: 'Can I use these colors in my website?', a: 'Absolutely. All formats (HEX, RGB, HSL) are valid CSS color values you can use directly in your code.' },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#3B82F6');
  const [copied, setCopied] = useState('');
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const values = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Color Picker & Converter</h1>
      <p className="text-gray-600 mb-2">Pick any color and instantly get its HEX, RGB, and HSL values. Essential for web designers, developers, and anyone working with digital colors. No more manual conversions — just pick and copy.</p>
      <p className="text-gray-600 mb-8">Use the color picker to select your desired color, then click any value to copy it to your clipboard. All conversion happens instantly in your browser.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pick a Color</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div>
            <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-32 h-32 rounded-lg cursor-pointer border-0" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="w-full h-20 rounded-lg border" style={{ backgroundColor: hex }} />
            {values.map(v => (
              <button key={v.label} onClick={() => copy(v.value, v.label)} className="w-full text-left bg-gray-50 hover:bg-blue-50 rounded-lg p-3 flex justify-between items-center transition-colors">
                <span><span className="text-sm text-gray-500 mr-2">{v.label}:</span><span className="font-mono font-medium">{v.value}</span></span>
                <span className="text-sm text-gray-400">{copied === v.label ? '✓ Copied!' : 'Click to copy'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Color Picker</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Click the color picker square to choose your desired color.</li>
          <li>View the color preview and all format values (HEX, RGB, HSL).</li>
          <li>Click any value row to copy it to your clipboard.</li>
          <li>Paste the value directly into your CSS, design tool, or application.</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Color Picker & Converter', url: 'https://snaptools.dev/color-picker',
        description: 'Free online color picker with HEX, RGB, and HSL conversion.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}} />
    </div>
  );
}
