# Architecture

This repository is a static Vite website for StellarTrail / 寻径星野. The same source tree can be deployed to GitHub Pages or another static host by changing build-time deployment variables.

## Invariants

- Static-only runtime: no backend API dependency.
- Bilingual i18n is handled client-side with `zh-CN` and `en-US` locale files.
- First visit language resolution order: stored preference, URL query, system language, fallback Chinese.
- UI motion must be subtle and disabled or minimized for `prefers-reduced-motion`.
- The website presents current capabilities: gear preparation and knot skills.
- Deployment base paths must stay configurable; do not hard-code a production host or project base inside `src/**`.
- Custom-domain deployment is not configured; do not add CNAME or DNS instructions unless a future plan explicitly changes this policy.

## Runtime flow

`index.html` loads `src/main.ts` for the minimal homepage. `product/index.html` loads `src/product.ts` for the product introduction sections. Each app resolves locale, sets `<html lang>`, renders static content, and binds language switching. The product introduction page also initializes reveal and starfield effects.

## Deployment base flow

- `vite.config.ts` reads `SITE_BASE_PATH` and passes it to Vite `base`.
- Application code reads `import.meta.env.BASE_URL` through `src/utils/asset.ts` when rendering public assets.
- Optional public site display uses `VITE_PUBLIC_SITE_URL` through `src/config/deployment.ts`.
- GitHub Pages sets these variables in `.github/workflows/deploy-pages.yml`; other static hosts must set their own values during build.
