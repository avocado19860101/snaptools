'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'How do I calculate what percentage one number is of another?', a: 'Use the "X is what % of Y?" mode. Enter the part (X) and whole (Y), and the calculator will show the percentage instantly.' },
  { q: 'How do I find the percentage change between two numbers?', a: 'Use the "% change from X to Y" mode. Enter the original value (X) and the new value (Y) to see the percentage increase or decrease.' },
  { q: 'Are the calculations accurate?', a: 'Yes, all calculations use standard mathematical formulas and are accurate to multiple decimal places.' },
  { q: 'Can I use decimal numbers?', a: 'Absolutely! You can enter any decimal number in any of the input fields for precise calculations.' },
  { q: 'Does this tool work offline?', a: 'Yes! All calculations happen in your browser using JavaScript. No internet connection is required after the page loads.' },
];

const modes = [
  { id: 'of', label: 'What is X% of Y?' },
  { id: 'is', label: 'X is what % of Y?' },
  { id: 'change', label: '% Change from X to Y' },
] as const;

type Mode = typeof modes[number]['id'];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const result = useMemo(() => {
    const va = parseFloat(a);
    const vb = parseFloat(b);
    if (isNaN(va) || isNaN(vb)) return '';
    if (mode === 'of') return parseFloat(((va / 100) * vb).toPrecision(10)).toString();
    if (mode === 'is') return vb === 0 ? 'Undefined' : parseFloat(((va / vb) * 100).toPrecision(10)).toString() + '%';
    return vb === 0 ? 'Undefined' : parseFloat((((vb - va) / Math.abs(va)) * 100).toPrecision(10)).toString() + '%';
  }, [a, b, mode]);

  const labelA = mode === 'of' ? 'Percentage (X%)' : mode === 'is' ? 'Value (X)' : 'Original Value (X)';
  const labelB = mode === 'of' ? 'Number (Y)' : mode === 'is' ? 'Total (Y)' : 'New Value (Y)';

  return (
    <ToolLayout
      title="Percentage Calculator"
      description={[
        'Calculate percentages instantly — find X% of a number, what percentage X is of Y, or the percentage change between two values.',
        'All calculations happen in your browser. Fast, free, and private.',
      ]}
      howTo={{
        steps: [
          'Select a calculation mode using the tabs.',
          'Enter the first value in the X field.',
          'Enter the second value in the Y field.',
          'See the result calculated instantly below.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Percentage Calculator', url: 'https://snaptools.dev/percentage-calculator',
        description: 'Free online percentage calculator. Find percentages, percentage of a number, and percentage change.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Calculate Percentage</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setA(''); setB(''); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                mode === m.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70 border border-white/40'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Input label={labelA} type="number" value={a} onChange={e => setA(e.target.value)} placeholder="Enter value" />
          <Input label={labelB} type="number" value={b} onChange={e => setB(e.target.value)} placeholder="Enter value" />
        </div>

        {result && (
          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-gray-500 mb-1">Result</div>
            <div className="text-2xl font-bold text-gray-900">{result}</div>
            <div className="mt-2">
              <CopyButton text={result} label="Copy Result" />
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
