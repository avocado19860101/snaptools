'use client';
import { useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What characters are supported?', a: 'Letters A-Z, numbers 0-9, and common punctuation including period, comma, question mark, exclamation, slash, parentheses, ampersand, colon, semicolon, equals, plus, minus, quotation marks, and at sign.' },
  { q: 'Can I translate Morse code back to text?', a: 'Yes! The tool works bidirectionally. Type Morse code (dots and dashes separated by spaces) in the Morse input to convert back to text.' },
  { q: 'How do I play the Morse code as audio?', a: 'Click the "Play Audio" button to hear the Morse code as beeps using your device speakers via the Web Audio API.' },
  { q: 'What is the format for Morse code input?', a: 'Use dots (.) and dashes (-) for each character, spaces between characters, and forward slashes (/) between words.' },
  { q: 'Is this tool free to use?', a: 'Yes, completely free with no sign-ups or limitations. Everything runs in your browser.' },
];

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '"': '.-..-.',
  '@': '.--.-.', "'": '.----.', ' ': '/',
};
const REVERSE_MAP: Record<string, string> = {};
Object.entries(MORSE_MAP).forEach(([k, v]) => { if (k !== ' ') REVERSE_MAP[v] = k; });

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => MORSE_MAP[c] ?? '').filter(Boolean).join(' ');
}

function morseToText(morse: string): string {
  return morse.split(' / ').map(word =>
    word.split(' ').map(c => REVERSE_MAP[c] ?? '').join('')
  ).join(' ');
}

export default function MorseCodeTranslator() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleTextChange = (v: string) => {
    setText(v);
    setMorse(textToMorse(v));
  };

  const handleMorseChange = (v: string) => {
    setMorse(v);
    setText(morseToText(v));
  };

  const playAudio = async () => {
    if (!morse || playing) return;
    setPlaying(true);
    const ctx = audioCtxRef.current || new AudioContext();
    audioCtxRef.current = ctx;
    const DOT = 0.08, DASH = 0.24, GAP = 0.08, CHAR_GAP = 0.24, WORD_GAP = 0.56;
    let t = ctx.currentTime;

    for (const char of morse) {
      if (char === '.' || char === '-') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.3;
        osc.start(t);
        const dur = char === '.' ? DOT : DASH;
        osc.stop(t + dur);
        t += dur + GAP;
      } else if (char === ' ') {
        t += CHAR_GAP;
      } else if (char === '/') {
        t += WORD_GAP;
      }
    }

    setTimeout(() => setPlaying(false), (t - ctx.currentTime) * 1000 + 100);
  };

  const chartEntries = Object.entries(MORSE_MAP).filter(([k]) => k !== ' ');

  return (
    <ToolLayout
      title="Morse Code Translator"
      description={[
        'Translate text to Morse code and Morse code to text instantly. Play Morse code as audio beeps.',
        'Supports letters, numbers, and common punctuation. Bidirectional translation with audio playback using Web Audio API.',
      ]}
      howTo={{
        steps: [
          'Type text in the top field to convert to Morse code automatically.',
          'Or type Morse code (dots and dashes) in the bottom field to convert to text.',
          'Click "Play Audio" to hear the Morse code as beeps.',
          'Use the copy button to copy the result. Reference the chart below for all codes.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Morse Code Translator', url: 'https://snaptools.dev/morse-code-translator',
        description: 'Free online Morse code translator with audio playback. Convert text to Morse and back.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Translate</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          placeholder="Type text here..."
          className="w-full h-28 rounded-xl border border-white/30 bg-white/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-y mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Morse Code</label>
        <textarea
          value={morse}
          onChange={e => handleMorseChange(e.target.value)}
          placeholder="Or type Morse code (e.g. .... . .-.. .-.. ---)"
          className="w-full h-28 rounded-xl border border-white/30 bg-white/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-y mb-4"
        />

        <div className="flex flex-wrap gap-3">
          <Button onClick={playAudio} disabled={!morse || playing} size="md">
            {playing ? '🔊 Playing...' : '▶ Play Audio'}
          </Button>
          {morse && <CopyButton text={morse} />}
          {text && <CopyButton text={text} />}
          <Button variant="ghost" size="md" onClick={() => { setText(''); setMorse(''); }}>Clear</Button>
        </div>
      </Card>

      <Card padding="lg" className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Morse Code Reference</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-sm">
          {chartEntries.map(([char, code]) => (
            <div key={char} className="glass rounded-lg p-2 text-center">
              <span className="font-bold text-gray-900">{char}</span>
              <span className="text-gray-500 ml-2 font-mono">{code}</span>
            </div>
          ))}
        </div>
      </Card>
    </ToolLayout>
  );
}
