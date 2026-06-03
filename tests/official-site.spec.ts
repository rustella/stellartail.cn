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

test('uses browser language on first visit without stored preference', async ({ browser }) => {
  const zhContext = await browser.newContext({ locale: 'zh-CN', viewport: { width: 390, height: 844 } });
  const zhPage = await zhContext.newPage();
  await zhPage.goto('/');
  await expect(zhPage.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(zhPage.getByRole('heading', { level: 1 })).toContainText('出发前');
  await zhContext.close();

  const enContext = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 } });
  const enPage = await enContext.newPage();
  await enPage.goto('/');
  await expect(enPage.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(enPage.getByRole('heading', { level: 1 })).toContainText('Prepare gear');
  await enContext.close();
});

test('persists language switch preference', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await page.getByRole('button', { name: /Switch to English/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  const stored = await page.evaluate(() => window.localStorage.getItem('stellartrail.official.lang'));
  expect(stored).toBe('en-US');
});

test('homepage top bar exposes Web app downloads and API docs entries', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const nav = page.locator('.nav');
  const zhWebLink = nav.getByRole('link', { name: 'Web端', exact: true });
  await expect(zhWebLink).toBeVisible();
  await expect(zhWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(zhWebLink).toHaveAttribute('target', '_blank');
  await expect(zhWebLink).toHaveAttribute('rel', /noopener/);
  await expect(zhWebLink).toHaveAttribute('rel', /noreferrer/);
  const zhDownloadsLink = nav.getByRole('link', { name: '下载', exact: true });
  await expect(zhDownloadsLink).toBeVisible();
  await expect(zhDownloadsLink).toHaveAttribute('href', '/downloads/?lang=zh-CN');
  const zhDocsLink = nav.getByRole('link', { name: '接口文档', exact: true });
  await expect(zhDocsLink).toBeVisible();
  await expect(zhDocsLink).toHaveAttribute('href', '/docs/?lang=zh-CN');
  await expect(nav.getByRole('button', { name: /Switch to English/ })).toBeVisible();
  for (const anchor of ['#product', '#gear', '#packing', '#trips', '#skills', '#entry']) {
    await expect(nav.locator(`a[href="${anchor}"]`)).toHaveCount(0);
  }
  await expect(nav.locator('.nav__links').locator('a')).toHaveCount(3);

  await page.evaluate(() => window.scrollTo(0, 980));
  await expect(nav).toBeVisible();
  await expect
    .poll(async () => Math.round(await nav.evaluate((element) => element.getBoundingClientRect().top)))
    .toBe(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(zhWebLink).toBeVisible();
  await expect(zhDownloadsLink).toBeVisible();
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
  const enDownloadsLink = enNav.getByRole('link', { name: 'Downloads', exact: true });
  await expect(enDownloadsLink).toBeVisible();
  await expect(enDownloadsLink).toHaveAttribute('href', '/downloads/?lang=en-US');
  const enDocsLink = enNav.getByRole('link', { name: 'API Docs', exact: true });
  await expect(enDocsLink).toBeVisible();
  await expect(enDocsLink).toHaveAttribute('href', '/docs/?lang=en-US');
});


test('right floating breadcrumb shows in-page jump links by default', async ({ page }, testInfo) => {
  await page.goto('/?lang=zh-CN');
  const isMobile = testInfo.project.name.includes('mobile');
  const floatingNav = page.getByRole('navigation', { name: '页面快捷跳转' });

  await expect(floatingNav).toBeVisible();
  const panel = floatingNav.locator('.floating-breadcrumb__panel');
  const trigger = floatingNav.getByRole('button', { name: '展开页面快捷跳转' });
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
    ['个人装备', '#gear'],
    ['装备清单', '#packing'],
    ['行程准备', '#trips'],
    ['绳结技能', '#skills'],
    ['下载入口', '#entry']
  ] as const;
  for (const [item, href] of zhJumpLinks) {
    const link = floatingNav.getByRole('link', { name: item, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
  await expect(floatingNav.getByRole('link', { name: '接口文档', exact: true })).toHaveCount(0);

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();

  await floatingNav.getByRole('link', { name: '下载入口', exact: true }).click();
  await expect(page).toHaveURL(/#entry$/);

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enFloatingNav = page.getByRole('navigation', { name: 'Page quick jumps' });
  const enTrigger = enFloatingNav.getByRole('button', { name: 'Expand page quick jumps' });
  const enPanel = enFloatingNav.locator('.floating-breadcrumb__panel');
  await expect(enTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(enPanel).toBeVisible();
  const enJumpLinks = [
    ['Home', '#top'],
    ['Product intro', '#product'],
    ['Personal gear', '#gear'],
    ['Packing lists', '#packing'],
    ['Trip prep', '#trips'],
    ['Knot skills', '#skills'],
    ['Downloads', '#entry']
  ] as const;
  for (const [item, href] of enJumpLinks) {
    const link = enFloatingNav.getByRole('link', { name: item, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
  await expect(enFloatingNav.getByRole('link', { name: 'API Docs', exact: true })).toHaveCount(0);
});

test('homepage hero omits duplicate capability shortcuts and CTA buttons', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await expect(page.locator('.hero-note')).toHaveCount(0);
  await expect(page.locator('.platform-list')).toHaveCount(0);
  const zhHero = page.locator('.hero');
  await expect(zhHero.locator('.hero-quick-links')).toHaveCount(0);
  await expect(page.locator('.metric strong')).toHaveText(['整理', '确认', '复习']);
  await expect(page.locator('.metric').filter({ hasText: '装备与清单' }).locator('strong')).toHaveText('整理');
  await expect(page.locator('.metric').filter({ hasText: '行程准备' }).locator('strong')).toHaveText('确认');
  await expect(page.locator('.metric').filter({ hasText: '绳结技能' }).locator('strong')).toHaveText('复习');
  await expect(page.getByRole('link', { name: '查看多端入口', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: '查看重点能力', exact: true })).toHaveCount(0);
  const zhEntry = page.locator('#entry');
  await expect(zhEntry).toContainText('移动端入口集中在下载页');
  await expect(zhEntry).toContainText('Web 端已上线');
  const zhWebLink = zhEntry.getByRole('link', { name: '打开 Web 端', exact: true });
  await expect(zhWebLink).toBeVisible();
  await expect(zhWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(zhWebLink).toHaveAttribute('target', '_blank');
  await expect(zhWebLink).toHaveAttribute('rel', /noopener/);
  await expect(zhWebLink).toHaveAttribute('rel', /noreferrer/);
  const zhMobileLink = zhEntry.getByRole('link', { name: '查看下载页', exact: true });
  await expect(zhMobileLink).toBeVisible();
  await expect(zhMobileLink).toHaveAttribute('href', '/downloads/?lang=zh-CN');
  await expect(zhMobileLink).not.toHaveAttribute('target', '_blank');

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  await expect(page.locator('.hero-note')).toHaveCount(0);
  await expect(page.locator('.platform-list')).toHaveCount(0);
  const enHero = page.locator('.hero');
  await expect(enHero.locator('.hero-quick-links')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View platform entry', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore key features', exact: true })).toHaveCount(0);
  const enEntry = page.locator('#entry');
  await expect(enEntry).toContainText('Mobile entries live on the downloads page');
  await expect(enEntry).toContainText('The Web app is live');
  const enWebLink = enEntry.getByRole('link', { name: 'Open Web app', exact: true });
  await expect(enWebLink).toBeVisible();
  await expect(enWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(enWebLink).toHaveAttribute('target', '_blank');
  await expect(enWebLink).toHaveAttribute('rel', /noopener/);
  await expect(enWebLink).toHaveAttribute('rel', /noreferrer/);
  const enMobileLink = enEntry.getByRole('link', { name: 'View downloads', exact: true });
  await expect(enMobileLink).toBeVisible();
  await expect(enMobileLink).toHaveAttribute('href', '/downloads/?lang=en-US');
  await expect(enMobileLink).not.toHaveAttribute('target', '_blank');
});

test('downloads page groups mobile entries without placeholder links', async ({ page }) => {
  await page.goto('/downloads/?lang=zh-CN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('移动端入口都放在这里');
  const zhNav = page.getByRole('navigation', { name: '下载页导航' });
  await expect(zhNav.locator('.nav__brand')).toHaveAttribute('href', '/?lang=zh-CN');
  await expect(zhNav.locator('.nav__links').getByRole('link', { name: '接口文档', exact: true })).toHaveAttribute('href', '/docs/?lang=zh-CN');

  const downloads = page.locator('#mobile-downloads');
  await expect(downloads).toContainText('Android 安装包');
  await expect(downloads).toContainText('微信小程序入口');
  await expect(downloads.locator('.download-card')).toHaveCount(3);
  await expect(downloads.locator('.download-card--android a')).toHaveCount(0);
  await expect(downloads.locator('.download-card--wechat a')).toHaveCount(0);
  const webLink = downloads.getByRole('link', { name: '打开 Web 端', exact: true });
  await expect(webLink).toBeVisible();
  await expect(webLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(webLink).toHaveAttribute('target', '_blank');
  await expect(downloads).toContainText('不会展示假下载地址或假小程序码');

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/downloads/?lang=en-US');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mobile entries are collected here');
  await expect(page.locator('#mobile-downloads')).toContainText('Android install');
  await expect(page.locator('#mobile-downloads')).toContainText('WeChat Mini Program entry');
});

test('downloads page stays static and fits mobile viewport', async ({ page }) => {
  const blocked: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/healthz' || url.pathname.startsWith('/api/')) blocked.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/downloads/?lang=zh-CN');
  await page.waitForLoadState('load');
  expect(blocked).toEqual([]);
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
});

test('does not make backend API requests', async ({ page }) => {
  const blocked: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/healthz' || url.pathname.startsWith('/api/')) blocked.push(request.url());
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
  for (const id of ['product', 'gear', 'packing', 'trips', 'skills', 'entry']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('#screenshots')).toHaveCount(0);
});

test('feature sections keep copy before their screenshots on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=zh-CN');

  for (const id of ['gear', 'packing', 'trips', 'skills']) {
    const section = page.locator(`#${id}`);
    const heading = section.getByRole('heading', { level: 2 });
    const phone = section.locator('.feature-panel--phone');
    await expect(heading).toBeVisible();
    await expect(phone).toBeVisible();

    const headingBox = await heading.boundingBox();
    const phoneBox = await phone.boundingBox();
    expect(headingBox).not.toBeNull();
    expect(phoneBox).not.toBeNull();
    expect(headingBox!.y).toBeLessThan(phoneBox!.y);
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

test('homepage copy stays user-facing and avoids duplicate screenshot gallery', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  const zhBodyText = await page.locator('body').innerText();
  for (const forbidden of ['官网不依赖后端', '静态方式交付', '部署简单', '后续易维护', '白天模式', '轻量可信', '官网只承诺当前可展示能力', '中英双语', '根据系统语言默认展示', '从当前产品页面', '挑选代表功能', '代表功能', '代表内容', '给你的prompt', 'prompt', '开发文档', '后端接口', 'API Reference']) {
    expect(zhBodyText).not.toContain(forbidden);
  }

  await expect(page.locator('#screenshots')).toHaveCount(0);
  await expect(page.getByText('重点能力的真实界面示例')).toHaveCount(0);
  await expect(page.getByText('产品截图', { exact: true })).toHaveCount(0);
  const imageSources = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src') ?? '').join(' '));
  for (const expected of [
    'android-gear-library-22da64a-zh.png',
    'android-packing-list-22da64a-zh.png',
    'android-trips-22da64a-zh.png',
    'android-knot-skills-22da64a-zh.png'
  ]) {
    expect(imageSources).toContain(expected);
  }
  for (const duplicateGalleryAsset of ['wechat-gear-management-a1fc941-zh.png', 'wechat-knot-skills-a1fc941-zh.png', 'web-gear-management-a1fc941-zh.png', 'web-gear-form-a1fc941-zh.png']) {
    expect(imageSources).not.toContain(duplicateGalleryAsset);
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


const registeredApiRequests = [
  'GET /healthz',
  'GET /api/meta',
  'POST /api/auth/wechat-login',
  'POST /api/auth/email-verification-code',
  'POST /api/auth/email-login-code',
  'POST /api/auth/email-login',
  'POST /api/auth/password-reset-code',
  'POST /api/auth/password-reset',
  'POST /api/auth/register',
  'POST /api/auth/login',
  'POST /api/auth/refresh',
  'POST /api/auth/captcha',
  'GET /api/gear-templates',
  'GET /api/gear-templates/:id',
  'GET /api/skills',
  'GET /api/skills/knots/list',
  'GET /api/skills/knots/detail/:id',
  'PUT /api/admin/skills/knots/:knot_id/media/:asset_id',
  'GET /api/me/gears/categories',
  'GET /api/me/gears/stats',
  'GET /api/me/gears/export',
  'POST /api/me/gears/import',
  'GET /api/me/gears',
  'POST /api/me/gears',
  'GET /api/me/gears/:id',
  'PATCH /api/me/gears/:id',
  'DELETE /api/me/gears/:id',
  'POST /api/me/gears/:id/restore',
  'POST /api/me/uploads',
  'GET /api/me/uploads/:id',
  'POST /api/me/feedback'
] as const;

const assertDocsApiReference = async (page: import('@playwright/test').Page, locale: 'zh-CN' | 'en-US') => {
  const backendRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/healthz' || url.pathname.startsWith('/api/')) backendRequests.push(request.url());
  });

  await page.goto(`/docs/?lang=${locale}`);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  const requestTexts = await page.locator('.endpoint-card__request').evaluateAll((nodes) =>
    nodes.map((node) => node.textContent?.replace(/\s+/g, ' ').trim())
  );
  expect(requestTexts).toEqual([...registeredApiRequests]);
  await expect(page.getByText('bd9cbb7', { exact: true })).toBeVisible();
  await expect(page.getByText('2026-05-18', { exact: true })).toBeVisible();
  await expect(page.getByText('Authorization: Bearer <access_token>')).toBeVisible();
  await expect(page.getByText('X-StellarTrail-Locale: zh-CN | en').first()).toBeVisible();
  await expect(page.getByText('multipart/form-data').first()).toBeVisible();
  await expect(page.getByText('text/csv; charset=utf-8').first()).toBeVisible();
  await expect(page.getByText('captcha_required').first()).toBeVisible();
  await expect(page.getByText('validation_failed').first()).toBeVisible();
  const bodyText = await page.locator('body').innerText();
  for (const unregistered of ['/api/mountains', '/api/routes', '/assets/*']) {
    expect(bodyText).not.toContain(unregistered);
  }
  const forbiddenDocsOrigin = process.env.DOCS_PUBLIC_ORIGIN ?? '';
  if (forbiddenDocsOrigin) expect(bodyText).not.toContain(forbiddenDocsOrigin);
  expect(backendRequests).toEqual([]);
};

test('renders complete Chinese docs API reference page without backend requests', async ({ page }) => {
  await assertDocsApiReference(page, 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('开发文档');
  await expect(page.getByText('当前列出 31 个已注册接口')).toBeVisible();
  await expect(page.getByRole('heading', { name: '登录与账号' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '装备库' })).toBeVisible();
});

test('renders complete English docs API reference page', async ({ page }) => {
  await assertDocsApiReference(page, 'en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('API Reference');
  await expect(page.getByText('31 registered endpoints are listed')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Authentication and account' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gear library' })).toBeVisible();
});



test('docs request runner keeps requests user-initiated and validates required service origin', async ({ page }) => {
  const backendRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/healthz' || url.pathname.startsWith('/api/')) backendRequests.push(request.url());
  });

  await page.goto('/docs/?lang=zh-CN');
  await page.waitForLoadState('networkidle');
  expect(backendRequests).toEqual([]);

  await expect(page.locator('[data-service-address]')).toHaveCount(1);
  await expect(page.locator('[data-request-base]')).toHaveCount(0);
  await expect(page.locator('[data-service-address]')).toHaveValue('');

  const card = page.locator('#endpoint-healthz');
  await card.getByRole('button', { name: '发送请求' }).click();
  await expect(card.locator('[data-response-status]')).toHaveText('请先填写服务地址');
  expect(backendRequests).toEqual([]);
});

test('docs request runner builds GET requests from service origin path params and query params', async ({ page }) => {
  const capturedRequests: string[] = [];
  await page.route('https://api.example.test/api/gear-templates/backpacking-basic?locale=zh-CN&limit=20', async (route) => {
    capturedRequests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ id: 'backpacking-basic', ok: true })
    });
  });

  await page.goto('/docs/?lang=zh-CN');
  await expect(page.locator('[data-service-address]')).toHaveCount(1);
  const card = page.locator('#endpoint-gearTemplatesDetail');
  await page.locator('[data-service-address]').fill('https://api.example.test/');
  await card.locator('[data-path-param="id"]').fill('backpacking-basic');
  await card.locator('[data-extra-query]').fill('locale=zh-CN&limit=20');
  await card.getByRole('button', { name: '发送请求' }).click();

  await expect(card.getByText('200 OK')).toBeVisible();
  await expect(card.locator('[data-response-body]')).toContainText('"ok": true');
  expect(capturedRequests).toEqual(['https://api.example.test/api/gear-templates/backpacking-basic?locale=zh-CN&limit=20']);
});



test('docs request runner reuses one shared service address for different endpoints', async ({ page }) => {
  const capturedRequests: string[] = [];
  await page.route('https://api.example.test/healthz', async (route) => {
    capturedRequests.push(route.request().url());
    await route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  await page.route('https://api.example.test/api/meta', async (route) => {
    capturedRequests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ service: 'stellartrail-api' })
    });
  });

  await page.goto('/docs/?lang=zh-CN');
  await page.locator('[data-service-address]').fill('https://api.example.test');
  await page.locator('#endpoint-healthz').getByRole('button', { name: '发送请求' }).click();
  await expect(page.locator('#endpoint-healthz').getByText('204 No Content')).toBeVisible();

  await page.locator('#endpoint-meta').getByRole('button', { name: '发送请求' }).click();
  await expect(page.locator('#endpoint-meta').locator('[data-response-body]')).toContainText('stellartrail-api');
  expect(capturedRequests).toEqual(['https://api.example.test/healthz', 'https://api.example.test/api/meta']);
});

test('docs request runner sends JSON body and custom headers for POST requests', async ({ page }) => {
  const captured: Array<{ method: string; headers: Record<string, string>; body: string | null }> = [];
  await page.context().addCookies([{ name: 'docs_session', value: 'should-not-be-sent', url: 'https://api.example.test' }]);
  await page.route('https://api.example.test/api/auth/login', async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'content-type, x-trace-id'
        }
      });
      return;
    }
    captured.push({ method: request.method(), headers: request.headers(), body: request.postData() });
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ code: 'invalid_credentials', message: 'Invalid account or password' })
    });
  });

  await page.goto('/docs/?lang=zh-CN');
  await expect(page.locator('[data-service-address]')).toHaveCount(1);
  const card = page.locator('#endpoint-authPasswordLogin');
  await page.locator('[data-service-address]').fill('https://api.example.test');
  await card.locator('[data-request-headers]').fill('X-Trace-Id: docs-test');
  await card.locator('[data-request-body]').fill(JSON.stringify({ account: 'trail_user', password: 'wrong-password' }, null, 2));
  await card.getByRole('button', { name: '发送请求' }).click();

  await expect(card.getByText('401 Unauthorized')).toBeVisible();
  await expect(card.locator('[data-response-body]')).toContainText('invalid_credentials');
  expect(captured).toHaveLength(1);
  expect(captured[0].method).toBe('POST');
  expect(captured[0].headers['x-trace-id']).toBe('docs-test');
  expect(captured[0].headers['content-type']).toContain('application/json');
  expect(captured[0].headers.cookie).toBeUndefined();
  expect(JSON.parse(captured[0].body ?? '{}')).toEqual({ account: 'trail_user', password: 'wrong-password' });
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
