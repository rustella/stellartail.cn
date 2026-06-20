const normalizeSiteUrl = (value: string | undefined): string => {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.href.endsWith('/') ? url.href : `${url.href}/`;
  } catch {
    return '';
  }
};

const normalizeIcpRecordNumber = (value: string | undefined): string => value?.trim() ?? '';

const normalizeEmail = (value: string | undefined): string => {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : '';
};

export const deploymentConfig = {
  publicSiteUrl: normalizeSiteUrl(import.meta.env.VITE_PUBLIC_SITE_URL),
  icpRecordNumber: normalizeIcpRecordNumber(import.meta.env.VITE_PUBLIC_ICP_RECORD_NUMBER),
  privacyContactEmail: normalizeEmail(import.meta.env.VITE_PUBLIC_PRIVACY_CONTACT_EMAIL)
} as const;
