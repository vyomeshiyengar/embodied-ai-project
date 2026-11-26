/**
 * Shared MapLibre setup for every map in the app (global map, Share composer, MyEACP).
 * Starts on an offline Natural Earth outline, then upgrades to OpenFreeMap vector tiles
 * (OpenStreetMap data, no key, no account) if they load within 6 seconds.
 */
import { Map as MlMap, NavigationControl, AttributionControl, setWorkerUrl, type StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const TILE_STYLE = 'https://tiles.openfreemap.org/styles/positron';

export const base = () => (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
export const abs = (p: string) => new URL(base() + p, location.href).href;
export const reducedMotion = () => document.documentElement.dataset.motion === 'reduce' || (document.documentElement.dataset.motion !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches);

export interface MapOptions {
  container: HTMLElement;
  center?: [number, number];
  zoom?: number;
  /** Called once the map has a style (first the outline, then again if the tiles load). */
  onStyle?: () => void;
  /** Called if the street tiles could not load. */
  onFallback?: () => void;
  compact?: boolean;
}

export function createMap(o: MapOptions) {
  setWorkerUrl(abs('vendor/maplibre-gl-worker.mjs'));
  const fallbackStyle: StyleSpecification = {
    version: 8,
    sources: { countries: { type: 'geojson', data: abs('vendor/countries-110m.geojson') } },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#cfe3f5' } },
      { id: 'land', type: 'fill', source: 'countries', paint: { 'fill-color': '#f4f7fb' } },
      { id: 'borders', type: 'line', source: 'countries', paint: { 'line-color': '#b7c5d9', 'line-width': 0.6 } },
    ],
  };
  const map = new MlMap({
    container: o.container,
    style: fallbackStyle,
    center: o.center ?? [-40, 30],
    zoom: o.zoom ?? 1.6,
    minZoom: 1,
    maxZoom: 16,
    attributionControl: false,
  });
  map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new AttributionControl({ compact: true, customAttribution: 'Natural Earth' }), 'bottom-right');
  if (o.onStyle) map.on('load', o.onStyle);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  fetch(TILE_STYLE, { signal: ctrl.signal })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((style: StyleSpecification) => {
      clearTimeout(timer);
      for (const l of style.layers) {
        if (l.type === 'background') l.paint = { ...(l.paint || {}), 'background-color': '#eef2f7' };
        if (l.type === 'fill' && /water/.test(l.id)) l.paint = { ...(l.paint || {}), 'fill-color': '#cfe3f5' };
      }
      map.setStyle(style);
      if (o.onStyle) map.once('style.load', o.onStyle);
    })
    .catch(() => { clearTimeout(timer); o.onFallback?.(); });

  return {
    map,
    destroy() { clearTimeout(timer); ctrl.abort(); map.remove(); },
  };
}

/** Distance in km between two points (haversine). */
export function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

export const fmtDate = (d?: string) => {
  if (!d) return '';
  if (/^\d{4}-\d{2}$/.test(d)) { const [y, m] = d.split('-').map(Number); return new Date(y, m - 1, 15).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); }
  const dt = new Date(d.length <= 10 ? d + 'T12:00:00' : d);
  return isNaN(+dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
