'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Input } from '@/components/ui';

const CATEGORIES: Record<string, string[]> = {
  Smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐'],
  People: ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','👀','👁️','👅','👄','💋','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵'],
  Animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎'],
  Food: ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🫓','🥪','🌮','🌯'],
  Travel: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','🛼','🚁','✈️','🛩️','🚀','🛸','🚢','⛵','🚤','🛥️','⛴️','🏠','🏡','🏢','🏣','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🗼','🗽','⛪','🕌','🛕','🕍','⛩️','🗾','🌍','🌎','🌏'],
  Activities: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🥍','🏑','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','🎮','🕹️','🎲','♟️','🧩','🎯','🎳','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🎸','🪕'],
  Objects: ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','💾','💿','📀','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️','⏰','🕰️','💡','🔦','🕯️','🪔','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📄','📰','📑','🔖'],
  Symbols: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','✨','⭐','🌟','💫','🔥','💥','💢','💦','💨','🕳️','💤','👋','✅','❌','⭕','❗','❓','❕','❔','💯','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔶','🔷','🔸','🔹','🔺','🔻'],
};

const ALL_CATEGORIES = Object.keys(CATEGORIES);

const faqItems = [
  { q: 'How do I copy an emoji?', a: 'Simply click on any emoji and it will be automatically copied to your clipboard. You\'ll see a brief confirmation.' },
  { q: 'Can I search for specific emojis?', a: 'Yes! Use the search box to filter emojis. Note that search matches against the emoji characters themselves and category names.' },
  { q: 'Do these emojis work everywhere?', a: 'These are standard Unicode emojis supported by all modern operating systems, browsers, and most apps. Appearance may vary by platform.' },
  { q: 'Is my data stored anywhere?', a: 'No. Recently copied emojis are stored only in your browser\'s memory and are cleared when you close the page.' },
  { q: 'How many emojis are available?', a: 'We include over 400 popular emojis across 8 categories: Smileys, People, Animals, Food, Travel, Activities, Objects, and Symbols.' },
];

export default function EmojiPicker() {
  const [category, setCategory] = useState('Smileys');
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return CATEGORIES[category] || [];
    const q = search.toLowerCase();
    const results: string[] = [];
    for (const [cat, emojis] of Object.entries(CATEGORIES)) {
      if (cat.toLowerCase().includes(q)) { results.push(...emojis); continue; }
      results.push(...emojis.filter(e => e.includes(q)));
    }
    return [...new Set(results)];
  }, [category, search]);

  const copyEmoji = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(null), 1200);
    setRecent(prev => [emoji, ...prev.filter(e => e !== emoji)].slice(0, 20));
  };

  return (
    <ToolLayout
      title="Emoji Picker"
      description={[
        'Browse and copy emojis instantly. Search by category or keyword, click to copy, and paste anywhere.',
        'All emojis are standard Unicode and work across all modern platforms and devices. No installation required.',
      ]}
      howTo={{
        steps: [
          'Browse emoji categories using the tabs above the grid.',
          'Use the search box to filter emojis by keyword or category.',
          'Click any emoji to copy it to your clipboard.',
          'Paste the emoji anywhere — messages, documents, code, or social media.',
          'View your recently copied emojis at the top for quick access.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Emoji Picker', url: 'https://snaptools.dev/emoji-picker',
        description: 'Free online emoji picker. Browse, search, and copy emojis instantly.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Pick an Emoji</h2>
        <div className="mb-4">
          <Input label="Search emojis" value={search} onChange={e => setSearch(e.target.value)} placeholder="Type to search…" />
        </div>

        {!search && (
          <div className="flex flex-wrap gap-2 mb-5">
            {ALL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${category === cat ? 'bg-primary-500 text-white shadow' : 'bg-white/40 text-gray-600 hover:bg-white/60'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {recent.length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-2">Recently copied</p>
            <div className="flex flex-wrap gap-1">
              {recent.map((e, i) => (
                <button key={i} onClick={() => copyEmoji(e)} className="text-2xl p-1 rounded-lg hover:bg-white/50 transition-colors">{e}</button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {filtered.map((emoji, i) => (
            <button key={i} onClick={() => copyEmoji(emoji)}
              className={`text-2xl p-2 rounded-xl transition-all hover:bg-white/50 hover:scale-110 ${copied === emoji ? 'bg-success-light/30 scale-110' : ''}`}
              title="Click to copy">
              {emoji}
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-gray-400 text-center py-8">No emojis found.</p>}
      </Card>
    </ToolLayout>
  );
}
