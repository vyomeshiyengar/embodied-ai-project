/**
 * Share links: a post travels inside the link itself (compressed JSON in the URL fragment).
 * The fragment never reaches a server. Opening the link shows the post and offers "Add to my map".
 * Anything decoded from a link is untrusted: it goes through sanitizePost and is rendered as text only.
 */
import { sanitizePost, type Post } from './workspace-store';

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

/** What goes in a link: the post without device-only fields. */
function portable(p: Post) {
  const { mine: _m, origin: _o, localMediaId: _l, localMediaAlt: _la, ...rest } = p;
  return { ...rest, replies: p.replies.map(({ mine: _x, ...r }) => r) };
}

export async function encodePost(p: Post): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(portable(p)));
  if (typeof CompressionStream === 'undefined') return 'j' + b64url(json);
  return 'z' + b64url(await pipe(json, new CompressionStream('deflate-raw')));
}

export async function decodePost(code: string): Promise<Post | null> {
  try {
    if (code.length > 20000) return null;
    const body = fromB64url(code.slice(1));
    const bytes = code[0] === 'z' ? await pipe(body, new DecompressionStream('deflate-raw')) : code[0] === 'j' ? body : null;
    if (!bytes || bytes.length > 50000) return null;
    return sanitizePost(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

/** Full share URL for a post, pointing at the Share page's "From other cities" view. */
export async function shareUrl(p: Post, base: string): Promise<string> {
  return `${location.origin}${base}#p=${await encodePost(p)}`;
}

export function codeFromHash(hash = location.hash): string | null {
  const m = /[#&]p=([A-Za-z0-9_-]+)/.exec(hash);
  return m ? m[1] : null;
}
