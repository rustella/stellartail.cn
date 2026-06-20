# Codebase Map

```text
.
├── index.html
├── product/                 # Product introduction page
├── downloads/               # Static downloads and mobile entries page
├── src/
│   ├── main.ts                 # Minimal homepage rendering and language binding
│   ├── product.ts              # Product introduction rendering and language binding
│   ├── downloads.ts            # Downloads page rendering and language binding
│   ├── config/                 # Deployment-facing runtime config helpers
│   ├── i18n/                   # Locale resolution and bilingual copy
│   ├── content/                # Static product and screenshot metadata
│   ├── effects/                # Reveal and starfield motion
│   ├── styles/                 # Tokens, layout, components, motion
│   └── utils/                  # Asset path and small DOM helpers
├── public/assets/              # Brand, screenshot, and entry assets
├── scripts/                    # Deterministic validation scripts
├── tests/                      # Playwright smoke/e2e tests
├── .github/workflows/          # CI and GitHub Pages deployment
└── .agent/                     # Agent context architecture
```
