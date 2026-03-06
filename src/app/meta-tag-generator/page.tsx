'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What are meta tags?', a: 'Meta tags are HTML elements that provide metadata about a web page. They help search engines and social media platforms understand your content.' },
  { q: 'What are Open Graph tags?', a: 'Open Graph (OG) tags control how your page appears when shared on social media like Facebook, LinkedIn, and others.' },
  { q: 'What is a Twitter Card?', a: 'Twitter Cards are meta tags that control how your page is displayed when shared on Twitter/X, including title, description, and image.' },
  { q: 'How do I use the generated tags?', a: 'Copy the generated HTML and paste it inside the <head> section of your HTML document.' },
  { q: 'What is the ideal meta description length?', a: 'Google typically displays 150-160 characters. Keep your description concise and compelling within this range.' },
];

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [author, setAuthor] = useState('');

  const lines: string[] = [];
  if (title) lines.push(`<title>${title}</title>`, `<meta name="title" content="${title}" />`);
  if (description) lines.push(`<meta name="description" content="${description}" />`);
  if (keywords) lines.push(`<meta name="keywords" content="${keywords}" />`);
  if (author) lines.push(`<meta name="author" content="${author}" />`);
  lines.push('', '<!-- Open Graph / Facebook -->');
  lines.push(`<meta property="og:type" content="website" />`);
  if (title) lines.push(`<meta property="og:title" content="${title}" />`);
  if (description) lines.push(`<meta property="og:description" content="${description}" />`);
  if (url) lines.push(`<meta property="og:url" content="${url}" />`);
  if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}" />`);
  lines.push('', '<!-- Twitter -->');
  lines.push(`<meta property="twitter:card" content="${twitterCard}" />`);
  if (title) lines.push(`<meta property="twitter:title" content="${title}" />`);
  if (description) lines.push(`<meta property="twitter:description" content="${description}" />`);
  if (ogImage) lines.push(`<meta property="twitter:image" content="${ogImage}" />`);
  if (twitterSite) lines.push(`<meta property="twitter:site" content="${twitterSite}" />`);

  const code = lines.join('\n');

  return (
    <ToolLayout
      title="Meta Tag Generator"
      description={[
        'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page appears in Google search and social media.',
        'Fill in your page details to generate all the essential meta tags. Copy the HTML and paste it into your page\'s head section.',
      ]}
      howTo={{ steps: [
        'Enter your page title, description, and other details.',
        'Add Open Graph image URL for social media sharing.',
        'Select your preferred Twitter Card type.',
        'Preview the Google search and social card appearance, then copy the HTML code.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Meta Tag Generator', url: 'https://snaptools.dev/meta-tag-generator',
        description: 'Free meta tag generator for SEO, Open Graph, and Twitter Cards.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Page Details</h2>
        <div className="space-y-4">
          <Input label="Page Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Page" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description ({description.length}/160)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A brief description of your page..."
              maxLength={300}
              className="w-full h-20 p-3 rounded-xl glass border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none text-sm"
            />
          </div>
          <Input label="Keywords (comma-separated)" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" />
          <Input label="Author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="John Doe" />
          <Input label="Page URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" />
          <Input label="OG Image URL" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          <div className="flex gap-4">
            <div className="flex-1">
              <Select label="Twitter Card Type" value={twitterCard} onChange={e => setTwitterCard(e.target.value)} options={[
                { value: 'summary_large_image', label: 'Summary Large Image' },
                { value: 'summary', label: 'Summary' },
              ]} />
            </div>
            <div className="flex-1">
              <Input label="Twitter @handle" value={twitterSite} onChange={e => setTwitterSite(e.target.value)} placeholder="@username" />
            </div>
          </div>
        </div>
      </Card>

      {title && (
        <>
          <Card padding="lg" className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Google Search Preview</h2>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-green-700 truncate">{url || 'https://example.com'}</p>
              <p className="text-lg text-blue-700 font-medium truncate hover:underline">{title}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{description || 'No description provided.'}</p>
            </div>
          </Card>

          <Card padding="lg" className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Card Preview</h2>
            <div className="glass rounded-xl overflow-hidden max-w-md">
              {ogImage && (
                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase">{url ? new URL(url).hostname : 'example.com'}</p>
                <p className="font-semibold text-gray-900 truncate">{title}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
              </div>
            </div>
          </Card>
        </>
      )}

      <Card padding="lg" className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-900">Generated HTML</h2>
          <CopyButton text={code} label="Copy HTML" />
        </div>
        <pre className="p-4 rounded-xl glass font-mono text-sm text-gray-700 overflow-x-auto whitespace-pre max-h-80 overflow-y-auto">{code}</pre>
      </Card>
    </ToolLayout>
  );
}
