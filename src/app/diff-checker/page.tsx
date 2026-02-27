'use client';
import { useState, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'How does the diff algorithm work?', a: 'It uses a Longest Common Subsequence (LCS) algorithm to find the optimal alignment between lines, then highlights additions, deletions, and unchanged lines.' },
  { q: 'Is my text sent to a server?', a: 'No. All comparison happens directly in your browser. Your text never leaves your device.' },
  { q: 'Can I compare code files?', a: 'Yes! The diff checker works with any plain text including source code, configuration files, and documents.' },
  { q: 'What do the colors mean?', a: 'Green lines were added in the modified text, red lines were deleted from the original, and white/unchanged lines are the same in both.' },
  { q: 'Is there a size limit?', a: 'There is no hard limit, but very large texts (over 100,000 lines) may be slow depending on your device.' },
];

interface DiffLine {
  type: 'add' | 'del' | 'same';
  oldNum?: number;
  newNum?: number;
  text: string;
}

function computeDiff(a: string[], b: string[]): DiffLine[] {
  const m = a.length, n = b.length;
  // LCS DP
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({ type: 'same', oldNum: i, newNum: j, text: a[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: 'add', newNum: j, text: b[j - 1] });
      j--;
    } else {
      result.push({ type: 'del', oldNum: i, text: a[i - 1] });
      i--;
    }
  }
  return result.reverse();
}

export default function DiffChecker() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const compare = useCallback(() => {
    const a = original.split('\n');
    const b = modified.split('\n');
    setDiff(computeDiff(a, b));
  }, [original, modified]);

  const stats = diff ? {
    added: diff.filter(d => d.type === 'add').length,
    removed: diff.filter(d => d.type === 'del').length,
    unchanged: diff.filter(d => d.type === 'same').length,
  } : null;

  const diffText = diff?.map(d => {
    const prefix = d.type === 'add' ? '+ ' : d.type === 'del' ? '- ' : '  ';
    return prefix + d.text;
  }).join('\n') ?? '';

  return (
    <ToolLayout
      title="Diff Checker"
      description={[
        'Compare two texts side by side and instantly see the differences. Perfect for comparing code, documents, or any plain text.',
        'Our diff checker uses a Longest Common Subsequence algorithm to accurately detect additions, deletions, and unchanged lines — all processed in your browser.',
      ]}
      howTo={{
        steps: [
          'Paste or type your original text in the left textarea.',
          'Paste or type the modified text in the right textarea.',
          'Click "Compare" to generate a line-by-line diff.',
          'Review the color-coded results: green for additions, red for deletions.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Diff Checker', url: 'https://snaptools.dev/diff-checker',
        description: 'Free online diff checker. Compare texts and see differences highlighted.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Compare Texts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original</label>
            <textarea
              value={original}
              onChange={e => setOriginal(e.target.value)}
              className="w-full h-56 rounded-xl border border-white/30 bg-white/50 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              placeholder="Paste original text here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modified</label>
            <textarea
              value={modified}
              onChange={e => setModified(e.target.value)}
              className="w-full h-56 rounded-xl border border-white/30 bg-white/50 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              placeholder="Paste modified text here..."
            />
          </div>
        </div>
        <Button onClick={compare} size="lg">Compare</Button>
      </Card>

      {diff && stats && (
        <Card padding="lg" className="mt-6">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Diff Result</h2>
            <div className="flex gap-3 items-center">
              <span className="text-sm text-green-600 font-medium">+{stats.added} added</span>
              <span className="text-sm text-red-600 font-medium">−{stats.removed} removed</span>
              <span className="text-sm text-gray-500">{stats.unchanged} unchanged</span>
              <CopyButton text={diffText} />
            </div>
          </div>
          <div className="rounded-xl border border-white/30 overflow-hidden font-mono text-sm">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`flex ${
                  line.type === 'add' ? 'bg-green-50 text-green-800' :
                  line.type === 'del' ? 'bg-red-50 text-red-800' :
                  'bg-white/30 text-gray-700'
                }`}
              >
                <span className="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-400 select-none border-r border-white/30">
                  {line.oldNum ?? ''}
                </span>
                <span className="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-400 select-none border-r border-white/30">
                  {line.newNum ?? ''}
                </span>
                <span className="w-6 shrink-0 text-center py-0.5 select-none font-bold">
                  {line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' '}
                </span>
                <span className="py-0.5 pr-3 whitespace-pre-wrap break-all">{line.text}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
