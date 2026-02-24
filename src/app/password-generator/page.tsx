'use client';
import { useState, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Slider, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'Are the passwords truly random?', a: 'Yes. We use the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure random numbers.' },
  { q: 'Is my password stored anywhere?', a: 'No. Passwords are generated entirely in your browser and never sent to any server.' },
  { q: 'How long should my password be?', a: 'We recommend at least 16 characters with a mix of uppercase, lowercase, numbers, and symbols for strong security.' },
  { q: 'Can I use this for important accounts?', a: 'Absolutely. The passwords are cryptographically random and generated locally, making them suitable for any account.' },
];

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    let chars = '';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setPassword('Select at least one option'); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, v => chars[v % chars.length]).join(''));
  }, [length, upper, lower, numbers, symbols]);

  const strength = () => {
    let pool = 0;
    if (lower) pool += 26;
    if (upper) pool += 26;
    if (numbers) pool += 10;
    if (symbols) pool += 26;
    const entropy = length * Math.log2(pool || 1);
    if (entropy >= 80) return { label: 'Very Strong', color: 'text-success-dark', bg: 'bg-success/15' };
    if (entropy >= 60) return { label: 'Strong', color: 'text-primary-600', bg: 'bg-primary-500/15' };
    if (entropy >= 40) return { label: 'Moderate', color: 'text-warning-dark', bg: 'bg-warning/15' };
    return { label: 'Weak', color: 'text-error-dark', bg: 'bg-error/15' };
  };

  const s = strength();

  return (
    <ToolLayout
      title="Password Generator"
      description={[
        'Create strong, secure, and random passwords instantly. Our generator uses cryptographically secure randomness.',
        'Everything runs in your browser — generated passwords are never transmitted or stored anywhere.',
      ]}
      howTo={{
        steps: [
          'Set your desired password length using the slider (6-64 characters).',
          'Select which character types to include.',
          'Click "Generate Password" to create a new random password.',
          'Click "Copy" to copy it to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Password Generator', url: 'https://snaptools.dev/password-generator',
        description: 'Free online secure password generator with customizable options.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Generate Password</h2>

        <div className="mb-5 max-w-md">
          <Slider label="Length" value={length} onChange={setLength} min={6} max={64} />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { label: 'Uppercase (A-Z)', checked: upper, set: setUpper },
            { label: 'Lowercase (a-z)', checked: lower, set: setLower },
            { label: 'Numbers (0-9)', checked: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', checked: symbols, set: setSymbols },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={e => opt.set(e.target.checked)} className="rounded accent-primary-600" /> {opt.label}
            </label>
          ))}
        </div>

        <Button onClick={generate} size="lg">Generate Password</Button>

        {password && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="glass-subtle rounded-xl p-4 font-mono text-lg break-all mb-3">{password}</div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${s.color} ${s.bg}`}>
                {s.label}
              </span>
              <CopyButton text={password} label="Copy to clipboard" />
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
