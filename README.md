# StellarTrail Official Website

Official static website for **StellarTrail / 寻径星野**.

- Domains: `stellartail.cn`, `www.stellartail.cn`
- Repository: `rustella/stellartail.cn` private repository
- Runtime: static Vite site, no backend API dependency
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
npm run test:e2e
```

## Screenshot assets

The site references stable day-mode asset names under `public/assets/screenshots/`. Replace those files with final captures when WeChat Developer Tools or the product runtime is available. Do not use dark-mode captures.

## Deployment

Build output is `dist/`. Deploy it with a static hosting provider that supports private GitHub repositories. Prefer apex `https://stellartail.cn/` as canonical and redirect `https://www.stellartail.cn/` to the apex domain.
