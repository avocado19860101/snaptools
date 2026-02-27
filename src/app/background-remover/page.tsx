'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Slider, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. All processing happens entirely in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'How does the background removal work?', a: 'This tool uses color-key removal — it removes pixels that match a selected color within a tolerance range. It works best with solid-color backgrounds.' },
  { q: 'Can it remove complex backgrounds?', a: 'This tool works best with solid or near-solid color backgrounds (like green screens, white, or single-color backdrops). For complex scenes, an AI-based tool would be needed.' },
  { q: 'What output format is used?', a: 'The output is always PNG, which supports transparency. The removed background areas become transparent.' },
  { q: 'Why are some edges rough?', a: 'Adjust the tolerance slider for better results. Lower tolerance keeps more pixels, higher tolerance removes more. You can also try picking a slightly different background color.' },
];

export default function BackgroundRemover() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(30);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      setResultUrl(null);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const processImage = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = canvasRef.current!;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const bg = hexToRgb(bgColor);
    const tol = tolerance * 2.55; // scale 0-100 to 0-255ish distance

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - bg.r;
      const dg = data[i + 1] - bg.g;
      const db = data[i + 2] - bg.b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist <= tol) {
        data[i + 3] = 0; // set alpha to 0
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw preview with checkerboard
    const preview = previewRef.current!;
    preview.width = img.width;
    preview.height = img.height;
    const pctx = preview.getContext('2d')!;
    // Checkerboard
    const size = 10;
    for (let y = 0; y < preview.height; y += size) {
      for (let x = 0; x < preview.width; x += size) {
        pctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#ccc' : '#fff';
        pctx.fillRect(x, y, size, size);
      }
    }
    pctx.drawImage(canvas, 0, 0);

    setResultUrl(canvas.toDataURL('image/png'));
  }, [bgColor, tolerance]);

  useEffect(() => {
    if (imgRef.current && imageSrc) {
      const timeout = setTimeout(processImage, 100);
      return () => clearTimeout(timeout);
    }
  }, [bgColor, tolerance, imageSrc, processImage]);

  const pickColorFromImage = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const scaleX = img.width / rect.width;
    const scaleY = img.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const ctx = tempCanvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    setBgColor(hex);
  };

  return (
    <ToolLayout
      title="Image Background Remover"
      description={[
        'Remove solid-color backgrounds from images using color-key removal. Works entirely in your browser — your images stay private.',
        'This tool removes pixels matching a selected color within an adjustable tolerance range. Perfect for removing white, green screen, or other solid-color backgrounds. Note: this is color-based removal, not AI-powered.',
      ]}
      howTo={{
        steps: [
          'Upload an image with a solid-color background (JPG, PNG, WebP).',
          'Click on the original image to pick the background color, or use the color picker.',
          'Adjust the tolerance slider to fine-tune which colors are removed.',
          'Preview the result with the transparent checkerboard pattern.',
          'Download the result as a PNG with transparency.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Background Remover', url: 'https://snaptools.dev/background-remover',
        description: 'Free online image background remover using color-key removal. Remove solid-color backgrounds in your browser.',
        applicationCategory: 'MultimediaApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Remove Background</h2>

        {!imageSrc && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, WebP, BMP" />
        )}

        {imageSrc && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-sm text-gray-500 mb-2">Original (click to pick color)</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Original"
                  onClick={pickColorFromImage}
                  className="w-full rounded-xl border border-white/30 cursor-crosshair"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Preview</p>
                <canvas ref={previewRef} className="w-full rounded-xl border border-white/30" />
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex flex-wrap gap-4 items-end mb-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/30 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 font-mono">{bgColor}</span>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Slider label="Tolerance" value={tolerance} onChange={setTolerance} min={0} max={100} step={1} unit="%" />
              </div>
            </div>

            <div className="flex gap-3">
              {resultUrl && (
                <a href={resultUrl} download="background-removed.png">
                  <Button variant="success" size="lg">Download PNG</Button>
                </a>
              )}
              <Button variant="ghost" size="lg" onClick={() => { setImageSrc(null); setResultUrl(null); }}>Change Image</Button>
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
