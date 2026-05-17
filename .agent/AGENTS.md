# Official Site Agent Guide

This file is a lightweight router for agents working in the `stellartail.cn` static website repository.

## Bootstrap

1. Read `.agent/manifest.yaml` for project facts and invariants.
2. Read `.agent/context-index.yaml` for task-specific context.
3. Read `.agent/commands.yaml` before running validation commands.
4. Check `git status --short` before editing.

## Hard rules

- Code comments must be English.
- User-visible copy must live in `src/i18n/locales/*`.
- Keep the site static. Do not add backend API calls, API base URLs, axios, or runtime server requirements. Static path-only API documentation is allowed under `/docs/`.
- Do not market unavailable product capabilities; the site currently presents gear and knot skills only.
- Motion must be tasteful, performant, and respect `prefers-reduced-motion`.
- Do not commit secrets, tokens, credentials, or deployment keys.

## Task routing

- Feature/UI work: read `.agent/knowledge/architecture.md`, `.agent/knowledge/codebase_map.md`, `.agent/checklists/preflight.md`.
- Copy/i18n work: read `.agent/knowledge/brand-and-content.md` and run `npm run validate:i18n`.
- Visual changes: read `.agent/agents/visual-reviewer.md` and run Playwright checks.
- Context changes: update `.agent/manifest.yaml`, `.agent/context-index.yaml`, and `.agent/commands.yaml` when commands or structure change.

- Docs API page work: read `.agent/knowledge/docs-api-page.md`; never commit or render the real docs origin.
