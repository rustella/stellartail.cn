# Docs API Page

The repository includes a static developer documentation page at `/docs/` for currently verified backend API behavior.

## Scope

- The page is static and must not make browser runtime requests to backend paths.
- API examples are path-only. Do not commit or render the real production docs origin.
- The production docs origin, when used, belongs only in ignored local/deployment config such as `config/docs.production.local.json` and `.agent/local/production/docs-site.md`.
- The first documented backend paths are `GET /healthz`, `GET /api/meta`, and the common `404 not_found` response.

## Source of truth

Backend facts were inspected from the StellarTrail service at commit `d5d2465`:

- `services/api/src/routes/mod.rs`
- `services/api/src/routes/health.rs`
- `services/api/src/routes/meta.rs`
- `services/api/src/error.rs`
- `services/api/src/config.rs`

Update `src/content/api-docs.ts` only after checking the real backend source or a generated contract.

## Validation

Run:

```bash
npm run validate:docs-config
npm run validate:no-backend
npm run validate:no-routes-copy
npm run test:e2e
```

For deployment base checks, build both root and GitHub Pages base paths and verify `dist/docs/index.html` exists.
