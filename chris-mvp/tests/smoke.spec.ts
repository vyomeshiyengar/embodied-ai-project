import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from './routes';

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

test('signed-in Share and MyEACP states pass axe', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.setItem('eacp-demo-session', JSON.stringify({ username: 'demo', signedInAt: new Date().toISOString() }));
    localStorage.setItem('eacp-workspace-v1', JSON.stringify({
      v: 1,
      profile: { city: { name: 'Pittsburgh', country: 'US', region: 'PA', lat: 40.44, lng: -80 }, department: 'Mobility', role: 'mobility', sectors: ['01'], createdAt: new Date().toISOString() },
      posts: [{ id: 'p-axe', kind: 'question', lat: 40.44, lng: -80, place: 'Pittsburgh, PA', sectorId: '01', text: 'Axe test question.', lesson: 'Axe test context.', outcomes: ['Trained responders'], by: { city: 'Pittsburgh', country: 'US', role: 'mobility' }, createdAt: new Date().toISOString(), mine: true, origin: 'local', seenIn: [], replies: [{ id: 'r1', text: 'Axe reply.', by: null, createdAt: new Date().toISOString(), mine: false }] }],
      saved: [{ key: 'risk:x', kind: 'risk', title: 'A saved risk', href: '/sectors/autonomous-mobility/risks/', sectorId: '01', savedAt: new Date().toISOString() }],
      techs: [{ id: 't1', name: 'Pilot', sectorId: '01', status: 'pilot' }], contacts: [{ id: 'c1', operator: 'Operator', role: 'Fleet desk', how: 'Desk line' }], seenResearch: [],
    }));
  });
  const check = async (label: string) => {
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${label} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  };
  await page.goto('/share/', { waitUntil: 'load' });
  await expect(page.locator('[data-composer]')).toBeVisible();
  await check('share step 1');
  await page.locator('#tab-feed').click();
  await expect(page.locator('.feed .post')).toHaveCount(1);
  await page.waitForTimeout(500); // let the panel finish sliding in
  await check('share feed');
  await page.goto('/myeacp/', { waitUntil: 'load' });
  for (const t of ['profile', 'contrib', 'city', 'saved', 'questions']) {
    await page.locator(`#tab-${t}`).click();
    await page.waitForTimeout(500);
    await check(`myeacp ${t}`);
  }
  for (const t of ['tech', 'contacts']) {
    await page.locator('#tab-city').click();
    await page.locator(`#tab-${t}`).click();
    await page.waitForTimeout(500);
    await check(`myeacp ${t}`);
  }
});
