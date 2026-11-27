#!/usr/bin/env node
/**
 * Prebuild step: copies MapLibre's web worker into public/vendor/ (it is loaded by URL at runtime)
 * and writes an offline world outline (Natural Earth via world-atlas) used when map tiles can't load.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
const require = createRequire(import.meta.url);
const root = path.resolve(new URL('..', import.meta.url).pathname);
const out = path.join(root, 'public', 'vendor');
fs.mkdirSync(out, { recursive: true });
const ml = path.dirname(require.resolve('maplibre-gl/package.json'));
fs.copyFileSync(path.join(ml, 'dist', 'maplibre-gl-worker.mjs'), path.join(out, 'maplibre-gl-worker.mjs'));
const world = require('world-atlas/countries-110m.json');
const geo = feature(world, world.objects.countries);
const round = (c) => (Array.isArray(c[0]) ? c.map(round) : [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100]);
for (const f of geo.features) { f.geometry.coordinates = round(f.geometry.coordinates); f.properties = {}; }
fs.writeFileSync(path.join(out, 'countries-110m.geojson'), JSON.stringify(geo));
console.log('vendor: maplibre worker + offline world outline written to public/vendor/');

