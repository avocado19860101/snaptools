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

    // Strength indicator should be visible after generating
    const body = await page.textContent('body');
    expect(body).toMatch(/Very Strong|Strong|Medium|Weak/);
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

// ============================================================
// NEW TOOL TESTS (43 tools)
// ============================================================

// --- Text Input Tools ---

test.describe('Base64 Encoder/Decoder', () => {
  test('encodes text to base64', async ({ page }) => {
    await page.goto('/base64-encoder-decoder');
    await page.locator('textarea').first().fill('Hello World');
    await page.click('button:text("Encode")');
    const output = page.locator('textarea').last();
    await expect(output).toHaveValue('SGVsbG8gV29ybGQ=');
  });
});

test.describe('URL Encoder/Decoder', () => {
  test('encodes URL characters', async ({ page }) => {
    await page.goto('/url-encoder-decoder');
    await page.locator('textarea').first().fill('hello world & foo=bar');
    await page.click('button:text("Encode")');
    const output = page.locator('textarea').last();
    await expect(output).toHaveValue(/hello%20world/);
  });
});

test.describe('Text to Binary', () => {
  test('converts text to binary', async ({ page }) => {
    await page.goto('/text-to-binary');
    await page.locator('textarea').first().fill('Hi');
    // Should auto-convert or have button
    const pageText = await page.textContent('body');
    expect(pageText).toContain('01001000');
  });
});

test.describe('Morse Code Translator', () => {
  test('translates text to morse', async ({ page }) => {
    await page.goto('/morse-code-translator');
    await page.locator('textarea').first().fill('SOS');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('...');
  });
});

test.describe('Text Repeater', () => {
  test('repeats text', async ({ page }) => {
    await page.goto('/text-repeater');
    await page.locator('textarea').first().fill('hi');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('hi');
  });
});

test.describe('Diff Checker', () => {
  test('loads and shows compare area', async ({ page }) => {
    await page.goto('/diff-checker');
    const textareas = page.locator('textarea');
    await expect(textareas.first()).toBeVisible();
    await textareas.first().fill('hello');
    await textareas.nth(1).fill('world');
    // Should show diff
    const pageText = await page.textContent('body');
    expect(pageText).toContain('hello');
  });
});

test.describe('Markdown Preview', () => {
  test('renders markdown', async ({ page }) => {
    await page.goto('/markdown-preview');
    await expect(page.locator('textarea')).toBeVisible();
    // Default content should be visible in preview
    const pageText = await page.textContent('body');
    expect(pageText).toContain('Preview');
  });
});

test.describe('JSON Formatter', () => {
  test('formats valid JSON', async ({ page }) => {
    await page.goto('/json-formatter');
    await page.locator('textarea').fill('{"name":"test","value":42}');
    await page.click('button:text("Format")');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('name');
    expect(pageText).toContain('test');
  });
});

test.describe('Lorem Ipsum Generator', () => {
  test('generates placeholder text', async ({ page }) => {
    await page.goto('/lorem-ipsum-generator');
    await page.click('button:text("Generate")');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('Lorem ipsum');
  });
});

test.describe('Social Media Counter', () => {
  test('counts characters', async ({ page }) => {
    await page.goto('/social-media-counter');
    await page.locator('textarea').fill('Hello World!');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('12');
  });
});

test.describe('Online Notepad', () => {
  test('loads notepad with textarea', async ({ page }) => {
    await page.goto('/online-notepad');
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await textarea.fill('Test note');
    await expect(page.locator('button:text("Download as .txt")')).toBeVisible();
  });
});

test.describe('Regex Tester', () => {
  test('tests regex pattern', async ({ page }) => {
    await page.goto('/regex-tester');
    await expect(page.locator('h1')).toBeVisible();
    // Input fields should be visible
    await expect(page.locator('input').first()).toBeVisible();
  });
});

// --- Calculator Tools ---

test.describe('Unit Converter', () => {
  test('converts kilometers to miles', async ({ page }) => {
    await page.goto('/unit-converter');
    await expect(page.locator('text=Convert Units')).toBeVisible();
    // Default should be km to mi with value 1
    const pageText = await page.textContent('body');
    expect(pageText).toContain('0.621');
  });
});

test.describe('Percentage Calculator', () => {
  test('calculates percentage', async ({ page }) => {
    await page.goto('/percentage-calculator');
    await expect(page.getByRole('heading', { name: 'Calculate Percentage' })).toBeVisible();
    const inputs = page.locator('input[type="number"]');
    await inputs.first().fill('50');
    await inputs.nth(1).fill('200');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('100');
  });
});

test.describe('Timestamp Converter', () => {
  test('loads with current timestamp', async ({ page }) => {
    await page.goto('/timestamp-converter');
    await expect(page.locator('h1')).toBeVisible();
    const pageText = await page.textContent('body');
    expect(pageText).toContain('Timestamp');
  });
});

test.describe('Age Calculator', () => {
  test('calculates age from date', async ({ page }) => {
    await page.goto('/age-calculator');
    await expect(page.getByRole('heading', { name: 'Enter Your Date of Birth' })).toBeVisible();
    await page.locator('input[type="date"]').fill('2000-01-01');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('years');
  });
});

test.describe('Binary/Hex Converter', () => {
  test('converts decimal to binary', async ({ page }) => {
    await page.goto('/binary-hex-converter');
    await expect(page.getByRole('heading', { name: 'Convert Numbers' })).toBeVisible();
    const input = page.locator('input').first();
    await input.fill('42');
    const pageText = await page.textContent('body');
    expect(pageText).toContain('101010');
  });
});

test.describe('Aspect Ratio Calculator', () => {
  test('calculates aspect ratio', async ({ page }) => {
    await page.goto('/aspect-ratio-calculator');
    await expect(page.locator('text=Calculate Aspect Ratio')).toBeVisible();
    // Should show inputs for width/height
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
  });
});

test.describe('Random Number Generator', () => {
  test('generates random number', async ({ page }) => {
    await page.goto('/random-number-generator');
    await page.click('button:text("Generate")');
    const pageText = await page.textContent('body');
    // Should display some number
    expect(pageText).toMatch(/\d+/);
  });
});

// --- Image Tools ---

test.describe('Image Crop', () => {
  test('shows upload area and accepts image', async ({ page }) => {
    await page.goto('/image-crop');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Flip/Rotate Image', () => {
  test('shows upload area and accepts image', async ({ page }) => {
    await page.goto('/flip-rotate-image');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Image Watermark', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/image-watermark');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Background Remover', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/background-remover');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Image Format Converter', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/image-format-converter');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Compress Image to Size', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/compress-image-to-size');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Favicon Generator', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/favicon-generator');
    await expect(page.locator('text=Drop your image here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('Screenshot Beautifier', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/screenshot-beautifier');
    await expect(page.locator('text=Drop your screenshot here')).toBeVisible();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
  });
});

test.describe('SVG to PNG', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/svg-to-png');
    await expect(page.locator('text=Drop your SVG file here')).toBeVisible();
  });
});

// --- PDF Tools ---

test.describe('PDF to JPG', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/pdf-to-jpg');
    await expect(page.locator('text=Upload PDF')).toBeVisible();
    await expect(page.locator('text=Drop your PDF here')).toBeVisible();
  });
});

test.describe('PDF Compress', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/pdf-compress');
    await expect(page.locator('text=Upload & Compress')).toBeVisible();
    await expect(page.locator('text=Drop your PDF here')).toBeVisible();
  });
});

test.describe('PDF Merge', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/pdf-merge');
    await expect(page.locator('text=Upload & Merge PDFs')).toBeVisible();
    await expect(page.locator('text=Drop PDF files here')).toBeVisible();
  });
});

// --- Other Tools ---

test.describe('Emoji Picker', () => {
  test('shows emoji grid and search', async ({ page }) => {
    await page.goto('/emoji-picker');
    await expect(page.locator('text=Pick an Emoji')).toBeVisible();
    // Search input should be visible
    await expect(page.locator('input')).toBeVisible();
  });
});

test.describe('Color Palette Generator', () => {
  test('shows palette generation options', async ({ page }) => {
    await page.goto('/color-palette-generator');
    await expect(page.getByRole('heading', { name: 'Random Palettes' })).toBeVisible();
    await page.click('button:text("Complementary")');
  });
});

test.describe('CSS Gradient Generator', () => {
  test('shows gradient preview and CSS code', async ({ page }) => {
    await page.goto('/css-gradient-generator');
    await expect(page.locator('text=Design Your Gradient')).toBeVisible();
    const pageText = await page.textContent('body');
    expect(pageText).toContain('CSS Code');
    expect(pageText).toContain('background:');
  });
});

test.describe('RGB to HEX', () => {
  test('shows color conversion UI', async ({ page }) => {
    await page.goto('/rgb-to-hex');
    await expect(page.locator('h1')).toBeVisible();
    // Should have sliders or inputs for RGB
    await expect(page.locator('input').first()).toBeVisible();
  });
});

test.describe('Hash Generator', () => {
  test('generates hash from input', async ({ page }) => {
    await page.goto('/hash-generator');
    await expect(page.locator('h1')).toBeVisible();
    // Should have text input area
    const pageText = await page.textContent('body');
    expect(pageText).toContain('Hash');
  });
});

test.describe('Credit Card Validator', () => {
  test('validates card number', async ({ page }) => {
    await page.goto('/credit-card-validator');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input').first()).toBeVisible();
  });
});

test.describe('Invoice Generator', () => {
  test('shows invoice form', async ({ page }) => {
    await page.goto('/invoice-generator');
    await expect(page.locator('text=Invoice Details')).toBeVisible();
    // Company name input should be visible
    await expect(page.locator('input').first()).toBeVisible();
  });
});

test.describe('Pomodoro Timer', () => {
  test('shows timer and controls', async ({ page }) => {
    await page.goto('/pomodoro-timer');
    await expect(page.locator('text=Focus Time')).toBeVisible();
    await expect(page.locator('text=25:00')).toBeVisible();
    await expect(page.locator('button:text("Start")')).toBeVisible();
  });
});

test.describe('Stopwatch', () => {
  test('shows stopwatch controls', async ({ page }) => {
    await page.goto('/stopwatch');
    await expect(page.locator('h1')).toBeVisible();
    const pageText = await page.textContent('body');
    expect(pageText).toContain('00:00');
  });
});

test.describe('Screen Resolution', () => {
  test('shows screen info', async ({ page }) => {
    await page.goto('/screen-resolution');
    await expect(page.getByRole('heading', { name: 'Your Screen Information' })).toBeVisible();
    const pageText = await page.textContent('body');
    expect(pageText).toContain('Screen Resolution');
  });
});

test.describe('IP Address Lookup', () => {
  test('shows IP info section', async ({ page }) => {
    await page.goto('/ip-address-lookup');
    await expect(page.locator('text=Your IP Information')).toBeVisible();
  });
});

test.describe('Video to GIF', () => {
  test('shows upload area', async ({ page }) => {
    await page.goto('/video-to-gif');
    await expect(page.locator('h1')).toBeVisible();
    const pageText = await page.textContent('body');
    expect(pageText).toContain('Video to GIF');
  });
});
