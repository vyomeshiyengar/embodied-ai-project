# Third-party notices

Black Swan's own code is under the Apache License 2.0 (see `LICENSE`). It uses these open-source packages and data. Their licenses travel with them in `node_modules/`.

| Package or data | Used for | License |
| :-- | :-- | :-- |
| [Astro](https://astro.build) | Static site generator | MIT |
| [three.js](https://threejs.org) | 3D scene | MIT |
| [MapLibre GL JS](https://maplibre.org) | Interactive global map | BSD-3-Clause |
| [OpenFreeMap](https://openfreemap.org) tiles, data from [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors | Basemap (loaded at runtime, attribution shown on the map) | Tiles free to use; data ODbL |
| [topojson-client](https://github.com/topojson/topojson-client) | Converting the offline outline at build time | ISC |
| [world-atlas](https://github.com/topojson/world-atlas) | Offline world outline, from [Natural Earth](https://www.naturalearthdata.com) (public domain) | ISC |
| [Source Serif 4](https://github.com/adobe-fonts/source-serif), [Work Sans](https://github.com/weiweihuanghuang/Work-Sans), via [Fontsource](https://fontsource.org) | Typefaces | SIL Open Font License 1.1 |
| [yaml](https://github.com/eemeli/yaml) | Reading content files | ISC |
| [zod](https://zod.dev) | Content schema validation | MIT |
| [Playwright](https://playwright.dev), [axe-core](https://github.com/dequelabs/axe-core) | Tests (development only) | Apache-2.0, MPL-2.0 |

The 3D scenes are built from code in `src/scenes/` (no downloaded models). Scene posters in `public/posters/` are rendered from that code by `scripts/render-posters.mjs`.

## GeoNames (via all-the-cities)
The world city list used for place search (`public/vendor/cities.json`, generated at build time) comes from [GeoNames](https://www.geonames.org), licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). It is read from the [`all-the-cities`](https://github.com/zeke/all-the-cities) npm package (MIT License). We keep cities of 15,000 or more people and only the name, country, US state, coordinates and population.

## OpenStreetMap and OpenMapTiles (city twin data)
`public/twins/*.json` is derived from OpenStreetMap data (© OpenStreetMap contributors, [Open Database License](https://opendatacommons.org/licenses/odbl/)) as served in OpenFreeMap's vector tiles, which use the [OpenMapTiles](https://openmaptiles.org/) schema (© OpenMapTiles). The files are a derived database and are shared under the ODbL. The twin shows this credit on screen. Building heights marked as estimated in these files are not from OpenStreetMap.
