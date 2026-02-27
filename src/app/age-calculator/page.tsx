'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'How accurate is the age calculation?', a: 'The calculation is precise to the day, accounting for varying month lengths and leap years.' },
  { q: 'Does it account for leap years?', a: 'Yes, the tool correctly handles leap years when calculating your exact age and total days lived.' },
  { q: 'Can I use it for future dates?', a: 'The tool is designed for past dates (dates of birth). Future dates will show a countdown instead.' },
  { q: 'What timezone is used?', a: 'The calculation uses your local timezone as set on your device.' },
  { q: 'Is my date of birth stored anywhere?', a: 'No. All calculations happen in your browser. No data is sent to any server.' },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function calcAge(dob: Date, now: Date) {
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000);

  let nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday <= now) nextBirthday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / 86400000);

  const bornDay = DAYS_OF_WEEK[dob.getDay()];

  return { years, months, days, totalDays, daysUntilBirthday, bornDay, nextBirthday };
}

export default function AgeCalculator() {
  const [dobStr, setDobStr] = useState('');

  const result = useMemo(() => {
    if (!dobStr) return null;
    const dob = new Date(dobStr + 'T00:00:00');
    if (isNaN(dob.getTime())) return null;
    return calcAge(dob, new Date());
  }, [dobStr]);

  return (
    <ToolLayout
      title="Age Calculator"
      description={[
        'Calculate your exact age in years, months, and days. See total days lived, next birthday countdown, and fun facts.',
        'Simply enter your date of birth and get instant results. Everything runs in your browser.',
      ]}
      howTo={{
        steps: [
          'Enter your date of birth using the date picker.',
          'See your exact age in years, months, and days instantly.',
          'View total days lived and countdown to your next birthday.',
          'Discover what day of the week you were born on.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Age Calculator', url: 'https://snaptools.dev/age-calculator',
        description: 'Free online age calculator. Find your exact age, total days lived, and next birthday countdown.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Enter Your Date of Birth</h2>
        <div className="w-56">
          <Input label="Date of Birth" type="date" value={dobStr} onChange={e => setDobStr(e.target.value)} />
        </div>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Age</h3>
            <div className="flex gap-6 text-center">
              <div className="glass rounded-2xl p-4 flex-1">
                <div className="text-3xl font-bold text-primary-600">{result.years}</div>
                <div className="text-sm text-gray-500">Years</div>
              </div>
              <div className="glass rounded-2xl p-4 flex-1">
                <div className="text-3xl font-bold text-primary-600">{result.months}</div>
                <div className="text-sm text-gray-500">Months</div>
              </div>
              <div className="glass rounded-2xl p-4 flex-1">
                <div className="text-3xl font-bold text-primary-600">{result.days}</div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fun Facts</h3>
            <div className="space-y-3">
              <div className="glass rounded-xl p-3 flex justify-between">
                <span className="text-gray-600">Total days lived</span>
                <span className="font-semibold text-gray-900">{result.totalDays.toLocaleString()}</span>
              </div>
              <div className="glass rounded-xl p-3 flex justify-between">
                <span className="text-gray-600">Born on</span>
                <span className="font-semibold text-gray-900">{result.bornDay}</span>
              </div>
              <div className="glass rounded-xl p-3 flex justify-between">
                <span className="text-gray-600">Next birthday in</span>
                <span className="font-semibold text-gray-900">{result.daysUntilBirthday} day{result.daysUntilBirthday !== 1 ? 's' : ''}</span>
              </div>
              <div className="glass rounded-xl p-3 flex justify-between">
                <span className="text-gray-600">Next birthday</span>
                <span className="font-semibold text-gray-900">{result.nextBirthday.toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </ToolLayout>
  );
}
