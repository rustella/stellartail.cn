import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const expectedBasePath = process.env.EXPECTED_BASE_PATH || '/';
const BASE_PATH_PATTERN = /^\/(?:[A-Za-z0-9._~-]+\/?)*$/;

const normalizeBasePath = (value) => {
  if (!value || value.trim() === '') return '/';
  const trimmed = value.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith('//') || /[\\?#]/.test(trimmed)) {
    throw new Error('EXPECTED_BASE_PATH must be a path such as / or /stellartail.cn/, not a URL, query, or fragment');
  }
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  const segments = normalized.split('/').filter(Boolean);
  if (!BASE_PATH_PATTERN.test(normalized) || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error('EXPECTED_BASE_PATH contains unsupported path segments or characters');
  }
  return normalized;
};

const findAllIndexes = (text, needle) => {
  const indexes = [];
  let start = 0;
  while (true) {
    const index = text.indexOf(needle, start);
    if (index === -1) return indexes;
    indexes.push(index);
    start = index + needle.length;
  }
};

const basePath = normalizeBasePath(expectedBasePath);
const WEB_APP_URL = 'https://app.stellartrail.cn/';
const distDir = 'dist';
if (!existsSync(join(distDir, 'index.html'))) {
  console.error('dist/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

const textFiles = [];
const walk = (path) => {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry));
    return;
  }
  if (/\.(html|js|css|json|txt|xml|svg|map)$/.test(path)) textFiles.push(path);
};
walk(distDir);

const files = textFiles.map((file) => [file, readFileSync(file, 'utf8')]);
const combined = files.map(([, text]) => text).join('\n');
const issues = [];

if (existsSync('public/CNAME')) issues.push('public/CNAME must not exist for default-domain deployment');
if (existsSync('dist/CNAME')) issues.push('dist/CNAME must not exist for default-domain deployment');

for (const [file, text] of files) {
  if (/https:\/\/stellartail\.cn|https:\/\/www\.stellartail\.cn/.test(text)) {
    issues.push(`${file} contains a removed custom-domain URL`);
  }
}

if (!combined.includes(WEB_APP_URL)) {
  issues.push(`dist must contain the exact Web app URL ${WEB_APP_URL}`);
}

for (const [file, text] of files) {
  const prefixedWebAppUrl = `${basePath}${WEB_APP_URL}`;
  if (text.includes(prefixedWebAppUrl)) {
    issues.push(`${file} prefixes the external Web app URL with ${basePath}`);
  }
}

if (basePath === '/') {
  if (/\/stellartail\.cn\/assets\//.test(combined)) {
    issues.push('root deployment build must not contain /stellartail.cn/assets/');
  }
} else {
  const expectedAssetPrefix = `${basePath}assets/`;
  if (!combined.includes(expectedAssetPrefix)) {
    issues.push(`non-root deployment build must contain ${expectedAssetPrefix}`);
  }

  for (const [file, text] of files) {
    for (const index of findAllIndexes(text, '/assets/')) {
      if (!text.slice(0, index).endsWith(basePath.slice(0, -1))) {
        issues.push(`${file} contains an asset path outside ${basePath}: ...${text.slice(Math.max(0, index - 32), index + 40)}...`);
        break;
      }
    }
  }
}

if (issues.length) {
  console.error('Deploy base validation failed:');
  console.error(issues.map((issue) => `- ${issue}`).join('\n'));
  process.exit(1);
}

console.log(`deploy base validation passed for ${basePath}`);
