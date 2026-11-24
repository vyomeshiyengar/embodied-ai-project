# Physical AI in Cities — prototype v0.1

Interactive explorer for how physical/embodied AI shows up in city departments.
Pick a department, then move through four tabs:

| Tab | What it shows |
| --- | --- |
| **Types** | A 3D city diorama. Each zone is a tile; each type is a clickable model. Side panel walks through every type (Previous / Next). |
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

1. Copy `src/data/departments/_template.ts` to `src/data/departments/<id>.ts`.
2. Fill it in, following the four sections of your source doc (Types, Risks, Regulation, Case studies).
3. Register it in `src/data/departments/index.ts`:
   ```ts
   import autonomousMobility from './autonomous-mobility';
   export const departments = [urbanLogistics, parks, healthcare, autonomousMobility];
   ```

The 3D world, tables, filters, map and tab counts are all generated from the data. TypeScript will flag missing fields.

### Field notes

- **`types.zones[].setting`** — picks the tile's look: `street`, `sidewalk`, `bikelane`, `air`, `hospital`, `home`, `care-home`, `warehouse`, `industrial`, `park`, `field`, `plaza`, `beach`, `water`, `trail`, `network`.
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
