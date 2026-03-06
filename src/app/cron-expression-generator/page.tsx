'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What is a cron expression?', a: 'A cron expression is a string of 5 (or 6) fields that define a schedule. The fields represent minute, hour, day of month, month, and day of week. An optional 6th field for seconds can be prepended.' },
  { q: 'What does the asterisk (*) mean in cron?', a: 'The asterisk means "every" value for that field. For example, * in the minute field means "every minute". You can also use ranges (1-5), lists (1,3,5), and steps (*/5).' },
  { q: 'What is the difference between 5-field and 6-field cron?', a: '5-field cron (standard) has: minute, hour, day of month, month, day of week. 6-field cron adds a seconds field at the beginning, commonly used in tools like Spring and Quartz.' },
  { q: 'How do I run a cron job every 5 minutes?', a: 'Use the expression */5 * * * * which means "every 5th minute of every hour, every day". The */5 syntax means "starting at 0, then every 5th value".' },
  { q: 'Can I test my cron expression before using it?', a: 'Yes! This tool shows the next 5 execution times for your expression, so you can verify it matches your intended schedule before deploying.' },
];

const presets = [
  { name: 'Every Minute', expr: '* * * * *' },
  { name: 'Every 5 Minutes', expr: '*/5 * * * *' },
  { name: 'Every 15 Minutes', expr: '*/15 * * * *' },
  { name: 'Every Hour', expr: '0 * * * *' },
  { name: 'Daily at Midnight', expr: '0 0 * * *' },
  { name: 'Daily at 9 AM', expr: '0 9 * * *' },
  { name: 'Weekly (Monday)', expr: '0 0 * * 1' },
  { name: 'Monthly (1st)', expr: '0 0 1 * *' },
  { name: 'Yearly (Jan 1)', expr: '0 0 1 1 *' },
];

const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function describeCron(parts: string[]): string {
  if (parts.length < 5) return 'Invalid expression';
  const [min, hour, dom, mon, dow] = parts;
  const segments: string[] = [];

  if (min === '*' && hour === '*') segments.push('Every minute');
  else if (min.startsWith('*/')) segments.push(`Every ${min.slice(2)} minutes`);
  else if (hour === '*') segments.push(`At minute ${min} of every hour`);
  else if (min === '0' && hour === '*') segments.push('Every hour');
  else if (hour.startsWith('*/')) segments.push(`At minute ${min}, every ${hour.slice(2)} hours`);
  else segments.push(`At ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`);

  if (dom !== '*' && mon !== '*') segments.push(`on ${monthNames[+mon] || mon} ${dom}`);
  else if (dom !== '*') segments.push(`on day ${dom} of the month`);
  else if (mon !== '*') segments.push(`in ${monthNames[+mon] || mon}`);

  if (dow !== '*') {
    const days = dow.split(',').map(d => dayNames[+d] || d).join(', ');
    segments.push(`on ${days}`);
  }

  return segments.join(' ');
}

function getNextExecutions(expr: string, count: number): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5) return [];
  const [minF, hourF, domF, monF, dowF] = parts;
  const results: Date[] = [];
  const now = new Date();
  const check = new Date(now);
  check.setSeconds(0, 0);
  check.setMinutes(check.getMinutes() + 1);

  const matches = (val: number, field: string, max: number): boolean => {
    if (field === '*') return true;
    if (field.includes('/')) {
      const [, step] = field.split('/');
      return val % +step === 0;
    }
    if (field.includes('-')) {
      const [a, b] = field.split('-').map(Number);
      return val >= a && val <= b;
    }
    if (field.includes(',')) return field.split(',').map(Number).includes(val);
    return val === +field;
  };

  let iter = 0;
  while (results.length < count && iter < 525960) {
    iter++;
    const m = check.getMinutes();
    const h = check.getHours();
    const d = check.getDate();
    const mo = check.getMonth() + 1;
    const dw = check.getDay();
    if (matches(m, minF, 59) && matches(h, hourF, 23) && matches(d, domF, 31) && matches(mo, monF, 12) && matches(dw, dowF, 6)) {
      results.push(new Date(check));
    }
    check.setMinutes(check.getMinutes() + 1);
  }
  return results;
}

export default function CronExpressionGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const [useSeconds, setUseSeconds] = useState(false);
  const [seconds, setSeconds] = useState('*');
  const [pasteInput, setPasteInput] = useState('');

  const expression = useSeconds ? `${seconds} ${minute} ${hour} ${dom} ${month} ${dow}` : `${minute} ${hour} ${dom} ${month} ${dow}`;
  const parts5 = [minute, hour, dom, month, dow];
  const desc = describeCron(parts5);
  const nextRuns = useMemo(() => getNextExecutions(parts5.join(' '), 5), [minute, hour, dom, month, dow]);

  const loadPreset = (expr: string) => {
    const p = expr.split(/\s+/);
    setMinute(p[0] || '*');
    setHour(p[1] || '*');
    setDom(p[2] || '*');
    setMonth(p[3] || '*');
    setDow(p[4] || '*');
  };

  const decodePaste = () => {
    const p = pasteInput.trim().split(/\s+/);
    if (p.length === 6) {
      setUseSeconds(true);
      setSeconds(p[0]);
      setMinute(p[1]);
      setHour(p[2]);
      setDom(p[3]);
      setMonth(p[4]);
      setDow(p[5]);
    } else if (p.length >= 5) {
      setUseSeconds(false);
      setMinute(p[0]);
      setHour(p[1]);
      setDom(p[2]);
      setMonth(p[3]);
      setDow(p[4]);
    }
  };

  const fieldOpts = (label: string, val: string, set: (v: string) => void, max: number, names?: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input value={val} onChange={e => set(e.target.value)} className="block w-full rounded-xl backdrop-blur-lg bg-white/50 border border-white/40 px-4 py-2.5 text-gray-900 transition-all duration-200 focus:bg-white/70 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono text-center" />
      <p className="text-xs text-gray-400 mt-1">{names ? `0-${max} or name` : `* or 0-${max}`}</p>
    </div>
  );

  return (
    <ToolLayout
      title="Cron Expression Generator"
      description={[
        'Build cron expressions visually with an intuitive interface. See human-readable descriptions and preview the next execution times.',
        'Supports both standard 5-field cron syntax and 6-field (with seconds) used by Spring, Quartz, and other frameworks.',
      ]}
      howTo={{
        steps: [
          'Set each cron field (minute, hour, day, month, weekday) using the input boxes. Use * for "every", */n for intervals, or specific values.',
          'Use quick presets to load common schedules like "Every 5 Minutes" or "Daily at Midnight".',
          'Review the human-readable description to verify your schedule is correct.',
          'Check the "Next 5 Runs" to confirm execution times, then copy the expression.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Cron Expression Generator', url: 'https://snaptools.dev/cron-expression-generator',
        description: 'Free visual cron expression builder. Generate and decode cron schedules with human-readable descriptions.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <div className="space-y-6">
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Presets</h2>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <Button key={p.name} variant="ghost" size="sm" onClick={() => loadPreset(p.expr)}>{p.name}</Button>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Build Expression</h2>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <input type="checkbox" checked={useSeconds} onChange={e => setUseSeconds(e.target.checked)} className="rounded" /> Include seconds field
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {useSeconds && fieldOpts('Second', seconds, setSeconds, 59)}
            {fieldOpts('Minute', minute, setMinute, 59)}
            {fieldOpts('Hour', hour, setHour, 23)}
            {fieldOpts('Day (Month)', dom, setDom, 31)}
            {fieldOpts('Month', month, setMonth, 12)}
            {fieldOpts('Day (Week)', dow, setDow, 6, dayNames)}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Result</h2>
            <CopyButton text={expression} />
          </div>
          <code className="block text-2xl font-mono text-center py-4 text-primary-600 font-bold">{expression}</code>
          <p className="text-center text-gray-600 mt-2">{desc}</p>

          {nextRuns.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/30">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Next 5 Runs</h3>
              <div className="space-y-1">
                {nextRuns.map((d, i) => (
                  <p key={i} className="text-sm font-mono text-gray-600">{d.toLocaleString()}</p>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Decode Existing Expression</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input value={pasteInput} onChange={e => setPasteInput(e.target.value)} placeholder="Paste cron expression, e.g. */5 * * * *" />
            </div>
            <Button onClick={decodePaste}>Decode</Button>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
