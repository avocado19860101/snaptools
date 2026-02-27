'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'How does the compression work?', a: 'The tool uses the Canvas API to re-encode your image as JPEG with varying quality levels. A binary search algorithm finds the quality that gets closest to your target file size.' },
  { q: 'Is my image uploaded to a server?', a: 'No. All compression happens entirely in your browser. Your image never leaves your device.' },
  { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, WebP, GIF, and BMP images. The output is always JPEG since JPEG supports quality adjustment.' },
  { q: 'Can I compress below 20KB?', a: 'Yes, with the custom size option. However, very small target sizes will result in significant quality loss.' },
  { q: 'Why is the output slightly different from my target size?', a: 'JPEG compression doesn\'t allow exact byte-level control. The tool gets as close as possible to your target using binary search on the quality parameter.' },
];

const presets = [
  { value: '20', label: '20 KB' },
  { value: '50', label: '50 KB' },
  { value: '100', label: '100 KB' },
  { value: '200', label: '200 KB' },
  { value: '500', label: '500 KB' },
  { value: '1024', label: '1 MB' },
  { value: 'custom', label: 'Custom' },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressImageToSize() {
  const [image, setImage] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [preset, setPreset] = useState('100');
  const [customKB, setCustomKB] = useState('');
  const [result, setResult] = useState<{ url: string; size: number; quality: number } | null>(null);
  const [compressing, setCompressing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const targetKB = preset === 'custom' ? Number(customKB) || 0 : Number(preset);
  const targetBytes = targetKB * 1024;

  const handleFile = (file: File) => {
    setOrigSize(file.size);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const compress = async () => {
    if (!imgRef.current || !targetBytes) return;
    setCompressing(true);
    setResult(null);

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    let lo = 0, hi = 1, bestBlob: Blob | null = null, bestQ = 0;

    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', mid));
      if (!blob) break;

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        bestQ = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }

    // If even quality=0 is too large, use the lowest possible
    if (!bestBlob) {
      bestBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.01));
      bestQ = 0.01;
    }

    if (bestBlob) {
      setResult({ url: URL.createObjectURL(bestBlob), size: bestBlob.size, quality: Math.round(bestQ * 100) });
    }
    setCompressing(false);
  };

  return (
    <ToolLayout
      title="Compress Image to Size"
      description={[
        'Compress any image to a specific file size target. Choose from presets (20KB–1MB) or enter a custom size.',
        'Uses binary search on JPEG quality to hit your target as closely as possible. Entirely client-side — your images never leave your device.',
      ]}
      howTo={{
        steps: [
          'Upload an image by dropping it or clicking the upload area.',
          'Select a target file size from the presets or enter a custom value in KB.',
          'Click "Compress" to start. The tool automatically adjusts quality to match your target.',
          'Preview the compressed result and compare sizes. Click "Download" to save.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Compress Image to Size', url: 'https://snaptools.dev/compress-image-to-size',
        description: 'Free online image compressor. Compress images to a specific file size target entirely in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Compress</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, WebP, GIF, BMP" />
        )}

        {image && (
          <>
            <div className="text-sm text-gray-500 mb-4">Original size: {formatSize(origSize)}</div>

            <div className="flex flex-wrap gap-4 items-end mb-5">
              <div className="w-44">
                <Select label="Target Size" options={presets} value={preset} onChange={e => setPreset(e.target.value)} />
              </div>
              {preset === 'custom' && (
                <div className="w-32">
                  <Input label="Size (KB)" type="number" value={customKB} onChange={e => setCustomKB(e.target.value)} placeholder="e.g. 150" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={compress} size="lg" disabled={compressing || !targetBytes}>
                {compressing ? 'Compressing...' : 'Compress'}
              </Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); setResult(null); }}>Change Image</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span>Original: <strong>{formatSize(origSize)}</strong></span>
              <span>Compressed: <strong>{formatSize(result.size)}</strong></span>
              <span>Quality: <strong>{result.quality}%</strong></span>
              <span>Reduction: <strong>{Math.round((1 - result.size / origSize) * 100)}%</strong></span>
            </div>
            <img src={result.url} alt="Compressed" className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />
            <a href={result.url} download="compressed-image.jpg">
              <Button variant="success" size="lg">Download Compressed Image</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
