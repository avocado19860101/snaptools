'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my image uploaded to a server?', a: 'No. All cropping happens directly in your browser using the Canvas API. Your image never leaves your device.' },
  { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, GIF, WebP, and BMP images. The cropped output is saved as PNG.' },
  { q: 'Can I set a specific aspect ratio?', a: 'Yes! Choose from preset ratios like 1:1, 4:3, 16:9, 3:2, or use Free mode for any custom selection.' },
  { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large images may be slow to process depending on your device.' },
  { q: 'Can I undo a crop?', a: 'You can adjust the crop area before downloading. Once downloaded, upload the original again to re-crop.' },
];

const RATIOS = [
  { label: 'Free', value: 'free' },
  { label: '1:1 (Square)', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '3:2', value: '3:2' },
];

function getRatio(v: string) {
  if (v === 'free') return null;
  const [w, h] = v.split(':').map(Number);
  return w / h;
}

export default function ImageCrop() {
  const [image, setImage] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [ratio, setRatio] = useState('free');
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState<null | 'move' | 'se'>(null);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImage(src);
      setResult(null);
      const img = new Image();
      img.onload = () => {
        setImgEl(img);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgEl;
    if (!canvas || !img) return;
    const container = containerRef.current;
    if (!container) return;

    const maxW = container.clientWidth;
    const maxH = 500;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const dw = Math.round(img.width * scale);
    const dh = Math.round(img.height * scale);
    canvas.width = dw;
    canvas.height = dh;
    setDisplaySize({ w: dw, h: dh });

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, dw, dh);

    // Dim outside crop
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, dw, crop.y);
    ctx.fillRect(0, crop.y, crop.x, crop.h);
    ctx.fillRect(crop.x + crop.w, crop.y, dw - crop.x - crop.w, crop.h);
    ctx.fillRect(0, crop.y + crop.h, dw, dh - crop.y - crop.h);

    // Crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);

    // Grid lines (rule of thirds)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + (crop.w * i) / 3, crop.y);
      ctx.lineTo(crop.x + (crop.w * i) / 3, crop.y + crop.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + (crop.h * i) / 3);
      ctx.lineTo(crop.x + crop.w, crop.y + (crop.h * i) / 3);
      ctx.stroke();
    }

    // Resize handle
    ctx.fillStyle = '#fff';
    ctx.fillRect(crop.x + crop.w - 8, crop.y + crop.h - 8, 8, 8);
  }, [imgEl, crop]);

  useEffect(() => {
    if (imgEl) {
      const container = containerRef.current;
      if (!container) return;
      const maxW = container.clientWidth;
      const maxH = 500;
      const scale = Math.min(maxW / imgEl.width, maxH / imgEl.height, 1);
      const dw = Math.round(imgEl.width * scale);
      const dh = Math.round(imgEl.height * scale);
      const r = getRatio(ratio);
      let cw = Math.round(dw * 0.8);
      let ch = Math.round(dh * 0.8);
      if (r) {
        if (cw / ch > r) cw = Math.round(ch * r);
        else ch = Math.round(cw / r);
      }
      setCrop({ x: Math.round((dw - cw) / 2), y: Math.round((dh - ch) / 2), w: cw, h: ch });
    }
  }, [imgEl, ratio]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const onMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Check if near SE corner handle
    if (Math.abs(mx - (crop.x + crop.w)) < 12 && Math.abs(my - (crop.y + crop.h)) < 12) {
      setDragging('se');
      setDragStart({ mx, my, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h });
    } else if (mx >= crop.x && mx <= crop.x + crop.w && my >= crop.y && my <= crop.y + crop.h) {
      setDragging('move');
      setDragStart({ mx, my, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - dragStart.mx;
    const dy = my - dragStart.my;
    const r = getRatio(ratio);

    if (dragging === 'move') {
      let nx = Math.max(0, Math.min(displaySize.w - dragStart.cw, dragStart.cx + dx));
      let ny = Math.max(0, Math.min(displaySize.h - dragStart.ch, dragStart.cy + dy));
      setCrop(c => ({ ...c, x: nx, y: ny }));
    } else if (dragging === 'se') {
      let nw = Math.max(20, dragStart.cw + dx);
      let nh = Math.max(20, dragStart.ch + dy);
      if (r) { nh = Math.round(nw / r); }
      nw = Math.min(nw, displaySize.w - crop.x);
      nh = Math.min(nh, displaySize.h - crop.y);
      if (r) { nw = Math.round(nh * r); }
      setCrop(c => ({ ...c, w: nw, h: nh }));
    }
  };

  const onMouseUp = () => setDragging(null);

  const doCrop = () => {
    if (!imgEl) return;
    const container = containerRef.current;
    if (!container) return;
    const maxW = container.clientWidth;
    const maxH = 500;
    const scale = Math.min(maxW / imgEl.width, maxH / imgEl.height, 1);

    const sx = crop.x / scale;
    const sy = crop.y / scale;
    const sw = crop.w / scale;
    const sh = crop.h / scale;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    setResult(canvas.toDataURL('image/png'));
  };

  const realCrop = () => {
    if (!imgEl || !displaySize.w) return { w: 0, h: 0 };
    const scale = displaySize.w / imgEl.width;
    return { w: Math.round(crop.w / scale), h: Math.round(crop.h / scale) };
  };

  const rc = realCrop();

  return (
    <ToolLayout
      title="Image Crop Tool"
      description={[
        'Crop any image to your desired area instantly and for free. Upload your image, drag the crop area, and download the result.',
        'Our image crop tool works entirely in your browser using the Canvas API. Your images are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Upload your image by dropping it or clicking to browse.',
          'Select an aspect ratio preset or use Free mode for custom cropping.',
          'Drag the crop area to position it. Drag the corner handle to resize.',
          'Click "Crop Image" and download your cropped result.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Image Crop Tool', url: 'https://snaptools.dev/image-crop',
        description: 'Free online image cropping tool. Crop images with preset aspect ratios in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Crop</h2>

        {!image && (
          <FileDropzone accept="image/*" onFile={handleFile} label="Drop your image here" sublabel="Supports JPG, PNG, GIF, WebP, BMP" />
        )}

        {image && !result && (
          <>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div className="w-48">
                <Select label="Aspect Ratio" value={ratio} onChange={e => setRatio(e.target.value)} options={RATIOS.map(r => ({ label: r.label, value: r.value }))} />
              </div>
              <div className="text-sm text-gray-500 pb-2">Crop: {rc.w} × {rc.h}px</div>
            </div>
            <div ref={containerRef} className="mb-4 cursor-crosshair" onMouseLeave={onMouseUp}>
              <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                className="rounded-xl border border-white/30 shadow-md max-w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={doCrop} size="lg">Crop Image</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); setImgEl(null); setResult(null); }}>Change Image</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-3">Cropped to {rc.w} × {rc.h}px</p>
            <img src={result} alt="Cropped" className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />
            <div className="flex gap-3">
              <a href={result} download="cropped-image.png">
                <Button variant="success" size="lg">Download Cropped Image</Button>
              </a>
              <Button variant="ghost" size="lg" onClick={() => { setResult(null); }}>Adjust Crop</Button>
              <Button variant="ghost" size="lg" onClick={() => { setImage(null); setImgEl(null); setResult(null); }}>New Image</Button>
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
