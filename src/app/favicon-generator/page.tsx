'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, FileDropzone } from '@/components/ui';

const SIZES = [16, 32, 48, 64, 128, 256];

const faqItems = [
  { q: 'What image formats can I upload?', a: 'You can upload any image format supported by your browser, including PNG, JPG, GIF, WebP, and SVG. PNG with transparency is recommended for best results.' },
  { q: 'Is my image uploaded to a server?', a: 'No. All favicon generation happens entirely in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'What sizes are generated?', a: 'We generate favicons in 6 common sizes: 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256 pixels.' },
  { q: 'Can I generate an .ico file?', a: 'Currently we generate PNG favicons which are widely supported by modern browsers. For .ico files, you can use the 16×16 and 32×32 PNGs with an external converter.' },
  { q: 'What\'s the best source image size?', a: 'Use a square image of at least 256×256 pixels for the best quality across all sizes. Non-square images will be scaled to fit.' },
];

export default function FaviconGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<{ size: number; url: string }[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImage(src);
      setFavicons([]);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const generate = () => {
    if (!imgRef.current) return;
    const results = SIZES.map(size => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imgRef.current!, 0, 0, size, size);
      return { size, url: canvas.toDataURL('image/png') };
    });
    setFavicons(results);
  };

  const downloadAll = () => {
    favicons.forEach(({ size, url }) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `favicon-${size}x${size}.png`;
      a.click();
    });
  };

  return (
    <ToolLayout
      title="Favicon Generator"
      description={[
        'Generate favicons in multiple sizes from any image. Upload your logo or icon and get perfectly sized favicons for your website.',
        'All processing happens in your browser using the Canvas API. Your images are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Upload a square image (PNG recommended) — at least 256×256 for best quality.',
          'Click "Generate Favicons" to create all standard favicon sizes.',
          'Preview each size to ensure they look good at small dimensions.',
          'Download individual sizes or click "Download All" to get them all at once.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Favicon Generator', url: 'https://snaptools.dev/favicon-generator',
        description: 'Free online favicon generator. Create favicons in all sizes from any image.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Generate</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports PNG, JPG, GIF, WebP, SVG" />
        )}

        {image && (
          <>
            <div className="flex items-center gap-4 mb-5">
              <img src={image} alt="Source" className="w-16 h-16 rounded-xl border border-white/30 object-cover" />
              <div>
                <p className="text-sm text-gray-500">Source image loaded</p>
                <button onClick={() => { setImage(null); setFavicons([]); }} className="text-sm text-primary-600 hover:underline">Change image</button>
              </div>
            </div>
            <Button onClick={generate} size="lg">Generate Favicons</Button>
          </>
        )}

        {favicons.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">Generated {favicons.length} sizes</p>
              <Button variant="success" onClick={downloadAll}>Download All</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {favicons.map(({ size, url }) => (
                <div key={size} className="glass rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center h-20 mb-2">
                    <img src={url} alt={`${size}x${size}`} width={size > 64 ? 64 : size} height={size > 64 ? 64 : size} className="image-rendering-pixelated" />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{size}×{size}</p>
                  <a href={url} download={`favicon-${size}x${size}.png`}>
                    <Button variant="ghost" size="sm">Download</Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
