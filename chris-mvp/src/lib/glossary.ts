/**
 * Glossary terms from every sector's research (sector YAML `terms`), prepared for hover definitions
 * across the site (src/scripts/glossary-hover.ts). Each term gets the words to look for in page text:
 * "VLOS / BVLOS" matches VLOS and BVLOS, "ODD (operational design domain)" matches both forms.
 */
import { sectors } from './content';

export interface GlossaryEntry { term: string; definition: string; sector: string; slug: string; anchor: string; match: string[] }

export const termAnchor = (sectorId: string, term: string) =>
  `g${sectorId}-${term.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

// Words too common or too vague to underline wherever they appear.
const SKIP = new Set(['sensors', 'perception', 'recall', 'recall (software)', 'waiver', 'interceptor', 'swarm', 'drone', 'rover', 'crawler',
  'quadruped', 'humanoid', 'calibration', 'teleoperation', 'autonomy level', 'dual use', 'incidental data', 'critical infrastructure', 'telemetry',
  'computer vision', 'anomaly detection', 'citizen science', 'low-cost sensor', 'preemption', 'uas', 'uav']);

function forms(term: string): string[] {
  const out = new Set<string>();
  const paren = /\(([^)]*)\)/.exec(term)?.[1];
  const base = term.replace(/\(.*?\)/g, '').trim();
  for (const part of base.split(/\s*\/\s*/)) if (part) out.add(part.trim());
  if (paren && !/^e\.g\./i.test(paren)) for (const part of paren.split(/\s*\/\s*/)) out.add(part.trim());
  return [...out].filter((f) => f.length >= 3 && !SKIP.has(f.toLowerCase()) && !/\bvs\.?\b/i.test(f));
}

export function glossaryEntries(): GlossaryEntry[] {
  return sectors.flatMap((s) => s.terms.map((t) => ({ term: t.term, definition: t.definition, sector: s.id, slug: s.slug, anchor: termAnchor(s.id, t.term), match: forms(t.term) })))
    .filter((e) => e.match.length && e.definition);
}
