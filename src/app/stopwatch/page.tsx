'use client';
import { useState, useRef, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'How accurate is the stopwatch?', a: 'The stopwatch uses requestAnimationFrame for smooth display updates and tracks elapsed time using performance.now(), giving you millisecond-level accuracy.' },
  { q: 'Will the stopwatch keep running if I switch tabs?', a: 'Yes. The stopwatch tracks real elapsed time, so even if the browser throttles animations in background tabs, the displayed time will be correct when you return.' },
  { q: 'Is there a limit on the number of laps?', a: 'There is no hard limit. You can record as many laps as you need. All laps are displayed in a scrollable list.' },
  { q: 'Can I export my lap times?', a: 'Yes! Click the "Export Laps" button to copy all your lap data as CSV text that you can paste into a spreadsheet.' },
  { q: 'Does the stopwatch work offline?', a: 'Absolutely. The stopwatch runs entirely in your browser with no server communication required.' },
];

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    setElapsed(baseRef.current + performance.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = () => {
    startRef.current = performance.now();
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    baseRef.current += performance.now() - startRef.current;
    setElapsed(baseRef.current);
    setRunning(false);
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    baseRef.current = 0;
    setElapsed(0);
    setRunning(false);
    setLaps([]);
  };

  const lap = () => {
    setLaps(prev => [...prev, elapsed]);
  };

  const lapsCSV = laps.map((t, i) => {
    const split = i === 0 ? t : t - laps[i - 1];
    return `${i + 1},${fmt(t)},${fmt(split)}`;
  }).join('\n');
  const exportText = laps.length ? `Lap,Time,Split\n${lapsCSV}` : '';

  const progress = (elapsed % 60000) / 60000;
  const angle = progress * 360;
  const rad = (angle - 90) * (Math.PI / 180);
  const x = 50 + 40 * Math.cos(rad);
  const y = 50 + 40 * Math.sin(rad);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <ToolLayout
      title="Stopwatch"
      description={[
        'A precise online stopwatch with lap timing. Start, stop, lap, and reset with millisecond accuracy.',
        'Track split times for workouts, cooking, studying, or any activity. Export your laps as CSV. Runs entirely in your browser.',
      ]}
      howTo={{ steps: [
        'Click "Start" to begin the stopwatch.',
        'Click "Lap" to record split times while the stopwatch continues.',
        'Click "Stop" to pause the timer. Click "Start" again to resume.',
        'Click "Reset" to clear the timer and all laps. Use "Export Laps" to copy lap data.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Stopwatch', url: 'https://snaptools.dev/stopwatch',
        description: 'Free online stopwatch with lap times and CSV export.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-48 h-48 mb-6">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-gray-200" strokeWidth="4" />
            {elapsed > 0 && (
              <path
                d={`M 50 10 A 40 40 0 ${largeArc} 1 ${x} ${y}`}
                fill="none" stroke="url(#grad)" strokeWidth="4" strokeLinecap="round"
              />
            )}
            <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
          </svg>
          <div className="text-5xl sm:text-6xl font-mono font-bold text-gray-900 mb-8 tabular-nums tracking-tight">{fmt(elapsed)}</div>
          <div className="flex gap-3 flex-wrap justify-center mb-6">
            {!running ? (
              <Button onClick={start} size="lg">{elapsed > 0 ? 'Resume' : 'Start'}</Button>
            ) : (
              <Button onClick={stop} size="lg" variant="ghost">Stop</Button>
            )}
            {running && <Button onClick={lap} size="lg" variant="ghost">Lap</Button>}
            {!running && elapsed > 0 && <Button onClick={reset} size="lg" variant="ghost">Reset</Button>}
          </div>
        </div>

        {laps.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Laps</h3>
              <CopyButton text={exportText} label="Export Laps" />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {laps.map((t, i) => {
                const split = i === 0 ? t : t - laps[i - 1];
                return (
                  <div key={i} className="flex justify-between text-sm font-mono glass rounded-xl px-4 py-2">
                    <span className="text-gray-500">Lap {i + 1}</span>
                    <span className="text-gray-700">{fmt(t)}</span>
                    <span className="text-gray-400">+{fmt(split)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
