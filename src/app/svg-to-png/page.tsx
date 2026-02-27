'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'What SVG features are supported?', a: 'All standard SVG features are supported as the conversion uses your browser\'s native SVG renderer.' },
  { q: 'Is my SVG sent to a server?', a: 'No. The conversion happens entirely in your browser using the Canvas API. Your files never leave your device.' },
  { q: 'What scale options are available?', a: 'You can export at 1x, 2x, 3x, or 4x scale for high-DPI displays and print-quality output.' },
  { q: 'Can I set a custom background color?', a: 'Yes. Choose between transparent background or set any custom color using the color picker.' },
  { q: 'Is there a size limit for SVGs?', a: 'There is no strict limit, but very complex SVGs with many elements may take longer to render.' },
];

const scaleOptions = [
  { value: '1', label: '1x' },
  { value: '2', label: '2x' },
  { value: '3', label: '3x' },
  { value: '4', label: '4x' },
];

export default function SvgToPng() {
  const [svgCode, setSvgCode] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [scale, setScale] = useState('1');
  const [bgType, setBgType] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setSvgCode(text);
      setResult(null);
      // try to extract dimensions
      const match = text.match(/viewBox="[^"]*\s(\d+(?:\.\d+)?)\s(\d+(?:\.\d+)?)"/);
      if (match) { setWidth(Math.round(+match[1])); setHeight(Math.round(+match[2])); }
      const wm = text.match(/width="(\d+)/);
      const hm = text.match(/height="(\d+)/);
      if (wm) setWidth(+wm[1]);
      if (hm) setHeight(+hm[1]);
    };
    reader.readAsText(file);
  };

  const convert = () => {
    const s = +scale;
    const canvas = document.createElement('canvas');
    canvas.width = width * s;
    canvas.height = height * s;
    const ctx = canvas.getContext('2d')!;
    if (bgType !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      setResult(canvas.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); alert('Failed to render SVG. Check your SVG code.'); };
    img.src = url;
  };

  return (
    <ToolLayout
      title="SVG to PNG Converter"
      description={[
        'Convert SVG files to PNG images with custom dimensions and scale. Upload an SVG or paste SVG code directly.',
        'Supports transparent and custom backgrounds. Export at up to 4x scale for high-quality output.',
      ]}
      howTo={{ steps: [
        'Upload an SVG file or paste SVG code in the text area.',
        'Set custom width and height, and choose a scale (1x–4x).',
        'Select transparent or custom background color.',
        'Click "Convert to PNG" and download the result.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'SVG to PNG Converter', url: 'https://snaptools.dev/svg-to-png',
        description: 'Convert SVG to PNG with custom dimensions and scale. Free online converter.',
        applicationCategory: 'DesignApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">SVG to PNG</h2>

        {!svgCode && (
          <FileDropzone accept=".svg,image/svg+xml" onFile={handleFile} label="Drop your SVG file here" sublabel="Or paste SVG code below" />
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">SVG Code</label>
          <textarea
            value={svgCode}
            onChange={e => { setSvgCode(e.target.value); setResult(null); }}
            className="w-full glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[120px] font-mono text-sm"
            placeholder="<svg>...</svg>"
          />
        </div>

        {svgCode && (
          <>
            <div className="flex flex-wrap gap-4 mt-4 items-end">
              <div className="w-28"><Input label="Width" type="number" value={width} onChange={e => setWidth(+e.target.value)} /></div>
              <div className="w-28"><Input label="Height" type="number" value={height} onChange={e => setHeight(+e.target.value)} /></div>
              <div className="w-24"><Select label="Scale" value={scale} onChange={e => setScale(e.target.value)} options={scaleOptions} /></div>
              <div className="flex items-end gap-2 pb-0.5">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={bgType === 'transparent'} onChange={e => setBgType(e.target.checked ? 'transparent' : 'color')} className="rounded" /> Transparent
                </label>
                {bgType !== 'transparent' && (
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={convert} size="lg">Convert to PNG</Button>
              <Button variant="ghost" size="lg" onClick={() => { setSvgCode(''); setResult(null); }}>Clear</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <p className="text-sm text-gray-500 mb-3">{width * +scale} × {height * +scale}px</p>
            <div className="p-4 rounded-xl" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '16px 16px', backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px' }}>
              <img src={result} alt="Converted PNG" className="max-w-full" />
            </div>
            <a href={result} download="converted.png" className="inline-block mt-4">
              <Button variant="success" size="lg">Download PNG</Button>
            </a>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </Card>
    </ToolLayout>
  );
}
