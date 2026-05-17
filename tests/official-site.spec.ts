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

test('homepage top bar exposes Web app and API docs entries', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const nav = page.locator('.nav');
  const zhWebLink = nav.getByRole('link', { name: 'Web端', exact: true });
  await expect(zhWebLink).toBeVisible();
  await expect(zhWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(zhWebLink).toHaveAttribute('target', '_blank');
  await expect(zhWebLink).toHaveAttribute('rel', /noopener/);
  await expect(zhWebLink).toHaveAttribute('rel', /noreferrer/);
  const zhDocsLink = nav.getByRole('link', { name: '接口文档', exact: true });
  await expect(zhDocsLink).toBeVisible();
  await expect(zhDocsLink).toHaveAttribute('href', '/docs/?lang=zh-CN');
  await expect(nav.getByRole('button', { name: /Switch to English/ })).toBeVisible();
  for (const anchor of ['#product', '#gear', '#skills', '#screenshots', '#entry']) {
    await expect(nav.locator(`a[href="${anchor}"]`)).toHaveCount(0);
  }
  await expect(nav.locator('.nav__links').locator('a')).toHaveCount(2);

  await page.evaluate(() => window.scrollTo(0, 980));
  await expect(nav).toBeVisible();
  await expect
    .poll(async () => Math.round(await nav.evaluate((element) => element.getBoundingClientRect().top)))
    .toBe(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(zhWebLink).toBeVisible();
  await expect(zhDocsLink).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
    .toBe(true);

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enNav = page.locator('.nav');
  const enWebLink = enNav.getByRole('link', { name: 'Web App', exact: true });
  await expect(enWebLink).toBeVisible();
  await expect(enWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(enWebLink).toHaveAttribute('target', '_blank');
  await expect(enWebLink).toHaveAttribute('rel', /noopener/);
  await expect(enWebLink).toHaveAttribute('rel', /noreferrer/);
  const enDocsLink = enNav.getByRole('link', { name: 'API Docs', exact: true });
  await expect(enDocsLink).toBeVisible();
  await expect(enDocsLink).toHaveAttribute('href', '/docs/?lang=en-US');
});


test('right floating breadcrumb pins in-page jump links on click', async ({ page }, testInfo) => {
  await page.goto('/?lang=zh-CN');
  const isMobile = testInfo.project.name.includes('mobile');
  const floatingNav = page.getByRole('navigation', { name: '页面快捷跳转' });

  await expect(floatingNav).toBeVisible();
  const panel = floatingNav.locator('.floating-breadcrumb__panel');
  const trigger = floatingNav.getByRole('button', { name: '展开页面快捷跳转' });
  await expect(panel).toBeHidden();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  if (!isMobile) {
    await trigger.hover();
    await expect(panel).toBeVisible();
    await page.mouse.move(24, 24);
    await expect(panel).toBeHidden();
  }

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  if (isMobile) {
    const panelBox = await panel.boundingBox();
    expect(panelBox).not.toBeNull();
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(panelBox!.x).toBeGreaterThanOrEqual(0);
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(viewport!.width + 1);
  }
  await page.mouse.move(24, 24);
  await expect(panel).toBeVisible();

  const zhJumpLinks = [
    ['首页', '#top'],
    ['产品介绍', '#product'],
    ['装备管理', '#gear'],
    ['户外技能', '#skills'],
    ['产品截图', '#screenshots'],
    ['下载入口', '#entry']
  ] as const;
  for (const [item, href] of zhJumpLinks) {
    const link = floatingNav.getByRole('link', { name: item, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
  await expect(floatingNav.getByRole('link', { name: '接口文档', exact: true })).toHaveCount(0);

  await page.mouse.click(24, 24);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await trigger.click();

  await floatingNav.getByRole('link', { name: '下载入口', exact: true }).click();
  await expect(page).toHaveURL(/#entry$/);

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enFloatingNav = page.getByRole('navigation', { name: 'Page quick jumps' });
  const enTrigger = enFloatingNav.getByRole('button', { name: 'Expand page quick jumps' });
  await enTrigger.click();
  await expect(enTrigger).toHaveAttribute('aria-expanded', 'true');
  const enJumpLinks = [
    ['Home', '#top'],
    ['Product intro', '#product'],
    ['Gear management', '#gear'],
    ['Outdoor skills', '#skills'],
    ['Product screenshots', '#screenshots'],
    ['Downloads', '#entry']
  ] as const;
  for (const [item, href] of enJumpLinks) {
    const link = enFloatingNav.getByRole('link', { name: item, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
  await expect(enFloatingNav.getByRole('link', { name: 'API Docs', exact: true })).toHaveCount(0);
});

test('homepage communicates Web Android and mini program support with live web entry', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const zhPlatforms = page.getByRole('list', { name: '支持平台' });
  await expect(zhPlatforms.getByText('Web 端', { exact: true })).toBeVisible();
  await expect(zhPlatforms.getByText('Android 端', { exact: true })).toBeVisible();
  await expect(zhPlatforms.getByText('微信小程序端', { exact: true })).toBeVisible();
  await expect(page.locator('.metric').filter({ hasText: '支持平台' }).locator('strong')).toHaveText('03');
  const zhEntry = page.locator('#entry');
  await expect(zhEntry).toContainText('Web、Android、微信小程序都可使用');
  await expect(zhEntry).toContainText('Web 端已上线');
  await expect(zhEntry).toContainText('Android 安装');
  const zhWebLink = zhEntry.getByRole('link', { name: '打开 Web 端', exact: true });
  await expect(zhWebLink).toBeVisible();
  await expect(zhWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(zhWebLink).toHaveAttribute('target', '_blank');
  await expect(zhWebLink).toHaveAttribute('rel', /noopener/);
  await expect(zhWebLink).toHaveAttribute('rel', /noreferrer/);
  await expect(zhEntry.locator('li').filter({ hasText: 'Android 安装' }).locator('a')).toHaveCount(0);
  await expect(zhEntry.locator('li').filter({ hasText: '微信小程序' }).locator('a')).toHaveCount(0);

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enPlatforms = page.getByRole('list', { name: 'Supported platforms' });
  await expect(enPlatforms.getByText('Web app', { exact: true })).toBeVisible();
  await expect(enPlatforms.getByText('Android app', { exact: true })).toBeVisible();
  await expect(enPlatforms.getByText('WeChat Mini Program', { exact: true })).toBeVisible();
  const enEntry = page.locator('#entry');
  await expect(enEntry).toContainText('Use StellarTrail on Web, Android, and WeChat Mini Program');
  await expect(enEntry).toContainText('The Web app is live');
  const enWebLink = enEntry.getByRole('link', { name: 'Open Web app', exact: true });
  await expect(enWebLink).toBeVisible();
  await expect(enWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(enWebLink).toHaveAttribute('target', '_blank');
  await expect(enWebLink).toHaveAttribute('rel', /noopener/);
  await expect(enWebLink).toHaveAttribute('rel', /noreferrer/);
  await expect(enEntry.locator('li').filter({ hasText: 'Android install' }).locator('a')).toHaveCount(0);
  await expect(enEntry.locator('li').filter({ hasText: 'WeChat Mini Program' }).locator('a')).toHaveCount(0);
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
