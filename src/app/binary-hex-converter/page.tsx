'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What number formats are supported?', a: 'You can convert between Decimal, Binary, Octal, and Hexadecimal formats in any direction.' },
  { q: 'Does it support large numbers?', a: 'Yes. The converter uses BigInt internally, so it can handle arbitrarily large numbers without precision loss.' },
  { q: 'Is my data processed on a server?', a: 'No. All conversions happen instantly in your browser. Nothing is sent to any server.' },
  { q: 'What characters are valid for each format?', a: 'Binary: 0-1. Octal: 0-7. Decimal: 0-9. Hexadecimal: 0-9 and A-F (case-insensitive).' },
  { q: 'Can I convert negative numbers?', a: 'Currently, the tool supports non-negative integers only. Negative number support may be added in the future.' },
];

const formats = [
  { value: 'dec', label: 'Decimal (Base 10)' },
  { value: 'bin', label: 'Binary (Base 2)' },
  { value: 'oct', label: 'Octal (Base 8)' },
  { value: 'hex', label: 'Hexadecimal (Base 16)' },
];

const radixMap: Record<string, number> = { dec: 10, bin: 2, oct: 8, hex: 16 };

function parse(value: string, format: string): bigint | null {
  try {
    const v = value.trim();
    if (!v) return null;
    return BigInt(format === 'dec' ? v : `0${{ bin: 'b', oct: 'o', hex: 'x' }[format]}${v}`);
  } catch {
    return null;
  }
}

function formatNum(n: bigint, format: string): string {
  return n.toString(radixMap[format]).toUpperCase();
}

export default function BinaryHexConverter() {
  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState('dec');

  const parsed = parse(input, inputFormat);
  const outputs = formats.filter(f => f.value !== inputFormat).map(f => ({
    ...f,
    result: parsed !== null ? formatNum(parsed, f.value) : '',
  }));

  return (
    <ToolLayout
      title="Binary / Hex Converter"
      description={[
        'Convert numbers between Decimal, Binary, Octal, and Hexadecimal formats instantly.',
        'This tool processes everything in your browser with BigInt support for arbitrarily large numbers. No server, no limits.',
      ]}
      howTo={{
        steps: [
          'Select the input number format from the dropdown (Decimal, Binary, Octal, or Hex).',
          'Type or paste your number into the input field.',
          'All other formats are displayed simultaneously below.',
          'Click the Copy button next to any result to copy it to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Binary / Hex Converter', url: 'https://snaptools.dev/binary-hex-converter',
        description: 'Free online binary, hex, octal, and decimal converter. Supports large numbers.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Convert Numbers</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <Select label="Input Format" options={formats} value={inputFormat} onChange={e => { setInputFormat(e.target.value); setInput(''); }} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input label="Enter Number" value={input} onChange={e => setInput(e.target.value)} placeholder={`Enter a ${formats.find(f => f.value === inputFormat)?.label} number`} />
          </div>
        </div>

        {parsed !== null && (
          <div className="space-y-4">
            {outputs.map(o => (
              <div key={o.value} className="glass rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-1">{o.label}</div>
                  <div className="text-lg font-mono text-gray-900 break-all">{o.result}</div>
                </div>
                <CopyButton text={o.result} />
              </div>
            ))}
          </div>
        )}

        {input && parsed === null && (
          <p className="text-red-500 text-sm mt-2">Invalid input for the selected format.</p>
        )}
      </Card>
    </ToolLayout>
  );
}
