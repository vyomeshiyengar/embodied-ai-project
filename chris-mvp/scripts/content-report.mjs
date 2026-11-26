#!/usr/bin/env node
/** Per-sector counts, unsourced items and open todos. Usage: npm run content:report [-- --todos] */
import fs from 'node:fs';
import YAML from 'yaml';
const dir = new URL('../src/content/sectors/', import.meta.url);
const showTodos = process.argv.includes('--todos');
const rows = [];
for (const f of fs.readdirSync(dir).sort()) {
  const d = YAML.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
  const items = [...d.types, ...d.risks, ...d.regulations.rules, ...d.case_studies, ...d.pins];
  const swans = d.risks.filter((r) => r.category === 'black_swan').length;
  rows.push({
    sector: `${d.id} ${d.short_name}`, status: d.status, as_of: d.as_of, types: d.types.length,
    likely: d.risks.length - swans, black_swan: swans, rules: d.regulations.rules.length, cases: d.case_studies.length,
    pins: d.pins.length, unsourced: items.filter((x) => !x.sources?.length).length,
    no_tech: d.risks.filter((r) => !r.all_types && !(r.type_ids || []).length).length,
    fact_check: items.filter((x) => x.unconfirmed?.length).length, todos: d.todos.length,
  });
  if (showTodos && d.todos.length) { console.log(`\n${d.id} ${d.name}`); d.todos.forEach((t) => console.log('  - ' + t)); }
}
console.table(rows);
