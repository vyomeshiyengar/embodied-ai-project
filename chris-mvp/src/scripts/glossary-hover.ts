/**
 * Glossary hovers: the first time a glossary term appears in each section of a page (each tab panel
 * counts as its own section) it becomes a link to the Glossary, and hovering or focusing it shows the definition (shared tooltip, popover.ts).
 * Terms come from /glossary-terms.json (src/lib/glossary.ts). On a sector page, that sector's
 * definition wins when several sectors define the same term.
 */
import { abs } from './map-core';
import { bindTips } from './popover';

interface Entry { term: string; definition: string; sector: string; slug: string; anchor: string; match: string[] }
let terms: Promise<Entry[]> | null = null;
const load = () => (terms ??= fetch(abs('glossary-terms.json')).then((r) => (r.ok ? r.json() : [])).catch(() => []));

// Never inside these: headings, controls, links, code, the 3D views and maps, tooltips themselves.
const SKIP = 'h1,h2,h3,h4,h5,h6,a,button,input,textarea,select,label,summary,code,pre,svg,canvas,script,style,[role="tab"],[data-no-gloss],[data-gmap],[data-stage],.tip,.term';
const MAX = 25; // per section
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isAcronym = (s: string) => (s.match(/[A-Z]/g) || []).length >= 2;

export async function initGlossaryHovers(main: HTMLElement, sectorSlug?: string): Promise<() => void> {
  if (location.pathname.replace(/\/$/, '').endsWith('/glossary')) return () => {};
  const all = await load();
  if (!all.length || !main.isConnected) return () => {};
  // One entry per form; prefer this sector's definition.
  const byForm = new Map<string, Entry>();
  for (const e of [...all].sort((a, b) => Number(b.slug === sectorSlug) - Number(a.slug === sectorSlug))) {
    for (const f of e.match) if (!byForm.has(f.toLowerCase())) byForm.set(f.toLowerCase(), e);
  }
  const forms = [...byForm.keys()].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(?<![\\w-])(${forms.map(esc).join('|')})(?![\\w-])`, 'gi');

  // Each tab panel is its own section, so a term is marked where the reader can actually see it.
  const usedBy = new Map<Element, Set<string>>();
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue && n.nodeValue.trim().length > 2 && !(n.parentElement?.closest(SKIP)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const scope = node.parentElement?.closest('[role="tabpanel"]') ?? main;
    if (!usedBy.has(scope)) usedBy.set(scope, new Set());
    const used = usedBy.get(scope)!;
    if (used.size >= MAX) continue;
    const text = node.nodeValue!;
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    let hit: { i: number; len: number; e: Entry } | null = null;
    while ((m = re.exec(text))) {
      const form = forms.find((f) => f === m![1].toLowerCase());
      const e = form ? byForm.get(form) : undefined;
      if (!e || used.has(e.term.toLowerCase())) continue;
      const original = e.match.find((f) => f.toLowerCase() === form);
      if (original && isAcronym(original) && m[1] !== original) continue; // acronyms match exact case only
      hit = { i: m.index, len: m[1].length, e };
      break;
    }
    if (!hit) continue;
    used.add(hit.e.term.toLowerCase());
    const after = node.splitText(hit.i);
    after.splitText(hit.len);
    const a = document.createElement('a');
    a.className = 'term';
    a.href = abs(`glossary/#${hit.e.anchor}`);
    a.dataset.gterm = hit.e.term;
    a.dataset.gdef = hit.e.definition;
    a.textContent = after.nodeValue;
    after.replaceWith(a);
  }
  return bindTips(main, 'a.term', (el) => ({ title: el.dataset.gterm, body: el.dataset.gdef! }));
}
