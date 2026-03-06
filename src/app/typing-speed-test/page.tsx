'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button } from '@/components/ui';

const paragraphs = [
  'The quick brown fox jumps over the lazy dog near the riverbank. She sells seashells by the seashore while the sun sets behind the mountains. A journey of a thousand miles begins with a single step forward.',
  'Programming is the art of telling a computer what to do. Every great developer was once a beginner who refused to give up. Clean code reads like well-written prose and speaks volumes about its author.',
  'Technology is best when it brings people together and solves real problems. Innovation distinguishes between a leader and a follower. The only way to do great work is to love what you do every single day.',
  'The universe is under no obligation to make sense to you or anyone else. Science is a way of thinking much more than it is a body of knowledge. Curiosity is the engine of achievement and discovery.',
  'In the middle of difficulty lies opportunity for growth and learning. Success is not final and failure is not fatal. It is the courage to continue that counts the most in life and work.',
];

const faqItems = [
  { q: 'How is WPM calculated?', a: 'Words per minute is calculated by dividing the total characters typed by 5 (standard word length) and then dividing by the elapsed time in minutes.' },
  { q: 'How is accuracy measured?', a: 'Accuracy is the percentage of correctly typed characters out of the total characters typed so far.' },
  { q: 'Is my best score saved?', a: 'Yes, your best WPM score is saved to your browser\'s localStorage so it persists between sessions.' },
  { q: 'Can I practice with different texts?', a: 'Yes! Click "New Test" to get a random paragraph each time. We rotate through several different passages.' },
  { q: 'Does this work on mobile?', a: 'Yes, but typing tests are best experienced on a physical keyboard for accurate WPM measurement.' },
];

export default function TypingSpeedTest() {
  const [paragraph, setParagraph] = useState(() => paragraphs[Math.floor(Math.random() * paragraphs.length)]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [bestWpm, setBestWpm] = useState<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('snaptools-typing-best-wpm');
    if (saved) setBestWpm(Number(saved));
  }, []);

  const isFinished = input.length >= paragraph.length;
  const elapsed = startTime ? ((endTime || Date.now()) - startTime) / 1000 : 0;
  const minutes = elapsed / 60;
  const correctChars = input.split('').filter((c, i) => c === paragraph[i]).length;
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;

  // Auto-refresh wpm display
  const [, setTick] = useState(0);
  useEffect(() => {
    if (startTime && !endTime) {
      const id = setInterval(() => setTick(t => t + 1), 200);
      return () => clearInterval(id);
    }
  }, [startTime, endTime]);

  const handleInput = useCallback((val: string) => {
    if (endTime) return;
    if (!startTime) setStartTime(Date.now());
    if (val.length >= paragraph.length) {
      setEndTime(Date.now());
      const finalElapsed = (Date.now() - (startTime || Date.now())) / 1000;
      const finalCorrect = val.split('').filter((c, i) => c === paragraph[i]).length;
      const finalWpm = Math.round((finalCorrect / 5) / (finalElapsed / 60));
      if (finalWpm > bestWpm) {
        setBestWpm(finalWpm);
        localStorage.setItem('snaptools-typing-best-wpm', String(finalWpm));
      }
    }
    setInput(val.slice(0, paragraph.length));
  }, [startTime, endTime, paragraph, bestWpm]);

  const reset = () => {
    setParagraph(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <ToolLayout
      title="Typing Speed Test"
      description={[
        'Test your typing speed with real-time WPM tracking, accuracy measurement, and personal best scores.',
        'Start typing to begin the timer. Characters are highlighted green for correct and red for incorrect as you type.',
      ]}
      howTo={{ steps: [
        'Click the text area or press any key to start the test.',
        'Type the displayed paragraph as quickly and accurately as you can.',
        'Watch your real-time WPM and accuracy update as you type.',
        'Complete the paragraph to see your final results and compare with your best score.',
      ]}}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Typing Speed Test', url: 'https://snaptools.dev/typing-speed-test',
        description: 'Free online typing speed test with WPM tracking and accuracy measurement.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Typing Test</h2>
          {bestWpm > 0 && <span className="text-sm text-gray-500">🏆 Best: {bestWpm} WPM</span>}
        </div>

        <div className="flex gap-6 mb-5 text-center">
          <div className="glass rounded-xl px-4 py-3 flex-1">
            <div className="text-2xl font-bold text-gray-900">{wpm}</div>
            <div className="text-xs text-gray-500">WPM</div>
          </div>
          <div className="glass rounded-xl px-4 py-3 flex-1">
            <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="glass rounded-xl px-4 py-3 flex-1">
            <div className="text-2xl font-bold text-gray-900">{elapsed.toFixed(1)}s</div>
            <div className="text-xs text-gray-500">Time</div>
          </div>
        </div>

        <div className="glass rounded-xl p-4 mb-5 leading-relaxed text-lg font-mono select-none">
          {paragraph.split('').map((char, i) => {
            let cls = 'text-gray-400';
            if (i < input.length) {
              cls = input[i] === char ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
            } else if (i === input.length) {
              cls = 'text-gray-900 border-b-2 border-primary-500';
            }
            return <span key={i} className={cls}>{char}</span>;
          })}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={e => handleInput(e.target.value)}
          disabled={isFinished}
          placeholder="Start typing here..."
          className="w-full h-24 p-4 rounded-xl glass border-0 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono text-lg"
          autoFocus
        />

        {isFinished && (
          <div className="mt-5 p-4 glass rounded-xl text-center">
            <p className="text-lg font-semibold text-gray-900 mb-1">Test Complete!</p>
            <p className="text-gray-600">{wpm} WPM · {accuracy}% accuracy · {elapsed.toFixed(1)}s</p>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={reset}>New Test</Button>
        </div>
      </Card>
    </ToolLayout>
  );
}
