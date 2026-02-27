'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input } from '@/components/ui';

const faqItems = [
  { q: 'What is the Pomodoro Technique?', a: 'It\'s a time management method that uses 25-minute focused work sessions followed by short breaks. After 4 sessions, you take a longer break.' },
  { q: 'Can I customize the timer durations?', a: 'Yes! You can change the work, short break, and long break durations in the settings.' },
  { q: 'Will I hear a notification when the timer ends?', a: 'Yes. The timer uses the Web Audio API to play a beep sound when each session ends. Make sure your volume is on.' },
  { q: 'Are my stats saved?', a: 'Yes. Your completed pomodoros for today are saved in your browser\'s localStorage and persist across page refreshes.' },
  { q: 'Does the timer work in the background?', a: 'Yes. The timer continues running even if you switch tabs, using accurate time tracking.' },
];

type Phase = 'work' | 'shortBreak' | 'longBreak';

const STORAGE_KEY = 'pomodoro-stats';

function getToday() { return new Date().toISOString().slice(0, 10); }

function loadStats(): number {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return d.date === getToday() ? (d.count || 0) : 0;
  } catch { return 0; }
}

function saveStats(count: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getToday(), count }));
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    setTimeout(() => {
      const o2 = ctx.createOscillator();
      o2.connect(gain);
      o2.frequency.value = 1000;
      o2.start();
      o2.stop(ctx.currentTime + 0.3);
    }, 350);
  } catch { /* no audio */ }
}

export default function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setCompleted(loadStats()); }, []);

  const totalSecs = phase === 'work' ? workMin * 60 : phase === 'shortBreak' ? shortMin * 60 : longMin * 60;
  const progress = totalSecs > 0 ? (totalSecs - timeLeft) / totalSecs : 0;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const phaseLabel = phase === 'work' ? '🍅 Focus Time' : phase === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break';
  const phaseColor = phase === 'work' ? '#ef4444' : phase === 'shortBreak' ? '#22c55e' : '#6366f1';

  const switchPhase = useCallback((nextPhase: Phase) => {
    setPhase(nextPhase);
    const dur = nextPhase === 'work' ? workMin * 60 : nextPhase === 'shortBreak' ? shortMin * 60 : longMin * 60;
    setTimeLeft(dur);
    setRunning(false);
    endTimeRef.current = null;
  }, [workMin, shortMin, longMin]);

  const handleComplete = useCallback(() => {
    playBeep();
    if (phase === 'work') {
      const next = completed + 1;
      setCompleted(next);
      saveStats(next);
      switchPhase(next % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      switchPhase('work');
    }
  }, [phase, completed, switchPhase]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      endTimeRef.current = null;
      return;
    }
    if (!endTimeRef.current) endTimeRef.current = Date.now() + timeLeft * 1000;
    intervalRef.current = setInterval(() => {
      const remaining = Math.round((endTimeRef.current! - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        setRunning(false);
        handleComplete();
      } else {
        setTimeLeft(remaining);
      }
    }, 250);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, handleComplete, timeLeft]);

  const start = () => setRunning(true);
  const pause = () => { setRunning(false); endTimeRef.current = null; };
  const reset = () => { setRunning(false); endTimeRef.current = null; setTimeLeft(totalSecs); };

  // SVG circle
  const r = 90, circ = 2 * Math.PI * r;

  return (
    <ToolLayout
      title="Pomodoro Timer"
      description={[
        'Stay focused and productive with the Pomodoro Technique. Work in 25-minute sessions with short breaks in between.',
        'Customize durations, track completed sessions, and get audio notifications — all in your browser with no sign-up required.',
      ]}
      howTo={{
        steps: [
          'Click "Start" to begin a 25-minute focus session.',
          'Work until the timer ends and you hear the notification beep.',
          'Take a short 5-minute break. After 4 sessions, take a longer 15-minute break.',
          'Customize durations in settings to fit your workflow.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Pomodoro Timer', url: 'https://snaptools.dev/pomodoro-timer',
        description: 'Free online Pomodoro timer for focus and productivity.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <div className="flex flex-col items-center">
          <div className="text-lg font-medium text-gray-600 mb-4">{phaseLabel}</div>

          {/* SVG Timer */}
          <div className="relative w-56 h-56 mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle cx="100" cy="100" r={r} fill="none" stroke={phaseColor} strokeWidth="8"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-gray-900 tabular-nums">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            {!running ? (
              <Button size="lg" onClick={start}>▶ Start</Button>
            ) : (
              <Button size="lg" variant="ghost" onClick={pause}>⏸ Pause</Button>
            )}
            <Button size="lg" variant="ghost" onClick={reset}>↺ Reset</Button>
          </div>

          {/* Phase shortcuts */}
          <div className="flex gap-2 mb-6">
            <Button size="sm" variant={phase === 'work' ? 'primary' : 'ghost'} onClick={() => switchPhase('work')}>Focus</Button>
            <Button size="sm" variant={phase === 'shortBreak' ? 'primary' : 'ghost'} onClick={() => switchPhase('shortBreak')}>Short Break</Button>
            <Button size="sm" variant={phase === 'longBreak' ? 'primary' : 'ghost'} onClick={() => switchPhase('longBreak')}>Long Break</Button>
          </div>

          {/* Stats */}
          <div className="text-center mb-4">
            <span className="text-3xl">🍅</span>
            <span className="text-xl font-semibold text-gray-900 ml-2">{completed}</span>
            <span className="text-gray-500 ml-1">pomodoros today</span>
          </div>

          {/* Settings toggle */}
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>⚙ Settings</Button>
          {showSettings && (
            <div className="grid grid-cols-3 gap-3 mt-4 w-full max-w-sm">
              <Input label="Work (min)" type="number" value={workMin} onChange={e => { setWorkMin(+e.target.value); if (!running && phase === 'work') setTimeLeft(+e.target.value * 60); }} />
              <Input label="Short (min)" type="number" value={shortMin} onChange={e => { setShortMin(+e.target.value); if (!running && phase === 'shortBreak') setTimeLeft(+e.target.value * 60); }} />
              <Input label="Long (min)" type="number" value={longMin} onChange={e => { setLongMin(+e.target.value); if (!running && phase === 'longBreak') setTimeLeft(+e.target.value * 60); }} />
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
}
