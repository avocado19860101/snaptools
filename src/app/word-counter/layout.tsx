import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Word & Character Counter Online', description: 'Count words, characters, sentences, and paragraphs instantly. Free online word counter with reading time estimation.', openGraph: { title: 'Free Word Counter Online', description: 'Count words, characters, and sentences instantly.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
