'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'How is BMI calculated?', a: 'BMI is calculated by dividing your weight in kilograms by the square of your height in meters: BMI = weight(kg) / height(m)².' },
  { q: 'Is BMI accurate for everyone?', a: 'BMI is a general indicator. It may not be accurate for athletes with high muscle mass, elderly people, or children. Consult a healthcare provider for personalized advice.' },
  { q: 'What is a healthy BMI range?', a: 'A BMI between 18.5 and 24.9 is considered normal/healthy weight according to the WHO classification.' },
  { q: 'Does this tool store my data?', a: 'No. All calculations happen in your browser. No data is sent to any server.' },
  { q: 'Can I use imperial units?', a: 'Yes! Toggle between metric (cm/kg) and imperial (ft-in/lbs) units using the switch at the top.' },
];

const categories = [
  { label: 'Underweight', min: 0, max: 18.5, color: '#3b82f6' },
  { label: 'Normal', min: 18.5, max: 25, color: '#22c55e' },
  { label: 'Overweight', min: 25, max: 30, color: '#f59e0b' },
  { label: 'Obese', min: 30, max: 50, color: '#ef4444' },
];

function getCategory(bmi: number) {
  if (bmi < 18.5) return categories[0];
  if (bmi < 25) return categories[1];
  if (bmi < 30) return categories[2];
  return categories[3];
}

export default function BMICalculator() {
  const [metric, setMetric] = useState(true);
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; cat: typeof categories[0]; minW: number; maxW: number } | null>(null);

  const calculate = () => {
    let h: number, w: number;
    if (metric) {
      h = parseFloat(heightCm) / 100;
      w = parseFloat(weight);
    } else {
      h = (parseFloat(feet || '0') * 12 + parseFloat(inches || '0')) * 0.0254;
      w = parseFloat(weight) * 0.453592;
    }
    if (!h || !w || h <= 0 || w <= 0) return;
    const bmi = w / (h * h);
    const cat = getCategory(bmi);
    const minW = 18.5 * h * h;
    const maxW = 24.9 * h * h;
    setResult({ bmi, cat, minW: metric ? minW : minW / 0.453592, maxW: metric ? maxW : maxW / 0.453592 });
  };

  const gaugePos = result ? Math.min(Math.max((result.bmi - 10) / 35 * 100, 0), 100) : 0;

  return (
    <ToolLayout
      title="BMI Calculator"
      description={[
        'Calculate your Body Mass Index (BMI) quickly and for free. Enter your height and weight to find out your BMI category.',
        'BMI is a simple measure of body fat based on height and weight. Use this tool to check if you are underweight, normal, overweight, or obese.',
      ]}
      howTo={{
        steps: [
          'Choose metric (cm/kg) or imperial (ft-in/lbs) units.',
          'Enter your height and weight.',
          'Click "Calculate BMI" to see your result.',
          'View your BMI category and healthy weight range for your height.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'BMI Calculator', url: 'https://snaptools.dev/bmi-calculator',
        description: 'Free online BMI calculator. Check your body mass index instantly.',
        applicationCategory: 'HealthApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Calculate Your BMI</h2>

        <div className="flex gap-2 mb-5">
          <Button variant={metric ? 'primary' : 'ghost'} size="sm" onClick={() => { setMetric(true); setResult(null); }}>Metric (cm/kg)</Button>
          <Button variant={!metric ? 'primary' : 'ghost'} size="sm" onClick={() => { setMetric(false); setResult(null); }}>Imperial (ft-in/lbs)</Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-5">
          {metric ? (
            <div className="w-40"><Input label="Height (cm)" type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="170" /></div>
          ) : (
            <>
              <div className="w-28"><Input label="Feet" type="number" value={feet} onChange={e => setFeet(e.target.value)} placeholder="5" /></div>
              <div className="w-28"><Input label="Inches" type="number" value={inches} onChange={e => setInches(e.target.value)} placeholder="9" /></div>
            </>
          )}
          <div className="w-40"><Input label={metric ? 'Weight (kg)' : 'Weight (lbs)'} type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={metric ? '70' : '154'} /></div>
        </div>

        <Button onClick={calculate} size="lg">Calculate BMI</Button>

        {result && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2" style={{ color: result.cat.color }}>{result.bmi.toFixed(1)}</div>
              <div className="text-lg font-medium" style={{ color: result.cat.color }}>{result.cat.label}</div>
            </div>

            {/* BMI Gauge */}
            <div className="relative h-6 rounded-full overflow-hidden mb-2" style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 17%, #22c55e 17%, #22c55e 37.5%, #f59e0b 37.5%, #f59e0b 50%, #ef4444 50%, #ef4444 100%)` }}>
              <div className="absolute top-0 w-1 h-full bg-gray-900 rounded" style={{ left: `${gaugePos}%`, transform: 'translateX(-50%)' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>45</span>
            </div>

            <div className="glass rounded-2xl p-4 text-sm text-gray-700">
              <p>Healthy weight range for your height: <strong>{result.minW.toFixed(1)} – {result.maxW.toFixed(1)} {metric ? 'kg' : 'lbs'}</strong></p>
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
