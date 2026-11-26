/**
 * Images and videos attached to shared use cases. Only a short allowlist of URL shapes is accepted:
 * direct https image links, YouTube and Vimeo. Videos embed through privacy-friendly players.
 * Anything else is refused, so a post (which may arrive from a share link) can't embed arbitrary pages.
 */
export interface Media {
  kind: 'image' | 'video';
  url: string;
  alt?: string;
  provider?: 'youtube' | 'vimeo';
}

const YT = [
  /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})(?:[&#].*)?$/,
  /^https?:\/\/youtu\.be\/([\w-]{11})(?:[?#].*)?$/,
  /^https?:\/\/(?:www\.)?youtube\.com\/(?:shorts|embed|live)\/([\w-]{11})(?:[?#/].*)?$/,
];
const VIMEO = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d{6,12})(?:[?#/].*)?$/;
const IMAGE = /^https:\/\/[^\s"'<>]+\.(?:jpe?g|png|webp|gif|avif)(?:\?[^\s"'<>]*)?$/i;

/** Turn what a user pasted into a Media item, or null if it isn't an accepted image or video link. */
export function parseMedia(raw: string, alt?: string): Media | null {
  const url = raw.trim();
  if (!url || url.length > 500) return null;
  for (const re of YT) {
    const m = re.exec(url);
    if (m) return { kind: 'video', provider: 'youtube', url: `https://www.youtube.com/watch?v=${m[1]}`, alt: alt?.slice(0, 200) || undefined };
  }
  const v = VIMEO.exec(url);
  if (v) return { kind: 'video', provider: 'vimeo', url: `https://vimeo.com/${v[1]}`, alt: alt?.slice(0, 200) || undefined };
  if (IMAGE.test(url)) return { kind: 'image', url, alt: alt?.slice(0, 200) || undefined };
  return null;
}

/** Embed address for a parsed video (youtube-nocookie and Vimeo's player with do-not-track). */
export function embedUrl(m: Media): string | null {
  if (m.kind !== 'video') return null;
  const parsed = parseMedia(m.url);
  if (!parsed || parsed.kind !== 'video') return null;
  if (parsed.provider === 'youtube') return `https://www.youtube-nocookie.com/embed/${parsed.url.split('v=')[1]}`;
  return `https://player.vimeo.com/video/${parsed.url.split('/').pop()}?dnt=1`;
}

/** Validate media that came from outside (share links, imported files). */
export function sanitizeMedia(x: unknown): Media | undefined {
  if (!x || typeof x !== 'object') return undefined;
  const o = x as Record<string, unknown>;
  if (typeof o.url !== 'string') return undefined;
  return parseMedia(o.url, typeof o.alt === 'string' ? o.alt : undefined) ?? undefined;
}
