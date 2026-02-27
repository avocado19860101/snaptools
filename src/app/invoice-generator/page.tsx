'use client';
import { useState } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, Input, Select } from '@/components/ui';

const faqItems = [
  { q: 'Is my invoice data stored or sent anywhere?', a: 'No. Everything runs in your browser. No data is uploaded or stored on any server.' },
  { q: 'How do I download the invoice as PDF?', a: 'Click "Download PDF" which uses your browser\'s built-in print dialog. Select "Save as PDF" as the destination.' },
  { q: 'Can I add my company logo?', a: 'Yes! Upload a logo image and it will appear at the top of the invoice. The image stays in your browser.' },
  { q: 'What currencies are supported?', a: 'We support USD, EUR, GBP, JPY, KRW, CAD, AUD, CHF, CNY, INR, and more.' },
  { q: 'Can I customize the tax rate?', a: 'Yes. You can set any tax rate percentage and also apply a discount amount to the subtotal.' },
];

const currencies: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', KRW: '₩', CAD: 'C$', AUD: 'A$', CHF: 'CHF', CNY: '¥', INR: '₹',
};

interface LineItem { desc: string; qty: number; price: number; }

export default function InvoiceGenerator() {
  const [company, setCompany] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [client, setClient] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<LineItem[]>([{ desc: '', qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState(false);

  const sym = currencies[currency] || currency;
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = subtotal * taxRate / 100;
  const total = subtotal + tax - discount;

  const updateItem = (i: number, field: keyof LineItem, val: string | number) => {
    const next = [...items];
    (next[i] as unknown as Record<string, string | number>)[field] = val;
    setItems(next);
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setLogo(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const printPdf = () => {
    setPreview(true);
    setTimeout(() => { window.print(); }, 300);
  };

  const fmt = (n: number) => n.toFixed(2);

  return (
    <ToolLayout
      title="Invoice Generator"
      description={[
        'Create professional invoices in seconds. Add line items, taxes, discounts, and download as PDF — all for free.',
        'Everything runs in your browser. Your invoice data is never sent to any server, ensuring complete privacy.',
      ]}
      howTo={{
        steps: [
          'Enter your company name, client name, invoice number, and dates.',
          'Add line items with description, quantity, and unit price.',
          'Set tax rate and discount if needed. Choose your currency.',
          'Click "Preview & Download PDF" to see the invoice and save it.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Invoice Generator', url: 'https://snaptools.dev/invoice-generator',
        description: 'Free online invoice generator. Create and download professional invoices as PDF.',
        applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <style>{`@media print { body * { visibility: hidden !important; } #invoice-print, #invoice-print * { visibility: visible !important; } #invoice-print { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>

      {/* Form */}
      <Card padding="lg" className="print:hidden">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <Input label="Company Name" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your Company" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo (optional)</label>
            <input type="file" accept="image/*" onChange={handleLogo} className="text-sm" />
          </div>
          <Input label="Client Name" value={client} onChange={e => setClient(e.target.value)} placeholder="Client / Bill To" />
          <Input label="Invoice Number" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)} options={Object.keys(currencies).map(c => ({ value: c, label: `${c} (${currencies[c]})` }))} />
        </div>

        <h3 className="font-semibold text-gray-800 mb-3">Line Items</h3>
        <div className="space-y-2 mb-4">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1"><Input label={i === 0 ? 'Description' : undefined} value={it.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Item description" /></div>
              <div className="w-20"><Input label={i === 0 ? 'Qty' : undefined} type="number" value={it.qty} onChange={e => updateItem(i, 'qty', +e.target.value)} /></div>
              <div className="w-28"><Input label={i === 0 ? 'Unit Price' : undefined} type="number" value={it.price} onChange={e => updateItem(i, 'price', +e.target.value)} /></div>
              <div className="w-24 pb-1 text-sm text-gray-600 font-medium">{sym}{fmt(it.qty * it.price)}</div>
              {items.length > 1 && <Button variant="ghost" size="sm" onClick={() => setItems(items.filter((_, j) => j !== i))}>✕</Button>}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setItems([...items, { desc: '', qty: 1, price: 0 }])}>+ Add Item</Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <Input label="Tax Rate (%)" type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} />
          <Input label="Discount" type="number" value={discount} onChange={e => setDiscount(+e.target.value)} />
          <div className="flex items-end pb-1">
            <div className="text-lg font-bold text-gray-900">Total: {sym}{fmt(total)}</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Terms</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-24 rounded-xl border border-white/30 bg-white/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" placeholder="Payment terms, notes..." />
        </div>

        <div className="mt-5 flex gap-3">
          <Button size="lg" onClick={() => setPreview(!preview)}>{preview ? 'Hide Preview' : 'Preview Invoice'}</Button>
          <Button variant="success" size="lg" onClick={printPdf}>Download PDF</Button>
        </div>
      </Card>

      {/* Preview */}
      {preview && (
        <Card padding="lg" className="mt-6" id="invoice-print">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                {logo && <img src={logo} alt="Logo" className="h-14 mb-2 object-contain" />}
                <div className="text-2xl font-bold text-gray-900">{company || 'Your Company'}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-400">INVOICE</div>
                <div className="text-sm text-gray-600 mt-1">{invoiceNo}</div>
                <div className="text-sm text-gray-500">Date: {date}</div>
                {dueDate && <div className="text-sm text-gray-500">Due: {dueDate}</div>}
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-500">Bill To</div>
              <div className="font-semibold text-gray-900">{client || 'Client Name'}</div>
            </div>
            <table className="w-full mb-6 text-sm">
              <thead><tr className="border-b-2 border-gray-200">
                <th className="text-left py-2">Description</th><th className="text-right py-2 w-16">Qty</th><th className="text-right py-2 w-24">Price</th><th className="text-right py-2 w-24">Amount</th>
              </tr></thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2">{it.desc || '—'}</td><td className="text-right py-2">{it.qty}</td><td className="text-right py-2">{sym}{fmt(it.price)}</td><td className="text-right py-2">{sym}{fmt(it.qty * it.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-56 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{sym}{fmt(subtotal)}</span></div>
                {taxRate > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax ({taxRate}%)</span><span>{sym}{fmt(tax)}</span></div>}
                {discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-{sym}{fmt(discount)}</span></div>}
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2"><span>Total</span><span>{sym}{fmt(total)}</span></div>
              </div>
            </div>
            {notes && <div className="mt-8 text-sm text-gray-500"><div className="font-medium text-gray-700 mb-1">Notes</div>{notes}</div>}
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
