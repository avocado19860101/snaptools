'use client';
import { useState, useEffect, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Select } from '@/components/ui';

const faqItems = [
  { q: 'Is my text saved automatically?', a: 'Yes. Your text is auto-saved to your browser\'s localStorage every second and on every keystroke. It persists across page reloads.' },
  { q: 'Can anyone else see my notes?', a: 'No. Everything is stored locally in your browser. Nothing is sent to any server.' },
  { q: 'Is there a character limit?', a: 'There is no hard limit from the tool itself, but browsers typically allow around 5MB of localStorage per domain.' },
  { q: 'Can I download my notes?', a: 'Yes. Click the "Download as .txt" button to save your notes as a plain text file.' },
  { q: 'What happens if I clear my browser data?', a: 'Your saved notes will be lost. We recommend downloading important notes before clearing browser data.' },
];

const STORAGE_KEY = 'snaptools-notepad';

export default function OnlineNotepad() {
  const [text, setText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('16');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setText(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, text);
  }, [text, loaded]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text ? text.split('\n').length : 0;

  const download = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'notepad.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [text]);

  const clear = () => {
    if (confirm('Are you sure you want to clear the notepad?')) {
      setText('');
    }
  };

  return (
    <ToolLayout
      title="Online Notepad"
      description={[
        'A simple, distraction-free online notepad that auto-saves to your browser. Write notes, drafts, or code snippets.',
        'Everything is stored locally — nothing is uploaded. Features live word/character/line counts, dark mode, and adjustable font size.',
      ]}
      howTo={{
        steps: [
          'Start typing in the notepad area below. Your text auto-saves automatically.',
          'View live word count, character count, and line count in the stats bar.',
          'Toggle dark mode or adjust font size using the controls above the notepad.',
          'Click "Download as .txt" to save your notes as a file, or "Clear" to reset.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Online Notepad', url: 'https://snaptools.dev/online-notepad',
        description: 'Free online notepad with auto-save, word count, and dark mode. No sign-up required.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Notepad</h2>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Button variant={darkMode ? 'primary' : 'ghost'} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </Button>
          <div className="w-36">
            <Select
              label=""
              options={[
                { value: '12', label: '12px' },
                { value: '14', label: '14px' },
                { value: '16', label: '16px (default)' },
                { value: '18', label: '18px' },
                { value: '20', label: '20px' },
                { value: '24', label: '24px' },
              ]}
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
            />
          </div>
          <div className="flex-1" />
          <Button variant="ghost" onClick={download} disabled={!text}>Download as .txt</Button>
          <Button variant="ghost" onClick={clear} disabled={!text}>Clear</Button>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing..."
          style={{ fontSize: `${fontSize}px` }}
          className={`w-full min-h-[400px] rounded-xl p-4 border transition-colors duration-200 resize-y font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            darkMode
              ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-500'
              : 'bg-white/50 text-gray-900 border-white/40 placeholder-gray-400'
          }`}
        />

        <div className="flex gap-6 mt-3 text-sm text-gray-500">
          <span>{words} {words === 1 ? 'word' : 'words'}</span>
          <span>{chars} {chars === 1 ? 'character' : 'characters'}</span>
          <span>{lines} {lines === 1 ? 'line' : 'lines'}</span>
        </div>
      </Card>
    </ToolLayout>
  );
}
