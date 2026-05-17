import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/motion.css';

import { initReveal } from './effects/reveal';
import { initStarfield } from './effects/starfield';
import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale } from './i18n';
import { screenshotAssets } from './content/screenshots';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();
let teardownFloatingBreadcrumb: (() => void) | null = null;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing app root');

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');

const initFloatingBreadcrumb = (): (() => void) | null => {
  const breadcrumb = app.querySelector<HTMLElement>('[data-floating-breadcrumb]');
  const trigger = breadcrumb?.querySelector<HTMLButtonElement>('[data-breadcrumb-toggle]');
  if (!breadcrumb || !trigger) return null;

  const setPinned = (pinned: boolean): void => {
    breadcrumb.dataset.pinned = pinned ? 'true' : 'false';
    trigger.setAttribute('aria-expanded', String(pinned));
  };
  const togglePinned = (): void => setPinned(breadcrumb.dataset.pinned !== 'true');
  const closeIfOutside = (event: MouseEvent): void => {
    if (event.target instanceof Node && !breadcrumb.contains(event.target)) setPinned(false);
  };
  const closeOnEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') setPinned(false);
  };

  setPinned(false);
  trigger.addEventListener('click', togglePinned);
  document.addEventListener('click', closeIfOutside);
  document.addEventListener('keydown', closeOnEscape);

  return () => {
    trigger.removeEventListener('click', togglePinned);
    document.removeEventListener('click', closeIfOutside);
    document.removeEventListener('keydown', closeOnEscape);
  };
};

const render = (): void => {
  teardownFloatingBreadcrumb?.();
  teardownFloatingBreadcrumb = null;
  const m = getMessages(activeLocale);
  const jumpLinks = [
    { label: m.jump.home, href: '#top' },
    { label: m.nav.product, href: '#product' },
    { label: m.nav.gear, href: '#gear' },
    { label: m.nav.skills, href: '#skills' },
    { label: m.nav.screenshots, href: '#screenshots' },
    { label: m.nav.entry, href: '#entry' }
  ];
  document.title = m.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.seo.description);
  persistLocale(activeLocale);
  app.innerHTML = `
    <div class="site-shell">
      <nav class="nav" aria-label="${m.nav.language}">
        <div class="container nav__inner">
          <a class="nav__brand" href="#top" aria-label="${m.footer.tagline}">
            <img src="${assetPath('assets/brand/logo.svg')}" alt="" />
            <span>${m.footer.tagline}</span>
          </a>
          <div class="nav__links">
            <a class="nav__web-link" href="https://app.stellartrail.cn/" target="_blank" rel="noopener noreferrer">${m.nav.web}</a>
            <a class="nav__docs-link" href="${sitePath(`docs/?lang=${activeLocale}`)}">${m.nav.docs}</a>
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
        <div class="container hero__grid">
          <div data-reveal>
            <p class="eyebrow">${m.hero.eyebrow}</p>
            <h1 class="hero__title">${m.hero.title}</h1>
            <p class="hero__subtitle">${m.hero.subtitle}</p>
            <div class="cta-row">
              <a class="button button--primary" href="#entry">${m.hero.primaryCta}</a>
              <a class="button button--ghost" href="#product">${m.hero.secondaryCta}</a>
            </div>
            <span class="hero-note">${m.hero.note}</span>
            <ul class="platform-list" aria-label="${m.hero.platformLabel}">
              ${m.hero.platforms.map((platform) => `<li>${platform}</li>`).join('')}
            </ul>
          </div>
          <div class="hero-card float-soft" data-reveal>
            <div class="phone-mock" aria-hidden="true">
              <div class="phone-mock__screen">
                <img src="${assetPath(screenshotAssets.wechatGear)}" alt="" />
              </div>
            </div>
            <div class="metric-row">
              <div class="metric"><strong>01</strong><span>${m.hero.statGear}</span></div>
              <div class="metric"><strong>01</strong><span>${m.hero.statSkill}</span></div>
              <div class="metric"><strong>03</strong><span>${m.hero.statMode}</span></div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section class="section section--tight" id="product">
          <div class="container" data-reveal>
            <p class="eyebrow">${m.product.eyebrow}</p>
            <h2 class="section__title">${m.product.title}</h2>
            <p class="section__body">${m.product.body}</p>
            <div class="cards-grid">
              <article class="card"><h3>${m.product.cards.fast.title}</h3><p>${m.product.cards.fast.body}</p></article>
              <article class="card"><h3>${m.product.cards.bilingual.title}</h3><p>${m.product.cards.bilingual.body}</p></article>
              <article class="card"><h3>${m.product.cards.polished.title}</h3><p>${m.product.cards.polished.body}</p></article>
            </div>
          </div>
        </section>

        <section class="section" id="gear">
          <div class="container two-column">
            <div data-reveal>
              <p class="eyebrow">${m.gear.eyebrow}</p>
              <h2 class="section__title">${m.gear.title}</h2>
              <p class="section__body">${m.gear.body}</p>
              <ul class="bullet-list">${listItems(m.gear.bullets)}</ul>
            </div>
            <div class="feature-panel float-soft" data-reveal>
              <img src="${assetPath(screenshotAssets.webGear)}" alt="${m.screenshots.webGearAlt}" />
            </div>
          </div>
        </section>

        <section class="section" id="skills">
          <div class="container two-column">
            <div class="feature-panel float-soft" data-reveal>
              <img src="${assetPath(screenshotAssets.wechatKnots)}" alt="${m.screenshots.wechatKnotsAlt}" />
            </div>
            <div data-reveal>
              <p class="eyebrow">${m.skills.eyebrow}</p>
              <h2 class="section__title">${m.skills.title}</h2>
              <p class="section__body">${m.skills.body}</p>
              <ul class="bullet-list">${listItems(m.skills.bullets)}</ul>
            </div>
          </div>
        </section>

        <section class="section" id="screenshots">
          <div class="container" data-reveal>
            <p class="eyebrow">${m.screenshots.eyebrow}</p>
            <h2 class="section__title">${m.screenshots.title}</h2>
            <p class="section__body">${m.screenshots.body}</p>
            <div class="screenshot-groups">
              <article class="screenshot-group">
                <div class="screenshot-group__heading">
                  <h3>${m.screenshots.wechatTitle}</h3>
                  <p>${m.screenshots.wechatBody}</p>
                </div>
                <div class="screenshot-grid screenshot-grid--mobile">
                  <figure class="screenshot-card"><img src="${assetPath(screenshotAssets.wechatGear)}" alt="${m.screenshots.wechatGearAlt}" /></figure>
                  <figure class="screenshot-card"><img src="${assetPath(screenshotAssets.wechatKnots)}" alt="${m.screenshots.wechatKnotsAlt}" /></figure>
                </div>
              </article>
              <article class="screenshot-group">
                <div class="screenshot-group__heading">
                  <h3>${m.screenshots.webTitle}</h3>
                  <p>${m.screenshots.webBody}</p>
                </div>
                <div class="screenshot-grid screenshot-grid--web">
                  <figure class="screenshot-card screenshot-card--wide"><img src="${assetPath(screenshotAssets.webGear)}" alt="${m.screenshots.webGearAlt}" /></figure>
                  <figure class="screenshot-card screenshot-card--wide"><img src="${assetPath(screenshotAssets.webGearForm)}" alt="${m.screenshots.webGearFormAlt}" /></figure>
                </div>
              </article>
            </div>
          </div>
        </section>

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
                        ${channel.href && channel.action ? `<a class="entry-platforms__link" href="${channel.href}" target="_blank" rel="noopener noreferrer">${channel.action}</a>` : ''}
                      </li>`
                    )
                    .join('')}
                </ul>
                <p>${m.entry.hint}</p>
              </div>
              <img class="entry-placeholder" src="${assetPath('assets/entry/miniprogram-placeholder.png')}" alt="${m.entry.title}" />
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="container footer__inner">
          <strong>${m.footer.tagline}</strong>
          <span>${m.footer.caption} · © ${new Date().getFullYear()} ${m.footer.rights}</span>
        </div>
      </footer>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    render();
  });
  teardownFloatingBreadcrumb = initFloatingBreadcrumb();
  initReveal();
  initStarfield();
};

render();
