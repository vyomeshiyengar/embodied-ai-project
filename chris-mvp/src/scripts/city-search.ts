/**
 * World city search over the bundled GeoNames list (public/vendor/cities.json, 15,000+ people).
 * Works offline; the list loads the first time someone types. ARIA combobox with a listbox popup.
 * Markup: <input data-city-input role="combobox" aria-controls=LIST aria-expanded=false aria-autocomplete=list>
 *         <ul data-city-list role="listbox" id=LIST hidden>
 */
import { abs } from './map-core';
import type { CityRef } from '../lib/workspace-store';

type Row = [string, string, string, number, number, number];
let rows: Row[] | null = null;
let keys: string[] = [];
let loading: Promise<void> | null = null;

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
export const countryName = (cc?: string) => { if (!cc) return ''; try { return regionNames?.of(cc) || cc; } catch { return cc; } };
export const cityLabel = (c: Pick<CityRef, 'name' | 'country' | 'region'>) => [c.name, c.region, c.country === 'US' && c.region ? '' : countryName(c.country)].filter(Boolean).join(', ');

export function loadCities() {
  if (!loading) {
    loading = fetch(abs('vendor/cities.json'))
      .then((r) => r.json())
      .then((d: Row[]) => { rows = d; keys = d.map((r) => norm(r[0])); })
      .catch(() => { loading = null; });
  }
  return loading;
}

export async function searchCities(q: string, limit = 8): Promise<CityRef[]> {
  await loadCities();
  if (!rows) return [];
  // "Paris, US" or "Portland OR": the part after a comma narrows by country or US state.
  const [namePart, extra = ''] = q.split(',');
  const n = norm(namePart), x = norm(extra);
  if (n.length < 2) return [];
  const out: { r: Row; score: number }[] = [];
  for (let i = 0; i < rows.length; i++) {
    const k = keys[i];
    const starts = k.startsWith(n);
    if (!starts && !(n.length > 3 && k.includes(n))) continue;
    const r = rows[i];
    if (x && !(norm(r[1]) === x || norm(r[2]) === x || norm(countryName(r[1])).startsWith(x))) continue;
    out.push({ r, score: (k === n ? 3 : starts ? 2 : 1) * 1e9 + r[5] });
    if (out.length > 400) break;
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit).map(({ r }) => ({ name: r[0], country: r[1], region: r[2] || undefined, lat: r[3], lng: r[4] }));
}

/** Wire a combobox. Returns a cleanup function. */
export function mountCitySearch(input: HTMLInputElement, list: HTMLUListElement, onPick: (c: CityRef) => void) {
  let results: CityRef[] = [];
  let active = -1;
  let seq = 0;
  const status = list.parentElement?.querySelector<HTMLElement>('[data-city-status]');

  const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
  const render = () => {
    list.replaceChildren(...results.map((c, i) => {
      const li = document.createElement('li');
      li.id = `${list.id}-o${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      li.textContent = cityLabel(c);
      li.addEventListener('mousedown', (e) => { e.preventDefault(); pick(i); });
      return li;
    }));
    list.hidden = !results.length;
    input.setAttribute('aria-expanded', String(!!results.length));
    if (active > -1) input.setAttribute('aria-activedescendant', `${list.id}-o${active}`); else input.removeAttribute('aria-activedescendant');
    if (status) status.textContent = input.value.trim().length < 2 ? '' : results.length ? `${results.length} places found. Use the arrow keys to choose.` : 'No city of 15,000 or more people by that name. You can drop a pin on the map instead.';
  };
  const pick = (i: number) => {
    const c = results[i];
    if (!c) return;
    input.value = cityLabel(c);
    close();
    onPick(c);
  };
  const onInput = async () => {
    const my = ++seq;
    const r = await searchCities(input.value);
    if (my !== seq) return;
    results = r;
    active = -1;
    render();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && results.length) { e.preventDefault(); active = (active + 1) % results.length; render(); }
    else if (e.key === 'ArrowUp' && results.length) { e.preventDefault(); active = (active - 1 + results.length) % results.length; render(); }
    else if (e.key === 'Enter' && !list.hidden) { e.preventDefault(); pick(active > -1 ? active : 0); }
    else if (e.key === 'Escape' && !list.hidden) { e.preventDefault(); e.stopPropagation(); close(); }
  };
  const onFocus = () => { loadCities(); };
  const onBlur = () => setTimeout(close, 120);
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKey);
  input.addEventListener('focus', onFocus);
  input.addEventListener('blur', onBlur);
  return () => {
    input.removeEventListener('input', onInput);
    input.removeEventListener('keydown', onKey);
    input.removeEventListener('focus', onFocus);
    input.removeEventListener('blur', onBlur);
  };
}

/** The nearest listed city to a point, if one is within maxKm. */
export async function nearestCity(lat: number, lng: number, maxKm = 60): Promise<(CityRef & { km: number }) | null> {
  await loadCities();
  if (!rows) return null;
  let best: Row | null = null, bestD = Infinity;
  const c = Math.cos((lat * Math.PI) / 180);
  for (const r of rows) {
    const dy = r[3] - lat, dx = (r[4] - lng) * c;
    const d = dy * dy + dx * dx;
    if (d < bestD) { bestD = d; best = r; }
  }
  if (!best) return null;
  const km = Math.sqrt(bestD) * 111.2;
  return km <= maxKm ? { name: best[0], country: best[1], region: best[2] || undefined, lat: best[3], lng: best[4], km } : null;
}
