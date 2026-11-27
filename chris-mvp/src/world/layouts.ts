/**
 * Builds the 3D world for a sector's Overview from our sourced types, in Vyomesh Iyengar's scene format
 * (src/world/, ported from vyomesh-mvp). Runs at build time, so only the slim world data reaches the page.
 *
 * - Sectors Vyomesh laid out (01, 05, 06, 08, 09) keep his landscape: ground, roads, theme and zones.
 *   Each of our types goes to the zone where his matching machine stands, or a zone of the same kind.
 * - Other sectors use his tile layout, one tile per kind of place our types use.
 */
import type { Sector } from '../lib/content';
import type { ModelKind, TypeItem, Zone, ZoneSetting, Department } from './schema';
// Vyomesh's scene layouts (ground, roads, zones, where his machines stand), without his text.
import mobility from './departments/autonomous-mobility.json';
import logistics from './departments/urban-logistics.json';
import construction from './departments/construction.json';
import parks from './departments/parks.json';
import healthcare from './departments/healthcare.json';

export interface WorldDept { id: string; accent: string; types: Department['types'] }
interface Layout { types: Omit<Department['types'], 'intro' | 'items'> & { items: Pick<TypeItem, 'id' | 'zoneId' | 'model'>[] } }

const VY = { '01': mobility, '05': logistics, '06': construction, '08': parks, '09': healthcare } as unknown as Record<string, Layout>;
const ACCENT = '#0077d8'; // EACP Medium Blue (--c-selected)

/** Our type name to Vyomesh's model (first match wins). Kept readable so sector owners can check it. */
const KIND: [RegExp, ModelKind][] = [
  [/remote operations|operations center|control/i, 'control-desk'],
  [/dock|lockers?|hub/i, 'drone-hub'],
  [/network|platform|low-altitude|5g|tower/i, 'network-tower'],
  [/exoskeleton/i, 'exoskeleton'],
  [/surgical/i, 'surgical-robot'],
  [/telepresence|triage/i, 'telepresence'],
  [/disinfection|\buv\b/i, 'uv-robot'],
  [/companion|social|therapy|monitoring & therapy|rehabilitation|assistive/i, 'companion'],
  [/line-painting/i, 'line-painter'],
  [/sand-sifting|soil|contaminated/i, 'sand-rover'],
  [/mower/i, 'mower'],
  [/drone|uas|uav|aerial|lifesaving|shark|tethered|counter-drone|quadcopter/i, 'drone'],
  [/truck|class 8/i, 'truck'],
  [/shuttle|bus|transit/i, 'shuttle'],
  [/purpose-built|\bpod/i, 'pod'],
  [/robotaxi|self-driving|consumer|\bcars?\b/i, 'robotaxi'],
  [/sensor-equipped|sensor vehicle|street vehicles|municipal vehicles|noise|mobile units|road-maintenance|sensor-driven|sensing/i, 'sensor-pole'],
  [/road-going|delivery vehicle|waste|van\b/i, 'delivery-van'],
  [/hybrid/i, 'hybrid-robot'],
  [/sidewalk|delivery robot|bin bot|roaming trash|ground delivery/i, 'sidewalk-robot'],
  [/humanoid|visitor-service/i, 'humanoid'],
  [/logistics robot|in-building|cart|hospital/i, 'hospital-cart'],
  [/warehouse|sorting|recycling|mobile robots and robot arms/i, 'warehouse-robot'],
  [/dog|quadruped|legged|inspection robots|ai-powered inspection/i, 'quadruped'],
  [/boat|vessel|surface|interceptor|collector|waterway|underwater|\brov\b|auv|swimming/i, 'boat'],
  [/3d printing|printing robots/i, 'printer-gantry'],
  [/arm/i, 'robot-arm'],
  [/patrol|security|eod|bomb|firefighting|rescue|emergency service|crawl|pipe|sewer|climbing|in-pipe|confined|gas|radiation|rail|power-line|façade|fa.ade|high-rise/i, 'patrol-robot'],
  [/clean|sweep|floor/i, 'cleaning-robot'],
  [/construction|site|carrier|autonomous mobile/i, 'site-carrier'],
];
export const kindFor = (name: string): ModelKind => KIND.find(([re]) => re.test(name))?.[1] ?? 'patrol-robot';

/** Which of Vyomesh's zone settings fit each kind of place in our data. */
const FITS: Record<Sector['types'][number]['zone'], ZoneSetting[]> = {
  street: ['street', 'highway', 'transit-corridor', 'residential-street', 'downtown', 'parking', 'construction-site', 'utility'],
  sidewalk: ['sidewalk', 'bikelane', 'plaza', 'trail', 'residential-street'],
  air: ['air'],
  building: ['hospital', 'home', 'care-home', 'warehouse', 'office', 'visitor-center', 'building-frame', 'industrial', 'print-site', 'network'],
  park: ['park', 'field', 'golf', 'forest', 'plaza', 'trail', 'beach'],
  water: ['water', 'beach'],
};

/** Tile settings for sectors without a hand-made landscape. */
const TILE_SETTING: Record<string, Partial<Record<Sector['types'][number]['zone'], ZoneSetting>>> = {
  '02': { building: 'downtown' },
  '03': { building: 'utility', street: 'utility' },
  '04': { building: 'industrial' },
  '07': { building: 'utility' },
  '10': { building: 'office' },
};
const PLACE_NAME: Record<Sector['types'][number]['zone'], string> = {
  street: 'Streets', sidewalk: 'Sidewalks', air: 'Airspace', building: 'Buildings and sites', park: 'Parks', water: 'Water',
};
const DEFAULT_SETTING: Record<Sector['types'][number]['zone'], ZoneSetting> = {
  street: 'street', sidewalk: 'sidewalk', air: 'air', building: 'office', park: 'park', water: 'water',
};

const item = (t: Sector['types'][number], zoneId: string): TypeItem => ({
  id: t.id, name: t.name, zoneId, model: kindFor(t.name), howItOperates: '', examples: '', whatHappened: '',
});

export function worldFor(s: Sector): WorldDept {
  const base = VY[s.id];
  if (base && base.types.layout === 'landscape') {
    const zones = base.types.zones;
    const load = new Map<string, number>(zones.map((z) => [z.id, 0]));
    const pick = (t: Sector['types'][number]): Zone => {
      const kind = kindFor(t.name);
      const fits = (z: Zone) => FITS[t.zone].includes(z.setting) || (t.zone !== 'air' && z.below !== undefined && FITS[t.zone].includes(z.below));
      // 1. where his matching machine stands, 2. a zone of the same kind of place, 3. anywhere; least crowded first.
      const byLoad = (a: Zone, b: Zone) => load.get(a.id)! - load.get(b.id)!;
      const his = base.types.items.filter((it) => it.model === kind).map((it) => zones.find((z) => z.id === it.zoneId)!).filter(Boolean).sort(byLoad);
      const same = zones.filter(fits).sort(byLoad);
      return his[0] ?? same[0] ?? [...zones].sort(byLoad)[0];
    };
    const items = s.types.map((t) => {
      const z = pick(t);
      load.set(z.id, load.get(z.id)! + 1);
      return item(t, z.id);
    });
    return { id: s.slug, accent: ACCENT, types: { ...base.types, intro: '', items } };
  }
  // Tile layout: one tile per kind of place, in a steady order.
  const order: Sector['types'][number]['zone'][] = ['street', 'sidewalk', 'building', 'park', 'water', 'air'];
  const used = order.filter((z) => s.types.some((t) => t.zone === z));
  const zones: Zone[] = used.map((z) => ({ id: `z-${z}`, name: PLACE_NAME[z], setting: TILE_SETTING[s.id]?.[z] ?? DEFAULT_SETTING[z] }));
  return { id: s.slug, accent: ACCENT, types: { intro: '', zones, items: s.types.map((t) => item(t, `z-${t.zone}`)) } };
}
