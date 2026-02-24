import { describe, it, expect } from 'vitest';

// Extracted from word-counter/page.tsx
function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function countChars(text: string) {
  return text.length;
}

function countCharsNoSpace(text: string) {
  return text.replace(/\s/g, '').length;
}

function countSentences(text: string) {
  return text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim().length > 0 ? 1 : 0) : 0;
}

function countParagraphs(text: string) {
  if (!text.trim()) return 0;
  const p = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  return p || (text.trim() ? 1 : 0);
}

describe('Word Counter', () => {
  it('counts empty string', () => {
    expect(countWords('')).toBe(0);
    expect(countChars('')).toBe(0);
    expect(countSentences('')).toBe(0);
    expect(countParagraphs('')).toBe(0);
  });

  it('counts single word', () => {
    expect(countWords('hello')).toBe(1);
  });

  it('counts multiple words', () => {
    expect(countWords('hello world foo bar')).toBe(4);
  });

  it('handles extra whitespace', () => {
    expect(countWords('  hello   world  ')).toBe(2);
  });

  it('counts characters with and without spaces', () => {
    expect(countChars('hello world')).toBe(11);
    expect(countCharsNoSpace('hello world')).toBe(10);
  });

  it('counts sentences by punctuation', () => {
    expect(countSentences('Hello. World!')).toBe(2);
    expect(countSentences('One? Two. Three!')).toBe(3);
  });

  it('counts sentence without punctuation as 1', () => {
    expect(countSentences('Hello world')).toBe(1);
  });

  it('counts paragraphs', () => {
    expect(countParagraphs('Para one\n\nPara two')).toBe(2);
    expect(countParagraphs('Single paragraph')).toBe(1);
    expect(countParagraphs('One\n\nTwo\n\nThree')).toBe(3);
  });
});
