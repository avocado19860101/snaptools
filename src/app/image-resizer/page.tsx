'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. All resizing happens directly in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, GIF, WebP, and BMP images. The output will be in PNG or JPG format.' },
  { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large images (over 50MB) may be slow to process depending on your device.' },
  { q: 'Will resizing reduce image quality?', a: 'Resizing to smaller dimensions generally preserves quality. Enlarging images may result in some quality loss as new pixels are interpolated.' },
  { q: 'Can I resize multiple images at once?', a: 'Currently, you can resize one image at a time. We may add batch processing in a future update.' },
];

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImage(src);
      setResult(null);
      const img = new Image();
      img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(img.width); setHeight(img.height); imgRef.current = img; };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const updateWidth = (w: number) => {
    setWidth(w);
    if (lock && origW) setHeight(Math.round((w / origW) * origH));
  };
  const updateHeight = (h: number) => {
    setHeight(h);
    if (lock && origH) setWidth(Math.round((h / origH) * origW));
  };

  const resize = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0, width, height);
    setResult(canvas.toDataURL('image/png'));
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description={[
        'Resize any image to your desired dimensions instantly and for free. Simply upload your image, set the width and height, and download the resized version.',
        'Our image resizer works entirely in your browser using the HTML5 Canvas API. Your images are never uploaded to any server, ensuring complete privacy and lightning-fast processing.',
      ]}
      howTo={{
        steps: [
          'Drop your image or click to upload (JPG, PNG, GIF, WebP, or BMP).',
          'Enter your desired width and height in pixels. Toggle "Lock aspect ratio" to maintain proportions.',
          'Click "Resize Image" to process your image instantly in your browser.',
          'Preview the result and click "Download Resized Image" to save it.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Resizer', url: 'https://snaptools.dev/image-resizer',
        description: 'Free online image resizer. Resize images to any dimension instantly in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Resize</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, GIF, WebP, BMP" />
        )}

        {image && (
          <>
            <div className="mb-4 text-sm text-gray-500">Original: {origW} × {origH}px</div>
            <div className="flex flex-wrap gap-4 items-end mb-5">
              <div className="w-32">
                <Input label="Width (px)" type="number" value={width} onChange={e => updateWidth(+e.target.value)} />
              </div>
              <div className="w-32">
                <Input label="Height (px)" type="number" value={height} onChange={e => updateHeight(+e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
                <input type="checkbox" checked={lock} onChange={e => setLock(e.target.checked)} className="rounded" /> Lock aspect ratio
              </label>
            </div>
            <div className="flex gap-3">
              <Button onClick={resize} size="lg">Resize Image</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); setResult(null); }}>Change Image</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <p className="text-sm text-gray-500 mb-3">Resized to {width} × {height}px</p>
            <img src={result} alt="Resized" className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />
            <a href={result} download="resized-image.png">
              <Button variant="success" size="lg">Download Resized Image</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
