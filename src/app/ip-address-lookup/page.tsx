'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'Do you store my IP address?', a: 'No. We don\'t store, log, or track your IP address. The lookup is performed by third-party APIs directly from your browser.' },
  { q: 'How is my IP address detected?', a: 'We use the ipify API to detect your public IP address, and ipapi.co to fetch geolocation data. Both requests are made from your browser.' },
  { q: 'Why does my IP location seem inaccurate?', a: 'IP geolocation is approximate and based on your ISP\'s registered location. Using a VPN or proxy will show the VPN server\'s location instead.' },
  { q: 'What is the difference between IPv4 and IPv6?', a: 'IPv4 uses 32-bit addresses (e.g., 192.168.1.1) while IPv6 uses 128-bit addresses. Most networks still primarily use IPv4.' },
  { q: 'Can I look up a different IP address?', a: 'Currently this tool shows your own public IP address. For looking up other IPs, you can use the ipapi.co website directly.' },
];

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string;
  timezone?: string;
  org?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
}

export default function IpAddressLookup() {
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipRes.json();
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();
        setInfo({ ip, ...geo });
      } catch {
        setError('Failed to fetch IP information. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allText = info ? `IP: ${info.ip}\nCity: ${info.city || 'N/A'}\nRegion: ${info.region || 'N/A'}\nCountry: ${info.country_name || 'N/A'}\nTimezone: ${info.timezone || 'N/A'}\nISP: ${info.org || 'N/A'}\nPostal: ${info.postal || 'N/A'}` : '';

  const rows: [string, string][] = info ? [
    ['IP Address', info.ip],
    ['City', info.city || 'N/A'],
    ['Region', info.region || 'N/A'],
    ['Country', info.country_name || 'N/A'],
    ['Timezone', info.timezone || 'N/A'],
    ['ISP', info.org || 'N/A'],
    ['Postal Code', info.postal || 'N/A'],
  ] : [];

  return (
    <ToolLayout
      title="IP Address Lookup"
      description={[
        'Instantly find your public IP address and geolocation details including city, region, country, timezone, and ISP.',
        'Your IP is detected directly in your browser. We never store or log your information.',
      ]}
      howTo={{ steps: [
        'Open this page — your IP address is detected automatically.',
        'View your IP address, city, region, country, timezone, and ISP.',
        'Click "Copy" to copy your IP address to the clipboard.',
        'Use "Copy All Info" to copy all details at once.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'IP Address Lookup', url: 'https://snaptools.dev/ip-address-lookup',
        description: 'Free IP address lookup tool. Find your public IP and geolocation.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Your IP Information</h2>
        {loading && <p className="text-gray-500">Detecting your IP address...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {info && (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl font-mono font-bold text-gray-900 mb-2">{info.ip}</div>
              <CopyButton text={info.ip} label="Copy IP" />
            </div>
            <div className="space-y-3">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between glass rounded-xl px-4 py-3">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="text-gray-900 font-medium text-sm">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <CopyButton text={allText} label="Copy All Info" />
            </div>
          </>
        )}
      </Card>
    </ToolLayout>
  );
}
