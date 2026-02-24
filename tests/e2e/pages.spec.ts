import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/image-resizer',
  '/image-compressor',
  '/qr-code-generator',
  '/word-counter',
  '/password-generator',
  '/color-picker',
  '/text-case-converter',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
];

test.describe('All pages accessible', () => {
  for (const path of pages) {
    test(`${path} loads without error`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('SEO checks', () => {
  for (const path of pages) {
    test(`${path} has title and meta description`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(5);

      const desc = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
      expect(desc).toBeTruthy();
      expect(desc!.length).toBeGreaterThan(10);
    });

    test(`${path} has exactly one h1`, async ({ page }) => {
      await page.goto(path);
      const h1s = await page.$$('h1');
      expect(h1s.length).toBe(1);
    });
  }

  test('sitemap.xml is accessible', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBe(200);
  });

  test('robots.txt is accessible', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBe(200);
  });
});
