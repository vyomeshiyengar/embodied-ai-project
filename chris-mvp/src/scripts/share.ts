/**
 * Share page runtime: the five-step composer (any place on Earth), the feed of posts from other cities,
 * and opening posts from share links. Browser-only demo; see src/lib/workspace-store.ts.
 */
import { Marker } from 'maplibre-gl';
import { ws, CHANGE_EVENT, POST_KINDS, uid, safeUrl, type Post, type PostKind } from '../lib/workspace-store';
import { getSession } from '../lib/demo-auth';
import { codeFromHash, decodePost, shareUrl } from '../lib/share-link';
import type { Catalog } from '../lib/catalog';
import { createMap, km, el, base, reducedMotion, fmtDate } from './map-core';
import { mountCitySearch, nearestCity, cityLabel } from './city-search';
import { renderPost } from './post-card';
import { parseMedia } from '../lib/media';
import { preparePhoto, mediaStore } from '../lib/media-store';
import { select } from './switcher';

interface ResearchPoint { id: string; sectorId: string; place: string; lat: number; lng: number; what: string; caseTitle?: string; sources: { publisher: string; url: string; published?: string }[]; asOf: string }
const STEP_NAMES = ['Where', 'What kind', 'Technology', 'The story', 'Review'];

export function mountShare(root: HTMLElement): () => void {
  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const page = root.ownerDocument;
  const catalog: Catalog = JSON.parse(page.querySelector('[data-catalog]')!.textContent || '{}');
  const research: ResearchPoint[] = JSON.parse(page.querySelector('[data-research]')!.textContent || '[]');
  const live = q('[data-announce]');
  const announce = (m: string) => { live.textContent = ''; setTimeout(() => (live.textContent = m), 30); };
  const cleanups: (() => void)[] = [];

  /* ---------------- composer ---------------- */
  const gate = q('[data-gate]');
  const composer = q('[data-composer]');
  const form = q<HTMLFormElement>('[data-compose-form]');
  const steps = [...root.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const prog = [...root.querySelectorAll<HTMLElement>('[data-pstep]')];
  const err = q('[data-compose-error]');
  const backBtn = q<HTMLButtonElement>('[data-back]');
  const nextBtn = q<HTMLButtonElement>('[data-next]');
  const pubBtn = q<HTMLButtonElement>('[data-publish]');
  const done = q('[data-done]');
  const field = <T extends HTMLElement = HTMLInputElement>(name: string) => form.elements.namedItem(name) as unknown as T;
  const params = new URLSearchParams(location.search);
  const editing = params.get('edit') ? ws.post(params.get('edit')!) : undefined;
  let step = 0;
  let pin: { lat: number; lng: number } | null = null;
  /** True once the pin was clicked, dragged or typed; false while it sits on a searched city's centre. */
  let pinExact = false;
  /** A photo chosen for upload, already resized; saved to IndexedDB on publish. */
  let pendingPhoto: Blob | null = null;
  let previewUrl: string | null = null;
  let lastPostId: string | null = null;

  // Map (created when the composer is first visible, since MapLibre needs a sized container)
  let mapApi: ReturnType<typeof createMap> | null = null;
  let marker: Marker | null = null;
  const pinStatus = q('[data-pin-status]');
  const setPin = (lat: number, lng: number, fly = false) => {
    lat = Math.max(-85, Math.min(85, lat));
    lng = ((((lng + 180) % 360) + 360) % 360) - 180;
    pin = { lat, lng };
    field('lat').value = lat.toFixed(4);
    field('lng').value = lng.toFixed(4);
    pinStatus.textContent = `Pin at ${lat.toFixed(4)}, ${lng.toFixed(4)}.`;
    if (mapApi) {
      if (!marker) {
        const n = el('div', 'draft-pin');
        n.setAttribute('aria-hidden', 'true');
        marker = new Marker({ element: n, draggable: true, anchor: 'bottom-left' });
        marker.on('dragend', () => { const ll = marker!.getLngLat(); pinExact = true; setPin(ll.lat, ll.lng); suggestName(); });
      }
      marker.setLngLat([lng, lat]).addTo(mapApi.map);
      if (fly) mapApi.map.flyTo({ center: [lng, lat], zoom: Math.max(mapApi.map.getZoom(), 15), duration: reducedMotion() ? 0 : 900 });
      marker.getElement().classList.toggle('pulse', !pinExact);
    }
  };
  const suggestName = async () => {
    if (!pin) return;
    const near = await nearestCity(pin.lat, pin.lng);
    const nameInput = field('place');
    if (near && (!nameInput.value || nameInput.dataset.auto === '1')) {
      nameInput.value = near.km < 8 ? cityLabel(near) : `Near ${cityLabel(near)}`;
      nameInput.dataset.auto = '1';
    }
    pinStatus.textContent = pinExact
      ? `Pin at ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}${near ? `, about ${Math.round(near.km)} km from ${near.name}` : ''}.`
      : 'Drag the pin to where it happened.';
  };
  const ensureMap = () => {
    if (mapApi || composer.hidden) { mapApi?.map.resize(); return; }
    mapApi = createMap({ container: q('[data-compose-map]'), center: pin ? [pin.lng, pin.lat] : [-30, 25], zoom: pin ? 8 : 1.3 });
    mapApi.map.on('click', (e) => { pinExact = true; setPin(e.lngLat.lat, e.lngLat.lng); suggestName(); });
    if (pin) setPin(pin.lat, pin.lng);
    (window as unknown as { __share?: unknown }).__share = { map: mapApi.map, setPin };
  };
  cleanups.push(() => mapApi?.destroy());
  field('place').addEventListener('input', () => { field('place').dataset.auto = ''; });
  cleanups.push(mountCitySearch(q<HTMLInputElement>('[data-city-input]'), q<HTMLUListElement>('[data-city-list]'), (c) => {
    pinExact = false;
    setPin(c.lat, c.lng, true);
    field('place').value = cityLabel(c);
    field('place').dataset.auto = '1';
    pinStatus.textContent = 'Drag the pin to where it happened.';
  }));
  q('[data-coords-go]').addEventListener('click', () => {
    const lat = parseFloat(field('lat').value), lng = parseFloat(field('lng').value);
    if (!(Math.abs(lat) <= 90 && Math.abs(lng) <= 180)) { showErr(['Latitude must be between -90 and 90, longitude between -180 and 180.']); return; }
    err.hidden = true;
    pinExact = true;
    setPin(lat, lng, true);
    suggestName();
  });

  // Sector, type and risk pickers
  const secSel = field<HTMLSelectElement>('sector'), typeSel = field<HTMLSelectElement>('type'), riskSel = field<HTMLSelectElement>('risk');
  const opt = (v: string, t: string) => { const o = el('option', undefined, t) as HTMLOptionElement; o.value = v; return o; };
  const fillTypes = () => {
    const s = catalog.sectors.find((x) => x.id === secSel.value);
    typeSel.replaceChildren(opt('', s ? 'Not specific to one type' : 'Choose a sector first'), ...(s?.types.map((t) => opt(t.id, t.name)) ?? []));
    typeSel.disabled = !s || !s.types.length;
    fillRisks();
  };
  const fillRisks = () => {
    const s = catalog.sectors.find((x) => x.id === secSel.value);
    const keep = riskSel.value;
    const list = (s?.risks ?? []).filter((r) => !typeSel.value || r.all || r.types.includes(typeSel.value));
    const group = (cat: string, label: string) => { const g = el('optgroup') as HTMLOptGroupElement; g.label = label; list.filter((r) => r.category === cat).forEach((r) => g.append(opt(r.id, r.title))); return g.children.length ? [g] : []; };
    riskSel.replaceChildren(opt('', s ? (s.risks.length ? 'None in particular' : 'No risks written up for this sector yet') : 'Choose a sector first'), ...group('likely', 'Likely'), ...group('black_swan', 'Black swan'));
    riskSel.disabled = !list.length;
    if ([...riskSel.options].some((o) => o.value === keep)) riskSel.value = keep;
  };
  secSel.addEventListener('change', fillTypes);
  typeSel.addEventListener('change', fillRisks);

  // Kind changes the wording of step 4
  const kindLabels = () => {
    const k = (form.elements.namedItem('kind') as RadioNodeList).value as PostKind;
    q('[data-text-label]').textContent = k === 'question' ? 'Your question for other cities' : 'What happened';
    q('[data-lesson-label]').textContent = k === 'question' ? 'What you have tried so far' : 'What would you tell another city?';
  };
  form.querySelectorAll('input[name="kind"]').forEach((r) => r.addEventListener('change', kindLabels));

  // Character counters
  form.querySelectorAll<HTMLTextAreaElement>('[data-counted]').forEach((t) => {
    const c = form.querySelector<HTMLElement>(`[data-count-for="${t.name}"]`)!;
    const sync = () => { c.textContent = `${t.value.length} of ${t.maxLength}`; };
    t.addEventListener('input', sync);
    sync();
  });

  // Media: a link (image, YouTube, Vimeo) or a photo kept on this device
  const mediaFrom = () => (form.elements.namedItem('mediaFrom') as RadioNodeList).value as 'link' | 'upload';
  const mediaPreview = q('[data-media-preview]');
  const syncMediaFrom = () => {
    q('[data-media-link]').hidden = mediaFrom() !== 'link';
    q('[data-media-upload]').hidden = mediaFrom() !== 'upload';
    showMediaPreview();
  };
  const showMediaPreview = () => {
    mediaPreview.replaceChildren();
    if (mediaFrom() === 'upload' && previewUrl) {
      const img = el('img') as HTMLImageElement;
      img.src = previewUrl; img.alt = 'Preview of the photo';
      mediaPreview.append(img);
    }
  };
  form.querySelectorAll('input[name="mediaFrom"]').forEach((r) => r.addEventListener('change', syncMediaFrom));
  q<HTMLInputElement>('[data-media-file]').addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    pendingPhoto = null;
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    if (file) {
      try {
        pendingPhoto = await preparePhoto(file);
        previewUrl = URL.createObjectURL(pendingPhoto);
        err.hidden = true;
      } catch (x) {
        showErr([(x as Error).message === 'too-large' ? 'That photo is over 15 MB.' : 'That file is not an image.']);
      }
    }
    showMediaPreview();
  });
  cleanups.push(() => { if (previewUrl) URL.revokeObjectURL(previewUrl); });

  function draft(): Post {
    const f = new FormData(form);
    const by = ws.byline();
    return {
      id: editing?.id ?? uid('p'),
      kind: (f.get('kind') as PostKind) || 'worked',
      lat: pin?.lat ?? 0, lng: pin?.lng ?? 0,
      place: String(f.get('place') || '').trim(),
      sectorId: String(f.get('sector') || ''),
      typeId: String(f.get('type') || '') || undefined,
      riskId: String(f.get('risk') || '') || undefined,
      when: String(f.get('when') || '') || undefined,
      text: String(f.get('text') || '').trim(),
      lesson: String(f.get('lesson') || '').trim() || undefined,
      outcomes: f.getAll('outcomes').map(String),
      link: safeUrl(String(f.get('link') || '').trim()),
      media: mediaFrom() === 'link' ? parseMedia(String(f.get('mediaUrl') || ''), String(f.get('mediaAlt') || '').trim()) ?? undefined : undefined,
      localMediaId: mediaFrom() === 'upload' && (pendingPhoto || editing?.localMediaId) ? editing?.localMediaId ?? uid('m') : undefined,
      precision: pinExact ? 'exact' : 'approximate',
      by: editing?.by ?? by,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      mine: true, origin: 'local',
      seenIn: editing?.seenIn ?? [],
      replies: editing?.replies ?? [],
    };
  }

  function problems(n: number): string[] {
    const f = new FormData(form);
    const link = String(f.get('link') || '').trim();
    const when = String(f.get('when') || '');
    const out: (string | false)[] = [];
    if (n === 0) out.push(!pin && 'Search for a city, click the map or type coordinates to place a pin.', !String(f.get('place') || '').trim() && 'Add a place name.');
    if (n === 1) out.push(!f.get('kind') && 'Choose what kind of post it is.');
    if (n === 2) out.push(!f.get('sector') && 'Choose a sector.');
    if (n === 3) out.push(
      !String(f.get('text') || '').trim() && (f.get('kind') === 'question' ? 'Write your question.' : 'Describe what happened.'),
      !link && 'Add a link to the article or official page about this use case.',
      !!link && !safeUrl(link) && 'The link must start with http:// or https://.',
      mediaFrom() === 'link' && !!String(f.get('mediaUrl') || '').trim() && !parseMedia(String(f.get('mediaUrl'))) && 'Use a direct image link (.jpg, .png, .webp) or a YouTube or Vimeo link.',
      mediaFrom() === 'link' && parseMedia(String(f.get('mediaUrl') || ''))?.kind === 'image' && !String(f.get('mediaAlt') || '').trim() && 'Describe the image.',
      mediaFrom() === 'upload' && !!pendingPhoto && !String(f.get('mediaFileAlt') || '').trim() && 'Describe the photo.',
      !!when && when > new Date().toISOString().slice(0, 7) && 'The date can’t be in the future.',
      /[\w.+-]+@[\w-]+\.[\w.]+/.test(`${f.get('text')} ${f.get('lesson')}`) && 'Please remove email addresses. Describe roles instead.',
      /(\+?\d[\d\s().-]{8,}\d)/.test(`${f.get('text')} ${f.get('lesson')}`) && 'Please remove phone numbers.',
    );
    return out.filter(Boolean) as string[];
  }
  function showErr(list: string[]) { err.textContent = list.join(' '); err.hidden = !list.length; }

  function go(n: number, focus = true) {
    const dir = n < step ? 'from-left' : 'from-right';
    step = n;
    steps.forEach((s, i) => {
      s.hidden = i !== n;
      if (i === n) { s.classList.remove('enter', 'from-left', 'from-right'); void s.offsetWidth; s.classList.add('enter', dir); }
    });
    prog.forEach((p, i) => { p.classList.toggle('done', i < n); p.classList.toggle('now', i === n); if (i === n) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); });
    backBtn.hidden = n === 0;
    nextBtn.hidden = n === steps.length - 1;
    pubBtn.hidden = n !== steps.length - 1;
    pubBtn.textContent = editing ? 'Save changes' : 'Publish to my map';
    err.hidden = true;
    q('[data-step-status]').textContent = `Step ${n + 1} of ${steps.length}: ${STEP_NAMES[n]}`;
    if (n === 0) setTimeout(() => mapApi?.map.resize(), 50);
    if (n === 4) review();
    if (focus) { steps[n].tabIndex = -1; steps[n].focus({ preventScroll: true }); steps[n].scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }); }
  }
  nextBtn.addEventListener('click', () => {
    const p = problems(step);
    if (p.length) { showErr(p); return; }
    go(step + 1);
  });
  backBtn.addEventListener('click', () => go(step - 1));

  function review() {
    const d = draft();
    q('[data-preview]').replaceChildren(renderPost(d, { catalog, preview: true, photoUrl: mediaFrom() === 'upload' ? previewUrl ?? undefined : undefined, photoAlt: String(new FormData(form).get('mediaFileAlt') || '') }));
    const box = q('[data-similar]');
    box.replaceChildren();
    const s = catalog.sectors.find((x) => x.id === d.sectorId);
    const r = s?.risks.find((x) => x.id === d.riskId);
    if (r?.case) {
      const div = el('div', 'sim');
      const a = el('a', undefined, r.title) as HTMLAnchorElement;
      a.href = r.href;
      const st = el('strong'); st.append(a);
      div.append(st, el('p', undefined, r.case), el('span', 'd', 'From the playbook’s risk page, with sources.'));
      box.append(div);
    }
    const near = research.filter((x) => x.sectorId === d.sectorId).map((x) => ({ x, d: km(x, d) })).sort((a, b) => a.d - b.d).slice(0, 3);
    for (const { x, d: dist } of near) {
      const div = el('div', 'sim');
      const a = el('a', undefined, x.caseTitle || x.place) as HTMLAnchorElement;
      a.href = `${base()}map/?sector=${x.sectorId}&place=${encodeURIComponent(x.id)}`;
      const st = el('strong'); st.append(a);
      div.append(st, el('p', undefined, x.what.length > 160 ? x.what.slice(0, 157) + '...' : x.what), el('span', 'd', `${x.place}, about ${Math.round(dist).toLocaleString('en-US')} km away. As of ${fmtDate(x.asOf)}.`));
      box.append(div);
    }
    if (!box.children.length) box.append(el('p', 'small', 'No research cases for this sector yet.'));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!getSession()) return;
    for (let i = 0; i < 4; i++) { const p = problems(i); if (p.length) { go(i); showErr(p); return; } }
    const d = draft();
    if (d.localMediaId) d.media = undefined;
    const alt = String(new FormData(form).get('mediaFileAlt') || '').trim();
    if (d.localMediaId && pendingPhoto) {
      const blob = pendingPhoto;
      mediaStore.put(d.localMediaId, blob).then(() => ws.updatePost(d.id, {})).catch(() => announce('The photo could not be saved in this browser.'));
    }
    if (d.localMediaId) d.localMediaAlt = alt || undefined;
    if (editing) ws.updatePost(d.id, d); else ws.addPost(d);
    lastPostId = d.id;
    form.hidden = true;
    root.querySelector<HTMLElement>('.progress')!.hidden = true;
    done.hidden = false;
    q('[data-done-map]').setAttribute('href', `${base()}map/?post=${encodeURIComponent(d.id)}`);
    q('[data-done-link]').replaceChildren();
    done.focus();
    announce(editing ? 'Changes saved.' : 'Posted to your map.');
  }, true);

  q('[data-done-copy]').addEventListener('click', async () => {
    const p = lastPostId && ws.post(lastPostId);
    if (!p) return;
    const url = await shareUrl(p, `${base()}share/`);
    try { await navigator.clipboard.writeText(url); announce('Share link copied.'); q('[data-done-copy]').textContent = 'Link copied'; }
    catch {
      const lab = el('label', 'manual', 'Copy this link');
      const inp = el('input') as HTMLInputElement; inp.readOnly = true; inp.value = url;
      lab.append(inp); q('[data-done-link]').replaceChildren(lab); inp.select();
    }
  });
  q('[data-done-again]').addEventListener('click', () => resetComposer());
  q('[data-done-feed]').addEventListener('click', () => { select(document.getElementById('tab-feed')!, true); setTimeout(() => document.getElementById(`post-${lastPostId}`)?.scrollIntoView({ block: 'center' }), 60); });

  function resetComposer() {
    if (editing) { history.replaceState(history.state, '', location.pathname); }
    form.reset();
    pin = null;
    pinExact = false;
    pendingPhoto = null;
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    syncMediaFrom();
    marker?.remove(); marker = null;
    pinStatus.textContent = 'No pin yet.';
    fillTypes();
    kindLabels();
    form.querySelectorAll<HTMLTextAreaElement>('[data-counted]').forEach((t) => t.dispatchEvent(new Event('input')));
    form.hidden = false;
    root.querySelector<HTMLElement>('.progress')!.hidden = false;
    done.hidden = true;
    q('[data-done-copy]').textContent = 'Copy share link';
    go(0);
  }

  function loadEditing(p: Post) {
    secSel.value = p.sectorId; fillTypes();
    typeSel.value = p.typeId ?? ''; fillRisks();
    riskSel.value = p.riskId ?? '';
    (form.querySelector<HTMLInputElement>(`input[name="kind"][value="${p.kind}"]`)!).checked = true;
    kindLabels();
    field('place').value = p.place;
    field('when').value = p.when ?? '';
    field<HTMLTextAreaElement>('text').value = p.text;
    field<HTMLTextAreaElement>('lesson').value = p.lesson ?? '';
    field('link').value = p.link ?? '';
    if (p.localMediaId) {
      (form.querySelector<HTMLInputElement>('input[name="mediaFrom"][value="upload"]')!).checked = true;
      field('mediaFileAlt').value = p.localMediaAlt ?? '';
    } else if (p.media) {
      field('mediaUrl').value = p.media.url;
      field('mediaAlt').value = p.media.alt ?? '';
    }
    syncMediaFrom();
    pinExact = p.precision !== 'approximate';
    form.querySelectorAll<HTMLInputElement>('input[name="outcomes"]').forEach((c) => (c.checked = p.outcomes.includes(c.value)));
    form.querySelectorAll<HTMLTextAreaElement>('[data-counted]').forEach((t) => t.dispatchEvent(new Event('input')));
    pin = { lat: p.lat, lng: p.lng };
    field('lat').value = p.lat.toFixed(4);
    field('lng').value = p.lng.toFixed(4);
  }

  const syncAuth = () => {
    const signed = !!getSession();
    gate.hidden = signed;
    composer.hidden = !signed;
    if (signed) ensureMap();
  };

  /* ---------------- feed ---------------- */
  const list = q('[data-feed-list]');
  const empty = q('[data-feed-empty]');
  const fcount = q('[data-fcount]');
  const feedCount = page.querySelector<HTMLElement>('[data-feed-count]')!;
  const fstate = { kind: '', sector: '', type: '', city: '' };
  const ftype = q<HTMLSelectElement>('[data-ftype]');
  const opts = { catalog, announce, onChange: () => renderFeed(), editHref: (p: Post) => `${base()}share/?edit=${encodeURIComponent(p.id)}` };

  function renderFeed() {
    // Keep focus on the same control across re-renders.
    const a = document.activeElement as HTMLElement | null;
    const card = a?.closest<HTMLElement>('.post');
    const idx = card ? [...card.querySelectorAll('button, a, textarea')].indexOf(a!) : -1;
    const all = ws.posts();
    feedCount.textContent = String(all.length);
    const city = fstate.city.trim().toLowerCase();
    const shown = all.filter((p) => (!fstate.kind || p.kind === fstate.kind) && (!fstate.sector || p.sectorId === fstate.sector) && (!fstate.type || p.typeId === fstate.type)
      && (!city || `${p.place} ${p.by?.city ?? ''}`.toLowerCase().includes(city)));
    list.replaceChildren(...shown.map((p) => renderPost(p, opts)));
    empty.hidden = all.length > 0;
    fcount.textContent = all.length ? `${shown.length} of ${all.length} posts` : '';
    if (card && idx > -1) {
      const again = document.getElementById(card.id);
      (again?.querySelectorAll<HTMLElement>('button, a, textarea')[idx] ?? again)?.focus?.();
    }
  }
  root.querySelectorAll<HTMLButtonElement>('[data-fkind]').forEach((b) => b.addEventListener('click', () => {
    fstate.kind = b.dataset.fkind || '';
    root.querySelectorAll('[data-fkind]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderFeed();
  }));
  q<HTMLSelectElement>('[data-fsector]').addEventListener('change', (e) => {
    fstate.sector = (e.target as HTMLSelectElement).value;
    fstate.type = '';
    const s = catalog.sectors.find((x) => x.id === fstate.sector);
    ftype.replaceChildren(opt('', 'All technologies'), ...(s?.types.map((t) => opt(t.id, t.name)) ?? []));
    ftype.disabled = !s;
    renderFeed();
  });
  ftype.addEventListener('change', () => { fstate.type = ftype.value; renderFeed(); });
  q<HTMLInputElement>('[data-fcity]').addEventListener('input', (e) => { fstate.city = (e.target as HTMLInputElement).value; renderFeed(); });

  // A post opened from a share link
  async function incoming() {
    const code = codeFromHash();
    const box = q('[data-incoming]');
    if (!code) { box.hidden = true; return; }
    select(document.getElementById('tab-feed')!);
    const p = await decodePost(code);
    box.replaceChildren();
    box.hidden = false;
    if (!p) { box.append(el('h2', undefined, 'This share link could not be read'), el('p', undefined, 'It may have been cut off when it was copied. Ask the sender for the full link.')); box.focus(); return; }
    const have = ws.post(p.id);
    box.append(el('h2', undefined, have ? 'This post is already on your map' : 'A city shared this with you'));
    box.append(el('p', 'small', 'Shared posts are not checked by anyone. Read them as one city’s account.'));
    box.append(renderPost(p, { catalog, preview: true }));
    const row = el('div', 'done-acts');
    const add = el('button', 'btn', have ? 'Update it with this link' : 'Add to my map') as HTMLButtonElement;
    add.type = 'button';
    add.addEventListener('click', () => {
      ws.importPost(p);
      history.replaceState(history.state, '', location.pathname + location.search);
      box.hidden = true;
      announce(have ? 'Post updated with new replies.' : 'Added to your map and feed.');
      renderFeed();
      const c = document.getElementById(`post-${p.id}`);
      c?.classList.add('enter');
      c?.scrollIntoView({ block: 'center' });
      c?.querySelector('h3')?.setAttribute('tabindex', '-1');
      (c?.querySelector('h3') as HTMLElement | null)?.focus();
    });
    const no = el('button', 'btn secondary', 'Not now') as HTMLButtonElement;
    no.type = 'button';
    no.addEventListener('click', () => { history.replaceState(history.state, '', location.pathname + location.search); box.hidden = true; });
    row.append(add, no);
    box.append(row);
    box.focus();
  }

  /* ---------------- start ---------------- */
  const tabs = page.querySelector<HTMLElement>('[data-share-tabs]')!;
  const onTab = () => { if (document.getElementById('tab-compose')?.getAttribute('aria-selected') === 'true') setTimeout(ensureMap, 30); };
  tabs.addEventListener('switch', onTab);
  const onChange = () => { renderFeed(); syncAuth(); };
  const onStorage = (e: StorageEvent) => { if (e.key?.startsWith('eacp-')) onChange(); };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('eacp-auth-change', onChange);
  window.addEventListener('storage', onStorage);
  window.addEventListener('hashchange', incoming);
  cleanups.push(() => {
    tabs.removeEventListener('switch', onTab);
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('eacp-auth-change', onChange);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('hashchange', incoming);
  });

  fillTypes();
  if (editing?.mine) loadEditing(editing);
  syncAuth();
  go(0, false);
  if (editing?.mine) setPin(editing.lat, editing.lng);
  renderFeed();
  if (params.get('tab') === 'feed' || params.get('post')) select(document.getElementById('tab-feed')!);
  if (params.get('post')) setTimeout(() => document.getElementById(`post-${params.get('post')}`)?.scrollIntoView({ block: 'center' }), 80);
  if (params.get('sector') && !editing) { secSel.value = params.get('sector')!; fillTypes(); }
  incoming();

  return () => cleanups.forEach((f) => f());
}

export const KINDS = POST_KINDS;
