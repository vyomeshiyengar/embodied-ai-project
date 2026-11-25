import type { Department } from '../schema';
import autonomousMobility from './autonomous-mobility';
import urbanLogistics from './urban-logistics';
import construction from './construction';
import parks from './parks';
import healthcare from './healthcare';

/**
 * All 10 sectors, in order. A sector with `department` set is live; the rest show as
 * "Coming soon" in the selector.
 * To add a department: create `<id>.ts` from `_template.ts`, import it, and set it on its sector below.
 */
export interface Sector {
  number: string;
  name: string;
  department?: Department;
}

export const SECTORS: Sector[] = [
  { number: '01', name: 'Autonomous Mobility', department: autonomousMobility },
  { number: '02', name: 'Public Safety & Emergency Response' },
  { number: '03', name: 'Infrastructure Inspection & Maintenance' },
  { number: '04', name: 'Sanitation & Waste Management' },
  { number: '05', name: 'Urban Logistics & Delivery', department: urbanLogistics },
  { number: '06', name: 'Construction & Public Works', department: construction },
  { number: '07', name: 'Environmental Monitoring' },
  { number: '08', name: 'Parks & Public Space', department: parks },
  { number: '09', name: 'Healthcare & Social Services', department: healthcare },
  { number: '10', name: 'Smart Buildings & Municipal Facilities' },
];

/** Live departments, in sector order. */
export const departments: Department[] = SECTORS.flatMap((s) => (s.department ? [s.department] : []));

export function getDepartment(id: string | undefined): Department | undefined {
  return departments.find((d) => d.id === id);
}
