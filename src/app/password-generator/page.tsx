'use client';
import { useState, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import AdPlaceholder from '@/components/AdPlaceholder';

const faqItems = [
  { q: 'Are the passwords truly random?', a: 'Yes. We use the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure random numbers.' },
  { q: 'Is my password stored anywhere?', a: 'No. Passwords are generated entirely in your browser and never sent to any server. Once you close the page, the password exists only where you saved it.' },
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
  const [copied, setCopied] = useState(false);

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
    setCopied(false);
  }, [length, upper, lower, numbers, symbols]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = () => {
    let pool = 0;
    if (lower) pool += 26;
    if (upper) pool += 26;
    if (numbers) pool += 10;
    if (symbols) pool += 26;
    const entropy = length * Math.log2(pool || 1);
    if (entropy >= 80) return { label: 'Very Strong', color: 'text-green-600' };
    if (entropy >= 60) return { label: 'Strong', color: 'text-blue-600' };
    if (entropy >= 40) return { label: 'Moderate', color: 'text-yellow-600' };
    return { label: 'Weak', color: 'text-red-600' };
  };

  const s = strength();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Generator</h1>
      <p className="text-gray-600 mb-2">Create strong, secure, and random passwords instantly. Using weak or reused passwords puts your accounts at risk. Our generator uses cryptographically secure randomness to create passwords that are virtually impossible to crack.</p>
      <p className="text-gray-600 mb-8">Everything runs in your browser — generated passwords are never transmitted or stored anywhere. Customize length and character types to meet any website&apos;s requirements.</p>

      <AdPlaceholder slot="above-tool" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate Password</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Length: {length}</label>
          <input type="range" min="6" max="64" value={length} onChange={e => setLength(+e.target.value)} className="w-full max-w-md" />
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { label: 'Uppercase (A-Z)', checked: upper, set: setUpper },
            { label: 'Lowercase (a-z)', checked: lower, set: setLower },
            { label: 'Numbers (0-9)', checked: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', checked: symbols, set: setSymbols },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={opt.checked} onChange={e => opt.set(e.target.checked)} className="rounded" /> {opt.label}
            </label>
          ))}
        </div>
        <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg">Generate Password</button>
        {password && (
          <div className="mt-6">
            <div className="bg-gray-50 border rounded-lg p-4 font-mono text-lg break-all mb-2">{password}</div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${s.color}`}>Strength: {s.label}</span>
              <button onClick={copy} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{copied ? '✓ Copied!' : 'Copy to clipboard'}</button>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="between-content" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Password Generator</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Set your desired password length using the slider (6-64 characters).</li>
          <li>Select which character types to include: uppercase, lowercase, numbers, symbols.</li>
          <li>Click &quot;Generate Password&quot; to create a new random password.</li>
          <li>Click &quot;Copy to clipboard&quot; to copy it and paste it into your password manager or sign-up form.</li>
        </ol>
      </section>

      <FAQ items={faqItems} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Password Generator', url: 'https://snaptools.dev/password-generator',
        description: 'Free online secure password generator with customizable options.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })}} />
    </div>
  );
}
