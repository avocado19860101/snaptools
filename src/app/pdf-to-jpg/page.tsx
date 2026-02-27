'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Slider, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my PDF uploaded to a server?', a: 'No. All conversion happens directly in your browser using pdf.js. Your files never leave your device.' },
  { q: 'What is the maximum PDF size?', a: 'There is no hard limit, but very large PDFs may take longer to process depending on your device memory.' },
  { q: 'Can I adjust the image quality?', a: 'Yes! Use the quality slider to choose between smaller file sizes (lower quality) and larger, sharper images.' },
  { q: 'Can I download all pages at once?', a: 'Yes, click "Download All as ZIP" to get all converted pages in a single ZIP file.' },
  { q: 'What output format is used?', a: 'Pages are converted to JPG format. You can adjust the quality with the slider.' },
];

export default function PdfToJpg() {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.9);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setLoading(true);
    setError('');
    setPages([]);
    setFileName(file.name.replace(/\.pdf$/i, ''));

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const imgs: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        imgs.push(canvas.toDataURL('image/jpeg', quality));
      }

      setPages(imgs);
    } catch (e: any) {
      setError('Failed to process PDF. Make sure the file is a valid PDF.');
    }
    setLoading(false);
  };

  const downloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (let i = 0; i < pages.length; i++) {
      const data = pages[i].split(',')[1];
      zip.file(`${fileName}-page-${i + 1}.jpg`, data, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}-pages.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="PDF to JPG Converter"
      description={[
        'Convert PDF pages to high-quality JPG images instantly and for free. Upload your PDF and download individual pages or all at once.',
        'This tool uses pdf.js to render your PDF entirely in the browser. No server uploads, complete privacy.',
      ]}
      howTo={{
        steps: [
          'Upload your PDF file by dropping it or clicking to browse.',
          'Adjust the image quality using the slider.',
          'Preview all converted pages as images.',
          'Download individual pages or click "Download All as ZIP" to get everything.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'PDF to JPG Converter', url: 'https://snaptools.dev/pdf-to-jpg',
        description: 'Free online PDF to JPG converter. Convert PDF pages to images in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload PDF</h2>

        {pages.length === 0 && !loading && (
          <>
            <div className="mb-4 w-48">
              <Slider label={`Quality: ${Math.round(quality * 100)}%`} min={10} max={100} value={quality * 100} onChange={v => setQuality(v / 100)} />
            </div>
            <FileDropzone accept=".pdf,application/pdf" onFile={handleFile} label="Drop your PDF here" sublabel="Supports any PDF file" />
          </>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Converting pages...</p>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {pages.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{pages.length} page{pages.length > 1 ? 's' : ''} converted</p>
              <div className="flex gap-3">
                {pages.length > 1 && <Button onClick={downloadAll} size="md">Download All as ZIP</Button>}
                <Button variant="ghost" size="md" onClick={() => { setPages([]); setFileName(''); }}>New PDF</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pages.map((src, i) => (
                <div key={i} className="glass rounded-2xl p-3">
                  <img src={src} alt={`Page ${i + 1}`} className="rounded-xl w-full mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Page {i + 1}</span>
                    <a href={src} download={`${fileName}-page-${i + 1}.jpg`}>
                      <Button size="sm">Download</Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
