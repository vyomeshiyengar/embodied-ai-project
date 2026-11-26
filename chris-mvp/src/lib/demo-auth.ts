/**
 * Demo sign-in (client side only). NOT SECURITY: the credentials in site.ts ship to every browser.
 * It only unlocks the demo's Share page, saving and MyEACP. No personal data is collected or stored.
 */
import { DEMO_LOGIN } from './site';

const KEY = 'eacp-demo-session';
export interface DemoSession { username: string; signedInAt: string }

export function getSession(): DemoSession | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function signIn(username: string, password: string): boolean {
  if (username.trim() !== DEMO_LOGIN.username || password !== DEMO_LOGIN.password) return false;
  const s: DemoSession = { username: DEMO_LOGIN.username, signedInAt: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent('eacp-auth-change'));
  return true;
}
export function signOut() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('eacp-auth-change'));
}
/** Ask the page to open the demo sign-in dialog. */
export function requestSignIn() {
  window.dispatchEvent(new CustomEvent('eacp-signin-request'));
}
