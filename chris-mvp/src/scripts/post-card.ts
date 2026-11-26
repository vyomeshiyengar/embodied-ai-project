/**
 * Renders one shared post (a use case, question or tip from a city) as a card, with its actions:
 * seen this too, replies, copy share link, print, show on map, edit and delete.
 * Everything here may come from a share link, so it is rendered as text only (never innerHTML).
 */
import { ws, POST_KINDS, ROLES, uid, type Post, type Byline } from '../lib/workspace-store';
import { getSession, requestSignIn } from '../lib/demo-auth';
import { shareUrl } from '../lib/share-link';
import type { Catalog } from '../lib/catalog';
import { el, fmtDate, base } from './map-core';
import { countryName } from './city-search';
import { embedUrl } from '../lib/media';
import { mediaStore } from '../lib/media-store';

export const KIND_ICON: Record<string, string> = {
  worked: 'M5 12.5l4.2 4.2L19 7',
  wrong: 'M12 4l9 16H3zM12 10v4M12 17v.5',
  near_miss: 'M3 13a9 9 0 0 1 18 0M7 13a5 5 0 0 1 10 0M12 13v.5',
  rule_change: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4',
  question: 'M9 9a3 3 0 1 1 4.2 2.8c-.8.4-1.2 1-1.2 1.8V15M12 18.5v.5',
  tip: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z',
};

export function icon(kind: string, cls = 'ki') {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', cls);
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', KIND_ICON[kind] || KIND_ICON.tip);
  svg.append(p);
  return svg;
}

export const bylineText = (b: Byline | null) => {
  if (!b) return 'a city';
  const place = [b.city, b.country === 'US' ? b.region || 'US' : countryName(b.country)].filter(Boolean).join(', ');
  const org = b.department || (b.role ? ROLES[b.role] : '');
  return org ? `${place}, ${org}` : place;
};
/** "Added by Pittsburgh, PA, Department of Mobility and Infrastructure" */
export const addedBy = (b: Byline | null) => `Added by ${bylineText(b)}`;

export interface CardOptions {
  catalog: Catalog;
  /** Rerender after a change. */
  onChange?: () => void;
  /** Where "Edit" goes (only for posts written in this browser). */
  editHref?: (p: Post) => string;
  compact?: boolean;
  /** Already on the map: leave out "Show on map". */
  onMap?: boolean;
  /** Preview while composing: no actions, no replies. */
  preview?: boolean;
  /** While composing: a photo not saved yet (object URL) and its description. */
  photoUrl?: string;
  photoAlt?: string;
  /** Live region for short confirmations ("Link copied"). */
  announce?: (msg: string) => void;
}

export function names(c: Catalog, p: Pick<Post, 'sectorId' | 'typeId' | 'riskId'>) {
  const s = c.sectors.find((x) => x.id === p.sectorId);
  return { s, t: s?.types.find((x) => x.id === p.typeId), r: s?.risks.find((x) => x.id === p.riskId) };
}

async function copyLink(p: Post, o: CardOptions, holder: HTMLElement) {
  const url = await shareUrl(p, `${base()}share/`);
  try {
    await navigator.clipboard.writeText(url);
    o.announce?.('Share link copied. Anyone who opens it can add this post to their map.');
  } catch {
    // Clipboard blocked: show the link so it can be copied by hand.
    holder.replaceChildren();
    const lab = el('label', 'manual', 'Copy this link');
    const inp = el('input') as HTMLInputElement;
    inp.readOnly = true; inp.value = url;
    lab.append(inp);
    holder.append(lab);
    inp.select();
  }
}

function printCard(card: HTMLElement) {
  card.classList.add('print-me');
  document.documentElement.classList.add('printing-card');
  const done = () => { card.classList.remove('print-me'); document.documentElement.classList.remove('printing-card'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(done, 1000);
}

export function renderPost(p: Post, o: CardOptions): HTMLElement {
  const { s, t, r } = names(o.catalog, p);
  const card = el('article', `post k-${p.kind}${o.compact ? ' compact' : ''}`);
  card.id = `post-${p.id}`;
  card.setAttribute('aria-labelledby', `post-${p.id}-h`);

  const head = el('header', 'ph');
  const badge = el('span', 'kind');
  badge.append(icon(p.kind), el('span', undefined, POST_KINDS[p.kind].label));
  const h = el('h3', undefined, p.place);
  h.id = `post-${p.id}-h`;
  const meta = el('p', 'meta', `${addedBy(p.by)}. ${p.when ? `Happened ${fmtDate(p.when)}. ` : ''}Posted ${fmtDate(p.createdAt)}.`);
  const tags = el('div', 'ptags');
  tags.append(el('span', 'tag shared', 'Unverified'));
  if (p.origin === 'link') tags.append(el('span', 'tag', 'From a share link'));
  if (p.mine) tags.append(el('span', 'tag mine', 'Yours'));
  if (p.precision === 'approximate') tags.append(el('span', 'tag', 'Approximate location'));
  head.append(badge, h, meta, tags);
  card.append(head);

  // What it is about: links back into the playbook.
  const about = el('ul', 'about');
  about.setAttribute('aria-label', 'About');
  const link = (text: string, href?: string) => { const li = el('li'); if (href) { const a = el('a', undefined, text) as HTMLAnchorElement; a.href = href; li.append(a); } else li.append(text); return li; };
  if (s) about.append(link(`${s.id} ${s.short}`, s.href));
  if (t) about.append(link(t.name, t.href));
  if (r) about.append(link(`Risk: ${r.title}`, r.href));
  card.append(about);

  card.append(el('p', 'text', p.text));
  const media = renderMedia(p, o);
  if (media) card.append(media);
  if (p.lesson) {
    const box = el('div', 'lesson');
    box.append(el('h4', undefined, p.kind === 'question' ? 'What we have tried so far' : 'What we would tell another city'), el('p', undefined, p.lesson));
    card.append(box);
  }
  if (p.outcomes.length) {
    const ul = el('ul', 'outcomes');
    ul.setAttribute('aria-label', 'What changed');
    p.outcomes.forEach((x) => ul.append(el('li', undefined, x)));
    card.append(ul);
  }
  if (p.link) {
    const a = el('a', 'src', 'Read the source') as HTMLAnchorElement;
    a.href = p.link; a.target = '_blank'; a.rel = 'noopener nofollow ugc';
    card.append(a);
  }

  if (o.preview) return card;

  // Actions
  const signed = !!getSession();
  const myBy = ws.byline();
  const iSaw = !!myBy && p.seenIn.some((x) => x.city === myBy.city && x.country === myBy.country);
  const acts = el('div', 'acts');
  const seen = el('button', 'act seen', p.seenIn.length ? `Seen in my city too (${p.seenIn.length})` : 'Seen this in my city too') as HTMLButtonElement;
  seen.type = 'button';
  seen.setAttribute('aria-pressed', String(iSaw));
  seen.addEventListener('click', () => {
    if (!signed) { requestSignIn(); return; }
    if (!ws.profile()) { o.announce?.('Set up your city in MyEACP first, so we know which city to add.'); return; }
    ws.toggleSeen(p.id);
    o.onChange?.();
  });
  acts.append(seen);
  const linkHolder = el('div', 'linkholder');
  const copy = el('button', 'act', 'Copy share link') as HTMLButtonElement;
  copy.type = 'button';
  copy.addEventListener('click', () => copyLink(ws.post(p.id) ?? p, o, linkHolder));
  const print = el('button', 'act', 'Print') as HTMLButtonElement;
  print.type = 'button';
  print.addEventListener('click', () => printCard(card));
  const onMap = el('a', 'act', 'Show on map') as HTMLAnchorElement;
  onMap.href = `${base()}map/?post=${encodeURIComponent(p.id)}`;
  acts.append(copy, print);
  if (!o.onMap) acts.append(onMap);
  if (p.mine && o.editHref) {
    const ed = el('a', 'act', 'Edit') as HTMLAnchorElement;
    ed.href = o.editHref(p);
    acts.append(ed);
  }
  const del = el('button', 'act danger', p.mine ? 'Delete' : 'Remove from my map') as HTMLButtonElement;
  del.type = 'button';
  del.addEventListener('click', () => {
    if (!confirm(p.mine ? 'Delete this post from this browser?' : 'Remove this post from your map?')) return;
    if (p.localMediaId) mediaStore.remove(p.localMediaId).catch(() => {});
    ws.removePost(p.id);
    o.announce?.(p.mine ? 'Post deleted.' : 'Post removed.');
    o.onChange?.();
  });
  acts.append(del);
  card.append(acts, linkHolder);
  if (p.seenIn.length) card.append(el('p', 'seenlist', `Also seen in: ${p.seenIn.map((x) => x.city).join(', ')}.`));

  // Replies (answers to questions, or follow-ups)
  if (!o.compact) {
    const th = el('section', 'thread');
    const hh = el('h4', undefined, p.kind === 'question' ? `Answers (${p.replies.length})` : `Replies (${p.replies.length})`);
    th.append(hh);
    if (p.replies.length) {
      const ol = el('ol', 'replies');
      for (const rep of p.replies) {
        const li = el('li');
        li.append(el('p', 'rby', `From ${bylineText(rep.by)}, ${fmtDate(rep.createdAt)}`), el('p', undefined, rep.text));
        if (rep.mine) {
          const rd = el('button', 'linkish', 'Delete reply') as HTMLButtonElement;
          rd.type = 'button';
          rd.addEventListener('click', () => { ws.removeReply(p.id, rep.id); o.onChange?.(); });
          li.append(rd);
        }
        ol.append(li);
      }
      th.append(ol);
    }
    if (signed) {
      const f = el('form', 'replyform') as HTMLFormElement;
      f.setAttribute('data-astro-reload', '');
      f.noValidate = true;
      const lab = el('label', undefined, p.kind === 'question' ? 'Answer from your city' : 'Add a reply');
      const ta = el('textarea') as HTMLTextAreaElement;
      ta.name = 'reply'; ta.maxLength = 500; ta.rows = 2;
      lab.append(ta);
      const b = el('button', 'btn small', p.kind === 'question' ? 'Post answer' : 'Post reply') as HTMLButtonElement;
      b.type = 'submit';
      f.append(lab, b);
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = ta.value.trim();
        if (!text) { ta.focus(); return; }
        ws.addReply(p.id, { id: uid('r'), text, by: ws.byline(), createdAt: new Date().toISOString(), mine: true });
        o.announce?.('Reply added. Copy the share link again so others get it.');
        o.onChange?.();
      }, true);
      th.append(f);
    } else {
      const b = el('button', 'linkish', 'Sign in to reply') as HTMLButtonElement;
      b.type = 'button';
      b.setAttribute('data-signin-open', '');
      th.append(b);
    }
    card.append(th);
  }
  return card;
}

/** The post's photo or video: an embedded video, a linked image, or a photo kept on this device. */
function renderMedia(p: Post, o: CardOptions): HTMLElement | null {
  const figure = (src: string, alt: string, note?: string) => {
    const f = el('figure', 'media');
    const img = el('img') as HTMLImageElement;
    img.src = src; img.alt = alt; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => f.remove());
    f.append(img);
    if (note) f.append(el('figcaption', undefined, note));
    return f;
  };
  if (o.photoUrl) return figure(o.photoUrl, o.photoAlt || 'Photo shared with this use case', 'Saved on this device only');
  if (p.localMediaId) {
    if (!p.mine) return null;
    const f = el('figure', 'media');
    mediaStore.get(p.localMediaId).then((blob) => {
      if (!blob) { f.remove(); return; }
      const img = el('img') as HTMLImageElement;
      img.src = URL.createObjectURL(blob);
      img.alt = p.localMediaAlt || 'Photo shared with this use case';
      img.addEventListener('load', () => URL.revokeObjectURL(img.src), { once: true });
      f.prepend(img);
    }).catch(() => f.remove());
    f.append(el('figcaption', undefined, 'Photo saved on this device only'));
    return f;
  }
  if (!p.media) return null;
  if (p.media.kind === 'video') {
    const src = embedUrl(p.media);
    if (!src) return null;
    const box = el('div', 'media video');
    const fr = el('iframe') as HTMLIFrameElement;
    fr.src = src;
    fr.title = p.media.alt || `Video: ${p.place}`;
    fr.loading = 'lazy';
    fr.allow = 'fullscreen; picture-in-picture';
    fr.referrerPolicy = 'strict-origin-when-cross-origin';
    fr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
    box.append(fr);
    return box;
  }
  return figure(p.media.url, p.media.alt || 'Image shared with this use case');
}
