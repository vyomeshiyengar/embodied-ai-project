/**
 * The 3D world on a sector's Overview (React island). The page's type cards and this world stay in step
 * through two window events: `eacp-world-select` (page to world) and `eacp-world-picked` (world to page).
 */
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import type { WorldDept } from './layouts';
import './world.css';

const CityWorld = lazy(() => import('./CityWorld'));

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="world-hint static">The 3D view needs WebGL. The cards above still work.</p> : this.props.children; }
}

export default function WorldIsland({ dept, initial }: { dept: WorldDept; initial?: string }) {
  const [sel, setSel] = useState<string | undefined>(initial);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    const on = (e: Event) => setSel((e as CustomEvent<string | null>).detail ?? undefined);
    window.addEventListener('eacp-world-select', on);
    (window as unknown as { __world?: unknown }).__world = { ready: true };
    window.dispatchEvent(new Event('eacp-world-ready'));
    return () => window.removeEventListener('eacp-world-select', on);
  }, []);
  const choose = (id?: string) => {
    setSel(id);
    window.dispatchEvent(new CustomEvent('eacp-world-picked', { detail: id ?? null }));
  };
  return (
    <div className="world-wrap" data-world data-selected={sel ?? ''}>
      <Boundary>
        <Suspense fallback={<p className="world-hint static">Loading the 3D world</p>}>
          <CityWorld dept={dept} selectedId={sel} onSelect={choose} resetKey={resetKey} />
        </Suspense>
      </Boundary>
      <button type="button" className="world-reset" onClick={() => { choose(undefined); setResetKey((k) => k + 1); }}>Reset view</button>
      <p className="world-hint" aria-hidden="true">Drag to orbit, scroll to zoom</p>
    </div>
  );
}
