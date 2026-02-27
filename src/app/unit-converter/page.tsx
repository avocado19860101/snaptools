'use client';
import { useState, useMemo, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input, Select, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'How accurate are the conversions?', a: 'All conversions use standard mathematical formulas and are accurate to multiple decimal places. Results are rounded to 6 significant digits for readability.' },
  { q: 'Does this tool work offline?', a: 'Yes! All conversions are calculated directly in your browser using JavaScript. No internet connection is needed after the page loads.' },
  { q: 'What unit categories are supported?', a: 'We support Length, Weight, Temperature, Volume, Speed, Area, Time, and Data Storage — covering the most common everyday conversion needs.' },
  { q: 'How does temperature conversion work?', a: 'Temperature conversions use the standard formulas: °C = (°F - 32) × 5/9, °F = °C × 9/5 + 32, and K = °C + 273.15. These are exact conversions, not approximations.' },
  { q: 'Can I convert between metric and imperial units?', a: 'Absolutely! You can convert between any units within the same category, including metric to imperial (e.g., kilometers to miles, kilograms to pounds).' },
];

type UnitDef = { label: string; toBase: (v: number) => number; fromBase: (v: number) => number };
type Category = { label: string; units: Record<string, UnitDef> };

const categories: Record<string, Category> = {
  length: {
    label: 'Length',
    units: {
      m: { label: 'Meters (m)', toBase: v => v, fromBase: v => v },
      km: { label: 'Kilometers (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      cm: { label: 'Centimeters (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
      mm: { label: 'Millimeters (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      mi: { label: 'Miles (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      yd: { label: 'Yards (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      ft: { label: 'Feet (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      in: { label: 'Inches (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    },
  },
  weight: {
    label: 'Weight',
    units: {
      kg: { label: 'Kilograms (kg)', toBase: v => v, fromBase: v => v },
      g: { label: 'Grams (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      mg: { label: 'Milligrams (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      lb: { label: 'Pounds (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      oz: { label: 'Ounces (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      t: { label: 'Metric Tons (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    },
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      f: { label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      k: { label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    },
  },
  volume: {
    label: 'Volume',
    units: {
      l: { label: 'Liters (L)', toBase: v => v, fromBase: v => v },
      ml: { label: 'Milliliters (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      gal: { label: 'Gallons (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      qt: { label: 'Quarts (US)', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
      pt: { label: 'Pints (US)', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      cup: { label: 'Cups (US)', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      floz: { label: 'Fluid Ounces (US)', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    },
  },
  speed: {
    label: 'Speed',
    units: {
      ms: { label: 'Meters/second (m/s)', toBase: v => v, fromBase: v => v },
      kmh: { label: 'Kilometers/hour (km/h)', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      mph: { label: 'Miles/hour (mph)', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      kn: { label: 'Knots (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    },
  },
  area: {
    label: 'Area',
    units: {
      m2: { label: 'Square Meters (m²)', toBase: v => v, fromBase: v => v },
      km2: { label: 'Square Kilometers (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      ha: { label: 'Hectares (ha)', toBase: v => v * 10000, fromBase: v => v / 10000 },
      ft2: { label: 'Square Feet (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      ac: { label: 'Acres (ac)', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      mi2: { label: 'Square Miles (mi²)', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
    },
  },
  time: {
    label: 'Time',
    units: {
      s: { label: 'Seconds (s)', toBase: v => v, fromBase: v => v },
      ms_t: { label: 'Milliseconds (ms)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      min: { label: 'Minutes (min)', toBase: v => v * 60, fromBase: v => v / 60 },
      h: { label: 'Hours (h)', toBase: v => v * 3600, fromBase: v => v / 3600 },
      d: { label: 'Days (d)', toBase: v => v * 86400, fromBase: v => v / 86400 },
      wk: { label: 'Weeks (wk)', toBase: v => v * 604800, fromBase: v => v / 604800 },
      yr: { label: 'Years (yr)', toBase: v => v * 31557600, fromBase: v => v / 31557600 },
    },
  },
  data: {
    label: 'Data Storage',
    units: {
      b: { label: 'Bytes (B)', toBase: v => v, fromBase: v => v },
      kb: { label: 'Kilobytes (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
      mb: { label: 'Megabytes (MB)', toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      gb: { label: 'Gigabytes (GB)', toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      tb: { label: 'Terabytes (TB)', toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('mi');
  const [value, setValue] = useState('1');

  // Load last used settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snaptools-unit-converter-settings');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.category && categories[data.category]) {
          setCategory(data.category);
          const keys = Object.keys(categories[data.category].units);
          if (data.fromUnit && keys.includes(data.fromUnit)) setFromUnit(data.fromUnit);
          if (data.toUnit && keys.includes(data.toUnit)) setToUnit(data.toUnit);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem('snaptools-unit-converter-settings', JSON.stringify({ category, fromUnit, toUnit }));
  }, [category, fromUnit, toUnit]);

  const cat = categories[category];
  const unitKeys = Object.keys(cat.units);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return '';
    const base = cat.units[fromUnit].toBase(v);
    const out = cat.units[toUnit].fromBase(base);
    return parseFloat(out.toPrecision(10)).toString();
  }, [value, fromUnit, toUnit, cat]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const keys = Object.keys(categories[newCat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description={[
        'Convert between units of length, weight, temperature, volume, speed, area, time, and data storage instantly.',
        'All conversions are performed in your browser with precise mathematical formulas. No data is sent to any server.',
      ]}
      howTo={{
        steps: [
          'Select a category (e.g., Length, Weight, Temperature).',
          'Choose the unit to convert from and to using the dropdowns.',
          'Enter a value in the input field.',
          'See the converted result instantly. Click Copy to copy the result.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Unit Converter', url: 'https://snaptools.dev/unit-converter',
        description: 'Free online unit converter. Convert length, weight, temperature, volume, speed, area, time, and data storage units.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Convert Units</h2>

        <div className="mb-5">
          <Select
            label="Category"
            value={category}
            onChange={e => handleCategoryChange(e.target.value)}
            options={Object.entries(categories).map(([k, c]) => ({ value: k, label: c.label }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Select
            label="From"
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            options={unitKeys.map(k => ({ value: k, label: cat.units[k].label }))}
          />
          <Select
            label="To"
            value={toUnit}
            onChange={e => setToUnit(e.target.value)}
            options={unitKeys.map(k => ({ value: k, label: cat.units[k].label }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Input label="Value" type="number" value={value} onChange={e => setValue(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Result</label>
            <div className="block w-full rounded-xl backdrop-blur-lg bg-white/30 border border-white/40 px-4 py-2.5 text-gray-900 min-h-[42px]">
              {result}
            </div>
          </div>
        </div>

        {result && <CopyButton text={result} label="Copy Result" />}
      </Card>
    </ToolLayout>
  );
}
