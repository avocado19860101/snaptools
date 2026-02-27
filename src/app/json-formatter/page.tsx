'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'Is my JSON data sent to a server?', a: 'No. All formatting and validation happens entirely in your browser. Your data stays on your device.' },
  { q: 'What JSON features are supported?', a: 'Full JSON specification including objects, arrays, strings, numbers, booleans, and null values.' },
  { q: 'Can I minify JSON?', a: 'Yes! Click the "Minify" button to remove all whitespace and produce compact JSON.' },
  { q: 'Does it validate my JSON?', a: 'Yes. Invalid JSON will show a detailed error message with the position of the issue.' },
  { q: 'Can I view JSON as a tree?', a: 'Yes! Toggle the tree view to see a collapsible, hierarchical view of your JSON data.' },
];

function highlightJson(str: string): string {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
      let cls = 'text-emerald-600'; // string
      if (/:$/.test(match)) cls = 'text-blue-600 font-medium'; // key
      return `<span class="${cls}">${match}</span>`;
    })
    .replace(/\b(true|false)\b/g, '<span class="text-amber-600">$1</span>')
    .replace(/\bnull\b/g, '<span class="text-red-400">null</span>')
    .replace(/\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g, '<span class="text-violet-600">$1</span>');
}

function TreeNode({ name, value, depth = 0 }: { name?: string; value: any; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === 'object';
  const isArr = Array.isArray(value);
  const entries = isObj ? Object.entries(value) : [];
  const prefix = name !== undefined ? <span className="text-blue-600 font-medium">&quot;{name}&quot;</span> : null;

  if (!isObj) {
    let display: React.ReactNode;
    if (typeof value === 'string') display = <span className="text-emerald-600">&quot;{value}&quot;</span>;
    else if (typeof value === 'boolean') display = <span className="text-amber-600">{String(value)}</span>;
    else if (value === null) display = <span className="text-red-400">null</span>;
    else display = <span className="text-violet-600">{String(value)}</span>;
    return <div style={{ paddingLeft: depth * 16 }}>{prefix}{prefix ? ': ' : ''}{display}</div>;
  }

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button onClick={() => setOpen(!open)} className="hover:bg-white/40 rounded px-1 -ml-1">
        <span className="text-gray-400 mr-1 inline-block w-3 text-xs">{open ? '▼' : '▶'}</span>
        {prefix}{prefix ? ': ' : ''}{isArr ? `[${entries.length}]` : `{${entries.length}}`}
      </button>
      {open && entries.map(([k, v], i) => <TreeNode key={k + i} name={isArr ? undefined : k} value={v} depth={depth + 1} />)}
    </div>
  );
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState('2');
  const [view, setView] = useState<'formatted' | 'tree'>('formatted');
  const [error, setError] = useState('');

  const parsed = useMemo(() => {
    if (!input.trim()) return { formatted: '', obj: null, valid: true };
    try {
      const obj = JSON.parse(input);
      setError('');
      return { formatted: JSON.stringify(obj, null, Number(indent)), obj, valid: true };
    } catch (e: any) {
      setError(e.message);
      return { formatted: '', obj: null, valid: false };
    }
  }, [input, indent]);

  const doMinify = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const doFormat = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, Number(indent)));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description={[
        'Format, validate, and beautify JSON data instantly. Syntax highlighting, tree view, and minification all in your browser.',
        'Paste your JSON, format it with configurable indentation, and explore it with the interactive tree view.',
      ]}
      howTo={{
        steps: [
          'Paste or type your JSON data into the input area.',
          'Choose indentation (2 or 4 spaces) and click "Format" to prettify.',
          'Use "Minify" to compress JSON or toggle tree view for hierarchical exploration.',
          'Copy the formatted output with the copy button.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'JSON Formatter', url: 'https://snaptools.dev/json-formatter',
        description: 'Free online JSON formatter, validator, and beautifier with syntax highlighting.',
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">JSON Input</h2>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Paste your JSON here...\n{"key": "value"}'
          className="w-full h-48 rounded-xl border border-white/30 bg-white/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-y"
        />
        {error && <p className="text-red-500 text-sm mt-2">⚠️ {error}</p>}

        <div className="flex flex-wrap gap-3 mt-4 items-end">
          <div className="w-36">
            <Select label="Indent" value={indent} onChange={e => setIndent(e.target.value)} options={[{ label: '2 spaces', value: '2' }, { label: '4 spaces', value: '4' }]} />
          </div>
          <Button onClick={doFormat} size="md">Format</Button>
          <Button variant="ghost" onClick={doMinify} size="md">Minify</Button>
          <Button variant={view === 'tree' ? 'primary' : 'ghost'} onClick={() => setView(v => v === 'formatted' ? 'tree' : 'formatted')} size="md">
            {view === 'tree' ? '📝 Code View' : '🌳 Tree View'}
          </Button>
          {parsed.formatted && <CopyButton text={parsed.formatted} />}
        </div>
      </Card>

      {parsed.valid && input.trim() && (
        <Card padding="lg" className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {view === 'tree' ? 'Tree View' : 'Formatted Output'}
          </h2>
          {view === 'formatted' ? (
            <pre
              className="overflow-auto rounded-xl bg-gray-900/5 p-4 text-sm font-mono leading-relaxed max-h-[500px]"
              dangerouslySetInnerHTML={{ __html: highlightJson(parsed.formatted) }}
            />
          ) : (
            <div className="overflow-auto rounded-xl bg-gray-900/5 p-4 text-sm font-mono leading-relaxed max-h-[500px]">
              <TreeNode value={parsed.obj} />
            </div>
          )}
        </Card>
      )}
    </ToolLayout>
  );
}
