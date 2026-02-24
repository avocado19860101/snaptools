'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Are my PDFs uploaded to a server?', a: 'No. All merging happens directly in your browser using the pdf-lib library. Your files never leave your device.' },
  { q: 'Is there a limit on the number of PDFs?', a: 'There is no hard limit, but merging many large PDFs may be slow depending on your device\'s memory and processing power.' },
  { q: 'Will the merged PDF preserve links and bookmarks?', a: 'The merged PDF preserves all page content, forms, and annotations. Some advanced features like bookmarks may not transfer.' },
  { q: 'Can I reorder the PDFs before merging?', a: 'Yes! Use the up and down arrow buttons next to each file to reorder them before merging.' },
  { q: 'What if one of my PDFs is password-protected?', a: 'Password-protected PDFs cannot be merged without first removing the protection. Please decrypt the file before uploading.' },
];

interface PdfFile {
  name: string;
  data: ArrayBuffer;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as ArrayBuffer;
      setFiles(prev => [...prev, { name: file.name, data }]);
      setResult(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= files.length) return;
    const copy = [...files];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setFiles(copy);
    setResult(null);
  };

  const remove = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (const f of files) {
        const doc = await PDFDocument.load(f.data);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert('Failed to merge PDFs. Make sure all files are valid, unencrypted PDFs.');
    }
    setMerging(false);
  };

  return (
    <ToolLayout
      title="PDF Merge"
      description={[
        'Merge multiple PDF files into one document instantly and for free. Reorder pages before combining.',
        'Everything runs in your browser using the pdf-lib library. Your PDFs are never uploaded to any server.',
      ]}
      howTo={{
        steps: [
          'Upload two or more PDF files by dragging and dropping or clicking the upload area.',
          'Reorder files using the up/down arrow buttons if needed.',
          'Click "Merge PDFs" to combine all files into one document.',
          'Download the merged PDF file.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'PDF Merge', url: 'https://snaptools.dev/pdf-merge',
        description: 'Free online PDF merger. Combine multiple PDFs into one document instantly in your browser.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Upload & Merge PDFs</h2>

        <FileDropzone accept="application/pdf" onFile={handleFile} label="Drop PDF files here" sublabel="Add multiple PDFs one at a time" />

        {files.length > 0 && (
          <div className="mt-5 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-gray-500 w-6">{i + 1}.</span>
                <span className="text-sm text-gray-900 flex-1 truncate">{f.name}</span>
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-lg" title="Move up">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === files.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-lg" title="Move down">↓</button>
                <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-lg" title="Remove">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <Button onClick={merge} size="lg" disabled={files.length < 2 || merging}>
            {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
          </Button>
          {files.length > 0 && (
            <Button variant="ghost" size="lg" onClick={() => { setFiles([]); setResult(null); }}>Clear All</Button>
          )}
        </div>

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <p className="text-sm text-gray-500 mb-3">✅ Successfully merged {files.length} PDFs</p>
            <a href={result} download="merged.pdf">
              <Button variant="success" size="lg">Download Merged PDF</Button>
            </a>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
