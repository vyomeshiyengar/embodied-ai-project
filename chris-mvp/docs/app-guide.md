# Embodied AI City Playbook: app guide (`chris-mvp/`)

A static, multi-page website: a playbook that gives city staff a shared mental model of embodied AI across 10 city sectors. Built with [Astro](https://astro.build) (with its client router for page transitions), plain CSS and small TypeScript modules, [three.js](https://threejs.org) for the 3D scenes, and [MapLibre GL](https://maplibre.org) for the global map. No server, no database, no API keys.

## How it's organized
- `/` Welcome: the EACP wordmark over a dimmed 3D city, then **Sign in** or **Continue as guest**.
- The top menu is **Playbook**, **Map**, **Share** and **MyEACP**, with Glossary, Recommendations (draft) and About under "More".
- `/playbook/` chooses a sector (`/explore/` redirects there). Each sector is a guided flow of five steps: Overview, **In the city**, Risks, Regulations, then On the map. Every page starts with categories to click, then a diagram, then short facts. Back and Next sit at the bottom of every step; the breadcrumb switches sector on the same step.
- **Risks** has no matrix. Pick Likely, Black swan or Looking ahead, then narrow by technology. Which technologies each risk applies to comes from `scripts/risk-types.mjs`, the team's reading of each sector doc, for owners to review.
- `/map/` is the global map: every case and place from the research plus posts shared in this browser, with hover previews and a detail drawer. `?sector=01`, `?place=<pin id>` and `?post=<post id>` deep-link into it.
- `/share/` is the city exchange: a five-step composer (any place on Earth, kind, technology, story, review with related research) and a feed of posts from other cities with replies, "seen this in my city too", share links and print.
- `/myeacp/` is the signed-in city's workspace: city profile, contributions, research near the city, the city's own technology board and fleet emergency contacts, saved items and questions, with export and import.

## Demo sign-in, sharing and MyEACP
Sign-in is optional: guests can browse the whole playbook and map. Signing in unlocks Share, saving and MyEACP. **It is a demo, not security:** the credentials are hardcoded in `src/lib/site.ts` and ship to every browser.

| Username | Password |
| :-- | :-- |
| `demo` | `demo` |

- Everything a user creates (profile, posts, replies, saved items, technologies, contacts) is saved in their own browser (`localStorage`, key `eacp-workspace-v1`). `src/lib/workspace-store.ts` is the one place to swap in a shared backend later. Nothing is seeded.
- Posts show "Added by" a city and department (or role), never a person, and are always marked unverified. Research pins show their sources instead. The composer blocks emails and phone numbers.
- **Shared use cases** need a link to the article or official page. They can add an image link, or a YouTube or Vimeo link (embedded through `youtube-nocookie.com` or Vimeo's do-not-track player; other URLs are refused, see `src/lib/media.ts`), or upload a photo. Uploads are resized, re-encoded (which strips location metadata) and kept in this browser's IndexedDB only (`src/lib/media-store.ts`); share links never carry them. Pins say "Approximate location" until they are dragged, clicked or typed to the exact spot.
- **Share links** carry a post inside the link itself (compressed JSON after `#p=`), so it never passes through a server. Anything opened from a link is validated and rendered as plain text (`src/lib/share-link.ts`, `sanitizePost`).
- **Places:** `scripts/copy-vendor.mjs` writes `public/vendor/cities.json`, the 24,000 cities of 15,000+ people from GeoNames (via the `all-the-cities` package). It loads only when someone searches. A pin can also go anywhere on the map or by coordinates.

## In the city: the 3D city twin
`/sectors/<slug>/city/` shows a real, busy neighborhood in one of ten sample cities (San Francisco, Boston, San Antonio, London, Madrid, Kyiv, Nairobi, Bogotá, Buenos Aires, Tokyo; list in `src/data/twin-cities.json`) with the sector's technologies working in it. It replaces the old "See it in action" and "Types" pages, which now redirect here.
- **Data:** `npm run twins` (`scripts/build-twins.mjs`) reads OpenFreeMap vector tiles (OpenMapTiles schema, OpenStreetMap data) and writes `public/twins/<city>.json`: buildings with heights, roads, rail, water and green areas, in local metres. The files are committed, so builds work offline. Buildings with no height in OpenStreetMap get an estimate from their neighbours, flagged in the data.
- **Rendering:** `src/scenes/twin/` (three.js): merged building meshes with a procedural window shader, sun with soft shadows that tighten around the use case you zoom into, sky, image-based light and ambient occlusion (off on phones and with `?lowfx=1`).
- **Technologies** are procedural models at real scale (`models.ts`). `model-map.ts` picks the model from the type name. `placement.ts` puts each type somewhere that matches its zone (street, sidewalk, air, building, park, water). These scenes are **illustrative** and labeled so.
- **Documented cases** are research map pins within 25 km of the city. Those inside the neighborhood are drawn at their real location; the others are listed with their distance. All show sources and an as-of date.
- **Keyboard and screen readers:** every use case is a button (pins and the side list). Escape returns to the city view. Reduced motion stops the orbit and moving models and makes camera moves instant.
- **Credits:** the interaction grammar (aerial view, zoom into a place, details panel, filters that light up the scene) comes from a public Instagram reel by Horyx Studio. The model catalog idea comes from Vyomesh Iyengar's MVP (`vyomesh-mvp/` in this repo). Code here is new.

## Map tiles
The basemap is [OpenFreeMap](https://openfreemap.org) (OpenStreetMap data): free, no key, no account. If tiles can't load, the map falls back to bundled Natural Earth outlines. `npm run dev` and `npm run build` first run `scripts/copy-vendor.mjs`, which copies MapLibre's web worker and the offline outline into `public/vendor/` (generated, not committed).

## Run it

Requires Node.js 22 (see `.nvmrc`; 20.19+ also works locally).

```bash
cd chris-mvp
npm ci
npm run dev          # http://localhost:4321 with live reload
```

Build the static site and serve it:

```bash
npm run build        # writes dist/
npm run serve        # serves dist/ at http://localhost:4321
```

`dist/` is plain HTML, CSS and JS. The demo is hosted on Vercel (below), but any static host works (GitHub Pages, a JHU or city web server, S3, Netlify). To host under a sub-path, set it at build time, for example `BASE_PATH=/eacp/ npm run build`.

## Test

```bash
npm run build
npx playwright install chromium   # first time only, outside the Claude Code cloud sandbox
npm test                          # every page loads, axe checks, step flow, switchers, 3D story, map, sign-in and sharing
npm run content:report            # counts per sector, unsourced items, fact-check flags
npm run check:public              # release check: no interview notes or interview codes in the app
```

## Sources mode

Every fact shows its source links and an "as of" date. Items without a linked source show "Source pending" in a normal build. For tests with officials and for handoff, build in strict mode, which leaves those items out:

```bash
npm run build:strict
```

## Update content

Content lives in `src/content/sectors/NN-slug.yaml`, one file per sector, and is validated by the schema at build time. The YAML was generated from the team's sector research docs by an importer that lives with those docs in Chris's research repo (neither is in this public repo). Here, edit the YAML directly or ask Chris to re-import after a sector doc changes. `docs/global-cases.md` holds the global cases added for sector owner review.

Rules: copy, never invent. Every fact keeps a source and a date. The app never imports or shows interview notes.

## Layout

```
src/styles/tokens.css   the one token file: colors, fonts, spacing, motion
src/lib/content.ts      schema (zod) and loader; strict mode
src/lib/workspace-store.ts  browser store for MyEACP and Share (one interface, swap for a backend)
src/lib/share-link.ts   encode and decode posts in share links
src/lib/catalog.ts      small index of sectors, types and risks for client scripts
src/components/         wordmark, sector flow header, step nav, sources, save button, global map
src/scripts/            switcher, map-core (MapLibre setup), global map, city search, share, MyEACP, post cards
src/scenes/street/      Welcome backdrop scene
src/scenes/twin/        3D city twin: geometry, models, placement, renderer
src/pages/              welcome, playbook, sector pages (overview, city, risks, regulations), map, share, myeacp, glossary, recommendations, about
scripts/                risk-types.mjs (risk-to-technology table), content report, public check, posters, vendor copy, static server
tests/                  Playwright + axe
```

## Accessibility

Target: WCAG 2.2 AA. Pages work without JavaScript, the 3D story has a "Read as text" mode and poster fallbacks, the map has a list view, and the header's "Reduce motion" switch (or the OS setting) stops camera movement.

## Deploy on Vercel

The site is fully static, so Vercel only builds it and serves `dist/`. No adapter, server functions, database or secrets. Settings live in `vercel.json` (build commands, cache and security headers, trailing slashes) and travel with the app.

1. In Vercel: **Add New, then Project**, and import this GitHub repository.
2. Set **Root Directory** to `chris-mvp`. Vercel then picks up `vercel.json` (framework Astro, `npm ci`, `npm run build`, output `dist`). Node 22 comes from `package.json` `engines`.
3. Deploy. Every push to a branch gets a preview URL; the production branch gets the main URL.

Optional settings:
- **Strict sources** (hide every unsourced or unconfirmed item, for tests with officials and handoff): add the environment variable `STRICT_SOURCES` = `1` to the environment you want (e.g. Production) and redeploy. Leave it unset for working demos.
- **Preview protection:** Vercel may require a Vercel login to open preview URLs. Share the production URL for demos, or change Deployment Protection in the project settings.
- **Search engines:** `vercel.json` sends `X-Robots-Tag: noindex` while this is a prototype with draft content. Remove that header at public release.

## Handoff notes

- License: Apache 2.0 (`LICENSE`). Third-party licenses: `THIRD_PARTY_NOTICES.md`. AI use: see the AI use section in `README.md`.
