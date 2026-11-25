/**
 * The Types world: zones become diorama tiles; each type becomes a clickable model on its zone.
 * Layout is computed from data, so any department renders without changes here.
 */
import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
import { Vector3, type Group } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Department, TypeItem } from '../../data/schema';
import ZoneTile, { TILE } from './ZoneTile';
import Landscape, { AreaLabel } from './Landscape';
import { Model, MOVING, FLYING, FLOATING } from './models';

const GAP = 0.9;

interface Placed {
  item: TypeItem;
  pos: [number, number, number];
}

export function useLayout(dept: Department) {
  return useMemo(() => {
    const zones = dept.types.zones;

    if (dept.types.layout === 'landscape') {
      const ground = dept.types.ground ?? [36, 28];
      const placed: Placed[] = [];
      for (const z of zones) {
        const a = z.area ?? { x: 0, z: 0, w: 4, d: 4 };
        const items = dept.types.items.filter((it) => it.zoneId === z.id);
        const front = z.setting === 'air' || z.setting === 'water' ? 0 : a.d * 0.12;
        items.forEach((it, k) => {
          placed.push({ item: it, pos: [a.x + (k - (items.length - 1) / 2) * 2.2, 0.04, a.z + front] });
        });
      }
      const plaza = zones.find((z) => z.setting === 'plaza' && z.area)?.area;
      return {
        kind: 'landscape' as const,
        tiles: [],
        placed,
        extent: Math.max(...ground) * 0.88,
        ground,
        hub: (plaza ? [plaza.x, plaza.z] : [0, 0]) as [number, number],
      };
    }

    const cols = Math.ceil(Math.sqrt(zones.length));
    const rows = Math.ceil(zones.length / cols);
    const step = TILE + GAP;
    const tiles = zones.map((z, i) => {
      const r = Math.floor(i / cols);
      const inRow = r === rows - 1 ? zones.length - r * cols : cols;
      const c = i % cols;
      const x = (c - (inRow - 1) / 2) * step;
      const zz = (r - (rows - 1) / 2) * step;
      return { zone: z, pos: [x, 0, zz] as [number, number, number] };
    });
    const placed: Placed[] = [];
    for (const t of tiles) {
      const items = dept.types.items.filter((it) => it.zoneId === t.zone.id);
      const ic = Math.min(items.length, 2);
      const ir = Math.ceil(items.length / 2);
      items.forEach((it, k) => {
        const cc = k % 2;
        const rr = Math.floor(k / 2);
        const inRow = rr === ir - 1 ? items.length - rr * 2 : ic;
        const x = t.pos[0] + (cc - (inRow - 1) / 2) * 2.2;
        const z = t.pos[2] + 0.45 + (rr - (ir - 1) / 2) * 1.9;
        placed.push({ item: it, pos: [x, 0.15, z] });
      });
    }
    const extent = Math.max(cols, rows) * step;
    return { kind: 'tiles' as const, tiles, placed, extent, ground: [0, 0] as [number, number], hub: [0, 0] as [number, number] };
  }, [dept]);
}

function Item({ placed, color, selected, onSelect, index, flyHeight = 1.6 }: { placed: Placed; color: string; selected: boolean; onSelect: () => void; index: number; flyHeight?: number }) {
  const ref = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  const kind = placed.item.model;
  const phase = index * 1.7;

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime + phase;
    if (MOVING.includes(kind)) {
      const s = Math.sin(t * 0.5);
      g.position.x = s * 0.5;
      g.rotation.y = Math.cos(t * 0.5) >= 0 ? 0 : Math.PI;
    } else if (FLYING.includes(kind)) {
      g.position.y = flyHeight + Math.sin(t * 1.4) * 0.12;
      g.rotation.y = Math.sin(t * 0.3) * 0.4;
    } else if (FLOATING.includes(kind)) {
      g.position.y = Math.sin(t * 1.2) * 0.03;
      g.rotation.z = Math.sin(t * 0.9) * 0.04;
    }
    const target = hover || selected ? 1.15 : 1;
    g.scale.lerp(new Vector3(target, target, target), 0.15);
  });

  useEffect(() => () => void (document.body.style.cursor = 'auto'), []);

  return (
    <group position={placed.pos}>
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <group scale={1.3}>
          <Model kind={kind} color={color} highlight={hover || selected} />
        </group>
        {/* invisible hit box so small models are easy to click */}
        <mesh position={[0, FLYING.includes(kind) ? 0 : 0.5, 0]} visible={false}>
          <boxGeometry args={[1.6, 1.6, 1.3]} />
        </mesh>
        {(hover || selected) && (
          <Html position={[0, FLYING.includes(kind) ? 0.7 : 1.95, 0]} center zIndexRange={[20, 0]}>
            <div className="item-tip">{placed.item.name}</div>
          </Html>
        )}
      </group>
      {FLYING.includes(kind) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 24]} />
          <meshBasicMaterial color="#17285a" transparent opacity={0.12} />
        </mesh>
      )}
      {selected && <SelectRing color={color} />}
    </group>
  );
}

function SelectRing({ color }: { color: string }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.06;
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <group ref={ref} position={[0, 0.03, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.97, 48]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/** Eases the orbit target / camera toward the selected item, then lets the user take over. */
function CameraRig({ focus, home }: { focus: [number, number, number] | null; home: { pos: Vector3; target: Vector3 } }) {
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;
  const camera = useThree((s) => s.camera);
  const goal = useRef<{ pos: Vector3; target: Vector3 } | null>(null);

  useEffect(() => {
    goal.current = focus
      ? { target: new Vector3(focus[0], 0.6, focus[2]), pos: new Vector3(focus[0] + 2.2, 4.2, focus[2] + 6) }
      : { pos: home.pos.clone(), target: home.target.clone() };
  }, [focus, home]);

  useFrame(() => {
    if (!goal.current || !controls) return;
    camera.position.lerp(goal.current.pos, 0.07);
    controls.target.lerp(goal.current.target, 0.07);
    controls.update();
    if (camera.position.distanceTo(goal.current.pos) < 0.05) goal.current = null;
  });
  return null;
}

export default function CityWorld({
  dept,
  selectedId,
  onSelect,
  resetKey,
}: {
  dept: Department;
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  resetKey: number;
}) {
  const { kind, tiles, placed, extent, ground, hub } = useLayout(dept);
  const landscape = kind === 'landscape';
  const home = useMemo(
    () =>
      landscape
        ? { pos: new Vector3(0, extent * 0.85, extent * 1.0), target: new Vector3(0, 0, 0.5) }
        : { pos: new Vector3(0, extent * 0.78, extent * 1.02), target: new Vector3(0, 0, extent * 0.1) },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extent, resetKey, landscape],
  );
  const sel = placed.find((p) => p.item.id === selectedId);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: home.pos.toArray() as [number, number, number], fov: 40, near: 0.1, far: 200 }}
      onPointerMissed={() => onSelect(undefined)}
    >
      <color attach="background" args={['#eef2f8']} />
      <fog attach="fog" args={['#eef2f8', extent * 2.2, extent * 4]} />
      <hemisphereLight args={['#ffffff', '#c9d2e3', 0.9]} />
      <directionalLight
        position={[extent * 0.6, extent, extent * 0.4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-extent}
        shadow-camera-right={extent}
        shadow-camera-top={extent}
        shadow-camera-bottom={-extent}
      />
      <group>
        {landscape ? (
          <>
            <Landscape zones={dept.types.zones} ground={ground} hub={hub} />
            {dept.types.zones.map((z, i) => z.area && <AreaLabel key={z.id} zone={z} number={i + 1} />)}
          </>
        ) : (
          tiles.map((t, i) => (
            <ZoneTile key={t.zone.id} name={t.zone.name} setting={t.zone.setting} position={t.pos} number={i + 1} />
          ))
        )}
        {placed.map((p, i) => (
          <Item
            key={p.item.id}
            index={i}
            placed={p}
            color={dept.accent}
            selected={p.item.id === selectedId}
            onSelect={() => onSelect(p.item.id)}
            flyHeight={landscape ? 2.4 : 1.6}
          />
        ))}
      </group>
      <ContactShadows position={[0, -0.16, 0]} scale={extent * 2.4} opacity={0.25} blur={2.5} far={4} />
      <OrbitControls
        makeDefault
        enablePan
        minDistance={4}
        maxDistance={extent * 2.2}
        maxPolarAngle={Math.PI / 2.25}
        target={home.target.toArray() as [number, number, number]}
      />
      <CameraRig focus={sel ? sel.pos : null} home={home} />
    </Canvas>
  );
}
