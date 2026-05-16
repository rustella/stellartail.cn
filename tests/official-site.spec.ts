import { expect, test } from '@playwright/test';

test('renders Chinese content with explicit language', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('出发前');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});

test('renders English content with explicit language', async ({ page }) => {
  await page.goto('/?lang=en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare gear');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});

test('persists language switch preference', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await page.getByRole('button', { name: /Switch to English/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  const stored = await page.evaluate(() => window.localStorage.getItem('stellartrail.official.lang'));
  expect(stored).toBe('en-US');
});

test('does not make backend API requests', async ({ page }) => {
  const blocked: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith('/api/')) blocked.push(request.url());
  });
  await page.goto('/?lang=en-US');
  await page.waitForLoadState('networkidle');
  expect(blocked).toEqual([]);
});

test('mobile viewport has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=zh-CN');
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
});

test('desktop page includes all core sections', async ({ page }) => {
  await page.goto('/?lang=en-US');
  for (const id of ['product', 'gear', 'skills', 'screenshots', 'entry']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});


test('reduced motion preference keeps content visible and minimizes animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/?lang=en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare gear');
  const animationDurationMs = await page.locator('.float-soft').first().evaluate((element) => {
    const value = window.getComputedStyle(element).animationDuration;
    return value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
  });
  expect(animationDurationMs).toBeLessThanOrEqual(0.002);
  await context.close();
});
