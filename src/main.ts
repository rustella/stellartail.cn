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

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing app root');

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');
const render = (): void => {
  const m = getMessages(activeLocale);
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
            <a href="#product">${m.nav.product}</a>
            <a href="#gear">${m.nav.gear}</a>
            <a href="#skills">${m.nav.skills}</a>
            <a href="#screenshots">${m.nav.screenshots}</a>
            <a href="#entry">${m.nav.entry}</a>
            <a class="nav__docs-link" href="${sitePath(`docs/?lang=${activeLocale}`)}">${m.nav.docs}</a>
            <button class="lang-button" type="button" data-language-toggle aria-label="${m.language.switchTo}">${m.language.current}</button>
          </div>
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
              <div class="metric"><strong>04</strong><span>${m.hero.statMode}</span></div>
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
  initReveal();
  initStarfield();
};

render();
