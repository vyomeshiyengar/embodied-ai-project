import { lazy, Suspense, useState } from 'react';
import type { Department } from '../../data/schema';

const CityWorld = lazy(() => import('../world/CityWorld'));

export default function TypesView({ dept, focus, onFocus }: { dept: Department; focus?: string; onFocus: (id?: string) => void }) {
  const [resetKey, setResetKey] = useState(0);
  const items = dept.types.items;
  const idx = items.findIndex((i) => i.id === focus);
  const item = idx >= 0 ? items[idx] : undefined;
  const zoneName = (id: string) => dept.types.zones.find((z) => z.id === id)?.name ?? '';
  const go = (d: number) => onFocus(items[(idx + d + items.length) % items.length].id);

  return (
    <section>
      <p className="label"><span className="num">1</span>Types: see it in action</p>
      <p className="view-intro">{dept.types.intro}</p>

      <div className="types-layout">
        <div className="world-wrap">
          <Suspense fallback={<div className="world-hint">Loading 3D world…</div>}>
            <CityWorld dept={dept} selectedId={focus} onSelect={onFocus} resetKey={resetKey} />
          </Suspense>
          <button
            className="world-reset"
            onClick={() => {
              onFocus(undefined);
              setResetKey((k) => k + 1);
            }}
          >
            Reset view
          </button>
          <div className="world-hint">Click a robot to learn about it · drag to orbit · scroll to zoom</div>
        </div>

        <aside className="panel detail" aria-live="polite">
          {item ? (
            <>
              <span className="zone">{zoneName(item.zoneId)}</span>
              <h3>{item.name}</h3>
              <div>
                <h4>How it operates in the city</h4>
                <p>{item.howItOperates}</p>
              </div>
              <div>
                <h4>Examples</h4>
                <p>{item.examples}</p>
              </div>
              <div className="happened">
                <h4>What happened when adopted</h4>
                <p>{item.whatHappened}</p>
              </div>
              <div className="nav">
                <button className="btn" onClick={() => go(-1)}>← Previous</button>
                <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--muted)' }}>
                  {idx + 1} / {items.length}
                </span>
                <button className="btn primary" onClick={() => go(1)}>Next →</button>
              </div>
            </>
          ) : (
            <>
              <span className="zone">{items.length} types · {dept.types.zones.length} zones</span>
              <h3>Explore the city</h3>
              <p>
                Each tile is a part of the city where this technology operates. Click any robot, drone or vehicle to see how it
                works, where it's deployed and what happened when cities adopted it.
              </p>
              <div className="nav">
                <span />
                <button className="btn primary" onClick={() => onFocus(items[0].id)}>Start the tour →</button>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="type-chips">
        {items.map((it, i) => (
          <button key={it.id} className={'type-chip' + (it.id === focus ? ' active' : '')} onClick={() => onFocus(it.id)}>
            <span className="dot">{i + 1}</span>
            <span>
              <span className="nm">{it.name}</span>
              <span className="zn">{zoneName(it.zoneId)}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
