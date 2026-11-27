/**
 * Content loader. Reads src/content/sectors/*.yaml at build time, validates it with Zod,
 * and checks every source reference. A schema error or a broken source id fails the build.
 *
 * Strict mode (STRICT_SOURCES=1): items without a source, or with unconfirmed claims,
 * are left out of the site. Default mode shows them with a "Source pending" tag.
 */
import { z } from 'zod';
import YAML from 'yaml';

const level = z.enum(['low', 'medium', 'high']).nullable();
const refs = z.array(z.string()).default([]);
const text = z.string().nullable().optional();

export const Source = z.object({
  id: z.string(),
  publisher: z.string(),
  title: z.string(),
  url: z.string().url(),
  published: z.string().optional(),
});

const Base = z.object({ sources: refs, unconfirmed: z.array(z.string()).optional(), as_of: z.string().optional() });

export const Type = Base.extend({
  id: z.string(),
  name: z.string(),
  zone: z.enum(['street', 'sidewalk', 'air', 'building', 'water', 'park']),
  where: text, how: text, uses: text, running_in: text, city_response: text, progression: text,
});

export const Risk = Base.extend({
  id: z.string(),
  category: z.enum(['likely', 'black_swan']),
  title: z.string(),
  detail: text,
  applies_to: text,
  likelihood: level,
  likelihood_label: text,
  severity: level,
  severity_label: text,
  who_affected: text,
  most_vulnerable: z.array(z.string()).default([]),
  worse_over_time: text,
  case: text,
  /** Technology types this risk applies to (scripts/risk-types.mjs, the team's reading of the doc). */
  type_ids: z.array(z.string()).default([]),
  all_types: z.boolean().default(false),
});

export const Rule = Base.extend({
  id: z.string(),
  name: z.string(),
  area: text,
  level: z.enum(['federal', 'state', 'city', 'international', 'voluntary']),
  level_label: text,
  status: z.enum(['in_force', 'pending', 'proposed', 'vetoed']),
  covers: text,
  falls_short: text,
  /** Found by web research for the team to check (docs/research/global-regulations.md). */
  review: z.literal('pending').optional(),
});

export const CaseStudy = Base.extend({
  id: z.string(),
  title: z.string(),
  place: text,
  kind: z.enum(['case', 'black_swan', 'international']),
  pittsburgh: z.boolean().default(false),
  pin_id: text,
  fields: z.array(z.object({ label: z.string(), text: z.string() })),
});

export const Pin = Base.extend({
  id: z.string(),
  place: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  what: z.string(),
  response_type: text,
  tags: z.array(z.string()).default([]),
  /** Approximate location (city center or regional capital) for places the doc names without coordinates. */
  approx: z.boolean().default(false),
  flag: z.string().optional(),
  /** Openly licensed image only (CC0, CC BY, CC BY-SA), with credit. */
  media: z.object({ kind: z.literal('image'), url: z.string().url(), alt: z.string(), credit: z.string(), page: z.string().url() }).optional(),
});

export const Sector = z.object({
  id: z.string().regex(/^(0[1-9]|10)$/),
  slug: z.string(),
  name: z.string(),
  short_name: z.string(),
  owner: z.string(),
  status: z.enum(['full', 'partial', 'in_progress']),
  as_of: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source_doc: z.object({ path: z.string(), drive_url: z.string().nullable() }),
  liable_to_change: text,
  one_liner: text,
  overview: z.object({ summary: text, points: z.array(z.string()).default([]), why_it_matters: text, core_shift: text }),
  players: z.array(z.object({ type: z.string(), who: z.string() })).default([]),
  terms: z.array(z.object({ term: z.string(), definition: z.string(), sources: refs })).default([]),
  types: z.array(Type),
  risks: z.array(Risk),
  regulations: z.object({ rules: z.array(Rule), gaps: z.array(z.string()).default([]) }),
  case_studies: z.array(CaseStudy),
  pins: z.array(Pin),
  places: z.array(z.object({ place: z.string(), note: z.string(), sources: refs, flag: z.string().optional() })).default([]),
  scenarios: z.array(z.object({ horizon: z.number(), label: z.string(), best: z.string(), worst: z.string(), surprise: z.string(), city_action: text })).default([]),
  war_games: z.array(z.object({ id: z.string(), title: z.string() })).default([]),
  recommendation_candidate: text,
  sources: z.array(Source),
  todos: z.array(z.string()).default([]),
});

export type Sector = z.infer<typeof Sector>;
export type Risk = z.infer<typeof Risk>;
export type Rule = z.infer<typeof Rule>;
export type TypeItem = z.infer<typeof Type>;
export type CaseStudy = z.infer<typeof CaseStudy>;
export type Pin = z.infer<typeof Pin>;
export type SourceT = z.infer<typeof Source>;

export const STRICT = ['1', 'true'].includes(String(import.meta.env.STRICT_SOURCES ?? process.env.STRICT_SOURCES ?? ''));

/** An item is shown if it has a source and no open fact-check flag, or if we're not in strict mode. */
export const showable = (x: { sources?: string[]; unconfirmed?: string[] }) =>
  !STRICT || ((x.sources?.length ?? 0) > 0 && !(x.unconfirmed?.length));

const files = import.meta.glob('../content/sectors/*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function load(): Sector[] {
  const out: Sector[] = [];
  for (const [file, raw] of Object.entries(files)) {
    const parsed = Sector.safeParse(YAML.parse(raw));
    if (!parsed.success) throw new Error(`Invalid sector file ${file}:\n${parsed.error.message}`);
    const s = parsed.data;
    const ids = new Set(s.sources.map((x) => x.id));
    const lists: { sources?: string[] }[] = [...s.types, ...s.risks, ...s.regulations.rules, ...s.case_studies, ...s.pins, ...s.terms, ...s.places];
    for (const item of lists) for (const r of item.sources ?? []) if (!ids.has(r)) throw new Error(`${file}: unknown source id "${r}"`);
    for (const r of s.risks) for (const t of r.type_ids) if (!s.types.some((x) => x.id === t)) throw new Error(`${file}: risk ${r.id} points to missing type ${t}`);
    for (const c of s.case_studies) if (c.pin_id && !s.pins.some((p) => p.id === c.pin_id)) throw new Error(`${file}: case ${c.id} points to missing pin ${c.pin_id}`);
    if (STRICT) {
      s.types = s.types.filter(showable);
      s.risks = s.risks.filter(showable);
      const typeIds = new Set(s.types.map((t) => t.id));
      for (const r of s.risks) r.type_ids = r.type_ids.filter((t) => typeIds.has(t));
      s.regulations.rules = s.regulations.rules.filter(showable);
      s.case_studies = s.case_studies.filter(showable);
      s.pins = s.pins.filter((p) => showable(p) && !p.flag);
      s.places = s.places.filter((p) => p.sources.length && !p.flag);
    }
    out.push(s);
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export const sectors: Sector[] = load();
export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
export const sourceMap = (s: Sector) => new Map(s.sources.map((x) => [x.id, x] as const));

/** Count items with no source (for banners and the content report). */
export function unsourcedCount(s: Sector) {
  return [...s.types, ...s.risks, ...s.regulations.rules, ...s.case_studies, ...s.pins].filter((x) => !x.sources.length).length;
}

export const LEVEL_ORDER = { low: 1, medium: 2, high: 3 } as const;
export const STATUS_LABEL: Record<Sector['status'], string> = {
  full: 'Full research',
  partial: 'Partial research',
  in_progress: 'Research in progress',
};
