'use client';
import { useState } from 'react';

interface FAQItem { q: string; a: string; }

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg">
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full text-left px-5 py-4 flex justify-between items-center">
              <span className="font-medium text-gray-900">{item.q}</span>
              <span className="text-gray-400 text-xl">{openIdx === i ? '−' : '+'}</span>
            </button>
            {openIdx === i && <div className="px-5 pb-4 text-gray-600">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
