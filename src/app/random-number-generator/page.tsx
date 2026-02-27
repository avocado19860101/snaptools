'use client';
import { useState, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select } from '@/components/ui';

const faqItems = [
  { q: 'Are the numbers truly random?', a: 'Yes. We use crypto.getRandomValues() which provides cryptographically strong random values from your operating system.' },
  { q: 'Is there a limit on how many numbers I can generate?', a: 'You can generate up to 1000 numbers at once. There is no daily limit.' },
  { q: 'Can I use this for lottery picks?', a: 'Yes! Use the lottery generator to pick unique numbers from a range, perfect for lottery-style draws.' },
  { q: 'Is my data stored anywhere?', a: 'No. Everything runs in your browser. History is stored only in memory and cleared when you close the page.' },
  { q: 'What dice types are available?', a: 'We support D4, D6, D8, D10, D12, and D20 — all common tabletop RPG dice.' },
];

function secureRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / (0xFFFFFFFF + 1);
}

function randInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min + 1)) + min;
}

function pickUnique(count: number, min: number, max: number): number[] {
  const set = new Set<number>();
  while (set.size < Math.min(count, max - min + 1)) set.add(randInt(min, max));
  return Array.from(set).sort((a, b) => a - b);
}

export default function RandomNumberGenerator() {
  // Number generator
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [result, setResult] = useState<number[]>([]);

  // Dice
  const [diceCount, setDiceCount] = useState(1);
  const [diceType, setDiceType] = useState(6);
  const [diceResult, setDiceResult] = useState<number[]>([]);

  // Coin
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);

  // List picker
  const [listText, setListText] = useState('');
  const [pickedItem, setPickedItem] = useState<string | null>(null);

  // Lottery
  const [lottoCount, setLottoCount] = useState(6);
  const [lottoMax, setLottoMax] = useState(45);
  const [lottoResult, setLottoResult] = useState<number[]>([]);

  // History
  const [history, setHistory] = useState<string[]>([]);
  const addHistory = useCallback((entry: string) => {
    setHistory(prev => [entry, ...prev].slice(0, 50));
  }, []);

  const generateNumbers = () => {
    const nums = Array.from({ length: Math.min(count, 1000) }, () => randInt(min, max));
    setResult(nums);
    addHistory(`Numbers [${min}-${max}]: ${nums.join(', ')}`);
  };

  const rollDice = () => {
    const rolls = Array.from({ length: Math.min(diceCount, 10) }, () => randInt(1, diceType));
    setDiceResult(rolls);
    addHistory(`${diceCount}d${diceType}: ${rolls.join(', ')} (total: ${rolls.reduce((a, b) => a + b, 0)})`);
  };

  const flipCoin = () => {
    setCoinFlipping(true);
    setCoinResult(null);
    setTimeout(() => {
      const r = secureRandom() < 0.5 ? 'Heads' : 'Tails';
      setCoinResult(r);
      setCoinFlipping(false);
      addHistory(`Coin: ${r}`);
    }, 600);
  };

  const pickFromList = () => {
    const items = listText.split('\n').map(s => s.trim()).filter(Boolean);
    if (!items.length) return;
    const picked = items[randInt(0, items.length - 1)];
    setPickedItem(picked);
    addHistory(`List pick: ${picked}`);
  };

  const generateLottery = () => {
    const nums = pickUnique(lottoCount, 1, lottoMax);
    setLottoResult(nums);
    addHistory(`Lottery [1-${lottoMax}] pick ${lottoCount}: ${nums.join(', ')}`);
  };

  return (
    <ToolLayout
      title="Random Number Generator"
      description={[
        'Generate truly random numbers, roll dice, flip coins, and pick random items from lists — all using cryptographic randomness.',
        'Uses your browser\'s crypto.getRandomValues() for high-quality randomness. No data is sent to any server.',
      ]}
      howTo={{
        steps: [
          'Set a minimum and maximum value, then click "Generate" to get random numbers.',
          'Use the dice roller for tabletop RPG dice (D4 through D20).',
          'Flip a coin or pick a random item from your custom list.',
          'Use the lottery generator to pick unique numbers from a range.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Random Number Generator', url: 'https://snaptools.dev/random-number-generator',
        description: 'Free online random number generator with dice roller, coin flip, and lottery picker.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      {/* Number Generator */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔢 Random Numbers</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div className="w-28"><Input label="Min" type="number" value={min} onChange={e => setMin(+e.target.value)} /></div>
          <div className="w-28"><Input label="Max" type="number" value={max} onChange={e => setMax(+e.target.value)} /></div>
          <div className="w-28"><Input label="Count" type="number" value={count} onChange={e => setCount(+e.target.value)} /></div>
          <Button onClick={generateNumbers} size="lg">Generate</Button>
        </div>
        {result.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="flex flex-wrap gap-2">
              {result.map((n, i) => (
                <span key={i} className="bg-primary-100 text-primary-700 font-bold px-3 py-1.5 rounded-lg text-lg">{n}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Dice Roller */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎲 Dice Roller</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div className="w-24"><Input label="Dice" type="number" value={diceCount} onChange={e => setDiceCount(Math.max(1, Math.min(10, +e.target.value)))} /></div>
          <div className="w-28">
            <Select label="Type" value={String(diceType)} onChange={e => setDiceType(+e.target.value)}
              options={[4,6,8,10,12,20].map(d => ({ value: String(d), label: `D${d}` }))} />
          </div>
          <Button onClick={rollDice} size="lg">Roll</Button>
        </div>
        {diceResult.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="flex flex-wrap gap-2 items-center">
              {diceResult.map((n, i) => (
                <span key={i} className="bg-amber-100 text-amber-800 font-bold w-12 h-12 flex items-center justify-center rounded-xl text-xl">{n}</span>
              ))}
              <span className="ml-3 text-gray-600 font-semibold">Total: {diceResult.reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Coin Flip */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🪙 Coin Flip</h2>
        <div className="flex items-center gap-4">
          <Button onClick={flipCoin} size="lg" disabled={coinFlipping}>Flip Coin</Button>
          {coinFlipping && <div className="text-4xl animate-spin">🪙</div>}
          {coinResult && !coinFlipping && (
            <span className="text-2xl font-bold text-gray-900">{coinResult === 'Heads' ? '👑' : '🌿'} {coinResult}</span>
          )}
        </div>
      </Card>

      {/* List Picker */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Random List Picker</h2>
        <textarea
          value={listText}
          onChange={e => setListText(e.target.value)}
          className="w-full h-28 rounded-xl border border-white/30 bg-white/50 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none mb-3"
          placeholder="Enter items, one per line..."
        />
        <Button onClick={pickFromList} size="lg">Pick Random</Button>
        {pickedItem && (
          <div className="mt-3 glass rounded-2xl p-4 text-center">
            <span className="text-2xl font-bold text-primary-600">{pickedItem}</span>
          </div>
        )}
      </Card>

      {/* Lottery */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎰 Lottery Generator</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div className="w-28"><Input label="Pick" type="number" value={lottoCount} onChange={e => setLottoCount(+e.target.value)} /></div>
          <div className="w-28"><Input label="From 1 to" type="number" value={lottoMax} onChange={e => setLottoMax(+e.target.value)} /></div>
          <Button onClick={generateLottery} size="lg">Generate</Button>
        </div>
        {lottoResult.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="flex flex-wrap gap-2">
              {lottoResult.map((n, i) => (
                <span key={i} className="bg-violet-100 text-violet-700 font-bold w-12 h-12 flex items-center justify-center rounded-full text-lg">{n}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card padding="lg" className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">📜 History</h2>
            <Button variant="ghost" size="sm" onClick={() => setHistory([])}>Clear</Button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-sm text-gray-600 font-mono py-1 border-b border-white/20">{h}</div>
            ))}
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
