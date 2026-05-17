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

test('homepage top bar exposes docs entry', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const zhDocsLink = page.locator('.nav').getByRole('link', { name: 'Docs', exact: true });
  await expect(zhDocsLink).toBeVisible();
  await expect(zhDocsLink).toHaveAttribute('href', '/docs/?lang=zh-CN');

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enDocsLink = page.locator('.nav').getByRole('link', { name: 'Docs', exact: true });
  await expect(enDocsLink).toBeVisible();
  await expect(enDocsLink).toHaveAttribute('href', '/docs/?lang=en-US');
});



test('right floating breadcrumb reveals jump links on hover', async ({ page }, testInfo) => {
  await page.goto('/?lang=zh-CN');
  const floatingNav = page.getByRole('navigation', { name: '页面快捷跳转' });
  if (testInfo.project.name.includes('mobile')) {
    await expect(floatingNav).toBeHidden();
    return;
  }

  await expect(floatingNav).toBeVisible();
  const panel = floatingNav.locator('.floating-breadcrumb__panel');
  await expect(panel).toBeHidden();

  await floatingNav.getByRole('button', { name: '展开页面快捷跳转' }).hover();
  await expect(panel).toBeVisible();
  for (const item of ['首页', '产品', '装备', '技能', '截图', '入口', 'Docs']) {
    await expect(floatingNav.getByRole('link', { name: item, exact: true })).toBeVisible();
  }
  await expect(floatingNav.getByRole('link', { name: 'Docs', exact: true })).toHaveAttribute('href', '/docs/?lang=zh-CN');

  await floatingNav.getByRole('link', { name: '入口', exact: true }).click();
  await expect(page).toHaveURL(/#entry$/);

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enFloatingNav = page.getByRole('navigation', { name: 'Page quick jumps' });
  await enFloatingNav.getByRole('button', { name: 'Expand page quick jumps' }).hover();
  await expect(enFloatingNav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(enFloatingNav.getByRole('link', { name: 'Docs', exact: true })).toHaveAttribute('href', '/docs/?lang=en-US');
});

test('homepage communicates Web Android and mini program support', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const zhPlatforms = page.getByRole('list', { name: '支持平台' });
  await expect(zhPlatforms.getByText('Web 端', { exact: true })).toBeVisible();
  await expect(zhPlatforms.getByText('Android 端', { exact: true })).toBeVisible();
  await expect(zhPlatforms.getByText('微信小程序端', { exact: true })).toBeVisible();
  await expect(page.locator('.metric').filter({ hasText: '支持平台' }).locator('strong')).toHaveText('03');
  await expect(page.locator('#entry')).toContainText('Web、Android、微信小程序都可使用');
  await expect(page.locator('#entry')).toContainText('Android 安装');

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enPlatforms = page.getByRole('list', { name: 'Supported platforms' });
  await expect(enPlatforms.getByText('Web app', { exact: true })).toBeVisible();
  await expect(enPlatforms.getByText('Android app', { exact: true })).toBeVisible();
  await expect(enPlatforms.getByText('WeChat Mini Program', { exact: true })).toBeVisible();
  await expect(page.locator('#entry')).toContainText('Use StellarTrail on Web, Android, and WeChat Mini Program');
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

test('homepage copy stays user-facing and separates screenshot platforms', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const zhBodyText = await page.locator('body').innerText();
  for (const forbidden of ['官网不依赖后端', '静态方式交付', '部署简单', '后续易维护', '白天模式', '轻量可信', '官网只承诺当前可展示能力', '中英双语', '根据系统语言默认展示', '从当前产品页面', '挑选代表功能', '代表功能', '代表内容', '给你的prompt', 'prompt', '开发文档', '后端接口', 'API Reference']) {
    expect(zhBodyText).not.toContain(forbidden);
  }

  const screenshotGroups = page.locator('.screenshot-group');
  await expect(screenshotGroups).toHaveCount(2);
  await expect(screenshotGroups.nth(0).getByRole('heading', { name: '微信小程序端', exact: true })).toBeVisible();
  await expect(screenshotGroups.nth(0).locator('img')).toHaveCount(2);
  await expect(screenshotGroups.nth(1).getByRole('heading', { name: 'Web 端', exact: true })).toBeVisible();
  await expect(screenshotGroups.nth(1).locator('img')).toHaveCount(2);
  const imageSources = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src') ?? '').join(' '));
  for (const expected of ['wechat-gear-management-a1fc941-zh.png', 'wechat-knot-skills-a1fc941-zh.png', 'web-gear-management-a1fc941-zh.png', 'web-gear-form-a1fc941-zh.png']) {
    expect(imageSources).toContain(expected);
  }
  for (const oldMockAsset of ['wechat-gear-management-zh.png', 'wechat-knot-skills-zh.png', 'web-gear-management-zh.png', 'web-gear-form-zh.png', 'wechat-gear-light-zh.png', 'wechat-knots-light-zh.png', 'web-gear-light-zh.png', 'web-skills-light-zh.png']) {
    expect(imageSources).not.toContain(oldMockAsset);
  }

  await page.goto('/?lang=en-US');
  const enBodyText = await page.locator('body').innerText();
  for (const forbidden of ['day mode', 'day-mode', 'official site is fully static', 'asset names', 'final runtime', 'lightweight and honest', 'bilingual by default', 'system language', 'representative product views', 'current pages', 'highlighted skill', 'prompt', 'api reference', 'backend api']) {
    expect(enBodyText.toLowerCase()).not.toContain(forbidden);
  }
  const imageAlts = await page.locator('img[alt]').evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? '').join(' '));
  expect(imageAlts.toLowerCase()).not.toContain('day mode');
  expect(imageAlts.toLowerCase()).not.toContain('day-mode');
});


test('renders docs API reference page without backend requests', async ({ page }) => {
  const backendRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith('/api/')) backendRequests.push(request.url());
  });

  await page.goto('/docs/?lang=zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('开发文档');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByText('GET /healthz')).toBeVisible();
  await expect(page.getByText('GET /api/meta')).toBeVisible();
  await expect(page.getByText('database_kind')).toBeVisible();
  const bodyText = await page.locator('body').innerText();
  const forbiddenDocsOrigin = process.env.DOCS_PUBLIC_ORIGIN ?? '';
  if (forbiddenDocsOrigin) expect(bodyText).not.toContain(forbiddenDocsOrigin);
  expect(backendRequests).toEqual([]);
});

test('renders English docs API reference page', async ({ page }) => {
  await page.goto('/docs/?lang=en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('API Reference');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.getByText('GET /healthz')).toBeVisible();
  await expect(page.getByText('GET /api/meta')).toBeVisible();
});


test('brand icon metadata uses optimized product icon assets', async ({ page, request }) => {
  await page.goto('/?lang=zh-CN');

  const brandImageSrc = await page.locator('.nav__brand img').getAttribute('src');
  expect(brandImageSrc).toContain('/assets/brand/logo.svg');

  const iconLinks = await page
    .locator('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .evaluateAll((links) => links.map((link) => `${link.getAttribute('rel')}:${link.getAttribute('href')}`));
  expect(iconLinks.join(' ')).toContain('/assets/brand/logo.svg');
  expect(iconLinks.join(' ')).toContain('/assets/brand/favicon-16.png');
  expect(iconLinks.join(' ')).toContain('/assets/brand/favicon-32.png');
  expect(iconLinks.join(' ')).toContain('/assets/brand/favicon-64.png');
  expect(iconLinks.join(' ')).toContain('/assets/brand/favicon.ico');
  expect(iconLinks.join(' ')).toContain('/assets/brand/apple-touch-icon.png');
  expect(iconLinks.join(' ')).toContain('/site.webmanifest');

  for (const asset of [
    '/assets/brand/logo.svg',
    '/assets/brand/favicon-16.png',
    '/assets/brand/favicon-32.png',
    '/assets/brand/favicon-64.png',
    '/assets/brand/favicon.ico',
    '/assets/brand/apple-touch-icon.png',
    '/assets/brand/logo-192.png',
    '/assets/brand/logo-512.png'
  ]) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should be served`).toBe(true);
  }

  const manifestResponse = await request.get('/site.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(JSON.stringify(manifest.icons)).toContain('assets/brand/logo-192.png');
  expect(JSON.stringify(manifest.icons)).toContain('assets/brand/logo-512.png');
});
