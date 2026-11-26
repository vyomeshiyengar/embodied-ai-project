/**
 * Every map pin, built at build time from the sector data. Each keeps its sources, as-of date and flags.
 * No invented entries: shared use cases come only from the browser workspace store, at runtime.
 */
import { sectors } from './content';
import { sectorHref } from './url';

export interface MapPoint {
  id: string; sectorId: string; sectorSlug: string; sector: string; sectorShort: string;
  place: string; lat: number; lng: number; what: string; response: string | null;
  tags: string[]; blackSwan: boolean; approx: boolean;
  media?: { url: string; alt: string; credit: string; page: string }; review?: boolean; flag?: string;
  unconfirmed?: string[]; caseTitle?: string; caseFields: { label: string; text: string }[];
  sources: { publisher: string; title: string; url: string; published?: string }[];
  asOf: string; links: { overview: string; risks: string };
}

export function mapPoints(): MapPoint[] {
  return sectors.flatMap((s) => {
    const src = new Map(s.sources.map((x) => [x.id, x]));
    return s.pins.map((p) => {
      const cs = s.case_studies.find((c) => c.pin_id === p.id);
      const ids = [...new Set([...p.sources, ...(cs?.sources ?? [])])];
      return {
        id: `${s.id}-${p.id}`, sectorId: s.id, sectorSlug: s.slug, sector: s.name, sectorShort: s.short_name,
        place: p.place, lat: p.lat, lng: p.lng, what: p.what, response: p.response_type ?? null,
        tags: p.tags, blackSwan: p.tags.some((t) => /black swan/i.test(t)) || cs?.kind === 'black_swan',
        approx: p.approx, flag: p.flag, media: p.media, review: p.tags.includes('global-cases'), unconfirmed: p.unconfirmed,
        caseTitle: cs?.title, caseFields: cs?.fields ?? [],
        sources: ids.map((i) => src.get(i)).filter(Boolean).map((x) => ({ publisher: x!.publisher, title: x!.title, url: x!.url, published: x!.published })),
        asOf: s.as_of, links: { overview: sectorHref(s.slug), risks: sectorHref(s.slug, 'risks') },
      };
    });
  });
}
