# StellarTrail Official Website

Official static website for **StellarTrail / 寻径星野**.

- Repository: `rustella/stellartail.cn` public repository
- Runtime: static Vite site, no backend API dependency
- Deployment: configurable static host base path
- Product scope shown on this site: gear library and outdoor knot skills
- Languages: `zh-CN` and `en-US`, with first-visit system language detection

## Development

```bash
npm install
npm run dev
npm run check
```

## Validation

```bash
npm run validate:i18n
npm run validate:no-backend
npm run validate:no-routes-copy
npm run typecheck
npm run build
npm run validate:deploy-base
npm run test:e2e
```

## Screenshot assets

The site references stable day-mode asset names under `public/assets/screenshots/`. Replace those files with final captures when WeChat Developer Tools or the product runtime is available. Do not use dark-mode captures.

## Deployment

This repository can be deployed to multiple static hosts. Do not hard-code a production base URL in source files.

Build-time variables:

- `SITE_BASE_PATH`: Vite base path. Defaults to `/`. Use a path only, such as `/`, `/stellartail.cn/`, or `/official/`; do not pass a full URL.
- `VITE_PUBLIC_SITE_URL`: optional public site URL shown by the UI or used by deployment-specific metadata.
- `EXPECTED_BASE_PATH`: validation-only value for `npm run validate:deploy-base`.

Examples:

```bash
# Generic server at domain root
SITE_BASE_PATH=/ npm run build
EXPECTED_BASE_PATH=/ npm run validate:deploy-base

# GitHub Pages project site
SITE_BASE_PATH=/stellartail.cn/ VITE_PUBLIC_SITE_URL=https://rustella.github.io/stellartail.cn/ npm run build
EXPECTED_BASE_PATH=/stellartail.cn/ npm run validate:deploy-base

# Another server under a subpath
SITE_BASE_PATH=/official/ VITE_PUBLIC_SITE_URL=https://example.com/official/ npm run build
EXPECTED_BASE_PATH=/official/ npm run validate:deploy-base
```

GitHub Pages default deployment:

- URL: https://rustella.github.io/stellartail.cn/
- Workflow: `.github/workflows/deploy-pages.yml`
- Custom domain: not configured
- CNAME: not generated
