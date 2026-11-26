/**
 * City twin geometry from the OpenStreetMap-derived datasets in public/twins/<city>.json
 * (built by scripts/build-twins.mjs). Everything is merged into a handful of meshes so a whole
 * neighborhood draws in a few calls.
 *
 * Coordinates: metres, x = east, z = south, y = up. Data is quantized to 0.1 m.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface TwinData {
  id: string; name: string; area: string; center: [number, number]; half: number;
  /** [height, minHeight, estimated(0|1), x0, z0, x1, z1, ...] (coords in decimetres) */
  buildings: number[][];
  /** [class, width, bridge(0|1), x0, z0, ...] */
  roads: (string | number)[][];
  rail: number[][];
  water: number[][];
  green: number[][];
}

export interface Segment { a: THREE.Vector2; b: THREE.Vector2; len: number; cls: string }
export interface Area { pts: THREE.Vector2[]; centroid: THREE.Vector2; area: number }
export interface Footprint { centroid: THREE.Vector2; height: number; area: number }

const pts = (flat: number[], from = 0) => {
  const out: THREE.Vector2[] = [];
  for (let i = from; i + 1 < flat.length; i += 2) out.push(new THREE.Vector2(flat[i] / 10, flat[i + 1] / 10));
  return out;
};

function polyArea(p: THREE.Vector2[]) {
  let a = 0;
  for (let i = 0; i < p.length; i++) { const j = (i + 1) % p.length; a += p[i].x * p[j].y - p[j].x * p[i].y; }
  return a / 2;
}
function centroidOf(p: THREE.Vector2[]) {
  const c = new THREE.Vector2();
  p.forEach((v) => c.add(v));
  return c.divideScalar(p.length);
}

/** Simple deterministic hash for colour variation. */
const hash = (x: number, z: number) => {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

// Facade palette: calm, real-city tones (plaster, stone, brick, glass) with no saturated colours.
const FACADES = ['#e9e4da', '#ddd6c8', '#cfc8bb', '#e4e7ea', '#d3d8de', '#c9c2b6', '#d8cfc2', '#bcc6d0', '#e8e1d3', '#c6b9a7'];

/** Extruded buildings with per-vertex facade colour and wall/roof flags for the window shader. */
export function buildingsGeometry(data: TwinData) {
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], col: number[] = [], wall: number[] = [];
  const footprints: Footprint[] = [];
  const color = new THREE.Color();
  for (const b of data.buildings) {
    const top = Math.max(2.5, b[0]), bottom = b[1];
    let ring = pts(b, 3);
    if (ring.length < 3) continue;
    let area = polyArea(ring);
    if (Math.abs(area) < 4) continue;
    if (area < 0) ring = ring.reverse(); // counter-clockwise in x/z
    area = Math.abs(area);
    const c = centroidOf(ring);
    footprints.push({ centroid: c, height: top, area });
    color.set(FACADES[Math.floor(hash(c.x, c.y) * FACADES.length)]);
    // Walls
    for (let i = 0; i < ring.length; i++) {
      const p0 = ring[i], p1 = ring[(i + 1) % ring.length];
      const ex = p1.x - p0.x, ez = p1.y - p0.y;
      const len = Math.hypot(ex, ez);
      if (len < 0.05) continue;
      const nx = ez / len, nz = -ex / len; // outward for CCW ring with z = south
      // Wound so the face points outward (checked: CCW ring in x/z, z = south).
      const quad = [
        [p0.x, bottom, p0.y, 0, bottom], [p1.x, top, p1.y, len, top], [p1.x, bottom, p1.y, len, bottom],
        [p0.x, bottom, p0.y, 0, bottom], [p0.x, top, p0.y, 0, top], [p1.x, top, p1.y, len, top],
      ];
      for (const [x, y, z, u, v] of quad) {
        pos.push(x, y, z); nor.push(nx, 0, nz); uv.push(u, v); col.push(color.r, color.g, color.b); wall.push(1);
      }
    }
    // Roof
    const tris = THREE.ShapeUtils.triangulateShape(ring, []);
    const roof = color.clone().multiplyScalar(0.82);
    for (const t of tris) {
      for (const k of [t[0], t[2], t[1]]) {
        pos.push(ring[k].x, top, ring[k].y); nor.push(0, 1, 0); uv.push(0, 0); col.push(roof.r, roof.g, roof.b); wall.push(0);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aWall', new THREE.Float32BufferAttribute(wall, 1));
  g.computeBoundingSphere();
  return { geometry: g, footprints };
}

/** Standard material with procedural windows on walls (rows every 3.4 m, bays every 3.2 m). */
export function facadeMaterial() {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.0 });
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aWall;\nvarying float vWall;\nvarying vec2 vFacade;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvWall = aWall;\nvFacade = uv;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWall;\nvarying vec2 vFacade;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (vWall > 0.5 && vFacade.y > 3.6) {
          vec2 cell = vec2(fract(vFacade.x / 3.2), fract((vFacade.y - 0.6) / 3.4));
          float win = step(0.18, cell.x) * step(cell.x, 0.82) * step(0.28, cell.y) * step(cell.y, 0.86);
          vec3 glass = vec3(0.36, 0.43, 0.52) + 0.06 * fract(sin(dot(floor(vFacade / vec2(3.2, 3.4)), vec2(12.9898, 78.233))) * 43758.5453);
          diffuseColor.rgb = mix(diffuseColor.rgb, glass, win * 0.85);
        }
        if (vWall > 0.5 && vFacade.y < 0.35) diffuseColor.rgb *= 0.78;`,
      );
  };
  return m;
}

/** Flat polygons (water, green areas) at a given height. */
export function areasGeometry(rings: number[][], y: number) {
  const geos: THREE.BufferGeometry[] = [];
  const areas: Area[] = [];
  for (const r of rings) {
    let p = pts(r);
    if (p.length < 3) continue;
    const a = polyArea(p);
    if (Math.abs(a) < 2) continue;
    if (a < 0) p = p.reverse();
    areas.push({ pts: p, centroid: centroidOf(p), area: Math.abs(a) });
    const shape = new THREE.Shape(p.map((v) => new THREE.Vector2(v.x, -v.y)));
    const g = new THREE.ShapeGeometry(shape);
    g.rotateX(-Math.PI / 2);
    g.translate(0, y, 0);
    geos.push(g);
  }
  return { geometry: geos.length ? mergeGeometries(geos) : new THREE.BufferGeometry(), areas };
}

const ROAD_TONE: Record<string, string> = {
  motorway: '#7d8590', trunk: '#7d8590', primary: '#868e99', secondary: '#8d95a0', tertiary: '#959ca6',
  minor: '#9ca3ac', service: '#a7adb5', busway: '#8a7f7a', track: '#b9b2a4', path: '#d9d3c7', raceway: '#8d95a0',
};

/** Roads as flat ribbons with per-class tone, plus centre dashes on main roads. */
export function roadsGeometry(data: TwinData) {
  const pos: number[] = [], col: number[] = [];
  const dashPos: number[] = [];
  const segments: Segment[] = [];
  const color = new THREE.Color();
  const ribbon = (line: THREE.Vector2[], width: number, y: number, out: number[], c?: THREE.Color) => {
    for (let i = 0; i + 1 < line.length; i++) {
      const a = line[i], b = line[i + 1];
      const d = new THREE.Vector2().subVectors(b, a);
      const len = d.length();
      if (len < 0.01) continue;
      const n = new THREE.Vector2(-d.y / len, d.x / len).multiplyScalar(width / 2);
      const q = [a.clone().add(n), b.clone().add(n), b.clone().sub(n), a.clone().sub(n)];
      for (const k of [0, 1, 2, 0, 2, 3]) { out.push(q[k].x, y, q[k].y); if (c) col.push(c.r, c.g, c.b); }
    }
  };
  // Draw small roads first so main roads sit on top at junctions.
  const order = ['path', 'track', 'service', 'minor', 'tertiary', 'secondary', 'primary', 'trunk', 'motorway', 'busway', 'raceway'];
  const roads = [...data.roads].sort((a, b) => order.indexOf(String(a[0])) - order.indexOf(String(b[0])));
  roads.forEach((r) => {
    const cls = String(r[0]);
    const width = Number(r[1]);
    const line = pts(r as number[], 3);
    const y = 0.06 + order.indexOf(cls) * 0.004;
    color.set(ROAD_TONE[cls] ?? '#9ca3ac');
    ribbon(line, width, y, pos, color);
    for (let i = 0; i + 1 < line.length; i++) segments.push({ a: line[i], b: line[i + 1], len: line[i].distanceTo(line[i + 1]), cls });
    if (['primary', 'secondary', 'tertiary', 'trunk'].includes(cls)) {
      // Dashed centre line: 3 m dash, 6 m gap along the polyline
      for (let i = 0; i + 1 < line.length; i++) {
        const a = line[i], b = line[i + 1];
        const len = a.distanceTo(b);
        for (let s = 1; s + 3 < len; s += 9) {
          const p0 = a.clone().lerp(b, s / len), p1 = a.clone().lerp(b, (s + 3) / len);
          ribbon([p0, p1], 0.18, y + 0.003, dashPos);
        }
      }
    }
  });
  for (const r of data.rail) ribbon(pts(r), 3.2, 0.07, pos, color.set('#7a746c'));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  const dashes = new THREE.BufferGeometry();
  dashes.setAttribute('position', new THREE.Float32BufferAttribute(dashPos, 3));
  dashes.computeVertexNormals();
  return { geometry: g, dashes, segments };
}

/** Trees scattered through green areas (instanced). Deterministic per city. */
export function treesMesh(green: Area[], limit = 1400) {
  const pts2: THREE.Vector2[] = [];
  for (const a of green) {
    if (a.area < 150) continue;
    const n = Math.min(80, Math.floor(a.area / 160));
    let tries = 0, made = 0;
    const box = new THREE.Box2().setFromPoints(a.pts);
    while (made < n && tries < n * 8 && pts2.length < limit) {
      tries++;
      const p = new THREE.Vector2(
        box.min.x + hash(a.centroid.x + tries, a.centroid.y) * (box.max.x - box.min.x),
        box.min.y + hash(a.centroid.y + tries * 1.7, a.centroid.x) * (box.max.y - box.min.y),
      );
      if (!inside(p, a.pts)) continue;
      pts2.push(p); made++;
    }
  }
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.4, 6).translate(0, 1.2, 0);
  const crownGeo = new THREE.IcosahedronGeometry(2.1, 1).translate(0, 4.2, 0);
  const trunks = new THREE.InstancedMesh(trunkGeo, new THREE.MeshStandardMaterial({ color: '#6d5a48', roughness: 1 }), pts2.length);
  const crowns = new THREE.InstancedMesh(crownGeo, new THREE.MeshStandardMaterial({ color: '#6f9460', roughness: 0.95, flatShading: true }), pts2.length);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  pts2.forEach((p, i) => {
    const s = 0.75 + hash(p.x, p.y) * 0.6;
    m.makeScale(s, s, s).setPosition(p.x, 0, p.y);
    trunks.setMatrixAt(i, m);
    crowns.setMatrixAt(i, m);
    crowns.setColorAt(i, c.set('#6f9460').offsetHSL(0, 0, (hash(p.y, p.x) - 0.5) * 0.12));
  });
  for (const t of [trunks, crowns]) { t.castShadow = true; t.receiveShadow = true; }
  const g = new THREE.Group();
  g.add(trunks, crowns);
  return g;
}

export function inside(p: THREE.Vector2, poly: THREE.Vector2[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}
