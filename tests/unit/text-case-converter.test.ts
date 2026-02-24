import { describe, it, expect } from 'vitest';

// Extracted from text-case-converter/page.tsx
const toTitle = (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
const toSentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const toWords = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim().split(/\s+/);
const toCamel = (s: string) => { const w = toWords(s); return w.map((x, i) => i === 0 ? x.toLowerCase() : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(''); };
const toPascal = (s: string) => toWords(s).map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('');
const toSnake = (s: string) => toWords(s).join('_').toLowerCase();
const toKebab = (s: string) => toWords(s).join('-').toLowerCase();
const toConstant = (s: string) => toWords(s).join('_').toUpperCase();

describe('Text Case Converter', () => {
  const input = 'hello world';

  it('UPPERCASE', () => expect(input.toUpperCase()).toBe('HELLO WORLD'));
  it('lowercase', () => expect('HELLO WORLD'.toLowerCase()).toBe('hello world'));
  it('Title Case', () => expect(toTitle(input)).toBe('Hello World'));
  it('Sentence case', () => expect(toSentence(input)).toBe('Hello world'));
  it('camelCase', () => expect(toCamel(input)).toBe('helloWorld'));
  it('PascalCase', () => expect(toPascal(input)).toBe('HelloWorld'));
  it('snake_case', () => expect(toSnake(input)).toBe('hello_world'));
  it('kebab-case', () => expect(toKebab(input)).toBe('hello-world'));
  it('CONSTANT_CASE', () => expect(toConstant(input)).toBe('HELLO_WORLD'));

  describe('from camelCase input', () => {
    it('toSnake from camelCase', () => expect(toSnake('helloWorld')).toBe('hello_world'));
    it('toKebab from camelCase', () => expect(toKebab('helloWorld')).toBe('hello-world'));
    it('toPascal from camelCase', () => expect(toPascal('helloWorld')).toBe('HelloWorld'));
  });

  describe('from snake_case input', () => {
    it('toCamel from snake_case', () => expect(toCamel('hello_world')).toBe('helloWorld'));
    it('toKebab from snake_case', () => expect(toKebab('hello_world')).toBe('hello-world'));
  });

  describe('edge cases', () => {
    it('single word', () => expect(toCamel('hello')).toBe('hello'));
    it('three words', () => expect(toCamel('hello beautiful world')).toBe('helloBeautifulWorld'));
  });
});
