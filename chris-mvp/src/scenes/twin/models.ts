/**
 * Embodied AI models for the city twin, built in code at real-world scale (metres).
 * Inspired by the model catalog in Vyomesh Iyengar's MVP (vyomeshiyengar/embodied-ai-project), rebuilt
 * with more detail and physically based materials. No downloaded assets.
 */
import * as THREE from 'three';

export type ModelKind =
  | 'robotaxi' | 'pod' | 'truck' | 'shuttle' | 'delivery-van' | 'sensor-van' | 'sidewalk-robot' | 'drone' | 'drone-dock'
  | 'quadruped' | 'humanoid' | 'mower' | 'boat' | 'crawler' | 'patrol-robot' | 'cleaning-robot' | 'uv-robot'
  | 'robot-arm' | 'companion' | 'control-center' | 'network-tower' | 'printer';

export interface Model {
  group: THREE.Group;
  /** Rough size in metres, used to frame the camera. */
  size: number;
  /** Moves internal parts (rotors, legs, arms). t = seconds. */
  tick?: (t: number) => void;
}

const M = {
  white: new THREE.MeshStandardMaterial({ color: '#f2f4f6', roughness: 0.35, metalness: 0.15 }),
  silver: new THREE.MeshStandardMaterial({ color: '#c8ced6', roughness: 0.3, metalness: 0.6 }),
  dark: new THREE.MeshStandardMaterial({ color: '#23272e', roughness: 0.5, metalness: 0.3 }),
  glass: new THREE.MeshStandardMaterial({ color: '#41566e', roughness: 0.12, metalness: 0.55 }),
  rubber: new THREE.MeshStandardMaterial({ color: '#1b1c1f', roughness: 0.9 }),
  accent: new THREE.MeshStandardMaterial({ color: '#0077d8', roughness: 0.4, metalness: 0.2 }),
  navy: new THREE.MeshStandardMaterial({ color: '#002d72', roughness: 0.45, metalness: 0.2 }),
  gold: new THREE.MeshStandardMaterial({ color: '#f1c400', roughness: 0.4, metalness: 0.3, emissive: '#5a4800', emissiveIntensity: 0.2 }),
  lamp: new THREE.MeshStandardMaterial({ color: '#fff6d8', emissive: '#fff2c0', emissiveIntensity: 1.2 }),
  grey: new THREE.MeshStandardMaterial({ color: '#8b939e', roughness: 0.6, metalness: 0.4 }),
  orange: new THREE.MeshStandardMaterial({ color: '#e8833a', roughness: 0.55 }),
};

const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0, r = 0) => {
  const g = r > 0 ? roundedBox(w, h, d, r) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(x, y, z);
  return mesh;
};
const cyl = (rt: number, rb: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 20) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  mesh.position.set(x, y, z);
  return mesh;
};
function roundedBox(w: number, h: number, d: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: Math.min(r, h * 0.2), bevelSize: Math.min(r, h * 0.2) * 0.6, bevelSegments: 2, curveSegments: 6 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -h / 2, 0);
  return g;
}
const wheels = (g: THREE.Group, positions: [number, number][], r: number, w: number) => {
  for (const [x, z] of positions) {
    const t = cyl(r, r, w, M.rubber, x, r, z, 18);
    t.rotation.z = Math.PI / 2;
    const hub = cyl(r * 0.55, r * 0.55, w * 1.02, M.silver, x, r, z, 12);
    hub.rotation.z = Math.PI / 2;
    g.add(t, hub);
  }
};
const lidar = (g: THREE.Group, y: number, z = 0) => {
  g.add(cyl(0.22, 0.26, 0.18, M.dark, 0, y, z), cyl(0.18, 0.18, 0.12, M.glass, 0, y + 0.14, z));
};

/** Vehicles face +z (forward). */
function car(kind: 'robotaxi' | 'pod' | 'delivery-van' | 'sensor-van') {
  const g = new THREE.Group();
  if (kind === 'pod') {
    g.add(box(1.9, 1.7, 3.6, M.white, 0, 1.25, 0, 0.35));
    g.add(box(1.94, 0.7, 3.0, M.glass, 0, 1.55, 0, 0.2));
    g.add(box(1.96, 0.12, 3.62, M.accent, 0, 0.62, 0));
    wheels(g, [[-0.9, 1.2], [0.9, 1.2], [-0.9, -1.2], [0.9, -1.2]], 0.36, 0.26);
    lidar(g, 2.15);
    return { group: g, size: 4 };
  }
  if (kind === 'delivery-van' || kind === 'sensor-van') {
    g.add(box(1.9, 2.2, 5.4, M.white, 0, 1.55, -0.2, 0.15));
    g.add(box(1.86, 1.0, 1.2, M.glass, 0, 1.9, 2.25, 0.1));
    g.add(box(1.92, 0.14, 5.42, kind === 'sensor-van' ? M.gold : M.accent, 0, 1.0, -0.2));
    wheels(g, [[-0.92, 1.8], [0.92, 1.8], [-0.92, -1.8], [0.92, -1.8]], 0.4, 0.3);
    lidar(g, 2.75, 1.6);
    if (kind === 'sensor-van') { g.add(cyl(0.05, 0.05, 1.2, M.grey, 0.5, 3.2, -1.5), box(0.5, 0.3, 0.3, M.dark, 0.5, 3.85, -1.5)); }
    return { group: g, size: 6 };
  }
  // Robotaxi: a retrofitted crossover with roof sensors
  g.add(box(1.85, 0.85, 4.7, M.white, 0, 0.78, 0, 0.25));
  g.add(box(1.7, 0.62, 2.6, M.glass, 0, 1.45, -0.2, 0.2));
  g.add(box(1.72, 0.08, 2.4, M.white, 0, 1.8, -0.2));
  g.add(box(1.88, 0.1, 4.72, M.accent, 0, 0.72, 0));
  for (const x of [-0.8, 0.8]) g.add(box(0.3, 0.12, 0.05, M.lamp, x, 0.85, 2.36));
  wheels(g, [[-0.9, 1.45], [0.9, 1.45], [-0.9, -1.45], [0.9, -1.45]], 0.36, 0.25);
  lidar(g, 2.0, -0.2);
  for (const x of [-0.95, 0.95]) g.add(box(0.12, 0.18, 0.25, M.dark, x, 1.5, 0.9));
  return { group: g, size: 5 };
}

function make(kind: ModelKind): Model {
  const g = new THREE.Group();
  switch (kind) {
    case 'robotaxi': case 'pod': case 'delivery-van': case 'sensor-van':
      return car(kind);
    case 'truck': {
      g.add(box(2.5, 2.8, 2.6, M.white, 0, 2.0, 5.2, 0.2), box(2.45, 1.0, 0.1, M.glass, 0, 2.6, 6.52));
      g.add(box(2.6, 3.4, 11, M.silver, 0, 2.35, -1.6, 0.05), box(2.62, 0.18, 11, M.accent, 0, 1.2, -1.6));
      wheels(g, [[-1.15, 5.4], [1.15, 5.4], [-1.15, 3.4], [1.15, 3.4], [-1.15, -5], [1.15, -5], [-1.15, -6.2], [1.15, -6.2]], 0.52, 0.4);
      lidar(g, 3.55, 5.6);
      for (const x of [-1.35, 1.35]) g.add(box(0.15, 0.3, 0.3, M.dark, x, 3.0, 6.3));
      return { group: g, size: 14 };
    }
    case 'shuttle': {
      g.add(box(2.2, 2.5, 6.0, M.white, 0, 1.6, 0, 0.45));
      for (const z of [-2, 0, 2]) g.add(box(2.24, 1.1, 1.6, M.glass, 0, 1.95, z, 0.1));
      g.add(box(2.24, 0.16, 6.02, M.accent, 0, 0.75, 0));
      wheels(g, [[-1, 2.1], [1, 2.1], [-1, -2.1], [1, -2.1]], 0.4, 0.3);
      lidar(g, 3.0);
      return { group: g, size: 7 };
    }
    case 'sidewalk-robot': {
      g.add(box(0.62, 0.48, 0.78, M.white, 0, 0.42, 0, 0.12), box(0.64, 0.06, 0.8, M.accent, 0, 0.62, 0));
      wheels(g, [[-0.3, 0.28], [0.3, 0.28], [-0.3, 0], [0.3, 0], [-0.3, -0.28], [0.3, -0.28]], 0.11, 0.08);
      const flag = cyl(0.008, 0.008, 1.3, M.grey, -0.2, 1.3, -0.3, 6);
      g.add(flag, box(0.22, 0.14, 0.01, M.orange, -0.09, 1.9, -0.3), box(0.3, 0.08, 0.02, M.glass, 0, 0.55, 0.4));
      return { group: g, size: 1.4 };
    }
    case 'drone': {
      g.add(box(0.5, 0.18, 0.5, M.white, 0, 0, 0, 0.06), box(0.18, 0.12, 0.18, M.dark, 0, -0.14, 0.12));
      const rotors: THREE.Mesh[] = [];
      for (const [x, z] of [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]] as [number, number][]) {
        const arm = box(0.62, 0.04, 0.05, M.grey, x / 2, 0.02, z / 2);
        arm.rotation.y = Math.atan2(x, z) + Math.PI / 2;
        const rotor = box(0.5, 0.01, 0.05, M.dark, x, 0.1, z);
        rotors.push(rotor);
        g.add(arm, cyl(0.04, 0.04, 0.08, M.dark, x, 0.06, z, 8), rotor);
      }
      g.add(box(0.06, 0.06, 0.02, M.gold, 0, 0.02, 0.26));
      return { group: g, size: 1.5, tick: (t) => rotors.forEach((r, i) => (r.rotation.y = t * 40 * (i % 2 ? 1 : -1))) };
    }
    case 'drone-dock': {
      g.add(box(1.6, 0.9, 1.6, M.white, 0, 0.45, 0, 0.1), box(1.5, 0.05, 1.5, M.navy, 0, 0.93, 0), box(0.6, 0.02, 0.6, M.gold, 0, 0.96, 0));
      return { group: g, size: 2.5 };
    }
    case 'quadruped': {
      g.add(box(0.36, 0.22, 0.95, M.gold, 0, 0.58, 0, 0.06), box(0.24, 0.16, 0.22, M.dark, 0, 0.62, 0.55, 0.04));
      const legs: THREE.Mesh[] = [];
      for (const [x, z] of [[-0.2, 0.35], [0.2, 0.35], [-0.2, -0.35], [0.2, -0.35]] as [number, number][]) {
        const leg = box(0.07, 0.5, 0.08, M.dark, x, 0.28, z);
        legs.push(leg); g.add(leg);
      }
      return { group: g, size: 1.5, tick: (t) => legs.forEach((l, i) => (l.rotation.x = Math.sin(t * 6 + (i % 3 ? 0 : Math.PI)) * 0.35)) };
    }
    case 'humanoid': {
      g.add(box(0.42, 0.55, 0.24, M.white, 0, 1.25, 0, 0.08), box(0.26, 0.28, 0.24, M.white, 0, 1.68, 0, 0.1), box(0.22, 0.08, 0.02, M.glass, 0, 1.7, 0.13));
      const limbs: THREE.Mesh[] = [];
      for (const x of [-0.12, 0.12]) { const l = box(0.12, 0.85, 0.14, M.grey, x, 0.5, 0); limbs.push(l); g.add(l); }
      for (const x of [-0.29, 0.29]) { const a = box(0.09, 0.62, 0.1, M.grey, x, 1.15, 0); limbs.push(a); g.add(a); }
      return { group: g, size: 2.2, tick: (t) => limbs.forEach((l, i) => (l.rotation.x = Math.sin(t * 3 + (i % 2) * Math.PI) * 0.3)) };
    }
    case 'mower': {
      g.add(box(0.75, 0.3, 0.95, M.white, 0, 0.25, 0, 0.12), box(0.77, 0.05, 0.97, M.accent, 0, 0.38, 0));
      wheels(g, [[-0.36, 0.3], [0.36, 0.3], [-0.36, -0.3], [0.36, -0.3]], 0.12, 0.08);
      return { group: g, size: 1.4 };
    }
    case 'boat': {
      g.add(box(2.4, 0.8, 6.5, M.white, 0, 0.3, 0, 0.5), box(1.6, 1.0, 2.0, M.glass, 0, 1.2, -0.5, 0.2), box(2.42, 0.12, 6.52, M.accent, 0, 0.25, 0));
      g.add(cyl(0.04, 0.04, 1.4, M.grey, 0, 2.2, -0.5, 6), cyl(0.15, 0.15, 0.1, M.dark, 0, 2.95, -0.5));
      return { group: g, size: 7.5 };
    }
    case 'crawler': {
      g.add(box(0.45, 0.25, 0.8, M.gold, 0, 0.2, 0, 0.06), cyl(0.08, 0.08, 0.1, M.lamp, 0, 0.25, 0.42, 10));
      g.add(box(0.12, 0.16, 0.85, M.rubber, -0.24, 0.1, 0), box(0.12, 0.16, 0.85, M.rubber, 0.24, 0.1, 0));
      // A manhole ring to show where it works
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 6, 24), M.grey);
      ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.04, -1.3);
      g.add(ring);
      return { group: g, size: 2.4 };
    }
    case 'patrol-robot': {
      g.add(cyl(0.38, 0.48, 1.25, M.white, 0, 0.7, 0, 24), cyl(0.3, 0.38, 0.25, M.navy, 0, 1.45, 0, 24), cyl(0.39, 0.39, 0.08, M.accent, 0, 1.0, 0, 24));
      g.add(cyl(0.12, 0.12, 0.1, M.lamp, 0, 1.62, 0, 12));
      return { group: g, size: 2 };
    }
    case 'cleaning-robot': {
      g.add(box(0.85, 0.55, 1.05, M.white, 0, 0.35, 0, 0.12), box(0.87, 0.08, 1.07, M.accent, 0, 0.55, 0), box(0.9, 0.06, 0.2, M.dark, 0, 0.06, 0.5));
      return { group: g, size: 1.6 };
    }
    case 'uv-robot': {
      g.add(cyl(0.3, 0.35, 0.4, M.white, 0, 0.25, 0, 20), cyl(0.06, 0.06, 1.2, M.lamp, 0.12, 1.05, 0, 10), cyl(0.06, 0.06, 1.2, M.lamp, -0.12, 1.05, 0, 10));
      return { group: g, size: 1.8 };
    }
    case 'robot-arm': {
      g.add(cyl(0.3, 0.38, 0.3, M.dark, 0, 0.15, 0));
      const a1 = new THREE.Group(); a1.position.y = 0.3;
      const a2 = new THREE.Group(); a2.position.y = 1.0;
      a1.add(box(0.18, 1.0, 0.18, M.orange, 0, 0.5, 0)); a2.add(box(0.14, 0.8, 0.14, M.orange, 0, 0.4, 0), box(0.2, 0.12, 0.2, M.dark, 0, 0.85, 0));
      a1.add(a2); g.add(a1);
      return { group: g, size: 2.5, tick: (t) => { a1.rotation.z = Math.sin(t * 0.8) * 0.5; a2.rotation.z = Math.sin(t * 1.1 + 1) * 0.8; g.rotation.y = Math.sin(t * 0.3) * 1.2; } };
    }
    case 'companion': {
      g.add(cyl(0.2, 0.28, 0.75, M.white, 0, 0.4, 0, 20), new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), M.white));
      g.children[1].position.y = 0.95;
      g.add(box(0.24, 0.1, 0.02, M.glass, 0, 0.97, 0.18));
      return { group: g, size: 1.4 };
    }
    case 'control-center': {
      g.add(box(4, 0.8, 1.2, M.dark, 0, 0.4, 0), box(4, 1.5, 0.1, M.glass, 0, 1.6, -0.5));
      for (const x of [-1.4, 0, 1.4]) g.add(box(1.2, 0.7, 0.04, M.accent, x, 1.6, -0.44));
      return { group: g, size: 5 };
    }
    case 'network-tower': {
      g.add(cyl(0.12, 0.2, 8, M.grey, 0, 4, 0, 10));
      for (const y of [6.5, 7.5]) for (let k = 0; k < 3; k++) { const p = box(0.3, 0.9, 0.08, M.white, Math.cos(k * 2.1) * 0.3, y, Math.sin(k * 2.1) * 0.3); p.rotation.y = -k * 2.1; g.add(p); }
      return { group: g, size: 9 };
    }
    case 'printer': {
      for (const x of [-2, 2]) g.add(box(0.2, 4, 0.2, M.grey, x, 2, -1.5), box(0.2, 4, 0.2, M.grey, x, 2, 1.5));
      g.add(box(4.4, 0.25, 0.25, M.orange, 0, 3.9, 0), box(2.8, 1.2, 2.2, new THREE.MeshStandardMaterial({ color: '#b8afa3', roughness: 1 }), 0, 0.6, 0));
      return { group: g, size: 5 };
    }
  }
}

export function makeModel(kind: ModelKind): Model {
  const m = make(kind);
  m.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return m;
}
