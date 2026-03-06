'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'How is the monthly payment calculated?', a: 'We use the standard amortization formula: M = P × r(1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly rate, and n is number of payments.' },
  { q: 'Does this include taxes and insurance?', a: 'No. This calculator shows principal and interest only. Actual payments may include property taxes, insurance, and other fees.' },
  { q: 'Can I use this for any type of loan?', a: 'Yes! It works for mortgages, car loans, personal loans, student loans, or any fixed-rate amortizing loan.' },
  { q: 'Is my data stored anywhere?', a: 'No. All calculations happen entirely in your browser. Nothing is sent to any server.' },
  { q: 'What does the amortization schedule show?', a: 'It breaks down each monthly payment into principal and interest portions, showing the remaining balance after each payment.' },
];

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface AmortRow { month: number; payment: number; principal: number; interest: number; balance: number; }

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number; schedule: AmortRow[] } | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = () => {
    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const n = parseFloat(years) * 12;
    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) return;
    const r = annualRate / 100 / 12;
    const monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const schedule: AmortRow[] = [];
    let bal = P;
    for (let i = 1; i <= n; i++) {
      const int = bal * r;
      const prin = monthly - int;
      bal -= prin;
      schedule.push({ month: i, payment: monthly, principal: prin, interest: int, balance: Math.max(bal, 0) });
    }
    setResult({ monthly, total, interest: total - P, schedule });
    setShowSchedule(false);
  };

  const principalPct = result ? (parseFloat(amount) / result.total) * 100 : 0;

  return (
    <ToolLayout
      title="Loan Calculator"
      description={[
        'Calculate monthly loan payments, total interest, and view a full amortization schedule for any fixed-rate loan.',
        'Works for mortgages, car loans, personal loans, and more. All calculations run in your browser — no data is sent anywhere.',
      ]}
      howTo={{
        steps: [
          'Enter the loan amount in dollars.',
          'Enter the annual interest rate as a percentage.',
          'Enter the loan term in years.',
          'Click "Calculate" to see monthly payments, total cost, and amortization schedule.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Loan Calculator', url: 'https://snaptools.dev/loan-calculator',
        description: 'Free online loan calculator with amortization schedule.',
        applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Loan Details</h2>
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="w-44"><Input label="Loan Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="250000" /></div>
          <div className="w-36"><Input label="Interest Rate (%)" type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="6.5" /></div>
          <div className="w-36"><Input label="Term (years)" type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="30" /></div>
        </div>
        <Button onClick={calculate} size="lg">Calculate</Button>

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Monthly Payment</div>
                <div className="text-2xl font-bold text-gray-900">{fmt(result.monthly)}</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Total Payment</div>
                <div className="text-2xl font-bold text-gray-900">{fmt(result.total)}</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-500">Total Interest</div>
                <div className="text-2xl font-bold text-red-500">{fmt(result.interest)}</div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="flex justify-center mb-6">
              <svg width="180" height="180" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="3.5"
                  strokeDasharray={`${principalPct} ${100 - principalPct}`} strokeDashoffset="25" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth="3.5"
                  strokeDasharray={`${100 - principalPct} ${principalPct}`} strokeDashoffset={`${25 - principalPct}`} />
              </svg>
            </div>
            <div className="flex justify-center gap-6 text-sm mb-6">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Principal ({principalPct.toFixed(0)}%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Interest ({(100 - principalPct).toFixed(0)}%)</span>
            </div>

            <Button variant="ghost" onClick={() => setShowSchedule(!showSchedule)}>{showSchedule ? 'Hide' : 'Show'} Amortization Schedule</Button>
            {showSchedule && (
              <div className="mt-4 max-h-96 overflow-auto rounded-xl">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white/80 backdrop-blur">
                    <tr className="text-left text-gray-500 border-b border-white/30">
                      <th className="p-2">#</th><th className="p-2">Payment</th><th className="p-2">Principal</th><th className="p-2">Interest</th><th className="p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(r => (
                      <tr key={r.month} className="border-b border-white/10">
                        <td className="p-2">{r.month}</td><td className="p-2">{fmt(r.payment)}</td><td className="p-2">{fmt(r.principal)}</td><td className="p-2">{fmt(r.interest)}</td><td className="p-2">{fmt(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
