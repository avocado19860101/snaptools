'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'Is my card number stored or sent anywhere?', a: 'No. Validation happens entirely in your browser. Your card number is never transmitted or stored.' },
  { q: 'What is the Luhn algorithm?', a: 'The Luhn algorithm is a checksum formula used to validate identification numbers like credit card numbers. It detects accidental errors in the number.' },
  { q: 'Can this tool charge my card?', a: 'Absolutely not. This tool only checks if the number format is mathematically valid. It cannot make transactions or verify if the card is active.' },
  { q: 'What card types are detected?', a: 'We detect Visa, Mastercard, American Express, Discover, JCB, Diners Club, and UnionPay based on the card number prefix (IIN/BIN).' },
  { q: 'Why does my card show as invalid?', a: 'The number may have a typo, missing digits, or fail the Luhn checksum. Double-check the number and try again.' },
];

type CardType = { name: string; icon: string; pattern: RegExp; lengths: number[]; format: number[] };

const cardTypes: CardType[] = [
  { name: 'American Express', icon: '💳🟢', pattern: /^3[47]/, lengths: [15], format: [4, 6, 5] },
  { name: 'Visa', icon: '💳🔵', pattern: /^4/, lengths: [13, 16, 19], format: [4, 4, 4, 4, 3] },
  { name: 'Mastercard', icon: '💳🔴', pattern: /^(5[1-5]|2[2-7])/, lengths: [16], format: [4, 4, 4, 4] },
  { name: 'Discover', icon: '💳🟠', pattern: /^(6011|65|64[4-9])/, lengths: [16, 19], format: [4, 4, 4, 4, 3] },
  { name: 'JCB', icon: '💳🟣', pattern: /^35(2[89]|[3-8])/, lengths: [16, 17, 18, 19], format: [4, 4, 4, 4, 3] },
  { name: 'Diners Club', icon: '💳⚪', pattern: /^(30[0-5]|36|38)/, lengths: [14, 16], format: [4, 6, 4, 2] },
  { name: 'UnionPay', icon: '💳🔵', pattern: /^62/, lengths: [16, 17, 18, 19], format: [4, 4, 4, 4, 3] },
];

function detectCardType(num: string): CardType | null {
  for (const ct of cardTypes) {
    if (ct.pattern.test(num)) return ct;
  }
  return null;
}

function luhnCheck(num: string): boolean {
  if (num.length === 0) return false;
  let sum = 0;
  let alternate = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function formatNumber(num: string, format: number[]): string {
  const parts: string[] = [];
  let pos = 0;
  for (const len of format) {
    if (pos >= num.length) break;
    parts.push(num.slice(pos, pos + len));
    pos += len;
  }
  return parts.join(' ');
}

export default function CreditCardValidator() {
  const [raw, setRaw] = useState('');

  const digits = raw.replace(/\D/g, '');
  const cardType = detectCardType(digits);
  const formatted = cardType ? formatNumber(digits, cardType.format) : formatNumber(digits, [4, 4, 4, 4, 3]);
  const isValid = digits.length >= 12 && luhnCheck(digits);
  const hasEnoughDigits = digits.length >= 12;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^\d ]/g, '');
    setRaw(v);
  };

  return (
    <ToolLayout
      title="Credit Card Validator"
      description={[
        'Validate credit card numbers using the Luhn algorithm and detect the card network. Completely client-side — your card number never leaves your browser.',
        'This educational tool checks if a credit card number is mathematically valid and identifies whether it belongs to Visa, Mastercard, Amex, Discover, JCB, Diners Club, or UnionPay.',
      ]}
      howTo={{
        steps: [
          'Enter or paste a credit card number in the input field.',
          'The card type is automatically detected from the number prefix.',
          'The number is formatted with spaces as you type for easy reading.',
          'The Luhn algorithm validates the checksum in real-time.',
          'View the result showing whether the number is valid or invalid.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Credit Card Validator', url: 'https://snaptools.dev/credit-card-validator',
        description: 'Free online credit card validator using the Luhn algorithm. Detect card type and validate numbers.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Validate a Card Number</h2>

        <div className="mb-6">
          <Input
            label="Credit Card Number"
            type="text"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={formatted}
            onChange={handleChange}
            maxLength={23}
          />
        </div>

        {digits.length > 0 && (
          <div className="space-y-4">
            {/* Card Type */}
            <div className="glass rounded-2xl p-5">
              <div className="text-sm text-gray-500 mb-1">Card Network</div>
              <div className="text-lg font-semibold text-gray-900">
                {cardType ? `${cardType.icon} ${cardType.name}` : '❓ Unknown'}
              </div>
            </div>

            {/* Validation Result */}
            {hasEnoughDigits && (
              <div className={`rounded-2xl p-5 ${isValid ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="text-sm text-gray-500 mb-1">Luhn Check</div>
                <div className={`text-lg font-semibold ${isValid ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isValid ? '✅ Valid — Checksum passes' : '❌ Invalid — Checksum fails'}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="glass rounded-2xl p-5">
              <div className="text-sm text-gray-500 mb-2">Details</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Digits:</span> <span className="font-medium text-gray-900">{digits.length}</span></div>
                <div><span className="text-gray-500">Expected:</span> <span className="font-medium text-gray-900">{cardType ? cardType.lengths.join(' or ') : '13–19'}</span></div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Educational section */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How the Luhn Algorithm Works</h2>
        <div className="space-y-3 text-gray-600 leading-relaxed">
          <p>The Luhn algorithm (also called the &quot;modulus 10&quot; algorithm) is a simple checksum formula used to validate credit card numbers, IMEI numbers, and other identification numbers.</p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Start from the rightmost digit</strong> and move left, doubling every second digit.</li>
            <li><strong>If doubling results in a number greater than 9</strong>, subtract 9 from it.</li>
            <li><strong>Sum all the digits</strong> (both doubled and undoubled).</li>
            <li><strong>If the total modulo 10 equals 0</strong>, the number is valid.</li>
          </ol>
          <p>For example: <code className="bg-white/40 px-2 py-0.5 rounded">4539 1488 0343 6467</code> → after processing, the sum is 70, and 70 mod 10 = 0, so it&apos;s valid.</p>
        </div>
      </Card>
    </ToolLayout>
  );
}
