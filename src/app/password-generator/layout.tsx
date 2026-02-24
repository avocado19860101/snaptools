import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Password Generator - Create Secure Passwords', description: 'Generate strong, random passwords with customizable options. Uses cryptographic randomness. Free and private.', openGraph: { title: 'Free Secure Password Generator', description: 'Create strong random passwords instantly.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
