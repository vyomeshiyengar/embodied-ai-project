/**
 * Global map runtime. MapLibre GL on OpenFreeMap vector tiles (OpenStreetMap data, no key, no account),
 * with an offline Natural Earth fallback. Pins are HTML buttons (keyboard and screen-reader friendly),
 * clustered with MapLibre's built-in GeoJSON clustering.
 */
import { Marker, LngLatBounds, type GeoJSONSource } from 'maplibre-gl';
import type { MapPoint } from '../lib/map-points';
import { createMap, reducedMotion as reduced, el, fmtDate as fmt } from './map-core';

type Item = { kind: 'research'; p: MapPoint };

export function mountGlobalMap(root: HTMLElement): () => void {
  const points: MapPoint[] = JSON.parse(root.querySelector('[data-points]')!.textContent || '[]');
  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const drawer = q<HTMLElement>('[data-drawer]');
  const drawerBody = q<HTMLElement>('[data-drawer-body]');
  const hover = q<HTMLElement>('[data-hover]');
  const status = q<HTMLElement>('[data-map-status]');
  const countEl = q<HTMLElement>('[data-count]');
  const srList = q<HTMLElement>('[data-sr-list]');

  // ---- filter state (kept in the URL so step 6 can link here pre-filtered) ----
  const params = new URLSearchParams(location.search);
  const embedded = root.hasAttribute('data-embedded');
  const want = root.dataset.sector || params.get('sector') || '';
  const chip = [...root.querySelectorAll<HTMLButtonElement>('[data-sector]')].find((b) => b.dataset.sector === want || (want && b.dataset.slug === want));
  const state = { sector: chip?.dataset.sector || '' };

  let items: Item[] = [];
  const byId = new Map<string, Item>();
  const markers = new Map<string, Marker>();
  let openId: string | null = null;

  const { map, destroy } = createMap({
    container: q<HTMLElement>('[data-map]'),
    onStyle: addData,
    onFallback: () => {
      status.hidden = false;
      status.textContent = 'Street map tiles could not load, so the map shows simple outlines.';
      setTimeout(() => { status.hidden = true; }, 8000);
    },
  });

  function collect() {
    items = [];
    byId.clear();
    for (const p of points) {
      if (state.sector && p.sectorId !== state.sector) continue;
      const it: Item = { kind: 'research', p };
      items.push(it);
      byId.set(p.id, it);
    }
  }
  const geo = () => ({
    type: 'FeatureCollection' as const,
    features: items.map((it) => {
      const [id, lng, lat] = [it.p.id, it.p.lng, it.p.lat];
      return { type: 'Feature' as const, properties: { id }, geometry: { type: 'Point' as const, coordinates: [lng, lat] } };
    }),
  });

  function addData() {
    if (!map.getSource('pts')) {
      map.addSource('pts', { type: 'geojson', data: geo(), cluster: true, clusterRadius: 42, clusterMaxZoom: 9 });
      map.addLayer({ id: 'pts-hit', type: 'circle', source: 'pts', paint: { 'circle-radius': 1, 'circle-opacity': 0 } });
    }
    refresh(true);
  }

  function nameOf(it: Item) { return it.p.place; }

  function syncMarkers() {
    if (!map.getSource('pts')) return;
    const seen = new Set<string>();
    for (const f of map.querySourceFeatures('pts')) {
      const props = f.properties as Record<string, unknown>;
      const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
      const key = props.cluster ? `c-${props.cluster_id}` : String(props.id);
      if (seen.has(key)) continue;
      seen.add(key);
      if (markers.has(key)) continue;
      let node: HTMLButtonElement;
      if (props.cluster) {
        const n = Number(props.point_count);
        node = el('button', 'cluster', String(n));
        node.type = 'button';
        node.setAttribute('aria-label', `${n} places here. Zoom in`);
        node.addEventListener('click', async () => {
          const z = await (map.getSource('pts') as GeoJSONSource).getClusterExpansionZoom(Number(props.cluster_id));
          map.easeTo({ center: coords, zoom: z + 0.5, duration: reduced() ? 0 : 600 });
        });
      } else {
        const it = byId.get(String(props.id));
        if (!it) continue;
        const cls = it.p.blackSwan ? 'swan' : it.p.approx ? 'approx' : 'research';
        node = el('button', `pin ${cls}`);
        node.type = 'button';
        node.setAttribute('aria-label', `${nameOf(it)}, ${it.p.sectorShort}`);
        node.addEventListener('mouseenter', () => showHover(it, node));
        node.addEventListener('focus', () => showHover(it, node));
        node.addEventListener('mouseleave', hideHover);
        node.addEventListener('blur', hideHover);
        node.addEventListener('click', (ev) => { ev.stopPropagation(); open(String(props.id)); });
        if (String(props.id) === openId) node.classList.add('on');
      }
      markers.set(key, new Marker({ element: node }).setLngLat(coords).addTo(map));
    }
    for (const [k, m] of markers) if (!seen.has(k)) { m.remove(); markers.delete(k); }
    spread();
  }

  /** Move markers apart on screen so no two buttons overlap (each keeps a clear tap target).
   *  A marker that would overlap one already placed moves to the nearest free spot on a spiral around it. */
  function spread() {
    const GAP = 4;
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    // Free when the two boxes (plus a small gap) don't intersect.
    const free = (x: number, y: number, w: number, h: number) =>
      placed.every((q) => Math.abs(q.x - x) >= (q.w + w) / 2 + GAP || Math.abs(q.y - y) >= (q.h + h) / 2 + GAP);
    for (const [, m] of [...markers].sort(([a], [b]) => a.localeCompare(b))) {
      const elm = m.getElement();
      const w = elm.offsetWidth, h = elm.offsetHeight;
      const p = map.project(m.getLngLat());
      let x = p.x, y = p.y;
      const step = Math.max(w, h) * 0.5;
      search: for (let ring = 1; !free(x, y, w, h) && ring <= 60; ring++) {
        const steps = 6 * ring;
        for (let k = 0; k < steps; k++) {
          const a = (2 * Math.PI * k) / steps;
          const cx = p.x + Math.cos(a) * ring * step, cy = p.y + Math.sin(a) * ring * step;
          if (free(cx, cy, w, h)) { x = cx; y = cy; break search; }
        }
      }
      placed.push({ x, y, w, h });
      m.setOffset([x - p.x, y - p.y]);
    }
  }

  function refresh(fit = false) {
    collect();
    (map.getSource('pts') as GeoJSONSource | undefined)?.setData(geo());
    for (const m of markers.values()) m.remove();
    markers.clear();
    countEl.textContent = `${items.length} place${items.length === 1 ? '' : 's'}`;
    // Keyboard and screen-reader path: the same places as a list.
    srList.replaceChildren(...items.map((it) => {
      const li = el('li');
      const b = el('button', undefined, nameOf(it));
      b.type = 'button';
      b.addEventListener('click', () => open(it.p.id, true));
      li.append(b);
      return li;
    }));
    if (fit && items.length && state.sector) {
      const bb = new LngLatBounds();
      items.forEach((it) => bb.extend([it.p.lng, it.p.lat]));
      map.fitBounds(bb, { padding: { top: 170, bottom: 60, left: 60, right: 60 }, maxZoom: 6, duration: reduced() ? 0 : 900 });
    } else if (fit && !state.sector) {
      map.easeTo({ center: [-40, 30], zoom: 1.6, duration: reduced() ? 0 : 900 });
    }
    setTimeout(syncMarkers, 50);
  }

  function showHover(it: Item, node: HTMLElement) {
    const r = node.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    hover.replaceChildren();
    hover.append(el('strong', undefined, it.p.place), el('span', 'k', `${it.p.sectorId} ${it.p.sectorShort}${it.p.approx ? ', approximate location' : ''}`), el('p', undefined, it.p.what.length > 130 ? it.p.what.slice(0, 127) + '...' : it.p.what));
    hover.hidden = false;
    const x = Math.min(Math.max(8, r.left - rr.left + r.width / 2 - 136), rr.width - 288);
    const y = r.top - rr.top > 190 ? r.top - rr.top - hover.offsetHeight - 10 : r.bottom - rr.top + 10;
    hover.style.left = `${x}px`;
    hover.style.top = `${y}px`;
  }
  function hideHover() { hover.hidden = true; }

  function dl(rows: [string, string | null | undefined][]) {
    const d = el('dl');
    for (const [k, v] of rows) {
      if (!v) continue;
      const row = el('div');
      row.append(el('dt', undefined, k), el('dd', undefined, v));
      d.append(row);
    }
    return d;
  }

  function open(id: string, focus = false) {
    const it = byId.get(id);
    if (!it) return;
    openId = id;
    root.querySelectorAll('.pin.on').forEach((n) => n.classList.remove('on'));
    const [lng, lat] = [it.p.lng, it.p.lat];
    map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 5.5), duration: reduced() ? 0 : 1100, offset: [window.innerWidth > 760 ? -180 : 0, 0] });
    drawerBody.replaceChildren();
    const h = el('h2', undefined, nameOf(it));
    h.id = 'drawer-h';
    const tags = el('div', 'tags');
    {
      const p = it.p;
      tags.append(el('span', 'tag', `${p.sectorId} ${p.sector}`));
      if (p.blackSwan) tags.append(el('span', 'tag swan', 'Black swan'));
      if (p.approx) tags.append(el('span', 'tag', 'Approximate location'));
      if (!p.sources.length) tags.append(el('span', 'tag warn', 'Source pending'));
      if (p.unconfirmed?.length) tags.append(el('span', 'tag warn', 'Fact-check pending'));
      if (p.flag) tags.append(el('span', 'tag warn', p.flag));
      if (p.review) tags.append(el('span', 'tag', 'Pending team review'));
      drawerBody.append(h, tags);
      if (p.media) {
        const fig = el('figure', 'pmedia');
        const img = el('img') as HTMLImageElement;
        img.src = p.media.url; img.alt = p.media.alt; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => fig.remove());
        const cap = el('figcaption');
        const a = el('a', undefined, p.media.credit) as HTMLAnchorElement;
        a.href = p.media.page; a.target = '_blank'; a.rel = 'noopener';
        cap.append(a);
        fig.append(img, cap);
        drawerBody.append(fig);
      }
      if (p.caseTitle) drawerBody.append(el('p', 'small', `Case study: ${p.caseTitle}`));
      drawerBody.append(dl([['In short', p.what], ['Response', p.response], ...p.caseFields.map((f) => [f.label, f.text] as [string, string])]));
      const src = el('div', 'src', p.sources.length ? 'Sources' : '');
      for (const s of p.sources) {
        const a = el('a', undefined, `${s.publisher}${s.published ? `, ${fmt(s.published)}` : ''}`) as HTMLAnchorElement;
        a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
        src.append(a);
      }
      src.append(el('p', undefined, `As of ${fmt(p.asOf)}`));
      drawerBody.append(src);
      const go = el('div', 'go');
      const a1 = el('a', 'btn', 'Open this sector') as HTMLAnchorElement; a1.href = p.links.overview;
      const a2 = el('a', 'btn secondary', 'Its risks') as HTMLAnchorElement; a2.href = p.links.risks;
      go.append(a1, a2);
      drawerBody.append(go);
    }
    drawer.hidden = false;
    markers.get(id)?.getElement().classList.add('on');
    if (focus) drawer.focus();
    hideHover();
  }
  function closeDrawer() {
    drawer.hidden = true;
    openId = null;
    root.querySelectorAll('.pin.on').forEach((n) => n.classList.remove('on'));
  }

  // ---- filters ----
  root.querySelectorAll<HTMLButtonElement>('[data-sector]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.sector === state.sector));
    b.addEventListener('click', () => {
      state.sector = b.dataset.sector || '';
      root.querySelectorAll('[data-sector]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (!embedded) {
        const u = new URL(location.href);
        if (state.sector) u.searchParams.set('sector', state.sector); else u.searchParams.delete('sector');
        history.replaceState(history.state, '', u);
      }
      closeDrawer();
      refresh(true);
    });
  });
  q<HTMLButtonElement>('[data-drawer-close]').addEventListener('click', closeDrawer);
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); };
  document.addEventListener('keydown', onKey);

  map.on('moveend', syncMarkers);
  map.on('sourcedata', (e) => { if (e.sourceId === 'pts' && e.isSourceLoaded) syncMarkers(); });
  // Deep link: ?place=<research pin id>
  const deep = params.get('place');
  if (deep) map.once('idle', () => setTimeout(() => open(deep), 200));
  (window as unknown as { __gmap?: unknown }).__gmap = { map, open, get count() { return items.length; } };

  return () => {
    document.removeEventListener('keydown', onKey);
    destroy();
  };
}
