'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, FileDropzone, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is Base64 encoding for images?', a: 'Base64 encoding converts binary image data into a text string that can be embedded directly in HTML, CSS, or JSON without needing a separate file.' },
  { q: 'Is my image uploaded to a server?', a: 'No. The conversion happens entirely in your browser using the FileReader API. Your image never leaves your device.' },
  { q: 'Why is the Base64 string larger than the original file?', a: 'Base64 encoding increases data size by approximately 33% because it represents binary data using only ASCII text characters.' },
  { q: 'What image formats are supported?', a: 'All common formats are supported: JPG, PNG, GIF, WebP, BMP, SVG, and more — any format your browser can read.' },
  { q: 'What is the data URI prefix?', a: 'The data URI prefix (e.g., data:image/png;base64,) tells browsers the string is an embedded image. You can exclude it if you only need the raw Base64 data.' },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

export default function ImageToBase64() {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [includePrefix, setIncludePrefix] = useState(true);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      setBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const output = includePrefix ? base64 : base64.replace(/^data:[^;]+;base64,/, '');
  const base64Size = new Blob([output]).size;

  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description={[
        'Convert any image to a Base64-encoded string instantly. Perfect for embedding images directly in HTML, CSS, or JavaScript.',
        'This tool runs entirely in your browser — your images are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Drop your image or click to upload any image format.',
          'The image is instantly converted to a Base64 data URL string.',
          'Toggle the data URI prefix option if you need raw Base64 only.',
          'Copy the Base64 string with one click and use it in your code.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image to Base64 Converter', url: 'https://snaptools.dev/image-to-base64',
        description: 'Convert images to Base64 strings instantly in your browser. Free and private.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload Image</h2>

        {!preview && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, GIF, WebP, SVG, BMP" />
        )}

        {preview && (
          <>
            <div className="mb-4">
              <img src={preview} alt="Preview" className="max-w-full max-h-64 rounded-xl border border-white/30 shadow-md" />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span>📁 {fileName}</span>
              <span>Original: {formatBytes(fileSize)}</span>
              <span>Base64: {formatBytes(base64Size)}</span>
              <span className="text-amber-600">+{((base64Size / fileSize - 1) * 100).toFixed(0)}% size</span>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <input type="checkbox" checked={includePrefix} onChange={e => setIncludePrefix(e.target.checked)} className="rounded" />
              Include data URI prefix
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={output}
                rows={6}
                className="w-full glass rounded-xl p-4 text-xs font-mono text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <div className="absolute top-2 right-2">
                <CopyButton text={output} />
              </div>
            </div>
            <div className="mt-4">
              <Button variant="ghost" onClick={() => { setPreview(null); setBase64(''); setFileName(''); setFileSize(0); }}>Change Image</Button>
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
