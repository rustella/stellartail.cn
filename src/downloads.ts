import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/downloads.css';
import './styles/motion.css';

import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale, type Messages } from './i18n';
import { screenshotAssets } from './content/screenshots';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#downloads-app');
if (!app) throw new Error('Missing downloads app root');

const channelOrder = ['android', 'wechat', 'web'] as const;
type DownloadChannelKey = (typeof channelOrder)[number];

const channelImages: Record<DownloadChannelKey, { src: string; altKey: keyof Messages['screenshots']; wide?: boolean }> = {
  android: { src: screenshotAssets.androidGear, altKey: 'androidGearAlt' },
  wechat: { src: screenshotAssets.wechatGear, altKey: 'wechatGearAlt' },
  web: { src: screenshotAssets.webGear, altKey: 'webGearAlt', wide: true }
};

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');

const renderChannel = (m: Messages, key: DownloadChannelKey): string => {
  const channel = m.downloads.channels[key];
  const image = channelImages[key];
  const action =
    key === 'web'
      ? `<a class="download-action" href="https://app.stellartrail.cn/" target="_blank" rel="noopener noreferrer">${channel.action}</a>`
      : `<span class="download-action download-action--disabled">${channel.action}</span>`;

  return `<article class="download-card download-card--${key}">
    <div class="download-card__content">
      <span class="download-card__platform">${channel.platform}</span>
      <span class="download-card__status">${channel.status}</span>
      <h2>${channel.title}</h2>
      <p>${channel.body}</p>
      <ul class="download-card__bullets">${listItems(channel.bullets)}</ul>
      <div class="download-card__footer">
        ${action}
        <span>${channel.note}</span>
      </div>
    </div>
    <figure class="download-card__media${image.wide ? ' download-card__media--wide' : ''}">
      <img src="${assetPath(image.src)}" alt="${m.screenshots[image.altKey]}" />
    </figure>
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
            <span>${downloads.nav.brand}</span>
          </a>
          <div class="nav__links">
            <a href="${sitePath(`?lang=${activeLocale}`)}">${downloads.nav.backHome}</a>
            <a class="nav__web-link" href="https://app.stellartrail.cn/" target="_blank" rel="noopener noreferrer">${downloads.nav.web}</a>
            <a class="nav__docs-link" href="${sitePath(`docs/?lang=${activeLocale}`)}">${downloads.nav.docs}</a>
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
              <a class="button button--ghost" href="https://app.stellartrail.cn/" target="_blank" rel="noopener noreferrer">${downloads.hero.secondaryCta}</a>
            </div>
          </div>
          <aside class="downloads-status" aria-label="${downloads.summary.title}">
            <h2>${downloads.summary.title}</h2>
            <ul>
              ${downloads.summary.items.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </aside>
        </div>
      </header>

      <main class="container downloads-main" id="mobile-downloads" aria-label="${downloads.channelsLabel}">
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
