/**
 * "In the city" page: loads a city twin, places this sector's technologies (illustrative) and the
 * research cases documented inside the neighborhood (real locations, sourced), and wires the pins,
 * filters, side panel, Previous / Next and the city picker.
 */
import type { TwinData } from '../scenes/twin/geometry';
import type { Zone } from '../scenes/twin/placement';
import type { ModelKind } from '../scenes/twin/models';
import { abs, el, reducedMotion } from './map-core';
import { initSaveButtons } from './save-buttons';

interface Payload {
  sector: string;
  cities: { id: string; name: string; area: string; lat: number; lng: number; half: number }[];
  types: { id: string; name: string; zone: Zone; kind: ModelKind }[];
  cases: { id: string; lat: number; lng: number; title: string }[];
}

function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export function mountTwinPage(root: HTMLElement): () => void {
  const data: Payload = JSON.parse(document.querySelector('[data-twin-data]')!.textContent || '{}');
  const q = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const stage = q('[data-stage]');
  let canvas = q<HTMLCanvasElement>('[data-twin-canvas]');
  const pinLayer = q('[data-pins]');
  const status = q('[data-status]');
  const homeBtn = q<HTMLButtonElement>('[data-home]');
  const intro = q('[data-panel-intro]');
  const ucnav = q('[data-ucnav]');
  const list = q('[data-uclist]');
  const params = new URLSearchParams(location.search);
  const has3d = webgl();
  let twin: import('../scenes/twin/twin').Twin | null = null;
  let current = data.cities.find((c) => c.id === params.get('city')) ?? data.cities[0];
  let visible: { id: string; label: string; doc: boolean; zone?: Zone; km?: number; inView?: boolean }[] = [];
  let selected: string | null = null;
  let filter = '';
  let seq = 0;
  let ro: ResizeObserver | null = null;

  const setUrl = () => {
    const u = new URL(location.href);
    u.searchParams.set('city', current.id);
    if (selected) u.searchParams.set('item', selected); else u.searchParams.delete('item');
    u.hash = '';
    history.replaceState(history.state, '', u);
  };

  function casesHere() {
    const kx = 111320 * Math.cos((current.lat * Math.PI) / 180), kz = 110540;
    // Cases anywhere in the city (25 km). Those inside the neighborhood get a marker at their real spot.
    return data.cases
      .map((c) => {
        const x = (c.lng - current.lng) * kx, z = -(c.lat - current.lat) * kz;
        return { ...c, x, z, km: Math.hypot(x, z) / 1000, inView: Math.abs(x) < current.half * 0.95 && Math.abs(z) < current.half * 0.95 };
      })
      .filter((c) => c.km < 25)
      .sort((a, b) => a.km - b.km);
  }

  function renderList() {
    list.replaceChildren(...visible.map((v) => {
      const li = el('li');
      const b = el('button') as HTMLButtonElement;
      b.type = 'button';
      const k = el('span', `k${v.doc ? ' doc' : ''}`);
      k.setAttribute('aria-hidden', 'true');
      b.append(k, el('span', undefined, v.label), el('span', 't', v.doc ? (v.inView ? 'Documented here' : `Documented, ${v.km! < 1 ? '<1' : Math.round(v.km!)} km away`) : 'Illustrative'));
      b.addEventListener('click', () => select(v.id));
      li.append(b);
      return li;
    }));
    q('[data-city-title]').textContent = current.name;
    q('[data-city-sub]').textContent = current.area;
    q('[data-where]').textContent = `${current.name}, ${current.area}`;
  }

  function renderPins() {
    pinLayer.replaceChildren(...visible.filter((v) => !v.doc || v.inView).map((v) => {
      const b = el('button', `pin${v.doc ? ' doc' : ''}`) as HTMLButtonElement;
      b.type = 'button';
      b.dataset.pin = v.id;
      const dot = el('span', 'dot');
      dot.setAttribute('aria-hidden', 'true');
      b.append(dot, el('span', 'lab', v.label));
      b.setAttribute('aria-label', `${v.label}, ${v.doc ? 'documented here' : 'illustrative scene'}`);
      b.addEventListener('click', () => select(v.id));
      return b;
    }));
    applyFilter();
  }

  function applyFilter() {
    const match = (v: (typeof visible)[number]) => !filter || (filter === 'documented' ? v.doc : filter === `zone:${v.zone}`);
    const ids = visible.filter(match).map((v) => v.id);
    pinLayer.querySelectorAll<HTMLElement>('[data-pin]').forEach((p) => {
      const on = ids.includes(p.dataset.pin!);
      p.classList.toggle('dim', !!filter && !on);
      p.classList.toggle('lit', !!filter && on);
    });
    twin?.highlight(filter ? ids : null);
  }

  function select(id: string | null) {
    selected = id;
    root.querySelectorAll<HTMLElement>('[data-uc]').forEach((a) => {
      const on = a.dataset.uc === id;
      if (on && a.hidden) { a.classList.remove('enter'); void a.offsetWidth; a.classList.add('enter'); }
      a.hidden = !on;
    });
    intro.hidden = !!id;
    ucnav.hidden = !id;
    homeBtn.hidden = !id;
    pinLayer.querySelectorAll<HTMLElement>('[data-pin]').forEach((p) => p.classList.toggle('on', p.dataset.pin === id));
    if (id && visible.some((v) => v.id === id && (!v.doc || v.inView))) twin?.focus(id); else twin?.home();
    setUrl();
    if (id) root.querySelector<HTMLElement>(`[data-uc="${CSS.escape(id)}"] h2`)?.focus?.();
  }

  async function load(city = current) {
    const my = ++seq;
    current = city;
    root.querySelectorAll('[data-city]').forEach((b) => b.setAttribute('aria-pressed', String((b as HTMLElement).dataset.city === city.id)));
    const docs = casesHere();
    visible = [
      ...data.types.map((t) => ({ id: t.id, label: t.name, doc: false, zone: t.zone })),
      ...docs.map((c) => ({ id: c.id, label: c.title, doc: true, km: c.km, inView: c.inView })),
    ];
    renderList();
    renderPins();
    if (!has3d) { status.textContent = '3D view needs WebGL. Use the list.'; return; }
    status.hidden = false;
    status.textContent = `Loading ${city.name}`;
    if (twin) {
      // A disposed renderer loses its context for good, so each city gets a fresh canvas.
      twin.dispose(); twin = null;
      const fresh = canvas.cloneNode(false) as HTMLCanvasElement;
      canvas.replaceWith(fresh);
      canvas = fresh;
    }
    const [{ createTwin }, json] = await Promise.all([
      import('../scenes/twin/twin'),
      fetch(abs(`twins/${city.id}.json`)).then((r) => r.json() as Promise<TwinData>),
    ]);
    if (my !== seq) return;
    const lowFx = matchMedia('(pointer: coarse)').matches || params.has('lowfx') || (navigator.hardwareConcurrency || 8) < 4;
    twin = createTwin(canvas, json, [
      ...data.types.map((t) => ({ id: t.id, zone: t.zone, kind: t.kind, motion: (['drone'].includes(t.kind) ? 'fly' : ['control-center', 'network-tower', 'drone-dock', 'robot-arm', 'printer', 'companion', 'uv-robot'].includes(t.kind) ? 'static' : 'drive') as never })),
      ...docs.filter((c) => c.inView).map((c) => ({ id: c.id, at: [c.x, c.z] as [number, number] })),
    ], { lowFx, reduced: reducedMotion() });
    const size = () => twin?.resize(stage.clientWidth, stage.clientHeight);
    size();
    ro?.disconnect();
    ro = new ResizeObserver(size);
    ro.observe(stage);
    const pins = [...pinLayer.querySelectorAll<HTMLElement>('[data-pin]')];
    twin.onFrame(() => {
      for (const p of pins) {
        const s = twin!.project(p.dataset.pin!);
        if (!s || !s.visible) { p.style.visibility = 'hidden'; continue; }
        p.style.visibility = '';
        p.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -100%)`;
      }
    });
    status.hidden = true;
    applyFilter();
    const want = params.get('item') || decodeURIComponent(location.hash.slice(1));
    if (want && visible.some((v) => v.id === want)) select(want);
    (window as unknown as { __twin?: unknown }).__twin = { twin, city: city.id, count: visible.length };
  }

  // City picker
  root.querySelectorAll<HTMLButtonElement>('[data-city]').forEach((b) => b.addEventListener('click', () => {
    const c = data.cities.find((x) => x.id === b.dataset.city);
    if (!c || c.id === current.id) return;
    selected = null;
    select(null);
    load(c);
  }));
  // Filters
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.filter || '';
    root.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    applyFilter();
  }));
  // Previous / Next / Back to city
  const step = (d: number) => {
    const i = visible.findIndex((v) => v.id === selected);
    const n = visible[(i + d + visible.length) % visible.length];
    if (n) select(n.id);
  };
  q('[data-prev]').addEventListener('click', () => step(-1));
  q('[data-next]').addEventListener('click', () => step(1));
  homeBtn.addEventListener('click', () => select(null));
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && selected) select(null); };
  document.addEventListener('keydown', onKey);

  initSaveButtons(root);
  load();

  return () => {
    seq++;
    document.removeEventListener('keydown', onKey);
    ro?.disconnect();
    twin?.dispose();
    twin = null;
  };
}
