'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Image Compressor</h1>
      <p className="text-gray-600 mb-2">Reduce image file size without sacrificing visible quality. Perfect for speeding up websites, fitting email attachment limits, or saving storage space on your device.</p>
      <p className="text-gray-600 mb-8">This tool uses browser-native Canvas API to re-encode your image at your chosen quality level. Your image never leaves your device — compression happens 100% client-side.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload & Compress</h2>
        <input type="file" accept="image/*" onChange={handleFile} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100" />
        {image && (
          <>
            <div className="mb-4 text-sm text-gray-500">Original size: {fmt(origSize)}</div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality: {quality}%</label>
              <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="w-full max-w-md" />
            </div>
            <button onClick={compress} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg">Compress Image</button>
          </>
        )}
        {result && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Compressed size: {fmt(newSize)} ({Math.round((1 - newSize / origSize) * 100)}% smaller)</p>
            <img src={result} alt="Compressed" className="max-w-full rounded border mb-4" />
            <a href={result} download="compressed-image.jpg" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg">Download Compressed Image</a>
          </div>
        )}
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Image Compressor</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Upload your image by clicking &quot;Choose File&quot;.</li>
          <li>Adjust the quality slider — lower quality means smaller file size.</li>
          <li>Click &quot;Compress Image&quot; to process it instantly.</li>
          <li>Preview the result and download your compressed image.</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Compressor', url: 'https://snaptools.dev/image-compressor',
        description: 'Free online image compressor. Reduce image file size in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}} />
    </div>
  );
}
