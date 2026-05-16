# Architecture

This repository is a static Vite website for `stellartail.cn` and `www.stellartail.cn`.

## Invariants

- Static-only runtime: no backend API dependency.
- Bilingual i18n is handled client-side with `zh-CN` and `en-US` locale files.
- First visit language resolution order: stored preference, URL query, system language, fallback Chinese.
- UI motion must be subtle and disabled or minimized for `prefers-reduced-motion`.
- The website presents current capabilities: gear preparation and knot skills.

## Runtime flow

`index.html` loads `src/main.ts`. The app resolves locale, sets `<html lang>`, renders static sections, binds language switching, then initializes reveal and starfield effects.
