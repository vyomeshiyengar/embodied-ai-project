import { useEffect, useState } from 'react';

/** Tabs shown for every department. Add a tab here + a view in App.tsx to extend. */
export const TABS = ['types', 'risks', 'regulation', 'cases'] as const;
export type Tab = (typeof TABS)[number];

export interface Route {
  deptId?: string;
  tab: Tab;
  /** Optional selection inside the tab (type id, regulation id, case study id). */
  focus?: string;
}

/** Tiny hash router: #/<dept>/<tab>/<focus>. Keeps links shareable without a router dependency. */
export function parseHash(hash: string): Route {
  const [deptId, tab, focus] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return {
    deptId: deptId || undefined,
    tab: (TABS as readonly string[]).includes(tab) ? (tab as Tab) : 'types',
    focus: focus || undefined,
  };
}

export function toHash(r: Route): string {
  if (!r.deptId) return '#/';
  return '#/' + [r.deptId, r.tab, r.focus].filter(Boolean).map((s) => encodeURIComponent(s!)).join('/');
}

export function useRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = (r: Route) => {
    const h = toHash(r);
    if (h !== window.location.hash) window.location.hash = h;
    else setRoute(r);
  };
  return [route, navigate];
}
