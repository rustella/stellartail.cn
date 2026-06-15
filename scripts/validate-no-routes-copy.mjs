import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src', 'docs', 'downloads', 'privacy', 'index.html', 'public', 'dist'];
const banned = [/路线/g, /route(s|d|r)?/gi, /itinerary/gi, /trip planning/gi];
const textExt = /\.(ts|tsx|js|mjs|html|css|svg|json|txt|xml)$/;
const files = [];

const walk = (path) => {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry));
    return;
  }
  if (textExt.test(path)) files.push(path);
};
roots.forEach(walk);

const issues = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const pattern of banned) {
    const matches = text.match(pattern);
    if (matches) issues.push(`${file}: ${[...new Set(matches)].join(', ')}`);
  }
}

if (issues.length) {
  console.error('Disallowed feature marketing copy found:');
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('no disallowed feature marketing copy found');
