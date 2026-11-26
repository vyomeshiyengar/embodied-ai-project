#!/usr/bin/env node
/**
 * Release check: fails if anything that must not go public is present.
 * - docs/research/interviews/ must not exist in the repo being published.
 * - Nothing in the app folder may reference interview notes or interview codes.
 * Works wherever the app folder sits (prototype/ here, chris-mvp/ in the team repo).
 * Run before making the repo public or handing it off. While the repo is private, a failure is expected.
 */
import fs from 'node:fs';
import path from 'node:path';
const app = path.resolve(new URL('..', import.meta.url).pathname);
const root = path.resolve(app, '..');
const problems = [];
if (fs.existsSync(path.join(root, 'docs/research/interviews'))) problems.push('docs/research/interviews/ still exists (remove it and scrub git history before publishing).');
const skip = new Set(['node_modules', 'dist', '.astro', 'test-results', 'scripts']);
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (skip.has(f.name)) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(astro|ts|mjs|js|yaml|json|css|html)$/.test(f.name) && !/package-lock/.test(f.name)) {
      const t = fs.readFileSync(p, 'utf8');
      if (t.includes('research/interviews')) problems.push(`${path.relative(root, p)} references the interview folder`);
      const m = t.match(/\b(?:GOV|COM|ROB|IND)-\d{2}\b/);
      if (m) problems.push(`${path.relative(root, p)} contains interview code ${m[0]}`);
    }
  }
};
walk(app);
if (problems.length) { console.error('Not ready to publish:\n- ' + problems.join('\n- ')); process.exit(1); }
console.log('check-public: OK');
