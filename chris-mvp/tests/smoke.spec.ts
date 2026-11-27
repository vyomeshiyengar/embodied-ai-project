import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes, mapSettled } from './routes';

for (const route of routes().filter((r) => !/\/(cases|story|types)\/$/.test(r) && r !== '/explore/')) {
  test(`loads and passes axe: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    // City twins render the same markup in low-effects mode, which keeps CI's software GPU fast.
    const res = await page.goto(route.endsWith('/city/') ? `${route}?lowfx=1` : route, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
    // Check the settled page: entrance animations (the Welcome intro fades in) can catch colours mid-fade on slow CI.
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getComputedTiming().iterations === Infinity), undefined, { timeout: 10_000 });
    // Maps: check once the camera has settled and the markers are placed, as a person would see them.
    if (await page.locator('[data-gmap]').count()) await mapSettled(page);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('no page links to interview material or shows interview codes', async () => {
  // Every page is static HTML, so read the built files: same text as the browser shows, much faster on CI.
  const fs = await import('node:fs');
  const path = await import('node:path');
  for (const route of routes()) {
    const html = fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
    const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
    expect(text, route).not.toMatch(/\b(GOV|COM|ROB|IND)-\d{2}\b/);
    // Built from parts so the release check (scripts/check-public.mjs) doesn't flag this test itself.
    expect(html, route).not.toContain(['research', 'interviews'].join('/'));
  }
});

test('no slop patterns or old names in the source', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const files: string[] = [];
  const walk = (d: string) => fs.readdirSync(d, { withFileTypes: true }).forEach((f) => {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p); else if (/\.(astro|ts|css)$/.test(f.name)) files.push(p);
  });
  walk('src');
  const bad: string[] = [];
  for (const f of files) {
    const t = fs.readFileSync(f, 'utf8');
    if (/Rare &(amp;)? high-impact/.test(t)) bad.push(`${f}: "Rare & high-impact"`);
    if (/&rarr;|→/.test(t)) bad.push(`${f}: arrow`);
    if (/ · /.test(t)) bad.push(`${f}: interpunct`);
    if (/Black Swan/.test(t)) bad.push(`${f}: old name "Black Swan"`);
  }
  expect(bad).toEqual([]);
});
