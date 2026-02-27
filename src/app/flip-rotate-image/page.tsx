'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. All flipping and rotating happens in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, GIF, WebP, and BMP images. The output is downloaded as PNG.' },
  { q: 'Can I combine flip and rotate?', a: 'Yes. You can apply any combination of flips and rotations. The preview updates live so you can see the result.' },
  { q: 'Does rotating by a custom angle crop the image?', a: 'The canvas automatically expands to fit the rotated image, so no content is cropped.' },
  { q: 'Will flipping or rotating reduce image quality?', a: 'For 90°/180° rotations and flips, quality is perfectly preserved. Custom angles use canvas resampling which is very high quality.' },
];

export default function FlipRotateImage() {
  const [image, setImage] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [angle, setAngle] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImage(src);
      setFlipH(false); setFlipV(false); setAngle(0);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const drawPreview = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = Math.ceil(img.width * cos + img.height * sin);
    const h = Math.ceil(img.width * sin + img.height * cos);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [image, flipH, flipV, angle]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'flip-rotate-image.png';
    a.click();
  };

  return (
    <ToolLayout
      title="Flip & Rotate Image"
      description={[
        'Flip and rotate images instantly in your browser. Rotate by 90°, 180°, or any custom angle, and flip horizontally or vertically.',
        'All processing uses the Canvas API — your images never leave your device.',
      ]}
      howTo={{
        steps: [
          'Upload an image by dropping it or clicking to browse.',
          'Use the rotation buttons for quick 90°/180° rotations, or enter a custom angle.',
          'Toggle horizontal or vertical flip as needed.',
          'Preview the result live, then click Download to save.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Flip & Rotate Image', url: 'https://snaptools.dev/flip-rotate-image',
        description: 'Free online tool to flip and rotate images. Rotate by any angle and flip horizontally or vertically.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Transform</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, GIF, WebP, BMP" />
        )}

        {image && (
          <>
            <div className="flex flex-wrap gap-3 mb-5">
              <Button onClick={() => setAngle(a => (a + 90) % 360)}>Rotate 90° CW</Button>
              <Button onClick={() => setAngle(a => (a - 90 + 360) % 360)}>Rotate 90° CCW</Button>
              <Button onClick={() => setAngle(a => (a + 180) % 360)}>Rotate 180°</Button>
              <Button variant={flipH ? 'primary' : 'ghost'} onClick={() => setFlipH(f => !f)}>Flip H</Button>
              <Button variant={flipV ? 'primary' : 'ghost'} onClick={() => setFlipV(f => !f)}>Flip V</Button>
            </div>
            <div className="w-32 mb-5">
              <Input label="Angle (°)" type="number" value={angle} onChange={e => setAngle(+e.target.value)} />
            </div>

            <canvas ref={canvasRef} className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />

            <div className="flex gap-3">
              <Button onClick={download} variant="success" size="lg">Download Image</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); imgRef.current = null; }}>Change Image</Button>
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
