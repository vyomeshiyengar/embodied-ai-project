/**
 * The city twin: a real neighborhood (OpenStreetMap via OpenMapTiles) rendered with three.js,
 * sun and soft shadows, sky, ambient occlusion and fog, with embodied AI models working in it.
 *
 * Inspired by the Horyx Studio reel (aerial city, zoom into one place, details panel, filters that
 * light up the scene; notes in docs/design/3d-city-map-learnings.md) and Vyomesh Iyengar's MVP 3D world.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildingsGeometry, facadeMaterial, areasGeometry, roadsGeometry, treesMesh, type TwinData } from './geometry';
import { makeModel, type ModelKind } from './models';
import { place, type Zone, type Motion } from './placement';

export interface TwinItem { id: string; zone?: Zone; kind?: ModelKind; motion?: Motion; at?: [number, number] }
export interface TwinOptions { lowFx?: boolean; reduced?: boolean }

const SPEED: Partial<Record<ModelKind, number>> = { robotaxi: 7, pod: 6, truck: 7, shuttle: 5, 'delivery-van': 6, 'sensor-van': 5, 'sidewalk-robot': 1.4, mower: 0.9, 'cleaning-robot': 0.9, quadruped: 1.4, humanoid: 1.1, 'patrol-robot': 1.1 };
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createTwin(canvas: HTMLCanvasElement, data: TwinData, items: TwinItem[], opt: TwinOptions = {}) {
  const half = data.half;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opt.lowFx, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opt.lowFx ? 1 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#dfe8f2');
  scene.fog = new THREE.Fog('#dfe8f2', half * 2.6, half * 5.2);

  const camera = new THREE.PerspectiveCamera(38, 1, 1, half * 12);
  const home = { pos: new THREE.Vector3(half * 0.95, half * 1.45, half * 1.6), target: new THREE.Vector3(0, 0, -half * 0.05) };
  camera.position.copy(home.pos);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = 1.36;
  controls.minDistance = 8;
  controls.maxDistance = half * 3.2;
  controls.target.copy(home.target);
  controls.autoRotate = !opt.reduced;
  controls.autoRotateSpeed = 0.35;

  // Light: sun high in the south-west (as over a northern-hemisphere city), so shadows fall to the north-east, across the view.
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(50), THREE.MathUtils.degToRad(-40));
  const hemi = new THREE.HemisphereLight('#e4eefa', '#8f8f84', 0.8);
  const sun = new THREE.DirectionalLight('#ffecd2', 3.5);
  sun.position.copy(sunDir).multiplyScalar(half * 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(opt.lowFx ? 2048 : 4096, opt.lowFx ? 2048 : 4096);
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -half * 1.1; sc.right = half * 1.1; sc.top = half * 1.1; sc.bottom = -half * 1.1; sc.near = 1; sc.far = half * 5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.8;
  scene.add(hemi, sun, sun.target);

  // Soft image-based light so glass and metal reflect something instead of going black.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.28;
  pmrem.dispose();

  const sky = new Sky();
  sky.scale.setScalar(half * 10);
  const u = sky.material.uniforms;
  u.turbidity.value = 3.2; u.rayleigh.value = 1.1; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.8;
  u.sunPosition.value.copy(sunDir);
  scene.add(sky);

  // Ground, green, water, roads, buildings, trees
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);
  const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(half * 8, half * 8)), track(new THREE.MeshStandardMaterial({ color: '#d4d6d0', roughness: 1 })));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const greens = areasGeometry(data.green, 0.03);
  const greenMesh = new THREE.Mesh(track(greens.geometry), track(new THREE.MeshStandardMaterial({ color: '#a9c79a', roughness: 1 })));
  greenMesh.receiveShadow = true;
  const waters = areasGeometry(data.water, 0.04);
  const waterMesh = new THREE.Mesh(track(waters.geometry), track(new THREE.MeshStandardMaterial({ color: '#8fb6d6', roughness: 0.15, metalness: 0.1 })));
  waterMesh.receiveShadow = true;
  const roads = roadsGeometry(data);
  const roadMesh = new THREE.Mesh(track(roads.geometry), track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 })));
  roadMesh.receiveShadow = true;
  const dashMesh = new THREE.Mesh(track(roads.dashes), track(new THREE.MeshStandardMaterial({ color: '#f4f1e8', roughness: 0.8 })));
  const blds = buildingsGeometry(data);
  const bldMesh = new THREE.Mesh(track(blds.geometry), track(facadeMaterial()));
  bldMesh.castShadow = true;
  bldMesh.receiveShadow = true;
  const trees = treesMesh(greens.areas);
  scene.add(greenMesh, waterMesh, roadMesh, dashMesh, bldMesh, trees);

  // Embodied AI: place each item, build its model, add a highlight ring
  const placements = place(items.map((i) => i.zone ?? 'street'), { segments: roads.segments, green: greens.areas, water: waters.areas, footprints: blds.footprints, half }, (i) => items[i].motion ?? 'drive');
  const ringGeo = track(new THREE.RingGeometry(1, 1.25, 48));
  const ringMat = track(new THREE.MeshBasicMaterial({ color: '#0077d8', transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }));
  const actors = items.map((it, i) => {
    const pl = placements[i];
    if (it.at) { pl.anchor.set(it.at[0], 0, it.at[1]); pl.path = [pl.anchor.clone()]; pl.motion = 'static'; }
    const model = it.kind ? makeModel(it.kind) : null;
    const group = model?.group ?? new THREE.Group();
    group.position.copy(pl.anchor);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    const rs = Math.max(2.2, (model?.size ?? 4) * 0.75);
    ring.scale.setScalar(rs);
    ring.position.y = 0.12;
    ring.visible = false;
    group.add(ring);
    scene.add(group);
    const speed = SPEED[it.kind as ModelKind] ?? 1.2;
    const len = pl.path.length > 1 ? pl.path[0].distanceTo(pl.path[1]) : 0;
    return { it, pl, model, group, ring, speed, len, phase: (i * 0.37) % 1, prev: pl.anchor.clone() };
  });

  // Post-processing: ambient occlusion on capable devices
  let composer: EffectComposer | null = null;
  if (!opt.lowFx) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const ao = new GTAOPass(scene, camera, 1, 1);
    ao.blendIntensity = 0.85;
    ao.updateGtaoMaterial({ radius: 6, distanceExponent: 1.4, thickness: 2, scale: 1 });
    composer.addPass(ao);
    composer.addPass(new OutputPass());
  }

  // Shadows: the whole neighborhood from afar; a tight, crisp area around the focused use case.
  const fitShadow = (center: THREE.Vector3, radius: number) => {
    sun.target.position.copy(center).setY(0);
    sun.position.copy(sun.target.position).addScaledVector(sunDir, radius * 3 + 200);
    sc.left = -radius; sc.right = radius; sc.top = radius; sc.bottom = -radius;
    sc.near = 1; sc.far = radius * 6 + 600;
    sc.updateProjectionMatrix();
  };
  fitShadow(new THREE.Vector3(), half * 1.1);

  // Camera flights
  let flight: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; start: number; dur: number } | null = null;
  let follow: (typeof actors)[number] | null = null;
  const focusOffset = new THREE.Vector3();
  let focusLift = 0;
  const flyTo = (pos: THREE.Vector3, target: THREE.Vector3) => {
    if (opt.reduced) { camera.position.copy(pos); controls.target.copy(target); controls.update(); return; }
    flight = { from: camera.position.clone(), to: pos, tFrom: controls.target.clone(), tTo: target, start: performance.now(), dur: 1500 };
  };
  let idleTimer = 0;
  controls.addEventListener('start', () => { controls.autoRotate = false; flight = null; clearTimeout(idleTimer); });
  controls.addEventListener('end', () => { if (!follow && !opt.reduced) idleTimer = window.setTimeout(() => (controls.autoRotate = true), 9000); });

  function focus(id: string) {
    const a = actors.find((x) => x.it.id === id);
    if (!a) return;
    follow = a;
    controls.autoRotate = false;
    const s = Math.max(7, (a.model?.size ?? 4) * 3.2);
    focusOffset.set(0.75, 0.6, 1).normalize().multiplyScalar(s * 2.2);
    focusLift = (a.model?.size ?? 2) * 0.25;
    const p = a.group.position;
    flyTo(p.clone().add(focusOffset), p.clone().setY(p.y + focusLift));
  }
  function goHome() {
    follow = null;
    fitShadow(new THREE.Vector3(), half * 1.1);
    flyTo(home.pos.clone(), home.target.clone());
    if (!opt.reduced) idleTimer = window.setTimeout(() => (controls.autoRotate = true), 4000);
  }
  function highlight(ids: string[] | null) {
    for (const a of actors) a.ring.visible = !!ids && ids.includes(a.it.id);
  }

  // Frame loop
  let raf = 0, last = performance.now(), t = 0, w = 1, h = 1;
  const frameHooks: (() => void)[] = [];
  const tmp = new THREE.Vector3();
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!opt.reduced) t += dt;
    for (const a of actors) {
      const { pl, group } = a;
      a.prev.copy(group.position);
      if (pl.motion === 'fly') {
        const ang = t * 0.25 + a.phase * 6.28;
        const r = pl.radius ?? 25;
        group.position.set(pl.anchor.x + Math.cos(ang) * r, pl.anchor.y + Math.sin(t * 0.9 + a.phase * 5) * 2, pl.anchor.z + Math.sin(ang) * r);
        group.rotation.y = -ang;
      } else if (pl.motion === 'float' || (pl.motion === 'walk' && pl.path.length === 1)) {
        const r = pl.radius ?? 5;
        const ang = (t * a.speed) / Math.max(2, r) + a.phase * 6.28;
        group.position.set(pl.anchor.x + Math.cos(ang) * r, pl.anchor.y, pl.anchor.z + Math.sin(ang) * r);
        group.rotation.y = -ang;
      } else if ((pl.motion === 'drive' || pl.motion === 'walk') && a.len > 1) {
        // Back and forth along the route, turning at each end
        const cycle = (2 * a.len) / a.speed;
        const k = ((t / cycle + a.phase) % 1) * 2;
        const f = k < 1 ? k : 2 - k;
        group.position.lerpVectors(pl.path[0], pl.path[1], f);
        tmp.subVectors(pl.path[1], pl.path[0]).multiplyScalar(k < 1 ? 1 : -1);
        group.rotation.y = Math.atan2(tmp.x, tmp.z);
      }
      a.model?.tick?.(t);
    }
    if (flight) {
      const k = Math.min(1, (now - flight.start) / flight.dur);
      const e = ease(k);
      if (follow) {
        // Aim at where the model is now, so the camera lands on it while it moves.
        flight.tTo.copy(follow.group.position).setY(follow.group.position.y + focusLift);
        flight.to.copy(flight.tTo).add(focusOffset);
      }
      camera.position.lerpVectors(flight.from, flight.to, e);
      controls.target.lerpVectors(flight.tFrom, flight.tTo, e);
      if (k >= 1) flight = null;
    } else if (follow) {
      tmp.subVectors(follow.group.position, follow.prev);
      camera.position.add(tmp);
      controls.target.add(tmp);
    }
    if (follow) fitShadow(follow.group.position, 70);
    // Keep the view over the neighborhood
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -half, half);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -half, half);
    controls.update();
    if (composer) composer.render(); else renderer.render(scene, camera);
    frameHooks.forEach((f) => f());
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    camera,
    actors,
    /** Screen position of each item (CSS pixels within the canvas). */
    project(id: string) {
      const a = actors.find((x) => x.it.id === id);
      if (!a) return null;
      tmp.copy(a.group.position);
      tmp.y += Math.max(1.6, (a.model?.size ?? 2) * 0.6);
      tmp.project(camera);
      return { x: ((tmp.x + 1) / 2) * w, y: ((1 - tmp.y) / 2) * h, visible: tmp.z < 1 && Math.abs(tmp.x) < 1.05 && Math.abs(tmp.y) < 1.05 };
    },
    onFrame(f: () => void) { frameHooks.push(f); },
    focus,
    home: goHome,
    highlight,
    resize(width: number, height: number) {
      w = width; h = height;
      renderer.setSize(width, height, false);
      composer?.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    },
    dispose() {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      controls.dispose();
      composer?.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry?.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x?.dispose()); }
      });
      disposables.forEach((d) => d.dispose());
      envTex.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

export type Twin = ReturnType<typeof createTwin>;
