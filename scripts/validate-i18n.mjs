import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const load = (file) => {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/export const \w+ = ([\s\S]*?) as const;/);
  if (!match) throw new Error(`Cannot parse locale file: ${file}`);
  return vm.runInNewContext(`(${match[1]})`);
};

const flatten = (value, prefix = '') => {
  if (typeof value === 'string') return [[prefix, value]];
  if (Array.isArray(value)) return value.flatMap((item, index) => flatten(item, `${prefix}[${index}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key));
  }
  return [[prefix, value]];
};

const zh = load('src/i18n/locales/zh-CN.ts');
const en = load('src/i18n/locales/en-US.ts');
const zhEntries = flatten(zh);
const enEntries = flatten(en);
const zhKeys = zhEntries.map(([key]) => key).sort();
const enKeys = enEntries.map(([key]) => key).sort();
const missingInEn = zhKeys.filter((key) => !enKeys.includes(key));
const missingInZh = enKeys.filter((key) => !zhKeys.includes(key));
const emptyValues = [...zhEntries, ...enEntries].filter(([, value]) => typeof value === 'string' && value.trim() === '').map(([key]) => key);

if (missingInEn.length || missingInZh.length || emptyValues.length) {
  console.error(JSON.stringify({ missingInEn, missingInZh, emptyValues }, null, 2));
  process.exit(1);
}

console.log('i18n validation passed');
