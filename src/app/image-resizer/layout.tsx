import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Image Resizer - Resize Images Online', description: 'Resize any image to exact dimensions instantly. Free, private, no upload — all processing happens in your browser.', openGraph: { title: 'Free Image Resizer Online', description: 'Resize images to any dimension instantly in your browser.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
