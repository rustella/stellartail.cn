import { enUS } from './locales/en-US';
import { zhCN } from './locales/zh-CN';

export type Locale = 'zh-CN' | 'en-US';
export const SUPPORTED_LOCALES: Locale[] = ['zh-CN', 'en-US'];
export const DEFAULT_LOCALE: Locale = 'zh-CN';
export const LOCALE_STORAGE_KEY = 'stellartrail.official.lang';

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
} as const;

export type Messages = (typeof messages)[Locale];

const normalizeLocale = (value: string | null | undefined): Locale | null => {
  if (!value) return null;
  if (value === 'zh-CN' || value.toLowerCase().startsWith('zh')) return 'zh-CN';
  if (value === 'en-US' || value.toLowerCase().startsWith('en')) return 'en-US';
  return null;
};

export const resolveInitialLocale = (): Locale => {
  const stored = normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  if (stored) return stored;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = normalizeLocale(params.get('lang'));
  if (fromQuery) return fromQuery;

  for (const language of navigator.languages ?? []) {
    const normalized = normalizeLocale(language);
    if (normalized) return normalized;
  }

  return normalizeLocale(navigator.language) ?? DEFAULT_LOCALE;
};

export const getMessages = (locale: Locale): Messages => messages[locale];

export const persistLocale = (locale: Locale): void => {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
};

export const nextLocale = (locale: Locale): Locale => (locale === 'zh-CN' ? 'en-US' : 'zh-CN');
