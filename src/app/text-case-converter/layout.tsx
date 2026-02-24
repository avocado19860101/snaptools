import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Text Case Converter - UPPERCASE lowercase Title Case', description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and more. Free online tool.', openGraph: { title: 'Free Text Case Converter', description: 'Convert text between different cases instantly.' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
