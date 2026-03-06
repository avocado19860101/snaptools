'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What JSON format is supported?', a: 'The input must be a JSON array of objects, e.g., [{"name":"Alice","age":30},{"name":"Bob","age":25}].' },
  { q: 'Can I choose a different delimiter?', a: 'Yes, you can choose between comma, semicolon, tab, or pipe as the CSV delimiter.' },
  { q: 'Are headers included by default?', a: 'Yes, column headers are included by default. You can toggle this option off if needed.' },
  { q: 'How are nested objects handled?', a: 'Nested objects and arrays are converted to JSON strings in the CSV output.' },
  { q: 'Is my data processed locally?', a: 'Yes, all conversion happens in your browser. Your data never leaves your device.' },
];

export default function JsonToCsv() {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string[][]>([]);

  const convert = () => {
    setError('');
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data) || data.length === 0) { setError('Input must be a non-empty JSON array of objects.'); return; }
      const headers = [...new Set(data.flatMap((obj: Record<string, unknown>) => Object.keys(obj)))];
      const escape = (v: unknown) => {
        const s = typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '');
        return s.includes(delimiter) || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = data.map((obj: Record<string, unknown>) => headers.map(h => escape(obj[h])));
      const lines: string[] = [];
      if (includeHeaders) lines.push(headers.map(h => escape(h)).join(delimiter));
      rows.forEach((r: string[]) => lines.push(r.join(delimiter)));
      const result = lines.join('\n');
      setCsv(result);
      const previewRows = (includeHeaders ? [headers, ...rows] : rows).slice(0, 11) as string[][];
      setPreview(previewRows);
    } catch { setError('Invalid JSON. Please check your input.'); }
  };

  const download = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
  };

  return (
    <ToolLayout
      title="JSON to CSV Converter"
      description={[
        'Convert JSON arrays to CSV format instantly. Preview the table, customize the delimiter, and download the result.',
        'Paste your JSON data, configure options, and get a clean CSV output. All processing happens locally in your browser.',
      ]}
      howTo={{ steps: [
        'Paste your JSON array of objects into the input field.',
        'Select your preferred delimiter and header options.',
        'Click "Convert to CSV" to generate the output.',
        'Preview the table, copy the CSV, or download as a .csv file.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'JSON to CSV Converter', url: 'https://snaptools.dev/json-to-csv',
        description: 'Free online JSON to CSV converter with table preview and download.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">JSON Input</h2>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
          className="w-full h-40 p-4 rounded-xl glass border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono text-sm"
        />
        <div className="flex flex-wrap gap-3 items-end mt-4">
          <div className="w-40">
            <Select label="Delimiter" value={delimiter} onChange={e => setDelimiter(e.target.value)} options={[
              { value: ',', label: 'Comma (,)' },
              { value: ';', label: 'Semicolon (;)' },
              { value: '\t', label: 'Tab' },
              { value: '|', label: 'Pipe (|)' },
            ]} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
            <input type="checkbox" checked={includeHeaders} onChange={e => setIncludeHeaders(e.target.checked)} className="rounded" /> Include Headers
          </label>
          <Button onClick={convert} size="lg">Convert to CSV</Button>
        </div>
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
      </Card>

      {csv && (
        <Card padding="lg" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">CSV Output</h2>
            <div className="flex gap-2">
              <CopyButton text={csv} label="Copy" />
              <Button onClick={download} variant="success" size="sm">Download .csv</Button>
            </div>
          </div>
          {preview.length > 0 && (
            <div className="overflow-x-auto mb-4">
              <table className="text-sm w-full">
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className={i === 0 && includeHeaders ? 'font-semibold' : ''}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-1.5 border-b border-white/20 text-gray-700 whitespace-nowrap">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <textarea
            value={csv}
            readOnly
            className="w-full h-32 p-4 rounded-xl glass border-0 font-mono text-sm text-gray-700"
          />
        </Card>
      )}
    </ToolLayout>
  );
}
