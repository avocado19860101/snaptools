'use client';
import { useState, useMemo, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What regex flags are supported?', a: 'You can toggle g (global), i (case-insensitive), m (multiline), s (dotAll), and u (unicode) flags.' },
  { q: 'How are matches highlighted?', a: 'All matches are highlighted in the test string with colored backgrounds. Each match group is also displayed separately.' },
  { q: 'Can I use capture groups?', a: 'Yes. Named and numbered capture groups are fully supported and displayed in the match details.' },
  { q: 'Is my data sent to a server?', a: 'No. All regex processing happens in your browser using JavaScript\'s built-in RegExp engine.' },
  { q: 'What are the preset patterns for?', a: 'Preset patterns provide common regex examples like email, URL, phone number, etc. Click one to load it instantly.' },
];

const presets = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { label: 'URL', pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+', flags: 'gi' },
  { label: 'Phone', pattern: '\\+?\\d[\\d\\s\\-().]{7,}\\d', flags: 'g' },
  { label: 'IPv4', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', flags: 'g' },
  { label: 'Hex Color', pattern: '#[0-9a-fA-F]{3,8}\\b', flags: 'gi' },
];

const flagList = ['g', 'i', 'm', 's', 'u'] as const;

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');
  const [recentPatterns, setRecentPatterns] = useState<{pattern: string; flags: string}[]>([]);

  // Load recent patterns on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snaptools-regex-recent');
      if (saved) setRecentPatterns(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveCurrentPattern = () => {
    if (!pattern) return;
    setRecentPatterns(prev => {
      const filtered = prev.filter(p => p.pattern !== pattern || p.flags !== flags);
      const updated = [{ pattern, flags }, ...filtered].slice(0, 10);
      localStorage.setItem('snaptools-regex-recent', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], error: '', highlighted: testStr };
    try {
      const re = new RegExp(pattern, flags);
      const ms: { match: string; index: number; groups: Record<string, string> }[] = [];
      let m: RegExpExecArray | null;
      if (flags.includes('g')) {
        while ((m = re.exec(testStr)) !== null) {
          ms.push({ match: m[0], index: m.index, groups: m.groups || {} });
          if (!m[0]) re.lastIndex++;
        }
      } else {
        m = re.exec(testStr);
        if (m) ms.push({ match: m[0], index: m.index, groups: m.groups || {} });
      }
      // build highlighted
      let h = '';
      let last = 0;
      ms.forEach(match => {
        h += testStr.slice(last, match.index);
        h += `<<MATCH>>${match.match}<</MATCH>>`;
        last = match.index + match.match.length;
      });
      h += testStr.slice(last);
      return { matches: ms, error: '', highlighted: h };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message, highlighted: testStr };
    }
  }, [pattern, flags, testStr]);

  return (
    <ToolLayout
      title="Regex Tester"
      description={[
        'Test and debug regular expressions with real-time matching and highlighting.',
        'Supports all JavaScript regex flags, capture groups, and includes common preset patterns.',
      ]}
      howTo={{ steps: [
        'Enter your regular expression pattern in the regex input field.',
        'Toggle flags (g, i, m, s, u) as needed.',
        'Type or paste your test string in the textarea.',
        'View highlighted matches and detailed match information below.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Regex Tester', url: 'https://snaptools.dev/regex-tester',
        description: 'Test regular expressions with real-time matching and highlighting. Free online regex tester.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Regex Tester</h2>
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input label="Regular Expression" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Enter regex pattern..." />
            </div>
            <button onClick={saveCurrentPattern} className="px-3 py-2 glass rounded-lg text-sm text-gray-600 hover:bg-white/50 transition-colors mb-0.5" title="Save pattern">💾</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {flagList.map(f => (
              <button key={f} onClick={() => toggleFlag(f)}
                className={`px-3 py-1 rounded-lg text-sm font-mono font-bold transition-colors ${flags.includes(f) ? 'bg-primary-500 text-white' : 'glass text-gray-600'}`}
              >{f}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {presets.map(p => (
              <button key={p.label} onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
                className="px-3 py-1 glass rounded-lg text-xs text-gray-600 hover:bg-white/50 transition-colors"
              >{p.label}</button>
            ))}
          </div>
          {recentPatterns.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Recent Patterns</p>
              <div className="flex gap-2 flex-wrap">
                {recentPatterns.map((p, i) => (
                  <button key={i} onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
                    className="px-3 py-1 glass rounded-lg text-xs font-mono text-gray-600 hover:bg-white/50 transition-colors max-w-[200px] truncate"
                    title={`/${p.pattern}/${p.flags}`}
                  >/{p.pattern.length > 20 ? p.pattern.slice(0, 20) + '…' : p.pattern}/{p.flags}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test String</label>
            <textarea
              value={testStr}
              onChange={e => setTestStr(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[120px] font-mono text-sm"
              placeholder="Enter test string..."
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {testStr && pattern && !error && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Matches</label>
              <div className="glass rounded-xl px-4 py-3 font-mono text-sm whitespace-pre-wrap break-all">
                {highlighted.split(/<<\/?MATCH>>/).map((part, i) =>
                  i % 2 === 1 ? <mark key={i} className="bg-yellow-300/70 rounded px-0.5">{part}</mark> : <span key={i}>{part}</span>
                )}
              </div>
            </div>
          )}

          {matches.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{matches.length} Match{matches.length > 1 ? 'es' : ''}</h3>
                <CopyButton text={matches.map(m => m.match).join('\n')} label="Copy Matches" />
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {matches.map((m, i) => (
                  <div key={i} className="glass rounded-xl px-4 py-2 text-sm">
                    <span className="text-gray-500 mr-2">#{i + 1}</span>
                    <span className="font-mono text-gray-900">&quot;{m.match}&quot;</span>
                    <span className="text-gray-400 ml-2">at index {m.index}</span>
                    {Object.keys(m.groups).length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">Groups: {JSON.stringify(m.groups)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
}
