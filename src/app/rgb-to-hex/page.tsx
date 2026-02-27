'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input, Slider, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'How does RGB to HEX conversion work?', a: 'Each RGB channel (0–255) is converted to a two-digit hexadecimal value, then concatenated with a # prefix.' },
  { q: 'What is HSL?', a: 'HSL stands for Hue, Saturation, Lightness — an alternative color model that is often more intuitive for picking colors.' },
  { q: 'Can I enter a HEX code and get RGB?', a: 'Yes. Type a HEX color code in the HEX input field and the RGB sliders and HSL values will update automatically.' },
  { q: 'Does this work offline?', a: 'Yes. All conversions are done in your browser with no server calls. It works even without an internet connection.' },
  { q: 'Are shorthand HEX codes supported?', a: 'Yes. You can enter 3-digit shorthand like #F0A which will be expanded to #FF00AA.' },
];

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function RgbToHex() {
  const [r, setR] = useState(66);
  const [g, setG] = useState(133);
  const [b, setB] = useState(244);
  const [hexInput, setHexInput] = useState('');
  const [hexSynced, setHexSynced] = useState(true);

  const hex = rgbToHex(r, g, b);
  const [h, s, l] = rgbToHsl(r, g, b);
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;
  const rgbStr = `rgb(${r}, ${g}, ${b})`;

  useEffect(() => {
    if (hexSynced) setHexInput(hex);
  }, [hex, hexSynced]);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    setHexSynced(false);
    const rgb = hexToRgb(val);
    if (rgb) {
      setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
      setHexSynced(true);
    }
  };

  const handleSlider = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setHexSynced(true);
  };

  return (
    <ToolLayout
      title="RGB to HEX Converter"
      description={[
        'Convert colors between RGB, HEX, and HSL formats with a live color preview.',
        'Use the sliders or type values directly. Bidirectional — enter HEX to get RGB and HSL, or adjust RGB sliders to get HEX.',
      ]}
      howTo={{
        steps: [
          'Adjust the R, G, B sliders or type values (0–255) to set your color.',
          'Alternatively, type a HEX code (e.g., #4285F4) in the HEX field.',
          'View the live color preview and all format values (RGB, HEX, HSL).',
          'Click Copy next to any value to copy it to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'RGB to HEX Converter', url: 'https://snaptools.dev/rgb-to-hex',
        description: 'Free RGB to HEX color converter with HSL output and live preview.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Pick a Color</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <Slider label="Red" value={r} onChange={handleSlider(setR)} min={0} max={255} />
            <Slider label="Green" value={g} onChange={handleSlider(setG)} min={0} max={255} />
            <Slider label="Blue" value={b} onChange={handleSlider(setB)} min={0} max={255} />

            <div className="pt-2">
              <Input label="HEX" value={hexInput} onChange={e => handleHexChange(e.target.value)} placeholder="#4285F4" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-2xl border border-white/30 shadow-lg" style={{ backgroundColor: hex }} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { label: 'HEX', value: hex },
            { label: 'RGB', value: rgbStr },
            { label: 'HSL', value: hslStr },
          ].map(item => (
            <div key={item.label} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-gray-500">{item.label}</span>
                <div className="font-mono text-gray-900">{item.value}</div>
              </div>
              <CopyButton text={item.value} />
            </div>
          ))}
        </div>
      </Card>
    </ToolLayout>
  );
}
