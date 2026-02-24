import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Color Picker & Converter - HEX RGB HSL', description: 'Pick colors and convert between HEX, RGB, and HSL formats instantly. Free online color tool for designers.', openGraph: { title: 'Free Color Picker & Converter', description: 'Pick and convert colors between HEX, RGB, and HSL.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
