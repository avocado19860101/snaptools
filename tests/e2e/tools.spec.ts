import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Create a tiny test image (1x1 red pixel PNG)
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.png');

test.beforeAll(async () => {
  // Minimal 1x1 red PNG
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(TEST_IMAGE_PATH, pngBuffer);
});

test.afterAll(async () => {
  if (fs.existsSync(TEST_IMAGE_PATH)) fs.unlinkSync(TEST_IMAGE_PATH);
});

test.describe('Word Counter', () => {
  test('counts words, characters, sentences correctly', async ({ page }) => {
    await page.goto('/word-counter');
    const textarea = page.locator('textarea');
    await textarea.fill('Hello world. This is a test!');

    // Check stats display
    const statsText = await page.locator('.grid.grid-cols-2').textContent();
    expect(statsText).toContain('6'); // words
    expect(statsText).toContain('28'); // characters
    expect(statsText).toContain('2'); // sentences (. and !)
  });
});

test.describe('Text Case Converter', () => {
  test('shows all conversions', async ({ page }) => {
    await page.goto('/text-case-converter');
    await page.locator('textarea').fill('hello world');

    const results = page.locator('button.w-full');
    await expect(results.first()).toBeVisible();

    const allText = await page.locator('.space-y-3').first().textContent();
    expect(allText).toContain('HELLO WORLD');
    expect(allText).toContain('hello world');
    expect(allText).toContain('Hello World');
    expect(allText).toContain('helloWorld');
    expect(allText).toContain('HelloWorld');
    expect(allText).toContain('hello_world');
    expect(allText).toContain('hello-world');
    expect(allText).toContain('HELLO_WORLD');
  });
});

test.describe('Password Generator', () => {
  test('generates password and shows strength', async ({ page }) => {
    await page.goto('/password-generator');
    await page.click('button:text("Generate Password")');

    const passwordBox = page.locator('.font-mono.text-lg');
    await expect(passwordBox).toBeVisible();
    const pw = await passwordBox.textContent();
    expect(pw!.length).toBeGreaterThanOrEqual(6);

    // Strength indicator should be visible
    await expect(page.locator('text=Strength:')).toBeVisible();
  });
});

test.describe('Color Picker', () => {
  test('displays HEX, RGB, HSL values', async ({ page }) => {
    await page.goto('/color-picker');

    // Default color #3B82F6
    const allText = await page.locator('.flex-1.space-y-3').textContent();
    expect(allText).toContain('HEX');
    expect(allText).toContain('RGB');
    expect(allText).toContain('HSL');
    expect(allText).toContain('#3B82F6');
  });
});

test.describe('QR Code Generator', () => {
  test('generates QR code from text', async ({ page }) => {
    await page.goto('/qr-code-generator');
    await page.locator('textarea').fill('https://snaptools.dev');
    await page.click('button:text("Generate QR Code")');

    // Canvas should become visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Download button should appear
    await expect(page.locator('button:text("Download QR Code")')).toBeVisible();
  });
});

test.describe('Image Resizer', () => {
  test('uploads image and shows resize controls', async ({ page }) => {
    await page.goto('/image-resizer');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);

    // Should show original dimensions
    await expect(page.locator('text=Original:')).toBeVisible();

    // Width and height inputs should be visible
    await expect(page.locator('input[type="number"]').first()).toBeVisible();

    // Resize button should be visible
    await expect(page.locator('button:text("Resize Image")')).toBeVisible();
  });
});

test.describe('Image Compressor', () => {
  test('uploads image and shows compress controls', async ({ page }) => {
    await page.goto('/image-compressor');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);

    // Should show original size
    await expect(page.locator('text=Original size:')).toBeVisible();

    // Quality slider and compress button
    await expect(page.locator('input[type="range"]')).toBeVisible();
    await expect(page.locator('button:text("Compress Image")')).toBeVisible();
  });
});
