'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What numbers are supported?', a: 'Numbers up to the trillions (999,999,999,999,999) are supported, including negative numbers and decimals.' },
  { q: 'How does currency mode work?', a: 'Currency mode formats the number as US dollars and cents. For example, 1234.56 becomes "one thousand two hundred thirty-four dollars and fifty-six cents".' },
  { q: 'Are decimal numbers supported?', a: 'Yes. Decimal digits are spoken individually. For example, 3.14 becomes "three point one four".' },
  { q: 'Is my data sent to a server?', a: 'No. All conversion happens entirely in your browser using JavaScript. No data is transmitted.' },
  { q: 'Can I use commas in the input?', a: 'Yes. Commas, spaces, and dollar signs are automatically stripped from the input so you can paste formatted numbers.' },
];

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

function convertHundreds(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
  return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + convertHundreds(n % 100) : '');
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (!isFinite(num)) return 'invalid number';

  let negative = false;
  if (num < 0) { negative = true; num = -num; }

  const intPart = Math.floor(num);
  const parts: string[] = [];
  let remaining = intPart;

  if (remaining === 0) {
    parts.push('zero');
  } else {
    let scaleIdx = 0;
    while (remaining > 0) {
      const chunk = remaining % 1000;
      if (chunk > 0) {
        const words = convertHundreds(chunk);
        parts.unshift(scales[scaleIdx] ? words + ' ' + scales[scaleIdx] : words);
      }
      remaining = Math.floor(remaining / 1000);
      scaleIdx++;
    }
  }

  let result = parts.join(' ');

  // Handle decimals
  const decStr = num.toString();
  const dotIdx = decStr.indexOf('.');
  if (dotIdx !== -1) {
    const decimals = decStr.slice(dotIdx + 1);
    result += ' point ' + decimals.split('').map(d => ones[+d] || 'zero').join(' ');
  }

  if (negative) result = 'negative ' + result;
  return result;
}

function numberToCurrency(num: number): string {
  const negative = num < 0;
  if (negative) num = -num;
  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);

  let result = '';
  if (dollars === 0) {
    result = 'zero dollars';
  } else {
    const intPart = Math.floor(dollars);
    const parts: string[] = [];
    let remaining = intPart;
    let scaleIdx = 0;
    while (remaining > 0) {
      const chunk = remaining % 1000;
      if (chunk > 0) {
        const words = convertHundreds(chunk);
        parts.unshift(scales[scaleIdx] ? words + ' ' + scales[scaleIdx] : words);
      }
      remaining = Math.floor(remaining / 1000);
      scaleIdx++;
    }
    result = parts.join(' ') + (dollars === 1 ? ' dollar' : ' dollars');
  }

  if (cents > 0) {
    result += ' and ' + convertHundreds(cents) + (cents === 1 ? ' cent' : ' cents');
  }

  if (negative) result = 'negative ' + result;
  return result;
}

export default function NumberToWords() {
  const [input, setInput] = useState('');
  const [currency, setCurrency] = useState(false);

  const clean = input.replace(/[$,\s]/g, '');
  const num = clean === '' ? NaN : Number(clean);
  const valid = !isNaN(num) && isFinite(num);
  const output = valid ? (currency ? numberToCurrency(num) : numberToWords(num)) : '';

  return (
    <ToolLayout
      title="Number to Words Converter"
      description={[
        'Convert any number to English words instantly. Supports numbers up to trillions, decimals, negatives, and currency mode.',
        'Type a number and see it converted to words in real-time. Perfect for writing checks, legal documents, or educational purposes.',
      ]}
      howTo={{
        steps: [
          'Type or paste a number in the input field.',
          'The number is instantly converted to English words as you type.',
          'Toggle currency mode for dollar/cents format.',
          'Copy the result with the copy button.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Number to Words Converter', url: 'https://snaptools.dev/number-to-words',
        description: 'Convert numbers to English words. Supports decimals, negatives, and currency mode.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Convert Number</h2>

        <div className="mb-4">
          <Input label="Enter a number" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 1234.56" />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 mb-5">
          <input type="checkbox" checked={currency} onChange={e => setCurrency(e.target.checked)} className="rounded" />
          💵 Currency mode (dollars and cents)
        </label>

        {valid && output && (
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-start gap-2">
              <p className="text-lg text-gray-800 leading-relaxed capitalize">{output}</p>
              <CopyButton text={output} />
            </div>
          </div>
        )}

        {input && !valid && (
          <p className="text-red-500 text-sm">Please enter a valid number.</p>
        )}

        <div className="mt-6 pt-4 border-t border-white/30">
          <p className="text-sm text-gray-500 mb-2">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {['42', '1234', '1000000', '-273.15', '1234.56'].map(ex => (
              <button key={ex} onClick={() => setInput(ex)} className="text-xs px-3 py-1 glass rounded-lg hover:bg-white/50 text-gray-600 transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
}
