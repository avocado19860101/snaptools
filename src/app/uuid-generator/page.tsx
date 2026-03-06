'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across space and time. Version 4 UUIDs are randomly generated.' },
  { q: 'Are these UUIDs truly unique?', a: 'Yes, UUID v4 uses cryptographically secure random numbers via crypto.randomUUID(), making collisions practically impossible.' },
  { q: 'What format options are available?', a: 'You can generate UUIDs in lowercase (default) or uppercase format, and bulk generate up to 100 at a time.' },
  { q: 'Is this generated on my device?', a: 'Yes, all UUIDs are generated locally in your browser using the Web Crypto API. Nothing is sent to a server.' },
  { q: 'Can I use these UUIDs in production?', a: 'Absolutely. These are standard RFC 4122 version 4 UUIDs suitable for databases, APIs, and any production use.' },
];

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);

  const generate = () => {
    const arr = Array.from({ length: Math.min(Math.max(count, 1), 100) }, () => {
      const id = crypto.randomUUID();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(arr);
  };

  const allText = uuids.join('\n');

  return (
    <ToolLayout
      title="UUID Generator"
      description={[
        'Generate UUID v4 identifiers instantly using your browser\'s crypto API. Bulk generate up to 100 UUIDs at once.',
        'All UUIDs are generated locally using cryptographically secure random numbers. Perfect for databases, APIs, and testing.',
      ]}
      howTo={{ steps: [
        'Set the number of UUIDs to generate (1-100).',
        'Choose uppercase or lowercase format.',
        'Click "Generate" to create your UUIDs.',
        'Copy individual UUIDs or all at once using the copy buttons.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'UUID Generator', url: 'https://snaptools.dev/uuid-generator',
        description: 'Free online UUID v4 generator. Bulk generate up to 100 UUIDs.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Generate UUIDs</h2>
        <div className="flex flex-wrap gap-3 items-end mb-5">
          <div className="w-32">
            <Input label="Count" type="number" min={1} max={100} value={count} onChange={e => setCount(+e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
            <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="rounded" /> Uppercase
          </label>
          <Button onClick={generate} size="lg">Generate</Button>
        </div>

        {uuids.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">{uuids.length} UUID{uuids.length > 1 ? 's' : ''} generated</span>
              <CopyButton text={allText} label="Copy All" />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-xl px-4 py-2 font-mono text-sm">
                  <span className="text-gray-900 break-all">{uuid}</span>
                  <CopyButton text={uuid} />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
