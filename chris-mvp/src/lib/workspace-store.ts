/**
 * MyEACP workspace: everything a signed-in demo user creates, kept in THIS browser only.
 * Profile, shared posts (and replies), "seen this too" marks, saved items, the city's own list
 * of technologies and fleet contacts. No server, no accounts, no personal data.
 *
 * One store with one interface so a real backend can replace it after handoff (a GovEx decision).
 * Nothing here is ever seeded: a new browser starts empty.
 */
import { sanitizeMedia, type Media } from './media';

export const POST_KINDS = {
  worked: { label: 'What worked', short: 'Worked' },
  wrong: { label: 'What went wrong', short: 'Went wrong' },
  near_miss: { label: 'A near miss', short: 'Near miss' },
  rule_change: { label: 'A rule or permit change', short: 'Rule change' },
  question: { label: 'A question for other cities', short: 'Question' },
  tip: { label: 'A tip or contract clause', short: 'Tip' },
} as const;
export type PostKind = keyof typeof POST_KINDS;

export const OUTCOMES = [
  'Changed a permit or ordinance',
  'Trained responders',
  'Paused a pilot',
  'Added a data-sharing rule',
  'Set up a fleet contact line',
  'Changed a contract',
  'Held a public meeting',
  'Nothing changed yet',
] as const;

export const ROLES = {
  cio: 'CIO or IT',
  mobility: 'Mobility or transportation',
  police: 'Police',
  fire: 'Fire or EMS',
  public_works: 'Public works',
  emergency: 'Emergency management',
  state: 'State policy',
  other: 'Other',
} as const;
export type RoleKey = keyof typeof ROLES;

export const TECH_STATUS = {
  proposed: 'Proposed',
  pilot: 'Pilot',
  permitted: 'Permitted',
  paused: 'Paused',
  banned: 'Banned',
} as const;
export type TechStatus = keyof typeof TECH_STATUS;

export interface CityRef { name: string; country: string; region?: string; lat: number; lng: number }
/** How a post or reply is attributed: a city and, optionally, a role. Never a person. */
export interface Byline { city: string; country?: string; region?: string; department?: string; role?: RoleKey }

export interface Profile {
  city: CityRef;
  department: string;
  role: RoleKey;
  sectors: string[];
  /** Shown only in MyEACP on this device. Never put on posts or in share links. */
  displayName?: string;
  createdAt: string;
}

export interface Reply { id: string; text: string; by: Byline | null; createdAt: string; mine: boolean }
export interface Seen { city: string; country?: string; at: string }

export interface Post {
  id: string;
  kind: PostKind;
  lat: number;
  lng: number;
  place: string;
  sectorId: string;
  typeId?: string;
  riskId?: string;
  /** YYYY-MM */
  when?: string;
  text: string;
  lesson?: string;
  outcomes: string[];
  link?: string;
  /** Image or video link (validated, see src/lib/media.ts). Travels with share links. */
  media?: Media;
  /** A photo uploaded on this device (IndexedDB, src/lib/media-store.ts). Never in share links. */
  localMediaId?: string;
  localMediaAlt?: string;
  /** 'exact' when the pin was placed by hand or by coordinates; 'approximate' when left at a city centre. */
  precision?: 'exact' | 'approximate';
  by: Byline | null;
  createdAt: string;
  /** Written in this browser (can edit and delete), or added from a share link. */
  mine: boolean;
  origin: 'local' | 'link';
  seenIn: Seen[];
  replies: Reply[];
}

export interface Saved { key: string; kind: 'risk' | 'type' | 'rule' | 'place'; title: string; href: string; sectorId?: string; savedAt: string }
export interface Tech { id: string; name: string; sectorId: string; typeId?: string; status: TechStatus; since?: string; notes?: string }
export interface Contact { id: string; operator: string; role: string; how: string; notes?: string }
/** "Seen this in my city too" on a research place (map pin). */
export interface SeenResearch { pinId: string; title: string; at: string }

export interface Workspace {
  v: 1;
  profile?: Profile;
  posts: Post[];
  saved: Saved[];
  techs: Tech[];
  contacts: Contact[];
  seenResearch: SeenResearch[];
}

const KEY = 'eacp-workspace-v1';
const OLD_KEY = 'eacp-shared-experiences';
export const CHANGE_EVENT = 'eacp-workspace-change';

const empty = (): Workspace => ({ v: 1, posts: [], saved: [], techs: [], contacts: [], seenResearch: [] });
export const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function read(): Workspace {
  try {
    const raw = localStorage.getItem(KEY);
    const ws: Workspace = raw ? { ...empty(), ...JSON.parse(raw) } : empty();
    // One-time move of entries made with the first map share form (Nov 25 build).
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      for (const e of JSON.parse(old) as any[]) {
        if (ws.posts.some((p) => p.id === e.id)) continue;
        ws.posts.push({
          id: e.id, kind: e.kind === 'wrong' ? 'wrong' : 'worked', lat: e.lat, lng: e.lng, place: e.place, sectorId: e.sectorId,
          text: e.text, outcomes: [], link: e.link, by: null, createdAt: e.createdAt, mine: true, origin: 'local', seenIn: [], replies: [],
        });
      }
      localStorage.removeItem(OLD_KEY);
      localStorage.setItem(KEY, JSON.stringify(ws));
    }
    return ws;
  } catch {
    return empty();
  }
}

function write(ws: Workspace) {
  try { localStorage.setItem(KEY, JSON.stringify(ws)); } catch {}
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

function update(fn: (ws: Workspace) => void) {
  const ws = read();
  fn(ws);
  write(ws);
  return ws;
}

export const ws = {
  get: read,
  profile: () => read().profile,
  setProfile: (p: Profile) => update((w) => { w.profile = p; }),
  byline(): Byline | null {
    const p = read().profile;
    return p ? { city: p.city.name, country: p.city.country, region: p.city.region, department: p.department || undefined, role: p.role } : null;
  },

  posts: () => read().posts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  post: (id: string) => read().posts.find((p) => p.id === id),
  addPost: (p: Post) => update((w) => { w.posts = [p, ...w.posts.filter((x) => x.id !== p.id)]; }),
  updatePost: (id: string, patch: Partial<Post>) => update((w) => { const p = w.posts.find((x) => x.id === id); if (p) Object.assign(p, patch); }),
  removePost: (id: string) => update((w) => { w.posts = w.posts.filter((p) => p.id !== id); }),
  /** Add a post from a share link, merging replies and "seen in" marks if it is already here. */
  importPost(p: Post) {
    return update((w) => {
      const have = w.posts.find((x) => x.id === p.id);
      if (!have) { w.posts.unshift({ ...p, mine: false, origin: 'link', replies: p.replies.map((r) => ({ ...r, mine: false })) }); return; }
      for (const r of p.replies) if (!have.replies.some((x) => x.id === r.id)) have.replies.push({ ...r, mine: false });
      for (const s of p.seenIn) if (!have.seenIn.some((x) => x.city === s.city && x.country === s.country)) have.seenIn.push(s);
    });
  },
  addReply: (postId: string, r: Reply) => update((w) => { w.posts.find((p) => p.id === postId)?.replies.push(r); }),
  removeReply: (postId: string, id: string) => update((w) => { const p = w.posts.find((x) => x.id === postId); if (p) p.replies = p.replies.filter((r) => r.id !== id); }),
  /** Toggle "seen this in my city too" for the signed-in profile's city. */
  toggleSeen(postId: string) {
    const by = this.byline();
    if (!by) return;
    update((w) => {
      const p = w.posts.find((x) => x.id === postId);
      if (!p) return;
      const i = p.seenIn.findIndex((s) => s.city === by.city && s.country === by.country);
      if (i > -1) p.seenIn.splice(i, 1);
      else p.seenIn.push({ city: by.city, country: by.country, at: new Date().toISOString() });
    });
  },

  isSaved: (key: string) => read().saved.some((s) => s.key === key),
  toggleSaved(item: Omit<Saved, 'savedAt'>) {
    let on = false;
    update((w) => {
      const i = w.saved.findIndex((s) => s.key === item.key);
      if (i > -1) w.saved.splice(i, 1);
      else { w.saved.unshift({ ...item, savedAt: new Date().toISOString() }); on = true; }
    });
    return on;
  },

  seenResearch: (pinId: string) => read().seenResearch.some((s) => s.pinId === pinId),
  toggleSeenResearch(pinId: string, title: string) {
    update((w) => {
      const i = w.seenResearch.findIndex((s) => s.pinId === pinId);
      if (i > -1) w.seenResearch.splice(i, 1);
      else w.seenResearch.unshift({ pinId, title, at: new Date().toISOString() });
    });
  },

  upsertTech: (t: Tech) => update((w) => { const i = w.techs.findIndex((x) => x.id === t.id); if (i > -1) w.techs[i] = t; else w.techs.push(t); }),
  removeTech: (id: string) => update((w) => { w.techs = w.techs.filter((t) => t.id !== id); }),
  upsertContact: (c: Contact) => update((w) => { const i = w.contacts.findIndex((x) => x.id === c.id); if (i > -1) w.contacts[i] = c; else w.contacts.push(c); }),
  removeContact: (id: string) => update((w) => { w.contacts = w.contacts.filter((c) => c.id !== id); }),

  /** Export the whole workspace as a JSON string (for moving between devices). */
  exportJson: () => JSON.stringify(read(), null, 2),
  /** Replace the workspace with an exported file. Returns false if the file is not a workspace. */
  importJson(text: string): boolean {
    try {
      const d = JSON.parse(text);
      if (d?.v !== 1 || !Array.isArray(d.posts)) return false;
      const clean = sanitizeWorkspace(d);
      if (!clean) return false;
      write(clean);
      return true;
    } catch {
      return false;
    }
  },
  clear: () => write(empty()),
};

/* ---------- validation of anything that comes from outside (share links, imported files) ---------- */

const str = (x: unknown, max: number) => (typeof x === 'string' ? x.slice(0, max) : undefined);
const num = (x: unknown, lo: number, hi: number) => (typeof x === 'number' && Number.isFinite(x) && x >= lo && x <= hi ? x : undefined);
const iso = (x: unknown) => (typeof x === 'string' && !Number.isNaN(Date.parse(x)) ? new Date(x).toISOString() : new Date().toISOString());
export const safeUrl = (x: unknown) => {
  if (typeof x !== 'string' || !x) return undefined;
  try { const u = new URL(x); return u.protocol === 'https:' || u.protocol === 'http:' ? u.href.slice(0, 500) : undefined; } catch { return undefined; }
};
function byline(x: any): Byline | null {
  if (!x || typeof x !== 'object') return null;
  const city = str(x.city, 80);
  if (!city) return null;
  const role = typeof x.role === 'string' && x.role in ROLES ? (x.role as RoleKey) : undefined;
  return { city, country: str(x.country, 3), region: str(x.region, 10), department: str(x.department, 80), role };
}

/** Check and trim a post that came from outside. Returns null if it is not a usable post. */
export function sanitizePost(x: any): Post | null {
  if (!x || typeof x !== 'object') return null;
  const kind = typeof x.kind === 'string' && x.kind in POST_KINDS ? (x.kind as PostKind) : null;
  const lat = num(x.lat, -90, 90), lng = num(x.lng, -180, 180);
  const text = str(x.text, 500), place = str(x.place, 120), sectorId = str(x.sectorId, 2), id = str(x.id, 60);
  if (!kind || lat === undefined || lng === undefined || !text || !place || !sectorId || !/^(0[1-9]|10)$/.test(sectorId) || !id) return null;
  return {
    id, kind, lat, lng, place, sectorId, text,
    typeId: str(x.typeId, 60), riskId: str(x.riskId, 60),
    when: typeof x.when === 'string' && /^\d{4}-\d{2}$/.test(x.when) ? x.when : undefined,
    lesson: str(x.lesson, 280),
    outcomes: Array.isArray(x.outcomes) ? x.outcomes.filter((o: unknown) => typeof o === 'string' && (OUTCOMES as readonly string[]).includes(o)) : [],
    link: safeUrl(x.link),
    media: sanitizeMedia(x.media),
    localMediaId: x.mine && typeof x.localMediaId === 'string' ? x.localMediaId.slice(0, 60) : undefined,
    localMediaAlt: x.mine ? str(x.localMediaAlt, 200) : undefined,
    precision: x.precision === 'exact' || x.precision === 'approximate' ? x.precision : undefined,
    by: byline(x.by),
    createdAt: iso(x.createdAt),
    mine: !!x.mine,
    origin: x.origin === 'link' ? 'link' : 'local',
    seenIn: Array.isArray(x.seenIn) ? x.seenIn.slice(0, 200).map((s: any) => ({ city: str(s?.city, 80), country: str(s?.country, 3), at: iso(s?.at) })).filter((s: Seen) => s.city) : [],
    replies: Array.isArray(x.replies) ? x.replies.slice(0, 100).map((r: any) => ({ id: str(r?.id, 60) || uid('r'), text: str(r?.text, 500) || '', by: byline(r?.by), createdAt: iso(r?.createdAt), mine: !!r?.mine })).filter((r: Reply) => r.text) : [],
  };
}

function sanitizeWorkspace(d: any): Workspace | null {
  const out = empty();
  out.posts = (d.posts as unknown[]).map(sanitizePost).filter(Boolean) as Post[];
  const p = d.profile;
  if (p && typeof p === 'object' && p.city) {
    const lat = num(p.city.lat, -90, 90), lng = num(p.city.lng, -180, 180);
    const name = str(p.city.name, 80);
    if (name && lat !== undefined && lng !== undefined) {
      out.profile = {
        city: { name, country: str(p.city.country, 3) || '', region: str(p.city.region, 10), lat, lng },
        department: str(p.department, 80) || '',
        role: p.role in ROLES ? p.role : 'other',
        sectors: Array.isArray(p.sectors) ? p.sectors.filter((s: unknown) => typeof s === 'string' && /^(0[1-9]|10)$/.test(s)) : [],
        displayName: str(p.displayName, 40),
        createdAt: iso(p.createdAt),
      };
    }
  }
  if (Array.isArray(d.saved)) out.saved = d.saved.filter((s: any) => s && typeof s.key === 'string' && typeof s.title === 'string' && typeof s.href === 'string' && s.href.startsWith('/')).map((s: any) => ({ key: s.key.slice(0, 120), kind: ['risk', 'type', 'rule', 'place'].includes(s.kind) ? s.kind : 'risk', title: s.title.slice(0, 200), href: s.href.slice(0, 200), sectorId: str(s.sectorId, 2), savedAt: iso(s.savedAt) }));
  if (Array.isArray(d.techs)) out.techs = d.techs.filter((t: any) => t && typeof t.name === 'string').map((t: any) => ({ id: str(t.id, 60) || uid('t'), name: t.name.slice(0, 80), sectorId: str(t.sectorId, 2) || '01', typeId: str(t.typeId, 60), status: t.status in TECH_STATUS ? t.status : 'proposed', since: typeof t.since === 'string' && /^\d{4}-\d{2}$/.test(t.since) ? t.since : undefined, notes: str(t.notes, 280) }));
  if (Array.isArray(d.contacts)) out.contacts = d.contacts.filter((c: any) => c && typeof c.operator === 'string').map((c: any) => ({ id: str(c.id, 60) || uid('c'), operator: c.operator.slice(0, 80), role: str(c.role, 80) || '', how: str(c.how, 120) || '', notes: str(c.notes, 280) }));
  if (Array.isArray(d.seenResearch)) out.seenResearch = d.seenResearch.filter((s: any) => s && typeof s.pinId === 'string').map((s: any) => ({ pinId: s.pinId.slice(0, 80), title: str(s.title, 200) || '', at: iso(s.at) }));
  return out;
}
