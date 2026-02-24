import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free QR Code Generator - Create QR Codes Online', description: 'Generate QR codes for any URL or text instantly. Free, no sign-up required. Download as PNG.', openGraph: { title: 'Free QR Code Generator', description: 'Create QR codes instantly for any text or URL.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
