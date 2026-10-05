# starter-astro-blush-arch

GitHub **template repository** for the sitegen `beauty-blush-arch` variety. sitegen creates each client repo from this template, then adds `CLAUDE.md`, `.sitegen/brief.json`, `.sitegen/style-guide.md` and `public/images/`. Claude Code builds the site from there.

This repo holds the stack, tokens, fonts and base components. The style guide says how to compose them. Keep the two in sync: if you change a token here, change §14 of `varieties/beauty/blush-arch.md` in sitegen as well.

## Stack

- **Astro 7**, static output, no UI framework, no client islands
- **Plain CSS** with custom properties and one BEM block per component. No Tailwind.
- **Fonts** via the Astro Fonts API (`astro.config.mjs`): Raleway (variable 300–700, with italic), Nixie One and Qwitcher Grypen, fetched from Fontsource at build time and self-hosted. Latin subset only. Raleway is preloaded.
- **Icons**: `@lucide/astro`, imported per icon: `import CalendarCheck from '@lucide/astro/icons/calendar-check'`
- **Sitemap**: `@astrojs/sitemap`. Set `SITE_URL` (or edit `site` in `astro.config.mjs`) to the production domain.

## What's here

```
src/
  data/
    site.ts        business facts: name, booking URL, phone, address, socials (fill from the brief)
  styles/
    tokens.css     design tokens: color, space, radius, layout (style guide §14)
    reset.css      base reset + body typography
    base.css       headings, .script, .frame, .prose, focus ring, .sr-only, .todo, [data-reveal]
    global.css     imports the three above; loaded by Base.astro
  layouts/
    Base.astro     <head>: meta, canonical, OG, fonts, JSON-LD slot; loads reveal.ts
  components/
    Button.astro   primary | outline | link, sm | md | lg
    BookLink.astro every booking CTA: URL from site.ts, data-book tracking, TODO if no URL
    Arch.astro     the arch crop (semicircle top, flat bottom), optional reveal
    Todo.astro     visible placeholder for missing business facts
  scripts/
    strip.ts       horizontal strips: arrows, mouse drag, dots
    reveal.ts      IntersectionObserver for [data-reveal]
  pages/
    index.astro    smoke page (replaced during the build)
```

## Rules the build follows

- Section components (Header, Hero, Tiles, Intro, Services, Feature, Portfolio, Reviews, Insta, BookCta, Footer, BookBar) go in `src/components/sections/`, one BEM block each, named as in the style guide.
- Every booking button is a `<BookLink at="…">`. Don't hand-write booking URLs.
- Put hover styles inside `@media (hover: hover)`. The rose focus ring comes from `base.css`. Don't override it.
- Pastels are backgrounds only. Text uses `--color-text`, `--color-ink`, `--color-muted` or `--color-rose-text`.
- Never invent prices, ratings, awards, stylist details, hours, addresses or phone numbers. Use `<Todo>` for anything the brief doesn't supply.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

Node ≥ 22.12.
