import { useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-50m.json';
import statesTopo from 'us-atlas/states-10m.json';
import type { CaseStudy } from '../../data/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countries = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as unknown as GeoJSON.FeatureCollection;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stateLines = mesh(statesTopo as any, (statesTopo as any).objects.states, (a: unknown, b: unknown) => a !== b) as GeoJSON.MultiLineString;

const W = 1000;
const H = 520;

export interface Pin {
  study: CaseStudy;
  number: number;
  label: string;
  lat: number;
  lng: number;
}

export default function WorldMap({ pins, selectedId, onSelect }: { pins: Pin[]; selectedId?: string; onSelect: (id: string) => void }) {
  const { path, project } = useMemo(() => {
    let w = Math.min(...pins.map((p) => p.lng));
    let e = Math.max(...pins.map((p) => p.lng));
    let s = Math.min(...pins.map((p) => p.lat));
    let n = Math.max(...pins.map((p) => p.lat));
    // pad, and keep a minimum span so a single pin isn't zoomed to street level
    const minLng = 24;
    const minLat = 12;
    if (e - w < minLng) { const c = (e + w) / 2; w = c - minLng / 2; e = c + minLng / 2; }
    if (n - s < minLat) { const c = (n + s) / 2; s = c - minLat / 2; n = c + minLat / 2; }
    const padLng = (e - w) * 0.12;
    const padLat = (n - s) * 0.18;
    const box: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPoint',
        coordinates: [
          [w - padLng, Math.max(s - padLat, -75)],
          [e + padLng, Math.min(n + padLat, 78)],
        ],
      },
    };
    const proj = geoMercator().fitExtent([[20, 20], [W - 20, H - 20]], box);
    return { path: geoPath(proj), project: (lng: number, lat: number) => proj([lng, lat]) ?? [0, 0] };
  }, [pins]);

  const sorted = [...pins].sort((a, b) => Number(a.study.id === selectedId) - Number(b.study.id === selectedId));

  return (
    <div className="map-box">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of case study locations">
        <defs>
          <clipPath id="map-clip"><rect width={W} height={H} /></clipPath>
        </defs>
        <g clipPath="url(#map-clip)">
          {countries.features.map((f, i) => (
            <path key={i} className="land" d={path(f) ?? ''} />
          ))}
          <path className="state" d={path(stateLines) ?? ''} />
          {sorted.map((p, i) => {
            const [x, y] = project(p.lng, p.lat);
            const on = p.study.id === selectedId;
            return (
              <g key={i} className={'pin' + (on ? ' on' : '')} transform={`translate(${x},${y})`} onClick={() => onSelect(p.study.id)}>
                <title>{`${p.number}. ${p.study.place} — ${p.label}`}</title>
                {on && <circle className="ring" r={17} />}
                <circle className="b" r={on ? 13 : 11} />
                <text>{p.number}</text>
                {on && (
                  <text className="pin-label" x={18} y={0} style={{ textAnchor: 'start' }}>
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
