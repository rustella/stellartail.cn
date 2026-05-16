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

export const deploymentConfig = {
  publicSiteUrl: normalizeSiteUrl(import.meta.env.VITE_PUBLIC_SITE_URL)
} as const;
