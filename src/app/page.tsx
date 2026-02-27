import Link from 'next/link';
import type { Metadata } from 'next';
import { Section, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'SnapTools - Free Online Tools for Everyday Tasks',
  description: 'Resize images, generate QR codes, create passwords, convert colors, and more — all free and processed in your browser.',
};

const tools = [
  { name: 'Image Resizer', desc: 'Resize any image to exact dimensions. Fast and free.', href: '/image-resizer', icon: '🖼️' },
  { name: 'Image Compressor', desc: 'Compress images to reduce file size without losing quality.', href: '/image-compressor', icon: '📦' },
  { name: 'QR Code Generator', desc: 'Create QR codes for URLs, text, or any data instantly.', href: '/qr-code-generator', icon: '📱' },
  { name: 'Word Counter', desc: 'Count words, characters, sentences, and paragraphs.', href: '/word-counter', icon: '📝' },
  { name: 'Password Generator', desc: 'Generate strong, secure passwords with custom options.', href: '/password-generator', icon: '🔐' },
  { name: 'Color Picker', desc: 'Pick colors and convert between HEX, RGB, and HSL.', href: '/color-picker', icon: '🎨' },
  { name: 'Text Case Converter', desc: 'Convert text to UPPERCASE, lowercase, Title Case, and more.', href: '/text-case-converter', icon: '🔤' },
  { name: 'Unit Converter', desc: 'Convert between length, weight, temperature, volume, and more.', href: '/unit-converter', icon: '📐' },
  { name: 'Percentage Calculator', desc: 'Calculate percentages, percentage of a number, and percentage change.', href: '/percentage-calculator', icon: '💯' },
  { name: 'Base64 Encoder/Decoder', desc: 'Encode text to Base64 or decode Base64 strings with Unicode support.', href: '/base64-encoder-decoder', icon: '🔣' },
  { name: 'URL Encoder/Decoder', desc: 'Encode or decode URL strings with special characters.', href: '/url-encoder-decoder', icon: '🔗' },
  { name: 'Timestamp Converter', desc: 'Convert Unix timestamps to dates and dates to timestamps.', href: '/timestamp-converter', icon: '🕐' },
  { name: 'Lorem Ipsum Generator', desc: 'Generate placeholder text for designs, mockups, and prototypes.', href: '/lorem-ipsum-generator', icon: '📄' },
  { name: 'Emoji Picker', desc: 'Browse, search, and copy emojis instantly. Click to copy.', href: '/emoji-picker', icon: '😀' },
  { name: 'Favicon Generator', desc: 'Generate favicons in all sizes from any image. Client-side.', href: '/favicon-generator', icon: '⭐' },
  { name: 'Aspect Ratio Calculator', desc: 'Calculate and convert aspect ratios. Lock and resize proportionally.', href: '/aspect-ratio-calculator', icon: '🖥️' },
  { name: 'CSS Gradient Generator', desc: 'Create beautiful CSS gradients visually with live preview.', href: '/css-gradient-generator', icon: '🌈' },
  { name: 'Image Format Converter', desc: 'Convert images between PNG, JPG, and WebP formats instantly.', href: '/image-format-converter', icon: '🔄' },
  { name: 'PDF Merge', desc: 'Merge multiple PDF files into one document. Reorder and combine.', href: '/pdf-merge', icon: '📑' },
  { name: 'Screenshot Beautifier', desc: 'Add gradient backgrounds, rounded corners, and shadows to screenshots.', href: '/screenshot-beautifier', icon: '✨' },
  { name: 'Image Crop Tool', desc: 'Crop images with preset aspect ratios. Drag to select area.', href: '/image-crop', icon: '✂️' },
  { name: 'PDF to JPG Converter', desc: 'Convert PDF pages to high-quality JPG images instantly.', href: '/pdf-to-jpg', icon: '📄' },
  { name: 'JSON Formatter', desc: 'Format, validate, and beautify JSON with syntax highlighting.', href: '/json-formatter', icon: '{ }' },
  { name: 'Morse Code Translator', desc: 'Translate text to Morse code and back with audio playback.', href: '/morse-code-translator', icon: '📡' },
  { name: 'Age Calculator', desc: 'Calculate your exact age, total days lived, and next birthday.', href: '/age-calculator', icon: '🎂' },
  { name: 'Binary / Hex Converter', desc: 'Convert numbers between Decimal, Binary, Octal, and Hexadecimal.', href: '/binary-hex-converter', icon: '🔢' },
  { name: 'Online Notepad', desc: 'Distraction-free notepad with auto-save, word count, and dark mode.', href: '/online-notepad', icon: '📓' },
  { name: 'Text to Binary', desc: 'Convert text to binary and binary to text with Unicode support.', href: '/text-to-binary', icon: '💻' },
  { name: 'RGB to HEX Converter', desc: 'Convert colors between RGB, HEX, and HSL with live preview.', href: '/rgb-to-hex', icon: '🎨' },
  { name: 'Compress Image to Size', desc: 'Compress images to a specific file size target. All client-side.', href: '/compress-image-to-size', icon: '🗜️' },
  { name: 'Video to GIF Converter', desc: 'Convert video clips to animated GIFs entirely in your browser.', href: '/video-to-gif', icon: '🎬' },
  { name: 'Credit Card Validator', desc: 'Validate credit card numbers with the Luhn algorithm. Detect card type.', href: '/credit-card-validator', icon: '💳' },
  { name: 'Image Background Remover', desc: 'Remove solid-color backgrounds from images with color-key removal.', href: '/background-remover', icon: '🖼️' },
  { name: 'Image Watermark', desc: 'Add text watermarks to images with custom position, opacity, and rotation.', href: '/image-watermark', icon: '💧' },
  { name: 'PDF Compress', desc: 'Compress PDF files by removing metadata and optimizing structure.', href: '/pdf-compress', icon: '📄' },
  { name: 'Flip & Rotate Image', desc: 'Flip and rotate images by any angle. Horizontal, vertical, and custom.', href: '/flip-rotate-image', icon: '🔃' },
  { name: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes from text or files.', href: '/hash-generator', icon: '🔏' },
  { name: 'Color Palette Generator', desc: 'Extract dominant colors from images or generate harmonious palettes.', href: '/color-palette-generator', icon: '🎨' },
  { name: 'Diff Checker', desc: 'Compare two texts and highlight differences line by line.', href: '/diff-checker', icon: '📊' },
  { name: 'Markdown Preview', desc: 'Write Markdown and see it rendered in real-time.', href: '/markdown-preview', icon: '📝' },
  { name: 'Invoice Generator', desc: 'Create professional invoices and download as PDF. All client-side.', href: '/invoice-generator', icon: '🧾' },
  { name: 'Pomodoro Timer', desc: 'Stay focused with the Pomodoro Technique. Customizable timer.', href: '/pomodoro-timer', icon: '🍅' },
  { name: 'Random Number Generator', desc: 'Generate random numbers, roll dice, flip coins, and more.', href: '/random-number-generator', icon: '🎲' },
  { name: 'Stopwatch', desc: 'Precise stopwatch with lap times, split tracking, and CSV export.', href: '/stopwatch', icon: '⏱️' },
  { name: 'Text Repeater', desc: 'Repeat any text multiple times with custom separators. Great for social media.', href: '/text-repeater', icon: '🔁' },
  { name: 'IP Address Lookup', desc: 'Find your public IP address, location, timezone, and ISP instantly.', href: '/ip-address-lookup', icon: '🌐' },
  { name: 'Screen Resolution Checker', desc: 'Check your screen resolution, viewport size, pixel ratio, and more.', href: '/screen-resolution', icon: '🖥️' },
  { name: 'Regex Tester', desc: 'Test regular expressions with real-time highlighting and match details.', href: '/regex-tester', icon: '🔍' },
  { name: 'SVG to PNG Converter', desc: 'Convert SVG files to PNG with custom dimensions, scale, and background.', href: '/svg-to-png', icon: '🖼️' },
  { name: 'Social Media Character Counter', desc: 'Check text against character limits for Twitter, Instagram, YouTube, and more.', href: '/social-media-counter', icon: '📊' },
];

const features = [
  { icon: '🔒', title: '100% Private', desc: 'Your files never leave your device. Everything is processed locally in your browser.' },
  { icon: '⚡', title: 'Lightning Fast', desc: 'No waiting for server uploads. Tools work instantly on your device.' },
  { icon: '💰', title: 'Completely Free', desc: 'No sign-ups, no subscriptions, no hidden fees. Free forever.' },
];

export default function Home() {
  return (
    <>
      <Section className="py-20 sm:py-28">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Free Online Tools for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-violet-500">Everyday Tasks</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Resize images, generate QR codes, create secure passwords, and more. All tools run directly in your browser — no uploads, no sign-ups, completely free.
          </p>
        </div>
      </Section>

      <Section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">All Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(t => (
            <Link key={t.href} href={t.href} className="group block">
              <Card hover padding="md">
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 mb-2 transition-colors">{t.name}</h3>
                <p className="text-gray-500">{t.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why SnapTools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(f => (
            <Card key={f.title} padding="lg" className="text-center">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SnapTools',
        url: 'https://snaptools.dev',
        description: 'Free online tools for everyday tasks',
        potentialAction: { '@type': 'SearchAction', target: 'https://snaptools.dev/?q={search_term_string}', 'query-input': 'required name=search_term_string' }
      })}} />
    </>
  );
}
