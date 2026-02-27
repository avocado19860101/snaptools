'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. Color extraction happens entirely in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'How are dominant colors extracted?', a: 'We use a median-cut color quantization algorithm on the image pixel data to find the most dominant colors.' },
  { q: 'Can I generate random palettes without an image?', a: 'Yes. Use the random palette generator to create complementary, analogous, or triadic color palettes.' },
  { q: 'Can I export the palette?', a: 'Yes. Click "Export as PNG" to download a PNG image of your color palette.' },
  { q: 'How many colors are extracted?', a: 'The tool extracts 6 dominant colors from the image by default.' },
];

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/* Median cut quantization */
function extractColors(imageData: ImageData, count: number): [number, number, number][] {
  const pixels: [number, number, number][] = [];
  const d = imageData.data;
  // Sample every 4th pixel for performance
  for (let i = 0; i < d.length; i += 16) {
    if (d[i + 3] > 128) pixels.push([d[i], d[i + 1], d[i + 2]]);
  }
  if (pixels.length === 0) return [[0, 0, 0]];

  type Box = [number, number, number][];
  const boxes: Box[] = [pixels];

  while (boxes.length < count) {
    // Find box with largest range
    let maxRange = -1, maxIdx = 0;
    boxes.forEach((box, idx) => {
      for (let ch = 0; ch < 3; ch++) {
        const vals = box.map(p => p[ch]);
        const range = Math.max(...vals) - Math.min(...vals);
        if (range > maxRange) { maxRange = range; maxIdx = idx; }
      }
    });

    const box = boxes[maxIdx];
    // Find channel with largest range
    let bestCh = 0, bestRange = 0;
    for (let ch = 0; ch < 3; ch++) {
      const vals = box.map(p => p[ch]);
      const range = Math.max(...vals) - Math.min(...vals);
      if (range > bestRange) { bestRange = range; bestCh = ch; }
    }
    box.sort((a, b) => a[bestCh] - b[bestCh]);
    const mid = Math.floor(box.length / 2);
    boxes.splice(maxIdx, 1, box.slice(0, mid), box.slice(mid));
  }

  return boxes.map(box => {
    const avg: [number, number, number] = [0, 0, 0];
    box.forEach(p => { avg[0] += p[0]; avg[1] += p[1]; avg[2] += p[2]; });
    return [Math.round(avg[0] / box.length), Math.round(avg[1] / box.length), Math.round(avg[2] / box.length)];
  });
}

function generateHarmony(type: 'complementary' | 'analogous' | 'triadic'): [number, number, number][] {
  const baseH = Math.random() * 360;
  const s = 60 + Math.random() * 30;
  const l = 40 + Math.random() * 20;
  let hues: number[];
  if (type === 'complementary') hues = [baseH, baseH + 180, baseH + 30, baseH + 210, baseH + 60, baseH + 240];
  else if (type === 'analogous') hues = [baseH - 30, baseH - 15, baseH, baseH + 15, baseH + 30, baseH + 45];
  else hues = [baseH, baseH + 120, baseH + 240, baseH + 60, baseH + 180, baseH + 300];
  return hues.map(h => hslToRgb(((h % 360) + 360) % 360, s, l));
}

type Color = [number, number, number];

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState<Color[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const canvasExportRef = useRef<HTMLCanvasElement | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const scale = Math.min(1, 200 / Math.max(img.width, img.height));
        c.width = img.width * scale;
        c.height = img.height * scale;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const data = ctx.getImageData(0, 0, c.width, c.height);
        setColors(extractColors(data, 6));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const randomPalette = (type: 'complementary' | 'analogous' | 'triadic') => {
    setImage(null);
    setColors(generateHarmony(type));
  };

  const exportPng = () => {
    if (colors.length === 0) return;
    const w = 600, h = 120;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d')!;
    const sw = w / colors.length;
    colors.forEach(([r, g, b], i) => {
      ctx.fillStyle = rgbToHex(r, g, b);
      ctx.fillRect(i * sw, 0, sw, h);
    });
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = 'color-palette.png';
    a.click();
  };

  return (
    <ToolLayout
      title="Color Palette Generator"
      description={[
        'Extract dominant colors from images or generate harmonious color palettes. Get HEX and RGB values instantly.',
        'Uses median-cut quantization for image analysis and color theory for palette generation. All client-side.',
      ]}
      howTo={{
        steps: [
          'Upload an image to extract its dominant colors, or use the random palette buttons.',
          'View color swatches with HEX and RGB values.',
          'Click the copy button to copy any color value.',
          'Export the palette as a PNG image.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Color Palette Generator', url: 'https://snaptools.dev/color-palette-generator',
        description: 'Free online color palette generator. Extract colors from images or generate harmonious palettes.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Extract from Image</h2>
        <FileDropzone accept="image/*" onFile={handleFile} label="Drop an image to extract colors" sublabel="Supports JPG, PNG, GIF, WebP" />
      </Card>

      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Random Palettes</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => randomPalette('complementary')}>Complementary</Button>
          <Button onClick={() => randomPalette('analogous')}>Analogous</Button>
          <Button onClick={() => randomPalette('triadic')}>Triadic</Button>
        </div>
      </Card>

      {colors.length > 0 && (
        <Card padding="lg" className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {colors.map(([r, g, b], i) => {
              const hex = rgbToHex(r, g, b);
              return (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="h-24 rounded-t-2xl" style={{ backgroundColor: hex }} />
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-medium text-gray-900">{hex.toUpperCase()}</span>
                      <CopyButton text={hex.toUpperCase()} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">rgb({r}, {g}, {b})</span>
                      <CopyButton text={`rgb(${r}, ${g}, ${b})`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button onClick={exportPng} variant="success" size="lg">Export as PNG</Button>
        </Card>
      )}
      <canvas ref={canvasExportRef} className="hidden" />
    </ToolLayout>
  );
}
