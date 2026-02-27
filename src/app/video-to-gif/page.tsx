'use client';
import { useState, useRef, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Slider } from '@/components/ui';

const faqItems = [
  { q: 'Is my video uploaded to a server?', a: 'No. All processing happens entirely in your browser using the Canvas API. Your video never leaves your device.' },
  { q: 'What video formats are supported?', a: 'Most browsers support MP4, WebM, and MOV files. The exact support depends on your browser and operating system.' },
  { q: 'What is the maximum GIF duration?', a: 'You can create GIFs up to 10 seconds long. This keeps file sizes manageable and ensures smooth processing.' },
  { q: 'Why is my GIF file large?', a: 'GIF is an older format with limited compression. Try reducing the width, lowering the FPS, or shortening the duration to get a smaller file.' },
  { q: 'Can I convert long videos?', a: 'You can load any video, but the GIF output is limited to 10 seconds. Use the start time and duration controls to select the portion you want.' },
];

export default function VideoToGif() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(3);
  const [fps, setFps] = useState(10);
  const [outWidth, setOutWidth] = useState(320);
  const [videoDuration, setVideoDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResultUrl(null);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  const onVideoLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    setVideoDuration(v.duration);
    if (v.duration < duration) setDuration(Math.floor(v.duration));
  };

  const captureFrames = useCallback(async (): Promise<ImageData[]> => {
    const v = videoRef.current;
    if (!v) return [];
    const canvas = document.createElement('canvas');
    const ratio = outWidth / v.videoWidth;
    const h = Math.round(v.videoHeight * ratio);
    canvas.width = outWidth;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const totalFrames = Math.floor(duration * fps);
    const frames: ImageData[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const time = startTime + i / fps;
      v.currentTime = time;
      await new Promise<void>(r => { v.onseeked = () => r(); });
      ctx.drawImage(v, 0, 0, outWidth, h);
      frames.push(ctx.getImageData(0, 0, outWidth, h));
      setProgress(Math.round(((i + 1) / totalFrames) * 50));
    }
    return frames;
  }, [startTime, duration, fps, outWidth]);

  const encodeGif = useCallback(async (frames: ImageData[]) => {
    if (frames.length === 0) return;
    const w = frames[0].width;
    const h = frames[0].height;
    const delay = Math.round(100 / fps); // in 1/100s

    // Simple GIF89a encoder
    const out: number[] = [];
    const write = (b: number) => out.push(b & 0xff);
    const writeShort = (v: number) => { write(v & 0xff); write((v >> 8) & 0xff); };
    const writeStr = (s: string) => { for (let i = 0; i < s.length; i++) write(s.charCodeAt(i)); };

    // Quantize frame to 256 colors using simple median-cut-like approach
    const quantize = (imgData: ImageData) => {
      const pixels = imgData.data;
      const colorMap = new Map<number, number>();
      const palette: number[] = [];

      // Sample colors, build a 256-color palette
      for (let i = 0; i < pixels.length; i += 4) {
        // Reduce to 5-bit per channel for grouping
        const r = pixels[i] >> 3;
        const g = pixels[i + 1] >> 3;
        const b = pixels[i + 2] >> 3;
        const key = (r << 10) | (g << 5) | b;
        if (!colorMap.has(key)) {
          colorMap.set(key, colorMap.size);
          if (palette.length < 256 * 3) {
            palette.push(r << 3, g << 3, b << 3);
          }
        }
      }

      // Pad palette to 256 entries
      while (palette.length < 256 * 3) palette.push(0, 0, 0);

      // Map pixels to indices
      const indices = new Uint8Array(imgData.width * imgData.height);
      for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
        const r = pixels[i] >> 3;
        const g = pixels[i + 1] >> 3;
        const b = pixels[i + 2] >> 3;
        const key = (r << 10) | (g << 5) | b;
        let idx = colorMap.get(key) ?? 0;
        if (idx >= 256) idx = 0;
        indices[j] = idx;
      }

      return { palette: palette.slice(0, 256 * 3), indices };
    };

    // LZW encoder for GIF
    const lzwEncode = (indices: Uint8Array, minCodeSize: number) => {
      const clearCode = 1 << minCodeSize;
      const eoiCode = clearCode + 1;
      let codeSize = minCodeSize + 1;
      let nextCode = eoiCode + 1;
      const table = new Map<string, number>();

      // Init table
      for (let i = 0; i < clearCode; i++) table.set(String(i), i);

      const output: number[] = [];
      let buffer = 0;
      let bufferLen = 0;

      const writeBits = (code: number, size: number) => {
        buffer |= code << bufferLen;
        bufferLen += size;
        while (bufferLen >= 8) {
          output.push(buffer & 0xff);
          buffer >>= 8;
          bufferLen -= 8;
        }
      };

      writeBits(clearCode, codeSize);
      let current = String(indices[0]);

      for (let i = 1; i < indices.length; i++) {
        const next = current + ',' + indices[i];
        if (table.has(next)) {
          current = next;
        } else {
          writeBits(table.get(current)!, codeSize);
          if (nextCode < 4096) {
            table.set(next, nextCode++);
            if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
          } else {
            writeBits(clearCode, codeSize);
            table.clear();
            for (let j = 0; j < clearCode; j++) table.set(String(j), j);
            nextCode = eoiCode + 1;
            codeSize = minCodeSize + 1;
          }
          current = String(indices[i]);
        }
      }
      writeBits(table.get(current)!, codeSize);
      writeBits(eoiCode, codeSize);
      if (bufferLen > 0) output.push(buffer & 0xff);

      return output;
    };

    // GIF Header
    writeStr('GIF89a');
    writeShort(w);
    writeShort(h);

    // Use first frame palette as global
    const firstQ = quantize(frames[0]);
    write(0xf7); // GCT flag, 8-bit color
    write(0); // bg color
    write(0); // pixel aspect

    // Global Color Table (256 * 3 bytes)
    for (let i = 0; i < 256 * 3; i++) write(firstQ.palette[i]);

    // Netscape extension for looping
    write(0x21); write(0xff); write(0x0b);
    writeStr('NETSCAPE2.0');
    write(0x03); write(0x01); writeShort(0); write(0x00);

    for (let f = 0; f < frames.length; f++) {
      setProgress(50 + Math.round(((f + 1) / frames.length) * 50));
      const q = f === 0 ? firstQ : quantize(frames[f]);

      // Graphic Control Extension
      write(0x21); write(0xf9); write(0x04);
      write(0x00); // no transparency
      writeShort(delay);
      write(0x00); // transparent color index
      write(0x00);

      // Local image descriptor
      if (f > 0) {
        // Use local color table for non-first frames
        write(0x2c);
        writeShort(0); writeShort(0);
        writeShort(w); writeShort(h);
        write(0x87); // local color table, 256 entries
        for (let i = 0; i < 256 * 3; i++) write(q.palette[i]);
      } else {
        write(0x2c);
        writeShort(0); writeShort(0);
        writeShort(w); writeShort(h);
        write(0x00); // use global table
      }

      // LZW data
      const minCodeSize = 8;
      write(minCodeSize);
      const lzwData = lzwEncode(q.indices, minCodeSize);

      // Write sub-blocks
      let pos = 0;
      while (pos < lzwData.length) {
        const chunk = Math.min(255, lzwData.length - pos);
        write(chunk);
        for (let i = 0; i < chunk; i++) write(lzwData[pos + i]);
        pos += chunk;
      }
      write(0x00); // block terminator
    }

    write(0x3b); // GIF trailer

    const blob = new Blob([new Uint8Array(out)], { type: 'image/gif' });
    setResultSize(blob.size);
    return URL.createObjectURL(blob);
  }, [fps]);

  const convert = async () => {
    setProcessing(true);
    setProgress(0);
    setResultUrl(null);
    try {
      const frames = await captureFrames();
      const url = await encodeGif(frames);
      setResultUrl(url ?? null);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <ToolLayout
      title="Video to GIF Converter"
      description={[
        'Convert any video to an animated GIF right in your browser. No uploads, no servers — everything is processed locally on your device.',
        'Upload an MP4, WebM, or MOV file, adjust the start time, duration, FPS, and output width, then generate your GIF instantly using our client-side encoder.',
      ]}
      howTo={{
        steps: [
          'Upload a video file (MP4, WebM, or MOV) from your device.',
          'Adjust the start time and duration (up to 10 seconds) for the clip you want.',
          'Set the FPS (5-15) and output width to control quality and file size.',
          'Click "Convert to GIF" and wait for the processing to complete.',
          'Preview the result and download your animated GIF.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Video to GIF Converter', url: 'https://snaptools.dev/video-to-gif',
        description: 'Free online video to GIF converter. Convert MP4, WebM, MOV to animated GIFs in your browser.',
        applicationCategory: 'MultimediaApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Convert</h2>

        {!videoSrc && (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-2xl p-12 cursor-pointer hover:border-primary-400 hover:bg-white/20 transition-all">
            <span className="text-4xl mb-3">🎬</span>
            <span className="text-gray-600 font-medium">Drop your video here or click to upload</span>
            <span className="text-sm text-gray-400 mt-1">Supports MP4, WebM, MOV</span>
            <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFile} className="hidden" />
          </label>
        )}

        {videoSrc && (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={onVideoLoaded}
              controls
              className="w-full max-h-64 rounded-xl mb-5 bg-black"
              muted
            />
            <div className="space-y-4 mb-5">
              <Slider label="Start Time" value={startTime} onChange={v => setStartTime(v)} min={0} max={Math.max(0, videoDuration - duration)} step={0.1} unit="s" />
              <Slider label="Duration" value={duration} onChange={v => setDuration(v)} min={0.5} max={Math.min(10, videoDuration - startTime)} step={0.5} unit="s" />
              <Slider label="FPS" value={fps} onChange={v => setFps(v)} min={5} max={15} step={1} />
              <div className="w-40">
                <Input label="Width (px)" type="number" value={outWidth} onChange={e => setOutWidth(+e.target.value)} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={convert} size="lg" disabled={processing}>
                {processing ? `Converting... ${progress}%` : 'Convert to GIF'}
              </Button>
              <Button variant="ghost" size="lg" onClick={() => { setVideoSrc(null); setResultUrl(null); }}>Change Video</Button>
            </div>

            {processing && (
              <div className="mt-4 w-full bg-white/30 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </>
        )}

        {resultUrl && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <p className="text-sm text-gray-500 mb-3">GIF generated — {formatSize(resultSize)}</p>
            <img src={resultUrl} alt="Generated GIF" className="max-w-full rounded-xl border border-white/30 mb-4 shadow-md" />
            <a href={resultUrl} download="animation.gif">
              <Button variant="success" size="lg">Download GIF</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
