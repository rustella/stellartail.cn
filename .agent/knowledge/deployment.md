# Deployment

The official site is a static Vite application with deployment-specific base-path configuration.

## Current policy

- The repository is public.
- GitHub Pages default-domain deployment is supported at `https://rustella.github.io/stellartail.cn/`.
- Custom domains are not configured.
- Do not create `public/CNAME`.
- Do not add DNS setup instructions for `stellartail.cn` or `www.stellartail.cn` unless a future superseding plan explicitly reintroduces a custom domain.

## Build variables

- `SITE_BASE_PATH`: Vite base path. Defaults to `/` when unset. Use a path only; full URLs, protocol-relative URLs, queries, and fragments are rejected.
- `VITE_PUBLIC_SITE_URL`: optional public URL for UI display or deployment-specific metadata.
- `EXPECTED_BASE_PATH`: validation-only value for `scripts/validate-deploy-base.mjs`.

## Common builds

```bash
SITE_BASE_PATH=/ npm run build
EXPECTED_BASE_PATH=/ npm run validate:deploy-base
```

```bash
SITE_BASE_PATH=/stellartail.cn/ VITE_PUBLIC_SITE_URL=https://rustella.github.io/stellartail.cn/ npm run build
EXPECTED_BASE_PATH=/stellartail.cn/ npm run validate:deploy-base
```

## Validation expectations

- `public/CNAME` and `dist/CNAME` must not exist.
- Non-root builds must not emit root-relative public asset references such as `src="/assets/..."`.
- Root builds must not contain GitHub Pages project-base asset references unless that base was explicitly requested.
- Source files under `src/**`, `index.html`, `public/**`, and `vite.config.ts` must not hard-code the GitHub Pages default URL or a removed custom-domain URL.
