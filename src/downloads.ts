import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/workbench.css';
import './styles/downloads.css';
import './styles/motion.css';

import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale, type Messages } from './i18n';
import { screenshotAssets } from './content/screenshots';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#downloads-app');
if (!app) throw new Error('Missing downloads app root');

const IOS_APP_STORE_URL = 'https://apps.apple.com/app/stellartrail';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=cn.stellartrail';
const ANDROID_APK_PATH = 'downloads/stellartrail-android.apk';
const WEB_APP_URL = 'https://app.stellartrail.cn/';

const channelOrder = ['mobile', 'macos', 'web', 'wechat'] as const;
type DownloadChannelKey = (typeof channelOrder)[number];
type StoreKey = 'ios' | 'android';

type ChannelImage = { src: string; altKey: keyof Messages['screenshots']; wide?: boolean; qr?: boolean };

const channelImages: Partial<Record<DownloadChannelKey, ChannelImage>> = {
  mobile: { src: screenshotAssets.androidGear, altKey: 'androidGearAlt' },
  web: { src: screenshotAssets.webGear, altKey: 'webGearAlt', wide: true },
  wechat: { src: screenshotAssets.wechatMiniProgramCode, altKey: 'wechatMiniProgramCodeAlt', qr: true },
};

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');

const storeLinks = {
  ios: IOS_APP_STORE_URL,
  android: GOOGLE_PLAY_URL
} as const;

const storeBadgeAssets = {
  ios: 'assets/store/app-store-badge.svg',
  android: 'assets/store/google-play-badge.svg'
} as const;

const appGalleryBadgeAsset = 'assets/store/appgallery-badge.svg';

const renderStoreBadge = (store: StoreKey, badge: Messages['downloads']['storeBadges'][StoreKey], modifier = ''): string =>
  `<a class="store-badge store-badge--${store}${modifier ? ` ${modifier}` : ''}" href="${storeLinks[store]}" target="_blank" rel="noopener noreferrer" aria-label="${badge.ariaLabel}" data-store-badge="${store}">
    <img class="store-badge__image" src="${assetPath(storeBadgeAssets[store])}" alt="" aria-hidden="true" />
  </a>`;

const renderAppGalleryBadge = (badge: Messages['downloads']['storeBadges']['appgallery']): string =>
  `<span class="store-badge store-badge--appgallery store-badge--compact store-badge--disabled" aria-label="${badge.ariaLabel}" aria-disabled="true" data-store-badge="appgallery">
    <img class="store-badge__image" src="${assetPath(appGalleryBadgeAsset)}" alt="" aria-hidden="true" />
    <span class="store-badge__soon">${badge.statusLabel}</span>
  </span>`;

const renderApkDownloadLink = (label: string): string =>
  `<a class="apk-download-link" href="${assetPath(ANDROID_APK_PATH)}" download="stellartrail-android.apk" data-apk-download>${label}</a>`;

const renderMacosOptions = (channel: Messages['downloads']['channels']['macos']): string =>
  `<div class="desktop-download-options" aria-label="${channel.action}">
    <button class="desktop-download-option" type="button" disabled data-desktop-download="intel">${channel.options.intel}</button>
    <button class="desktop-download-option" type="button" disabled data-desktop-download="apple-silicon">${channel.options.appleSilicon}</button>
  </div>`;

const renderChannelAction = (m: Messages, key: DownloadChannelKey): string => {
  if (key === 'mobile') {
    return `<div class="mobile-store-stack" aria-label="${m.downloads.channels.mobile.action}">
      ${renderStoreBadge('ios', m.downloads.storeBadges.ios, 'store-badge--compact')}
      ${renderStoreBadge('android', m.downloads.storeBadges.android, 'store-badge--compact')}
      ${renderApkDownloadLink(m.downloads.channels.mobile.apkAction)}
      ${renderAppGalleryBadge(m.downloads.storeBadges.appgallery)}
    </div>`;
  }
  if (key === 'macos') {
    return renderMacosOptions(m.downloads.channels.macos);
  }
  if (key === 'web') {
    return `<a class="download-action" href="${WEB_APP_URL}" target="_blank" rel="noopener noreferrer">${m.downloads.channels.web.action}</a>`;
  }
  return `<span class="download-scan-label">${m.downloads.channels.wechat.action}</span>`;
};

const renderChannel = (m: Messages, key: DownloadChannelKey): string => {
  const channel = m.downloads.channels[key];
  const image = channelImages[key];
  const action = renderChannelAction(m, key);
  const note = 'note' in channel ? channel.note : '';
  const status = 'status' in channel ? channel.status : '';

  return `<article class="download-card download-card--${key}">
    <div class="download-card__content">
      <div class="download-card__meta">
        <span class="download-card__platform">${channel.platform}</span>
        ${status ? `<span class="download-card__status">${status}</span>` : ''}
      </div>
      <h2>${channel.title}</h2>
      <p>${channel.body}</p>
      ${
        key === 'mobile'
          ? `<div class="download-card__mobile-actions">
              ${action}
              ${note ? `<span>${note}</span>` : ''}
            </div>`
          : ''
      }
      <ul class="download-card__bullets">${listItems(channel.bullets)}</ul>
      ${
        key !== 'mobile'
          ? `<div class="download-card__footer">
              ${action}
              <span>${note}</span>
            </div>`
          : ''
      }
    </div>
    ${
      image
        ? `<figure class="download-card__media${image.wide ? ' download-card__media--wide' : ''}${image.qr ? ' download-card__media--qr' : ''}">
            <img src="${assetPath(image.src)}" alt="${m.screenshots[image.altKey]}" />
          </figure>`
        : ''
    }
  </article>`;
};

const renderDownloads = (): void => {
  const m = getMessages(activeLocale);
  const downloads = m.downloads;
  document.title = downloads.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', downloads.seo.description);
  persistLocale(activeLocale);

  app.innerHTML = `
    <div class="downloads-shell">
      <nav class="nav" aria-label="${downloads.nav.label}">
        <div class="container nav__inner">
          <a class="nav__brand" href="${sitePath(`?lang=${activeLocale}`)}" aria-label="${downloads.nav.backHome}">
            <img src="${assetPath('assets/brand/logo.svg')}" alt="" />
            <span class="nav__brand-label nav__brand-label--full">${downloads.nav.brand}</span>
            <span class="nav__brand-label nav__brand-label--short">${m.footer.shortName}</span>
          </a>
          <div class="nav__links">
            <a href="${sitePath(`?lang=${activeLocale}`)}">${downloads.nav.backHome}</a>
            <a class="nav__web-link" href="${WEB_APP_URL}" target="_blank" rel="noopener noreferrer">${downloads.nav.web}</a>
            <a class="nav__privacy-link" href="${sitePath(`privacy/?lang=${activeLocale}`)}">${downloads.nav.privacy}</a>
            <button class="lang-button" type="button" data-language-toggle aria-label="${m.language.switchTo}">${m.language.current}</button>
          </div>
        </div>
      </nav>

      <header class="downloads-hero">
        <div class="container downloads-hero__grid">
          <div>
            <p class="eyebrow">${downloads.hero.eyebrow}</p>
            <h1 class="downloads-hero__title">${downloads.hero.title}</h1>
            <p class="downloads-hero__body">${downloads.hero.body}</p>
            <div class="cta-row">
              <a class="button button--primary" href="#mobile-downloads">${downloads.hero.primaryCta}</a>
              <a class="button button--ghost" href="${WEB_APP_URL}" target="_blank" rel="noopener noreferrer">${downloads.hero.secondaryCta}</a>
            </div>
          </div>
          <aside class="downloads-recommendation" aria-label="${downloads.recommended.label}">
            <span class="download-card__status download-card__status--live">${downloads.recommended.badge}</span>
            <p>${downloads.recommended.body}</p>
            <div class="store-badge-row store-badge-row--hero">
              ${renderStoreBadge('ios', downloads.storeBadges.ios)}
              ${renderStoreBadge('android', downloads.storeBadges.android)}
              ${renderApkDownloadLink(downloads.channels.mobile.apkAction)}
            </div>
            <p class="downloads-disclaimer">${downloads.recommended.note}</p>
          </aside>
        </div>
      </header>

      <main class="container downloads-main" id="mobile-downloads" aria-label="${downloads.channelsLabel}">
        <div class="downloads-section-head">
          <p class="eyebrow">${downloads.catalog.eyebrow}</p>
          <p>${downloads.catalog.body}</p>
        </div>
        <div class="download-grid">
          ${channelOrder.map((key) => renderChannel(m, key)).join('')}
        </div>
        <p class="downloads-note">${downloads.footerNote}</p>
      </main>

      <footer class="footer">
        <div class="container footer__inner">
          <div class="footer__brand">
            <strong>${downloads.nav.brand}</strong>
            <span>${m.footer.caption}</span>
          </div>
          <div class="footer__legal">
            <span>© ${new Date().getFullYear()} ${m.footer.rights}</span>
            <a class="footer__privacy-link" href="${sitePath(`privacy/?lang=${activeLocale}`)}">${m.footer.privacyPolicy}</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    renderDownloads();
  });
};

renderDownloads();
