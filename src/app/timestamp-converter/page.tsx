'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970, 00:00:00 UTC (known as the Unix epoch). It is widely used in programming and databases.' },
  { q: 'What is the difference between seconds and milliseconds timestamps?', a: 'Unix timestamps in seconds are 10 digits (e.g., 1700000000), while millisecond timestamps are 13 digits (e.g., 1700000000000). This tool auto-detects which format you enter.' },
  { q: 'Does this tool account for time zones?', a: 'The converted date/time is displayed in your local time zone as detected by your browser. The UTC time is also shown for reference.' },
  { q: 'Is my data sent to a server?', a: 'No. All conversions happen entirely in your browser using JavaScript. Nothing is sent to any server.' },
  { q: 'What is the valid range for timestamps?', a: 'This tool supports timestamps from year 1970 to year 2099. Negative timestamps (dates before 1970) are also supported.' },
];

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const convertTimestamp = () => {
    const v = tsInput.trim();
    if (!v) return;
    let ms = parseInt(v, 10);
    if (isNaN(ms)) { setResult('Invalid timestamp'); return; }
    // Auto-detect seconds vs milliseconds
    if (Math.abs(ms) < 1e12) ms *= 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) { setResult('Invalid timestamp'); return; }
    setResult(`Local: ${d.toLocaleString()}\nUTC: ${d.toUTCString()}\nISO: ${d.toISOString()}`);
  };

  const convertDate = () => {
    const v = dateInput.trim();
    if (!v) return;
    const d = new Date(v);
    if (isNaN(d.getTime())) { setResult('Invalid date'); return; }
    const sec = Math.floor(d.getTime() / 1000);
    setResult(`Seconds: ${sec}\nMilliseconds: ${d.getTime()}\nISO: ${d.toISOString()}`);
  };

  return (
    <ToolLayout
      title="Timestamp Converter"
      description={[
        'Convert Unix timestamps to human-readable dates and vice versa. Supports both seconds and milliseconds.',
        'See the current Unix timestamp live. All conversions happen in your browser — fast, free, and private.',
      ]}
      howTo={{
        steps: [
          'View the current Unix timestamp displayed live at the top.',
          'To convert a timestamp: enter a Unix timestamp (seconds or milliseconds) and click "Convert Timestamp".',
          'To convert a date: enter a date string (e.g., 2024-01-15 12:00:00) and click "Convert Date".',
          'Copy any result using the Copy button.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Timestamp Converter', url: 'https://snaptools.dev/timestamp-converter',
        description: 'Free online Unix timestamp converter. Convert timestamps to dates and dates to timestamps.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Timestamp Converter</h2>

        <div className="glass rounded-2xl p-6 mb-6 text-center">
          <div className="text-sm text-gray-500 mb-1">Current Unix Timestamp</div>
          <div className="text-3xl font-bold text-gray-900 font-mono">{now}</div>
          <div className="mt-1">
            <CopyButton text={now.toString()} label="Copy" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Timestamp → Date</h3>
            <Input
              label="Unix Timestamp"
              type="text"
              value={tsInput}
              onChange={e => setTsInput(e.target.value)}
              placeholder="e.g., 1700000000"
            />
            <div className="mt-3">
              <Button onClick={convertTimestamp}>Convert Timestamp</Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Date → Timestamp</h3>
            <Input
              label="Date String"
              type="text"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              placeholder="e.g., 2024-01-15 12:00:00"
            />
            <div className="mt-3">
              <Button onClick={convertDate}>Convert Date</Button>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Result</span>
              <CopyButton text={result} />
            </div>
            <pre className="block w-full rounded-xl backdrop-blur-lg bg-white/30 border border-white/40 px-4 py-3 text-gray-900 font-mono text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
