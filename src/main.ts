import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/downloads.css';
import './styles/landing.css';
import './styles/motion.css';

import { deploymentConfig } from './config/deployment';
import { deviceBezelAssets, screenshotAssets } from './content/screenshots';
import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale, type Messages } from './i18n';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing app root');

const ICP_RECORD_URL = 'https://beian.miit.gov.cn/';
const IOS_APP_STORE_URL = 'https://apps.apple.com/app/stellartrail';
const MAC_APP_STORE_URL = 'https://apps.apple.com/app/stellartrail';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=cn.stellartrail';
const ANDROID_APK_PATH = 'downloads/stellartrail-android.apk';
const WEB_APP_URL = 'https://app.stellartrail.cn/';

type StoreKey = 'ios' | 'macos' | 'android';

const storeLinks = {
  ios: IOS_APP_STORE_URL,
  macos: MAC_APP_STORE_URL,
  android: GOOGLE_PLAY_URL
} as const;

const storeBadgeAssets = {
  ios: 'assets/store/app-store-badge.svg',
  macos: 'assets/store/app-store-badge.svg',
  android: 'assets/store/google-play-badge.svg'
} as const;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderIcpRecordLink = (): string => {
  if (!deploymentConfig.icpRecordNumber) return '';
  return `<a class="footer__icp-link" href="${ICP_RECORD_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(deploymentConfig.icpRecordNumber)}</a>`;
};

const renderStoreBadge = (store: StoreKey, badge: Messages['downloads']['storeBadges'][StoreKey]): string =>
  `<a class="store-badge store-badge--${store}" href="${storeLinks[store]}" target="_blank" rel="noopener noreferrer" aria-label="${badge.ariaLabel}" data-store-badge="${store}">
    <img class="store-badge__image" src="${assetPath(storeBadgeAssets[store])}" alt="" aria-hidden="true" />
  </a>`;

const renderSoonStoreBadge = (label: string): string =>
  `<span class="store-badge store-badge--watch store-badge--disabled landing-entry__disabled-badge" aria-label="${label}" aria-disabled="true" data-store-badge="watchos">
    <img class="store-badge__image" src="${assetPath(storeBadgeAssets.ios)}" alt="" aria-hidden="true" />
  </span>`;

const renderDeviceShowcase = (m: Messages): string => `
  <section class="device-showcase" aria-label="${m.home.devices.label}">
    <div class="device-stage" aria-label="${m.home.devices.label}">
      <figure class="device-frame device-frame--mac">
        <div class="device-frame__screen">
          <img src="${assetPath(screenshotAssets.webGear)}" alt="${m.screenshots.webGearAlt}" />
        </div>
        <img class="device-frame__bezel" src="${assetPath(deviceBezelAssets.macbook)}" alt="" aria-hidden="true" />
      </figure>
      <figure class="device-frame device-frame--ipad">
        <div class="device-frame__screen">
          <img src="${assetPath(screenshotAssets.androidTrips)}" alt="${m.screenshots.androidTripsAlt}" />
        </div>
        <img class="device-frame__bezel" src="${assetPath(deviceBezelAssets.ipad)}" alt="" aria-hidden="true" />
      </figure>
      <figure class="device-frame device-frame--phone">
        <div class="device-frame__screen">
          <img src="${assetPath(screenshotAssets.androidGear)}" alt="${m.screenshots.androidGearAlt}" />
        </div>
        <img class="device-frame__bezel" src="${assetPath(deviceBezelAssets.iphone)}" alt="" aria-hidden="true" />
      </figure>
      <figure class="device-frame device-frame--watch">
        <div class="device-frame__screen">
          <div class="watch-face" aria-label="${m.home.devices.watch}">
            <span class="watch-face__brand">${m.home.devices.watchBrand}</span>
            <div class="watch-face__metric">
              <span>${m.home.devices.watchGear}<strong>${m.home.devices.watchGearValue}</strong></span>
              <span>${m.home.devices.watchReady}<strong>${m.home.devices.watchReadyValue}</strong></span>
            </div>
          </div>
        </div>
        <img class="device-frame__bezel" src="${assetPath(deviceBezelAssets.watch)}" alt="" aria-hidden="true" />
      </figure>
    </div>
  </section>`;

const render = (): void => {
  const m = getMessages(activeLocale);
  const icpRecordLink = renderIcpRecordLink();
  document.title = m.home.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.home.seo.description);
  persistLocale(activeLocale);

  app.innerHTML = `
    <div class="landing-shell">
      <nav class="nav" aria-label="${m.nav.language}">
        <div class="container nav__inner">
          <a class="nav__brand" href="${sitePath(`?lang=${activeLocale}`)}" aria-label="${m.footer.tagline}">
            <img src="${assetPath('assets/brand/logo.svg')}" alt="" />
            <span class="nav__brand-label nav__brand-label--full">${m.footer.tagline}</span>
            <span class="nav__brand-label nav__brand-label--short">${m.footer.shortName}</span>
          </a>
          <div class="nav__links">
            <a class="nav__product-link" href="${sitePath(`product/?lang=${activeLocale}`)}">${m.nav.product}</a>
            <a class="nav__web-link" href="${WEB_APP_URL}" target="_blank" rel="noopener noreferrer">${m.nav.web}</a>
            <a class="nav__downloads-link" href="${sitePath(`downloads/?lang=${activeLocale}`)}">${m.nav.downloads}</a>
            <a class="nav__privacy-link" href="${sitePath(`privacy/?lang=${activeLocale}`)}">${m.nav.privacy}</a>
            <button class="lang-button" type="button" data-language-toggle aria-label="${m.language.switchTo}">${m.language.current}</button>
          </div>
        </div>
      </nav>

      <main class="container landing-main" id="top">
        <section class="landing-hero" aria-labelledby="landing-title">
          <img class="landing-hero__logo" src="${assetPath('assets/brand/logo.svg')}" alt="" />
          <h1 class="landing-hero__title" id="landing-title">${m.home.title}</h1>
          <p class="landing-hero__slogan">${m.home.slogan}</p>
          <div class="landing-entry" aria-label="${m.home.entry.label}">
            <section class="landing-entry-card landing-entry-card--mobile" aria-labelledby="landing-entry-mobile-title">
              <h2 id="landing-entry-mobile-title">${m.home.entry.mobileTitle}</h2>
              <div class="landing-entry__stores" aria-label="${m.home.entry.appLabel}">
                ${renderStoreBadge('ios', m.downloads.storeBadges.ios)}
                ${renderStoreBadge('android', m.downloads.storeBadges.android)}
                <a class="landing-entry__apk" href="${assetPath(ANDROID_APK_PATH)}" download="stellartrail-android.apk">${m.home.entry.apk}</a>
              </div>
            </section>
            <section class="landing-entry-card landing-entry-card--desktop" aria-labelledby="landing-entry-desktop-title">
              <h2 id="landing-entry-desktop-title">${m.home.entry.desktopTitle}</h2>
              <div class="landing-entry__stores" aria-label="${m.home.entry.desktopTitle}">
                ${renderStoreBadge('macos', m.downloads.storeBadges.macos)}
                <button class="landing-entry__soon" type="button" disabled>${m.home.entry.windowsSoon}</button>
              </div>
            </section>
            <section class="landing-entry-card landing-entry-card--watch" aria-labelledby="landing-entry-watch-title">
              <h2 id="landing-entry-watch-title">${m.home.entry.watchTitle}</h2>
              <div class="landing-entry__stores" aria-label="${m.home.entry.watchTitle}">
                ${renderSoonStoreBadge(m.home.entry.watchAriaLabel)}
                <button class="landing-entry__soon" type="button" disabled>${m.home.entry.watchSoon}</button>
              </div>
            </section>
            <section class="landing-entry-card landing-entry-card--web" aria-labelledby="landing-entry-web-title">
              <h2 id="landing-entry-web-title">${m.home.entry.webTitle}</h2>
              <a class="landing-entry__web" href="${WEB_APP_URL}" target="_blank" rel="noopener noreferrer">${m.home.entry.web}</a>
            </section>
            <section class="landing-entry-card landing-entry-card--wechat" aria-labelledby="landing-entry-wechat-title">
              <h2 id="landing-entry-wechat-title">${m.home.entry.wechatTitle}</h2>
              <div class="landing-entry__qr">
                <img src="${assetPath(screenshotAssets.wechatMiniProgramCode)}" alt="${m.screenshots.wechatMiniProgramCodeAlt}" />
                <span>${m.home.entry.wechat}</span>
              </div>
            </section>
          </div>
        </section>

        ${renderDeviceShowcase(m)}
      </main>

      <footer class="footer">
        <div class="container footer__inner">
          <div class="footer__brand">
            <strong>${m.footer.tagline}</strong>
            <span>${m.footer.caption}</span>
          </div>
          <div class="footer__legal">
            <span>© ${new Date().getFullYear()} ${m.footer.rights}</span>
            <a class="footer__privacy-link" href="${sitePath(`privacy/?lang=${activeLocale}`)}">${m.footer.privacyPolicy}</a>
            ${icpRecordLink}
          </div>
        </div>
      </footer>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    render();
  });
};

render();
