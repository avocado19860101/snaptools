'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What color formats are supported?', a: 'The tool supports HEX, RGB, and HSL color formats with instant conversion between all three.' },
  { q: 'Can I copy color values?', a: 'Yes! Click the copy button next to any color value to copy it to your clipboard instantly.' },
  { q: 'What is HSL?', a: 'HSL stands for Hue, Saturation, Lightness. It is a more intuitive way to describe colors compared to RGB.' },
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
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Load recent colors on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snaptools-color-recent');
      if (saved) setRecentColors(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save color on change (debounced by only saving distinct colors)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecentColors(prev => {
        const filtered = prev.filter(c => c !== hex);
        const updated = [hex, ...filtered].slice(0, 20);
        localStorage.setItem('snaptools-color-recent', JSON.stringify(updated));
        return updated;
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [hex]);

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const values = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  return (
    <ToolLayout
      title="Color Picker & Converter"
      description={[
        'Pick any color and instantly get its HEX, RGB, and HSL values. Essential for web designers and developers.',
        'Use the color picker to select your desired color, then copy any value to your clipboard.',
      ]}
      howTo={{
        steps: [
          'Click the color picker square to choose your desired color.',
          'View the color preview and all format values (HEX, RGB, HSL).',
          'Click the copy button next to any value to copy it.',
          'Paste the value directly into your CSS or design tool.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Color Picker & Converter', url: 'https://snaptools.dev/color-picker',
        description: 'Free online color picker with HEX, RGB, and HSL conversion.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Pick a Color</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div>
            <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-32 h-32 rounded-2xl cursor-pointer border-0 shadow-md" />
          </div>
          <div className="flex-1 space-y-3 w-full">
            <div className="w-full h-20 rounded-xl shadow-inner" style={{ backgroundColor: hex }} />
            {values.map(v => (
              <div key={v.label} className="glass-subtle rounded-xl p-3 flex justify-between items-center">
                <span>
                  <span className="text-sm text-gray-400 mr-2">{v.label}:</span>
                  <span className="font-mono font-medium text-gray-900">{v.value}</span>
                </span>
                <CopyButton text={v.value} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Colors */}
        {recentColors.length > 1 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Recent Colors</p>
            <div className="flex flex-wrap gap-2">
              {recentColors.map((c, i) => (
                <button key={i} onClick={() => setHex(c)}
                  className="w-8 h-8 rounded-lg border border-white/40 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
