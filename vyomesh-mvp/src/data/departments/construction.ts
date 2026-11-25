import type { Department } from '../schema';

/**
 * Built from the team's working draft ("Research for Construction and public works").
 * Black swans, regulatory gaps and case studies have not been researched yet, so those
 * sections are left empty and the app shows a "not researched yet" note.
 */
const construction: Department = {
  id: 'construction',
  number: '06',
  name: 'Construction & Public Works',
  accent: '#d08a1e',
  intro:
    'Physical AI in construction and public works mostly operates on job sites: robots carry and survey materials, help workers lift heavy tools, inspect sites from the air, print structures and spot defects. The main governance questions are about worker safety around machines that share an open, changing site with people, and about rules that were written for factories rather than job sites.',

  types: {
    intro:
      'Five types are in use, mostly on construction sites and in public works. Cities use drones for surveying, bridge inspections, water main repairs and roadway construction, mainly because they save time, money and manpower. AI-powered route optimization that uses smart bin sensors also helps public works crews skip unnecessary collection passes, which cuts fuel use without reducing service.',
    layout: 'landscape',
    theme: 'city',
    ground: [36, 28],
    roads: [
      { from: [-18, 2.5], to: [18, 2.5], width: 2.2 },
      { from: [0, -14], to: [0, 14], width: 2.2 },
    ],
    zones: [
      { id: 'site-ground', name: 'Construction site (ground)', setting: 'construction-site', area: { x: -9, z: -6, w: 16, d: 9 } },
      { id: 'site-air', name: 'Airspace over the site', setting: 'air', area: { x: -12, z: -8, w: 5, d: 3 } },
      { id: 'structure', name: 'Building structure & work faces', setting: 'building-frame', area: { x: 9, z: -6, w: 15, d: 9 } },
      { id: 'printing', name: 'Public works & printed structures', setting: 'print-site', area: { x: -9, z: 8, w: 16, d: 6 } },
      { id: 'inspection', name: 'Roofs, structures & utilities', setting: 'utility', area: { x: 9, z: 8, w: 15, d: 6 } },
    ],
    items: [
      {
        id: 'amr',
        name: 'Autonomous mobile robots',
        zoneId: 'site-ground',
        model: 'site-carrier',
        howItOperates:
          'These robots carry, load and survey materials around a construction site. They build a digital map of the workspace through simultaneous localization and mapping (SLAM), use their sensors to work out where they are on that map, and plan the best path using AI and real-time data.',
        examples: 'They are used across construction sites for hauling, loading and site surveys.',
        whatHappened:
          'Moving and loading items by hand, and surveying a site manually, can be dangerous and time-consuming, so these robots save workers time and can let projects finish faster.',
      },
      {
        id: 'arms-exoskeletons',
        name: 'Robotic arms and exoskeletons',
        zoneId: 'structure',
        model: 'robot-arm',
        howItOperates:
          'Robotic arms help workers lift and balance heavy tools, and an exoskeleton controlled by a trained operator can move heavy rubble. Exoskeletons support the back for carrying and bending forward, the shoulders and arms for overhead drilling, fastening and panel installation, and the legs for long periods of stooping or sit-stand work.',
        examples: 'They are used on construction sites for heavy, repetitive and overhead work.',
        whatHappened:
          'They let workers repeat operations and use heavy portable tools for much longer without tiring, and they help prevent injuries and fatigue from repetitive strain or overexertion.',
      },
      {
        id: 'drones',
        name: 'Drones and UAVs',
        zoneId: 'site-air',
        model: 'drone',
        howItOperates:
          'Drones fly the site, usually along set routes, and capture images with cameras and LiDAR. The data is processed into stitched aerial maps, 3D models, terrain maps and cut-and-fill volume calculations, and software compares what the drone captured against the plans or earlier flights. Drones do not build or repair anything.',
        examples: 'Cities use drones for surveying, bridge inspections, water main repairs and roadway construction.',
        whatHappened:
          'Drones reach places that are risky or costly for people, navigate difficult terrain and reduce reliance on heavy machinery such as cranes, which saves time, money and manpower.',
      },
      {
        id: '3d-printing',
        name: '3D printing robots',
        zoneId: 'printing',
        model: 'printer-gantry',
        howItOperates:
          'These robots print concrete, and can be fitted with welders or used to stack bricks and rebar. They follow a digital model of the structure and work out where each layer goes, tracking their position against the plan. In multi-robot printing, a computer-designed map assigns sections to each robot, and precise positioning makes sure the joints between parts overlap.',
        examples: 'Cities have started using 3D printing robots for public works and construction.',
        whatHappened:
          'Printing makes many tedious tasks more automated. The robots follow a plan rather than reacting to surprises, and they need specially designed concrete because traditional mixes jam and damage the printer.',
      },
      {
        id: 'inspection-robots',
        name: 'AI-powered inspection robots',
        zoneId: 'inspection',
        model: 'quadruped',
        howItOperates:
          'These robots collect visual, thermal, acoustic or 3D data to spot defects and track progress, and they are built to evaluate structures, utilities and job sites.',
        examples: 'They are used in roofing, construction and public works.',
        whatHappened: 'They let crews find defects and track progress without sending people into risky spots.',
      },
    ],
  },

  risks: {
    intro:
      'According to the National Institute for Occupational Safety and Health, construction robots bring struck-by incidents, caught-in-between injuries, unexpected equipment movement, crushing hazards and dropped loads. Researchers recommend tracking early warning signs before injuries happen, such as near misses involving robots, emergency stop activations, unexpected equipment disengagements, sensor faults and unauthorized entry into robotic work areas.',
    current: [
      {
        id: 'robot-injuries',
        name: 'Injuries from working alongside robots',
        whoImpacted: 'Construction workers who work near or with robots are affected.',
        whatMakesWorse: 'As more workers use robots to support their work, the risk of injury rises.',
        realWorldCase:
          'An analysis of OSHA severe injury reports found 77 robot-related accidents between 2015 and 2022: 54 involved stationary robots and 23 involved mobile robots. Injuries included finger amputations and fractures in the legs and feet.',
      },
      {
        id: 'technology-failures',
        name: 'Technology failures',
        whoImpacted: 'Workers on site are affected.',
        whatMakesWorse:
          'Communication failures, sensor malfunctions, software changes and limits in obstacle detection make this worse (roofing contractor, 2026).',
      },
      {
        id: '3d-printing-hazards',
        name: '3D concrete printing hazards',
        whoImpacted: 'Workers around the printer are affected.',
        whatMakesWorse:
          'Normal construction hazards like being struck or caught still apply, and the new processes and materials may add new ones.',
      },
      {
        id: 'assembly-robots',
        name: 'Assembly robots (bricklaying, drywall, welding)',
        whoImpacted: 'Workers near assembly robots are affected.',
        whatMakesWorse: 'These robots may not know where workers are, which can cause collisions and crushing injuries.',
      },
      {
        id: 'drone-hazards',
        name: 'Drones and inspection robots',
        whoImpacted: 'Workers on site are affected.',
        whatMakesWorse: 'A drone can hit or distract a worker, who could then fall.',
      },
      {
        id: 'prefab',
        name: 'Prefab and modular construction',
        whoImpacted: 'Installation crews are affected.',
        whatMakesWorse: 'Moving big, heavy pieces by truck, crane and forklift raises struck-by and fall risks during installation.',
      },
      {
        id: 'exoskeletons',
        name: 'Exoskeletons',
        whoImpacted: 'Workers who wear exoskeletons are affected.',
        whatMakesWorse: "Powered versions aren't safe yet, and even passive ones can cause falls, strain or control problems.",
      },
      {
        id: 'demolition-robots',
        name: 'Demolition robots',
        whoImpacted: "Workers inside the machine's danger zone are affected.",
        whatMakesWorse: 'Workers inside the danger zone can be struck or crushed.',
      },
      {
        id: 'heavy-equipment',
        name: 'Automated heavy equipment',
        whoImpacted: 'Operators and workers around the equipment are affected.',
        whatMakesWorse: 'Software or sensor failures and poorly trained workers can lead to accidents.',
      },
    ],
    blackSwans: [],
  },

  regulation: {
    intro:
      'OSHA has no single construction robotics standard. Most of the rules that apply were written for factories or for other kinds of robots, so construction and public works robots fall between them.',
    laws: [
      {
        id: 'icc-1150',
        name: 'Building codes and permits for 3D printing (ICC 1150)',
        authority: 'Local building officials',
        levels: ['City'],
        covers:
          'A new standard, ICC 1150, was approved in July 2026 and sets rules for the materials, inspection and design of 3D-printed walls. Before that, builders had to use a special approval route because 3D printing was not in the building code.',
        fallsShort:
          'The standard covers the wall, not worker safety around the printer. Cities also have to adopt it, because local governments adopt and enforce building codes.',
      },
      {
        id: 'osha',
        name: 'Workplace safety (assembly, demolition and heavy equipment)',
        authority: 'Federal (OSHA)',
        levels: ['Federal'],
        covers:
          'OSHA has no specific standards for robotics and relies on general rules like machine safeguarding and lockout/tagout. ANSI and ISO standards act as guidance and are voluntary unless OSHA adopts them.',
        fallsShort:
          'ISO 10218 does not apply to non-industrial robots, including remote-controlled ones, so demolition robots may be left out. Most standards were written for factories, not open job sites.',
      },
      {
        id: 'faa',
        name: 'Drones (FAA Part 107; Part 108 pending)',
        authority: 'Federal (FAA)',
        levels: ['Federal'],
        covers:
          'Under Part 107, a drone pilot needs a remote pilot certificate or must be supervised by someone who has one, and flights beyond the pilot\'s line of sight generally need case-by-case waivers.',
        fallsShort:
          "The rule meant to replace waivers (Part 108) was under White House review with no publication date announced as of September 2026. The FAA's rules cover airspace, not a drone distracting a worker on a site.",
      },
      {
        id: 'sidewalk-traffic',
        name: 'Sidewalk and traffic rules (e.g., Florida, Texas)',
        authority: 'State, with limits on what cities can add',
        levels: ['State'],
        covers:
          'State laws for delivery robots say they must act like pedestrians and not unreasonably interfere with others, and Texas limits their speed to 10 mph in pedestrian areas.',
        fallsShort: 'These laws are written for delivery robots, and the research found none for construction or public works robots.',
      },
      {
        id: 'eu-machinery',
        name: 'EU Machinery Regulation 2023/1230',
        authority: 'EU, applying directly in all member states',
        levels: ['International'],
        covers:
          'The regulation sets health and safety requirements for designing and building machinery sold in the EU and replaces the older Machinery Directive. It also aims to cover new technologies such as autonomous mobile machinery (robots) and AI.',
        fallsShort: '',
      },
    ],
    gaps: [],
  },

  caseStudies: {
    intro: 'Case studies for construction and public works have not been researched yet.',
    places: [],
  },

  sources: [
    {
      title: 'Earnest GS, Trout DB, Liang C-J and Castleberry A (2026). Robotics and automation safety risks in construction. Front. Built Environ. 11:1653188',
      url: 'https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2025.1653188/full#T1',
    },
    { title: 'Ekso Bionics: How exoskeletons are changing the construction industry', url: 'https://eksobionics.com/how-exoskeletons-are-changing-the-construction-industry/' },
    { title: 'Mouser: Robotic exoskeletons', url: 'https://www.mouser.com/en/applications/robotic-exoskeletons/' },
    { title: 'Fly4Future: Drones in construction', url: 'https://fly4future.com/development-and-prototyping/drones-in-construction/' },
    { title: 'Cornell Chronicle: 3D printing robot enables sustainable construction (2022)', url: 'https://news.cornell.edu/stories/2022/05/3d-printing-robot-enables-sustainable-construction' },
  ],
};

export default construction;
