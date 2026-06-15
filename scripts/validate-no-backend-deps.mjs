import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';

const roots = ['src', 'docs', 'downloads', 'privacy', 'index.html', 'vite.config.ts'];
const fetchAllowedFiles = new Set([normalize('src/docs.ts')]);
const bannedEverywhere = [/axios/i, /VITE_API_BASE_URL/i, /API_BASE_URL/i, /localhost:\d+/i];
const apiPathAllowedFiles = new Set([normalize('src/content/api-docs.ts'), normalize('src/docs.ts')]);

const files = [];
const walk = (path) => {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry));
    return;
  }
  if (/\.(ts|tsx|js|mjs|html|css)$/.test(path)) files.push(path);
};
roots.forEach(walk);

const issues = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (/fetch\s*\(/i.test(text) && !fetchAllowedFiles.has(normalize(file))) {
    issues.push(`${file}: fetch() is only allowed in the user-initiated docs request runner`);
  }
  for (const pattern of bannedEverywhere) {
    if (pattern.test(text)) issues.push(`${file}: ${pattern}`);
  }
  if (/\/api\//i.test(text) && !apiPathAllowedFiles.has(normalize(file))) {
    issues.push(`${file}: /api/ is only allowed in static API documentation data`);
  }
}

if (issues.length) {
  console.error('Backend dependency markers found:');
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('no backend dependency validation passed');
