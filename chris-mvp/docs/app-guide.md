# EACP team MVP: how it works

## Pages
- `/` Welcome: the EACP wordmark over a 3D street, and **Start**.
- `/playbook/` chooses a sector (`/explore/` redirects there).
- **Sector steps** (`/sectors/<slug>/...`), with Back and Next at the bottom of each, and a breadcrumb that switches sector on the same step:
  1. **Overview** (`/sectors/<slug>/`): a short summary (stage, up to three points, why it matters, who's involved), then **type cards** above the **3D world**, with a detail panel. Cards and world stay in step through two window events (`eacp-world-select`, `eacp-world-picked`). `?type=<id>` deep-links. Old `story/`, `types/` and `city/` URLs redirect here.
  2. **Risks:** Likely, Black swan, Looking ahead. Technology chips filter the risks, using `type_ids` set from `scripts/risk-types.mjs`, the team's reading of the research for sector owners to review. Risk cards across the top, the selected risk full width below.
  3. **Regulations:** layers Global (non-US, including researched rules tagged for review), Federal, State, City and local, Standards, and Gaps.
  4. **On the map** (`/sectors/<slug>/map/`): the map locked to the sector, with a link to the full `/map/`.
- `/toolkit/`: the mental model cycle, and tools filtered by step or status. Hover or focus a tool for a one-liner; select it for examples and sources. `?tool=<id>` deep-links. `/recommendations/` redirects here.
- `/map/`: every case and place worldwide, with a sector filter, hover cards and a detail drawer. `?sector=` and `?place=` deep-link.
- `/glossary/`: terms by sector, with search. Each term has an anchor (`#g<sector>-<term>`).
- `/about/`: sources, dates, AI use, open source.

## The 3D world (`src/world/`)
- `CityWorld.tsx`, `Landscape.tsx`, `ZoneTile.tsx`, `models.tsx` and `schema.ts` come from Vyomesh's MVP (`vyomesh-mvp/src/components/world/`). They are low-poly scenes built from three.js primitives, with no model files.
- `layouts.ts` builds each sector's world at build time:
  - **Sectors 01, 05, 06, 08, 09:** Vyomesh's scene layouts (`departments/*.json`: ground, roads, zones, where his machines stand).
  - **Other sectors:** his tile layout, one tile per kind of place.
  - **Our types:** each is mapped to one of his models by name (`KIND` table) and placed in a matching zone.
- `WorldIsland.tsx` is the React island on the Overview. It loads when visible. Without WebGL it shows a short note, and the cards still work.

## Glossary hovers
`src/scripts/glossary-hover.ts` marks the first use of each glossary term in each section of a page (each tab panel counts separately). Hover or focus shows the definition in the shared tooltip (`src/scripts/popover.ts`). Terms come from `/glossary-terms.json` (`src/lib/glossary.ts`). Headings, links, buttons, tabs and maps are skipped.

## Content
- **Sector content:** `src/content/sectors/NN-slug.yaml`, validated by the zod schema in `src/lib/content.ts`. It was generated from the team's research docs by an importer that lives with those docs in Chris's research repo (neither is in this public repo). Here, edit the YAML directly, or ask Chris to re-import after a sector doc changes.
- **Toolkit content:** `src/data/toolkit.json`, validated by `src/lib/toolkit.ts`.
- Rules: copy, never invent. Every fact keeps a source and a date. The app never imports or shows interview notes.

## Sources mode
Items without a linked source show "Source pending". `npm run build:strict` leaves them out, for tests with officials.

## Deploy
Static output in `dist/`. Vercel settings are in `vercel.json` (Root Directory `chris-mvp`); any static host works. To host under a sub-path, build with `BASE_PATH=/eacp/ npm run build`.

## Accessibility
- **Target:** WCAG 2.2 AA.
- **Keyboard:** every tab list, card and 3D label works by keyboard.
- **Map:** has a list view.
- **Motion:** the header's "Reduce motion" switch, or the system setting, stops camera movement.
