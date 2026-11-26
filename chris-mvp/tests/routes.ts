import fs from 'node:fs';
import path from 'node:path';
/** Every built page, from dist/. Run `npm run build` first. */
export function routes(): string[] {
  const dist = path.resolve('dist');
  const out: string[] = [];
  const walk = (d: string) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name === 'index.html') out.push('/' + path.relative(dist, d).split(path.sep).join('/') + (d === dist ? '' : '/'));
    }
  };
  walk(dist);
  return out.map((r) => r.replace(/^\/\/?/, '/')).sort();
}
