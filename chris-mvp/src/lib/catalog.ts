/**
 * A small build-time index of sectors, types and risks for client scripts (Share, MyEACP, map).
 * Only names, ids and links: the full content stays on the playbook pages.
 */
import { sectors } from './content';
import { sectorHref } from './url';

export interface Catalog {
  sectors: {
    id: string; slug: string; name: string; short: string; href: string;
    types: { id: string; name: string; href: string }[];
    risks: { id: string; title: string; category: 'likely' | 'black_swan'; types: string[]; all: boolean; href: string; case?: string | null }[];
  }[];
}

export function catalog(): Catalog {
  return {
    sectors: sectors.map((s) => ({
      id: s.id, slug: s.slug, name: s.name, short: s.short_name, href: sectorHref(s.slug),
      types: s.types.map((t) => ({ id: t.id, name: t.name, href: `${sectorHref(s.slug, 'city')}#${t.id}` })),
      risks: s.risks.map((r) => ({ id: r.id, title: r.title, category: r.category, types: r.type_ids, all: r.all_types, href: `${sectorHref(s.slug, 'risks')}#${r.id}`, case: r.case })),
    })),
  };
}
