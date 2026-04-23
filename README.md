# datapeople-astro

Marketing-Site von Datapeople — Data & AI Implementation für Schweizer Unternehmen.

Stack: Astro 6, React 19, Tailwind 4, GSAP (ScrollTrigger). Blog via Content Collections (`src/content/blog/*.md`). Fonts self-hosted via `@fontsource` (Spectral, Atkinson Hyperlegible).

## Commands

| Command           | Beschreibung                     |
| :---------------- | :------------------------------- |
| `npm install`     | Dependencies installieren        |
| `npm run dev`     | Dev-Server auf `localhost:4321`  |
| `npm run build`   | Produktions-Build nach `./dist/` |
| `npm run preview` | Build lokal vorschauen           |

## Deployment

Automatischer Deploy auf Cloudflare Pages bei Push auf `main` via `.github/workflows/deploy.yml`.

## Projektstruktur

- `src/pages/` — Routen (Landingpage + Blog)
- `src/components/` — Astro- und React-Components
- `src/layouts/Layout.astro` — Base-Layout mit Meta + Paper-Grain
- `src/data/site.ts` — Zentrale Copy- und Asset-Referenzen
- `src/content/blog/` — Blog-Posts (Markdown, Schema in `src/content.config.ts`)
- `src/styles/global.css` — Design-Tokens (Farben, Typo, Spacing)
- `brand/` — Lokales Design-System (Tokens, Preview-Cards, Brand-Richtlinien)
