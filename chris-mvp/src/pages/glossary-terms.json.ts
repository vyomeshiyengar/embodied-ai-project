/** Glossary terms for hover definitions, fetched once per visit by src/scripts/glossary-hover.ts. */
import { glossaryEntries } from '../lib/glossary';
export function GET() {
  return new Response(JSON.stringify(glossaryEntries()), { headers: { 'content-type': 'application/json' } });
}
