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

type DocsMessages = ReturnType<typeof getMessages>['docs'];
type DocsLabels = DocsMessages['labels'];

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

const pathParamNames = (path: string): string[] => [...path.matchAll(/:([A-Za-z0-9_]+)/g)].map((match) => match[1]);

const querySpec = (raw: string): { name: string; defaultValue: string } => {
  const [name, ...rest] = raw.split('=');
  return { name, defaultValue: rest.length ? rest.join('=') : '' };
};

const pathParamPlaceholder = (endpoint: ApiDocEndpoint, name: string): string => {
  if (name === 'knot_id') return 'adjustable-grip-hitch-knot';
  if (name === 'asset_id') return 'draw_gif';
  if (endpoint.id === 'gearTemplatesDetail') return 'backpacking-basic';
  if (endpoint.id === 'skillsKnotsDetail') return 'adjustable-grip-hitch-knot';
  if (endpoint.groupKey === 'gear') return 'gear-id';
  if (endpoint.groupKey === 'uploads') return 'upload-id';
  return name;
};

const renderRequestField = (label: string, input: string, hint = ''): string => `
  <label class="request-runner__field">
    <span>${escapeHtml(label)}</span>
    ${input}
    ${hint ? `<small>${escapeHtml(hint)}</small>` : ''}
  </label>`;

const renderPathParamInputs = (endpoint: ApiDocEndpoint, labels: DocsLabels): string => {
  const names = pathParamNames(endpoint.path);
  if (!names.length) return '';
  return `
    <div class="request-runner__block">
      <h4>${escapeHtml(labels.pathParams)}</h4>
      <div class="request-runner__grid">
        ${names
          .map((name) =>
            renderRequestField(
              labels.pathParamLabel.replace('{name}', name),
              `<input type="text" data-path-param="${escapeHtml(name)}" placeholder="${escapeHtml(pathParamPlaceholder(endpoint, name))}" />`
            )
          )
          .join('')}
      </div>
    </div>`;
};

const renderQueryInputs = (endpoint: ApiDocEndpoint, labels: DocsLabels): string => {
  const specs = endpoint.query?.map(querySpec) ?? [];
  return `
    <div class="request-runner__block">
      <h4>${escapeHtml(labels.queryParams)}</h4>
      ${
        specs.length
          ? `<div class="request-runner__grid">${specs
              .map((spec) =>
                renderRequestField(
                  labels.queryParamLabel.replace('{name}', spec.name),
                  `<input type="text" data-query-param="${escapeHtml(spec.name)}" value="${escapeHtml(spec.defaultValue)}" />`
                )
              )
              .join('')}</div>`
          : ''
      }
      ${renderRequestField(
        labels.extraQuery,
        `<input type="text" data-extra-query placeholder="${escapeHtml(labels.extraQueryPlaceholder)}" />`
      )}
    </div>`;
};

const renderBodyInput = (endpoint: ApiDocEndpoint, labels: DocsLabels): string => {
  if (endpoint.requestBody === undefined) return '';
  const body = codeValue(endpoint.requestBody);
  const fileInput = endpoint.contentType === 'multipart/form-data'
    ? renderRequestField(labels.fileInput, '<input type="file" data-request-file />')
    : '';
  return `
    <div class="request-runner__block">
      <h4>${escapeHtml(labels.requestBodyInput)}</h4>
      ${fileInput}
      <textarea data-request-body spellcheck="false">${body}</textarea>
    </div>`;
};

const renderRequestRunner = (endpoint: ApiDocEndpoint, labels: DocsLabels): string => `
  <form class="request-runner" data-request-form data-endpoint-id="${endpoint.id}">
    <div class="request-runner__head">
      <div>
        <h3>${escapeHtml(labels.tryRequest)}</h3>
        <p>${escapeHtml(labels.tryRequestNote)}</p>
      </div>
      <button class="request-runner__send" type="submit" data-send-request>${escapeHtml(labels.sendRequest)}</button>
    </div>
    ${renderRequestField(
      labels.serviceOrigin,
      `<input type="url" inputmode="url" autocomplete="off" data-request-base placeholder="${escapeHtml(labels.serviceOriginPlaceholder)}" />`,
      labels.serviceOriginHelp
    )}
    ${renderPathParamInputs(endpoint, labels)}
    ${renderQueryInputs(endpoint, labels)}
    <div class="request-runner__block">
      <h4>${escapeHtml(labels.headersInput)}</h4>
      <textarea data-request-headers spellcheck="false" placeholder="${escapeHtml(labels.headersPlaceholder)}"></textarea>
    </div>
    ${renderBodyInput(endpoint, labels)}
    <div class="request-runner__result" aria-live="polite">
      <div class="request-runner__result-row"><strong>${escapeHtml(labels.requestUrl)}</strong><code data-request-url>—</code></div>
      <div class="request-runner__result-row"><strong>${escapeHtml(labels.response)}</strong><span data-response-status>—</span></div>
      <details>
        <summary>${escapeHtml(labels.responseHeaders)}</summary>
        <pre class="code-block"><code data-response-headers>—</code></pre>
      </details>
      <strong class="request-runner__body-title">${escapeHtml(labels.responseBodyResult)}</strong>
      <pre class="code-block"><code data-response-body>${escapeHtml(labels.noResponseBody)}</code></pre>
    </div>
  </form>`;

const renderEndpoint = (
  endpoint: ApiDocEndpoint,
  endpointLabels: Record<ApiDocEndpointId, string>,
  authLabels: Record<ApiDocEndpoint['auth'], string>,
  labels: DocsLabels
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
      ${renderRequestRunner(endpoint, labels)}
    </article>`;
};

const renderEndpointGroups = (docs: DocsMessages): string => {
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

const renderErrors = (docs: DocsMessages): string =>
  apiDocs.errors
    .map(
      (error) => `
        <article class="error-card">
          <h3>${docs.labels.responseStatus}: ${error.status}</h3>
          ${renderCodeBlock(error.body)}
        </article>`
    )
    .join('');

const parseServiceOrigin = (raw: string, labels: DocsLabels): string => {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error(labels.fillServiceOrigin);
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(labels.invalidServiceOrigin);
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.search || parsed.hash) {
    throw new Error(labels.invalidServiceOrigin);
  }
  return parsed.href.replace(/\/+$/, '');
};

const buildPath = (endpoint: ApiDocEndpoint, form: HTMLFormElement, labels: DocsLabels): string =>
  endpoint.path.replace(/:([A-Za-z0-9_]+)/g, (_full, name: string) => {
    const input = form.querySelector<HTMLInputElement>(`[data-path-param="${CSS.escape(name)}"]`);
    const value = input?.value.trim() ?? '';
    if (!value) throw new Error(labels.fillPathParam.replace('{name}', name));
    return encodeURIComponent(value);
  });

const appendQueryParams = (url: URL, form: HTMLFormElement): void => {
  form.querySelectorAll<HTMLInputElement>('[data-query-param]').forEach((input) => {
    const name = input.dataset.queryParam;
    const value = input.value.trim();
    if (name && value) url.searchParams.set(name, value);
  });
  const extraQuery = form.querySelector<HTMLInputElement>('[data-extra-query]')?.value.trim() ?? '';
  if (!extraQuery) return;
  const normalized = extraQuery.startsWith('?') ? extraQuery.slice(1) : extraQuery;
  new URLSearchParams(normalized).forEach((value, key) => {
    if (key) url.searchParams.append(key, value);
  });
};

const parseHeaders = (form: HTMLFormElement, labels: DocsLabels): Headers => {
  const headers = new Headers();
  const raw = form.querySelector<HTMLTextAreaElement>('[data-request-headers]')?.value ?? '';
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const index = trimmed.indexOf(':');
    if (index <= 0) throw new Error(labels.invalidHeader);
    const name = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!name || !value) throw new Error(labels.invalidHeader);
    headers.set(name, value);
  }
  return headers;
};

const parseRequestBody = (form: HTMLFormElement, labels: DocsLabels): unknown => {
  const raw = form.querySelector<HTMLTextAreaElement>('[data-request-body]')?.value.trim() ?? '';
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error(labels.invalidJson);
  }
};

const buildRequestBody = (endpoint: ApiDocEndpoint, form: HTMLFormElement, headers: Headers, labels: DocsLabels): BodyInit | undefined => {
  if (endpoint.requestBody === undefined) return undefined;
  const body = parseRequestBody(form, labels);
  if (endpoint.contentType === 'multipart/form-data') {
    const data = new FormData();
    const file = form.querySelector<HTMLInputElement>('[data-request-file]')?.files?.[0];
    if (file) data.set('file', file);
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
        if (key === 'file') continue;
        if (value === null || value === undefined) continue;
        data.set(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    }
    return data;
  }
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return JSON.stringify(body ?? {});
};

const responseHeadersText = (headers: Headers): string => {
  const lines: string[] = [];
  headers.forEach((value, key) => lines.push(`${key}: ${value}`));
  return lines.length ? lines.join('\n') : '—';
};

const statusTextFallback = (status: number): string =>
  ({
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    413: 'Payload Too Large',
    415: 'Unsupported Media Type',
    422: 'Unprocessable Entity',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway'
  })[status] ?? '';

const formatResponseBody = async (response: Response, labels: DocsLabels): Promise<string> => {
  const text = await response.text();
  if (!text) return labels.noResponseBody;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('json')) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  return text;
};

const setText = (form: HTMLFormElement, selector: string, value: string): void => {
  const node = form.querySelector<HTMLElement>(selector);
  if (node) node.textContent = value;
};

const handleRequestSubmit = async (event: SubmitEvent, labels: DocsLabels): Promise<void> => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const endpoint = endpointById.get(form.dataset.endpointId ?? '');
  if (!endpoint) return;
  const button = form.querySelector<HTMLButtonElement>('[data-send-request]');
  try {
    button?.setAttribute('disabled', 'true');
    setText(form, '[data-response-status]', labels.sending);
    setText(form, '[data-response-body]', '');
    setText(form, '[data-response-headers]', '—');

    const origin = parseServiceOrigin(form.querySelector<HTMLInputElement>('[data-request-base]')?.value ?? '', labels);
    const path = buildPath(endpoint, form, labels);
    const requestUrl = new URL(`${origin}${path.startsWith('/') ? '' : '/'}${path}`);
    appendQueryParams(requestUrl, form);
    setText(form, '[data-request-url]', requestUrl.href);

    const headers = parseHeaders(form, labels);
    const body = buildRequestBody(endpoint, form, headers, labels);
    const response = await fetch(requestUrl.href, {
      method: endpoint.method,
      headers,
      body,
      credentials: 'omit'
    });
    const fallback = statusTextFallback(response.status);
    setText(form, '[data-response-status]', `${response.status}${response.statusText || fallback ? ` ${response.statusText || fallback}` : ''}`);
    setText(form, '[data-response-headers]', responseHeadersText(response.headers));
    setText(form, '[data-response-body]', await formatResponseBody(response, labels));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const localized = message === labels.fillServiceOrigin || message === labels.invalidServiceOrigin || message === labels.invalidHeader || message === labels.invalidJson || message.startsWith(labels.fillPathParam.split('{name}')[0])
      ? message
      : labels.networkError.replace('{message}', message);
    setText(form, '[data-response-status]', localized);
    setText(form, '[data-response-body]', localized);
  } finally {
    button?.removeAttribute('disabled');
  }
};

const bindRequestForms = (labels: DocsLabels): void => {
  app.querySelectorAll<HTMLFormElement>('[data-request-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      void handleRequestSubmit(event, labels);
    });
  });
};

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
  bindRequestForms(docs.labels);
};

renderDocs();
