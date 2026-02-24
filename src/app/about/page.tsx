import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About', description: 'Learn about SnapTools — free online tools for everyday tasks.' };

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>About SnapTools</h1>
      <p>SnapTools is a collection of free, browser-based utility tools designed to help you get everyday tasks done quickly and privately. Whether you need to resize an image, generate a QR code, create a secure password, or convert text — we&apos;ve got you covered.</p>

      <h2>Our Mission</h2>
      <p>We believe simple tools should be free, fast, and private. Too many online tools require sign-ups, upload your files to unknown servers, or hide features behind paywalls. SnapTools is different:</p>
      <ul>
        <li><strong>100% Free</strong> — No premium tiers, no hidden fees.</li>
        <li><strong>100% Private</strong> — All processing happens in your browser. Your files never leave your device.</li>
        <li><strong>No Sign-up Required</strong> — Just open the tool and use it. No accounts, no emails.</li>
      </ul>

      <h2>How It Works</h2>
      <p>Every tool on SnapTools uses modern browser APIs (like the Canvas API, Web Crypto API, and FileReader API) to process your data locally on your device. Nothing is uploaded to any server. This means our tools work even if you lose your internet connection after loading the page.</p>

      <h2>Built for Everyone</h2>
      <p>SnapTools is designed for everyone — not just developers. Our clean, simple interface makes every tool easy to use, whether you&apos;re a student, writer, designer, marketer, or just someone who needs to get things done.</p>
    </div>
  );
}
