'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is the difference between screen and viewport resolution?', a: 'Screen resolution is your monitor\'s total pixel count. Viewport is the browser\'s visible content area, which is smaller due to toolbars and window borders.' },
  { q: 'What is device pixel ratio?', a: 'Device pixel ratio (DPR) is the ratio between physical pixels and CSS pixels. A DPR of 2 means each CSS pixel is rendered using 2×2 physical pixels (common on Retina displays).' },
  { q: 'Does the display update in real-time?', a: 'Yes. The viewport dimensions update automatically when you resize your browser window or rotate your device.' },
  { q: 'Why does my resolution look different from my monitor specs?', a: 'Display scaling settings (e.g., 150% on Windows) affect the reported CSS resolution. The physical pixel count is screen resolution × device pixel ratio.' },
  { q: 'Is any data collected?', a: 'No. All information is read from your browser\'s APIs locally. Nothing is sent to any server.' },
];

export default function ScreenResolution() {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edg')) browser = 'Edge';
      else if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Safari')) browser = 'Safari';

      setInfo({
        'Screen Resolution': `${screen.width} × ${screen.height}`,
        'Viewport Size': `${window.innerWidth} × ${window.innerHeight}`,
        'Device Pixel Ratio': `${window.devicePixelRatio}x`,
        'Color Depth': `${screen.colorDepth}-bit`,
        'Orientation': screen.orientation?.type?.replace(/-.*/, '') || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'),
        'Touch Support': 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : 'No',
        'Browser': browser,
        'Platform': navigator.platform,
        'Language': navigator.language,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const allText = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join('\n');

  return (
    <ToolLayout
      title="Screen Resolution Checker"
      description={[
        'Instantly check your screen resolution, viewport size, device pixel ratio, and more.',
        'All information is detected from your browser in real-time. Values update automatically when you resize your window.',
      ]}
      howTo={{ steps: [
        'Open this page to see your screen information instantly.',
        'Resize your browser window to see viewport values update live.',
        'Check device pixel ratio for Retina/HiDPI display detection.',
        'Click "Copy All Info" to copy all details to your clipboard.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Screen Resolution Checker', url: 'https://snaptools.dev/screen-resolution',
        description: 'Free screen resolution checker. Detect viewport, DPR, color depth, and more.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Your Screen Information</h2>
        <div className="space-y-3">
          {Object.entries(info).map(([label, value]) => (
            <div key={label} className="flex justify-between glass rounded-xl px-4 py-3">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="text-gray-900 font-medium text-sm">{value}</span>
            </div>
          ))}
        </div>
        {Object.keys(info).length > 0 && (
          <div className="mt-4 flex justify-end">
            <CopyButton text={allText} label="Copy All Info" />
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
