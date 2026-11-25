/**
 * Content schema for one department ("sector").
 *
 * To add a department:
 *   1. Copy `departments/_template.ts` to `departments/<your-id>.ts` and fill it in.
 *   2. Add one line to `departments/index.ts`.
 * Nothing in the UI needs to change: the 3D world, tables and map are all generated from this data.
 */

/** Visual setting for a zone tile in the 3D diorama. Controls the tile color and scenery props. */
export type ZoneSetting =
  | 'street'
  | 'sidewalk'
  | 'bikelane'
  | 'air'
  | 'hospital'
  | 'home'
  | 'care-home'
  | 'warehouse'
  | 'industrial'
  | 'park'
  | 'field'
  | 'plaza'
  | 'beach'
  | 'water'
  | 'trail'
  | 'network'
  | 'forest'
  | 'golf'
  | 'parking'
  | 'visitor-center';

/** Which 3D model represents a type. Add new ones in `components/world/models.tsx`. */
export type ModelKind =
  | 'sidewalk-robot'
  | 'hybrid-robot'
  | 'delivery-van'
  | 'drone'
  | 'drone-hub'
  | 'warehouse-robot'
  | 'humanoid'
  | 'quadruped'
  | 'mower'
  | 'line-painter'
  | 'patrol-robot'
  | 'boat'
  | 'sand-rover'
  | 'sensor-pole'
  | 'cleaning-robot'
  | 'hospital-cart'
  | 'surgical-robot'
  | 'telepresence'
  | 'uv-robot'
  | 'companion'
  | 'exoskeleton'
  | 'network-tower';

/** Where a zone sits in a 'landscape' world (world units; x = left/right, z = back/front). */
export interface ZoneArea {
  x: number;
  z: number;
  /** width (x) and depth (z) */
  w: number;
  d: number;
  shape?: 'rect' | 'ellipse';
}

export interface Zone {
  id: string;
  name: string;
  setting: ZoneSetting;
  /** Only used when types.layout is 'landscape'. */
  area?: ZoneArea;
}

export interface TypeItem {
  id: string;
  name: string;
  zoneId: string;
  model: ModelKind;
  howItOperates: string;
  examples: string;
  whatHappened: string;
}

export interface Risk {
  id: string;
  name: string;
  /** Who is impacted (general). */
  whoImpacted: string;
  /** Most vulnerable groups, shown highlighted. */
  mostVulnerable?: string;
  whatMakesWorse: string;
  realWorldCase?: string;
}

export interface BlackSwan {
  id: string;
  /** Short headline, e.g. "Hijacked delivery fleet". */
  name: string;
  /** How the future implementation could fail. */
  scenario: string;
  whoImpacted: string;
  mostVulnerable?: string;
  whatMakesWorse: string;
}

/** The three filter buckets for regulation. Laws can sit in more than one. */
export type AuthorityLevel = 'Federal' | 'State' | 'City' | 'International';

export interface Regulation {
  id: string;
  name: string;
  /** Authority as written in the source (e.g. "Federal (enforced via complaints, DOJ)"). */
  authority: string;
  levels: AuthorityLevel[];
  covers: string;
  fallsShort: string;
}

export interface Gap {
  title: string;
  detail: string;
}

export interface CaseLocation {
  label: string;
  lat: number;
  lng: number;
}

/** Optional long-form write-up shown in the case study's detail card. All fields are plain sentences. */
export interface CaseStudyDetail {
  /** e.g. "New York State: publicly funded AI companions" */
  title: string;
  deployed: string;
  whatHappened: string;
  impact: string;
  response: string;
  whatChanged: string;
}

export interface CaseStudy {
  id: string;
  place: string;
  response: string;
  note: string;
  locations: CaseLocation[];
  /** Full case study. Places with one get a "Full case study" marker on the map list. */
  detail?: CaseStudyDetail;
  /** Optional links into the Types / Regulation tabs (ids from this department). */
  relatedTypeIds?: string[];
  relatedRegulationIds?: string[];
}

export interface Department {
  id: string;
  /** Number used in your source docs (e.g. "05"). */
  number: string;
  name: string;
  /** One-paragraph framing shown under the department header. */
  intro: string;
  /** Accent color for this department (hex). */
  accent: string;
  types: {
    intro: string;
    /**
     * 'tiles' (default): each zone is its own square tile.
     * 'landscape': one continuous environment; every zone needs an `area`.
     */
    layout?: 'tiles' | 'landscape';
    /** Size of the landscape ground, [width, depth]. Defaults to [36, 28]. */
    ground?: [number, number];
    zones: Zone[];
    items: TypeItem[];
  };
  risks: { intro: string; current: Risk[]; blackSwans: BlackSwan[] };
  regulation: { intro: string; laws: Regulation[]; gaps: Gap[] };
  caseStudies: { intro: string; places: CaseStudy[] };
}
