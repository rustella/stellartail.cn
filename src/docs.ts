import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/docs.css';

import {
  apiDocs,
  type ApiDocEndpoint,
  type ApiDocEndpointGroupKey,
  type ApiDocEndpointId
} from './content/api-docs';
import { getMessages, nextLocale, persistLocale, resolveInitialLocale, type Locale } from './i18n';
import { assetPath, sitePath } from './utils/asset';

let activeLocale: Locale = resolveInitialLocale();

const app = document.querySelector<HTMLDivElement>('#docs-app');
if (!app) throw new Error('Missing docs app root');

const endpointById = new Map<string, ApiDocEndpoint>(apiDocs.endpoints.map((endpoint) => [endpoint.id, endpoint]));

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const codeValue = (value: unknown): string => {
  if (typeof value === 'string') return escapeHtml(value);
  return escapeHtml(JSON.stringify(value, null, 2));
};

const renderCodeBlock = (value: unknown): string => `<pre class="code-block"><code>${codeValue(value)}</code></pre>`;

const renderList = (items?: readonly string[]): string => {
  if (!items?.length) return '';
  return `<ul class="endpoint-card__list">${items.map((item) => `<li><code>${escapeHtml(item)}</code></li>`).join('')}</ul>`;
};

const renderDetail = (label: string, value: string): string => `
  <div class="endpoint-card__detail">
    <dt>${escapeHtml(label)}</dt>
    <dd>${escapeHtml(value)}</dd>
  </div>`;

const renderOptionalSection = (label: string, value?: unknown): string => {
  if (value === undefined) return '';
  return `
    <div class="endpoint-card__block">
      <h3>${escapeHtml(label)}</h3>
      ${renderCodeBlock(value)}
    </div>`;
};

const renderEndpoint = (
  endpoint: ApiDocEndpoint,
  endpointLabels: Record<ApiDocEndpointId, string>,
  authLabels: Record<ApiDocEndpoint['auth'], string>,
  labels: ReturnType<typeof getMessages>['docs']['labels']
): string => {
  const query = renderList(endpoint.query);
  const headers = renderList(endpoint.headers);
  const response = endpoint.responseBody === undefined ? labels.noBody : endpoint.responseBody;

  return `
    <article class="endpoint-card" id="endpoint-${endpoint.id}">
      <div class="endpoint-card__head">
        <h3>${escapeHtml(endpointLabels[endpoint.id])}</h3>
        <code class="endpoint-card__request"><span class="method-badge method-badge--${endpoint.method.toLowerCase()}">${endpoint.method}</span> <span class="path-badge">${escapeHtml(endpoint.path)}</span></code>
      </div>
      <dl class="endpoint-card__meta">
        ${renderDetail(labels.auth, authLabels[endpoint.auth])}
        ${renderDetail(labels.responseStatus, String(endpoint.status))}
        ${endpoint.contentType ? renderDetail(labels.contentType, endpoint.contentType) : ''}
        ${endpoint.responseType ? renderDetail(labels.responseType, endpoint.responseType) : ''}
      </dl>
      ${query ? `<div class="endpoint-card__block"><h4>${labels.query}</h4>${query}</div>` : ''}
      ${headers ? `<div class="endpoint-card__block"><h4>${labels.headers}</h4>${headers}</div>` : ''}
      ${renderOptionalSection(labels.requestBody, endpoint.requestBody)}
      <div class="endpoint-card__block">
        <h4>${labels.responseBody}</h4>
        ${renderCodeBlock(response)}
      </div>
    </article>`;
};

const renderEndpointGroups = (docs: ReturnType<typeof getMessages>['docs']): string => {
  const endpointLabels = docs.endpointSummaries as Record<ApiDocEndpointId, string>;
  const groupLabels = docs.groupTitles as Record<ApiDocEndpointGroupKey, string>;
  const authLabels = docs.authLabels as Record<ApiDocEndpoint['auth'], string>;

  return apiDocs.groups
    .map((group) => {
      const endpoints = group.endpointIds
        .map((endpointId) => {
          const endpoint = endpointById.get(endpointId);
          if (!endpoint) throw new Error(`Missing API document endpoint ${endpointId}`);
          return renderEndpoint(endpoint, endpointLabels, authLabels, docs.labels);
        })
        .join('');
      return `
        <section class="endpoint-group" id="group-${group.key}">
          <div class="endpoint-group__head">
            <p class="eyebrow">${docs.labels.group}</p>
            <h2>${escapeHtml(groupLabels[group.key])}</h2>
          </div>
          <div class="endpoint-list">${endpoints}</div>
        </section>`;
    })
    .join('');
};

const renderErrors = (docs: ReturnType<typeof getMessages>['docs']): string =>
  apiDocs.errors
    .map(
      (error) => `
        <article class="error-card">
          <h3>${docs.labels.responseStatus}: ${error.status}</h3>
          ${renderCodeBlock(error.body)}
        </article>`
    )
    .join('');

const renderDocs = (): void => {
  const m = getMessages(activeLocale);
  const docs = m.docs;
  const groupLabels = docs.groupTitles as Record<ApiDocEndpointGroupKey, string>;
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
              <div><dt>${docs.source.endpointCount}</dt><dd>${apiDocs.endpointCount}</dd></div>
            </dl>
          </aside>
        </div>
      </header>

      <div class="container docs-layout">
        <aside class="docs-toc" aria-label="${docs.toc.label}">
          <a href="#overview">${docs.sections.overview.title}</a>
          <a href="#auth">${docs.sections.authentication.title}</a>
          <a href="#endpoints">${docs.sections.endpoints.title}</a>
          ${apiDocs.groups.map((group) => `<a href="#group-${group.key}">${groupLabels[group.key]}</a>`).join('')}
          <a href="#errors">${docs.sections.errors.title}</a>
          <a href="#config">${docs.sections.config.title}</a>
        </aside>
        <main class="docs-main">
          <section class="docs-section" id="overview">
            <h2>${docs.sections.overview.title}</h2>
            <p>${docs.sections.overview.body}</p>
            <div class="docs-note">${docs.sections.overview.count.replace('{count}', String(apiDocs.endpointCount))}</div>
            <div class="docs-note docs-note--muted">${docs.sections.overview.note}</div>
          </section>

          <section class="docs-section" id="auth">
            <h2>${docs.sections.authentication.title}</h2>
            <p>${docs.sections.authentication.body}</p>
            <div class="docs-inline-code">
              <code>${escapeHtml(apiDocs.commonHeaders.bearer)}</code>
              <code>${escapeHtml(apiDocs.commonHeaders.locale)}</code>
            </div>
          </section>

          <section class="docs-section" id="endpoints">
            <h2>${docs.sections.endpoints.title}</h2>
            <p>${docs.sections.endpoints.body}</p>
          </section>
          ${renderEndpointGroups(docs)}

          <section class="docs-section" id="errors">
            <h2>${docs.sections.errors.title}</h2>
            <p>${docs.sections.errors.body}</p>
            <div class="error-grid">${renderErrors(docs)}</div>
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
