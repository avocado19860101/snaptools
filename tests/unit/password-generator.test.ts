import { describe, it, expect } from 'vitest';

// Extracted from password-generator/page.tsx
function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  let chars = '';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) return '';
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join('');
}

function strength(length: number, lower: boolean, upper: boolean, numbers: boolean, symbols: boolean) {
  let pool = 0;
  if (lower) pool += 26;
  if (upper) pool += 26;
  if (numbers) pool += 10;
  if (symbols) pool += 26;
  const entropy = length * Math.log2(pool || 1);
  if (entropy >= 80) return 'Very Strong';
  if (entropy >= 60) return 'Strong';
  if (entropy >= 40) return 'Moderate';
  return 'Weak';
}

describe('Password Generator', () => {
  it('generates correct length', () => {
    const pw = generatePassword(20, true, true, true, true);
    expect(pw.length).toBe(20);
  });

  it('lowercase only contains lowercase', () => {
    const pw = generatePassword(50, false, true, false, false);
    expect(pw).toMatch(/^[a-z]+$/);
  });

  it('uppercase only contains uppercase', () => {
    const pw = generatePassword(50, true, false, false, false);
    expect(pw).toMatch(/^[A-Z]+$/);
  });

  it('numbers only contains digits', () => {
    const pw = generatePassword(50, false, false, true, false);
    expect(pw).toMatch(/^[0-9]+$/);
  });

  it('returns empty when no options selected', () => {
    expect(generatePassword(10, false, false, false, false)).toBe('');
  });
});

describe('Password Strength', () => {
  it('short lowercase is weak', () => {
    expect(strength(6, true, false, false, false)).toBe('Weak');
  });

  it('16 chars all options is very strong', () => {
    expect(strength(16, true, true, true, true)).toBe('Very Strong');
  });

  it('12 chars lower+upper is strong', () => {
    expect(strength(12, true, true, false, false)).toBe('Strong');
  });
});
