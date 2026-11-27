# Third-party notices

Black Swan's own code is under the Apache License 2.0 (see `LICENSE`). It uses these open-source packages and data. Their licenses travel with them in `node_modules/`.

| Package or data | Used for | License |
| :-- | :-- | :-- |
| [Astro](https://astro.build) | Static site generator | MIT |
| [three.js](https://threejs.org) | 3D scenes | MIT |
| [React](https://react.dev), [React Three Fiber](https://r3f.docs.pmnd.rs), [drei](https://github.com/pmndrs/drei) | The 3D world on each Overview | MIT |
| [MapLibre GL JS](https://maplibre.org) | Interactive global map | BSD-3-Clause |
| [OpenFreeMap](https://openfreemap.org) tiles, data from [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors | Basemap (loaded at runtime, attribution shown on the map) | Tiles free to use; data ODbL |
| [topojson-client](https://github.com/topojson/topojson-client) | Converting the offline outline at build time | ISC |
| [world-atlas](https://github.com/topojson/world-atlas) | Offline world outline, from [Natural Earth](https://www.naturalearthdata.com) (public domain) | ISC |
| [Source Serif 4](https://github.com/adobe-fonts/source-serif), [Work Sans](https://github.com/weiweihuanghuang/Work-Sans), via [Fontsource](https://fontsource.org) | Typefaces | SIL Open Font License 1.1 |
| [yaml](https://github.com/eemeli/yaml) | Reading content files | ISC |
| [zod](https://zod.dev) | Content schema validation | MIT |
| [Playwright](https://playwright.dev), [axe-core](https://github.com/dequelabs/axe-core) | Tests (development only) | Apache-2.0, MPL-2.0 |

The 3D scenes are built from code. The Welcome backdrop is in `src/scenes/`; scene posters in `public/posters/` are rendered from that code by `scripts/render-posters.mjs`.

## 3D world on the Overview (Vyomesh Iyengar's MVP)
`src/world/` is ported from Vyomesh Iyengar's MVP in this repository (`vyomesh-mvp/src/components/world/` and the scene layouts in `vyomesh-mvp/src/data/departments/`). Changes: EACP colors and fonts, our sourced technology types placed in his scenes, labels only for zones in use, and a tile layout for sectors he had not laid out.
