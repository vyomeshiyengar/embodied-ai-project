/**
 * TEMPLATE — copy to `<department-id>.ts`, fill in, then register it in `index.ts`.
 * The example values below are fictional placeholders, not real data.
 *
 * Tips
 *  - `zones[].setting` picks the tile look in the 3D world (see ZoneSetting in ../schema.ts).
 *  - `items[].model` picks the 3D model (see ModelKind). Reuse an existing one if nothing fits.
 *  - `regulation.laws[].levels` drives the Federal / State / City filter.
 *  - Case study `locations` take lat/lng; one study can have several pins.
 *  - Case study `detail` is optional: add it for a full write-up (deployed, what happened, impact, response, what changed, lesson).
 */
import type { Department } from '../schema';

const department: Department = {
  id: 'example-department',
  number: '00',
  name: 'Example Department (fictional)',
  accent: '#3b5ba5',
  intro: 'One paragraph framing where governance questions arise in this sector.',
  types: {
    intro: 'How many types exist and which are most mature.',
    zones: [{ id: 'streets', name: 'Streets', setting: 'street' }],
    items: [
      {
        id: 'example-type',
        name: 'Example robot type',
        zoneId: 'streets',
        model: 'sidewalk-robot',
        howItOperates: 'How it operates in the city.',
        examples: 'Vendor (City)',
        whatHappened: 'What happened when adopted.',
      },
    ],
  },
  risks: {
    intro: 'Who bears the most likely harm, and where worst-case harm comes from.',
    current: [
      {
        id: 'example-risk',
        name: 'Example risk',
        whoImpacted: 'Who is impacted',
        mostVulnerable: 'Most vulnerable group',
        whatMakesWorse: 'What could make it worse',
        realWorldCase: 'Real-world case',
      },
    ],
    blackSwans: [
      {
        id: 'example-black-swan',
        name: 'Example black swan',
        scenario: 'Future implementation and how it could fail.',
        whoImpacted: 'Who is impacted',
        mostVulnerable: 'Most vulnerable',
        whatMakesWorse: 'What could make it worse',
      },
    ],
  },
  regulation: {
    intro: 'Who holds the levers in this sector.',
    laws: [
      {
        id: 'example-law',
        name: 'Example law',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'What it covers',
        fallsShort: 'Where it falls short for this technology',
      },
    ],
    gaps: [{ title: 'Example gap', detail: 'What nothing currently covers.' }],
  },
  caseStudies: {
    intro: 'The clearest pattern across places.',
    places: [
      {
        id: 'example-place',
        place: 'Example City',
        response: 'Pilot',
        note: 'Short note',
        locations: [{ label: 'Example City', lat: 40, lng: -100 }],
        // Optional full write-up; omit for a short entry.
        detail: {
          title: 'Example City: what was deployed',
          deployed: 'What was deployed, where and since when.',
          whatHappened: 'Results, with the source in parentheses.',
          impact: 'Impact on the community.',
          response: 'How the government responded.',
          whatChanged: 'What changed afterwards.',
          lesson: 'The lesson for other cities.',
        },
      },
    ],
  },
};

export default department;
