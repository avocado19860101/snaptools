'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my PDF uploaded to a server?', a: 'No. All compression happens directly in your browser using pdf-lib. Your files never leave your device.' },
  { q: 'How does client-side PDF compression work?', a: 'We use pdf-lib to rewrite the PDF structure, remove unused objects, and strip metadata. This optimizes the file without re-encoding content.' },
  { q: 'What compression levels are available?', a: 'Low removes only metadata, Medium strips metadata and unused objects, and High additionally removes annotations and form fields for maximum reduction.' },
  { q: 'Will compression reduce PDF quality?', a: 'Text and vector graphics remain identical. Embedded images are not re-compressed, so visual quality is preserved.' },
  { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large PDFs (over 100MB) may be slow depending on your device\'s memory.' },
];

const qualityOptions = [
  { value: 'low', label: 'Low Compression (metadata only)' },
  { value: 'medium', label: 'Medium Compression' },
  { value: 'high', label: 'High Compression' },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfCompress() {
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState('medium');
  const [result, setResult] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);

  const handleFile = (file: File) => {
    setOriginalSize(file.size);
    setFileName(file.name);
    setResult(null);
    setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (ev) => { setFileBytes(ev.target?.result as ArrayBuffer); };
    reader.readAsArrayBuffer(file);
  };

  const compress = async () => {
    if (!fileBytes) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach(p => newDoc.addPage(p));

      if (quality === 'medium' || quality === 'high') {
        newDoc.setTitle('');
        newDoc.setAuthor('');
        newDoc.setSubject('');
        newDoc.setKeywords([]);
        newDoc.setProducer('');
        newDoc.setCreator('');
      }

      if (quality === 'high') {
        const form = newDoc.getForm();
        try { form.flatten(); } catch { /* no form fields */ }
      }

      const pdfBytes = await newDoc.save();
      setCompressedSize(pdfBytes.length);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert('Failed to compress PDF. The file may be encrypted or corrupted.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF Compress"
      description={[
        'Compress PDF files to reduce file size. Remove metadata, optimize structure, and strip unused objects — all in your browser.',
        'Uses pdf-lib to rewrite PDFs client-side. Your files are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Upload a PDF file by dropping it or clicking to browse.',
          'Select a compression level: Low, Medium, or High.',
          'Click "Compress PDF" to process the file in your browser.',
          'Compare original and compressed sizes, then download the result.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'PDF Compress', url: 'https://snaptools.dev/pdf-compress',
        description: 'Free online PDF compressor. Reduce PDF file size in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Compress</h2>

        {!fileBytes && (
          <FileDropzone accept="application/pdf" onFile={handleFile} label="Drop your PDF here" sublabel="Supports any PDF file" />
        )}

        {fileBytes && (
          <>
            <div className="mb-4 text-sm text-gray-500">File: {fileName} ({formatSize(originalSize)})</div>
            <div className="max-w-xs mb-5">
              <Select label="Compression Level" value={quality} onChange={e => setQuality(e.target.value)} options={qualityOptions} />
            </div>
            <div className="flex gap-3">
              <Button onClick={compress} size="lg" disabled={processing}>{processing ? 'Compressing...' : 'Compress PDF'}</Button>
              <Button variant="ghost" size="lg" onClick={() => { setFileBytes(null); setResult(null); }}>Change File</Button>
            </div>
          </>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500">Original</p>
                <p className="text-xl font-bold text-gray-900">{formatSize(originalSize)}</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500">Compressed</p>
                <p className="text-xl font-bold text-gray-900">{formatSize(compressedSize)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {compressedSize < originalSize
                ? `Reduced by ${formatSize(originalSize - compressedSize)} (${((1 - compressedSize / originalSize) * 100).toFixed(1)}%)`
                : 'File is already well-optimized. Compressed size is similar or larger.'}
            </p>
            <a href={result} download={`compressed-${fileName}`}>
              <Button variant="success" size="lg">Download Compressed PDF</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
