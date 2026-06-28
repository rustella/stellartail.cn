import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

const BEIAN_URL = 'https://beian.miit.gov.cn/';
const ICP_ENV_KEY = 'VITE_PUBLIC_ICP_RECORD_NUMBER';
const PRIVACY_CONTACT_EMAIL_ENV_KEY = 'VITE_PUBLIC_PRIVACY_CONTACT_EMAIL';
const LOCAL_DEPLOYMENT_CONFIG = 'config/deployment.local.json';

const readLocalDeploymentConfig = (): Record<string, unknown> => {
  if (!existsSync(LOCAL_DEPLOYMENT_CONFIG)) return {};
  return JSON.parse(readFileSync(LOCAL_DEPLOYMENT_CONFIG, 'utf8')) as Record<string, unknown>;
};

const readLocalDeploymentConfigValue = (key: string): string => {
  const value = readLocalDeploymentConfig()[key];
  return typeof value === 'string' ? value.trim() : '';
};

const readEnvFileValue = (path: string, key: string): string => {
  if (!existsSync(path)) return '';
  const line = readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));
  if (!line) return '';
  return line.slice(line.indexOf('=') + 1).trim();
};

const configuredIcpRecordNumber = (): string => {
  const localConfigValue = readLocalDeploymentConfigValue('icpRecordNumber');
  if (localConfigValue) return localConfigValue;
  if (Object.prototype.hasOwnProperty.call(process.env, ICP_ENV_KEY)) return process.env[ICP_ENV_KEY]?.trim() ?? '';
  return readEnvFileValue('.env.local', ICP_ENV_KEY) || readEnvFileValue('.env', ICP_ENV_KEY);
};

const configuredPrivacyContactEmail = (): string => {
  const localConfigValue = readLocalDeploymentConfigValue('privacyContactEmail');
  if (localConfigValue) return localConfigValue;
  if (Object.prototype.hasOwnProperty.call(process.env, PRIVACY_CONTACT_EMAIL_ENV_KEY)) {
    return process.env[PRIVACY_CONTACT_EMAIL_ENV_KEY]?.trim() ?? '';
  }
  return readEnvFileValue('.env.local', PRIVACY_CONTACT_EMAIL_ENV_KEY) || readEnvFileValue('.env', PRIVACY_CONTACT_EMAIL_ENV_KEY);
};

test('renders Chinese content with explicit language', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('StellarTrail / 寻径星野');
  await expect(page.locator('.landing-hero__slogan')).toContainText('出发前');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});

test('renders English content with explicit language', async ({ page }) => {
  await page.goto('/?lang=en-US');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('StellarTrail');
  await expect(page.locator('.landing-hero__slogan')).toContainText('Prepare gear');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});

test('uses browser language on first visit without stored preference', async ({ browser }) => {
  const zhContext = await browser.newContext({ locale: 'zh-CN', viewport: { width: 390, height: 844 } });
  const zhPage = await zhContext.newPage();
  await zhPage.goto('/');
  await expect(zhPage.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(zhPage.locator('.landing-hero__slogan')).toContainText('出发前');
  await zhContext.close();

  const enContext = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 } });
  const enPage = await enContext.newPage();
  await enPage.goto('/');
  await expect(enPage.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(enPage.locator('.landing-hero__slogan')).toContainText('Prepare gear');
  await enContext.close();
});

test('persists language switch preference', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await page.getByRole('button', { name: /Switch to English/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  const stored = await page.evaluate(() => window.localStorage.getItem('stellartrail.official.lang'));
  expect(stored).toBe('en-US');
});

test('homepage top bar exposes Web app downloads and privacy entries', async ({ page }, testInfo) => {
  const isMobile = testInfo.project.name.includes('mobile');
  await page.goto('/?lang=zh-CN');
  const nav = page.locator('.nav');
  const zhProductLink = nav.getByRole('link', { name: '产品介绍', exact: true });
  await expect(zhProductLink).toBeVisible();
  await expect(zhProductLink).toHaveAttribute('href', '/product/?lang=zh-CN');
  const zhWebLink = nav.locator('.nav__web-link');
  if (isMobile) await expect(zhWebLink).toBeHidden();
  else await expect(zhWebLink).toBeVisible();
  await expect(zhWebLink).toHaveText('Web端');
  await expect(zhWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(zhWebLink).toHaveAttribute('target', '_blank');
  await expect(zhWebLink).toHaveAttribute('rel', /noopener/);
  await expect(zhWebLink).toHaveAttribute('rel', /noreferrer/);
  const zhDownloadsLink = nav.getByRole('link', { name: '下载', exact: true });
  await expect(zhDownloadsLink).toBeVisible();
  await expect(zhDownloadsLink).toHaveAttribute('href', '/downloads/?lang=zh-CN');
  await expect(nav.getByRole('link', { name: '接口文档', exact: true })).toHaveCount(0);
  await expect(nav.locator('a[href*="/docs/"]')).toHaveCount(0);
  const zhPrivacyLink = nav.locator('.nav__privacy-link');
  await expect(zhPrivacyLink).toHaveText('隐私政策');
  await expect(zhPrivacyLink).toHaveAttribute('href', '/privacy/?lang=zh-CN');
  if (!isMobile) await expect(zhPrivacyLink).toBeVisible();
  await expect(nav.getByRole('button', { name: /Switch to English/ })).toBeVisible();
  for (const anchor of ['#product', '#gear', '#packing', '#trips', '#skills', '#entry']) {
    await expect(nav.locator(`a[href="${anchor}"]`)).toHaveCount(0);
  }
  await expect(nav.locator('.nav__links').locator('a')).toHaveCount(4);

  await page.evaluate(() => window.scrollTo(0, 980));
  await expect(nav).toBeVisible();
  await expect
    .poll(async () => Math.round(await nav.evaluate((element) => element.getBoundingClientRect().top)))
    .toBe(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(zhProductLink).toBeVisible();
  await expect(zhWebLink).toBeHidden();
  await expect(page.locator('.landing-entry__web')).toBeVisible();
  await expect(zhDownloadsLink).toBeVisible();
  await expect(nav.getByRole('link', { name: '接口文档', exact: true })).toHaveCount(0);
  await expect(zhPrivacyLink).toHaveAttribute('href', '/privacy/?lang=zh-CN');
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
    .toBe(true);

  await page.evaluate(() => window.localStorage.clear());
  if (!isMobile) await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/?lang=en-US');
  const enNav = page.locator('.nav');
  const enProductLink = enNav.getByRole('link', { name: 'Product intro', exact: true });
  await expect(enProductLink).toBeVisible();
  await expect(enProductLink).toHaveAttribute('href', '/product/?lang=en-US');
  const enWebLink = enNav.locator('.nav__web-link');
  if (isMobile) await expect(enWebLink).toBeHidden();
  else await expect(enWebLink).toBeVisible();
  await expect(enWebLink).toHaveText('Web App');
  await expect(enWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(enWebLink).toHaveAttribute('target', '_blank');
  await expect(enWebLink).toHaveAttribute('rel', /noopener/);
  await expect(enWebLink).toHaveAttribute('rel', /noreferrer/);
  const enDownloadsLink = enNav.getByRole('link', { name: 'Downloads', exact: true });
  await expect(enDownloadsLink).toBeVisible();
  await expect(enDownloadsLink).toHaveAttribute('href', '/downloads/?lang=en-US');
  await expect(enNav.getByRole('link', { name: 'API Docs', exact: true })).toHaveCount(0);
  await expect(enNav.locator('a[href*="/docs/"]')).toHaveCount(0);
  const enPrivacyLink = enNav.locator('.nav__privacy-link');
  await expect(enPrivacyLink).toHaveText('Privacy Policy');
  await expect(enPrivacyLink).toHaveAttribute('href', '/privacy/?lang=en-US');
  if (!isMobile) await expect(enPrivacyLink).toBeVisible();
});

test('homepage footer renders the configured ICP record link', async ({ page }) => {
  const icpRecordNumber = configuredIcpRecordNumber();
  test.skip(!icpRecordNumber, 'ICP record number is not configured for this run');

  await page.goto('/?lang=zh-CN');
  const footer = page.locator('.footer');
  const legal = footer.locator('.footer__legal');
  await expect(footer.locator('.footer__brand')).toContainText('StellarTrail / 寻径星野');
  await expect(footer.locator('.footer__brand')).toContainText('户外准备，从清单和户外技能开始');
  await expect(legal).toContainText('©');
  await expect(legal.getByRole('link', { name: '隐私政策', exact: true })).toHaveAttribute('href', '/privacy/?lang=zh-CN');
  const icpLink = footer.getByRole('link', { name: icpRecordNumber, exact: true });
  await expect(icpLink).toBeVisible();
  await expect(legal.getByRole('link', { name: icpRecordNumber, exact: true })).toBeVisible();
  await expect(icpLink).toHaveAttribute('href', BEIAN_URL);
  await expect(icpLink).toHaveAttribute('target', '_blank');
  await expect(icpLink).toHaveAttribute('rel', /noopener/);
  await expect(icpLink).toHaveAttribute('rel', /noreferrer/);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(icpLink).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
    .toBe(true);
});

test('homepage footer omits the ICP link when config is empty', async ({ page }) => {
  test.skip(Boolean(configuredIcpRecordNumber()), 'ICP record number is configured for this run');

  await page.goto('/?lang=zh-CN');
  await expect(page.locator('.footer__icp-link')).toHaveCount(0);
  await expect(page.locator('.footer__privacy-link')).toHaveText('隐私政策');
  await expect(page.locator('.footer__privacy-link')).toHaveAttribute('href', '/privacy/?lang=zh-CN');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
    .toBe(true);
});


test('product intro floating breadcrumb stays collapsed on the hero and opens in-page jump links on demand', async ({ page }, testInfo) => {
  await page.goto('/product/?lang=zh-CN');
  const isMobile = testInfo.project.name.includes('mobile');
  const floatingNav = page.getByRole('navigation', { name: '页面快捷跳转' });

  await expect(floatingNav).toBeVisible();
  const panel = floatingNav.locator('.floating-breadcrumb__panel');
  const trigger = floatingNav.getByRole('button', { name: '展开页面快捷跳转' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
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
    ['iOS 主入口', '#ios'],
    ['产品介绍', '#product'],
    ['个人装备', '#gear'],
    ['装备清单', '#packing'],
    ['行程准备', '#trips'],
    ['户外技能', '#skills'],
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
  await page.goto('/product/?lang=en-US');
  const enFloatingNav = page.getByRole('navigation', { name: 'Page quick jumps' });
  const enTrigger = enFloatingNav.getByRole('button', { name: 'Expand page quick jumps' });
  const enPanel = enFloatingNav.locator('.floating-breadcrumb__panel');
  await expect(enTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(enPanel).toBeHidden();
  await enTrigger.click();
  await expect(enTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(enPanel).toBeVisible();
  const enJumpLinks = [
    ['Home', '#top'],
    ['iOS entries', '#ios'],
    ['Product intro', '#product'],
    ['Personal gear', '#gear'],
    ['Packing lists', '#packing'],
    ['Trip prep', '#trips'],
    ['Outdoor skills', '#skills'],
    ['Downloads', '#entry']
  ] as const;
  for (const [item, href] of enJumpLinks) {
    const link = enFloatingNav.getByRole('link', { name: item, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }
  await expect(enFloatingNav.getByRole('link', { name: 'API Docs', exact: true })).toHaveCount(0);
});

test('minimal homepage exposes app, Web, WeChat, and multi-device entries', async ({ page }) => {
  await page.goto('/?lang=zh-CN');
  await expect(page.locator('.hero')).toHaveCount(0);
  await expect(page.locator('#product, #gear, #packing, #trips, #skills, #entry')).toHaveCount(0);

  const zhHero = page.locator('.landing-hero');
  await expect(zhHero.locator('.landing-hero__logo')).toHaveAttribute('src', /logo\.svg/);
  await expect(zhHero.getByRole('heading', { level: 1 })).toHaveText('StellarTrail / 寻径星野');
  await expect(zhHero.locator('.landing-hero__slogan')).toHaveText('出发前，把装备、清单、行程和户外技能准备好。');
  await expect(zhHero.locator('.landing-entry-card')).toHaveCount(5);
  await expect(zhHero.getByRole('heading', { level: 2, name: '移动端下载' })).toBeVisible();
  await expect(zhHero.getByRole('heading', { level: 2, name: '桌面端下载' })).toBeVisible();
  await expect(zhHero.getByRole('heading', { level: 2, name: '手表端下载' })).toBeVisible();
  await expect(zhHero.getByRole('heading', { level: 2, name: 'Web 入口' })).toBeVisible();
  await expect(zhHero.getByRole('heading', { level: 2, name: '微信小程序入口' })).toBeVisible();
  const zhAppStoreLink = zhHero.getByRole('link', { name: '在 App Store 打开寻径星野', exact: true });
  await expect(zhAppStoreLink).toBeVisible();
  await expect(zhAppStoreLink).toHaveAttribute('href', 'https://apps.apple.com/app/stellartrail');
  await expect(zhAppStoreLink.locator('img.store-badge__image')).toHaveAttribute('src', /app-store-badge\.svg/);
  await expect(zhAppStoreLink.locator('.store-badge__platform')).toHaveCount(0);
  const zhGooglePlayLink = zhHero.getByRole('link', { name: '在 Google Play 打开寻径星野', exact: true });
  await expect(zhGooglePlayLink).toBeVisible();
  await expect(zhGooglePlayLink).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=cn.stellartrail');
  await expect(zhGooglePlayLink.locator('img.store-badge__image')).toHaveAttribute('src', /google-play-badge\.svg/);
  await expect(zhGooglePlayLink.locator('.store-badge__platform')).toHaveCount(0);
  const zhApkLink = zhHero.getByRole('link', { name: '直接下载 APK', exact: true });
  await expect(zhApkLink).toBeVisible();
  await expect(zhApkLink).toHaveAttribute('href', '/downloads/stellartrail-android.apk');
  await expect(zhApkLink).toHaveAttribute('download', 'stellartrail-android.apk');
  const zhMacStoreLink = zhHero.getByRole('link', { name: '在 Mac App Store 打开寻径星野', exact: true });
  await expect(zhMacStoreLink).toBeVisible();
  await expect(zhMacStoreLink).toHaveAttribute('href', 'https://apps.apple.com/app/stellartrail');
  await expect(zhMacStoreLink.locator('img.store-badge__image')).toHaveAttribute('src', /app-store-badge\.svg/);
  await expect(zhMacStoreLink.locator('.store-badge__platform')).toHaveCount(0);
  await expect(zhHero.getByRole('button', { name: 'Windows 即将上线', exact: true })).toBeDisabled();
  const zhWatchStoreBadge = zhHero.locator('[data-store-badge="watchos"]');
  await expect(zhWatchStoreBadge).toHaveAttribute('aria-disabled', 'true');
  await expect(zhWatchStoreBadge).toHaveAttribute('aria-label', 'Apple Watch 版本即将上线');
  await expect(zhWatchStoreBadge.locator('img.store-badge__image')).toHaveAttribute('src', /app-store-badge\.svg/);
  await expect(zhHero.getByRole('button', { name: 'watchOS 即将上线', exact: true })).toBeDisabled();
  const zhWebLink = zhHero.locator('.landing-entry__web');
  await expect(zhWebLink).toBeVisible();
  await expect(zhWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(zhWebLink).toHaveAttribute('target', '_blank');
  await expect(zhWebLink).toHaveAttribute('rel', /noopener/);
  await expect(zhWebLink).toHaveAttribute('rel', /noreferrer/);
  await expect(zhHero.locator('.landing-entry__qr img')).toHaveAttribute('src', /wechat-miniprogram-code\.png/);
  await expect(zhHero.locator('.landing-entry__qr')).toContainText('微信扫码打开');
  const zhDeviceStage = page.locator('.device-stage');
  await expect(page.locator('.device-frame')).toHaveCount(4);
  await expect(zhDeviceStage.locator('.device-frame--mac .device-frame__screen img')).toHaveAttribute('src', /web-gear-management-a1fc941-zh\.png/);
  await expect(zhDeviceStage.locator('.device-frame--mac .device-frame__bezel')).toHaveAttribute('src', /apple-macbook-pro-m5-14-silver\.png/);
  await expect(zhDeviceStage.locator('.device-frame--ipad .device-frame__screen img')).toHaveAttribute('src', /prototype-mobile-trips\.png/);
  await expect(zhDeviceStage.locator('.device-frame--ipad .device-frame__bezel')).toHaveAttribute('src', /apple-ipad-pro-m5-11-silver-landscape\.png/);
  await expect(zhDeviceStage.locator('.device-frame--phone .device-frame__screen img')).toHaveAttribute('src', /prototype-mobile-gear\.png/);
  await expect(zhDeviceStage.locator('.device-frame--phone .device-frame__bezel')).toHaveAttribute('src', /apple-iphone-17-pro-max-silver-portrait\.png/);
  await expect(zhDeviceStage.locator('.device-frame--watch .device-frame__bezel')).toHaveAttribute('src', /apple-watch-s11-46-natural-stone-gray\.png/);
  await expect(zhDeviceStage.locator('.watch-face')).toContainText('寻径星野');

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/?lang=en-US');
  const enHero = page.locator('.landing-hero');
  await expect(enHero.getByRole('heading', { level: 1 })).toHaveText('StellarTrail');
  await expect(enHero.locator('.landing-hero__slogan')).toHaveText('Prepare gear, lists, trips, and outdoor skills before you head out.');
  await expect(enHero.getByRole('link', { name: 'Open StellarTrail in the App Store', exact: true })).toHaveAttribute('href', 'https://apps.apple.com/app/stellartrail');
  await expect(enHero.getByRole('link', { name: 'Open StellarTrail on Google Play', exact: true })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=cn.stellartrail');
  await expect(enHero.getByRole('link', { name: 'Download APK', exact: true })).toHaveAttribute('href', '/downloads/stellartrail-android.apk');
  await expect(enHero.getByRole('link', { name: 'Open StellarTrail in the Mac App Store', exact: true })).toHaveAttribute('href', 'https://apps.apple.com/app/stellartrail');
  await expect(enHero.getByRole('button', { name: 'Windows coming soon', exact: true })).toBeDisabled();
  await expect(enHero.getByRole('heading', { level: 2, name: 'Watch downloads' })).toBeVisible();
  await expect(enHero.locator('[data-store-badge="watchos"]')).toHaveAttribute('aria-label', 'Apple Watch version coming soon');
  await expect(enHero.getByRole('button', { name: 'watchOS coming soon', exact: true })).toBeDisabled();
  const enWebLink = enHero.locator('.landing-entry__web');
  await expect(enWebLink).toBeVisible();
  await expect(enWebLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(enWebLink).toHaveAttribute('target', '_blank');
  await expect(enWebLink).toHaveAttribute('rel', /noopener/);
  await expect(enWebLink).toHaveAttribute('rel', /noreferrer/);
  await expect(enHero.locator('.landing-entry__qr img')).toHaveAttribute('src', /wechat-miniprogram-code\.png/);
  await expect(enHero.locator('.landing-entry__qr')).toContainText('Scan with WeChat');
  await expect(page.locator('.device-stage')).toContainText('StellarTrail');
});

test('top navigation brand stays at the page left across pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const url of ['/?lang=zh-CN', '/product/?lang=zh-CN', '/downloads/?lang=zh-CN', '/privacy/?lang=zh-CN']) {
    await page.goto(url);
    const brand = page.locator('.nav__brand');
    await expect(brand.locator('img')).toHaveAttribute('src', /logo\.svg/);
    await expect(brand.locator('.nav__brand-label--full')).toBeVisible();
    const box = await brand.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.x)).toBeLessThanOrEqual(24);
  }
});

test('downloads page presents app store entries and platform status', async ({ page }) => {
  await page.goto('/downloads/?lang=zh-CN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('选择你的设备');
  const zhNav = page.getByRole('navigation', { name: '下载页导航' });
  await expect(zhNav.locator('.nav__brand')).toHaveAttribute('href', '/?lang=zh-CN');
  await expect(zhNav.locator('.nav__links').getByRole('link', { name: '接口文档', exact: true })).toHaveCount(0);
  await expect(zhNav.locator('a[href*="/docs/"]')).toHaveCount(0);
  await expect(zhNav.locator('.nav__privacy-link')).toHaveText('隐私政策');
  await expect(zhNav.locator('.nav__privacy-link')).toHaveAttribute('href', '/privacy/?lang=zh-CN');
  await expect(page.locator('.footer__privacy-link')).toHaveText('隐私政策');
  await expect(page.locator('.footer__privacy-link')).toHaveAttribute('href', '/privacy/?lang=zh-CN');

  const recommendation = page.locator('.downloads-recommendation');
  await expect(recommendation).not.toContainText('手机上使用，优先从应用商店安装');
  await expect(recommendation.getByRole('link', { name: '查看全部入口', exact: true })).toHaveCount(0);
  const appStoreHeroLink = recommendation.getByRole('link', { name: '在 App Store 打开寻径星野', exact: true });
  await expect(appStoreHeroLink).toBeVisible();
  await expect(appStoreHeroLink).toHaveAttribute('href', 'https://apps.apple.com/app/stellartrail');
  await expect(appStoreHeroLink).toHaveAttribute('target', '_blank');
  await expect(appStoreHeroLink).toHaveAttribute('rel', /noopener/);
  await expect(appStoreHeroLink).toHaveAttribute('rel', /noreferrer/);
  await expect(appStoreHeroLink.locator('img.store-badge__image')).toHaveAttribute('src', /app-store-badge\.svg/);
  const googlePlayHeroLink = recommendation.getByRole('link', { name: '在 Google Play 打开寻径星野', exact: true });
  await expect(googlePlayHeroLink).toBeVisible();
  await expect(googlePlayHeroLink).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=cn.stellartrail');
  await expect(googlePlayHeroLink).toHaveAttribute('target', '_blank');
  await expect(googlePlayHeroLink).toHaveAttribute('rel', /noopener/);
  await expect(googlePlayHeroLink).toHaveAttribute('rel', /noreferrer/);
  await expect(googlePlayHeroLink.locator('img.store-badge__image')).toHaveAttribute('src', /google-play-badge\.svg/);
  await expect(recommendation.getByRole('link', { name: '直接下载 APK', exact: true })).toHaveAttribute('href', '/downloads/stellartrail-android.apk');
  const heroStoreBadgeBoxes = await recommendation.locator('.store-badge-row--hero [data-store-badge]').evaluateAll((badges) =>
    badges.map((badge) => {
      const rect = badge.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    })
  );
  expect(heroStoreBadgeBoxes).toEqual([
    { width: 176, height: 52 },
    { width: 176, height: 52 }
  ]);

  const downloads = page.locator('#mobile-downloads');
  await expect(downloads).not.toContainText('按设备选择入口');
  await expect(downloads.locator('.download-overview')).toHaveCount(0);
  await expect(downloads).toContainText('iPhone 与 Android 手机');
  await expect(downloads).not.toContainText('适合 iPhone 用户直接安装。');
  await expect(downloads).not.toContainText('适合 Android 用户从商店获取。');
  await expect(downloads).not.toContainText('桌面端整理装备和查看公开内容。');
  await expect(downloads).not.toContainText('微信扫码即可打开小程序。');
  await expect(downloads).toContainText('macOS 端');
  await expect(downloads).toContainText('微信小程序入口');
  await expect(downloads.locator('.download-card')).toHaveCount(4);
  await expect(downloads.locator('.download-card--mobile a[data-store-badge="android"]')).toHaveCount(1);
  await expect(downloads.locator('.download-card--mobile a[data-store-badge="ios"]')).toHaveCount(1);
  await expect(downloads.locator('.download-card--mobile [data-apk-download]')).toHaveCount(1);
  await expect(downloads.locator('.download-card--mobile [data-apk-download]')).toHaveAttribute('href', '/downloads/stellartrail-android.apk');
  await expect(downloads.locator('.download-card--mobile [data-apk-download]')).toHaveAttribute('download', 'stellartrail-android.apk');
  await expect(downloads.locator('.download-card--mobile [data-store-badge="appgallery"]')).toHaveCount(1);
  await expect(downloads.locator('.download-card--mobile [data-store-badge="appgallery"]')).toHaveAttribute('aria-disabled', 'true');
  await expect(downloads.locator('.download-card--mobile a[data-store-badge="android"] img.store-badge__image')).toHaveAttribute('src', /google-play-badge\.svg/);
  await expect(downloads.locator('.download-card--mobile a[data-store-badge="ios"] img.store-badge__image')).toHaveAttribute('src', /app-store-badge\.svg/);
  await expect(downloads.locator('.download-card--mobile [data-store-badge="appgallery"] img.store-badge__image')).toHaveAttribute('src', /appgallery-badge\.svg/);
  await expect(downloads.locator('.download-card--mobile [data-store-badge="appgallery"] .store-badge__soon')).toHaveText('即将上线');
  await expect(downloads).not.toContainText('App Store 与 Google Play 可下载；HarmonyOS 敬请期待。');
  const mobileStoreOrder = await downloads.locator('.download-card--mobile [data-store-badge]').evaluateAll((items) =>
    items.map((item) => item.getAttribute('data-store-badge'))
  );
  expect(mobileStoreOrder).toEqual(['ios', 'android', 'appgallery']);
  const mobileStoreBadgeImages = await downloads.locator('.download-card--mobile [data-store-badge] img.store-badge__image').evaluateAll((images) =>
    images.map((image) => {
      const rect = image.getBoundingClientRect();
      return { x: Math.round(rect.x), width: Math.round(rect.width), height: Math.round(rect.height) };
    })
  );
  expect(mobileStoreBadgeImages).toEqual([
    { x: mobileStoreBadgeImages[0].x, width: 190, height: 56 },
    { x: mobileStoreBadgeImages[0].x, width: 190, height: 56 },
    { x: mobileStoreBadgeImages[0].x, width: 190, height: 56 }
  ]);
  await expect(downloads.locator('.download-card--macos a')).toHaveCount(0);
  await expect(downloads.locator('.download-card--macos [data-desktop-download="intel"]')).toBeDisabled();
  await expect(downloads.locator('.download-card--macos [data-desktop-download="intel"]')).toHaveText('Intel 版');
  await expect(downloads.locator('.download-card--macos [data-desktop-download="apple-silicon"]')).toBeDisabled();
  await expect(downloads.locator('.download-card--macos [data-desktop-download="apple-silicon"]')).toHaveText('Apple Silicon 版');
  await expect(downloads.locator('.download-card--wechat a')).toHaveCount(0);
  await expect(downloads.locator('.download-card--wechat .download-action--wechat')).toHaveCount(0);
  await expect(downloads.locator('.download-card--wechat .download-scan-label')).toHaveText('微信扫码打开');
  await expect(downloads.locator('.download-card--wechat .download-scan-label')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(downloads.locator('.download-card--web .download-card__status')).toHaveCount(0);
  await expect(downloads.locator('.download-card--wechat .download-card__status')).toHaveCount(0);
  await expect(downloads).not.toContainText('当前可用');
  await expect(downloads).not.toContainText('功能预览');
  await expect(downloads.locator('.download-card--mobile .download-card__media img')).toHaveAttribute('src', /prototype-mobile-gear\.png/);
  await expect(downloads.locator('.download-card--wechat .download-card__media--qr img')).toHaveAttribute('src', /wechat-miniprogram-code\.png/);
  const webLink = downloads.getByRole('link', { name: '打开 Web 端', exact: true });
  await expect(webLink).toBeVisible();
  await expect(webLink).toHaveAttribute('href', 'https://app.stellartrail.cn/');
  await expect(webLink).toHaveAttribute('target', '_blank');
  await expect(page.locator('body')).not.toContainText('接口文档');
  await expect(page.locator('a[href*="/docs/"]')).toHaveCount(0);
  await expect(downloads).toContainText('手机 App、Web 与微信小程序可从本页进入；macOS 与 HarmonyOS 版本即将上线。');

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/downloads/?lang=en-US');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Choose your device');
  const enNav = page.getByRole('navigation', { name: 'Downloads navigation' });
  await expect(enNav.locator('.nav__links').getByRole('link', { name: 'API Docs', exact: true })).toHaveCount(0);
  await expect(enNav.locator('a[href*="/docs/"]')).toHaveCount(0);
  await expect(enNav.locator('.nav__privacy-link')).toHaveText('Privacy Policy');
  await expect(enNav.locator('.nav__privacy-link')).toHaveAttribute('href', '/privacy/?lang=en-US');
  await expect(page.locator('.footer__privacy-link')).toHaveText('Privacy Policy');
  await expect(page.locator('.footer__privacy-link')).toHaveAttribute('href', '/privacy/?lang=en-US');
  const enRecommendation = page.locator('.downloads-recommendation');
  await expect(enRecommendation.getByRole('link', { name: 'Open StellarTrail in the App Store', exact: true })).toHaveAttribute('href', 'https://apps.apple.com/app/stellartrail');
  await expect(enRecommendation.getByRole('link', { name: 'Open StellarTrail on Google Play', exact: true })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=cn.stellartrail');
  const enDownloads = page.locator('#mobile-downloads');
  await expect(enDownloads.locator('.download-card')).toHaveCount(4);
  await expect(enDownloads).toContainText('iPhone and Android phones');
  await expect(enDownloads).toContainText('macOS app');
  await expect(enDownloads).toContainText('HarmonyOS version coming soon');
  await expect(enDownloads).toContainText('WeChat Mini Program entry');
  await expect(enDownloads.locator('.download-card--mobile [data-store-badge="appgallery"] img.store-badge__image')).toHaveAttribute('src', /appgallery-badge\.svg/);
  await expect(enDownloads.locator('.download-card--mobile [data-store-badge="appgallery"] .store-badge__soon')).toHaveText('Coming soon');
  await expect(enDownloads).not.toContainText('Available on the App Store and Google Play; HarmonyOS is coming soon.');
  await expect(enDownloads.locator('.download-card--macos a')).toHaveCount(0);
  await expect(enDownloads.locator('.download-card--macos [data-desktop-download="intel"]')).toBeDisabled();
  await expect(enDownloads.locator('.download-card--macos [data-desktop-download="intel"]')).toHaveText('Intel build');
  await expect(enDownloads.locator('.download-card--macos [data-desktop-download="apple-silicon"]')).toBeDisabled();
  await expect(enDownloads.locator('.download-card--macos [data-desktop-download="apple-silicon"]')).toHaveText('Apple Silicon build');
  await expect(enDownloads.locator('.download-card--wechat a')).toHaveCount(0);
  await expect(enDownloads.locator('.download-card--wechat .download-action--wechat')).toHaveCount(0);
  await expect(enDownloads.locator('.download-card--wechat .download-scan-label')).toHaveText('Scan with WeChat');
  await expect(enDownloads.locator('.download-card--wechat .download-scan-label')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(enDownloads.locator('.download-card--web .download-card__status')).toHaveCount(0);
  await expect(enDownloads.locator('.download-card--wechat .download-card__status')).toHaveCount(0);
  await expect(enDownloads).not.toContainText('Available now');
  await expect(enDownloads).not.toContainText('Feature preview');
  await expect(enDownloads.locator('.download-card--wechat .download-card__media--qr img')).toHaveAttribute('src', /wechat-miniprogram-code\.png/);
  await expect(page.locator('body')).not.toContainText('API Docs');
  await expect(page.locator('a[href*="/docs/"]')).toHaveCount(0);
});

test('privacy page renders bilingual mobile-prototype policy copy', async ({ page }) => {
  const privacyContactEmail = configuredPrivacyContactEmail();
  const backendRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/healthz' || url.pathname.startsWith('/api/')) backendRequests.push(request.url());
  });

  await page.goto('/privacy/?lang=zh-CN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('隐私政策');
  await expect(page.locator('.privacy-meta')).toContainText('寻径星野/StellarTrail');
  await expect(page.locator('.privacy-meta')).toContainText('2026-06-15');
  if (privacyContactEmail) {
    await expect(page.locator('.privacy-meta').getByRole('link', { name: privacyContactEmail })).toHaveAttribute('href', `mailto:${privacyContactEmail}`);
  } else {
    await expect(page.locator('.privacy-meta')).toContainText('产品内设置或反馈入口');
    await expect(page.locator('.privacy-meta a[href^="mailto:"]')).toHaveCount(0);
  }
  await expect(page.locator('#intro')).toContainText('本隐私政策适用于寻径星野及相关服务');
  await expect(page.locator('#data')).toContainText('资料与户外档案信息');
  await expect(page.locator('#sensitive')).toContainText('身份证号、健康备注、过敏与禁忌');
  await expect(page.locator('#third-party-services')).toContainText('寻径星野可能依赖微信、应用商店、短信或邮箱服务');
  await expect(page.locator('#rights')).toContainText('你可以依法查询、更正、补充、删除你的个人信息');
  await expect(page.locator('#contact')).toContainText(privacyContactEmail || '产品内设置或反馈入口');
  await expect(page).toHaveURL(/\/privacy\/\?lang=zh-CN$/);
  await page.goto('/privacy/?lang=zh-CN#rights');
  await expect(page.locator('#rights')).toBeVisible();
  await expect(page).toHaveURL(/\/privacy\/\?lang=zh-CN#rights$/);

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/privacy/?lang=en-US');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy Policy');
  await expect(page.locator('.privacy-meta')).toContainText('寻径星野/StellarTrail');
  await expect(page.locator('.privacy-meta')).toContainText('2026-06-15');
  if (privacyContactEmail) {
    await expect(page.locator('.privacy-meta').getByRole('link', { name: privacyContactEmail })).toHaveAttribute('href', `mailto:${privacyContactEmail}`);
  } else {
    await expect(page.locator('.privacy-meta')).toContainText('in-product settings or feedback');
    await expect(page.locator('.privacy-meta a[href^="mailto:"]')).toHaveCount(0);
  }
  await expect(page.locator('#intro')).toContainText('This privacy policy applies to StellarTrail and related services');
  await expect(page.locator('#data')).toContainText('Profile and outdoor profile information');
  await expect(page.locator('#sensitive')).toContainText('ID numbers, health notes');
  await expect(page.locator('#third-party-services')).toContainText('StellarTrail may rely on WeChat');
  await expect(page.locator('#rights')).toContainText('request access, correction, completion, deletion');
  expect(backendRequests).toEqual([]);
});

test('privacy page stays static and fits mobile viewport', async ({ page }) => {
  const blocked: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname === '/healthz' || url.pathname.startsWith('/api/')) blocked.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy/?lang=zh-CN');
  await page.waitForLoadState('load');
  expect(blocked).toEqual([]);
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
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

test('product intro page includes all core sections', async ({ page }) => {
  await page.goto('/product/?lang=en-US');
  for (const id of ['ios', 'product', 'gear', 'packing', 'trips', 'skills', 'entry']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('#screenshots')).toHaveCount(0);
});

test('packing trips and skills sections keep copy on the left on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/product/?lang=zh-CN');

  for (const id of ['packing', 'trips', 'skills']) {
    const section = page.locator(`#${id}`);
    const heading = section.getByRole('heading', { level: 2 });
    const phone = section.locator('.feature-panel--phone').first();
    await expect(heading).toBeVisible();
    await expect(phone).toBeVisible();

    const headingBox = await heading.boundingBox();
    const phoneBox = await phone.boundingBox();
    expect(headingBox).not.toBeNull();
    expect(phoneBox).not.toBeNull();
    expect(headingBox!.x).toBeLessThan(phoneBox!.x);
  }

  await expect(page.locator('#packing .packing-screenshot-gallery img')).toHaveCount(2);
  await expect(page.locator('#trips .trips-screenshot-gallery img')).toHaveCount(3);
});

test('feature sections keep copy before their screenshots on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/product/?lang=zh-CN');

  for (const id of ['gear', 'packing', 'trips', 'skills']) {
    const section = page.locator(`#${id}`);
    const heading = section.getByRole('heading', { level: 2 });
    const phone = section.locator('.feature-panel--phone').first();
    await expect(heading).toBeVisible();
    await expect(phone).toBeVisible();
    await expect(section.locator('.task-panel__actions')).toHaveCount(0);
    await expect(section.getByRole('link', { name: '打开 Web 端', exact: true })).toHaveCount(0);
    await expect(section.getByRole('link', { name: '查看移动端入口', exact: true })).toHaveCount(0);

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
  await page.goto('/product/?lang=en-US');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bring pre-departure');
  const animationDurationMs = await page.locator('.float-soft').first().evaluate((element) => {
    const value = window.getComputedStyle(element).animationDuration;
    return value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
  });
  expect(animationDurationMs).toBeLessThanOrEqual(0.002);
  await context.close();
});

test('product intro copy stays user-facing and avoids duplicate screenshot gallery', async ({ page }) => {
  await page.goto('/product/?lang=zh-CN');
  const zhBodyText = await page.locator('body').innerText();
  for (const forbidden of ['官网不依赖后端', '静态方式交付', '部署简单', '后续易维护', '白天模式', '轻量可信', '官网只承诺当前可展示能力', '中英双语', '根据系统语言默认展示', '从当前产品页面', '挑选代表功能', '代表功能', '代表内容', '给你的prompt', 'prompt', '开发文档', '后端接口', 'API Reference']) {
    expect(zhBodyText).not.toContain(forbidden);
  }
  expect(zhBodyText).not.toContain('当前可用');
  expect(zhBodyText).not.toContain('功能预览');
  await expect(page.locator('.status-pill')).toHaveCount(0);

  await expect(page.locator('#screenshots')).toHaveCount(0);
  await expect(page.getByText('重点能力的真实界面示例')).toHaveCount(0);
  await expect(page.getByText('产品截图', { exact: true })).toHaveCount(0);
  await expect(page.getByText('把单人准备和多人协作放到同一个视图里。')).toHaveCount(0);
  await expect(page.locator('#product').getByRole('heading', { name: '户外技能' })).toBeVisible();
  const iosOverview = page.locator('#ios');
  await expect(iosOverview.getByRole('heading', { name: '五个底部入口，覆盖出发前的主要准备动作' })).toBeVisible();
  await expect(iosOverview.locator('img')).toHaveAttribute('src', /ios-home-signed-in-light\.png/);
  for (const entry of ['首页', '装备', '行程', '技能', '我的']) {
    await expect(iosOverview.getByText(entry, { exact: true })).toBeVisible();
  }
  const imageSources = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src') ?? '').join(' '));
  await expect(page.locator('#gear .gear-screenshot-gallery img')).toHaveCount(3);
  await expect(page.locator('#packing .packing-screenshot-gallery img')).toHaveCount(2);
  await expect(page.locator('#trips .trips-screenshot-gallery img')).toHaveCount(3);
  await expect(page.locator('#skills .skills-screenshot-gallery img')).toHaveCount(3);
  const productLinks = page.locator('#product .context-link');
  await expect(productLinks).toHaveCount(4);
  await expect(productLinks).toHaveText(['查看', '查看', '查看', '查看']);
  if ((page.viewportSize()?.width ?? 0) >= 920) {
    const linkBottoms = await productLinks.evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().bottom)));
    expect(new Set(linkBottoms).size).toBe(1);
  }
  const figmaIconNames = await page.locator('[data-icon-source="figma-make-lucide"]').evaluateAll((icons) =>
    icons.map((icon) => icon.getAttribute('data-icon-name'))
  );
  expect(figmaIconNames).toHaveLength(13);
  expect(figmaIconNames).toEqual(expect.arrayContaining(['backpack', 'circle-check-big', 'map', 'book-open', 'shield-check', 'arrow-right']));
  expect(figmaIconNames.filter((name) => name === 'arrow-right')).toHaveLength(4);
  expect(figmaIconNames).not.toContain('globe');
  expect(figmaIconNames).not.toContain('download');
  expect(figmaIconNames).not.toContain('file-text');
  for (const expected of [
    'ios-home-signed-in-light.png',
    'ios-gear-signed-in-light.png',
    'ios-gear-atlas-detail-signed-in-light.png',
    'ios-gear-atlas-signed-in-light.png',
    'ios-packing-signed-in-light.png',
    'ios-packing-detail-signed-in-light.png',
    'ios-trips-signed-in-light.png',
    'ios-trail-library-signed-in-light.png',
    'ios-trip-detail-map-signed-in-light.png',
    'ios-skills-signed-in-light.png',
    'ios-knot-list-signed-in-light.png',
    'ios-knot-detail-signed-in-light.png'
  ]) {
    expect(imageSources).toContain(expected);
  }
  for (const duplicateGalleryAsset of [
    'android-home-22da64a-zh.png',
    'android-gear-library-22da64a-zh.png',
    'android-packing-list-22da64a-zh.png',
    'android-trips-22da64a-zh.png',
    'android-knot-skills-22da64a-zh.png',
    'wechat-gear-management-a1fc941-zh.png',
    'wechat-knot-skills-a1fc941-zh.png',
    'web-gear-management-a1fc941-zh.png',
    'web-gear-form-a1fc941-zh.png'
  ]) {
    expect(imageSources).not.toContain(duplicateGalleryAsset);
  }
  for (const oldMockAsset of ['wechat-gear-management-zh.png', 'wechat-knot-skills-zh.png', 'web-gear-management-zh.png', 'web-gear-form-zh.png', 'wechat-gear-light-zh.png', 'wechat-knots-light-zh.png', 'web-gear-light-zh.png', 'web-skills-light-zh.png']) {
    expect(imageSources).not.toContain(oldMockAsset);
  }

  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/product/?lang=en-US');
  const enBodyText = await page.locator('body').innerText();
  for (const forbidden of ['day mode', 'day-mode', 'official site is fully static', 'asset names', 'final runtime', 'lightweight and honest', 'bilingual by default', 'system language', 'representative product views', 'current pages', 'highlighted skill', 'prompt', 'api reference', 'backend api']) {
    expect(enBodyText.toLowerCase()).not.toContain(forbidden);
  }
  expect(enBodyText).not.toContain('Available now');
  expect(enBodyText).not.toContain('Feature preview');
  expect(enBodyText).not.toContain('Keep solo prep and group coordination in one view.');
  await expect(page.locator('#product').getByRole('heading', { name: 'Outdoor skills' })).toBeVisible();
  const enIosOverview = page.locator('#ios');
  await expect(enIosOverview.getByRole('heading', { name: 'Five bottom entries cover the main preparation actions' })).toBeVisible();
  for (const entry of ['Home', 'Gear', 'Trips', 'Skills', 'Profile']) {
    await expect(enIosOverview.getByText(entry, { exact: true })).toBeVisible();
  }
  const imageAlts = await page.locator('img[alt]').evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? '').join(' '));
  expect(imageAlts.toLowerCase()).not.toContain('day mode');
  expect(imageAlts.toLowerCase()).not.toContain('day-mode');
});

test('gear screenshots open enlarged previews', async ({ page }) => {
  await page.goto('/product/?lang=zh-CN');
  const trigger = page.locator('#gear [data-screenshot-preview]').first();
  await expect(trigger).toBeVisible();
  await expect(page.locator('#gear [data-screenshot-preview]')).toHaveCount(3);
  await trigger.click();

  const lightbox = page.locator('[data-screenshot-lightbox]');
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator('[data-screenshot-lightbox-image]')).toHaveAttribute('src', /ios-gear-signed-in-light\.png/);

  const previewBox = await lightbox.locator('[data-screenshot-lightbox-image]').boundingBox();
  const triggerBox = await trigger.boundingBox();
  expect(previewBox).not.toBeNull();
  expect(triggerBox).not.toBeNull();
  expect(previewBox!.width).toBeGreaterThan(triggerBox!.width);

  await lightbox.locator('[data-screenshot-lightbox-image]').click();
  await expect(lightbox).toBeHidden();

  await trigger.click();
  await expect(lightbox).toBeVisible();
  await lightbox.locator('[data-screenshot-close]').first().click({ position: { x: 8, y: 8 } });
  await expect(lightbox).toBeHidden();

  await trigger.click();
  await expect(lightbox).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
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
