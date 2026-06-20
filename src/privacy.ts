import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/privacy.css';
import './styles/workbench.css';
import './styles/motion.css';

import { deploymentConfig } from './config/deployment';
import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale, type Messages } from './i18n';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#privacy-app');
if (!app) throw new Error('Missing privacy app root');

const CONTACT_EMAIL_TOKEN = '{privacyContactEmail}';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const listItems = (items: readonly string[]): string => items.map((item) => `<li>${item}</li>`).join('');

const contactEmail = deploymentConfig.privacyContactEmail;

const renderContactEmail = (fallback: string): string => {
  if (!contactEmail) return escapeHtml(fallback);
  const safeEmail = escapeHtml(contactEmail);
  return `<a href="mailto:${safeEmail}">${safeEmail}</a>`;
};

const renderPrivacyText = (value: string, fallback: string): string =>
  escapeHtml(value).replaceAll(CONTACT_EMAIL_TOKEN, renderContactEmail(fallback));

const renderSections = (sections: Messages['privacy']['sections'], contactFallback: string): string =>
  sections
    .map((section) => {
      const bullets = 'bullets' in section && Array.isArray(section.bullets) ? section.bullets : [];
      return `<section class="privacy-section" id="${section.id}">
        <h2>${escapeHtml(section.title)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${renderPrivacyText(paragraph, contactFallback)}</p>`).join('')}
        ${bullets.length ? `<ul>${listItems(bullets.map((bullet) => renderPrivacyText(bullet, contactFallback)))}</ul>` : ''}
      </section>`;
    })
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
            <span class="nav__brand-label nav__brand-label--full">${privacy.nav.brand}</span>
            <span class="nav__brand-label nav__brand-label--short">${m.footer.shortName}</span>
          </a>
          <div class="nav__links">
            <a href="${sitePath(`?lang=${activeLocale}`)}">${privacy.nav.backHome}</a>
            <a class="nav__downloads-link" href="${sitePath(`downloads/?lang=${activeLocale}`)}">${privacy.nav.downloads}</a>
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
                <dd>${renderContactEmail(privacy.meta.contactFallback)}</dd>
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
        ${renderSections(privacy.sections, privacy.meta.contactFallback)}
      </main>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    renderPrivacy();
  });
};

renderPrivacy();
