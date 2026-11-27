/** The guided order of a sector's pages: Overview (with the 3D world), Risks, Regulations, On the map. */
import type { Sector } from './content';
import { sectorHref } from './url';

export type StepKey = 'overview' | 'risks' | 'regulations' | 'map';
export interface Step { key: StepKey; label: string; href: string }

export function stepsFor(s: Pick<Sector, 'slug' | 'id'>): Step[] {
  return [
    { key: 'overview', label: 'Overview', href: sectorHref(s.slug) },
    { key: 'risks', label: 'Risks', href: sectorHref(s.slug, 'risks') },
    { key: 'regulations', label: 'Regulations', href: sectorHref(s.slug, 'regulations') },
    { key: 'map', label: 'On the map', href: sectorHref(s.slug, 'map') },
  ];
}
