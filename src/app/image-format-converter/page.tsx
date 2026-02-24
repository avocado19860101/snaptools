'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select, Slider, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. All conversion happens directly in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'What input formats are supported?', a: 'Any format your browser supports — JPG, PNG, GIF, WebP, BMP, SVG, AVIF, and more.' },
  { q: 'What is the quality slider for?', a: 'The quality slider controls compression for JPG and WebP formats (1-100). Higher values produce better quality but larger files. PNG is always lossless.' },
  { q: 'Will converting change my image dimensions?', a: 'No. The converter only changes the file format and compression. Image dimensions remain exactly the same.' },
  { q: 'Can I convert transparent images?', a: 'PNG and WebP support transparency. Converting to JPG will replace transparent areas with a white background.' },
];

const formatOptions = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/webp', label: 'WebP' },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function ImageFormatConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(85);
  const [result, setResult] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [fileName, setFileName] = useState('');
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
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

  const convert = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = imgRef.current.width;
    canvas.height = imgRef.current.height;
    const ctx = canvas.getContext('2d')!;
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(imgRef.current, 0, 0);
    const q = format === 'image/png' ? undefined : quality / 100;
    canvas.toBlob((blob) => {
      if (!blob) return;
      setResultSize(blob.size);
      setResult(URL.createObjectURL(blob));
    }, format, q);
  };

  const ext = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'webp';

  return (
    <ToolLayout
      title="Image Format Converter"
      description={[
        'Convert images between PNG, JPG, and WebP formats instantly and for free. Adjust quality settings for optimal file size.',
        'Everything runs in your browser using the Canvas API. Your images are never uploaded to any server, ensuring complete privacy.',
      ]}
      howTo={{
        steps: [
          'Upload any image by dragging and dropping or clicking the upload area.',
          'Select your desired output format: PNG, JPG, or WebP.',
          'Adjust the quality slider for JPG or WebP (PNG is always lossless).',
          'Click "Convert Image" to process and preview the result with file size comparison.',
          'Download the converted image.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Format Converter', url: 'https://snaptools.dev/image-format-converter',
        description: 'Free online image format converter. Convert between PNG, JPG, and WebP instantly in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Convert</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, GIF, WebP, BMP, and more" />
        )}

        {image && (
          <>
            <div className="mb-4 text-sm text-gray-500">Original: {formatBytes(originalSize)}</div>
            <div className="flex flex-wrap gap-4 items-end mb-5">
              <div className="w-40">
                <Select label="Output Format" options={formatOptions} value={format} onChange={e => { setFormat(e.target.value); setResult(null); }} />
              </div>
              {format !== 'image/png' && (
                <div className="w-48">
                  <Slider label="Quality" value={quality} onChange={v => { setQuality(v); setResult(null); }} min={1} max={100} unit="%" />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={convert} size="lg">Convert Image</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); setResult(null); }}>Change Image</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex gap-4 text-sm text-gray-500 mb-3">
              <span>Original: {formatBytes(originalSize)}</span>
              <span>→</span>
              <span>Converted: {formatBytes(resultSize)}</span>
              <span className={resultSize < originalSize ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                ({resultSize < originalSize ? '-' : '+'}{Math.abs(Math.round((1 - resultSize / originalSize) * 100))}%)
              </span>
            </div>
            <img src={result} alt="Converted" className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />
            <a href={result} download={`${fileName}.${ext}`}>
              <Button variant="success" size="lg">Download {ext.toUpperCase()}</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
