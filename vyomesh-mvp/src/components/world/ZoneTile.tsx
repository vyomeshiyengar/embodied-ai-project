/** One zone "district" in the diorama: a slab plus scenery that depends on its setting. */
import { Html, RoundedBox } from '@react-three/drei';
import type { ZoneSetting } from '../../data/schema';

export const TILE = 5;
const H = 0.3;

const TILE_COLOR: Record<ZoneSetting, string> = {
  street: '#5d6475',
  sidewalk: '#d5d9e1',
  bikelane: '#cfd5de',
  air: '#dbe8f5',
  hospital: '#e9edf3',
  home: '#e8e1d6',
  'care-home': '#e6e0ef',
  warehouse: '#c9ccd3',
  industrial: '#c3c7cf',
  park: '#a9cf8f',
  field: '#8fc274',
  plaza: '#e7dcc6',
  beach: '#eed9a8',
  water: '#8fbfe3',
  trail: '#9fc98a',
  network: '#24386f',
};

function Mat({ c }: { c: string }) {
  return <meshStandardMaterial color={c} roughness={0.85} />;
}

function Tree({ p, s = 1 }: { p: [number, number, number]; s?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.06, 0.08, 0.5, 8]} /><Mat c="#7a5a3c" /></mesh>
      <mesh position={[0, 0.75, 0]} castShadow><icosahedronGeometry args={[0.38, 0]} /><Mat c="#5f9e4a" /></mesh>
    </group>
  );
}

function House({ p, c = '#f4efe6', roof = '#b9584a', s = 1 }: { p: [number, number, number]; c?: string; roof?: string; s?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow><boxGeometry args={[0.9, 0.7, 0.8]} /><Mat c={c} /></mesh>
      <mesh position={[0, 0.92, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.72, 0.45, 4]} /><Mat c={roof} /></mesh>
      <mesh position={[0, 0.25, 0.41]}><boxGeometry args={[0.18, 0.35, 0.01]} /><Mat c="#6b4d35" /></mesh>
    </group>
  );
}

function Cloud({ p }: { p: [number, number, number] }) {
  return (
    <group position={p}>
      {[[0, 0, 0, 0.3], [0.3, -0.05, 0, 0.22], [-0.3, -0.05, 0.05, 0.24], [0.1, 0.12, 0, 0.22]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 12, 12]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.92} /></mesh>
      ))}
    </group>
  );
}

function Stripe({ p, size, c = '#ffffff', rot = 0 }: { p: [number, number, number]; size: [number, number]; c?: string; rot?: number }) {
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, rot]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={c} roughness={0.9} />
    </mesh>
  );
}

function Scenery({ setting }: { setting: ZoneSetting }) {
  const top = H / 2 + 0.005;
  const back = -TILE / 2 + 0.7;
  switch (setting) {
    case 'street':
      return (
        <group>
          {[-1.8, -0.9, 0, 0.9, 1.8].map((x) => <Stripe key={x} p={[x, top, 0.3]} size={[0.5, 0.08]} c="#f5d76e" />)}
          <Stripe p={[0, top, -TILE / 2 + 0.25]} size={[TILE, 0.5]} c="#c9cdd6" />
          <Stripe p={[0, top, TILE / 2 - 0.25]} size={[TILE, 0.5]} c="#c9cdd6" />
        </group>
      );
    case 'sidewalk':
      return (
        <group>
          {[-1.5, -0.5, 0.5, 1.5].map((x) => <Stripe key={x} p={[x, top, -1.95]} size={[0.02, 1.1]} c="#b7bdc9" />)}
          {[-0.6, -0.2, 0.2, 0.6].map((z) => <Stripe key={z} p={[-2.05, top, z + 0.5]} size={[0.6, 0.18]} c="#ffffff" />)}
          <Stripe p={[2.1, top, 0.5]} size={[0.6, 1.0]} c="#f0c24b" />
          <mesh position={[1.9, 0.55, back - 0.1]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.9, 8]} /><Mat c="#555d70" /></mesh>
          <mesh position={[1.9, 1.02, back - 0.1]}><sphereGeometry args={[0.1]} /><meshStandardMaterial color="#fff6c8" emissive="#ffe58a" emissiveIntensity={0.4} /></mesh>
          <Tree p={[-1.9, H / 2, back - 0.1]} s={0.8} />
        </group>
      );
    case 'bikelane':
      return (
        <group>
          <Stripe p={[0, top, 0.4]} size={[TILE, 1.3]} c="#5aa267" />
          <Stripe p={[0, top + 0.001, -0.3]} size={[TILE, 0.06]} c="#ffffff" />
          <Stripe p={[0, top + 0.001, 1.1]} size={[TILE, 0.06]} c="#ffffff" />
          <Stripe p={[0, top, 1.85]} size={[TILE, 0.9]} c="#5d6475" />
          <Tree p={[-1.8, H / 2, back - 0.1]} s={0.8} /><Tree p={[1.6, H / 2, back - 0.1]} s={0.7} />
        </group>
      );
    case 'air':
      return (
        <group>
          <House p={[-1.7, H / 2, back]} s={0.7} /><House p={[1.7, H / 2, back]} s={0.6} roof="#5d7fb0" />
          <House p={[-1.8, H / 2, 1.7]} s={0.5} roof="#7aa06a" />
          <Tree p={[0.2, H / 2, back]} s={0.7} />
          <Cloud p={[-0.9, 2.8, -1.2]} /><Cloud p={[1.4, 3.2, 0.6]} />
        </group>
      );
    case 'hospital':
      return (
        <group position={[0, H / 2, back - 0.1]}>
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow><boxGeometry args={[3.6, 1.4, 0.9]} /><Mat c="#ffffff" /></mesh>
          {[-1.2, -0.4, 0.4, 1.2].map((x) => [0.45, 0.95].map((y) => (
            <mesh key={`${x}${y}`} position={[x, y, 0.451]}><planeGeometry args={[0.35, 0.25]} /><meshStandardMaterial color="#9fc3e6" /></mesh>
          )))}
          <group position={[0, 1.6, 0]}>
            <mesh><boxGeometry args={[0.5, 0.15, 0.1]} /><meshStandardMaterial color="#e04848" /></mesh>
            <mesh><boxGeometry args={[0.15, 0.5, 0.1]} /><meshStandardMaterial color="#e04848" /></mesh>
          </group>
        </group>
      );
    case 'home':
      return (
        <group>
          <House p={[-1.3, H / 2, back]} />
          <Tree p={[1.6, H / 2, back]} s={0.9} />
          <Stripe p={[0, top, 0.6]} size={[3.6, 2.6]} c="#d8cdb9" />
        </group>
      );
    case 'care-home':
      return (
        <group position={[0, H / 2, back - 0.1]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[3.4, 1.0, 0.9]} /><Mat c="#f6f2fb" /></mesh>
          <mesh position={[0, 1.15, 0]} castShadow><boxGeometry args={[3.6, 0.3, 1.05]} /><Mat c="#8d7bb3" /></mesh>
          {[-1.1, -0.35, 0.35, 1.1].map((x) => (
            <mesh key={x} position={[x, 0.55, 0.451]}><planeGeometry args={[0.35, 0.3]} /><meshStandardMaterial color="#9fc3e6" /></mesh>
          ))}
        </group>
      );
    case 'warehouse':
      return (
        <group>
          {[-1.6, 1.6].map((x) => (
            <group key={x} position={[x, H / 2, back - 0.1]}>
              {[0.2, 0.55, 0.9].map((y) => <mesh key={y} position={[0, y, 0]} castShadow><boxGeometry args={[1.2, 0.04, 0.5]} /><Mat c="#4a6fa5" /></mesh>)}
              {[0.15, 0.5, 0.85].map((y) => <mesh key={y} position={[0, y + 0.12, 0]}><boxGeometry args={[1.0, 0.18, 0.4]} /><Mat c="#d9a55b" /></mesh>)}
            </group>
          ))}
          <Stripe p={[0, top, 0.5]} size={[TILE - 0.6, 0.06]} c="#f0c24b" />
          <Stripe p={[0, top, 2.0]} size={[TILE - 0.6, 0.06]} c="#f0c24b" />
        </group>
      );
    case 'industrial':
      return (
        <group>
          {[-1.6, -0.8].map((x) => (
            <mesh key={x} position={[x, H / 2 + 0.6, back]} castShadow><cylinderGeometry args={[0.35, 0.35, 1.2, 16]} /><Mat c="#aab2c0" /></mesh>
          ))}
          <mesh position={[1.4, H / 2 + 0.5, back]} castShadow><boxGeometry args={[1.6, 1.0, 0.8]} /><Mat c="#8aa3c2" /></mesh>
          <mesh position={[1.4, H / 2 + 0.35, back + 0.41]}><planeGeometry args={[0.9, 0.6]} /><Mat c="#5b6475" /></mesh>
        </group>
      );
    case 'park':
      return (
        <group>
          <Tree p={[-1.8, H / 2, back]} /><Tree p={[1.8, H / 2, back]} s={1.1} /><Tree p={[-1.9, H / 2, 1.8]} s={0.8} /><Tree p={[0.1, H / 2, back - 0.2]} s={0.9} />
        </group>
      );
    case 'field':
      return (
        <group>
          <Stripe p={[0, top, 0.3]} size={[TILE - 0.6, 0.05]} />
          <Stripe p={[0, top, 0.3]} size={[0.05, TILE - 1.2]} />
          <mesh position={[0, top, 0.3]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.55, 0.6, 32]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <Stripe p={[-2.2, top, 0.3]} size={[0.05, 1.6]} />
          <Stripe p={[2.2, top, 0.3]} size={[0.05, 1.6]} />
        </group>
      );
    case 'plaza':
      return (
        <group>
          <group position={[0, H / 2, back]}>
            <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.6, 0.65, 0.24, 24]} /><Mat c="#cbbd9f" /></mesh>
            <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.5, 0.5, 0.02, 24]} /><meshStandardMaterial color="#7fb4dc" /></mesh>
            <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.05, 0.08, 0.4, 8]} /><Mat c="#cbbd9f" /></mesh>
          </group>
          <mesh position={[-1.8, H / 2 + 0.15, back]} castShadow><boxGeometry args={[0.9, 0.1, 0.3]} /><Mat c="#8a6a4a" /></mesh>
          <Tree p={[1.9, H / 2, back]} s={0.8} />
        </group>
      );
    case 'beach':
      return (
        <group>
          <mesh position={[0, H / 2 + 0.01, -1.9]} receiveShadow><boxGeometry args={[TILE, 0.04, 1.2]} /><meshStandardMaterial color="#7fb4dc" transparent opacity={0.9} /></mesh>
          <group position={[1.8, H / 2, 1.7]}>
            <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.02, 0.8]} /><Mat c="#ffffff" /></mesh>
            <mesh position={[0, 0.8, 0]}><coneGeometry args={[0.45, 0.2, 12]} /><Mat c="#e05a5a" /></mesh>
          </group>
        </group>
      );
    case 'water':
      return (
        <group>
          <Stripe p={[0, top, -2.2]} size={[TILE, 0.6]} c="#c9b88f" />
          <Tree p={[-1.9, H / 2, -2.2]} s={0.6} /><Tree p={[1.6, H / 2, -2.2]} s={0.7} />
        </group>
      );
    case 'trail':
      return (
        <group>
          <Stripe p={[0, top, 0.4]} size={[TILE, 0.9]} c="#c9a477" rot={0.25} />
          <Tree p={[-1.8, H / 2, back]} /><Tree p={[1.7, H / 2, 1.9]} s={0.8} /><Tree p={[1.6, H / 2, back]} s={0.9} />
        </group>
      );
    case 'network':
      return (
        <group position={[0, top, 0]}>
          <gridHelper args={[TILE - 0.3, 10, '#5b77c2', '#3a508f']} />
        </group>
      );
  }
}

export default function ZoneTile({ name, setting, position, number }: { name: string; setting: ZoneSetting; position: [number, number, number]; number: number }) {
  return (
    <group position={position}>
      <RoundedBox args={[TILE, H, TILE]} radius={0.08} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color={TILE_COLOR[setting]} roughness={0.9} />
      </RoundedBox>
      <Scenery setting={setting} />
      <Html position={[0, H / 2, TILE / 2 + 0.05]} center zIndexRange={[10, 0]}>
        <div className={'zone-tag' + (setting === 'network' ? ' dark' : '')}>
          {number}. {name}
        </div>
      </Html>
    </group>
  );
}
