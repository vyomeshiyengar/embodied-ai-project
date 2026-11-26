/**
 * Global map runtime. MapLibre GL on OpenFreeMap vector tiles (OpenStreetMap data, no key, no account),
 * with an offline Natural Earth fallback. Pins are HTML buttons (keyboard and screen-reader friendly),
 * clustered with MapLibre's built-in GeoJSON clustering.
 */
import { Marker, LngLatBounds, type GeoJSONSource } from 'maplibre-gl';
import type { MapPoint } from '../lib/map-points';
import type { Catalog } from '../lib/catalog';
import { ws, CHANGE_EVENT, POST_KINDS, type Post } from '../lib/workspace-store';
import { getSession, requestSignIn } from '../lib/demo-auth';
import { createMap, reducedMotion as reduced, el, fmtDate as fmt, base } from './map-core';
import { renderPost, addedBy } from './post-card';

type Item = { kind: 'research'; p: MapPoint } | { kind: 'shared'; e: Post };

export function mountGlobalMap(root: HTMLElement): () => void {
  const points: MapPoint[] = JSON.parse(root.querySelector('[data-points]')!.textContent || '[]');
  const sectorNames = new Map(points.map((p) => [p.sectorId, p.sector]));
  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const drawer = q<HTMLElement>('[data-drawer]');
  const drawerBody = q<HTMLElement>('[data-drawer-body]');
  const hover = q<HTMLElement>('[data-hover]');
  const catalog: Catalog = JSON.parse(root.querySelector('[data-catalog]')!.textContent || '{"sectors":[]}');
  const status = q<HTMLElement>('[data-map-status]');
  const countEl = q<HTMLElement>('[data-count]');
  const srList = q<HTMLElement>('[data-sr-list]');

  // ---- filter state (kept in the URL so step 6 can link here pre-filtered) ----
  const params = new URLSearchParams(location.search);
  const want = params.get('sector') || '';
  const chip = [...root.querySelectorAll<HTMLButtonElement>('[data-sector]')].find((b) => b.dataset.sector === want || (want && b.dataset.slug === want));
  const state = { sector: chip?.dataset.sector || '', shared: true };

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
    if (state.shared) {
      for (const e of ws.posts()) {
        if (state.sector && e.sectorId !== state.sector) continue;
        const it: Item = { kind: 'shared', e };
        items.push(it);
        byId.set(e.id, it);
      }
    }
  }
  const geo = () => ({
    type: 'FeatureCollection' as const,
    features: items.map((it) => {
      const [id, lng, lat] = it.kind === 'research' ? [it.p.id, it.p.lng, it.p.lat] : [it.e.id, it.e.lng, it.e.lat];
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

  function nameOf(it: Item) { return it.kind === 'research' ? it.p.place : it.e.place; }

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
        const cls = it.kind === 'shared' ? 'shared' : it.p.blackSwan ? 'swan' : it.p.approx ? 'approx' : 'research';
        node = el('button', `pin ${cls}`);
        node.type = 'button';
        const sec = it.kind === 'research' ? it.p.sectorShort : sectorNames.get(it.e.sectorId) || '';
        node.setAttribute('aria-label', `${nameOf(it)}, ${sec}${it.kind === 'shared' ? ', shared by a city, unverified' : ''}`);
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
      const b = el('button', undefined, `${nameOf(it)}${it.kind === 'shared' ? ' (shared, unverified)' : ''}`);
      b.type = 'button';
      b.addEventListener('click', () => open(it.kind === 'research' ? it.p.id : it.e.id, true));
      li.append(b);
      return li;
    }));
    if (fit && items.length && state.sector) {
      const bb = new LngLatBounds();
      items.forEach((it) => bb.extend(it.kind === 'research' ? [it.p.lng, it.p.lat] : [it.e.lng, it.e.lat]));
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
    if (it.kind === 'research') {
      hover.append(el('strong', undefined, it.p.place), el('span', 'k', `${it.p.sectorId} ${it.p.sectorShort}${it.p.approx ? ', approximate location' : ''}`), el('p', undefined, it.p.what.length > 130 ? it.p.what.slice(0, 127) + '...' : it.p.what));
    } else {
      hover.append(el('strong', undefined, it.e.place), el('span', 'k', `${addedBy(it.e.by)}. ${POST_KINDS[it.e.kind].label}. Unverified`), el('p', undefined, it.e.text.length > 130 ? it.e.text.slice(0, 127) + '...' : it.e.text));
    }
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
    const [lng, lat] = it.kind === 'research' ? [it.p.lng, it.p.lat] : [it.e.lng, it.e.lat];
    map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 5.5), duration: reduced() ? 0 : 1100, offset: [window.innerWidth > 760 ? -180 : 0, 0] });
    drawerBody.replaceChildren();
    const h = el('h2', undefined, nameOf(it));
    h.id = 'drawer-h';
    const tags = el('div', 'tags');
    if (it.kind === 'research') {
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
      drawerBody.append(go, saveButton(p));
    } else {
      drawerBody.append(renderPost(it.e, { catalog, compact: true, onMap: true, onChange: () => { refresh(); if (ws.post(id)) open(id); else closeDrawer(); }, announce: (m) => { status.hidden = false; status.textContent = m; setTimeout(() => { status.hidden = true; }, 5000); } }));
      drawerBody.querySelector('h3')!.id = 'drawer-h';
      const more = el('a', 'btn secondary', 'Open in Share') as HTMLAnchorElement;
      more.href = `${base()}share/?post=${encodeURIComponent(it.e.id)}`;
      more.style.marginTop = '0.75rem';
      drawerBody.append(more);
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

  // Save a research place to MyEACP (sign-in required, browser only)
  function saveButton(p: MapPoint) {
    const key = `place:${p.id}`;
    const b = el('button', 'save') as HTMLButtonElement;
    b.type = 'button';
    const sync = () => { const on = ws.isSaved(key); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Saved to MyEACP' : 'Save to MyEACP'; };
    b.addEventListener('click', () => {
      if (!getSession()) { requestSignIn(); return; }
      ws.toggleSaved({ key, kind: 'place', title: p.caseTitle || p.place, href: `${base()}map/?place=${encodeURIComponent(p.id)}`, sectorId: p.sectorId });
      sync();
    });
    sync();
    return b;
  }
  const shareLink = q<HTMLAnchorElement>('[data-share-link]');
  const syncShareLink = () => { shareLink.href = `${base()}share/${state.sector ? `?sector=${state.sector}` : ''}`; };
  syncShareLink();
  const onData = () => refresh();

  // ---- filters ----
  root.querySelectorAll<HTMLButtonElement>('[data-sector]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.sector === state.sector));
    b.addEventListener('click', () => {
      state.sector = b.dataset.sector || '';
      root.querySelectorAll('[data-sector]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const u = new URL(location.href);
      if (state.sector) u.searchParams.set('sector', state.sector); else u.searchParams.delete('sector');
      history.replaceState(history.state, '', u);
      syncShareLink();
      closeDrawer();
      refresh(true);
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.toggle as 'shared';
    state[k] = !state[k];
    b.setAttribute('aria-pressed', String(state[k]));
    closeDrawer();
    refresh();
  }));
  q<HTMLButtonElement>('[data-drawer-close]').addEventListener('click', closeDrawer);
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); };
  document.addEventListener('keydown', onKey);

  map.on('moveend', syncMarkers);
  map.on('sourcedata', (e) => { if (e.sourceId === 'pts' && e.isSourceLoaded) syncMarkers(); });
  window.addEventListener(CHANGE_EVENT, onData);
  window.addEventListener('eacp-auth-change', onData);
  // Deep links: ?post=<shared post id> or ?place=<research pin id>
  const deep = params.get('post') || params.get('place');
  if (deep) map.once('idle', () => setTimeout(() => open(deep), 200));
  (window as unknown as { __gmap?: unknown }).__gmap = { map, open, get count() { return items.length; } };

  return () => {
    document.removeEventListener('keydown', onKey);
    window.removeEventListener(CHANGE_EVENT, onData);
    window.removeEventListener('eacp-auth-change', onData);
    destroy();
  };
}
