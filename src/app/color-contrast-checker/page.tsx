'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'What is WCAG color contrast?', a: 'WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between text and background colors to ensure readability for people with visual impairments.' },
  { q: 'What contrast ratio do I need?', a: 'For WCAG AA compliance, normal text needs 4.5:1 and large text needs 3:1. For AAA (enhanced), normal text needs 7:1 and large text needs 4.5:1.' },
  { q: 'What counts as large text?', a: 'Large text is defined as 18pt (24px) or 14pt (18.67px) bold. Everything else is considered normal text.' },
  { q: 'How is contrast ratio calculated?', a: 'The contrast ratio is calculated using relative luminance values of the two colors, following the WCAG 2.0 formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color.' },
  { q: 'Is my data processed on a server?', a: 'No. All calculations happen entirely in your browser. No data is sent anywhere.' },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string) {
  const l1 = luminance(...hexToRgb(hex1));
  const l2 = luminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isValidHex(hex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function adjustColorForContrast(fg: string, bg: string, targetRatio: number): string {
  const bgLum = luminance(...hexToRgb(bg));
  // Try darkening or lightening the foreground
  const fgRgb = hexToRgb(fg);
  let best = fg;
  let bestDiff = Infinity;
  for (let i = 0; i <= 255; i += 1) {
    const factor = i / 255;
    // Try darker
    const dark: [number, number, number] = [Math.round(fgRgb[0] * (1 - factor)), Math.round(fgRgb[1] * (1 - factor)), Math.round(fgRgb[2] * (1 - factor))];
    const dLum = luminance(...dark);
    const dRatio = (Math.max(dLum, bgLum) + 0.05) / (Math.min(dLum, bgLum) + 0.05);
    if (dRatio >= targetRatio) {
      const diff = Math.abs(dRatio - targetRatio);
      if (diff < bestDiff) { bestDiff = diff; best = '#' + dark.map(c => c.toString(16).padStart(2, '0')).join(''); }
      break;
    }
    // Try lighter
    const light: [number, number, number] = [Math.min(255, Math.round(fgRgb[0] + (255 - fgRgb[0]) * factor)), Math.min(255, Math.round(fgRgb[1] + (255 - fgRgb[1]) * factor)), Math.min(255, Math.round(fgRgb[2] + (255 - fgRgb[2]) * factor))];
    const lLum = luminance(...light);
    const lRatio = (Math.max(lLum, bgLum) + 0.05) / (Math.min(lLum, bgLum) + 0.05);
    if (lRatio >= targetRatio) {
      const diff = Math.abs(lRatio - targetRatio);
      if (diff < bestDiff) { bestDiff = diff; best = '#' + light.map(c => c.toString(16).padStart(2, '0')).join(''); }
      break;
    }
  }
  return best;
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState('#1a1a2e');
  const [bg, setBg] = useState('#ffffff');

  const valid = isValidHex(fg) && isValidHex(bg);
  const ratio = valid ? contrastRatio(fg, bg) : 0;

  const checks = [
    { label: 'AA Normal Text', min: 4.5 },
    { label: 'AA Large Text', min: 3 },
    { label: 'AAA Normal Text', min: 7 },
    { label: 'AAA Large Text', min: 4.5 },
  ];

  const suggestion = useMemo(() => {
    if (!valid || ratio >= 4.5) return null;
    return adjustColorForContrast(fg, bg, 4.5);
  }, [fg, bg, valid, ratio]);

  return (
    <ToolLayout
      title="Color Contrast Checker"
      description={[
        'Check the contrast ratio between two colors for WCAG accessibility compliance. Ensure your text is readable for everyone.',
        'Instantly see if your color combination passes AA and AAA standards for normal and large text.',
      ]}
      howTo={{
        steps: [
          'Enter or pick a foreground (text) color using the color picker or hex input.',
          'Enter or pick a background color.',
          'View the contrast ratio and WCAG pass/fail results instantly.',
          'Use the swap button to reverse foreground and background colors.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Color Contrast Checker', url: 'https://snaptools.dev/color-contrast-checker',
        description: 'Check WCAG color contrast ratios for accessibility compliance. Free online tool.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Check Contrast</h2>

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foreground</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
              <Input value={fg} onChange={e => setFg(e.target.value)} className="w-28 font-mono" />
            </div>
          </div>
          <Button variant="ghost" onClick={() => { setFg(bg); setBg(fg); }} className="mb-1">⇄ Swap</Button>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
              <Input value={bg} onChange={e => setBg(e.target.value)} className="w-28 font-mono" />
            </div>
          </div>
        </div>

        {valid && (
          <>
            <div className="glass rounded-2xl p-6 mb-4" style={{ backgroundColor: bg, color: fg }}>
              <p className="text-2xl font-bold mb-1">Sample Text (Large)</p>
              <p className="text-base">This is how normal text looks with these colors. Check readability.</p>
            </div>

            <div className="text-center mb-4">
              <span className="text-4xl font-bold text-gray-900">{ratio.toFixed(2)}:1</span>
              <p className="text-sm text-gray-500">Contrast Ratio</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {checks.map(c => {
                const pass = ratio >= c.min;
                return (
                  <div key={c.label} className={`rounded-xl p-3 text-center ${pass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="text-lg font-bold">{pass ? '✅ Pass' : '❌ Fail'}</div>
                    <div className="text-xs mt-1">{c.label}</div>
                    <div className="text-xs opacity-70">≥{c.min}:1</div>
                  </div>
                );
              })}
            </div>

            {suggestion && suggestion !== fg && (
              <div className="glass rounded-2xl p-4">
                <p className="text-sm text-gray-700 mb-2">💡 Suggested accessible foreground color:</p>
                <button onClick={() => setFg(suggestion)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <span className="w-6 h-6 rounded" style={{ backgroundColor: suggestion }} />
                  <span className="font-mono text-sm">{suggestion}</span>
                  <span className="text-xs text-primary-600">Click to apply</span>
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
