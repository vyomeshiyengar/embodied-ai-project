/**
 * "Save" buttons on risks, types, rules and map places. Saved items show in MyEACP.
 * Markup: <button data-save data-save-key data-save-kind data-save-title data-save-href data-save-sector>
 * Signed out: the button asks you to sign in first.
 */
import { ws, CHANGE_EVENT, type Saved } from '../lib/workspace-store';
import { getSession, requestSignIn } from '../lib/demo-auth';

function sync(b: HTMLButtonElement) {
  const on = ws.isSaved(b.dataset.saveKey || '');
  b.setAttribute('aria-pressed', String(on));
  const label = b.querySelector('[data-save-label]');
  if (label) label.textContent = on ? 'Saved to MyEACP' : 'Save to MyEACP';
}

export function initSaveButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((b) => {
    sync(b);
    if (b.dataset.ready) return;
    b.dataset.ready = '1';
    b.addEventListener('click', () => {
      if (!getSession()) { requestSignIn(); return; }
      ws.toggleSaved({
        key: b.dataset.saveKey!, kind: (b.dataset.saveKind as Saved['kind']) || 'risk',
        title: b.dataset.saveTitle || '', href: b.dataset.saveHref || '/', sectorId: b.dataset.saveSector,
      });
    });
  });
}

window.addEventListener(CHANGE_EVENT, () => document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(sync));
