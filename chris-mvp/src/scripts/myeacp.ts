/**
 * MyEACP runtime. Renders the signed-in demo user's workspace from the browser store.
 * Signed out: a sign-in prompt. First visit: city profile setup. Then five tabs.
 */
import { Marker, LngLatBounds } from 'maplibre-gl';
import { ws, CHANGE_EVENT, ROLES, TECH_STATUS, uid, type CityRef, type Profile, type RoleKey, type TechStatus, type Saved } from '../lib/workspace-store';
import { getSession } from '../lib/demo-auth';
import type { Catalog } from '../lib/catalog';
import { createMap, km, el, base, fmtDate } from './map-core';
import { mountCitySearch, cityLabel, countryName } from './city-search';
import { renderPost } from './post-card';
import { initSwitchers } from './switcher';

interface ResearchPoint { id: string; sectorId: string; sector: string; place: string; lat: number; lng: number; what: string; caseTitle?: string; asOf: string; approx: boolean }

export function mountMy(root: HTMLElement): () => void {
  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const page = root.ownerDocument;
  const catalog: Catalog = JSON.parse(page.querySelector('[data-catalog]')!.textContent || '{"sectors":[]}');
  const research: ResearchPoint[] = JSON.parse(page.querySelector('[data-research]')!.textContent || '[]');
  const live = q('[data-announce]');
  const announce = (m: string) => { live.textContent = ''; setTimeout(() => (live.textContent = m), 30); };
  const cleanups: (() => void)[] = [];
  const gate = q('[data-gate]'), setup = q<HTMLFormElement>('[data-setup]'), wsEl = q('[data-workspace]');
  const sectorName = (id?: string) => catalog.sectors.find((s) => s.id === id);
  let editingProfile = false;
  let pickedCity: CityRef | null = null;

  /* ---------- profile setup ---------- */
  const cityInput = q<HTMLInputElement>('[data-city-input]');
  cleanups.push(mountCitySearch(cityInput, q<HTMLUListElement>('[data-city-list]'), (c) => { pickedCity = c; }));
  cityInput.addEventListener('input', () => { pickedCity = null; });
  function openSetup(edit: boolean) {
    editingProfile = edit;
    const p = ws.profile();
    setup.reset();
    q('[data-setup-title]').textContent = edit ? 'Edit your city profile' : 'Set up your city';
    q('[data-setup-cancel]').hidden = !edit;
    q('[data-setup-error]').hidden = true;
    pickedCity = p?.city ?? null;
    if (p) {
      cityInput.value = cityLabel(p.city);
      (setup.elements.namedItem('department') as HTMLInputElement).value = p.department;
      (setup.elements.namedItem('role') as HTMLSelectElement).value = p.role;
      (setup.elements.namedItem('displayName') as HTMLInputElement).value = p.displayName ?? '';
      setup.querySelectorAll<HTMLInputElement>('input[name="sectors"]').forEach((c) => (c.checked = p.sectors.includes(c.value)));
    }
    render();
    (edit ? cityInput : setup.querySelector<HTMLElement>('h2'))?.focus();
  }
  setup.querySelector('h2')!.tabIndex = -1;
  setup.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = new FormData(setup);
    const errs = [!pickedCity && 'Pick your city from the list.', !String(f.get('department') || '').trim() && 'Add your department.'].filter(Boolean);
    const err = q('[data-setup-error]');
    if (errs.length) { err.textContent = errs.join(' '); err.hidden = false; return; }
    const prev = ws.profile();
    const p: Profile = {
      city: pickedCity!, department: String(f.get('department')).trim(), role: f.get('role') as RoleKey,
      sectors: f.getAll('sectors').map(String), displayName: String(f.get('displayName') || '').trim() || undefined,
      createdAt: prev?.createdAt ?? new Date().toISOString(),
    };
    editingProfile = false;
    ws.setProfile(p);
    announce('Profile saved.');
    q<HTMLElement>('[data-idcard] .city')?.focus();
  }, true);
  q('[data-setup-cancel]').addEventListener('click', () => { editingProfile = false; render(); });
  q('[data-edit-profile]').addEventListener('click', () => openSetup(true));

  /* ---------- maps (created when their tab is visible) ---------- */
  const maps: Record<string, ReturnType<typeof createMap> | undefined> = {};
  const markers: Marker[] = [];
  function drawMaps() {
    const p = ws.profile();
    if (!p) return;
    const prof = q('[data-map-profile]');
    if (prof.offsetParent && !maps.profile) {
      maps.profile = createMap({ container: prof, center: [p.city.lng, p.city.lat], zoom: 7 });
    }
    const con = q('[data-map-contrib]');
    if (con.offsetParent && !maps.contrib) maps.contrib = createMap({ container: con, center: [p.city.lng, p.city.lat], zoom: 3 });
    // refresh markers
    markers.splice(0).forEach((m) => m.remove());
    if (maps.profile) {
      maps.profile.map.resize();
      maps.profile.map.jumpTo({ center: [p.city.lng, p.city.lat] });
      markers.push(new Marker({ element: el('div', 'citypin') }).setLngLat([p.city.lng, p.city.lat]).addTo(maps.profile.map));
    }
    if (maps.contrib) {
      maps.contrib.map.resize();
      const mine = ws.posts().filter((x) => x.mine);
      const bb = new LngLatBounds();
      bb.extend([p.city.lng, p.city.lat]);
      markers.push(new Marker({ element: el('div', 'citypin') }).setLngLat([p.city.lng, p.city.lat]).addTo(maps.contrib.map));
      for (const x of mine) { bb.extend([x.lng, x.lat]); markers.push(new Marker({ element: el('div', 'mypin') }).setLngLat([x.lng, x.lat]).addTo(maps.contrib.map)); }
      if (mine.length) maps.contrib.map.fitBounds(bb, { padding: 50, maxZoom: 8, duration: 0 });
    }
  }
  cleanups.push(() => Object.values(maps).forEach((m) => m?.destroy()));

  /* ---------- renderers ---------- */
  const postOpts = { catalog, announce, onChange: () => render(), editHref: (p: { id: string }) => `${base()}share/?edit=${encodeURIComponent(p.id)}` };
  const none = (tag: 'p' | 'li' | 'div', text: string) => el(tag, 'none', text);
  const link = (text: string, href: string) => { const a = el('a', undefined, text) as HTMLAnchorElement; a.href = href; return a; };

  function renderIdCard(p: Profile) {
    const c = el('div', 'idc');
    const city = el('p', 'city', cityLabel(p.city));
    city.tabIndex = -1;
    c.append(city, el('p', 'role', [p.department, ROLES[p.role], p.displayName].filter(Boolean).join(', ')));
    q('[data-idcard]').replaceChildren(c);
  }

  function renderProfile(p: Profile) {
    const dl = q('[data-profile-facts]');
    dl.replaceChildren();
    const rows: [string, string | undefined][] = [
      ['City', cityLabel(p.city)], ['Country', countryName(p.city.country)], ['Department', p.department], ['Role', ROLES[p.role]],
      ['Display name', p.displayName],
    ];
    for (const [k, v] of rows) if (v) { const d = el('div'); d.append(el('dt', undefined, k), el('dd', undefined, v)); dl.append(d); }
    const ul = q('[data-my-sectors]');
    const secs = p.sectors.map((id) => sectorName(id)).filter(Boolean);
    ul.replaceChildren(...(secs.length ? secs.map((s) => { const li = el('li'); li.append(link(`${s!.id} ${s!.name}`, s!.href)); return li; }) : [none('li', 'No sectors chosen.')]));
  }

  function renderContrib() {
    const mine = ws.posts().filter((x) => x.mine);
    const replies = mine.reduce((n, x) => n + x.replies.filter((r) => !r.mine).length, 0);
    const seen = mine.reduce((n, x) => n + x.seenIn.length, 0);
    const stat = (n: number, l: string) => { const d = el('div', 'st'); d.append(el('b', undefined, String(n)), el('span', undefined, l)); return d; };
    q('[data-stats]').replaceChildren(stat(mine.length, mine.length === 1 ? 'post' : 'posts'), stat(replies, 'replies from other cities'), stat(seen, 'cities saw it too'), stat(ws.get().seenResearch.length, 'research cases marked seen'));
    const box = q('[data-my-posts]');
    if (!mine.length) {
      const n = none('div', 'No posts yet. ');
      n.append(link('Share a use case', `${base()}share/`));
      box.replaceChildren(n);
    } else box.replaceChildren(...mine.map((x) => renderPost(x, postOpts)));
    q('[data-n="contrib"]').textContent = String(mine.length);
  }

  function renderNear(p: Profile) {
    const all = research.map((r) => ({ r, d: km(p.city, r) })).sort((a, b) => a.d - b.d);
    const near = all.filter((x) => x.d <= 300);
    const show = near.length ? near : all.slice(0, 5);
    q('[data-near-note]').textContent = near.length
      ? `${near.length} within 300 km`
      : 'None within 300 km. Nearest:';
    q('[data-near]').replaceChildren(...show.map(({ r, d }) => {
      const li = el('li');
      const k = el('span', 'km', `${Math.round(d).toLocaleString('en-US')} km`);
      k.append(el('small', undefined, r.approx ? 'approximate' : 'away'));
      const body = el('div');
      const t = el('strong');
      t.append(link(r.caseTitle || r.place, `${base()}map/?place=${encodeURIComponent(r.id)}`));
      body.append(t, el('p', undefined, r.what.length > 180 ? r.what.slice(0, 177) + '...' : r.what), el('span', 'd', `${r.place}. ${r.sectorId} ${r.sector}. As of ${fmtDate(r.asOf)}.`));
      const seen = ws.seenResearch(r.id);
      const b = el('button', 'seenbtn', seen ? 'Marked: seen in my city too' : 'Seen this in my city too') as HTMLButtonElement;
      b.type = 'button';
      b.setAttribute('aria-pressed', String(seen));
      b.addEventListener('click', () => { ws.toggleSeenResearch(r.id, r.caseTitle || r.place); });
      const acts = el('div', 'mini-acts'); acts.append(b);
      body.append(acts);
      li.append(k, body);
      return li;
    }));
  }

  // Technologies: a board with one column per status
  const tForm = q<HTMLFormElement>('[data-tech-form]');
  const tSector = q<HTMLSelectElement>('[data-tsector]'), tType = q<HTMLSelectElement>('[data-ttype]');
  const opt = (v: string, t: string) => { const o = el('option', undefined, t) as HTMLOptionElement; o.value = v; return o; };
  const fillTType = () => { const s = sectorName(tSector.value); tType.replaceChildren(opt('', 'Not specific'), ...(s?.types.map((t) => opt(t.id, t.name)) ?? [])); };
  tSector.addEventListener('change', fillTType);
  function renderTech() {
    const techs = ws.get().techs;
    const board = q('[data-tech-board]');
    if (!techs.length) { board.replaceChildren(none('p', 'No technologies yet.')); return; }
    board.replaceChildren(...(Object.keys(TECH_STATUS) as TechStatus[]).map((st) => {
      const col = el('div', `col ${st}`);
      const list = techs.filter((t) => t.status === st);
      const h = el('h4', undefined, TECH_STATUS[st]);
      h.append(el('span', undefined, String(list.length)));
      col.append(h);
      for (const t of list) {
        const c = el('div', 'tcard');
        const s = sectorName(t.sectorId);
        const ty = s?.types.find((x) => x.id === t.typeId);
        c.append(el('strong', undefined, t.name), el('span', 'd', [s ? `${s.id} ${s.short}` : '', ty?.name, t.since ? `since ${fmtDate(t.since)}` : ''].filter(Boolean).join('. ')));
        if (t.notes) c.append(el('p', 'd', t.notes));
        const acts = el('div', 'mini-acts');
        const ed = el('button', undefined, 'Edit') as HTMLButtonElement; ed.type = 'button';
        ed.setAttribute('aria-label', `Edit ${t.name}`);
        ed.addEventListener('click', () => {
          (tForm.elements.namedItem('id') as HTMLInputElement).value = t.id;
          (tForm.elements.namedItem('name') as HTMLInputElement).value = t.name;
          tSector.value = t.sectorId; fillTType(); tType.value = t.typeId ?? '';
          (tForm.elements.namedItem('status') as HTMLSelectElement).value = t.status;
          (tForm.elements.namedItem('since') as HTMLInputElement).value = t.since ?? '';
          (tForm.elements.namedItem('notes') as HTMLInputElement).value = t.notes ?? '';
          q('[data-tech-title]').textContent = `Edit ${t.name}`;
          q('[data-tech-cancel]').hidden = false;
          (tForm.elements.namedItem('name') as HTMLInputElement).focus();
        });
        const rm = el('button', undefined, 'Remove') as HTMLButtonElement; rm.type = 'button';
        rm.setAttribute('aria-label', `Remove ${t.name}`);
        rm.addEventListener('click', () => { ws.removeTech(t.id); announce(`${t.name} removed.`); });
        acts.append(ed, rm);
        c.append(acts);
        col.append(c);
      }
      return col;
    }));
  }
  const resetTech = () => { tForm.reset(); (tForm.elements.namedItem('id') as HTMLInputElement).value = ''; fillTType(); q('[data-tech-title]').textContent = 'Add a technology'; q('[data-tech-cancel]').hidden = true; q('[data-tech-error]').hidden = true; };
  q('[data-tech-cancel]').addEventListener('click', resetTech);
  tForm.addEventListener('submit', (e) => {
    e.preventDefault(); e.stopPropagation();
    const f = new FormData(tForm);
    const name = String(f.get('name') || '').trim();
    if (!name) { const er = q('[data-tech-error]'); er.textContent = 'Add the operator or technology name.'; er.hidden = false; return; }
    ws.upsertTech({ id: String(f.get('id') || '') || uid('t'), name, sectorId: String(f.get('sectorId')), typeId: String(f.get('typeId') || '') || undefined, status: f.get('status') as TechStatus, since: String(f.get('since') || '') || undefined, notes: String(f.get('notes') || '').trim() || undefined });
    announce(`${name} saved.`);
    resetTech();
  }, true);

  // Fleet contacts
  const cForm = q<HTMLFormElement>('[data-contact-form]');
  const personal = (s: string) => /[\w.+-]+@[\w-]+\.[\w.]+/.test(s) && !/^(fleet|ops|operations|dispatch|support|safety|noc|info|desk|help|emergency|response|incident)/i.test(s);
  function renderContacts() {
    const list = ws.get().contacts;
    const ul = q('[data-contacts]');
    if (!list.length) { ul.replaceChildren(none('li', 'No contacts yet.')); return; }
    ul.replaceChildren(...list.map((c) => {
      const li = el('li');
      li.append(el('strong', undefined, `${c.operator}: ${c.role}`), el('p', undefined, c.how));
      if (c.notes) li.append(el('p', 'd', c.notes));
      const acts = el('div', 'mini-acts');
      const ed = el('button', undefined, 'Edit') as HTMLButtonElement; ed.type = 'button';
      ed.setAttribute('aria-label', `Edit ${c.operator}`);
      ed.addEventListener('click', () => {
        for (const k of ['id', 'operator', 'role', 'how', 'notes'] as const) (cForm.elements.namedItem(k) as HTMLInputElement).value = (c as unknown as Record<string, string>)[k] ?? '';
        q('[data-contact-title]').textContent = `Edit ${c.operator}`;
        q('[data-contact-cancel]').hidden = false;
        (cForm.elements.namedItem('operator') as HTMLInputElement).focus();
      });
      const rm = el('button', undefined, 'Remove') as HTMLButtonElement; rm.type = 'button';
      rm.setAttribute('aria-label', `Remove ${c.operator}`);
      rm.addEventListener('click', () => { ws.removeContact(c.id); announce('Contact removed.'); });
      acts.append(ed, rm);
      li.append(acts);
      return li;
    }));
  }
  const resetContact = () => { cForm.reset(); (cForm.elements.namedItem('id') as HTMLInputElement).value = ''; q('[data-contact-title]').textContent = 'Add a contact'; q('[data-contact-cancel]').hidden = true; q('[data-contact-error]').hidden = true; };
  q('[data-contact-cancel]').addEventListener('click', resetContact);
  cForm.addEventListener('submit', (e) => {
    e.preventDefault(); e.stopPropagation();
    const f = new FormData(cForm);
    const v = (k: string) => String(f.get(k) || '').trim();
    const er = q('[data-contact-error]');
    const errs = [!v('operator') && 'Add the operator.', !v('role') && 'Add the desk or role.', !v('how') && 'Add how to reach it.', personal(v('how') + ' ' + v('notes')) && 'Use a role-based desk line, not a personal email.'].filter(Boolean);
    if (errs.length) { er.textContent = errs.join(' '); er.hidden = false; return; }
    ws.upsertContact({ id: v('id') || uid('c'), operator: v('operator'), role: v('role'), how: v('how'), notes: v('notes') || undefined });
    announce('Contact saved.');
    resetContact();
  }, true);

  function renderSaved() {
    const saved = ws.get().saved;
    q('[data-n="saved"]').textContent = String(saved.length);
    const box = q('[data-saved]');
    if (!saved.length) { box.replaceChildren(none('p', 'Nothing saved yet.')); return; }
    const groups: [Saved['kind'], string][] = [['risk', 'Risks'], ['type', 'Types'], ['rule', 'Rules'], ['place', 'Places on the map']];
    box.replaceChildren(...groups.filter(([k]) => saved.some((s) => s.kind === k)).flatMap(([k, label]) => {
      const ul = el('ul');
      for (const s of saved.filter((x) => x.kind === k)) {
        const li = el('li');
        const d = el('div');
        d.append(link(s.title, s.href), el('span', 'd', `${s.sectorId ? `${s.sectorId} ${sectorName(s.sectorId)?.short ?? ''}. ` : ''}Saved ${fmtDate(s.savedAt)}`));
        const rm = el('button', 'linkish', 'Remove') as HTMLButtonElement; rm.type = 'button';
        rm.setAttribute('aria-label', `Remove ${s.title} from saved`);
        rm.addEventListener('click', () => { ws.toggleSaved(s); announce('Removed from saved.'); });
        const acts = el('div', 'mini-acts'); acts.append(rm);
        li.append(d, acts);
        ul.append(li);
      }
      return [el('h3', undefined, label), ul];
    }));
  }

  function renderQuestions() {
    const qs = ws.posts().filter((x) => x.kind === 'question');
    q('[data-n="questions"]').textContent = String(qs.length);
    const box = q('[data-questions]');
    box.replaceChildren(...(qs.length ? qs.map((x) => renderPost(x, postOpts)) : [none('div', 'No questions yet.')]));
  }

  /* ---------- main render ---------- */
  function render() {
    const signed = !!getSession();
    const p = ws.profile();
    gate.hidden = signed;
    setup.hidden = !signed || (!!p && !editingProfile);
    wsEl.hidden = !signed || !p || editingProfile;
    if (signed && !p && !editingProfile && setup.hidden === false) q('[data-setup-cancel]').hidden = true;
    if (!signed || !p || editingProfile) return;
    renderIdCard(p);
    renderProfile(p);
    renderContrib();
    renderNear(p);
    renderTech();
    renderContacts();
    renderSaved();
    renderQuestions();
    q('[data-n="city"]').textContent = String(ws.get().techs.length);
    initSwitchers(root);
    setTimeout(drawMaps, 30);
  }

  // Export and import
  q('[data-export]').addEventListener('click', () => {
    const blob = new Blob([ws.exportJson()], { type: 'application/json' });
    const a = el('a') as HTMLAnchorElement;
    a.href = URL.createObjectURL(blob);
    a.download = `eacp-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    announce('Workspace exported.');
  });
  q<HTMLInputElement>('[data-import]').addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) { announce('That file is too large to be a workspace.'); input.value = ''; return; }
    if (!confirm('Replace everything in this workspace with the file?')) { input.value = ''; return; }
    const ok = ws.importJson(await file.text());
    announce(ok ? 'Workspace imported.' : 'That file is not an EACP workspace export.');
    input.value = '';
  });
  q('[data-reset]').addEventListener('click', () => {
    if (!confirm('Clear your profile, posts, saved items, technologies and contacts from this browser?')) return;
    ws.clear();
    announce('Workspace cleared.');
  });

  const onTab = () => setTimeout(drawMaps, 30);
  root.addEventListener('switch', onTab);
  const onStorage = (e: StorageEvent) => { if (e.key?.startsWith('eacp-')) render(); };
  window.addEventListener(CHANGE_EVENT, render);
  window.addEventListener('eacp-auth-change', render);
  window.addEventListener('storage', onStorage);
  cleanups.push(() => {
    root.removeEventListener('switch', onTab);
    window.removeEventListener(CHANGE_EVENT, render);
    window.removeEventListener('eacp-auth-change', render);
    window.removeEventListener('storage', onStorage);
  });

  fillTType();
  render();
  if (getSession() && !ws.profile()) openSetup(false);
  return () => cleanups.forEach((f) => f());
}
