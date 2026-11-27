# Embodied AI City Playbook (EACP): team MVP

A web playbook that gives city staff a shared mental model of embodied AI (robots, drones, autonomous vehicles) across 10 city sectors: which technologies exist, likely and black swan risks, which regulations apply around the world, and documented cases on a map. Built by the CMU Heinz Policy Innovation Lab team for the Bloomberg Center for Government Excellence (GovEx).

This folder is the version the team shares with our GovEx partner. It has no accounts or personal features. Chris Oueis keeps a fuller working version (sign-in, Share, MyEACP, a photo-real 3D city) in a separate repository; shared features are built there first and copied here.

Static site: Astro, TypeScript, plain CSS, React Three Fiber for the 3D world, MapLibre GL for the map. No server, database, accounts or API keys.

## What's in it
- **Playbook:** choose a sector, then four steps:
  - **Overview:** a short summary, then the sector's technologies as cards above a 3D world. Pick a card or a label in the world to read how it operates, where it runs and what happened when cities adopted it, with sources.
  - **Risks:** likely, black swan and looking ahead, filtered by technology. Risk cards sit across the top; the selected risk reads full width below, with Previous and Next.
  - **Regulations:** Global, Federal, State, City and local, and Standards layers, plus gaps.
  - **On the map:** the sector's cases and places, inside the flow.
- **Toolkit:** the team's mental model as a cycle (Understand the tech; Assess risks and reversibility; Run a small time-boxed experiment; Decide, adapt or roll back), then tools cities have used or are piloting, with sources, and the team's three proposals.
- **Map:** every documented case worldwide.
- **Glossary:** every term from the research. Terms used anywhere in the site show their definition on hover or focus.
- **About:** sources, dates and AI use.

**What's real and what isn't:** every fact shows a source and an "as of" date. The 3D world is illustrative. Items found through web research for team review are tagged "Pending team review" (`docs/global-cases.md`, `docs/global-regulations.md`, `docs/toolkit.md`).

## Run it
Needs Node.js 22 (see `.nvmrc`).

```bash
cd chris-mvp
npm ci
npm run dev          # http://localhost:4321
```

Build and test:

```bash
npm run build
npx playwright install chromium   # first time only
npm test                          # pages, axe accessibility checks, flows, Overview 3D world, Toolkit, map
npm run check:public              # no interview notes or codes in the app
```

## Deploy on Vercel
Import this repository with **Root Directory** `chris-mvp`. Settings come from `chris-mvp/vercel.json` (Astro, `npm ci`, `npm run build`, output `dist`). No environment variables are needed. Turn on "skip deployments when there are no changes to the root directory" so commits to `vyomesh-mvp/` don't rebuild this site.

## Folder map
```
src/content/sectors/   sector content (YAML, one file per sector, schema-checked at build)
src/data/toolkit.json  Toolkit steps and tools (schema in src/lib/toolkit.ts)
src/pages/             welcome, playbook, sector steps, toolkit, map, glossary, about
src/world/             the 3D world on each Overview (from Vyomesh's MVP) and how our types are placed in it (layouts.ts)
src/lib/, src/scripts/ data, map, tooltips, glossary hovers, page scripts
src/styles/tokens.css  colors, fonts and spacing in one place
scripts/               reports, release check, static server
tests/                 Playwright + axe
docs/                  research added for team review; app-guide.md (how each part works)
```

## Credits and license
- **3D world:** Vyomesh Iyengar's design from his MVP (`../vyomesh-mvp/`), adapted to this site's colors and content.
- **License:** Apache 2.0 (`LICENSE`). Libraries and data: `THIRD_PARTY_NOTICES.md`. Map data © OpenStreetMap contributors, © OpenMapTiles; tiles by OpenFreeMap.
- **AI use** (course policy):
  - The site was written with Claude Code (Anthropic) from plans reviewed and approved by Chris, and tested by the team.
  - Sector content was turned into data by a script that copies text from the team's research docs; rows without a matched source show "Source pending".
  - The global cases, global regulations and toolkit examples were researched with Claude Code, each with a cited source, and are pending team review.
  - The team's user research synthesis was not done with AI.
