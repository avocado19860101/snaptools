import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Image Compressor - Compress Images Online', description: 'Compress and reduce image file size without losing quality. Free, private, browser-based compression.', openGraph: { title: 'Free Image Compressor Online', description: 'Reduce image file size instantly in your browser.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
