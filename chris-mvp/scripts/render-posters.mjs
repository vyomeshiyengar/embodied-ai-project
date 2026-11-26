#!/usr/bin/env node
/**
 * Render the Welcome backdrop still into public/posters/ (used with reduced motion or no WebGL).
 * Needs a running preview server: npm run build && npm run preview, then `node scripts/render-posters.mjs`.
 * Uses Playwright's Chromium with software WebGL.
 */
import { chromium } from 'playwright';
const base = process.env.BASE_URL || 'http://localhost:4321';
const out = new URL('../public/posters/', import.meta.url).pathname;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// Welcome backdrop still (used when motion is reduced or WebGL is unavailable).
const w = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await w.goto(`${base}/`, { waitUntil: 'load' });
await w.addStyleTag({ content: '.center,.dim,.pause{visibility:hidden!important}' });
await w.waitForTimeout(4000);
await w.locator('[data-welcome] .backdrop').screenshot({ path: out + 'welcome.png' });
console.log('wrote welcome.png');
await browser.close();
