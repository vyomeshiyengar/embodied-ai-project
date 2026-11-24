import type { Department } from '../schema';
import urbanLogistics from './urban-logistics';
import parks from './parks';
import healthcare from './healthcare';

/**
 * Department registry. Order here = order of the selector pills.
 * To add a department: create `<id>.ts` from `_template.ts`, import it, add it to this array.
 */
export const departments: Department[] = [urbanLogistics, parks, healthcare];

export function getDepartment(id: string | undefined): Department | undefined {
  return departments.find((d) => d.id === id);
}
