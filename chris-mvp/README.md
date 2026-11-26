# Chris's MVP: Embodied AI City Playbook (EACP)

A multi-page web playbook that gives city staff a shared mental model of embodied AI (robots, drones, autonomous vehicles) across 10 city sectors: what types exist, likely and black swan risks, which regulations apply and where the gaps are, and documented cases on a map.

**Live:** https://black-swan-playbook.vercel.app
Sign in with `demo` / `demo`, or continue as a guest. Guests can browse everything; signing in unlocks Share, saving and MyEACP. The demo sign-in is not security: the credentials ship to every browser.

Static site: Astro, TypeScript, plain CSS, three.js for the 3D city and MapLibre GL for the map. No server, database, accounts or API keys.

## What's in it
- **Playbook:** choose a sector, then five steps: Overview, In the city, Risks, Regulations, On the map.
- **In the city:** a 3D twin of a busy neighborhood in one of ten sample cities (San Francisco, Boston, San Antonio, London, Madrid, Kyiv, Nairobi, Bogotá, Buenos Aires, Tokyo), built from OpenStreetMap data, with the sector's technologies working in it.
- **Risks:** likely, black swan and looking ahead, filtered by technology. No likelihood × severity matrix.
- **Map:** every case and place from the research, worldwide.
- **Share:** cities post a use case (with a source link, optional photo or video, and a precise or approximate pin). Posts show "Added by" a city and department, never a person, and are marked unverified.
- **MyEACP:** the signed-in city's workspace: profile, contributions, saved items.
- Glossary, Recommendations (draft) and About sit under "More".

**What's real and what isn't:**
- Every fact shows a source link and an "as of" date.
- The technology scenes in the 3D city are illustrative and labeled so.
- Documented cases come only from sourced research pins.
- Everything users create stays in their own browser. Nothing is seeded.

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
npm test                          # pages load, axe accessibility checks, flows, 3D city, map, sharing
npm run check:public              # no interview notes or codes in the app
```

## Folder map
```
src/content/sectors/   sector content (YAML, one file per sector, schema-checked at build)
src/pages/             welcome, playbook, sector steps, map, share, myeacp, glossary, recommendations, about
src/scenes/twin/       3D city twin (three.js)
src/lib/, src/scripts/ data, stores, map and page scripts
src/styles/tokens.css  colors, fonts, spacing in one place
public/twins/          city geometry from OpenStreetMap (committed)
scripts/               risk-to-technology table, reports, release check, twin builder, static server
tests/                 Playwright + axe
docs/app-guide.md      full guide: how each part works, content updates, deploy on Vercel
docs/global-cases.md   25 sourced global cases, pending sector owner review
```

## Not included here
- **Research docs and interview notes:** kept in the team's Drive. The app never imports or shows interviews.
- **The Google photo-real 3D city:** in progress in Chris's repo, not in this copy.

## AI use
Per course policy, AI use is cited here:
- **Code:** the app was written with Claude Code (Anthropic), from plans reviewed and approved by Chris, and tested by the team.
- **Content import:** sector content was turned into data by a script that copies text from the team's research docs. Rows without a matched source show "Source pending".
- **Risk mapping:** the risk-to-technology mapping (`scripts/risk-types.mjs`) was proposed by Claude Code for sector owners to review.
- **Global cases:** `docs/global-cases.md` was researched with Claude Code. Every case has a cited source, and all are pending team review.
- **Not done with AI:** the team's user research synthesis.

Commits made with Claude Code carry a `Co-Authored-By` trailer.

## Credits and license
- **License:** Apache 2.0 (`LICENSE`).
- **Third-party:** libraries and data in `THIRD_PARTY_NOTICES.md`. Map data © OpenStreetMap contributors, © OpenMapTiles; tiles by OpenFreeMap.
- **Media:** openly licensed images are credited where they appear.
- **3D city design:**
  - the interaction ideas come from a public Instagram reel by Horyx Studio;
  - the technology catalog idea comes from Vyomesh's MVP (`../vyomesh-mvp/`).
