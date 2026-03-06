'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'What CSV formats are supported?', a: 'We support comma, semicolon, tab, and pipe-delimited CSV files. The delimiter is auto-detected.' },
  { q: 'How is the delimiter detected?', a: 'We count occurrences of common delimiters in the first line and pick the most frequent one.' },
  { q: 'Can I upload a CSV file?', a: 'Yes! You can either paste CSV text directly or upload a .csv file using the file upload area.' },
  { q: 'How are quoted fields handled?', a: 'Fields wrapped in double quotes are handled correctly, including fields with commas or newlines inside quotes.' },
  { q: 'Is my data processed locally?', a: 'Yes, all conversion happens entirely in your browser. No data is sent to any server.' },
];

function parseCSV(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === delim) { row.push(field); field = ''; }
      else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
        row.push(field); field = '';
        if (row.some(c => c !== '')) rows.push(row);
        row = [];
        if (ch === '\r') i++;
      } else field += ch;
    }
  }
  row.push(field);
  if (row.some(c => c !== '')) rows.push(row);
  return rows;
}

function detectDelimiter(text: string): string {
  const first = text.split('\n')[0];
  const counts: [string, number][] = [',', ';', '\t', '|'].map(d => [d, (first.match(new RegExp(d === '|' ? '\\|' : d === '\t' ? '\t' : d, 'g')) || []).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    file.text().then(t => setInput(t));
  };

  const convert = () => {
    setError('');
    if (!input.trim()) { setError('Please paste or upload CSV data.'); return; }
    const delim = detectDelimiter(input);
    const rows = parseCSV(input.trim(), delim);
    if (rows.length < 2) { setError('CSV must have at least a header row and one data row.'); return; }
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
      return obj;
    });
    setJson(JSON.stringify(data, null, 2));
  };

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    a.click();
  };

  return (
    <ToolLayout
      title="CSV to JSON Converter"
      description={[
        'Convert CSV data to JSON format instantly. Paste text or upload a file with automatic delimiter detection.',
        'Auto-detects commas, semicolons, tabs, and pipes. Download the JSON output or copy it to your clipboard.',
      ]}
      howTo={{ steps: [
        'Paste your CSV data or upload a .csv file.',
        'Click "Convert to JSON" — the delimiter is auto-detected.',
        'Review the JSON output in the result area.',
        'Copy the JSON to clipboard or download as a .json file.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'CSV to JSON Converter', url: 'https://snaptools.dev/csv-to-json',
        description: 'Free online CSV to JSON converter with auto delimiter detection.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">CSV Input</h2>
        <FileDropzone accept=".csv,text/csv" onFile={handleFile} label="Drop a CSV file here" sublabel="Or paste your CSV below" />
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="name,age,city&#10;Alice,30,NYC&#10;Bob,25,LA"
          className="w-full h-40 p-4 rounded-xl glass border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono text-sm mt-4"
        />
        <div className="mt-4">
          <Button onClick={convert} size="lg">Convert to JSON</Button>
        </div>
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
      </Card>

      {json && (
        <Card padding="lg" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">JSON Output</h2>
            <div className="flex gap-2">
              <CopyButton text={json} label="Copy" />
              <Button onClick={download} variant="success" size="sm">Download .json</Button>
            </div>
          </div>
          <pre className="w-full p-4 rounded-xl glass font-mono text-sm text-gray-700 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre">{json}</pre>
        </Card>
      )}
    </ToolLayout>
  );
}
