import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/privacy.css';
import './styles/motion.css';

import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale, type Messages } from './i18n';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#privacy-app');
if (!app) throw new Error('Missing privacy app root');

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');

const renderSections = (sections: Messages['privacy']['sections']): string =>
  sections
    .map(
      (section) => `<section class="privacy-section" id="${section.id}">
        <h2>${section.title}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        ${'bullets' in section ? `<ul>${listItems(section.bullets)}</ul>` : ''}
      </section>`
    )
    .join('');

const renderPrivacy = (): void => {
  const m = getMessages(activeLocale);
  const privacy = m.privacy;
  document.title = privacy.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', privacy.seo.description);
  persistLocale(activeLocale);

  app.innerHTML = `
    <div class="privacy-shell">
      <nav class="nav" aria-label="${privacy.nav.label}">
        <div class="container nav__inner">
          <a class="nav__brand" href="${sitePath(`?lang=${activeLocale}`)}" aria-label="${privacy.nav.backHome}">
            <img src="${assetPath('assets/brand/logo.svg')}" alt="" />
            <span>${privacy.nav.brand}</span>
          </a>
          <div class="nav__links">
            <a href="${sitePath(`?lang=${activeLocale}`)}">${privacy.nav.backHome}</a>
            <a class="nav__downloads-link" href="${sitePath(`downloads/?lang=${activeLocale}`)}">${privacy.nav.downloads}</a>
            <a class="nav__docs-link" href="${sitePath(`docs/?lang=${activeLocale}`)}">${privacy.nav.docs}</a>
            <button class="lang-button" type="button" data-language-toggle aria-label="${m.language.switchTo}">${m.language.current}</button>
          </div>
        </div>
      </nav>

      <header class="privacy-hero">
        <div class="container privacy-hero__grid">
          <div>
            <p class="eyebrow">${privacy.hero.eyebrow}</p>
            <h1 class="privacy-hero__title">${privacy.hero.title}</h1>
            <p class="privacy-hero__body">${privacy.hero.body}</p>
            <dl class="privacy-meta" aria-label="${privacy.meta.label}">
              <div>
                <dt>${privacy.meta.operator}</dt>
                <dd>${privacy.meta.operatorName}</dd>
              </div>
              <div>
                <dt>${privacy.meta.effectiveDate}</dt>
                <dd>${privacy.meta.effectiveDateValue}</dd>
              </div>
              <div>
                <dt>${privacy.meta.contact}</dt>
                <dd><a href="mailto:${privacy.meta.contactEmail}">${privacy.meta.contactEmail}</a></dd>
              </div>
            </dl>
          </div>
          <aside class="privacy-summary" aria-label="${privacy.summary.title}">
            <h2>${privacy.summary.title}</h2>
            <ul>${listItems(privacy.summary.items)}</ul>
          </aside>
        </div>
      </header>

      <main class="container privacy-main">
        ${renderSections(privacy.sections)}
      </main>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    renderPrivacy();
  });
};

renderPrivacy();
