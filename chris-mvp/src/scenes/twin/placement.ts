/**
 * Where each technology appears in a city twin. Automatic and deterministic: a type's zone
 * (street, sidewalk, air, building, park, water) picks a matching place in the real street plan,
 * spread out so use cases don't pile up. These scenes are illustrative and labeled as such.
 */
import * as THREE from 'three';
import type { Segment, Area, Footprint } from './geometry';

export type Zone = 'street' | 'sidewalk' | 'air' | 'building' | 'water' | 'park';
export type Motion = 'drive' | 'walk' | 'fly' | 'float' | 'static';

export interface Placement {
  anchor: THREE.Vector3;
  /** Back-and-forth route for vehicles and robots, or a loop centre for drones and boats. */
  path: THREE.Vector3[];
  motion: Motion;
  radius?: number;
}

export interface Candidates { segments: Segment[]; green: Area[]; water: Area[]; footprints: Footprint[]; half: number }

const MAIN = new Set(['primary', 'secondary', 'tertiary', 'minor', 'trunk']);

export function place(zones: Zone[], c: Candidates, motionFor: (i: number) => Motion): Placement[] {
  const R = c.half * 0.72;
  const within = (v: THREE.Vector2) => Math.abs(v.x) < R && Math.abs(v.y) < R;
  const placed: THREE.Vector2[] = [];
  const spread = <T>(list: T[], at: (t: T) => THREE.Vector2): T | undefined => {
    let best: T | undefined, score = -1;
    const step = Math.max(1, Math.floor(list.length / 300));
    for (let i = 0; i < list.length; i += step) {
      const p = at(list[i]);
      if (!within(p)) continue;
      const d = placed.length ? Math.min(...placed.map((q) => q.distanceTo(p))) : 1000 - p.length();
      if (d > score) { score = d; best = list[i]; }
    }
    return best;
  };

  const roads = c.segments.filter((s) => MAIN.has(s.cls) && s.len > 35);
  const paths = c.segments.filter((s) => s.cls === 'path' && s.len > 14);
  const greens = c.green.filter((a) => a.area > 400);
  const waters = c.water.filter((a) => a.area > 300);
  const tall = c.footprints.filter((f) => f.height > 14 && f.area > 300);
  const mid = (s: Segment) => s.a.clone().add(s.b).multiplyScalar(0.5);

  return zones.map((zone, i) => {
    const motion = motionFor(i);
    let z: Zone = zone;
    if (z === 'water' && !waters.length) z = greens.length ? 'park' : 'street';
    if (z === 'park' && !greens.length) z = 'sidewalk';
    if (z === 'sidewalk' && !paths.length) z = 'street';

    if (z === 'street' || z === 'sidewalk' || z === 'building') {
      const list = z === 'sidewalk' ? paths : roads.length ? roads : c.segments;
      const s = spread(list, mid) ?? list[0];
      const d = new THREE.Vector2().subVectors(s.b, s.a).normalize();
      const side = new THREE.Vector2(-d.y, d.x);
      // Keep to the right-hand lane for vehicles; buildings: stand at the kerb facing the building line.
      const off = z === 'street' ? 1.9 : z === 'building' ? 7 : 0;
      const a = s.a.clone().addScaledVector(side, off), b = s.b.clone().addScaledVector(side, off);
      const m = a.clone().add(b).multiplyScalar(0.5);
      placed.push(m);
      const still = motion === 'static' || z === 'building';
      return {
        anchor: new THREE.Vector3(m.x, 0, m.y),
        path: still ? [new THREE.Vector3(m.x, 0, m.y)] : [new THREE.Vector3(a.x, 0, a.y), new THREE.Vector3(b.x, 0, b.y)],
        motion: still ? 'static' : motion,
      };
    }
    if (z === 'air') {
      const f = spread(tall.length ? tall : c.footprints, (x) => x.centroid);
      const p = f?.centroid ?? new THREE.Vector2();
      placed.push(p);
      const y = Math.max(45, (f?.height ?? 30) + 20);
      return { anchor: new THREE.Vector3(p.x, y, p.y), path: [new THREE.Vector3(p.x, y, p.y)], motion: 'fly', radius: 28 };
    }
    const area = spread(z === 'water' ? waters : greens, (a) => a.centroid);
    const p = area?.centroid ?? new THREE.Vector2();
    placed.push(p);
    return {
      anchor: new THREE.Vector3(p.x, 0, p.y),
      path: [new THREE.Vector3(p.x, 0, p.y)],
      motion: z === 'water' ? 'float' : motion === 'static' ? 'static' : 'walk',
      radius: z === 'water' ? Math.min(14, Math.sqrt(area?.area ?? 400) * 0.25) : 5,
    };
  });
}
