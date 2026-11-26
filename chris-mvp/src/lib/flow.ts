/** The guided order of a sector's pages: Overview, In the city (3D twin), Risks, Regulations, On the map. */
import type { Sector } from './content';
import { href, sectorHref } from './url';

export type StepKey = 'overview' | 'city' | 'risks' | 'regulations' | 'map';
export interface Step { key: StepKey; label: string; href: string }

export function stepsFor(s: Pick<Sector, 'slug' | 'id'>): Step[] {
  return [
    { key: 'overview', label: 'Overview', href: sectorHref(s.slug) },
    { key: 'city', label: 'In the city', href: sectorHref(s.slug, 'city') },
    { key: 'risks', label: 'Risks', href: sectorHref(s.slug, 'risks') },
    { key: 'regulations', label: 'Regulations', href: sectorHref(s.slug, 'regulations') },
    { key: 'map', label: 'On the map', href: href(`/map/?sector=${s.id}`) },
  ];
}
