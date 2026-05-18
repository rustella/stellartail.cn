# Docs API Page

The repository includes a static developer documentation page at `/docs/` for currently verified backend API behavior.

## Scope

- The page is static and must not make automatic browser runtime requests to backend paths on load.
- A user-initiated request runner is allowed under `/docs/` only when the reader types an http(s) service address in the shared setting and clicks send.
- API examples remain path-only. Do not commit or render the real production docs origin.
- The production docs origin, when used, belongs only in ignored local/deployment config such as `config/docs.production.local.json` and `.agent/local/production/docs-site.md`.
- The document lists every backend route captured in `src/content/api-docs.ts`; request examples and the request runner must not contain a committed production origin.

## Source of truth

Backend facts for the complete route inventory were inspected from the StellarTrail service at commit `bd9cbb7`:

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


## Request runner rules

- Do not provide a default service address, do not read `VITE_API_BASE_URL`, and do not persist addresses, headers, request bodies, or responses in local storage.
- Build requests only from the endpoint inventory plus user input: one shared service address, path parameters, query parameters, headers, request body, and optional multipart file.
- Keep page-load behavior request-free. Browser tests should prove `/docs/` makes zero backend-path requests before the reader clicks send.
- Use `credentials: 'omit'` so the page does not attach ambient cookies to arbitrary typed origins.
