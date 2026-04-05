# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

- **Requires**: Node.js 22+ (use `nvm use` — `.nvmrc` included)
- Dev server: `npm run dev`
- Production build: `npm run build` (output in `dist/`)
- Preview build: `npm run preview`
- Install dependencies: `npm install`

## Stack

- **Framework**: Astro 5 (static site generator, islands architecture)
- **Styling**: Tailwind CSS 3 (utility-first, config in `tailwind.config.mjs`)
- **3D Globe**: Cobe (WebGL globe, ~5KB)
- **Animations**: GSAP + ScrollTrigger (scroll-driven animations)
- **Deployment**: Cloudflare Pages (auto-builds on push to main, build command: `npm run build`, output: `dist/`)

## Bilingual i18n System

The site is bilingual (en/fr). UI strings are in `src/i18n/en.ts` and `src/i18n/fr.ts`. A `t(key, locale)` helper in `src/i18n/ui.ts` resolves translations. Routing uses Astro's native i18n with `/en/` and `/fr/` prefixes. Root `/` auto-detects browser language and redirects.

## Key Files

- `src/layouts/Base.astro` — HTML shell, head, analytics
- `src/components/sections/Hero.astro` — Globe hero with GSAP ScrollTrigger
- `src/data/locations.ts` — Geographic coordinates for globe markers
- `src/styles/global.css` — Tailwind imports + custom layers
- `tailwind.config.mjs` — Design tokens (dark theme colors, fonts)
- `old/` — Archived Jekyll project (reference only)

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- **Branching**: push direct to `main`
- **Deployment**: Cloudflare Pages (auto-builds on push to main)
- **Node version**: 22+ (enforced via `.nvmrc`)

## Key Gotchas

- The globe is an Astro island (`client:visible`) — only component shipping JS
- GSAP ScrollTrigger pins the hero section during scroll — changing hero height affects scroll behavior
- Location data in `src/data/locations.ts` drives both globe markers and the overlay cards
- Content (experiences, projects, education) is inline in section components, not in separate data files
- Dark theme: all colors defined in `tailwind.config.mjs` under `colors.bg`, `colors.text`, `colors.accent`
