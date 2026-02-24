'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Slider, Select, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my screenshot uploaded to a server?', a: 'No. All processing happens directly in your browser using the Canvas API. Your images never leave your device.' },
  { q: 'What image formats are supported?', a: 'You can upload any image format your browser supports — PNG, JPG, WebP, GIF, BMP, and more.' },
  { q: 'Can I customize the background gradient?', a: 'Yes! Choose from several preset gradients including purple-pink, blue-green, orange-red, sunset, ocean, and more.' },
  { q: 'What resolution is the output?', a: 'The output matches your screenshot resolution plus the padding you add. There is no quality loss during processing.' },
  { q: 'Can I use this for social media posts?', a: 'Absolutely! Screenshot beautifier is perfect for making app screenshots, code snippets, or UI previews look professional for Twitter, LinkedIn, or blog posts.' },
];

const gradients = [
  { value: 'purple-pink', label: 'Purple → Pink', colors: ['#7c3aed', '#ec4899'] },
  { value: 'blue-green', label: 'Blue → Green', colors: ['#3b82f6', '#10b981'] },
  { value: 'orange-red', label: 'Orange → Red', colors: ['#f97316', '#ef4444'] },
  { value: 'sunset', label: 'Sunset', colors: ['#f59e0b', '#ec4899'] },
  { value: 'ocean', label: 'Ocean', colors: ['#06b6d4', '#6366f1'] },
  { value: 'forest', label: 'Forest', colors: ['#10b981', '#064e3b'] },
  { value: 'midnight', label: 'Midnight', colors: ['#1e1b4b', '#4338ca'] },
  { value: 'peach', label: 'Peach', colors: ['#fb923c', '#fbbf24'] },
];

export default function ScreenshotBeautifier() {
  const [image, setImage] = useState<string | null>(null);
  const [gradient, setGradient] = useState('purple-pink');
  const [padding, setPadding] = useState(64);
  const [radius, setRadius] = useState(16);
  const [shadow, setShadow] = useState(24);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const w = img.width + padding * 2;
    const h = img.height + padding * 2;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    const colors = gradients.find(g => g.value === gradient)?.colors || gradients[0].colors;
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Shadow
    if (shadow > 0) {
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = shadow;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadow / 3;
    }

    // Rounded rect clip for screenshot
    const x = padding, y = padding, iw = img.width, ih = img.height, r = radius;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + iw - r, y);
    ctx.quadraticCurveTo(x + iw, y, x + iw, y + r);
    ctx.lineTo(x + iw, y + ih - r);
    ctx.quadraticCurveTo(x + iw, y + ih, x + iw - r, y + ih);
    ctx.lineTo(x + r, y + ih);
    ctx.quadraticCurveTo(x, y + ih, x, y + ih - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    // Fill white to show shadow, then clip and draw
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, x, y);
    ctx.restore();
  }, [gradient, padding, radius, shadow]);

  useEffect(() => { draw(); }, [draw, image]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'beautified-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <ToolLayout
      title="Screenshot Beautifier"
      description={[
        'Make your screenshots look professional with beautiful gradient backgrounds, rounded corners, and shadows. Perfect for social media and presentations.',
        'Everything runs in your browser using the Canvas API. Your images are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Upload a screenshot by dragging and dropping or clicking the upload area.',
          'Choose a background gradient from the preset options.',
          'Adjust padding, corner radius, and shadow to your liking.',
          'Preview the result in real-time as you adjust settings.',
          'Click "Download" to save your beautified screenshot.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Screenshot Beautifier', url: 'https://snaptools.dev/screenshot-beautifier',
        description: 'Free online screenshot beautifier. Add gradient backgrounds, rounded corners, and shadows to your screenshots.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Beautify</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your screenshot here" sublabel="Supports PNG, JPG, WebP, and more" />
        )}

        {image && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <Select
                label="Background Gradient"
                options={gradients.map(g => ({ value: g.value, label: g.label }))}
                value={gradient}
                onChange={e => setGradient(e.target.value)}
              />
              <Slider label="Padding" value={padding} onChange={setPadding} min={16} max={128} unit="px" />
              <Slider label="Corner Radius" value={radius} onChange={setRadius} min={0} max={48} unit="px" />
              <Slider label="Shadow" value={shadow} onChange={setShadow} min={0} max={64} unit="px" />
            </div>

            <div className="mb-5 overflow-auto rounded-xl border border-white/30">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>

            <div className="flex gap-3">
              <Button onClick={download} variant="success" size="lg">Download Beautified Image</Button>
              <Button variant="ghost" size="lg" onClick={() => setImage(null)}>Change Image</Button>
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
