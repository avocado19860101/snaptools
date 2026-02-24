import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://snaptools.dev';
  const pages = [
    '', '/image-resizer', '/image-compressor', '/qr-code-generator',
    '/word-counter', '/password-generator', '/color-picker', '/text-case-converter',
    '/about', '/contact', '/privacy-policy', '/terms-of-service',
  ];
  return pages.map(p => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 }));
}
