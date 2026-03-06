'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is a URL slug?', a: 'A URL slug is the part of a URL that identifies a page in a human-readable form. For example, in "example.com/my-awesome-post", "my-awesome-post" is the slug.' },
  { q: 'Why are slugs important for SEO?', a: 'SEO-friendly slugs help search engines understand your page content. Short, descriptive slugs with keywords can improve your search rankings and click-through rates.' },
  { q: 'What characters are allowed in a URL slug?', a: 'Slugs typically contain lowercase letters, numbers, and hyphens. Special characters, spaces, and accented letters are converted or removed to ensure URL compatibility.' },
  { q: 'What are stop words and should I remove them?', a: 'Stop words are common words like "the", "is", "at", "and". Removing them makes slugs shorter and more focused. For example, "the-best-way-to-learn" becomes "best-way-learn".' },
  { q: 'Can I use underscores instead of hyphens?', a: 'Yes, but Google recommends hyphens over underscores for URL slugs. Hyphens are treated as word separators, while underscores are not, which can affect SEO.' },
];

const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'it', 'that', 'this', 'was', 'are', 'be', 'has', 'had', 'have', 'from', 'as', 'not', 'were', 'been', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should']);

function transliterate(str: string): string {
  const map: Record<string, string> = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae',
    'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i',
    'î': 'i', 'ï': 'i', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o',
    'ö': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y',
    'ÿ': 'y', 'ß': 'ss', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'ł': 'l', 'ő': 'o',
    'ű': 'u', 'ą': 'a', 'ę': 'e', 'ś': 's', 'ź': 'z', 'ż': 'z', 'ć': 'c',
    'ń': 'n', 'ř': 'r', 'š': 's', 'ž': 'z', 'č': 'c', 'ě': 'e', 'ů': 'u',
    'ă': 'a', 'ș': 's', 'ț': 't',
  };
  return str.split('').map(c => map[c.toLowerCase()] || c).join('');
}

function generateSlug(text: string, separator: string, lowercase: boolean, maxLength: number, removeStopWords: boolean): string {
  let s = transliterate(text);
  if (lowercase) s = s.toLowerCase();
  s = s.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/[\s-_]+/g, ' ').trim();
  let words = s.split(' ');
  if (removeStopWords) words = words.filter(w => !stopWords.has(w.toLowerCase()));
  s = words.join(separator);
  if (maxLength > 0 && s.length > maxLength) {
    s = s.substring(0, maxLength);
    const lastSep = s.lastIndexOf(separator);
    if (lastSep > 0) s = s.substring(0, lastSep);
  }
  return s;
}

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);
  const [removeStop, setRemoveStop] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  const slug = input ? generateSlug(input, separator, lowercase, maxLength, removeStop) : '';
  const bulkOutput = bulkInput
    ? bulkInput.split('\n').filter(l => l.trim()).map(l => generateSlug(l.trim(), separator, lowercase, maxLength, removeStop)).join('\n')
    : '';

  return (
    <ToolLayout
      title="Slug Generator"
      description={[
        'Convert any text into a clean, URL-friendly slug. Perfect for blog posts, product pages, and SEO-friendly URLs.',
        'Handles special characters, accents, and transliteration automatically. Supports bulk conversion for multiple titles at once.',
      ]}
      howTo={{
        steps: [
          'Enter your text (article title, product name, etc.) in the input field.',
          'Customize options: separator character, case, max length, and stop word removal.',
          'See the generated slug update in real-time as you type.',
          'Copy the slug or switch to bulk mode to convert multiple titles at once.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Slug Generator', url: 'https://snaptools.dev/slug-generator',
        description: 'Free URL slug generator. Convert text to SEO-friendly slugs with transliteration and bulk support.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-900">{bulkMode ? 'Bulk Slug Generator' : 'Slug Generator'}</h2>
          <Button variant="ghost" size="sm" onClick={() => setBulkMode(!bulkMode)}>{bulkMode ? 'Single Mode' : 'Bulk Mode'}</Button>
        </div>

        <div className="flex flex-wrap gap-4 items-end mb-5">
          <div className="w-36">
            <Select label="Separator" value={separator} onChange={e => setSeparator(e.target.value)} options={[{ value: '-', label: 'Hyphen (-)' }, { value: '_', label: 'Underscore (_)' }]} />
          </div>
          <div className="w-28">
            <Input label="Max Length" type="number" value={maxLength || ''} onChange={e => setMaxLength(+e.target.value)} placeholder="0 = none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
            <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} className="rounded" /> Lowercase
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
            <input type="checkbox" checked={removeStop} onChange={e => setRemoveStop(e.target.checked)} className="rounded" /> Remove stop words
          </label>
        </div>

        {!bulkMode ? (
          <>
            <Input label="Input Text" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., How to Build a REST API with Node.js" />
            {slug && (
              <div className="mt-4 glass rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Generated Slug</span>
                  <CopyButton text={slug} />
                </div>
                <code className="block text-lg font-mono text-primary-600 break-all">{slug}</code>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Input Titles (one per line)</label>
              <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)} rows={6} placeholder={"How to Build a REST API\nTop 10 JavaScript Frameworks\nLe café de la résistance"} className="block w-full rounded-xl backdrop-blur-lg bg-white/50 border border-white/40 px-4 py-2.5 text-gray-900 transition-all duration-200 focus:bg-white/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono text-sm" />
            </div>
            {bulkOutput && (
              <div className="mt-4 glass rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Generated Slugs</span>
                  <CopyButton text={bulkOutput} label="Copy All" />
                </div>
                <pre className="text-sm font-mono text-primary-600 whitespace-pre-wrap break-all">{bulkOutput}</pre>
              </div>
            )}
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
