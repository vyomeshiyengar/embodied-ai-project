/**
 * 'landscape' layout: one continuous environment instead of separate tiles.
 * Each zone is drawn as an area on a shared ground, joined by footpaths, with scenery
 * sized to the area. Used when a department sets `types.layout: 'landscape'`.
 */
import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import type { Road, Zone, ZoneArea as Area, ZoneSetting } from '../../data/schema';

const GROUND = '#b9d99c';
const PATH = '#e3d6b8';

function Mat({ c, rough = 0.9 }: { c: string; rough?: number }) {
  return <meshStandardMaterial color={c} roughness={rough} />;
}

/** Deterministic pseudo-random numbers so scenery doesn't jump between renders. */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h;
}

function Tree({ p, s = 1, tone = '#5f9e4a' }: { p: [number, number, number]; s?: number; tone?: string }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.07, 0.1, 0.6, 8]} /><Mat c="#7a5a3c" /></mesh>
      <mesh position={[0, 0.9, 0]} castShadow><icosahedronGeometry args={[0.45, 0]} /><Mat c={tone} /></mesh>
    </group>
  );
}

function House({ p, s = 1, roof = '#b9584a', wall = '#f4efe6' }: { p: [number, number, number]; s?: number; roof?: string; wall?: string }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow><boxGeometry args={[1, 0.8, 0.9]} /><Mat c={wall} /></mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.8, 0.5, 4]} /><Mat c={roof} /></mesh>
      <mesh position={[0, 0.25, 0.46]}><planeGeometry args={[0.2, 0.4]} /><Mat c="#6b4d35" /></mesh>
    </group>
  );
}

/** A flat patch on the ground: rectangle or ellipse. */
function Patch({ a, color, y = 0.02, inset = 0 }: { a: Area; color: string; y?: number; inset?: number }) {
  const w = a.w - inset;
  const d = a.d - inset;
  return a.shape === 'ellipse' ? (
    <mesh position={[a.x, y, a.z]} rotation={[-Math.PI / 2, 0, 0]} scale={[w / 2, d / 2, 1]} receiveShadow>
      <circleGeometry args={[1, 48]} />
      <Mat c={color} />
    </mesh>
  ) : (
    <mesh position={[a.x, y, a.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <Mat c={color} />
    </mesh>
  );
}

function Line({ from, to, width, color, y = 0.012 }: { from: [number, number]; to: [number, number]; width: number; color: string; y?: number }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  return (
    <mesh position={[(from[0] + to[0]) / 2, y, (from[1] + to[1]) / 2]} rotation={[-Math.PI / 2, 0, -Math.atan2(dz, dx)]} receiveShadow>
      <planeGeometry args={[len, width]} />
      <Mat c={color} />
    </mesh>
  );
}

function AreaScenery({ zone, setting }: { zone: Zone; setting?: ZoneSetting }) {
  const a = zone.area!;
  const rand = useMemo(() => rng(hash(zone.id)), [zone.id]);
  const back = a.z - a.d / 2 + 0.9;
  const ROOFS = ['#b9584a', '#5d7fb0', '#7aa06a', '#c98b4a'];

  switch (setting ?? zone.setting) {
    case 'street':
      return (
        <group>
          <Patch a={a} color="#5d6475" y={0.03} />
          {Array.from({ length: Math.floor(a.w / 1.4) }, (_, i) => (
            <Line key={i} from={[a.x - a.w / 2 + 0.4 + i * 1.4, a.z]} to={[a.x - a.w / 2 + 1.1 + i * 1.4, a.z]} width={0.1} color="#f5d76e" y={0.045} />
          ))}
        </group>
      );
    case 'sidewalk':
      return (
        <group>
          <Patch a={a} color="#dde1e8" y={0.04} />
          <Line from={[a.x - a.w / 2, a.z - a.d / 2]} to={[a.x + a.w / 2, a.z - a.d / 2]} width={0.12} color="#b7bdc9" y={0.05} />
          {Array.from({ length: 6 }, (_, i) => (
            <Line key={i} from={[a.x - a.w / 2 + 0.15 + i * 0.35, a.z - a.d / 2 - 2.6]} to={[a.x - a.w / 2 + 0.15 + i * 0.35, a.z - a.d / 2 - 0.2]} width={0.18} color="#ffffff" y={0.05} />
          ))}
          {[0.15, 0.55, 0.9].map((t) => (
            <group key={t} position={[a.x - a.w / 2 + a.w * t, 0, a.z + a.d / 2 - 0.25]}>
              <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.04, 0.05, 1.2, 8]} /><Mat c="#555d70" /></mesh>
              <mesh position={[0, 1.22, 0]}><sphereGeometry args={[0.11]} /><meshStandardMaterial color="#fff6c8" emissive="#ffe58a" emissiveIntensity={0.4} /></mesh>
            </group>
          ))}
          <mesh position={[a.x + a.w / 2 - 0.6, 0.06, a.z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.7]} /><Mat c="#f0c24b" /></mesh>
        </group>
      );
    case 'bikelane':
      return (
        <group>
          <Patch a={a} color="#5aa267" y={0.045} />
          <Line from={[a.x - a.w / 2, a.z - a.d / 2 + 0.05]} to={[a.x + a.w / 2, a.z - a.d / 2 + 0.05]} width={0.08} color="#ffffff" y={0.055} />
          <Line from={[a.x - a.w / 2, a.z + a.d / 2 - 0.05]} to={[a.x + a.w / 2, a.z + a.d / 2 - 0.05]} width={0.08} color="#ffffff" y={0.055} />
        </group>
      );
    case 'warehouse':
      return (
        <group>
          <Patch a={a} color="#c9ccd3" />
          <group position={[a.x, 0, back + 0.2]}>
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow><boxGeometry args={[a.w * 0.85, 1.8, 2]} /><Mat c="#d7dbe3" /></mesh>
            <mesh position={[0, 1.85, 0]}><boxGeometry args={[a.w * 0.87, 0.12, 2.1]} /><Mat c="#8a93a6" /></mesh>
            {(() => {
              const doors = Math.max(2, Math.floor(a.w / 2.4));
              return Array.from({ length: doors }, (_, i) => (
                <mesh key={i} position={[-a.w * 0.36 + (i * a.w * 0.72) / (doors - 1), 0.55, 1.01]}><planeGeometry args={[1.1, 1.1]} /><Mat c="#4a5468" /></mesh>
              ));
            })()}
          </group>
          {[0.2, 0.8].map((t) => (
            <group key={t} position={[a.x - a.w / 2 + a.w * t, 0, a.z + a.d * 0.32]}>
              {[0.15, 0.4].map((y) => <mesh key={y} position={[0, y, 0]} castShadow><boxGeometry args={[1, 0.22, 0.8]} /><Mat c="#d9a55b" /></mesh>)}
            </group>
          ))}
          <Line from={[a.x - a.w / 2 + 0.3, a.z + 0.2]} to={[a.x + a.w / 2 - 0.3, a.z + 0.2]} width={0.08} color="#f0c24b" y={0.03} />
        </group>
      );
    case 'industrial':
      return (
        <group>
          <Patch a={a} color="#c3c7cf" />
          {[-0.3, 0.05].map((t) => (
            <mesh key={t} position={[a.x + a.w * t, 0.8, back]} castShadow><cylinderGeometry args={[0.55, 0.55, 1.6, 16]} /><Mat c="#aab2c0" /></mesh>
          ))}
          <mesh position={[a.x + a.w * 0.33, 0.6, back]} castShadow><boxGeometry args={[1.6, 1.2, 1.2]} /><Mat c="#8aa3c2" /></mesh>
          <mesh position={[a.x + a.w * 0.33, 0.4, back + 0.61]}><planeGeometry args={[0.9, 0.7]} /><Mat c="#5b6475" /></mesh>
        </group>
      );
    case 'hospital':
      return (
        <group>
          <Patch a={a} color="#e9edf3" />
          <group position={[a.x, 0, a.z - a.d / 2 + 1.6]}>
            <mesh position={[0, 1.4, 0]} castShadow receiveShadow><boxGeometry args={[a.w * 0.8, 2.8, 2.2]} /><Mat c="#ffffff" /></mesh>
            <mesh position={[-a.w * 0.25, 2.2, 0]} castShadow><boxGeometry args={[a.w * 0.25, 4.4, 2]} /><Mat c="#f3f5f9" /></mesh>
            {Array.from({ length: 7 }, (_, i) => [0.7, 1.5, 2.3].map((y) => (
              <mesh key={`${i}${y}`} position={[-a.w * 0.36 + (i * a.w * 0.72) / 6, y, 1.11]}><planeGeometry args={[0.6, 0.4]} /><meshStandardMaterial color="#9fc3e6" /></mesh>
            )))}
            <group position={[a.w * 0.15, 3.2, 0]}>
              <mesh><boxGeometry args={[0.9, 0.28, 0.15]} /><meshStandardMaterial color="#e04848" /></mesh>
              <mesh><boxGeometry args={[0.28, 0.9, 0.15]} /><meshStandardMaterial color="#e04848" /></mesh>
            </group>
          </group>
          {/* helipad + ambulance */}
          <mesh position={[a.x + a.w / 2 - 1.4, 0.035, a.z + a.d / 2 - 1.4]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.9, 32]} /><Mat c="#5d6475" /></mesh>
          <mesh position={[a.x + a.w / 2 - 1.4, 0.04, a.z + a.d / 2 - 1.4]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.6, 0.68, 32]} /><Mat c="#ffffff" /></mesh>
          <group position={[a.x - a.w / 2 + 1.2, 0, a.z + a.d / 2 - 1.2]}>
            <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[1.2, 0.6, 0.6]} /><Mat c="#ffffff" rough={0.5} /></mesh>
            <mesh position={[0, 0.36, 0.305]}><boxGeometry args={[0.9, 0.08, 0.01]} /><Mat c="#e04848" /></mesh>
          </group>
        </group>
      );
    case 'home':
      return (
        <group>
          <Patch a={a} color="#cfe3b6" />
          <House p={[a.x - a.w * 0.22, 0, back]} s={1.4} />
          <Tree p={[a.x + a.w * 0.32, 0, back]} />
          <mesh position={[a.x, 0.035, a.z + a.d * 0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[a.w * 0.6, a.d * 0.35]} /><Mat c="#e3d6b8" /></mesh>
        </group>
      );
    case 'care-home':
      return (
        <group>
          <Patch a={a} color="#e6e0ef" />
          <group position={[a.x, 0, back + 0.2]}>
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow><boxGeometry args={[a.w * 0.8, 1.4, 1.6]} /><Mat c="#f6f2fb" /></mesh>
            <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[a.w * 0.85, 0.25, 1.8]} /><Mat c="#8d7bb3" /></mesh>
            {Array.from({ length: 5 }, (_, i) => (
              <mesh key={i} position={[-a.w * 0.32 + (i * a.w * 0.64) / 4, 0.8, 0.81]}><planeGeometry args={[0.5, 0.45]} /><meshStandardMaterial color="#9fc3e6" /></mesh>
            ))}
          </group>
          <Tree p={[a.x + a.w / 2 - 0.6, 0, a.z + a.d / 2 - 0.8]} s={0.8} />
        </group>
      );
    case 'suburb': {
      const houses: [number, number][] = [];
      for (let gx = a.x - a.w / 2 + 1.2; gx < a.x + a.w / 2 - 0.6; gx += 2.4)
        for (let gz = a.z - a.d / 2 + 1.2; gz < a.z + a.d / 2 - 0.6; gz += 2.4)
          if (Math.hypot(gx - a.x, gz - a.z) > 2) houses.push([gx, gz]);
      return (
        <group>
          <Patch a={a} color="#cfe3b6" />
          {houses.map(([x, z], i) => (
            <group key={i}>
              <House p={[x, 0, z]} s={0.75} roof={ROOFS[i % ROOFS.length]} />
              {i % 3 === 0 && <Tree p={[x + 0.85, 0, z + 0.5]} s={0.6} />}
            </group>
          ))}
        </group>
      );
    }
    case 'downtown': {
      const towers: { x: number; z: number; h: number }[] = [];
      for (let gx = a.x - a.w / 2 + 1.1; gx < a.x + a.w / 2 - 0.5; gx += 2.2)
        for (let gz = a.z - a.d / 2 + 1.1; gz < a.z + a.d / 2 - 0.5; gz += 2.2)
          if (Math.hypot(gx - a.x, gz - a.z) > 2.2) towers.push({ x: gx, z: gz, h: 1.5 + rand() * 4 });
      return (
        <group>
          <Patch a={a} color="#c9ccd3" />
          {towers.map((t, i) => (
            <mesh key={i} position={[t.x, t.h / 2, t.z]} castShadow receiveShadow>
              <boxGeometry args={[1.5, t.h, 1.5]} />
              <Mat c={['#b8c3d6', '#c9d1df', '#aab6cb'][i % 3]} rough={0.6} />
            </mesh>
          ))}
        </group>
      );
    }
    case 'forest': {
      const trees: [number, number, number][] = [];
      const n = Math.round((a.w * a.d) / 2.6);
      for (let i = 0; i < n; i++) {
        const x = a.x + (rand() - 0.5) * (a.w - 1);
        const z = a.z + (rand() - 0.5) * (a.d - 1);
        if (Math.hypot(x - a.x, z - (a.z + a.d * 0.12)) < 1.8) continue; // keep a clearing for the drone
        trees.push([x, 0, z]);
      }
      return (
        <group>
          <Patch a={a} color="#8fbf74" />
          {trees.map((p, i) => <Tree key={i} p={p} s={0.9 + rand() * 0.7} tone={i % 3 ? '#4f8f3f' : '#6aa653'} />)}
        </group>
      );
    }
    case 'trail': {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 6; i++) pts.push([a.x - a.w / 2 + (a.w * i) / 6, a.z + Math.sin(i * 1.3) * a.d * 0.22]);
      return (
        <group>
          <Patch a={a} color="#a8cf8c" />
          {pts.slice(1).map((p, i) => <Line key={i} from={pts[i]} to={p} width={0.9} color="#c9a477" y={0.03} />)}
          {[0.15, 0.4, 0.7, 0.9].map((t, i) => (
            <Tree key={i} p={[a.x - a.w / 2 + a.w * t, 0, a.z + (i % 2 ? 1 : -1) * a.d * 0.38]} s={0.9} />
          ))}
        </group>
      );
    }
    case 'field':
      return (
        <group>
          <Patch a={a} color="#8fc274" />
          <Patch a={a} color="#9acb80" y={0.025} inset={1} />
          {[
            [[a.x - a.w / 2 + 0.5, a.z - a.d / 2 + 0.5], [a.x + a.w / 2 - 0.5, a.z - a.d / 2 + 0.5]],
            [[a.x - a.w / 2 + 0.5, a.z + a.d / 2 - 0.5], [a.x + a.w / 2 - 0.5, a.z + a.d / 2 - 0.5]],
            [[a.x - a.w / 2 + 0.5, a.z - a.d / 2 + 0.5], [a.x - a.w / 2 + 0.5, a.z + a.d / 2 - 0.5]],
            [[a.x + a.w / 2 - 0.5, a.z - a.d / 2 + 0.5], [a.x + a.w / 2 - 0.5, a.z + a.d / 2 - 0.5]],
            [[a.x, a.z - a.d / 2 + 0.5], [a.x, a.z + a.d / 2 - 0.5]],
          ].map(([f, t], i) => <Line key={i} from={f as [number, number]} to={t as [number, number]} width={0.07} color="#ffffff" y={0.035} />)}
          <mesh position={[a.x, 0.035, a.z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.9, 0.97, 40]} /><meshStandardMaterial color="#ffffff" /></mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[a.x + s * (a.w / 2 - 0.5), 0, a.z]}>
              {[-0.6, 0.6].map((dz) => <mesh key={dz} position={[0, 0.4, dz]}><cylinderGeometry args={[0.03, 0.03, 0.8]} /><Mat c="#ffffff" /></mesh>)}
              <mesh position={[0, 0.8, 0]}><boxGeometry args={[0.05, 0.05, 1.25]} /><Mat c="#ffffff" /></mesh>
            </group>
          ))}
        </group>
      );
    case 'park': {
      const stripes = Math.max(3, Math.round(a.w / 0.9));
      return (
        <group>
          <Patch a={a} color="#a6d38a" />
          {Array.from({ length: stripes }, (_, i) => i % 2 === 0 && (
            <mesh key={i} position={[a.x - a.w / 2 + (a.w / stripes) * (i + 0.5), 0.03, a.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[a.w / stripes, a.d]} />
              <Mat c="#b5dc9a" />
            </mesh>
          ))}
          <mesh position={[a.x - a.w / 2 + 0.6, 0.2, a.z - a.d / 2 + 0.5]} castShadow><boxGeometry args={[0.9, 0.1, 0.3]} /><Mat c="#8a6a4a" /></mesh>
        </group>
      );
    }
    case 'golf':
      return (
        <group>
          <Patch a={a} color="#93c973" />
          <Patch a={{ ...a, shape: 'ellipse' }} color="#a9d98a" y={0.025} inset={1.6} />
          <mesh position={[a.x + a.w * 0.3, 0.035, a.z - a.d * 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.1, 32]} /><Mat c="#c3eaa6" /></mesh>
          <mesh position={[a.x + a.w * 0.3, 0.6, a.z - a.d * 0.2]}><cylinderGeometry args={[0.025, 0.025, 1.2]} /><Mat c="#ffffff" /></mesh>
          <mesh position={[a.x + a.w * 0.3 + 0.2, 1.05, a.z - a.d * 0.2]}><boxGeometry args={[0.4, 0.24, 0.01]} /><Mat c="#e04848" /></mesh>
          <mesh position={[a.x - a.w * 0.25, 0.034, a.z - a.d * 0.25]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.3, 0.8, 1]}><circleGeometry args={[0.7, 24]} /><Mat c="#eed9a8" /></mesh>
          <Tree p={[a.x + a.w / 2 - 0.6, 0, a.z + a.d / 2 - 0.7]} />
          <Tree p={[a.x - a.w / 2 + 0.6, 0, a.z + a.d / 2 - 0.8]} s={0.8} />
        </group>
      );
    case 'plaza':
      return (
        <group>
          <Patch a={a} color="#e7dcc6" />
          <group position={[a.x, 0, a.z - a.d * 0.22]}>
            <mesh position={[0, 0.15, 0]} castShadow><cylinderGeometry args={[0.85, 0.9, 0.3, 28]} /><Mat c="#cbbd9f" /></mesh>
            <mesh position={[0, 0.31, 0]}><cylinderGeometry args={[0.72, 0.72, 0.02, 28]} /><meshStandardMaterial color="#7fb4dc" /></mesh>
            <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.06, 0.1, 0.6, 8]} /><Mat c="#cbbd9f" /></mesh>
          </group>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[a.x + s * a.w * 0.33, 0.2, a.z]} rotation={[0, (s * Math.PI) / 2, 0]} castShadow><boxGeometry args={[1.0, 0.1, 0.3]} /><Mat c="#8a6a4a" /></mesh>
          ))}
        </group>
      );
    case 'parking':
      return (
        <group>
          <Patch a={a} color="#6b7283" />
          {Array.from({ length: Math.floor(a.w / 0.8) + 1 }, (_, i) => (
            <Line key={i} from={[a.x - a.w / 2 + 0.3 + i * 0.8, a.z - a.d / 2 + 0.1]} to={[a.x - a.w / 2 + 0.3 + i * 0.8, a.z - a.d / 2 + 1.2]} width={0.05} color="#ffffff" y={0.03} />
          ))}
          {[[0.7, '#c75b4a'], [2.3, '#4a6fa5'], [4.7, '#e3b63c']].map(([x, c]) => (
            <group key={x as number} position={[a.x - a.w / 2 + (x as number), 0, a.z - a.d / 2 + 0.65]}>
              <mesh position={[0, 0.22, 0]} castShadow><boxGeometry args={[0.5, 0.3, 0.9]} /><Mat c={c as string} rough={0.5} /></mesh>
              <mesh position={[0, 0.45, -0.05]}><boxGeometry args={[0.44, 0.18, 0.5]} /><meshStandardMaterial color="#9fc3e6" /></mesh>
            </group>
          ))}
        </group>
      );
    case 'visitor-center':
      return (
        <group>
          <Patch a={a} color="#e7dcc6" />
          <group position={[a.x, 0, back]}>
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow><boxGeometry args={[3.4, 1.1, 1.2]} /><Mat c="#f4efe6" /></mesh>
            <mesh position={[0, 1.2, 0]} castShadow><boxGeometry args={[3.8, 0.18, 1.5]} /><Mat c="#4f8a3c" /></mesh>
            {[-1.1, 1.1].map((x) => <mesh key={x} position={[x, 0.6, 0.61]}><planeGeometry args={[0.7, 0.45]} /><meshStandardMaterial color="#9fc3e6" /></mesh>)}
            <mesh position={[0, 0.4, 0.61]}><planeGeometry args={[0.55, 0.8]} /><Mat c="#6b4d35" /></mesh>
          </group>
          <group position={[a.x + a.w / 2 - 0.7, 0, a.z + a.d / 2 - 0.8]}>
            <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.03, 0.03, 0.7]} /><Mat c="#6b4d35" /></mesh>
            <mesh position={[0, 0.75, 0]}><boxGeometry args={[0.6, 0.3, 0.05]} /><Mat c="#4f8a3c" /></mesh>
          </group>
        </group>
      );
    case 'beach':
      return (
        <group>
          <Patch a={a} color="#eed9a8" y={0.025} />
          {[[0.25, '#e05a5a'], [0.75, '#f0c24b']].map(([t, c]) => (
            <group key={t as number} position={[a.x - a.w / 2 + a.w * (t as number), 0, a.z + 0.3]}>
              <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.02, 0.02, 0.9]} /><Mat c="#ffffff" /></mesh>
              <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.5, 0.22, 12]} /><Mat c={c as string} /></mesh>
            </group>
          ))}
          {/* lifeguard stand */}
          <group position={[a.x + a.w / 2 - 0.8, 0, a.z]}>
            {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.45, z]}><boxGeometry args={[0.05, 0.9, 0.05]} /><Mat c="#ffffff" /></mesh>
            ))}
            <mesh position={[0, 0.95, 0]} castShadow><boxGeometry args={[0.55, 0.1, 0.55]} /><Mat c="#e05a5a" /></mesh>
          </group>
        </group>
      );
    case 'water':
      return (
        <group>
          <Patch a={a} color="#d8c79c" y={0.015} />
          <Patch a={a} color="#7fb4dc" y={0.03} inset={0.6} />
          <Patch a={a} color="#6aa6d4" y={0.035} inset={3} />
          <mesh position={[a.x - a.w * 0.32, 0.08, a.z - a.d * 0.25]} castShadow><boxGeometry args={[1.4, 0.06, 0.4]} /><Mat c="#a37c55" /></mesh>
        </group>
      );
    case 'network':
      return (
        <group>
          <Patch a={a} color="#cfd5de" />
          <group position={[a.x - a.w * 0.15, 0, a.z - a.d * 0.2]}>
            <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[1.6, 0.8, 1]} /><Mat c="#3a4a6b" /></mesh>
            <mesh position={[0, 0.85, 0]}><boxGeometry args={[1.75, 0.08, 1.15]} /><Mat c="#24386f" /></mesh>
            <mesh position={[0.5, 1.3, 0]}><cylinderGeometry args={[0.02, 0.04, 0.9]} /><Mat c="#8b93a6" /></mesh>
          </group>
        </group>
      );
    case 'air':
      return zone.below ? <AreaScenery zone={{ ...zone, setting: zone.below }} /> : null;
    default:
      return <Patch a={a} color="#cfd5de" />;
  }
}

/** Ground, roads or footpaths, a city skyline behind, and each zone's area. */
export default function Landscape({
  zones,
  ground,
  hub,
  theme = 'park',
  roads = [],
}: {
  zones: Zone[];
  ground: [number, number];
  hub: [number, number];
  theme?: 'park' | 'city';
  roads?: Road[];
}) {
  const [W, D] = ground;
  const city = theme === 'city';
  const groundZones = zones.filter((z) => z.setting !== 'air' && z.area);
  const skyline = useMemo(() => {
    const r = rng(7);
    const out: { x: number; h: number; w: number; c: string }[] = [];
    for (let x = -W / 2 - 2; x < W / 2 + 2; ) {
      const w = 1.4 + r() * 2.2;
      out.push({ x: x + w / 2, h: 2 + r() * 6, w, c: ['#c9d1df', '#b8c3d6', '#d5dbe6', '#aab6cb'][Math.floor(r() * 4)] });
      x += w + 0.3;
    }
    return out;
  }, [W]);

  return (
    <group>
      {/* ground slab */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[W, 0.5, D]} />
        <Mat c={city ? '#d3d8d0' : GROUND} />
      </mesh>
      {/* sidewalk + street on the near edge */}
      <mesh position={[0, 0.005, D / 2 + 0.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[W, 1.6]} /><Mat c="#d5d9e1" /></mesh>
      <mesh position={[0, -0.01, D / 2 + 3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[W + 10, 2.8]} /><Mat c="#5d6475" /></mesh>
      {city ? (
        roads.map((r, i) => {
          const w = r.width ?? 2.6;
          const horizontal = Math.abs(r.to[0] - r.from[0]) >= Math.abs(r.to[1] - r.from[1]);
          const len = Math.hypot(r.to[0] - r.from[0], r.to[1] - r.from[1]);
          const dashes = Math.floor(len / 1.6);
          return (
            <group key={i}>
              <Line from={r.from} to={r.to} width={w + 0.5} color="#e2e5eb" y={0.008} />
              <Line from={r.from} to={r.to} width={w} color="#5d6475" y={0.012} />
              {Array.from({ length: dashes }, (_, k) => {
                const t0 = (k + 0.25) / dashes;
                const t1 = (k + 0.6) / dashes;
                const p = (t: number): [number, number] => [r.from[0] + (r.to[0] - r.from[0]) * t, r.from[1] + (r.to[1] - r.from[1]) * t];
                return <Line key={k} from={p(t0)} to={p(t1)} width={0.09} color={horizontal ? '#f5d76e' : '#ffffff'} y={0.016} />;
              })}
            </group>
          );
        })
      ) : (
        groundZones.map((z) => <Line key={z.id} from={hub} to={[z.area!.x, z.area!.z]} width={0.7} color={PATH} y={0.01} />)
      )}
      {/* border trees */}
      {Array.from({ length: Math.floor(W / 3) }, (_, i) => (
        <Tree key={i} p={[-W / 2 + 1.5 + i * 3, 0, D / 2 - 0.5]} s={0.7} />
      ))}
      {/* city skyline beyond the back edge */}
      {skyline.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2 - 0.5, -D / 2 - 3 - (i % 3) * 1.2]} castShadow>
          <boxGeometry args={[b.w, b.h, 1.8]} />
          <Mat c={b.c} />
        </mesh>
      ))}
      {zones.map((z) => z.area && <AreaScenery key={z.id} zone={z} />)}
    </group>
  );
}

export function AreaLabel({ zone, number }: { zone: Zone; number: number }) {
  const a = zone.area!;
  const air = zone.setting === 'air';
  return (
    <Html
      position={
        air
          ? [a.x, 3.6, a.z]
          : zone.setting === 'water'
            ? [a.x + a.w * 0.32, 0.1, a.z + a.d * 0.2]
            : a.d <= 2 // thin strips (sidewalks, bike lanes): label at the end so it doesn't cover the robot
              ? [a.x + a.w / 2 - 1.6, 0.1, a.z]
              : [a.x, 0.1, a.z + a.d / 2 - 0.1]
      }
      center
      zIndexRange={[10, 0]}
    >
      <div className={'zone-tag' + (air ? ' air' : '')}>
        {number}. {zone.name}
      </div>
    </Html>
  );
}
