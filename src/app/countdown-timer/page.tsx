'use client';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

interface Countdown { id: string; name: string; target: string; }

const faqItems = [
  { q: 'Are my countdowns saved?', a: 'Yes, all countdowns are saved to your browser\'s localStorage and persist between sessions.' },
  { q: 'How accurate is the countdown?', a: 'The countdown updates every second and is accurate to within one second of your system clock.' },
  { q: 'Can I create multiple countdowns?', a: 'Yes! Create as many countdowns as you need. Each one runs independently.' },
  { q: 'What happens when a countdown reaches zero?', a: 'The countdown will display all zeros and stop updating. It will show "Expired" status.' },
  { q: 'Does it work across time zones?', a: 'Yes, the countdown uses your local system time, so it works correctly in any time zone.' },
];

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

export default function CountdownTimer() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('snaptools-countdowns');
    if (saved) setCountdowns(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const save = (items: Countdown[]) => {
    setCountdowns(items);
    localStorage.setItem('snaptools-countdowns', JSON.stringify(items));
  };

  const add = () => {
    if (!target) return;
    save([...countdowns, { id: Date.now().toString(), name: name || 'Countdown', target }]);
    setName(''); setTarget('');
  };

  const remove = (id: string) => save(countdowns.filter(c => c.id !== id));

  return (
    <ToolLayout
      title="Countdown Timer"
      description={[
        'Create countdown timers to any future date and time. Track multiple events with large, easy-to-read displays.',
        'All countdowns are saved to your browser and update in real-time with days, hours, minutes, and seconds.',
      ]}
      howTo={{ steps: [
        'Enter a name for your countdown event.',
        'Select a target date and time using the date picker.',
        'Click "Add Countdown" to start tracking.',
        'View the live countdown updating every second with days, hours, minutes, and seconds.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Countdown Timer', url: 'https://snaptools.dev/countdown-timer',
        description: 'Free online countdown timer. Create multiple countdowns to any date.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Create Countdown</h2>
        <div className="flex flex-wrap gap-3 items-end mb-6">
          <div className="flex-1 min-w-[150px]">
            <Input label="Event Name" value={name} onChange={e => setName(e.target.value)} placeholder="My Event" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input label="Target Date & Time" type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <Button onClick={add} size="lg">Add Countdown</Button>
        </div>

        {countdowns.length === 0 && (
          <p className="text-gray-400 text-center py-8">No countdowns yet. Create one above!</p>
        )}

        <div className="space-y-4">
          {countdowns.map(c => {
            const tl = getTimeLeft(c.target);
            return (
              <div key={c.id} className="glass rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{c.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(c.target).toLocaleString()}</p>
                  </div>
                  <button onClick={() => remove(c.id)} className="text-gray-400 hover:text-red-500 text-xl">×</button>
                </div>
                {tl.expired ? (
                  <p className="text-center text-red-500 font-semibold text-lg">Expired!</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { v: tl.days, l: 'Days' },
                      { v: tl.hours, l: 'Hours' },
                      { v: tl.minutes, l: 'Minutes' },
                      { v: tl.seconds, l: 'Seconds' },
                    ].map(u => (
                      <div key={u.l} className="glass rounded-xl p-3">
                        <div className="text-3xl sm:text-4xl font-bold text-gray-900">{String(u.v).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500 mt-1">{u.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </ToolLayout>
  );
}
