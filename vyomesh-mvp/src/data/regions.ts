/** Map regions for the case-study view. A pin's region is the first whose bounds contain it. */
export interface Region {
  id: string;
  name: string;
  /** [west, south, east, north] in degrees */
  bounds: [number, number, number, number];
}

export const REGIONS: Region[] = [
  { id: 'na', name: 'North America', bounds: [-170, 10, -50, 72] },
  { id: 'europe', name: 'Europe', bounds: [-25, 34, 45, 72] },
  { id: 'asia', name: 'Asia-Pacific', bounds: [60, -50, 180, 60] },
  { id: 'other', name: 'Rest of world', bounds: [-180, -90, 180, 90] },
];

export function regionOf(lat: number, lng: number): string {
  return REGIONS.find((r) => lng >= r.bounds[0] && lng <= r.bounds[2] && lat >= r.bounds[1] && lat <= r.bounds[3])!.id;
}
