const trimLeadingSlashes = (value: string): string => value.replace(/^\/+/, '');

export const assetPath = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${trimLeadingSlashes(path)}`;
};

export const sitePath = (path = ''): string => assetPath(path);
