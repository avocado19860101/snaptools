'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'How do I calculate a tip?', a: 'Multiply the bill amount by the tip percentage. For example, a 20% tip on $50 is $50 × 0.20 = $10.' },
  { q: 'What is a standard tip percentage?', a: 'In the US, 15-20% is standard for restaurant dining. 18-20% is common for good service.' },
  { q: 'Does this tool handle bill splitting?', a: 'Yes! Enter the number of people and the calculator will show the per-person amount including tip.' },
  { q: 'Is my data stored?', a: 'No. All calculations happen in your browser. Nothing is sent to any server.' },
  { q: 'Can I enter a custom tip percentage?', a: 'Yes. Use the preset buttons for quick selection or type any custom percentage.' },
];

const presets = [10, 15, 18, 20, 25];

function fmt(n: number) { return '$' + n.toFixed(2); }

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState('1');

  const billNum = parseFloat(bill) || 0;
  const peopleNum = Math.max(parseInt(people) || 1, 1);
  const tipAmt = billNum * tipPct / 100;
  const total = billNum + tipAmt;
  const perPerson = total / peopleNum;

  return (
    <ToolLayout
      title="Tip Calculator"
      description={[
        'Quickly calculate the tip and total for any bill. Split the check between multiple people with ease.',
        'Choose from preset tip percentages or enter a custom amount. All calculations are instant and run in your browser.',
      ]}
      howTo={{
        steps: [
          'Enter the bill amount.',
          'Select a tip percentage using the preset buttons or type a custom value.',
          'Enter the number of people to split the bill.',
          'View the tip amount, total, and per-person cost instantly.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Tip Calculator', url: 'https://snaptools.dev/tip-calculator',
        description: 'Free online tip calculator. Calculate tips and split bills instantly.',
        applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Calculate Tip</h2>

        <div className="mb-5 w-48">
          <Input label="Bill Amount ($)" type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="85.00" />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tip Percentage</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {presets.map(p => (
              <Button key={p} variant={tipPct === p ? 'primary' : 'ghost'} size="sm" onClick={() => setTipPct(p)}>{p}%</Button>
            ))}
          </div>
          <div className="w-32">
            <Input label="Custom %" type="number" value={tipPct} onChange={e => setTipPct(parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        <div className="mb-5 w-36">
          <Input label="Split Between" type="number" value={people} onChange={e => setPeople(e.target.value)} min={1} />
        </div>

        {billNum > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/30">
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-sm text-gray-500">Tip Amount</div>
              <div className="text-2xl font-bold text-gray-900">{fmt(tipAmt)}</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900">{fmt(total)}</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-sm text-gray-500">Per Person</div>
              <div className="text-2xl font-bold text-primary-600">{fmt(perPerson)}</div>
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
