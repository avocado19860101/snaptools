'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton, FileDropzone } from '@/components/ui';

const faqItems = [
  { q: 'Is my data sent to a server?', a: 'No. All hashing is performed in your browser using the Web Crypto API and a local MD5 implementation. Nothing leaves your device.' },
  { q: 'What hash algorithms are supported?', a: 'MD5, SHA-1, SHA-256, SHA-384, and SHA-512. All SHA variants use the native Web Crypto API.' },
  { q: 'Can I hash files?', a: 'Yes. Upload any file and all hashes will be computed from the file contents.' },
  { q: 'Is MD5 secure?', a: 'MD5 is considered cryptographically broken and should not be used for security. It is still useful for checksums and data integrity verification.' },
  { q: 'Is there a size limit for file hashing?', a: 'There is no hard limit, but very large files may take a while depending on your device.' },
];

/* Minimal MD5 implementation */
function md5(input: Uint8Array): string {
  function toWord(s: Uint8Array) {
    const l = s.length, w: number[] = [];
    for (let i = 0; i < l * 8; i += 32) w[i >> 5] |= (s[i >> 3] & 0xff) << (i % 32);
    return w;
  }
  function fromWord(w: number[]) {
    const s: string[] = [];
    for (let i = 0; i < w.length * 32; i += 8) s.push(String.fromCharCode((w[i >> 5] >>> (i % 32)) & 0xff));
    return s.join('');
  }
  function add(a: number, b: number) { const l = (a & 0xffff) + (b & 0xffff); return (((a >> 16) + (b >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) { const r = add(add(a, q), add(x, t)); return add((r << s) | (r >>> (32 - s)), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

  const n = input.length;
  const x = toWord(input);
  x[n >> 2] |= 0x80 << ((n % 4) * 8);
  x[(((n + 8) >>> 6) << 4) + 14] = n * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const oa = a, ob = b, oc = c, od = d;
    a=ff(a,b,c,d,x[i],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);
    a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);
    a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
    a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329);
    a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i],20,-373897302);
    a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);
    a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);
    a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);
    a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);
    a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);
    a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);
    a=hh(a,b,c,d,x[i+9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+2],23,-995338651);
    a=ii(a,b,c,d,x[i],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
    a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);
    a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);
    a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);
    a=add(a,oa);b=add(b,ob);c=add(c,oc);d=add(d,od);
  }
  const hex = '0123456789abcdef';
  const raw = fromWord([a, b, c, d]);
  let out = '';
  for (let i = 0; i < raw.length; i++) { out += hex.charAt((raw.charCodeAt(i) >> 4) & 0xf) + hex.charAt(raw.charCodeAt(i) & 0xf); }
  return out;
}

async function shaHash(algo: string, data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest(algo, data.buffer as ArrayBuffer);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const algos = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [computing, setComputing] = useState(false);

  const compute = async (data: Uint8Array) => {
    setComputing(true);
    const result: Record<string, string> = {};
    result['MD5'] = md5(data);
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
      result[algo] = await shaHash(algo, data);
    }
    setHashes(result);
    setComputing(false);
  };

  const handleText = () => {
    compute(new TextEncoder().encode(input));
  };

  const handleFile = (file: File) => {
    setMode('file');
    const reader = new FileReader();
    reader.onload = (ev) => {
      compute(new Uint8Array(ev.target?.result as ArrayBuffer));
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description={[
        'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files instantly.',
        'Uses the Web Crypto API for SHA hashes and a built-in MD5 implementation. Everything runs in your browser.',
      ]}
      howTo={{
        steps: [
          'Enter text in the input field or upload a file.',
          'Click "Generate Hashes" (for text) or hashes auto-compute for files.',
          'View all hash values simultaneously.',
          'Click the copy button next to any hash to copy it to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Hash Generator', url: 'https://snaptools.dev/hash-generator',
        description: 'Free online hash generator. Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Input</h2>

        <div className="flex gap-3 mb-4">
          <Button variant={mode === 'text' ? 'primary' : 'ghost'} onClick={() => setMode('text')}>Text</Button>
          <Button variant={mode === 'file' ? 'primary' : 'ghost'} onClick={() => setMode('file')}>File</Button>
        </div>

        {mode === 'text' && (
          <>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full h-32 p-3 rounded-xl border border-white/30 bg-white/50 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none mb-4"
            />
            <Button onClick={handleText} size="lg" disabled={!input || computing}>{computing ? 'Computing...' : 'Generate Hashes'}</Button>
          </>
        )}

        {mode === 'file' && (
          <FileDropzone accept="*/*" onFile={handleFile} label="Drop any file here" sublabel="All file types supported" />
        )}
      </Card>

      {Object.keys(hashes).length > 0 && (
        <Card padding="lg" className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Hash Results</h2>
          <div className="space-y-4">
            {algos.map(algo => (
              <div key={algo}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{algo}</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 rounded-xl bg-white/50 border border-white/30 text-sm text-gray-900 break-all font-mono">{hashes[algo]}</code>
                  <CopyButton text={hashes[algo]} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
