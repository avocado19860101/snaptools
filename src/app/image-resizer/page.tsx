'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Image Resizer</h1>
      <p className="text-gray-600 mb-2">Resize any image to your desired dimensions instantly and for free. Simply upload your image, set the width and height, and download the resized version. Perfect for social media posts, profile pictures, website images, or email attachments.</p>
      <p className="text-gray-600 mb-8">Our image resizer works entirely in your browser using the HTML5 Canvas API. Your images are never uploaded to any server, ensuring complete privacy and lightning-fast processing.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload & Resize</h2>
        <input type="file" accept="image/*" onChange={handleFile} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100" />
        {image && (
          <>
            <div className="mb-4 text-sm text-gray-500">Original: {origW} × {origH}px</div>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                <input type="number" value={width} onChange={e => updateWidth(+e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-32" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                <input type="number" value={height} onChange={e => updateHeight(+e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-32" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={lock} onChange={e => setLock(e.target.checked)} className="rounded" /> Lock aspect ratio
              </label>
            </div>
            <button onClick={resize} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">Resize Image</button>
          </>
        )}
        {result && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Resized to {width} × {height}px</p>
            <img src={result} alt="Resized" className="max-w-full rounded border mb-4" />
            <a href={result} download="resized-image.png" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">Download Resized Image</a>
          </div>
        )}
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Image Resizer</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Click &quot;Choose File&quot; to upload your image (JPG, PNG, GIF, WebP, or BMP).</li>
          <li>Enter your desired width and height in pixels. Toggle &quot;Lock aspect ratio&quot; to maintain proportions.</li>
          <li>Click &quot;Resize Image&quot; to process your image instantly in your browser.</li>
          <li>Preview the result and click &quot;Download Resized Image&quot; to save it.</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Resizer', url: 'https://snaptools.dev/image-resizer',
        description: 'Free online image resizer. Resize images to any dimension instantly in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      })}} />
    </div>
  );
}
