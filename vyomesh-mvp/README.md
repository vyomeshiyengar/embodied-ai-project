# Physical AI in Cities — prototype v0.1

Interactive explorer for how physical/embodied AI shows up in city departments.
Pick a department, then move through four tabs:

| Tab | What it shows |
| --- | --- |
| **Types** | A 3D world: one continuous environment per department (a park, a city district, a hospital campus and neighborhood), or optionally separate zone tiles. Each type is a clickable model; the side panel walks through every type (Previous / Next). |
| **Risks** | Table of current risks, and a toggle to black-swan scenarios. |
| **Regulations** | Laws filtered by **Federal / State / City** (plus Outside US), and the "gaps nothing covers" list. |
| **Case studies** | World map with numbered pins, region filters, Map/List toggle, and links back into Types/Regulations. |

Stack: Vite + React 18 + TypeScript, react-three-fiber/drei (3D), d3-geo + world-atlas/us-atlas (map). No backend.

## Run it

```bash
npm install
npm run dev          # local dev server
npm run build        # production build -> dist/
npm run build:single # one self-contained HTML file -> dist-single/index.html
```

URLs are shareable: `#/<department>/<tab>/<item>`, e.g. `#/healthcare/types/companions` or `#/parks/cases/singapore`.

## Adding a department (the only thing you should need to touch)

All 10 sectors are listed in `src/data/departments/index.ts` (`SECTORS`). Five are live (01 Autonomous Mobility, 05 Urban Logistics & Delivery, 06 Construction & Public Works, 08 Parks & Public Space, 09 Healthcare & Social Services); the others show as greyed-out "Coming soon" buttons in the department row.

1. Copy `src/data/departments/_template.ts` to `src/data/departments/<id>.ts`.
2. Fill it in, following the four sections of your source doc (Types, Risks, Regulation, Case studies).
3. In `src/data/departments/index.ts`, import it and set it as that sector's `department`:
   ```ts
   import sanitation from './sanitation';
   { number: '04', name: 'Sanitation & Waste Management', department: sanitation },
   ```

Sections that haven't been researched yet can be left empty (`blackSwans: []`, `gaps: []`, `places: []`); the app shows a "not researched yet" note instead of an empty table.

### Field notes

- **Optional extras** (shown only when present): `likelihood` / `severity` on risks and black swans, `realWorldCase` on black swans, `outlook` ("How it may progress") on types, `caseStudies.scenarios` (best / worst / surprise case and what a city should do, by horizon), and `sources` (a collapsible list at the bottom of the page).

- **`types.layout`** — `'landscape'` (one continuous environment, used by all three departments) or `'tiles'` (one square per zone; the default, and the easiest for a first draft of a new department). For a landscape, give every zone an `area: { x, z, w, d }` on a 36 × 28 ground (x = left/right, z = back/front), set `theme` to `'park'` (grass and footpaths) or `'city'` (pavement plus `roads`), and give airspace zones a `below` setting (e.g. `'suburb'`, `'downtown'`) for what to draw underneath.

- **`types.zones[].setting`** — picks the zone's look: `street`, `sidewalk`, `bikelane`, `air`, `hospital`, `home`, `care-home`, `warehouse`, `industrial`, `park`, `field`, `plaza`, `beach`, `water`, `trail`, `network`, `forest`, `golf`, `parking`, `visitor-center`, `suburb`, `downtown`.
- **`types.items[].model`** — picks the 3D model: `sidewalk-robot`, `hybrid-robot`, `delivery-van`, `drone`, `drone-hub`, `warehouse-robot`, `humanoid`, `quadruped`, `mower`, `line-painter`, `patrol-robot`, `boat`, `sand-rover`, `sensor-pole`, `cleaning-robot`, `hospital-cart`, `surgical-robot`, `telepresence`, `uv-robot`, `companion`, `exoskeleton`, `network-tower`. Reuse one if nothing fits; to add one, extend `ModelKind` in `src/data/schema.ts` and add a `case` in `src/components/world/models.tsx`.
- **`regulation.laws[].levels`** — `['Federal' | 'State' | 'City' | 'International']`; a law can sit in several. `authority` keeps the original wording.
- **`caseStudies.places[].locations`** — one or more `{ label, lat, lng }` pins. Optional `relatedTypeIds` / `relatedRegulationIds` add jump-links in the detail card. Optional `detail` adds a full write-up (deployed / where, what happened, impact on the community, response, what changed), written in full sentences, and a "Full case study" marker.
- **`accent`** — department color used on the 3D models.

## Structure

```
src/
  data/
    schema.ts                 # content types (the contract)
    regions.ts                # map region filters
    departments/
      index.ts                # registry
      _template.ts            # copy this for a new department
      urban-logistics.ts      # 05
      parks.ts                # 08
      healthcare.ts           # 09
  components/
    world/                    # 3D diorama (CityWorld, ZoneTile, models)
    views/                    # TypesView, RisksView, RegulationView, CaseStudiesView, WorldMap
  router.ts                   # tiny hash router
  App.tsx                     # department picker + tabs
  styles/global.css           # design tokens + all styles
```

## Dropping into an existing codebase

Everything is self-contained under `src/`. To embed as a page in another React app, render `<App />` (or the individual views with a `Department` object) and import `styles/global.css`. If your app has its own router, replace `router.ts`'s hash routing with your router's params; the views only need `dept`, `focus` and callbacks.
