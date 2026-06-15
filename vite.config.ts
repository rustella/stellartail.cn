import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const BASE_PATH_PATTERN = /^\/(?:[A-Za-z0-9._~-]+\/?)*$/;

const normalizeBasePath = (value: string | undefined): string => {
  if (!value || value.trim() === '') return '/';

  const trimmed = value.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith('//') || /[\?#]/.test(trimmed)) {
    throw new Error('SITE_BASE_PATH must be a path such as / or /stellartail.cn/, not a URL, query, or fragment');
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  const segments = normalized.split('/').filter(Boolean);
  if (!BASE_PATH_PATTERN.test(normalized) || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error('SITE_BASE_PATH contains unsupported path segments or characters');
  }

  return normalized;
};

export default defineConfig({
  base: normalizeBasePath(process.env.SITE_BASE_PATH),
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        docs: fileURLToPath(new URL('docs/index.html', import.meta.url)),
        downloads: fileURLToPath(new URL('downloads/index.html', import.meta.url)),
        privacy: fileURLToPath(new URL('privacy/index.html', import.meta.url))
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
  preview: {
    host: '0.0.0.0'
  }
});
