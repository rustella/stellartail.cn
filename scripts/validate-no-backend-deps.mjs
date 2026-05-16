import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src', 'index.html', 'vite.config.ts'];
const banned = [
  /fetch\s*\(/i,
  /\/api\//i,
  /axios/i,
  /VITE_API_BASE_URL/i,
  /API_BASE_URL/i,
  /localhost:\d+/i
];

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
  for (const pattern of banned) {
    if (pattern.test(text)) issues.push(`${file}: ${pattern}`);
  }
}

if (issues.length) {
  console.error('Backend dependency markers found:');
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('no backend dependency validation passed');
