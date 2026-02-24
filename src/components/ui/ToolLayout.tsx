import { ReactNode } from 'react';
import PageHeader from './PageHeader';
import AdPlaceholder from '@/components/AdPlaceholder';

interface ToolLayoutProps {
  title: string;
  description: string | string[];
  children: ReactNode;
  howTo?: { title?: string; steps: string[] };
  faq?: ReactNode;
  jsonLd?: object;
}

export default function ToolLayout({ title, description, children, howTo, faq, jsonLd }: ToolLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageHeader title={title} description={description} />

      <AdPlaceholder slot="above-tool" />

      <div className="mb-8">
        {children}
      </div>

      <AdPlaceholder slot="between-content" />

      {howTo && (
        <section className="mb-8 glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{howTo.title || `How to Use the ${title}`}</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            {howTo.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {faq}

      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </div>
  );
}
