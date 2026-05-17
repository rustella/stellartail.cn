import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const examplePath = 'config/docs.example.json';
const localPath = 'config/docs.production.local.json';
const pathPattern = /^\/(?:[A-Za-z0-9._~-]+\/)*$/;

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

const validateDocsPath = (path, label) => {
  if (typeof path !== 'string' || !pathPattern.test(path)) {
    throw new Error(`${label}.docsPath must be a path such as /docs/`);
  }
};

const normalizeOrigin = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') throw new Error('productionOrigin must be a string');
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('productionOrigin must be http or https');
  parsed.pathname = '/';
  parsed.search = '';
  parsed.hash = '';
  return parsed.href.replace(/\/$/, '');
};

if (!existsSync(examplePath)) {
  console.error(`${examplePath} is missing`);
  process.exit(1);
}

const example = readJson(examplePath);
validateDocsPath(example.docsPath, examplePath);
if (example.productionOrigin && String(example.productionOrigin).trim() !== '') {
  console.error(`${examplePath} must not contain a real production origin`);
  process.exit(1);
}

let configuredOrigin = '';
let configuredHost = '';
if (existsSync(localPath)) {
  const local = readJson(localPath);
  validateDocsPath(local.docsPath, localPath);
  configuredOrigin = normalizeOrigin(local.productionOrigin || '');
  configuredHost = configuredOrigin ? new URL(configuredOrigin).host : '';
}

if (existsSync('dist') && !existsSync(join('dist', 'docs', 'index.html'))) {
  console.error('dist/docs/index.html does not exist. Run npm run build after adding the docs page.');
  process.exit(1);
}

const collectTextFiles = (roots) => {
  const textFiles = [];
  const ignoredSegments = new Set(['node_modules', 'dist', 'coverage', 'test-results', 'playwright-report', 'artifacts']);
  const walk = (path) => {
    if (!existsSync(path)) return;
    const normalized = path.split(/[\\/]+/);
    if (normalized.some((segment) => ignoredSegments.has(segment))) return;
    if (path.startsWith(join('.agent', 'local'))) return;
    if (path === localPath) return;
    const stat = statSync(path);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(path)) walk(join(path, entry));
      return;
    }
    if (/\.(html|js|css|json|txt|xml|svg|map|ts|tsx|md|ya?ml)$/.test(path)) textFiles.push(path);
  };
  roots.forEach(walk);
  return textFiles;
};

const containsConfiguredOrigin = (file) => {
  const text = readFileSync(file, 'utf8');
  return configuredOrigin && (text.includes(configuredOrigin) || (configuredHost && text.includes(configuredHost)));
};

if (configuredOrigin) {
  const sourceCandidates = collectTextFiles(['src', 'docs', 'public', 'scripts', '.agent', 'config/docs.example.json', 'README.md', 'package.json', 'vite.config.ts', 'tests']);
  const sourceLeaks = sourceCandidates.filter(containsConfiguredOrigin);
  if (sourceLeaks.length) {
    console.error('Docs production origin leaked into public source candidates:');
    console.error(sourceLeaks.join('\n'));
    process.exit(1);
  }

  if (existsSync('dist')) {
    const buildLeaks = collectTextFiles(['dist']).filter(containsConfiguredOrigin);
    if (buildLeaks.length) {
      console.error('Docs production origin leaked into build output:');
      console.error(buildLeaks.join('\n'));
      process.exit(1);
    }
  }
}

if (existsSync('dist') && !existsSync(join('dist', 'docs', 'index.html'))) {
  console.error('dist/docs/index.html does not exist. Run npm run build after adding the docs page.');
  process.exit(1);
}

console.log(`docs config validation passed; docs origin configured: ${configuredOrigin ? 'yes [redacted]' : 'no'}`);
