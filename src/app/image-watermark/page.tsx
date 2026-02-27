'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. All watermarking happens directly in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'What watermark positions are available?', a: 'You can place the watermark in the center, any corner (top-left, top-right, bottom-left, bottom-right), or tile it across the entire image.' },
  { q: 'Can I adjust the watermark opacity?', a: 'Yes. Use the opacity slider to make your watermark fully opaque or nearly transparent, anywhere from 0% to 100%.' },
  { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, GIF, WebP, and BMP images. The output is downloaded as a PNG file.' },
  { q: 'Can I rotate the watermark text?', a: 'Yes. You can set a custom rotation angle from -180° to 180° to angle your watermark however you like.' },
];

const positions = [
  { value: 'center', label: 'Center' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'tile', label: 'Tile (Repeat)' },
];

export default function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('Watermark');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50);
  const [rotation, setRotation] = useState(-30);
  const [position, setPosition] = useState('center');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const drawPreview = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const rad = (rotation * Math.PI) / 180;

    if (position === 'tile') {
      const stepX = fontSize * text.length * 0.8 + 80;
      const stepY = fontSize * 2 + 60;
      for (let y = -img.height; y < img.height * 2; y += stepY) {
        for (let x = -img.width; x < img.width * 2; x += stepX) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rad);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      let x = img.width / 2, y = img.height / 2;
      const pad = fontSize;
      if (position === 'top-left') { x = pad + fontSize * 2; y = pad + fontSize; }
      else if (position === 'top-right') { x = img.width - pad - fontSize * 2; y = pad + fontSize; }
      else if (position === 'bottom-left') { x = pad + fontSize * 2; y = img.height - pad - fontSize; }
      else if (position === 'bottom-right') { x = img.width - pad - fontSize * 2; y = img.height - pad - fontSize; }
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.fillText(text, 0, 0);
    }
    ctx.restore();
  }, [image, text, fontSize, color, opacity, rotation, position]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'watermarked-image.png';
    a.click();
  };

  return (
    <ToolLayout
      title="Image Watermark"
      description={[
        'Add text watermarks to your images instantly and for free. Customize text, font size, color, opacity, position, and rotation.',
        'Everything runs in your browser using the Canvas API. Your images are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Upload an image by dropping it or clicking to browse.',
          'Enter your watermark text and adjust font size, color, and opacity.',
          'Choose a position (center, corner, or tile) and set a rotation angle.',
          'Preview the watermark live on the canvas, then click Download.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Watermark', url: 'https://snaptools.dev/image-watermark',
        description: 'Free online image watermark tool. Add text watermarks to images in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Watermark</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, GIF, WebP, BMP" />
        )}

        {image && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <Input label="Watermark Text" value={text} onChange={e => setText(e.target.value)} />
              <Input label="Font Size (px)" type="number" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-full rounded-lg cursor-pointer" />
              </div>
              <Input label={`Opacity (${opacity}%)`} type="number" min={0} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)} />
              <Input label={`Rotation (${rotation}°)`} type="number" min={-180} max={180} value={rotation} onChange={e => setRotation(+e.target.value)} />
              <Select label="Position" value={position} onChange={e => setPosition(e.target.value)} options={positions} />
            </div>

            <canvas ref={canvasRef} className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />

            <div className="flex gap-3">
              <Button onClick={download} variant="success" size="lg">Download Watermarked Image</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); imgRef.current = null; }}>Change Image</Button>
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
