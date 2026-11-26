import type { Risk } from './content';
import { LEVEL_ORDER } from './content';
const v = (l: Risk['severity']) => (l ? LEVEL_ORDER[l] : 0);
/** Highest severity first, then likelihood; stable otherwise. */
export const byConcern = (a: Risk, b: Risk) => v(b.severity) - v(a.severity) || v(b.likelihood) - v(a.likelihood);
