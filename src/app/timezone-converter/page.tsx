'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'How does timezone conversion work?', a: 'This tool uses the browser\'s built-in Intl.DateTimeFormat API to accurately convert times between timezones, automatically handling daylight saving time changes.' },
  { q: 'Does this tool account for daylight saving time?', a: 'Yes! The Intl API automatically handles DST transitions, so conversions are always accurate for the selected date.' },
  { q: 'What timezone abbreviations like EST and PST mean?', a: 'EST is Eastern Standard Time (UTC-5), PST is Pacific Standard Time (UTC-8). During daylight saving, they become EDT (UTC-4) and PDT (UTC-7) respectively.' },
  { q: 'How do I convert a meeting time for multiple timezones?', a: 'Use the World Clock section to add multiple timezones. They all update simultaneously, making it easy to find a time that works for everyone.' },
  { q: 'Why does UTC not change with daylight saving?', a: 'UTC (Coordinated Universal Time) is the global time standard and does not observe daylight saving time. It remains constant year-round, which is why it\'s used as a reference point.' },
];

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'EST/EDT (New York)' },
  { value: 'America/Chicago', label: 'CST/CDT (Chicago)' },
  { value: 'America/Denver', label: 'MST/MDT (Denver)' },
  { value: 'America/Los_Angeles', label: 'PST/PDT (Los Angeles)' },
  { value: 'America/Anchorage', label: 'AKST (Anchorage)' },
  { value: 'Pacific/Honolulu', label: 'HST (Honolulu)' },
  { value: 'America/Sao_Paulo', label: 'BRT (São Paulo)' },
  { value: 'Europe/London', label: 'GMT/BST (London)' },
  { value: 'Europe/Paris', label: 'CET/CEST (Paris)' },
  { value: 'Europe/Berlin', label: 'CET/CEST (Berlin)' },
  { value: 'Europe/Moscow', label: 'MSK (Moscow)' },
  { value: 'Asia/Dubai', label: 'GST (Dubai)' },
  { value: 'Asia/Kolkata', label: 'IST (India)' },
  { value: 'Asia/Bangkok', label: 'ICT (Bangkok)' },
  { value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
  { value: 'Asia/Hong_Kong', label: 'HKT (Hong Kong)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Asia/Seoul', label: 'KST (Seoul)' },
  { value: 'Australia/Sydney', label: 'AEST/AEDT (Sydney)' },
  { value: 'Pacific/Auckland', label: 'NZST/NZDT (Auckland)' },
];

const defaultWorldClock = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney'];

function formatInTz(date: Date, tz: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, ...opts }).format(date);
}

function dateInTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export default function TimezoneConverter() {
  const [sourceTime, setSourceTime] = useState('');
  const [sourceDate, setSourceDate] = useState('');
  const [sourceTz, setSourceTz] = useState('UTC');
  const [targetTz, setTargetTz] = useState('Asia/Seoul');
  const [worldZones, setWorldZones] = useState(defaultWorldClock);
  const [addZone, setAddZone] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    setSourceDate(today.toISOString().slice(0, 10));
    setSourceTime(today.toTimeString().slice(0, 5));
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const convertedTime = (() => {
    if (!sourceDate || !sourceTime) return '';
    try {
      const srcStr = `${sourceDate}T${sourceTime}:00`;
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: sourceTz, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });
      const srcDate = new Date(srcStr);
      const srcParts = formatter.formatToParts(srcDate);
      const getP = (t: string) => srcParts.find(p => p.type === t)?.value || '';

      const refDate = new Date(`${getP('year')}-${getP('month')}-${getP('day')}T${getP('hour')}:${getP('minute')}:00`);
      const offset = srcDate.getTime() - refDate.getTime();
      const utcTime = new Date(srcDate.getTime() + offset);

      return {
        time: formatInTz(utcTime, targetTz),
        date: dateInTz(utcTime, targetTz),
      };
    } catch {
      return '';
    }
  })();

  const removeZone = (tz: string) => setWorldZones(worldZones.filter(z => z !== tz));
  const addWorldZone = () => {
    if (addZone && !worldZones.includes(addZone)) {
      setWorldZones([...worldZones, addZone]);
      setAddZone('');
    }
  };

  const tzLabel = (tz: string) => timezones.find(t => t.value === tz)?.label || tz;

  return (
    <ToolLayout
      title="Time Zone Converter"
      description={[
        'Convert times between any timezones instantly. Compare multiple timezones side by side with the world clock feature.',
        'Uses your browser\'s Intl API for accurate conversions including daylight saving time. Perfect for scheduling meetings across time zones.',
      ]}
      howTo={{
        steps: [
          'Enter the time and date you want to convert, and select the source timezone.',
          'Choose the target timezone to see the converted time instantly.',
          'Use the World Clock to monitor current times in multiple cities simultaneously.',
          'Add or remove timezones from the world clock to customize your view.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Time Zone Converter', url: 'https://snaptools.dev/timezone-converter',
        description: 'Free timezone converter with world clock. Convert times between timezones with DST support.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <div className="space-y-6">
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Convert Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input label="Time" type="time" value={sourceTime} onChange={e => setSourceTime(e.target.value)} />
            <Input label="Date" type="date" value={sourceDate} onChange={e => setSourceDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Select label="From Timezone" value={sourceTz} onChange={e => setSourceTz(e.target.value)} options={timezones} />
            <Select label="To Timezone" value={targetTz} onChange={e => setTargetTz(e.target.value)} options={timezones} />
          </div>

          {convertedTime && typeof convertedTime === 'object' && (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary-600 font-mono">{convertedTime.time}</p>
              <p className="text-gray-600 mt-1">{convertedTime.date}</p>
              <p className="text-sm text-gray-400 mt-1">{tzLabel(targetTz)}</p>
            </div>
          )}
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">World Clock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {worldZones.map(tz => (
              <div key={tz} className="glass rounded-2xl p-4 relative group">
                <button onClick={() => removeZone(tz)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-lg" aria-label="Remove">×</button>
                <p className="text-2xl font-bold font-mono text-gray-900">{formatInTz(now, tz)}</p>
                <p className="text-sm text-gray-500">{dateInTz(now, tz)}</p>
                <p className="text-xs text-gray-400 mt-1">{tzLabel(tz)}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Select label="Add Timezone" value={addZone} onChange={e => setAddZone(e.target.value)} options={[{ value: '', label: 'Select timezone...' }, ...timezones.filter(t => !worldZones.includes(t.value))]} />
            </div>
            <Button onClick={addWorldZone} disabled={!addZone}>Add</Button>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
