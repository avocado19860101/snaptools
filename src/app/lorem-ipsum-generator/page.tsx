'use client';
import { useState, useCallback } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Slider, Select, CopyButton } from '@/components/ui';

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum','at','vero','eos','accusamus','iusto','odio',
  'dignissimos','ducimus','blanditiis','praesentium','voluptatum','deleniti','atque',
  'corrupti','quos','dolores','quas','molestias','excepturi','occaecati','cupiditate',
  'provident','similique','mollitia','animi','fuga','harum','rerum','necessitatibus',
  'saepe','eveniet','aut','inventore','veritatis','quasi','architecto','beatae','vitae',
  'dicta','explicabo','nemo','ipsam','voluptatem','quia','voluptas','aspernatur',
  'odit','fugit','consequuntur','magni','ratione','sequi','nesciunt','neque','porro',
  'quisquam','nihil','impedit','quo','minus','maxime','placeat','facere','possimus',
  'omnis','recusandae','numquam','eius','modi','tempora','totam','rem','aperiam',
];

const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const generateSentence = (minW = 6, maxW = 14): string => {
  const len = minW + Math.floor(Math.random() * (maxW - minW + 1));
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
};

const generateParagraph = (sentences = 5): string =>
  Array.from({ length: sentences }, () => generateSentence()).join(' ');

const faqItems = [
  { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is placeholder text used in the printing and typesetting industry since the 1500s. It helps designers visualize how content will look without using meaningful text.' },
  { q: 'Can I use this text commercially?', a: 'Yes! Lorem Ipsum is in the public domain and can be used freely in any project, commercial or personal.' },
  { q: 'Why start with "Lorem ipsum dolor sit amet"?', a: 'This is the traditional opening phrase dating back to a scrambled passage from Cicero\'s "De Finibus Bonorum et Malorum" (45 BC). It\'s instantly recognizable as placeholder text.' },
  { q: 'How is the text generated?', a: 'Our generator creates pseudo-random text from a curated word list based on classical Lorem Ipsum. It runs entirely in your browser with no server calls.' },
  { q: 'Can I generate text in other languages?', a: 'Currently we support the classic Latin-based Lorem Ipsum only. We may add other placeholder text styles in the future.' },
];

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    let text = '';
    if (mode === 'paragraphs') {
      const paras = Array.from({ length: count }, () => generateParagraph(4 + Math.floor(Math.random() * 4)));
      text = paras.join('\n\n');
    } else if (mode === 'sentences') {
      text = Array.from({ length: count }, () => generateSentence()).join(' ');
    } else {
      text = Array.from({ length: count }, randomWord).join(' ');
    }
    if (startClassic && text.length > 0) {
      text = LOREM_START + text.slice(text.indexOf(' ', 1) + 1);
    }
    setOutput(text);
  }, [mode, count, startClassic]);

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description={[
        'Generate placeholder Lorem Ipsum text for your designs, mockups, and prototypes. Choose paragraphs, sentences, or words.',
        'This generator runs entirely in your browser. Customize the amount and style of placeholder text and copy it instantly.',
      ]}
      howTo={{
        steps: [
          'Select the type of text to generate: paragraphs, sentences, or words.',
          'Use the slider to set the desired count (1–50).',
          'Optionally toggle the classic "Lorem ipsum dolor sit amet…" opening.',
          'Click "Generate" to create your placeholder text.',
          'Click the copy button to copy the text to your clipboard.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Lorem Ipsum Generator', url: 'https://snaptools.dev/lorem-ipsum-generator',
        description: 'Free online Lorem Ipsum placeholder text generator.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Generate Lorem Ipsum</h2>
        <div className="flex flex-wrap gap-4 items-end mb-5">
          <div className="w-48">
            <Select label="Type" value={mode} onChange={e => setMode(e.target.value)} options={[
              { value: 'paragraphs', label: 'Paragraphs' },
              { value: 'sentences', label: 'Sentences' },
              { value: 'words', label: 'Words' },
            ]} />
          </div>
        </div>
        <div className="mb-5">
          <Slider label={`Count`} value={count} onChange={setCount} min={1} max={50} />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-5">
          <input type="checkbox" checked={startClassic} onChange={e => setStartClassic(e.target.checked)} className="rounded" />
          Start with &quot;Lorem ipsum dolor sit amet…&quot;
        </label>
        <Button onClick={generate} size="lg">Generate</Button>

        {output && (
          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-500">{mode === 'paragraphs' ? `${count} paragraph(s)` : mode === 'sentences' ? `${count} sentence(s)` : `${count} word(s)`}</p>
              <CopyButton text={output} />
            </div>
            <div className="glass rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto text-sm">
              {output}
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
}
