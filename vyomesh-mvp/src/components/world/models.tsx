/**
 * Low-poly model library for the Types world. Every model sits on y=0, is ~1 unit wide,
 * and takes an accent color. Add a new ModelKind in data/schema.ts, then a case below.
 */
import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import type { Group, Mesh, MeshBasicMaterial } from 'three';
import type { ModelKind } from '../../data/schema';

const WHITE = '#f7f8fb';
const DARK = '#2b3245';
const GLASS = '#9fc3e6';

function M({ color, rough = 0.55, metal = 0.05, emissive }: { color: string; rough?: number; metal?: number; emissive?: string }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? '#000'} emissiveIntensity={emissive ? 0.35 : 0} />;
}

function Wheel({ position, r = 0.12, w = 0.08 }: { position: [number, number, number]; r?: number; w?: number }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[r, r, w, 16]} />
      <M color={DARK} rough={0.9} />
    </mesh>
  );
}

function Spin({ children, speed = 18 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return <group ref={ref}>{children}</group>;
}

/** Runs `fn` on a group every frame: a tiny hook-based way to animate part of a model. */
export function Anim({ children, fn, position }: { children: ReactNode; fn: (g: Group, t: number) => void; position?: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) fn(ref.current, clock.elapsedTime);
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

/** A flat ring that grows and fades on a loop: reads as a signal / ping from far away. */
function PulseRing({ y = 0.05, color, max = 1.2, period = 2, delay = 0 }: { y?: number; color: string; max?: number; period?: number; delay?: number }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const p = ((clock.elapsedTime + delay) % period) / period;
    const sc = 0.15 + p * max;
    m.scale.set(sc, sc, sc);
    (m.material as MeshBasicMaterial).opacity = 0.75 * (1 - p);
  });
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
}

/** Limb that swings from a pivot (hip / shoulder), for walking. */
function Swing({ pivot, phase = 0, amp = 0.5, speed = 6, children }: { pivot: [number, number, number]; phase?: number; amp?: number; speed?: number; children: ReactNode }) {
  return (
    <Anim position={pivot} fn={(g, t) => void (g.rotation.x = Math.sin(t * speed + phase) * amp)}>
      {children}
    </Anim>
  );
}

function Rotor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
        <M color={DARK} />
      </mesh>
      <Spin>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.42, 0.012, 0.05]} />
          <M color="#c9cfdb" />
        </mesh>
      </Spin>
    </group>
  );
}

function Humanoid({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      {/* legs swing from the hips */}
      <Swing pivot={[-0.1, 0.45, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow><capsuleGeometry args={[0.065, 0.32, 4, 8]} /><M color={DARK} /></mesh>
      </Swing>
      <Swing pivot={[0.1, 0.45, 0]} phase={Math.PI}>
        <mesh position={[0, -0.2, 0]} castShadow><capsuleGeometry args={[0.065, 0.32, 4, 8]} /><M color={DARK} /></mesh>
      </Swing>
      {/* torso */}
      <RoundedBox args={[0.42, 0.45, 0.24]} radius={0.07} position={[0, 0.7, 0]} castShadow><M color={WHITE} /></RoundedBox>
      <mesh position={[0, 0.72, 0.125]}><boxGeometry args={[0.2, 0.12, 0.01]} /><M color={color} /></mesh>
      {/* arms swing opposite to legs */}
      <Swing pivot={[-0.28, 0.85, 0]} phase={Math.PI} amp={0.4}>
        <mesh position={[0, -0.19, 0]} rotation={[0, 0, 0.12]} castShadow><capsuleGeometry args={[0.05, 0.34, 4, 8]} /><M color={WHITE} /></mesh>
      </Swing>
      <Swing pivot={[0.28, 0.85, 0]} amp={0.4}>
        <mesh position={[0, -0.19, 0]} rotation={[0, 0, -0.12]} castShadow><capsuleGeometry args={[0.05, 0.34, 4, 8]} /><M color={WHITE} /></mesh>
      </Swing>
      {/* head */}
      <RoundedBox args={[0.26, 0.24, 0.24]} radius={0.08} position={[0, 1.08, 0]} castShadow><M color={WHITE} /></RoundedBox>
      <mesh position={[0, 1.09, 0.121]}><boxGeometry args={[0.2, 0.08, 0.01]} /><M color={DARK} /></mesh>
    </group>
  );
}

function Quadruped({ color }: { color: string }) {
  const leg = (x: number, z: number) => (
    <Swing pivot={[x, 0.34, z]} phase={(x > 0) === (z > 0) ? 0 : Math.PI} amp={0.45} speed={8}>
      <mesh position={[0, -0.16, 0]} castShadow><capsuleGeometry args={[0.04, 0.28, 4, 8]} /><M color={DARK} /></mesh>
    </Swing>
  );
  return (
    <group>
      <RoundedBox args={[0.75, 0.18, 0.3]} radius={0.06} position={[0, 0.42, 0]} castShadow><M color={color} /></RoundedBox>
      <RoundedBox args={[0.16, 0.12, 0.2]} radius={0.04} position={[0.44, 0.45, 0]} castShadow><M color={DARK} /></RoundedBox>
      {leg(-0.28, -0.12)}{leg(-0.28, 0.12)}{leg(0.28, -0.12)}{leg(0.28, 0.12)}
    </group>
  );
}

export function Model({ kind, color, highlight }: { kind: ModelKind; color: string; highlight?: boolean }) {
  const c = highlight ? color : color;
  switch (kind) {
    case 'sidewalk-robot':
      return (
        <group>
          <RoundedBox args={[0.6, 0.42, 0.45]} radius={0.08} position={[0, 0.36, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <RoundedBox args={[0.62, 0.1, 0.47]} radius={0.04} position={[0, 0.6, 0]} castShadow><M color={c} /></RoundedBox>
          <mesh position={[0.18, 0.75, -0.15]}><cylinderGeometry args={[0.01, 0.01, 0.35]} /><M color={DARK} /></mesh>
          <mesh position={[0.18, 0.94, -0.15]}><sphereGeometry args={[0.035]} /><M color="#ff7a59" emissive="#ff7a59" /></mesh>
          <mesh position={[0.31, 0.4, 0]}><boxGeometry args={[0.01, 0.1, 0.3]} /><M color={DARK} /></mesh>
          {[-0.2, 0, 0.2].map((x) => (
            <group key={x}><Wheel position={[x, 0.12, 0.24]} /><Wheel position={[x, 0.12, -0.24]} /></group>
          ))}
        </group>
      );
    case 'hybrid-robot':
      return (
        <group>
          <RoundedBox args={[0.9, 0.36, 0.42]} radius={0.12} position={[0, 0.42, 0]} castShadow><M color={c} /></RoundedBox>
          <RoundedBox args={[0.5, 0.2, 0.38]} radius={0.08} position={[-0.1, 0.68, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <mesh position={[0.46, 0.45, 0]}><boxGeometry args={[0.01, 0.12, 0.3]} /><M color={GLASS} /></mesh>
          <Wheel position={[0.3, 0.18, 0.24]} r={0.18} /><Wheel position={[0.3, 0.18, -0.24]} r={0.18} />
          <Wheel position={[-0.3, 0.18, 0.24]} r={0.18} /><Wheel position={[-0.3, 0.18, -0.24]} r={0.18} />
        </group>
      );
    case 'delivery-van':
      return (
        <group>
          <RoundedBox args={[1.3, 0.75, 0.7]} radius={0.15} position={[0, 0.58, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <mesh position={[0.66, 0.68, 0]}><boxGeometry args={[0.01, 0.35, 0.55]} /><M color={GLASS} /></mesh>
          <mesh position={[0, 0.6, 0.355]}><boxGeometry args={[0.9, 0.08, 0.01]} /><M color={c} /></mesh>
          <mesh position={[0, 0.6, -0.355]}><boxGeometry args={[0.9, 0.08, 0.01]} /><M color={c} /></mesh>
          <mesh position={[0.1, 1.0, 0]}><cylinderGeometry args={[0.08, 0.1, 0.1, 12]} /><M color={DARK} /></mesh>
          <Wheel position={[0.4, 0.17, 0.36]} r={0.17} /><Wheel position={[0.4, 0.17, -0.36]} r={0.17} />
          <Wheel position={[-0.4, 0.17, 0.36]} r={0.17} /><Wheel position={[-0.4, 0.17, -0.36]} r={0.17} />
        </group>
      );
    case 'drone':
      return (
        <group>
          <RoundedBox args={[0.32, 0.12, 0.32]} radius={0.05} castShadow><M color={c} /></RoundedBox>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => (
            <group key={`${x}${z}`}>
              <mesh position={[x * 0.2, 0.02, z * 0.2]} rotation={[0, Math.atan2(x, z), 0]}><boxGeometry args={[0.03, 0.03, 0.32]} /><M color={DARK} /></mesh>
              <Rotor position={[x * 0.32, 0.06, z * 0.32]} />
            </group>
          ))}
          <mesh position={[0, -0.22, 0]}><boxGeometry args={[0.18, 0.18, 0.18]} /><M color="#d9a55b" /></mesh>
          <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.005, 0.005, 0.1]} /><M color={DARK} /></mesh>
        </group>
      );
    case 'drone-hub':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.7, 0.9, 0.7]} /><M color="#c7cedb" /></mesh>
          <mesh position={[0, 0.92, 0]}><cylinderGeometry args={[0.3, 0.3, 0.04, 24]} /><M color={c} /></mesh>
          {[-0.18, 0, 0.18].map((y) => (
            <mesh key={y} position={[0.355, 0.45 + y, 0]}><boxGeometry args={[0.01, 0.12, 0.5]} /><M color={DARK} /></mesh>
          ))}
          {/* drone lifts off the pad, hovers, and lands again */}
          <Anim fn={(g, t) => void (g.position.y = 1.1 + Math.max(0, Math.sin(t * 0.9)) * 1.6)}>
            <group scale={0.8}>
              <Model kind="drone" color={color} />
            </group>
          </Anim>
        </group>
      );
    case 'warehouse-robot':
      return (
        <group>
          {[0.25, 0.55, 0.85].map((y) => (
            <mesh key={y} position={[0, y, 0]} castShadow><boxGeometry args={[0.7, 0.04, 0.45]} /><M color="#b88a52" /></mesh>
          ))}
          {[[-0.33, -0.2], [0.33, -0.2], [-0.33, 0.2], [0.33, 0.2]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x, 0.5, z]}><boxGeometry args={[0.03, 0.8, 0.03]} /><M color={DARK} /></mesh>
          ))}
          <mesh position={[-0.15, 0.68, 0]}><boxGeometry args={[0.22, 0.22, 0.2]} /><M color="#d9a55b" /></mesh>
          <mesh position={[0.15, 0.38, 0]}><boxGeometry args={[0.2, 0.2, 0.2]} /><M color="#d9a55b" /></mesh>
          <RoundedBox args={[0.6, 0.12, 0.6]} radius={0.04} position={[0, 0.06, 0]} castShadow><M color={c} /></RoundedBox>
          {/* arm next to the shelf, swinging to pick */}
          <Anim position={[0.7, 0, 0]} fn={(g, t) => void (g.rotation.y = Math.sin(t * 1.6) * 1.2)}>
            <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.14, 0.16, 0.16, 16]} /><M color={DARK} /></mesh>
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.3]}><capsuleGeometry args={[0.045, 0.5, 4, 8]} /><M color={c} /></mesh>
            <mesh position={[-0.2, 0.72, 0]} rotation={[0, 0, 1.2]}><capsuleGeometry args={[0.04, 0.3, 4, 8]} /><M color={c} /></mesh>
          </Anim>
        </group>
      );
    case 'humanoid':
      return (
        <group>
          <Humanoid color={c} />
          <mesh position={[0.32, 0.42, 0.25]}><boxGeometry args={[0.22, 0.16, 0.18]} /><M color="#d9a55b" /></mesh>
        </group>
      );
    case 'quadruped':
      return <Quadruped color={c} />;
    case 'mower':
      return (
        <group>
          <RoundedBox args={[0.7, 0.22, 0.5]} radius={0.1} position={[0, 0.2, 0]} castShadow><M color={c} /></RoundedBox>
          <RoundedBox args={[0.38, 0.12, 0.36]} radius={0.05} position={[-0.05, 0.34, 0]} castShadow><M color={DARK} /></RoundedBox>
          <mesh position={[0.1, 0.42, 0]}><cylinderGeometry args={[0.04, 0.04, 0.05, 12]} /><M color="#e04848" /></mesh>
          <Wheel position={[-0.22, 0.12, 0.27]} r={0.12} /><Wheel position={[-0.22, 0.12, -0.27]} r={0.12} />
          <Wheel position={[0.25, 0.08, 0.22]} r={0.08} /><Wheel position={[0.25, 0.08, -0.22]} r={0.08} />
        </group>
      );
    case 'line-painter':
      return (
        <group>
          <RoundedBox args={[0.55, 0.3, 0.4]} radius={0.06} position={[0, 0.3, 0]} castShadow><M color={c} /></RoundedBox>
          <mesh position={[0, 0.52, 0]}><cylinderGeometry args={[0.1, 0.1, 0.16, 16]} /><M color={WHITE} /></mesh>
          <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.01, 0.01, 0.25]} /><M color={DARK} /></mesh>
          <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.05]} /><M color={WHITE} /></mesh>
          <Wheel position={[0.15, 0.1, 0.22]} r={0.1} /><Wheel position={[0.15, 0.1, -0.22]} r={0.1} />
          <Wheel position={[-0.18, 0.07, 0]} r={0.07} />
          <mesh position={[-0.9, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.08]} /><M color="#ffffff" /></mesh>
        </group>
      );
    case 'patrol-robot':
      return (
        <group>
          <mesh position={[0, 0.55, 0]} castShadow><capsuleGeometry args={[0.28, 0.55, 8, 20]} /><M color={WHITE} /></mesh>
          <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.285, 0.285, 0.12, 24]} /><M color={c} /></mesh>
          <mesh position={[0, 1.02, 0]}><cylinderGeometry args={[0.15, 0.2, 0.08, 20]} /><M color={DARK} /></mesh>
          <mesh position={[0, 1.08, 0]}><sphereGeometry args={[0.05]} /><M color="#4da3ff" emissive="#4da3ff" /></mesh>
          <mesh position={[0, 0.82, 0.25]}><sphereGeometry args={[0.05]} /><M color={DARK} /></mesh>
        </group>
      );
    case 'boat':
      return (
        <group>
          <RoundedBox args={[1.0, 0.22, 0.55]} radius={0.1} position={[0, 0.1, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <mesh position={[0.45, 0.12, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.2, 0.06, 0.6]} /><M color={DARK} /></mesh>
          <mesh position={[-0.05, 0.42, 0]} rotation={[0, 0, -0.12]}><boxGeometry args={[0.6, 0.02, 0.5]} /><M color="#1e3a73" metal={0.4} rough={0.3} /></mesh>
          <mesh position={[-0.05, 0.3, 0]}><boxGeometry args={[0.03, 0.2, 0.03]} /><M color={DARK} /></mesh>
          <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.6, 0.02, 0.56]} /><M color={c} /></mesh>
        </group>
      );
    case 'sand-rover':
      return (
        <group>
          <RoundedBox args={[0.8, 0.3, 0.5]} radius={0.06} position={[0, 0.32, 0]} castShadow><M color={c} /></RoundedBox>
          <mesh position={[0.45, 0.16, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.3, 0.03, 0.5]} /><M color={DARK} /></mesh>
          <mesh position={[-0.1, 0.55, 0]}><boxGeometry args={[0.4, 0.15, 0.4]} /><M color={DARK} /></mesh>
          {[-1, 1].map((s) => (
            <RoundedBox key={s} args={[0.85, 0.2, 0.1]} radius={0.05} position={[0, 0.12, s * 0.3]} castShadow><M color={DARK} rough={0.95} /></RoundedBox>
          ))}
        </group>
      );
    case 'sensor-pole':
      return (
        <group>
          <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.035, 0.05, 1.2, 10]} /><M color="#8b93a6" /></mesh>
          <RoundedBox args={[0.22, 0.16, 0.12]} radius={0.03} position={[0, 1.0, 0.08]} castShadow><M color={WHITE} /></RoundedBox>
          <mesh position={[0, 1.0, 0.145]}><circleGeometry args={[0.04, 16]} /><M color={c} emissive={c} /></mesh>
          <mesh position={[0, 1.28, 0]}><cylinderGeometry args={[0.01, 0.01, 0.2]} /><M color={DARK} /></mesh>
          {[0.25, 0.4].map((r) => (
            <mesh key={r} position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.008, 6, 32, Math.PI]} />
              <M color={c} />
            </mesh>
          ))}
          {/* ground soil sensor */}
          <mesh position={[0.4, 0.08, 0.2]}><cylinderGeometry args={[0.05, 0.05, 0.16, 10]} /><M color={c} /></mesh>
          {/* readings pulsing out across the ground */}
          <PulseRing color={c} max={1.3} period={2.2} />
          <PulseRing color={c} max={1.3} period={2.2} delay={1.1} />
          <Anim position={[0, 1.3, 0]} fn={(g, t) => void (g.rotation.y = t * 1.5)}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.012, 6, 32, Math.PI]} /><M color={c} /></mesh>
          </Anim>
        </group>
      );
    case 'cleaning-robot':
      return (
        <group>
          <RoundedBox args={[0.7, 0.4, 0.55]} radius={0.12} position={[0, 0.3, 0]} castShadow><M color={c} /></RoundedBox>
          <mesh position={[0.38, 0.06, 0.18]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.04, 16]} /><M color="#e3b63c" /></mesh>
          <mesh position={[0.38, 0.06, -0.18]}><cylinderGeometry args={[0.12, 0.12, 0.04, 16]} /><M color="#e3b63c" /></mesh>
          <mesh position={[-0.05, 0.56, 0]}><boxGeometry args={[0.3, 0.12, 0.4]} /><M color={WHITE} /></mesh>
          <mesh position={[-0.05, 0.64, 0]}><sphereGeometry args={[0.04]} /><M color="#ffb020" emissive="#ffb020" /></mesh>
        </group>
      );
    case 'hospital-cart':
      return (
        <group>
          <RoundedBox args={[0.55, 0.85, 0.45]} radius={0.08} position={[0, 0.5, 0]} castShadow><M color={WHITE} /></RoundedBox>
          {[0.3, 0.55].map((y) => (
            <mesh key={y} position={[0.28, y, 0]}><boxGeometry args={[0.01, 0.18, 0.38]} /><M color={c} /></mesh>
          ))}
          <mesh position={[0, 0.96, 0]}><boxGeometry args={[0.56, 0.05, 0.46]} /><M color={c} /></mesh>
          {/* Moxi-style arm */}
          <mesh position={[-0.05, 1.2, 0.18]} rotation={[0.5, 0, 0]}><capsuleGeometry args={[0.035, 0.36, 4, 8]} /><M color={WHITE} /></mesh>
          <mesh position={[0, 1.28, -0.05]}><sphereGeometry args={[0.13, 16, 16]} /><M color={WHITE} /></mesh>
          <mesh position={[0, 1.29, 0.07]}><boxGeometry args={[0.14, 0.05, 0.02]} /><M color={c} emissive={c} /></mesh>
          <Wheel position={[0.18, 0.06, 0.2]} r={0.06} w={0.05} /><Wheel position={[-0.18, 0.06, 0.2]} r={0.06} w={0.05} />
          <Wheel position={[0.18, 0.06, -0.2]} r={0.06} w={0.05} /><Wheel position={[-0.18, 0.06, -0.2]} r={0.06} w={0.05} />
        </group>
      );
    case 'surgical-robot':
      return (
        <group>
          {/* table */}
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.9, 0.06, 0.38]} /><M color="#bfe1e6" /></mesh>
          <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.06, 0.1, 0.44, 12]} /><M color="#8b93a6" /></mesh>
          {/* tower with arms */}
          <mesh position={[0, 0.55, -0.55]} castShadow><boxGeometry args={[0.3, 1.1, 0.25]} /><M color={WHITE} /></mesh>
          {/* arms dip and rise in turn, like they're operating */}
          {[-0.22, 0, 0.22].map((x, i) => (
            <Anim key={x} fn={(g, t) => void (g.position.y = Math.sin(t * 2.2 + i * 2.1) * 0.12)}>
              <mesh position={[x, 1.05, -0.3]} rotation={[1.0, 0, 0]}><capsuleGeometry args={[0.035, 0.45, 4, 8]} /><M color={i === 1 ? c : WHITE} /></mesh>
              <mesh position={[x, 0.7, -0.05]}><capsuleGeometry args={[0.02, 0.35, 4, 8]} /><M color={DARK} /></mesh>
            </Anim>
          ))}
          <PulseRing y={0.5} color={c} max={0.7} period={1.8} />
        </group>
      );
    case 'telepresence':
      return (
        <group>
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.25, 0.28, 0.14, 20]} /><M color={DARK} /></mesh>
          <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.95, 10]} /><M color="#8b93a6" /></mesh>
          <RoundedBox args={[0.5, 0.36, 0.05]} radius={0.03} position={[0, 1.18, 0]} castShadow><M color={DARK} /></RoundedBox>
          <mesh position={[0, 1.18, 0.027]}><planeGeometry args={[0.44, 0.3]} /><M color={c} emissive={c} /></mesh>
          <mesh position={[0, 1.2, 0.03]}><circleGeometry args={[0.07, 16]} /><M color="#f2d2b6" /></mesh>
        </group>
      );
    case 'uv-robot':
      return (
        <group>
          <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.28, 0.3, 0.2, 20]} /><M color={WHITE} /></mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 0.13, 0.75, Math.sin((i * Math.PI) / 2) * 0.13]}>
              <cylinderGeometry args={[0.035, 0.035, 1.0, 10]} />
              <meshStandardMaterial color="#b9a8ff" emissive="#7d5cff" emissiveIntensity={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 1.28, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 20]} /><M color={c} /></mesh>
          {/* UV light washing the floor */}
          <PulseRing color="#8f74ff" max={1.1} period={1.6} />
        </group>
      );
    case 'companion':
      return (
        <group>
          {/* side table */}
          <mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[0.6, 0.5, 0.45]} /><M color="#c69b6d" /></mesh>
          <mesh position={[-0.05, 0.6, 0]}><cylinderGeometry args={[0.12, 0.14, 0.2, 20]} /><M color={WHITE} /></mesh>
          {/* head nods as it talks */}
          <Anim fn={(g, t) => { g.rotation.x = Math.sin(t * 3) * 0.25; g.rotation.y = Math.sin(t * 0.8) * 0.5; }} position={[-0.05, 0.7, 0]}>
            <mesh position={[0, 0.08, 0]} castShadow><sphereGeometry args={[0.11, 20, 20]} /><M color={WHITE} /></mesh>
            <mesh position={[0, 0.09, 0.09]}><boxGeometry args={[0.1, 0.03, 0.02]} /><M color={c} emissive={c} /></mesh>
          </Anim>
          {/* conversation pulses */}
          <PulseRing y={0.52} color={c} max={0.9} period={1.6} />
          {/* small screen */}
          <mesh position={[0.18, 0.62, 0]} rotation={[0, -0.4, 0]}><boxGeometry args={[0.14, 0.2, 0.02]} /><M color={DARK} /></mesh>
          {/* care doll */}
          <Anim position={[0.2, 0.52, 0.12]} fn={(g, t) => void (g.rotation.z = Math.sin(t * 2) * 0.3)}>
            <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.07, 12, 12]} /><M color="#f3c1c6" /></mesh>
            <mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.05, 12, 12]} /><M color="#f7dccc" /></mesh>
          </Anim>
        </group>
      );
    case 'exoskeleton':
      return (
        <group>
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.82, 0]} castShadow><capsuleGeometry args={[0.15, 0.35, 6, 12]} /><M color="#e7c2a6" /></mesh>
            <mesh position={[0, 1.22, 0]}><sphereGeometry args={[0.12, 16, 16]} /><M color="#e7c2a6" /></mesh>
            {[-0.09, 0.09].map((x, i) => (
              <Swing key={x} pivot={[x, 0.6, 0]} phase={i * Math.PI} amp={0.35} speed={3}>
                <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.06, 0.45, 4, 8]} /><M color="#3d5a8c" /></mesh>
                <mesh position={[x * 0.5, -0.3, 0]}><boxGeometry args={[0.04, 0.5, 0.1]} /><M color={c} /></mesh>
                <mesh position={[x * 0.5, -0.05, 0]}><sphereGeometry args={[0.05]} /><M color={DARK} /></mesh>
              </Swing>
            ))}
            <mesh position={[0, 0.6, 0]}><torusGeometry args={[0.17, 0.03, 8, 24]} /><M color={c} /></mesh>
          </group>
          {/* walker rails */}
          {[-0.35, 0.35].map((x) => (
            <mesh key={x} position={[x, 0.45, 0.1]}><boxGeometry args={[0.04, 0.9, 0.04]} /><M color="#8b93a6" /></mesh>
          ))}
        </group>
      );
    case 'network-tower':
      return (
        <group>
          <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.04, 0.16, 1.6, 4]} /><M color="#8b93a6" metal={0.3} /></mesh>
          <mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.07]} /><M color={c} emissive={c} /></mesh>
          {[0.35, 0.6, 0.85].map((r) => (
            <mesh key={r} position={[0, 1.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.01, 6, 40]} />
              <meshStandardMaterial color={c} transparent opacity={0.6 - r * 0.4} />
            </mesh>
          ))}
          {/* signal broadcasting out from the mast */}
          <PulseRing y={1.65} color={c} max={1.6} period={2.4} />
          <PulseRing y={1.65} color={c} max={1.6} period={2.4} delay={1.2} />
          {/* landing pads */}
          {[-0.6, 0.6].map((x) => (
            <mesh key={x} position={[x, 0.03, 0.3]}><cylinderGeometry args={[0.22, 0.22, 0.04, 20]} /><M color={DARK} /></mesh>
          ))}
        </group>
      );
    case 'robotaxi':
      return (
        <group>
          <RoundedBox args={[1.2, 0.38, 0.62]} radius={0.12} position={[0, 0.3, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <RoundedBox args={[0.7, 0.3, 0.56]} radius={0.1} position={[-0.05, 0.6, 0]} castShadow><M color={GLASS} rough={0.2} /></RoundedBox>
          <mesh position={[0, 0.31, 0.315]}><boxGeometry args={[0.9, 0.06, 0.01]} /><M color={c} /></mesh>
          <mesh position={[0, 0.31, -0.315]}><boxGeometry args={[0.9, 0.06, 0.01]} /><M color={c} /></mesh>
          {/* spinning roof lidar */}
          <mesh position={[-0.05, 0.79, 0]}><cylinderGeometry args={[0.09, 0.1, 0.08, 16]} /><M color={DARK} /></mesh>
          <Anim position={[-0.05, 0.86, 0]} fn={(g, t) => void (g.rotation.y = t * 6)}>
            <mesh><cylinderGeometry args={[0.07, 0.07, 0.07, 12]} /><M color={c} emissive={c} /></mesh>
            <mesh position={[0.07, 0, 0]}><boxGeometry args={[0.03, 0.05, 0.02]} /><M color={WHITE} emissive={WHITE} /></mesh>
          </Anim>
          {[0.45, -0.45].map((x) => <mesh key={x} position={[x, 0.36, 0]}><sphereGeometry args={[0.035]} /><M color={DARK} /></mesh>)}
          <Wheel position={[0.38, 0.13, 0.31]} r={0.13} /><Wheel position={[0.38, 0.13, -0.31]} r={0.13} />
          <Wheel position={[-0.38, 0.13, 0.31]} r={0.13} /><Wheel position={[-0.38, 0.13, -0.31]} r={0.13} />
        </group>
      );
    case 'pod':
      return (
        <group>
          <RoundedBox args={[1.0, 0.75, 0.68]} radius={0.2} position={[0, 0.5, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <RoundedBox args={[1.02, 0.32, 0.6]} radius={0.12} position={[0, 0.62, 0]}><M color={GLASS} rough={0.2} /></RoundedBox>
          <mesh position={[0, 0.9, 0]}><boxGeometry args={[0.5, 0.06, 0.4]} /><M color={c} /></mesh>
          {[0.52, -0.52].map((x) => <mesh key={x} position={[x, 0.36, 0]}><boxGeometry args={[0.01, 0.06, 0.4]} /><M color={c} emissive={c} /></mesh>)}
          <Wheel position={[0.34, 0.13, 0.33]} r={0.13} /><Wheel position={[0.34, 0.13, -0.33]} r={0.13} />
          <Wheel position={[-0.34, 0.13, 0.33]} r={0.13} /><Wheel position={[-0.34, 0.13, -0.33]} r={0.13} />
        </group>
      );
    case 'truck':
      return (
        <group>
          {/* cab */}
          <RoundedBox args={[0.6, 0.75, 0.62]} radius={0.08} position={[0.95, 0.55, 0]} castShadow><M color={c} /></RoundedBox>
          <mesh position={[1.26, 0.7, 0]}><boxGeometry args={[0.01, 0.3, 0.5]} /><M color={GLASS} /></mesh>
          <mesh position={[0.95, 0.96, 0]}><cylinderGeometry args={[0.06, 0.07, 0.06, 12]} /><M color={DARK} /></mesh>
          {/* trailer */}
          <mesh position={[-0.35, 0.7, 0]} castShadow><boxGeometry args={[1.9, 0.85, 0.64]} /><M color="#eef0f4" /></mesh>
          <mesh position={[-0.35, 0.7, 0.325]}><boxGeometry args={[1.5, 0.12, 0.01]} /><M color={c} /></mesh>
          {[1.05, 0.65, -0.7, -1.05].map((x) => (
            <group key={x}><Wheel position={[x, 0.15, 0.3]} r={0.15} /><Wheel position={[x, 0.15, -0.3]} r={0.15} /></group>
          ))}
        </group>
      );
    case 'shuttle':
      return (
        <group>
          <RoundedBox args={[1.5, 0.85, 0.7]} radius={0.16} position={[0, 0.58, 0]} castShadow><M color={WHITE} /></RoundedBox>
          <RoundedBox args={[1.52, 0.36, 0.62]} radius={0.1} position={[0, 0.72, 0]}><M color={GLASS} rough={0.2} /></RoundedBox>
          <mesh position={[0, 0.3, 0.355]}><boxGeometry args={[1.3, 0.08, 0.01]} /><M color={c} /></mesh>
          <mesh position={[0, 0.3, -0.355]}><boxGeometry args={[1.3, 0.08, 0.01]} /><M color={c} /></mesh>
          {/* accessible door + ramp */}
          <mesh position={[0.1, 0.45, 0.356]}><boxGeometry args={[0.32, 0.6, 0.01]} /><M color={DARK} /></mesh>
          <mesh position={[0, 1.04, 0]}><boxGeometry args={[0.6, 0.06, 0.4]} /><M color={c} /></mesh>
          <Wheel position={[0.5, 0.14, 0.34]} r={0.14} /><Wheel position={[0.5, 0.14, -0.34]} r={0.14} />
          <Wheel position={[-0.5, 0.14, 0.34]} r={0.14} /><Wheel position={[-0.5, 0.14, -0.34]} r={0.14} />
        </group>
      );
    case 'control-desk':
      return (
        <group>
          {/* desk with three monitors; screens flicker as alerts come in */}
          <mesh position={[0, 0.42, 0]} castShadow><boxGeometry args={[1.3, 0.06, 0.55]} /><M color="#c69b6d" /></mesh>
          {[-0.55, 0.55].map((x) => <mesh key={x} position={[x, 0.2, 0]}><boxGeometry args={[0.05, 0.4, 0.5]} /><M color={DARK} /></mesh>)}
          {[-0.42, 0, 0.42].map((x, i) => (
            <group key={x} position={[x, 0.68, -0.12]} rotation={[0, -x * 0.5, 0]}>
              <mesh><boxGeometry args={[0.38, 0.26, 0.03]} /><M color={DARK} /></mesh>
              <Anim fn={(g, t) => void (g.scale.y = 0.6 + 0.4 * Math.abs(Math.sin(t * 2 + i * 1.3)))}>
                <mesh position={[0, 0, 0.017]}><planeGeometry args={[0.34, 0.22]} /><M color={c} emissive={c} /></mesh>
              </Anim>
            </group>
          ))}
          {/* operator */}
          <group position={[0, 0, 0.45]} scale={0.75} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.45, 0.05, 0.45]} /><M color={DARK} /></mesh>
            <mesh position={[0, 0.65, 0]} castShadow><capsuleGeometry args={[0.15, 0.3, 6, 12]} /><M color="#3d5a8c" /></mesh>
            <Anim position={[0, 1.02, 0]} fn={(g, t) => void (g.rotation.y = Math.sin(t * 0.9) * 0.5)}>
              <mesh><sphereGeometry args={[0.13, 16, 16]} /><M color="#e7c2a6" /></mesh>
            </Anim>
          </group>
          <PulseRing y={0.46} color={c} max={1.2} period={2.4} />
        </group>
      );
    case 'site-carrier':
      return (
        <group>
          {[-1, 1].map((sd) => (
            <RoundedBox key={sd} args={[0.95, 0.24, 0.16]} radius={0.08} position={[0, 0.12, sd * 0.3]} castShadow><M color={DARK} rough={0.95} /></RoundedBox>
          ))}
          <mesh position={[0, 0.32, 0]} castShadow><boxGeometry args={[0.9, 0.16, 0.5]} /><M color={c} /></mesh>
          {/* load of beams */}
          {[0.48, 0.58].map((y, i) => (
            <mesh key={y} position={[0, y, (i - 0.5) * 0.12]}><boxGeometry args={[0.85, 0.08, 0.1]} /><M color="#9aa3b5" metal={0.4} /></mesh>
          ))}
          <mesh position={[0.4, 0.55, 0]}><boxGeometry args={[0.08, 0.3, 0.3]} /><M color={DARK} /></mesh>
          <Anim position={[0.42, 0.75, 0]} fn={(g, t) => void (g.rotation.y = t * 5)}>
            <mesh><cylinderGeometry args={[0.05, 0.05, 0.06, 10]} /><M color={c} emissive={c} /></mesh>
          </Anim>
        </group>
      );
    case 'robot-arm':
      return (
        <group>
          {/* arm lifting a panel, beside a worker in a powered exoskeleton */}
          <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.22, 0.26, 0.2, 18]} /><M color={DARK} /></mesh>
          <Anim position={[0, 0.2, 0]} fn={(g, t) => void (g.rotation.y = Math.sin(t * 0.8) * 1.1)}>
            <Anim fn={(g, t) => void (g.rotation.z = -0.35 + Math.sin(t * 1.6) * 0.25)}>
              <mesh position={[0, 0.38, 0]} castShadow><capsuleGeometry args={[0.07, 0.6, 6, 10]} /><M color={c} /></mesh>
              <group position={[0, 0.75, 0]}>
                <mesh><sphereGeometry args={[0.09]} /><M color={DARK} /></mesh>
                <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.06, 0.45, 6, 10]} /><M color={c} /></mesh>
                <mesh position={[0.6, -0.12, 0]}><boxGeometry args={[0.04, 0.3, 0.5]} /><M color="#9fc3e6" /></mesh>
              </group>
            </Anim>
          </Anim>
          <group position={[-0.65, 0, 0.1]} scale={0.8}>
            <Model kind="exoskeleton" color={color} />
          </group>
        </group>
      );
    case 'printer-gantry':
      return (
        <group>
          {/* gantry frame */}
          {[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.55, z]} castShadow><boxGeometry args={[0.05, 1.1, 0.05]} /><M color="#e3b63c" /></mesh>
          ))}
          {[-0.35, 0.35].map((z) => <mesh key={z} position={[0, 1.1, z]}><boxGeometry args={[1.25, 0.05, 0.05]} /><M color="#e3b63c" /></mesh>)}
          {/* print head sweeps back and forth along the beam */}
          <Anim fn={(g, t) => void (g.position.x = Math.sin(t * 1.2) * 0.45)}>
            <mesh position={[0, 1.1, 0]}><boxGeometry args={[0.08, 0.06, 0.75]} /><M color={DARK} /></mesh>
            <mesh position={[0, 0.85, 0]}><cylinderGeometry args={[0.05, 0.02, 0.4, 10]} /><M color={c} /></mesh>
          </Anim>
          {/* printed wall growing layer by layer */}
          <Anim fn={(g, t) => void (g.scale.y = 0.35 + ((t * 0.12) % 1) * 0.65)}>
            <mesh position={[0, 0.3, 0]}>
              <torusGeometry args={[0.3, 0.06, 6, 24, Math.PI * 1.4]} />
              <M color="#b9b3a6" />
            </mesh>
          </Anim>
          {[0.08, 0.2, 0.32].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.06, 6, 24, Math.PI * 1.4]} /><M color="#c9c3b6" /></mesh>
          ))}
        </group>
      );
    default:
      return (
        <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.5, 0.5, 0.5]} /><M color={c} /></mesh>
      );
  }
}

/** Models that roll back and forth across their tile. */
export const MOVING: ModelKind[] = [
  'sidewalk-robot', 'hybrid-robot', 'delivery-van', 'mower', 'line-painter', 'cleaning-robot', 'sand-rover',
  'hospital-cart', 'quadruped', 'patrol-robot', 'warehouse-robot', 'humanoid', 'exoskeleton', 'telepresence', 'uv-robot',
  'robotaxi', 'pod', 'truck', 'shuttle', 'site-carrier',
];
/** Moving models that keep facing the viewer instead of turning around (e.g. a screen). */
export const NO_TURN: ModelKind[] = ['telepresence', 'uv-robot', 'warehouse-robot'];
/** Moving models whose front is +z (people-shaped), so they turn to face the direction they walk. */
export const FACES_Z: ModelKind[] = ['humanoid', 'exoskeleton'];
/** Slower walkers. */
export const SLOW: ModelKind[] = ['exoskeleton', 'uv-robot', 'telepresence', 'shuttle', 'site-carrier'];
/** Models that travel a longer stretch (vehicles on long roads). */
export const LONG_RANGE: ModelKind[] = ['truck', 'robotaxi', 'shuttle', 'pod'];
/** Models that float above the tile. */
export const FLYING: ModelKind[] = ['drone'];
/** Models that bob on water. */
export const FLOATING: ModelKind[] = ['boat'];
