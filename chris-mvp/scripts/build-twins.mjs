#!/usr/bin/env node
/**
 * Builds the 3D city twin datasets in public/twins/<city>.json from OpenFreeMap vector tiles
 * (OpenMapTiles schema, OpenStreetMap data, ODbL). Run once with network access: `npm run twins`.
 * Output is committed so builds and tests work offline.
 *
 * Per city: buildings (footprint + height), roads (class + width), rail, water, green areas.
 * Coordinates are local metres around the city centre: x = east, z = south. Quantized to 0.1 m.
 * Building heights come from OSM (height or building:levels via OpenMapTiles' render_height).
 * Where OSM has no height, OpenMapTiles fills a default; we keep its value and mark it estimated.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PbfReader as Pbf } from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const { cities } = JSON.parse(fs.readFileSync(path.join(root, 'src/data/twin-cities.json'), 'utf8'));
const OUT = path.join(root, 'public', 'twins');
const Z = 14;
const only = process.argv.slice(2);

const tileX = (lng) => Math.floor(((lng + 180) / 360) * 2 ** Z);
const tileY = (lat) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z); };
const lng2 = (x) => (x / 2 ** Z) * 360 - 180;
const lat2 = (y) => { const n = Math.PI - (2 * Math.PI * y) / 2 ** Z; return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); };

/** Clip a polygon ring to an axis-aligned rectangle (Sutherland-Hodgman). */
function clipRing(ring, x0, y0, x1, y1) {
  let pts = ring;
  const edges = [
    [(p) => p[0] >= x0, (a, b) => { const t = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[0] <= x1, (a, b) => { const t = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[1] >= y0, (a, b) => { const t = (y0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y0]; }],
    [(p) => p[1] <= y1, (a, b) => { const t = (y1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y1]; }],
  ];
  for (const [inside, cut] of edges) {
    if (!pts.length) break;
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const ia = inside(a), ib = inside(b);
      if (ia) out.push(a);
      if (ia !== ib) out.push(cut(a, b));
    }
    pts = out;
  }
  return pts;
}

/** Clip a polyline to a rectangle; returns zero or more pieces. */
function clipLine(line, x0, y0, x1, y1) {
  const inside = (p) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
  const pieces = [];
  let cur = [];
  for (let i = 0; i < line.length; i++) {
    const p = line[i];
    if (inside(p)) { cur.push(p); continue; }
    if (cur.length) { cur.push(p); pieces.push(cur); cur = []; }
    else if (i + 1 < line.length && inside(line[i + 1])) cur.push(p);
  }
  if (cur.length > 1) pieces.push(cur);
  return pieces.filter((x) => x.length > 1);
}

const ROAD_WIDTH = { motorway: 16, trunk: 14, primary: 12, secondary: 10, tertiary: 8, minor: 7, service: 4.5, track: 3, path: 2.2, raceway: 6, busway: 7, bus_guideway: 6 };
const GREEN = new Set(['park', 'garden', 'grass', 'wood', 'forest', 'meadow', 'recreation_ground', 'cemetery', 'pitch', 'playground', 'village_green', 'golf_course', 'scrub', 'farmland']);

async function getTile(x, y) {
  const res = await fetch(`https://tiles.openfreemap.org/planet/${TILESET}/${Z}/${x}/${y}.pbf`);
  if (!res.ok) throw new Error(`tile ${x}/${y}: ${res.status}`);
  return new VectorTile(new Pbf(new Uint8Array(await res.arrayBuffer())));
}

let TILESET = '';
async function tileset() {
  const tj = await (await fetch('https://tiles.openfreemap.org/planet')).json();
  TILESET = tj.tiles[0].split('/planet/')[1].split('/')[0];
}

const q = (v) => Math.round(v * 10); // 0.1 m

/**
 * OpenMapTiles gives 5 m to buildings without any OSM height. Estimate those from the median known
 * height of neighbours within 100 m, scaled a little by footprint size, and flag them (third field = 1).
 * Estimated heights are for the picture only; the app never states them as facts.
 */
function estimateHeights(list) {
  const info = list.map((b) => {
    let cx = 0, cz = 0, area = 0;
    const n = (b.length - 3) / 2;
    for (let i = 0; i < n; i++) {
      const x0 = b[3 + 2 * i] / 10, z0 = b[4 + 2 * i] / 10;
      const j = (i + 1) % n, x1 = b[3 + 2 * j] / 10, z1 = b[4 + 2 * j] / 10;
      cx += x0; cz += z0; area += x0 * z1 - x1 * z0;
    }
    return { cx: cx / n, cz: cz / n, area: Math.abs(area / 2), unknown: b[0] === 5 && b[1] === 0 };
  });
  const known = info.map((x, i) => ({ ...x, h: list[i][0] })).filter((x) => !x.unknown);
  list.forEach((b, i) => {
    const me = info[i];
    if (!me.unknown) return;
    const near = known.filter((k) => Math.hypot(k.cx - me.cx, k.cz - me.cz) < 100).map((k) => k.h).sort((a, c) => a - c);
    const jitter = 0.8 + ((Math.abs(Math.sin(me.cx * 12.9898 + me.cz * 78.233)) * 43758.5453) % 1) * 0.4;
    let h = near.length >= 3 ? near[Math.floor(near.length / 2)] : me.area > 2000 ? 22 : me.area > 600 ? 14 : me.area > 120 ? 9 : 4;
    if (me.area < 60) h = Math.min(h, 4);
    b[0] = Math.round(Math.max(3, h * jitter) * 10) / 10;
    b[2] = 1;
  });
}

async function build(c) {
  const kx = 111320 * Math.cos((c.lat * Math.PI) / 180), kz = 110540;
  const toLocal = ([lng, lat]) => [(lng - c.lng) * kx, -(lat - c.lat) * kz];
  const h = c.half;
  const lngMin = c.lng - h / kx, lngMax = c.lng + h / kx, latMin = c.lat - h / kz, latMax = c.lat + h / kz;
  const out = { id: c.id, name: c.name, area: c.area, center: [c.lat, c.lng], half: h, buildings: [], roads: [], rail: [], water: [], green: [] };
  let tiles = 0;
  for (let x = tileX(lngMin); x <= tileX(lngMax); x++) {
    for (let y = tileY(latMax); y <= tileY(latMin); y++) {
      const vt = await getTile(x, y);
      tiles++;
      // This tile's own bounds in local metres (clip to them so neighbouring tiles don't overlap).
      const [tx0, tz0] = toLocal([lng2(x), lat2(y)]);
      const [tx1, tz1] = toLocal([lng2(x + 1), lat2(y + 1)]);
      const bx0 = Math.max(tx0, -h), bx1 = Math.min(tx1, h), bz0 = Math.max(tz0, -h), bz1 = Math.min(tz1, h);
      const layer = (name) => vt.layers[name];
      const each = (name, fn) => { const l = layer(name); if (!l) return; for (let i = 0; i < l.length; i++) fn(l.feature(i).toGeoJSON(x, y, Z)); };
      const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
      const lines = (g) => (g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []);
      const ring = (r) => clipRing(r.slice(0, -1).map(toLocal), bx0, bz0, bx1, bz1);
      const flat = (pts) => pts.flatMap((p) => [q(p[0]), q(p[1])]);

      each('building', (f) => {
        if (f.properties.hide_3d) return;
        const top = Number(f.properties.render_height ?? 0), bottom = Number(f.properties.render_min_height ?? 0);
        for (const p of polys(f.geometry)) {
          const r = ring(p[0]);
          if (r.length < 3) continue;
          out.buildings.push([Math.round(top * 10) / 10, Math.round(bottom * 10) / 10, 0, ...flat(r)]);
        }
      });
      each('transportation', (f) => {
        const cls = f.properties.class;
        if (f.properties.brunnel === 'tunnel') return;
        for (const l of lines(f.geometry)) {
          for (const piece of clipLine(l.map(toLocal), bx0, bz0, bx1, bz1)) {
            if (cls === 'rail' || cls === 'transit') out.rail.push(flat(piece));
            else if (ROAD_WIDTH[cls]) out.roads.push([cls, ROAD_WIDTH[cls], f.properties.brunnel === 'bridge' ? 1 : 0, ...flat(piece)]);
          }
        }
      });
      each('water', (f) => { for (const p of polys(f.geometry)) { const r = ring(p[0]); if (r.length > 2) out.water.push(flat(r)); } });
      const green = (f) => { for (const p of polys(f.geometry)) { const r = ring(p[0]); if (r.length > 2) out.green.push(flat(r)); } };
      each('park', green);
      each('landcover', (f) => { if (GREEN.has(f.properties.subclass) || GREEN.has(f.properties.class)) green(f); });
      each('landuse', (f) => { if (GREEN.has(f.properties.class)) green(f); });
    }
  }
  estimateHeights(out.buildings);
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, `${c.id}.json`);
  fs.writeFileSync(file, JSON.stringify(out));
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`${c.id}: ${tiles} tiles, ${out.buildings.length} buildings, ${out.roads.length} roads, ${out.water.length} water, ${out.green.length} green, ${kb} KB`);
}

await tileset();
for (const c of cities) if (!only.length || only.includes(c.id)) await build(c);
