'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Slider, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'How does image compression work?', a: 'The tool uses the HTML5 Canvas API to re-encode your image at a lower quality setting, reducing file size while preserving visual quality.' },
  { q: 'Will I lose image quality?', a: 'At quality levels above 70%, the difference is barely noticeable. Lower quality settings will reduce file size more but may introduce visible artifacts.' },
  { q: 'Is my image uploaded to a server?', a: 'No. All compression happens locally in your browser. Your images stay on your device.' },
  { q: 'What formats can I compress?', a: 'You can upload JPG, PNG, WebP, GIF, and BMP images. The output is in JPEG format for optimal compression.' },
];

export default function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  const compress = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = imgRef.current.width;
    canvas.height = imgRef.current.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
    setResult(dataUrl);
    setNewSize(Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75));
  };

  const fmt = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <ToolLayout
      title="Image Compressor"
      description={[
        'Reduce image file size without sacrificing visible quality. Perfect for speeding up websites, fitting email attachment limits, or saving storage space.',
        'This tool uses browser-native Canvas API to re-encode your image at your chosen quality level. Your image never leaves your device.',
      ]}
      howTo={{
        steps: [
          'Drop your image or click to upload.',
          'Adjust the quality slider — lower quality means smaller file size.',
          'Click "Compress Image" to process it instantly.',
          'Preview the result and download your compressed image.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Compressor', url: 'https://snaptools.dev/image-compressor',
        description: 'Free online image compressor. Reduce image file size in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Compress</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, WebP, GIF, BMP" />
        )}

        {image && (
          <>
            <div className="mb-4 text-sm text-gray-500">Original size: {fmt(origSize)}</div>
            <div className="mb-5 max-w-md">
              <Slider label="Quality" value={quality} onChange={setQuality} min={10} max={100} unit="%" />
            </div>
            <div className="flex gap-3">
              <Button onClick={compress} size="lg">Compress Image</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); setResult(null); }}>Change Image</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="glass-subtle rounded-xl p-4 mb-4 inline-flex items-center gap-4">
              <span className="text-sm text-gray-600">Compressed: <strong className="text-gray-900">{fmt(newSize)}</strong></span>
              <span className="text-sm font-semibold text-success-dark">{Math.round((1 - newSize / origSize) * 100)}% smaller</span>
            </div>
            <img src={result} alt="Compressed" className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />
            <a href={result} download="compressed-image.jpg">
              <Button variant="success" size="lg">Download Compressed Image</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
