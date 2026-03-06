'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is a JWT?', a: 'A JSON Web Token (JWT) is an open standard (RFC 7519) for securely transmitting information as a JSON object between parties.' },
  { q: 'Is my JWT sent to a server?', a: 'No. The JWT is decoded entirely in your browser using base64 decoding. Nothing is transmitted.' },
  { q: 'Can this verify JWT signatures?', a: 'This tool decodes and displays JWTs but does not verify cryptographic signatures, as that requires the secret key.' },
  { q: 'What does the expiration check do?', a: 'If the payload contains an "exp" claim, we compare it to the current time to show whether the token has expired.' },
  { q: 'What JWT formats are supported?', a: 'Standard JWTs with three dot-separated Base64URL-encoded parts: header.payload.signature.' },
];

function b64decode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(atob(padded).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
}

export default function JwtDecoder() {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [expInfo, setExpInfo] = useState('');

  const decode = () => {
    setError(''); setHeader(''); setPayload(''); setSignature(''); setExpInfo('');
    const parts = jwt.trim().split('.');
    if (parts.length !== 3) { setError('Invalid JWT format. Expected 3 dot-separated parts.'); return; }
    try {
      const h = JSON.parse(b64decode(parts[0]));
      const p = JSON.parse(b64decode(parts[1]));
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setSignature(parts[2]);
      if (p.exp) {
        const expDate = new Date(p.exp * 1000);
        const expired = expDate.getTime() < Date.now();
        setExpInfo(`${expired ? '❌ Expired' : '✅ Valid'} — Expires: ${expDate.toLocaleString()}`);
      }
    } catch { setError('Failed to decode JWT. Check that it is properly formatted.'); }
  };

  const colors = jwt.trim().split('.').length === 3;
  const parts = jwt.trim().split('.');

  return (
    <ToolLayout
      title="JWT Decoder"
      description={[
        'Decode JSON Web Tokens instantly. View the header, payload, and signature with color-coded formatting.',
        'Paste any JWT to decode it locally in your browser. Check expiration status and copy individual sections.',
      ]}
      howTo={{ steps: [
        'Paste your JWT token into the input field.',
        'Click "Decode JWT" to parse the token.',
        'View the decoded header (algorithm, type) and payload (claims, data).',
        'Check the expiration status if the token has an "exp" claim.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'JWT Decoder', url: 'https://snaptools.dev/jwt-decoder',
        description: 'Free online JWT decoder. Decode and inspect JSON Web Tokens.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Paste JWT</h2>
        <textarea
          value={jwt}
          onChange={e => setJwt(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
          className="w-full h-28 p-4 rounded-xl glass border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono text-sm"
        />
        {colors && parts.length === 3 && (
          <div className="mt-2 font-mono text-xs break-all">
            <span className="text-red-500">{parts[0]}</span>.<span className="text-purple-500">{parts[1]}</span>.<span className="text-blue-500">{parts[2]}</span>
          </div>
        )}
        <div className="mt-4">
          <Button onClick={decode} size="lg">Decode JWT</Button>
        </div>
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
      </Card>

      {header && (
        <div className="space-y-4 mt-6">
          {expInfo && (
            <Card padding="md">
              <p className="font-medium text-gray-900">{expInfo}</p>
            </Card>
          )}
          <Card padding="lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-red-500">Header</h3>
              <CopyButton text={header} />
            </div>
            <pre className="p-3 rounded-xl glass font-mono text-sm text-gray-700 whitespace-pre overflow-x-auto">{header}</pre>
          </Card>
          <Card padding="lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-purple-500">Payload</h3>
              <CopyButton text={payload} />
            </div>
            <pre className="p-3 rounded-xl glass font-mono text-sm text-gray-700 whitespace-pre overflow-x-auto">{payload}</pre>
          </Card>
          <Card padding="lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-blue-500">Signature</h3>
              <CopyButton text={signature} />
            </div>
            <p className="p-3 rounded-xl glass font-mono text-sm text-gray-700 break-all">{signature}</p>
          </Card>
        </div>
      )}
    </ToolLayout>
  );
}
