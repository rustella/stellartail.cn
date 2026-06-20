import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/workbench.css';
import './styles/motion.css';

import { initReveal } from './effects/reveal';
import { initStarfield } from './effects/starfield';
import { deploymentConfig } from './config/deployment';
import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale, type Messages } from './i18n';
import { renderFigmaIcon, type FigmaIconName } from './content/figma-icons';
import { productCapabilities } from './content/product';
import { screenshotAssets } from './content/screenshots';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();
let teardownFloatingBreadcrumb: (() => void) | null = null;
let teardownScreenshotLightbox: (() => void) | null = null;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing app root');

const ICP_RECORD_URL = 'https://beian.miit.gov.cn/';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');

const capabilityIconMap: Record<string, FigmaIconName> = {
  gear: 'backpack',
  packing: 'circle-check-big',
  trips: 'map',
  skills: 'book-open'
};

const capabilityIcon = (id: string): FigmaIconName => capabilityIconMap[id] ?? 'map';

const renderIcpRecordLink = (): string => {
  if (!deploymentConfig.icpRecordNumber) return '';
  return `<a class="footer__icp-link" href="${ICP_RECORD_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(deploymentConfig.icpRecordNumber)}</a>`;
};

const entryHref = (href: string, external: boolean): string => (external ? href : sitePath(`${href}?lang=${activeLocale}`));

const entryLinkAttrs = (href: string, external: boolean): string =>
  external
    ? `href="${entryHref(href, external)}" target="_blank" rel="noopener noreferrer"`
    : `href="${entryHref(href, external)}"`;

const renderEntryAction = (
  channel: Messages['entry']['channels'][number],
  m: Messages
): string => {
  if (!channel.action) return '';
  if ('qr' in channel && channel.qr) {
    const source = assetPath(screenshotAssets.wechatMiniProgramCode);
    const alt = escapeHtml(m.screenshots.wechatMiniProgramCodeAlt);
    return `<button class="entry-platforms__link" type="button" data-screenshot-preview data-screenshot-src="${source}" data-screenshot-alt="${alt}">${channel.action}</button>`;
  }
  if ('href' in channel) {
    return `<a class="entry-platforms__link" ${entryLinkAttrs(channel.href, channel.external)}>${channel.action}</a>`;
  }
  return '';
};

const renderCapabilityCards = (m: Messages): string =>
  productCapabilities
    .map((capability) => {
      const copy = m.product.capabilities[capability.id];
      return `<article class="capability-card workbench-capability">
        <span class="workbench-icon-chip">${renderFigmaIcon(capabilityIcon(capability.id))}</span>
        <h3>${copy.title}</h3>
        <p class="capability-card__subtitle">${copy.subtitle}</p>
        <p>${copy.body}</p>
        <a class="context-link" href="#${capability.sectionId}">
          <span>${m.workbench.learnMore}</span>
          ${renderFigmaIcon('arrow-right')}
        </a>
      </article>`;
    })
    .join('');

const renderCapabilitySections = (m: Messages): string => {
  const sectionCopy = {
    gear: m.gear,
    packing: m.packing,
    trips: m.trips,
    skills: m.skills
  };
  const renderPhonePanel = (src: string, alt: string, extraClass = '', preview = false): string => {
    const source = assetPath(src);
    const image = `<img src="${source}" alt="${escapeHtml(alt)}" />`;
    if (preview) {
      return `<button class="feature-panel feature-panel--phone feature-panel--prototype screenshot-preview-trigger ${extraClass}" type="button" data-reveal data-screenshot-preview data-screenshot-src="${source}" data-screenshot-alt="${escapeHtml(alt)}" aria-label="${m.workbench.openScreenshot}: ${escapeHtml(alt)}">
        ${image}
      </button>`;
    }
    return `<div class="feature-panel feature-panel--phone feature-panel--prototype ${extraClass}" data-reveal>
      ${image}
    </div>`;
  };
  const renderGearScreenshotGallery = (): string => {
    const screenshots = [
      { src: screenshotAssets.androidGear, alt: m.screenshots.androidGearAlt },
      { src: screenshotAssets.androidGearDetail, alt: m.screenshots.androidGearDetailAlt },
      { src: screenshotAssets.androidGearNew, alt: m.screenshots.androidGearNewAlt }
    ];
    return `<div class="gear-screenshot-gallery" aria-label="${m.gear.title}">
      ${screenshots.map((screenshot, index) => renderPhonePanel(screenshot.src, screenshot.alt, `gear-screenshot-gallery__item gear-screenshot-gallery__item--${index + 1}`, true)).join('')}
    </div>`;
  };
  const renderPackingScreenshotGallery = (): string => {
    const screenshots = [
      { src: screenshotAssets.androidPacking, alt: m.screenshots.androidPackingAlt },
      { src: screenshotAssets.androidPackingDetail, alt: m.screenshots.androidPackingDetailAlt }
    ];
    return `<div class="packing-screenshot-gallery" aria-label="${m.packing.title}">
      ${screenshots.map((screenshot, index) => renderPhonePanel(screenshot.src, screenshot.alt, `packing-screenshot-gallery__item packing-screenshot-gallery__item--${index + 1}`, true)).join('')}
    </div>`;
  };
  const renderTripsScreenshotGallery = (): string => {
    const screenshots = [
      { src: screenshotAssets.androidTrips, alt: m.screenshots.androidTripsAlt },
      { src: screenshotAssets.androidTripCreate, alt: m.screenshots.androidTripCreateAlt },
      { src: screenshotAssets.androidTripDetail, alt: m.screenshots.androidTripDetailAlt }
    ];
    return `<div class="trips-screenshot-gallery" aria-label="${m.trips.title}">
      ${screenshots.map((screenshot, index) => renderPhonePanel(screenshot.src, screenshot.alt, `trips-screenshot-gallery__item trips-screenshot-gallery__item--${index + 1}`, true)).join('')}
    </div>`;
  };
  const renderSkillsScreenshotGallery = (): string => {
    const screenshots = [
      { src: screenshotAssets.androidSkills, alt: m.screenshots.androidSkillsAlt },
      { src: screenshotAssets.androidKnotList, alt: m.screenshots.androidKnotListAlt },
      { src: screenshotAssets.androidKnotDetail, alt: m.screenshots.androidKnotDetailAlt }
    ];
    return `<div class="skills-screenshot-gallery" aria-label="${m.skills.title}">
      ${screenshots.map((screenshot, index) => renderPhonePanel(screenshot.src, screenshot.alt, `skills-screenshot-gallery__item skills-screenshot-gallery__item--${index + 1}`, true)).join('')}
    </div>`;
  };

  return productCapabilities
    .map((capability) => {
      const copy = sectionCopy[capability.id];
      const panelClasses = [
        'container',
        'task-panel',
        capability.id === 'gear' || capability.id === 'trips' || capability.id === 'skills' ? 'task-panel--gallery' : '',
        capability.id === 'packing' ? 'task-panel--packing-gallery' : ''
      ]
        .filter(Boolean)
        .join(' ');
      const text = `<div data-reveal>
        <p class="eyebrow">${copy.eyebrow}</p>
        <h2 class="section__title">${copy.title}</h2>
        <p class="section__body">${copy.body}</p>
        <ul class="bullet-list">${listItems(copy.bullets)}</ul>
      </div>`;
      const media = (() => {
        switch (capability.id) {
          case 'gear':
            return renderGearScreenshotGallery();
          case 'packing':
            return renderPackingScreenshotGallery();
          case 'trips':
            return renderTripsScreenshotGallery();
          case 'skills':
            return renderSkillsScreenshotGallery();
        }
      })();

      return `<section class="section capability-section workbench-task-section" id="${capability.sectionId}">
        <div class="${panelClasses}">
          ${text}
          ${media}
        </div>
      </section>`;
    })
    .join('');
};

const initFloatingBreadcrumb = (): (() => void) | null => {
  const breadcrumb = app.querySelector<HTMLElement>('[data-floating-breadcrumb]');
  const trigger = breadcrumb?.querySelector<HTMLButtonElement>('[data-breadcrumb-toggle]');
  if (!breadcrumb || !trigger) return null;

  const setPinned = (pinned: boolean): void => {
    breadcrumb.dataset.pinned = pinned ? 'true' : 'false';
    trigger.setAttribute('aria-expanded', String(pinned));
  };
  const togglePinned = (): void => setPinned(breadcrumb.dataset.pinned !== 'true');
  const closeOnEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') setPinned(false);
  };

  setPinned(false);
  trigger.addEventListener('click', togglePinned);
  document.addEventListener('keydown', closeOnEscape);

  return () => {
    trigger.removeEventListener('click', togglePinned);
    document.removeEventListener('keydown', closeOnEscape);
  };
};

const initScreenshotLightbox = (): (() => void) | null => {
  const lightbox = app.querySelector<HTMLElement>('[data-screenshot-lightbox]');
  const image = lightbox?.querySelector<HTMLImageElement>('[data-screenshot-lightbox-image]');
  const closeButtons = lightbox ? [...lightbox.querySelectorAll<HTMLButtonElement>('[data-screenshot-close]')] : [];
  const triggers = [...app.querySelectorAll<HTMLButtonElement>('[data-screenshot-preview]')];
  if (!lightbox || !image || triggers.length === 0) return null;

  let previousActiveElement: HTMLElement | null = null;
  let previousBodyOverflow = '';

  const close = (): void => {
    lightbox.hidden = true;
    image.removeAttribute('src');
    image.alt = '';
    document.body.style.overflow = previousBodyOverflow;
    previousActiveElement?.focus();
    previousActiveElement = null;
  };

  const open = (trigger: HTMLButtonElement): void => {
    const src = trigger.dataset.screenshotSrc;
    const alt = trigger.dataset.screenshotAlt ?? '';
    if (!src) return;
    previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousBodyOverflow = document.body.style.overflow;
    image.src = src;
    image.alt = alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButtons[0]?.focus();
  };

  const onTriggerClick = (event: Event): void => {
    open(event.currentTarget as HTMLButtonElement);
  };
  const onCloseClick = (): void => close();
  const onImageClick = (): void => close();
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && !lightbox.hidden) close();
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', onTriggerClick));
  closeButtons.forEach((button) => button.addEventListener('click', onCloseClick));
  image.addEventListener('click', onImageClick);
  document.addEventListener('keydown', onKeydown);

  return () => {
    triggers.forEach((trigger) => trigger.removeEventListener('click', onTriggerClick));
    closeButtons.forEach((button) => button.removeEventListener('click', onCloseClick));
    image.removeEventListener('click', onImageClick);
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = previousBodyOverflow;
  };
};

const render = (): void => {
  teardownFloatingBreadcrumb?.();
  teardownFloatingBreadcrumb = null;
  teardownScreenshotLightbox?.();
  teardownScreenshotLightbox = null;
  const m = getMessages(activeLocale);
  const jumpLinks = [
    { label: m.jump.home, href: '#top' },
    { label: m.nav.product, href: '#product' },
    { label: m.nav.gear, href: '#gear' },
    { label: m.nav.packing, href: '#packing' },
    { label: m.nav.trips, href: '#trips' },
    { label: m.nav.skills, href: '#skills' },
    { label: m.nav.entry, href: '#entry' }
  ];
  const capabilityCards = renderCapabilityCards(m);
  const capabilitySections = renderCapabilitySections(m);
  const icpRecordLink = renderIcpRecordLink();
  document.title = m.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.seo.description);
  persistLocale(activeLocale);
  app.innerHTML = `
    <div class="site-shell">
      <nav class="nav" aria-label="${m.nav.language}">
        <div class="container nav__inner">
          <a class="nav__brand" href="${sitePath(`?lang=${activeLocale}`)}" aria-label="${m.jump.home}">
            <img src="${assetPath('assets/brand/logo.svg')}" alt="" />
            <span class="nav__brand-label nav__brand-label--full">${m.footer.tagline}</span>
            <span class="nav__brand-label nav__brand-label--short">${m.footer.shortName}</span>
          </a>
          <div class="nav__links">
            <a class="nav__web-link" href="https://app.stellartrail.cn/" target="_blank" rel="noopener noreferrer">${m.nav.web}</a>
            <a class="nav__downloads-link" href="${sitePath(`downloads/?lang=${activeLocale}`)}">${m.nav.downloads}</a>
            <a class="nav__privacy-link" href="${sitePath(`privacy/?lang=${activeLocale}`)}">${m.nav.privacy}</a>
            <button class="lang-button" type="button" data-language-toggle aria-label="${m.language.switchTo}">${m.language.current}</button>
          </div>
        </div>
      </nav>

      <nav class="floating-breadcrumb" aria-label="${m.jump.label}" data-floating-breadcrumb data-pinned="false">
        <button class="floating-breadcrumb__trigger" type="button" aria-label="${m.jump.trigger}" aria-haspopup="true" aria-expanded="false" aria-controls="floating-breadcrumb-panel" data-breadcrumb-toggle>
          <span class="floating-breadcrumb__icon" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
        <div class="floating-breadcrumb__panel" id="floating-breadcrumb-panel">
          <span class="floating-breadcrumb__title">${m.jump.title}</span>
          <ol>
            ${jumpLinks.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
          </ol>
        </div>
      </nav>

      <header class="hero" id="top">
        <canvas class="hero__canvas" data-starfield aria-hidden="true"></canvas>
        <div class="container hero__grid hero__grid--workbench">
          <div class="hero__copy" data-reveal>
            <p class="eyebrow">${m.hero.eyebrow}</p>
            <h1 class="hero__title">${m.hero.title}</h1>
            <p class="hero__subtitle">${m.hero.subtitle}</p>
            <div class="cta-row">
              <a class="button button--primary" href="https://app.stellartrail.cn/" target="_blank" rel="noopener noreferrer">${m.hero.secondaryCta}</a>
              <a class="button button--quiet" href="${sitePath(`downloads/?lang=${activeLocale}`)}">${m.hero.primaryCta}</a>
            </div>
          </div>
          <aside class="hero-phone-stage float-soft" data-reveal aria-label="${m.hero.title}">
            <div class="iphone-device iphone-device--17-pro-max" data-device-model="iPhone 17 Pro Max" aria-hidden="true">
              <span class="iphone-device__button iphone-device__button--mute"></span>
              <span class="iphone-device__button iphone-device__button--volume-up"></span>
              <span class="iphone-device__button iphone-device__button--volume-down"></span>
              <span class="iphone-device__button iphone-device__button--power"></span>
              <span class="iphone-device__button iphone-device__button--camera-control"></span>
              <div class="iphone-device__screen">
                <span class="iphone-device__status-mask"></span>
                <span class="iphone-device__status-bar">
                  <span class="iphone-device__status-time">9:41</span>
                  <span class="iphone-device__status-icons">
                    <svg class="iphone-device__status-icon iphone-device__status-icon--cellular" viewBox="0 0 20 13" aria-hidden="true" focusable="false">
                      <rect x="1" y="8" width="3" height="4" rx="1.1"></rect>
                      <rect x="6" y="6" width="3" height="6" rx="1.1"></rect>
                      <rect x="11" y="3" width="3" height="9" rx="1.1"></rect>
                      <rect x="16" y="1" width="3" height="11" rx="1.1"></rect>
                    </svg>
                    <svg class="iphone-device__status-icon iphone-device__status-icon--wifi" viewBox="0 0 18 13" aria-hidden="true" focusable="false">
                      <path d="M2.1 4.9C6 1.7 12 1.7 15.9 4.9"></path>
                      <path d="M5 7.5c2.3-1.9 5.7-1.9 8 0"></path>
                      <path d="M7.7 10.2c.8-.7 1.8-.7 2.6 0"></path>
                    </svg>
                    <svg class="iphone-device__status-icon iphone-device__status-icon--battery" viewBox="0 0 27 13" aria-hidden="true" focusable="false">
                      <rect x="1" y="2.2" width="21.7" height="8.6" rx="2.6"></rect>
                      <path d="M24.6 5v3"></path>
                      <rect class="iphone-device__battery-fill" x="3.2" y="4.2" width="16.4" height="4.6" rx="1.4"></rect>
                    </svg>
                  </span>
                </span>
                <span class="iphone-device__island"></span>
                <img src="${assetPath(screenshotAssets.androidGear)}" alt="" />
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main>
        <section class="section section--tight" id="product">
          <div class="container" data-reveal>
            <p class="eyebrow">${m.product.eyebrow}</p>
            <h2 class="section__title">${m.product.title}</h2>
            <p class="section__body">${m.product.body}</p>
            <div class="cards-grid cards-grid--capabilities">
              ${capabilityCards}
            </div>
          </div>
        </section>

        ${capabilitySections}

        <section class="section" id="entry">
          <div class="container" data-reveal>
            <div class="entry-card">
              <div>
                <span class="entry-badge">${m.entry.badge}</span>
                <p class="eyebrow">${m.entry.eyebrow}</p>
                <h2 class="section__title">${m.entry.title}</h2>
                <p class="section__body">${m.entry.body}</p>
                <ul class="entry-platforms" aria-label="${m.entry.channelsLabel}">
                  ${m.entry.channels
                    .map(
                      (channel) => `<li>
                        <strong>${channel.title}</strong>
                        <span>${channel.body}</span>
                        ${renderEntryAction(channel, m)}
                      </li>`
                    )
                    .join('')}
                </ul>
                <p>${m.entry.hint}</p>
              </div>
            </div>
          </div>
        </section>
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

      <div class="screenshot-lightbox" data-screenshot-lightbox hidden role="dialog" aria-modal="true" aria-label="${m.workbench.screenshotPreview}">
        <button class="screenshot-lightbox__backdrop" type="button" data-screenshot-close aria-label="${m.workbench.closeScreenshot}"></button>
        <div class="screenshot-lightbox__frame">
          <button class="screenshot-lightbox__close" type="button" data-screenshot-close aria-label="${m.workbench.closeScreenshot}"></button>
          <img data-screenshot-lightbox-image alt="" />
        </div>
      </div>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    render();
  });
  teardownFloatingBreadcrumb = initFloatingBreadcrumb();
  teardownScreenshotLightbox = initScreenshotLightbox();
  initReveal();
  initStarfield();
};

render();
