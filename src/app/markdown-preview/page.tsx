'use client';
import { useState, useMemo } from 'react';
import FAQ from '@/components/FAQ';
import { ToolLayout, Card, Button, CopyButton } from '@/components/ui';

const faqItems = [
  { q: 'What Markdown features are supported?', a: 'Headings, bold, italic, links, images, code blocks, inline code, lists (ordered and unordered), tables, blockquotes, and horizontal rules.' },
  { q: 'Is my text sent to a server?', a: 'No. All rendering happens in your browser using lightweight regex-based parsing. Nothing leaves your device.' },
  { q: 'Can I export the result?', a: 'Yes! You can copy the rendered HTML or download it as a standalone HTML file.' },
  { q: 'Does it support GitHub Flavored Markdown?', a: 'It supports most common GFM features including tables, fenced code blocks, and strikethrough.' },
  { q: 'Why not use an external library?', a: 'We use a lightweight built-in parser to keep the tool fast and dependency-free, supporting all commonly used Markdown syntax.' },
];

const sampleMarkdown = `# Welcome to Markdown Preview

## Features

- **Bold text** and *italic text*
- [Links](https://snaptools.dev) and ![images](https://via.placeholder.com/100)
- ~~Strikethrough~~ text

### Code

Inline \`code\` and code blocks:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature | Supported |
|---------|-----------|
| Headings | ✅ |
| Lists | ✅ |
| Tables | ✅ |

> This is a blockquote.

---

Enjoy writing Markdown! 🚀
`;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="md-code-block${lang ? ` lang-${lang}` : ''}"><code>${escapeHtml(code.trimEnd())}</code></pre>`
  );

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[\s:-]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, _sep, body) => {
    const ths = header.split('|').filter(Boolean).map((c: string) => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const tds = row.split('|').filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<table class="md-table"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // HR
  html = html.replace(/^---+$/gm, '<hr/>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px"/>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#6366f1;text-decoration:underline">$1</a>');

  // Bold, italic, strikethrough, inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Unordered lists
  html = html.replace(/(^[\t ]*- .+\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^[\t ]*- /, '')}</li>`).join('');
    return `<ul style="list-style:disc;padding-left:1.5em;margin:0.5em 0">${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/(^\d+\. .+\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
    return `<ol style="list-style:decimal;padding-left:1.5em;margin:0.5em 0">${items}</ol>`;
  });

  // Paragraphs
  html = html.replace(/^(?!<[a-z/])((?!^$).+)$/gm, '<p>$1</p>');
  html = html.replace(/<\/p>\n<p>/g, '</p><p>');

  return html;
}

const previewStyles = `
.md-preview h1{font-size:2em;font-weight:700;margin:0.5em 0 0.3em}
.md-preview h2{font-size:1.5em;font-weight:700;margin:0.5em 0 0.3em}
.md-preview h3{font-size:1.25em;font-weight:600;margin:0.4em 0 0.2em}
.md-preview p{margin:0.4em 0;line-height:1.7}
.md-preview hr{border:none;border-top:1px solid #ddd;margin:1em 0}
.md-preview .md-blockquote{border-left:4px solid #6366f1;padding:0.3em 1em;margin:0.5em 0;color:#555;background:#f5f3ff;border-radius:4px}
.md-preview .md-code-block{background:#1e1e2e;color:#cdd6f4;padding:1em;border-radius:8px;overflow-x:auto;margin:0.5em 0;font-size:0.9em}
.md-preview .md-inline-code{background:#f1f5f9;padding:0.15em 0.4em;border-radius:4px;font-size:0.9em;color:#e11d48}
.md-preview .md-table{width:100%;border-collapse:collapse;margin:0.5em 0}
.md-preview .md-table th,.md-preview .md-table td{border:1px solid #ddd;padding:0.5em 0.75em;text-align:left}
.md-preview .md-table th{background:#f8fafc;font-weight:600}
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(sampleMarkdown);
  const rendered = useMemo(() => parseMarkdown(md), [md]);

  const downloadHtml = () => {
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Markdown Export</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2em auto;padding:0 1em;color:#333}${previewStyles.replace(/\.md-preview /g, '')}</style></head><body>${rendered}</body></html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'markdown-export.html';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout
      title="Markdown Preview"
      description={[
        'Write Markdown and see it rendered in real-time. Perfect for README files, documentation, and notes.',
        'Our Markdown previewer uses a lightweight built-in parser — no external libraries. Supports headings, bold, italic, links, images, code blocks, tables, blockquotes, and more.',
      ]}
      howTo={{
        steps: [
          'Type or paste Markdown in the editor on the left.',
          'See the rendered preview update in real-time on the right.',
          'Use the "Copy HTML" button to copy the rendered HTML.',
          'Click "Download HTML" to save as a standalone HTML file.',
        ],
      }}
      faq={<FAQ items={faqItems} />}
      jsonLd={{
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Markdown Preview', url: 'https://snaptools.dev/markdown-preview',
        description: 'Free online Markdown previewer with real-time rendering.',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        mainEntity: { '@type': 'FAQPage', mainEntity: faqItems.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
      }}
    >
      <Card padding="lg">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Editor & Preview</h2>
          <div className="flex gap-2">
            <CopyButton text={rendered} label="Copy HTML" />
            <Button variant="ghost" size="sm" onClick={downloadHtml}>Download HTML</Button>
          </div>
        </div>
        <style>{previewStyles}</style>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={md}
            onChange={e => setMd(e.target.value)}
            className="w-full h-[500px] rounded-xl border border-white/30 bg-white/50 p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            placeholder="Type Markdown here..."
          />
          <div
            className="md-preview w-full h-[500px] rounded-xl border border-white/30 bg-white/50 p-4 overflow-y-auto prose-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>
      </Card>
    </ToolLayout>
  );
}
