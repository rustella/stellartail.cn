import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/docs.css';

import { apiDocs, type ApiDocEndpointSummaryKey } from './content/api-docs';
import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale } from './i18n';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#docs-app');
if (!app) throw new Error('Missing docs app root');

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const codeJson = (value: unknown): string => escapeHtml(JSON.stringify(value, null, 2));

const renderEndpoint = (summaryLabels: Record<ApiDocEndpointSummaryKey, string>, responseLabel: string): string =>
  apiDocs.endpoints
    .map(
      (endpoint) => `
        <article class="endpoint-card">
          <div class="endpoint-card__head">
            <h2>${escapeHtml(summaryLabels[endpoint.summaryKey])}</h2>
            <code class="endpoint-card__request"><span class="method-badge">${endpoint.method}</span> <span class="path-badge">${endpoint.path}</span></code>
          </div>
          <p>${responseLabel}: ${endpoint.response.status}</p>
          <pre class="code-block"><code>${codeJson(endpoint.response.body)}</code></pre>
        </article>`
    )
    .join('');

const renderDocs = (): void => {
  const m = getMessages(activeLocale);
  const docs = m.docs;
  document.title = docs.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', docs.seo.description);
  persistLocale(activeLocale);

  app.innerHTML = `
    <div class="docs-shell">
      <nav class="nav" aria-label="${docs.nav.label}">
        <div class="container nav__inner">
          <a class="nav__brand" href="${sitePath()}" aria-label="${docs.nav.backHome}">
            <img src="${assetPath('assets/brand/logo.svg')}" alt="" />
            <span>${docs.nav.brand}</span>
          </a>
          <div class="nav__links">
            <a href="${sitePath()}">${docs.nav.backHome}</a>
            <a href="#endpoints">${docs.sections.endpoints.title}</a>
            <a href="#errors">${docs.sections.errors.title}</a>
            <button class="lang-button" type="button" data-language-toggle aria-label="${m.language.switchTo}">${m.language.current}</button>
          </div>
        </div>
      </nav>

      <header class="docs-hero">
        <div class="container docs-hero__grid">
          <div>
            <p class="eyebrow">${docs.hero.eyebrow}</p>
            <h1 class="docs-hero__title">${docs.hero.title}</h1>
            <p class="docs-hero__body">${docs.hero.body}</p>
          </div>
          <aside class="docs-status-card" aria-label="${docs.source.title}">
            <dl>
              <div><dt>${docs.source.repository}</dt><dd>${apiDocs.source.productRepository}</dd></div>
              <div><dt>${docs.source.inspectedHead}</dt><dd>${apiDocs.source.inspectedHead}</dd></div>
              <div><dt>${docs.source.inspectedAt}</dt><dd>${apiDocs.source.inspectedAt}</dd></div>
            </dl>
          </aside>
        </div>
      </header>

      <div class="container docs-layout">
        <aside class="docs-toc" aria-label="${docs.toc.label}">
          <a href="#overview">${docs.sections.overview.title}</a>
          <a href="#auth">${docs.sections.authentication.title}</a>
          <a href="#endpoints">${docs.sections.endpoints.title}</a>
          <a href="#errors">${docs.sections.errors.title}</a>
          <a href="#config">${docs.sections.config.title}</a>
        </aside>
        <main class="docs-main">
          <section class="docs-section" id="overview">
            <h2>${docs.sections.overview.title}</h2>
            <p>${docs.sections.overview.body}</p>
            <div class="docs-note">${docs.sections.overview.note}</div>
          </section>

          <section class="docs-section" id="auth">
            <h2>${docs.sections.authentication.title}</h2>
            <p>${docs.sections.authentication.body}</p>
          </section>

          <section class="endpoint-list" id="endpoints" aria-label="${docs.sections.endpoints.title}">
            ${renderEndpoint(docs.endpointSummaries, docs.labels.responseStatus)}
          </section>

          <section class="docs-section" id="errors">
            <h2>${docs.sections.errors.title}</h2>
            <p>${docs.sections.errors.body}</p>
            <pre class="code-block"><code>${codeJson(apiDocs.errors[0].body)}</code></pre>
          </section>

          <section class="docs-section" id="config">
            <h2>${docs.sections.config.title}</h2>
            <p>${docs.sections.config.body}</p>
          </section>
        </main>
      </div>
    </div>
  `;

  app.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
    activeLocale = nextLocale(activeLocale);
    renderDocs();
  });
};

renderDocs();
