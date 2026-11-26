/**
 * The shared schematic street scene (Three.js). Built from primitives in code: no downloaded models.
 * Monochrome GovEx blues on a light gray-blue ground; gold marks "the thing going wrong".
 * Colors come from CSS custom properties in src/styles/tokens.css.
 *
 * The scene exposes named objects and anchors so callers (the Welcome backdrop) can show, hide,
 * highlight and label them. It renders on demand: call `render()` after changes.
 */
import * as THREE from 'three';

export type Mode = 'day' | 'xray' | 'dark';
export interface SceneState {
  mode: Mode;
  show: string[];        // optional groups to show: sensors, link, authority, fireScene, busScene, fleetScale
  highlight: string[];   // car ids or groups to paint gold: curbTaxi, fireTaxi, busTaxi, fleet
  frozen: boolean;       // fleet stops where it is
  signalsOff: boolean;
}

const css = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
};

interface Car { id: string; body: THREE.Mesh; group: THREE.Group; lane?: Lane; fleet: boolean }
interface Lane { axis: 'x' | 'z'; fixed: number; dir: 1 | -1; speed: number; offset: number; min: number; max: number; y?: number }

export function buildScene(canvas: HTMLCanvasElement) {
  const C = {
    bg: css('--scene-bg', '#dde4ee'),
    ground: css('--scene-ground', '#e9eef5'),
    road: css('--scene-road', '#c3cedd'),
    building: css('--scene-building', '#f4f7fb'),
    edge: css('--scene-building-edge', '#7d9cc6'),
    vehicle: css('--scene-vehicle', '#0077d8'),
    accent: css('--scene-accent', '#002d72'),
    alert: css('--scene-alert', '#f1c400'),
    green: css('--scene-green', '#b9d7b0'),
    spirit: css('--c-spirit', '#68ace5'),
    xrayBg: new THREE.Color('#0a1d42'),
    darkBg: new THREE.Color('#77839a'),
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = C.bg.clone();
  const camera = new THREE.PerspectiveCamera(35, 1, 1, 2000);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb8c6dc, 1.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(60, 110, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 10, far: 400 });
  scene.add(sun);

  const anchors: Record<string, THREE.Vector3> = {};
  const groups: Record<string, THREE.Object3D> = {};
  const buildingMats: THREE.MeshLambertMaterial[] = [];
  const edgeMats: THREE.LineBasicMaterial[] = [];

  const mat = (c: THREE.Color, opts: THREE.MeshLambertMaterialParameters = {}) => new THREE.MeshLambertMaterial({ color: c.clone(), ...opts });
  const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // ---- ground, roads, sidewalks ----
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), mat(C.ground));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const roadMat = mat(C.road);
  const walkMat = mat(new THREE.Color('#f7f9fc'));
  const road = (w: number, d: number, x: number, z: number, m = roadMat, y = 0.02) => {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
    r.rotation.x = -Math.PI / 2;
    r.position.set(x, y, z);
    r.receiveShadow = true;
    scene.add(r);
    return r;
  };
  road(240, 14, 0, 0);            // main avenue (along x)
  road(12, 240, 0, 0);            // cross street (along z)
  road(260, 16, 0, -78);          // highway at the city edge
  road(240, 4, 0, 9, walkMat, 0.06); road(240, 4, 0, -9, walkMat, 0.06);
  road(4, 240, 8, 0, walkMat, 0.06); road(4, 240, -8, 0, walkMat, 0.06);
  // lane markings
  const dash = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let x = -116; x < 116; x += 8) if (Math.abs(x) > 9) road(4, 0.35, x, 0, dash, 0.05);
  for (let z = -116; z < 116; z += 8) if (Math.abs(z) > 9) road(0.35, 4, 0, z, dash, 0.05);
  for (let i = -5; i <= 5; i++) { road(1, 3, i * 1.8, 8.6, dash, 0.07); road(1, 3, i * 1.8, -8.6, dash, 0.07); road(3, 1, 8.6, i * 1.8, dash, 0.07); road(3, 1, -8.6, i * 1.8, dash, 0.07); }

  // ---- buildings ----
  const city = new THREE.Group();
  scene.add(city);
  const addBuilding = (w: number, h: number, d: number, x: number, z: number) => {
    const m = mat(C.building, { transparent: true, opacity: 1 });
    buildingMats.push(m);
    const b = box(w, h, d, m, x, 0, z);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color: C.edge.clone(), transparent: true, opacity: 0.9 }));
    edgeMats.push(e.material as THREE.LineBasicMaterial);
    e.position.copy(b.position);
    city.add(b, e);
    return b;
  };
  const lots: [number, number, number, number, number][] = [
    // w, h, d, x, z  (four quadrants around the intersection)
    [16, 30, 14, -22, -22], [12, 18, 12, -40, -20], [14, 44, 14, -24, -42], [10, 12, 16, -44, -44],
    [18, 22, 14, 24, -22], [12, 36, 12, 42, -24], [16, 14, 16, 24, -44], [12, 26, 14, 46, -46],
    [14, 16, 14, 24, 24], [12, 24, 12, 44, 22], [16, 34, 14, 24, 44], [12, 14, 16, 44, 46],
    [16, 20, 14, -24, 24], [12, 12, 12, -44, 22], [14, 28, 16, -24, 46], [12, 18, 12, -44, 46],
    [14, 10, 14, -68, -24], [14, 16, 14, 68, 24], [14, 12, 14, 68, -24], [14, 22, 14, -68, 26],
  ];
  for (const l of lots) addBuilding(...l);
  // Remote operations center: low wide building with an antenna, at the city edge.
  addBuilding(26, 8, 16, -70, -52);
  const ant = box(0.6, 10, 0.6, mat(C.accent), -62, 8, -52);
  city.add(ant);
  anchors.opsCenter = new THREE.Vector3(-62, 19, -52);
  // Fire station
  const fs = addBuilding(14, 9, 12, 46, 2 + 18);
  anchors.fireStation = fs.position.clone().setY(12);
  // trees
  const treeMat = mat(C.green);
  for (const [x, z] of [[-14, 12], [-30, 12], [14, 12], [30, 12], [-14, -12], [30, -12], [12, 30], [-12, 30], [12, -30], [-12, -60], [60, 12], [-60, -12]]) {
    const t = new THREE.Mesh(new THREE.SphereGeometry(2.4, 10, 8), treeMat);
    t.position.set(x, 3.6, z);
    t.castShadow = true;
    scene.add(t, box(0.4, 1.6, 0.4, mat(C.edge), x, 0, z));
  }

  // ---- traffic signals ----
  const signalLights: THREE.MeshBasicMaterial[] = [];
  for (const [x, z] of [[9, 9], [-9, 9], [9, -9], [-9, -9]]) {
    scene.add(box(0.35, 6, 0.35, mat(C.accent), x, 0, z));
    const head = box(1.2, 2.4, 1.2, mat(C.accent), x, 6, z);
    scene.add(head);
    const lm = new THREE.MeshBasicMaterial({ color: C.spirit.clone() });
    signalLights.push(lm);
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), lm);
    l.position.set(x, 7.4, z + (z > 0 ? -0.65 : 0.65));
    scene.add(l);
  }
  anchors.signals = new THREE.Vector3(9, 9, 9);

  // ---- vehicles ----
  const cars: Car[] = [];
  const wheelMat = mat(new THREE.Color('#33415c'));
  const makeCar = (id: string, fleet = true, color = C.vehicle) => {
    const g = new THREE.Group();
    const bodyMat = mat(color);
    const body = box(4.6, 1.3, 2.1, bodyMat, 0, 0.45, 0);
    const cabin = box(2.6, 1.0, 1.9, mat(new THREE.Color('#dbe8f7')), -0.2, 1.75, 0);
    const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.45, 14), mat(C.accent));
    lidar.position.set(-0.2, 3.0, 0);
    g.add(body, cabin, lidar);
    for (const [wx, wz] of [[1.5, 1.05], [-1.5, 1.05], [1.5, -1.05], [-1.5, -1.05]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 12), wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, 0.45, wz);
      g.add(w);
    }
    scene.add(g);
    const car: Car = { id, body, group: g, fleet };
    cars.push(car);
    return car;
  };
  const place = (o: THREE.Object3D, x: number, z: number, rotY = 0) => { o.position.set(x, 0, z); o.rotation.y = rotY; };

  // Moving fleet: lanes on the avenue and the cross street.
  const fleetLanes: Lane[] = [
    { axis: 'x', fixed: 3.4, dir: 1, speed: 26, offset: 0, min: -115, max: 115 },
    { axis: 'x', fixed: 3.4, dir: 1, speed: 26, offset: 80, min: -115, max: 115 },
    { axis: 'x', fixed: -3.4, dir: -1, speed: 24, offset: 30, min: -115, max: 115 },
    { axis: 'x', fixed: -3.4, dir: -1, speed: 24, offset: 140, min: -115, max: 115 },
    { axis: 'z', fixed: 3, dir: -1, speed: 22, offset: 60, min: -115, max: 115 },
    { axis: 'z', fixed: -3, dir: 1, speed: 22, offset: 10, min: -115, max: 115 },
  ];
  fleetLanes.forEach((lane, i) => { const c = makeCar('fleet-' + i); c.lane = lane; });

  // Robotaxi at the curb pickup zone
  const curbTaxi = makeCar('curbTaxi');
  place(curbTaxi.group, -26, -6.2);
  anchors.curbTaxi = new THREE.Vector3(-26, 4, -6.2);

  // Shuttle on the cross street
  const shuttle = new THREE.Group();
  shuttle.add(box(7, 2.6, 2.6, mat(new THREE.Color('#ffffff')), 0, 0.4, 0), box(7.02, 0.9, 2.62, mat(C.accent), 0, 1.6, 0));
  place(shuttle, -3, 34, Math.PI / 2);
  scene.add(shuttle);
  anchors.shuttle = new THREE.Vector3(-3, 5, 34);

  // Driverless truck on the highway
  const truck = new THREE.Group();
  truck.add(box(4, 3.4, 2.8, mat(C.accent), 8, 0.4, 0), box(13, 4, 2.9, mat(new THREE.Color('#f2f5fa')), -1.2, 0.4, 0));
  place(truck, 30, -81);
  scene.add(truck);
  anchors.truck = new THREE.Vector3(34, 6, -81);

  // ---- scenario: fire scene (engine blocked by a stalled robotaxi) ----
  const fireScene = new THREE.Group();
  const engine = new THREE.Group();
  engine.add(box(8, 3, 2.8, mat(new THREE.Color('#9b2c2c')), 0, 0.4, 0), box(2.4, 1, 2.6, mat(new THREE.Color('#e6e9ef')), -1, 3.4, 0));
  place(engine, 64, -3.4, Math.PI);
  fireScene.add(engine);
  for (let i = 0; i < 4; i++) { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 10), mat(C.alert)); cone.position.set(40 + i * 3, 0.7, -6.5); fireScene.add(cone); }
  scene.add(fireScene);
  const fireTaxi = makeCar('fireTaxi', false);
  place(fireTaxi.group, 54, -3.4, 0.25);
  fireScene.add(fireTaxi.group);
  anchors.fireEngine = new THREE.Vector3(66, 6, -3.4);
  anchors.fireTaxi = new THREE.Vector3(54, 4, -3.4);
  groups.fireScene = fireScene;

  // ---- scenario: school bus with stop arm ----
  const busScene = new THREE.Group();
  const bus = new THREE.Group();
  bus.add(box(10, 3, 2.7, mat(new THREE.Color('#e0b100')), 0, 0.4, 0));
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 8), mat(new THREE.Color('#b22d2d')));
  arm.rotation.x = Math.PI / 2;
  arm.position.set(2.6, 2.4, -1.9);
  bus.add(arm);
  place(bus, -3, -40, Math.PI / 2);
  busScene.add(bus);
  const busTaxi = makeCar('busTaxi', false);
  place(busTaxi.group, 3, -34, Math.PI / 2);
  busScene.add(busTaxi.group);
  const kid = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 0.9, 4, 8), mat(C.accent));
  kid.position.set(-6.8, 1, -38);
  busScene.add(kid);
  scene.add(busScene);
  anchors.bus = new THREE.Vector3(-3, 5, -40);
  anchors.busTaxi = new THREE.Vector3(3, 4, -34);
  groups.busScene = busScene;

  // ---- pedestrians ----
  const pedMat = mat(C.accent);
  for (const [x, z] of [[-12, 9.5], [-11, -9.6], [12, 9.2], [9.4, 14], [-9.4, -18], [20, -9.5], [-30, 9.4]]) {
    const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 1.1, 4, 8), pedMat);
    p.position.set(x, 1.1, z);
    p.castShadow = true;
    scene.add(p);
  }

  // ---- X-ray: sensors around the curb taxi and the link to remote operations ----
  const sensors = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.RingGeometry(9.5, 10, 64), new THREE.MeshBasicMaterial({ color: C.spirit.clone(), transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(-26, 0.3, -6.2);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(9.5, 64), new THREE.MeshBasicMaterial({ color: C.spirit.clone(), transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
  disc.rotation.x = -Math.PI / 2;
  disc.position.set(-26, 0.25, -6.2);
  const fov = new THREE.Mesh(new THREE.ConeGeometry(6, 16, 4, 1, true), new THREE.MeshBasicMaterial({ color: C.alert.clone(), transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
  fov.rotation.z = Math.PI / 2;
  fov.position.set(-26 + 10, 2, -6.2);
  sensors.add(disc, ring, fov);
  scene.add(sensors);
  groups.sensors = sensors;
  anchors.sensors = new THREE.Vector3(-16, 2, -6.2);

  const linkCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-26, 3.4, -6.2), new THREE.Vector3(-46, 40, -30), anchors.opsCenter.clone());
  const linkGeom = new THREE.BufferGeometry().setFromPoints(linkCurve.getPoints(60));
  const linkMat = new THREE.LineDashedMaterial({ color: C.alert.clone(), dashSize: 1.6, gapSize: 1.1 });
  const link = new THREE.Line(linkGeom, linkMat);
  link.computeLineDistances();
  scene.add(link);
  groups.link = link;
  anchors.link = linkCurve.getPoint(0.28);

  // ---- authority layers (federal, state, city) ----
  const authority = new THREE.Group();
  const layer = (y: number, c: THREE.Color, op: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(150, 0.6, 150), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthWrite: false }));
    m.position.y = y;
    authority.add(m);
  };
  layer(78, C.accent.clone(), 0.2); layer(62, C.vehicle.clone(), 0.16); layer(48, C.spirit.clone(), 0.16);
  scene.add(authority);
  groups.authority = authority;
  anchors.federal = new THREE.Vector3(-70, 79, 70); anchors.state = new THREE.Vector3(-70, 63, 70); anchors.city = new THREE.Vector3(-70, 49, 70);

  // ---- fleet at scale: a wider grid of roads with many cars, all stopped ----
  const fleetScale = new THREE.Group();
  const gridMat = mat(C.road);
  for (const v of [-160, -110, 110, 160]) {
    const a = new THREE.Mesh(new THREE.PlaneGeometry(460, 10), gridMat); a.rotation.x = -Math.PI / 2; a.position.set(0, 0.03, v); fleetScale.add(a);
    const b = new THREE.Mesh(new THREE.PlaneGeometry(10, 460), gridMat); b.rotation.x = -Math.PI / 2; b.position.set(v, 0.03, 0); fleetScale.add(b);
  }
  const big = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(C.ground));
  big.rotation.x = -Math.PI / 2; big.position.y = -0.05;
  fleetScale.add(big);
  const N = 140;
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(4.6, 2.2, 2.1), mat(C.alert), N);
  const tmp = new THREE.Object3D();
  const rows = [-160, -110, 0, 110, 160];
  for (let i = 0; i < N; i++) {
    const along = -210 + ((i * 37) % 420);
    const r = rows[i % rows.length] + (i % 2 ? 2.5 : -2.5);
    if (i % 3) tmp.position.set(along, 1.1, r); else tmp.position.set(r, 1.1, along);
    tmp.rotation.y = i % 3 ? 0 : Math.PI / 2;
    tmp.updateMatrix();
    inst.setMatrixAt(i, tmp.matrix);
  }
  fleetScale.add(inst);
  scene.add(fleetScale);
  groups.fleetScale = fleetScale;

  // ---- extras for the welcome scene: other sectors on the same street ----
  const extras = new THREE.Group();
  // Sidewalk delivery robot (sector 05)
  const bot = new THREE.Group();
  bot.add(box(1.6, 1.1, 1.1, mat(new THREE.Color('#ffffff')), 0, 0.35, 0), box(1.62, 0.25, 1.12, mat(C.accent), 0, 1.2, 0));
  const flag = box(0.06, 1.6, 0.06, mat(C.accent), -0.6, 1.4, 0);
  bot.add(flag);
  extras.add(bot);
  // Drone (sectors 02, 05, 07)
  const drone = new THREE.Group();
  drone.add(box(1.6, 0.4, 1.6, mat(C.accent), 0, 0, 0));
  for (const [dx, dz] of [[1.3, 1.3], [-1.3, 1.3], [1.3, -1.3], [-1.3, -1.3]]) {
    const arm = box(1.4, 0.12, 0.12, mat(C.accent), dx / 2, 0.15, dz / 2);
    arm.rotation.y = Math.atan2(dz, dx);
    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.06, 16), new THREE.MeshLambertMaterial({ color: C.spirit.clone(), transparent: true, opacity: 0.75 }));
    rotor.position.set(dx, 0.42, dz);
    drone.add(arm, rotor);
  }
  extras.add(drone);
  // Patrol robot on a plaza (sectors 02, 10)
  const patrol = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 2.4, 18), mat(new THREE.Color('#f4f7fb')));
  shell.position.y = 1.2;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(C.accent));
  dome.position.y = 2.4;
  patrol.add(shell, dome);
  extras.add(patrol);
  extras.visible = false;
  scene.add(extras);
  groups.extras = extras;
  anchors.fleetScale = new THREE.Vector3(110, 2, -110);

  // ---- state application ----
  let current: SceneState = { mode: 'day', show: [], highlight: [], frozen: false, signalsOff: false };
  let freezeT = 0;
  let lastT = 0;
  const optional = ['sensors', 'link', 'authority', 'fireScene', 'busScene', 'fleetScale', 'extras'];

  function carPos(lane: Lane, t: number) {
    const span = lane.max - lane.min;
    let s = (lane.offset + t * lane.speed) % span;
    if (s < 0) s += span;
    const v = lane.dir === 1 ? lane.min + s : lane.max - s;
    return lane.axis === 'x' ? { x: v, z: lane.fixed, rot: lane.dir === 1 ? 0 : Math.PI } : { x: lane.fixed, z: v, rot: lane.dir === 1 ? -Math.PI / 2 : Math.PI / 2 };
  }

  // Colors tween towards targets; `step(dt)` advances them. Returns true while animating.
  const targets = new Map<THREE.Color, THREE.Color>();
  const setTarget = (c: THREE.Color, to: THREE.Color) => targets.set(c, to.clone());
  let instant = false;

  function apply(state: SceneState, opts: { instant?: boolean } = {}) {
    instant = !!opts.instant;
    if (state.frozen && !current.frozen) freezeT = lastT;
    current = state;
    for (const g of optional) groups[g].visible = state.show.includes(g);
    const bg = state.mode === 'xray' ? C.xrayBg : state.mode === 'dark' ? C.darkBg : C.bg;
    setTarget(scene.background as THREE.Color, bg);
    for (const m of buildingMats) { m.opacity = state.mode === 'xray' ? 0.1 : 1; m.depthWrite = state.mode !== 'xray'; }
    for (const m of edgeMats) setTarget(m.color, state.mode === 'xray' ? C.spirit : C.edge);
    setTarget(ground.material.color, state.mode === 'xray' ? new THREE.Color('#13285a') : state.mode === 'dark' ? new THREE.Color('#9aa6b8') : C.ground);
    hemi.intensity = state.mode === 'dark' ? 0.75 : 1.6;
    sun.intensity = state.mode === 'dark' ? 0.45 : 1.5;
    for (const l of signalLights) setTarget(l.color, state.signalsOff ? new THREE.Color('#3a4352') : C.spirit);
    for (const car of cars) {
      const hot = state.highlight.includes(car.id) || (car.fleet && state.highlight.includes('fleet'));
      setTarget((car.body.material as THREE.MeshLambertMaterial).color, hot ? C.alert : C.vehicle);
    }
    if (instant) for (const [c, to] of targets) c.copy(to);
    setTime(lastT);
  }

  function tween(dt: number) {
    if (!targets.size) return false;
    const k = 1 - Math.pow(0.001, dt / 0.6);
    let active = false;
    for (const [c, to] of targets) {
      c.lerp(to, k);
      if (Math.abs(c.r - to.r) + Math.abs(c.g - to.g) + Math.abs(c.b - to.b) < 0.004) { c.copy(to); targets.delete(c); } else active = true;
    }
    return active;
  }

  /** Scroll-driven "time": moves the fleet. Frozen states hold positions. */
  function setTime(t: number) {
    lastT = t;
    if (groups.extras.visible) {
      // Delivery robot walks the north sidewalk; drone circles the intersection; patrol robot paces a plaza.
      bot.position.set(-60 + ((t * 3) % 120), 0.1, 9.6);
      drone.position.set(Math.cos(t * 0.35) * 22, 20 + Math.sin(t * 0.9) * 1.2, Math.sin(t * 0.35) * 22);
      patrol.position.set(14 + Math.sin(t * 0.4) * 4, 0, -14);
    }
    const tt = current.frozen ? freezeT : t;
    for (const car of cars) {
      if (!car.lane) continue;
      const p = carPos(car.lane, tt);
      car.group.position.set(p.x, 0, p.z);
      car.group.rotation.y = p.rot;
      // Keep moving cars out of the staged scenes (fire scene, school bus) while those are shown.
      const inFire = groups.fireScene.visible && car.lane.axis === 'x' && car.lane.fixed < 0 && p.x > 34 && p.x < 76;
      const inBus = groups.busScene.visible && car.lane.axis === 'z' && p.z > -52 && p.z < -24;
      car.group.visible = !inFire && !inBus;
    }
  }

  function resize(w: number, h: number) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const render = () => renderer.render(scene, camera);
  const dispose = () => { renderer.dispose(); renderer.forceContextLoss(); };

  return { scene, camera, renderer, anchors, apply, tween, setTime, resize, render, dispose };
}

export type StreetScene = ReturnType<typeof buildScene>;
