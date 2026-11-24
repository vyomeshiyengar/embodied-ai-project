import { useEffect, useMemo, useState } from 'react';
import type { Department } from '../../data/schema';
import type { Tab } from '../../router';
import { REGIONS, regionOf } from '../../data/regions';
import WorldMap, { type Pin } from './WorldMap';

export default function CaseStudiesView({
  dept,
  focus,
  onFocus,
  onOpen,
}: {
  dept: Department;
  focus?: string;
  onFocus: (id: string) => void;
  onOpen: (tab: Tab, id: string) => void;
}) {
  const places = dept.caseStudies.places;
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const allPins: Pin[] = useMemo(
    () => places.flatMap((s, i) => s.locations.map((l) => ({ study: s, number: i + 1, label: l.label, lat: l.lat, lng: l.lng }))),
    [places],
  );
  // Open on the region with the most pins (usually North America); "All" shows the world.
  const [region, setRegion] = useState<string>(() => {
    const counts = new Map<string, number>();
    allPins.forEach((p) => counts.set(regionOf(p.lat, p.lng), (counts.get(regionOf(p.lat, p.lng)) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'all';
  });
  // If a focused study is outside the current region, switch to a region that shows it.
  useEffect(() => {
    const s = places.find((p) => p.id === focus);
    if (!s || region === 'all') return;
    if (!s.locations.some((l) => regionOf(l.lat, l.lng) === region)) setRegion(regionOf(s.locations[0].lat, s.locations[0].lng));
  }, [focus]); // eslint-disable-line react-hooks/exhaustive-deps
  const regionsPresent = REGIONS.filter((r) => allPins.some((p) => regionOf(p.lat, p.lng) === r.id));
  const pins = region === 'all' ? allPins : allPins.filter((p) => regionOf(p.lat, p.lng) === region);
  const studiesInView = places.filter((s) => pins.some((p) => p.study.id === s.id));
  const selected = places.find((p) => p.id === focus);

  const typeName = (id: string) => dept.types.items.find((t) => t.id === id)?.name ?? id;
  const lawName = (id: string) => dept.regulation.laws.find((l) => l.id === id)?.name.split(' (')[0] ?? id;

  return (
    <section>
      <p className="label"><span className="num">4</span>What is being done</p>
      <p className="view-intro">{dept.caseStudies.intro}</p>

      <div className="cs-frame">
        <div className="cs-head">
          <h3>Case studies: {dept.name.toLowerCase()}</h3>
          <div className="seg">
            <button className={mode === 'map' ? 'on' : ''} onClick={() => setMode('map')}>Map</button>
            <button className={mode === 'list' ? 'on' : ''} onClick={() => setMode('list')}>List</button>
          </div>
        </div>

        {mode === 'map' ? (
          <>
            <div className="region-chips">
              <button className={'region-chip' + (region === 'all' ? ' on' : '')} onClick={() => setRegion('all')}>All</button>
              {regionsPresent.map((r) => (
                <button key={r.id} className={'region-chip' + (region === r.id ? ' on' : '')} onClick={() => setRegion(r.id)}>
                  {r.name}
                </button>
              ))}
            </div>
            <WorldMap pins={pins} selectedId={focus} onSelect={onFocus} />
            <div className="cs-grid">
              {studiesInView.map((s) => {
                const n = places.indexOf(s) + 1;
                return (
                  <button key={s.id} className={'cs-card' + (s.id === focus ? ' on' : '')} onClick={() => onFocus(s.id)}>
                    <span className="dot">{n}</span>
                    <span>
                      <span className="p">{s.place}</span>
                      <span className="r">{s.response}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="table-wrap cs-list">
            <table className="data">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Place</th>
                  <th>Response</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {places.map((s, i) => (
                  <tr key={s.id} className={'row' + (s.id === focus ? ' highlight' : '')} onClick={() => onFocus(s.id)}>
                    <td>{i + 1}</td>
                    <td className="name">{s.place}</td>
                    <td>{s.response}</td>
                    <td className="case">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="cs-detail">
            <span className="resp">{selected.response}</span>
            <h4>{selected.place}</h4>
            <p>{selected.note}</p>
            {!!(selected.relatedTypeIds?.length || selected.relatedRegulationIds?.length) && (
              <div>
                {selected.relatedTypeIds?.map((id) => (
                  <button key={id} className="link-chip t" onClick={() => onOpen('types', id)}>Type: {typeName(id)}</button>
                ))}
                {selected.relatedRegulationIds?.map((id) => (
                  <button key={id} className="link-chip r" onClick={() => onOpen('regulation', id)}>Regulation: {lawName(id)}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
