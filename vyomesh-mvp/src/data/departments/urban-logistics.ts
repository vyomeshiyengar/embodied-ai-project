import type { Department } from '../schema';

const urbanLogistics: Department = {
  id: 'urban-logistics',
  number: '05',
  name: 'Urban Logistics & Delivery',
  accent: '#2f7d78',
  intro:
    'Physical AI is already operating at commercial scale in this space. The governance questions that matter happen in three instances: where delivery robots use shared public space for private commercial trips (sidewalks, curb ramps, bike lanes, low airspace), where state law limits what cities can do, and where robots cross paths with emergency response.',

  types: {
    intro:
      'Nine types are in use, from sidewalks to low airspace to the warehouse floor. The most visible are sidewalk delivery robots: Serve Robotics alone ended Q1 2026 with ~2,050 robots across 44 cities in 14 states. Drone delivery networks are scaling fastest in China.',
    zones: [
      { id: 'sidewalks', name: 'Sidewalks & crosswalks', setting: 'sidewalk' },
      { id: 'bike-lanes', name: 'Bike lanes & road shoulders', setting: 'bikelane' },
      { id: 'streets', name: 'Streets', setting: 'street' },
      { id: 'air-suburbs', name: 'Low airspace (suburbs)', setting: 'air' },
      { id: 'air-dense', name: 'Low airspace (dense cities)', setting: 'air' },
      { id: 'warehouses', name: 'Warehouses & distribution centers', setting: 'warehouse' },
      { id: 'dc-night', name: 'Distribution centers (night shift)', setting: 'warehouse' },
      { id: 'industrial', name: 'Industrial sites, cold storage, receiving docks', setting: 'industrial' },
      { id: 'network', name: 'Network layer', setting: 'network' },
    ],
    items: [
      {
        id: 'sidewalk-robots',
        name: 'Sidewalk delivery robots',
        zoneId: 'sidewalks',
        model: 'sidewalk-robot',
        howItOperates:
          'Cooler-sized wheeled robots carry food and groceries at ~4–6 mph; remote operators supervise several at once and take over at hard spots.',
        examples:
          'Serve (LA, Chicago, Miami, Atlanta, DFW), Coco (LA, Chicago, Miami, Jersey City), Avride (Jersey City), Starship (UK, Finland, Estonia, US campuses)',
        whatHappened:
          'Starship passed 10M deliveries in 8 countries; Chicago residents petitioned to pause robots after crashes and blocked sidewalks.',
      },
      {
        id: 'hybrid-robots',
        name: 'Faster hybrid delivery robots',
        zoneId: 'bike-lanes',
        model: 'hybrid-robot',
        howItOperates: 'Robots that move between sidewalks, bike lanes and roads at up to ~20 mph.',
        examples: 'DoorDash Dot (Fremont, CA, from Mar 2026); Tennessee law allows bike-lane use from Jul 2026',
        whatHappened:
          'New conflict zone with cyclists; a Jersey City cyclist was injured by a sidewalk robot in a bike lane (Oct 2025).',
      },
      {
        id: 'road-av',
        name: 'Road-going autonomous delivery vehicles',
        zoneId: 'streets',
        model: 'delivery-van',
        howItOperates: 'Small occupant-less electric vehicles drive on public roads; remote monitoring.',
        examples: 'Nuro R2 (Houston)',
        whatHappened:
          'First NHTSA exemption for a vehicle with no human controls (2020), capped at 5,000 vehicles over two years.',
      },
      {
        id: 'delivery-drones',
        name: 'Delivery drones',
        zoneId: 'air-suburbs',
        model: 'drone',
        howItOperates: 'Drones fly from store or hub "nests" and drop or lower packages to yards.',
        examples: 'Wing, Zipline, Amazon Prime Air (DFW, Phoenix area)',
        whatHappened: 'Two Amazon drones hit a crane in Tolleson, AZ (Oct 2025); noise backlash in Richardson, TX.',
      },
      {
        id: 'urban-drone-networks',
        name: 'Urban drone networks & lockers',
        zoneId: 'air-dense',
        model: 'drone-hub',
        howItOperates: 'Drones fly fixed routes between rooftop or small transfer hubs and smart lockers.',
        examples: 'Meituan (Shenzhen, Shanghai West Bund); SF Express (Shenzhen)',
        whatHappened: "Meituan's network went commercial in May 2026; Shenzhen runs 300+ low-altitude logistics routes.",
      },
      {
        id: 'warehouse-robots',
        name: 'Mobile robots and robot arms',
        zoneId: 'warehouses',
        model: 'warehouse-robot',
        howItOperates: 'Shelf-moving robots, picking arms and sorters coordinated by warehouse software.',
        examples: 'Amazon, SF Express, GXO (with humanoid pilots)',
        whatHappened: 'Makes overnight, 24/7 operation possible; little hard data published in vendor sources.',
      },
      {
        id: 'humanoid-sorting',
        name: 'Humanoid sorting robots',
        zoneId: 'dc-night',
        model: 'humanoid',
        howItOperates: 'Bipedal robots with arms and vision sort parcels overnight, reporting to morning staff.',
        examples: 'Shenzhen distribution centers (from Nov 2026)',
        whatHappened:
          'Reported 35% faster night processing after 40% overnight vacancy rates (figures from one unverified article).',
      },
      {
        id: 'inspection-robots',
        name: 'Inspection & inventory robots',
        zoneId: 'industrial',
        model: 'quadruped',
        howItOperates:
          'Quadrupeds and humanoids count stock, photograph goods and inspect equipment, feeding enterprise systems.',
        examples: 'ANYbotics, Humanoid (via SAP integrations)',
        whatHappened: 'Vendor-described use cases; no named customers or results.',
      },
      {
        id: 'low-altitude-network',
        name: 'Low-altitude economy networks',
        zoneId: 'network',
        model: 'network-tower',
        howItOperates: 'Shared air traffic management, charging and landing sites for drones under 1,000 m.',
        examples: "China's national low-altitude economy policy; Shenzhen's 1,200 planned landing sites",
        whatHappened:
          'Research flags unreliable links, energy limits and the need for "auditable" autonomy in controlled airspace.',
      },
    ],
  },

  risks: {
    intro:
      'The most likely harm lands on the people with the least power to opt out: pedestrians, cyclists and disabled residents, who get no say in where the robots go. The worst-case harms come from fleets and networks that could do mass harm at once.',
    current: [
      {
        id: 'collisions',
        name: 'Collisions with cyclists & pedestrians',
        whoImpacted: 'Pedestrians, cyclists, couriers, remote operators',
        mostVulnerable: 'Cyclists, older adults, children, blind people',
        whatMakesWorse:
          'Heavier and faster robots (Pennsylvania allows 550 lb at 12 mph on sidewalks); bike-lane access',
        realWorldCase:
          'Jersey City, Oct 2025: a robot darted into a bike lane; the cyclist suffered a concussion and broken clavicle, and bystanders had to stop the robot. A 2021 study logged 40 dangerous near-misses in five days on one campus.',
      },
      {
        id: 'accessibility',
        name: 'Accessibility blockage: robots in curb ramps, narrow sidewalks, crosswalks',
        whoImpacted: 'Pedestrians, people with mobility aids, parents with strollers',
        mostVulnerable: 'Wheelchair users, blind and low-vision people',
        whatMakesWorse: 'Fleet growth on already narrow sidewalks; snow and construction',
        realWorldCase:
          'Toronto banned sidewalk robots in Dec 2021 after its Accessibility Advisory Committee called them a new disability barrier.',
      },
      {
        id: 'accountability',
        name: 'Unclear accountability after crashes',
        whoImpacted: 'Injured people, insurers, city 311 staff',
        mostVulnerable: 'People without lawyers or insurance',
        whatMakesWorse:
          "Platform–vendor–merchant contracts that shift liability; robots that don't stop after contact",
        realWorldCase:
          'The Jersey City cyclist is suing both Uber and Avride; his lawyer says residents are "unwitting crash test dummies."',
      },
      {
        id: 'congestion',
        name: 'Sidewalk congestion & property damage',
        whoImpacted: 'Pedestrians, transit riders, businesses',
        mostVulnerable: 'People waiting at bus stops',
        whatMakesWorse: 'Software changes rolled out fleet-wide; more operators per block',
        realWorldCase:
          'Chicago, Mar 2026: two robots damaged CTA bus shelters; the city created a dedicated 311 category for robot complaints.',
      },
      {
        id: 'emergency-interference',
        name: 'Interference with police & emergency response',
        whoImpacted: 'Police, EMS, firefighters',
        mostVulnerable: 'People at emergency scenes',
        whatMakesWorse: "Remote operators following bystanders' cues; no responder override",
        realWorldCase:
          'LA, Sept 2022: a delivery robot crossed police tape at a suspected school shooting after a bystander lifted it; a human operator made the call.',
      },
      {
        id: 'surveillance',
        name: 'Surveillance: every robot and drone is a moving camera',
        whoImpacted: 'All passersby, residents under drone routes',
        mostVulnerable: 'People avoiding police contact',
        whatMakesWorse: 'Footage shared with police or used for AI training; no retention limits',
        realWorldCase: 'Chicago residents raised surveillance alongside safety and job loss.',
      },
      {
        id: 'drone-noise',
        name: 'Drone noise & privacy',
        whoImpacted: 'Residents under routes and near hubs',
        mostVulnerable: 'Wildlife',
        whatMakesWorse: 'More operators; federal preemption of city rules',
        realWorldCase: 'Richardson, TX residents logged a drone every few minutes; the city had few legal tools.',
      },
      {
        id: 'unequal-burden',
        name: 'Unequal burden: robots go where profitable while others bear the sidewalk cost',
        whoImpacted: 'Neighborhood residents, small merchants',
        mostVulnerable: 'Dense, walkable neighborhoods without a vote on deployment',
        whatMakesWorse: 'City-wide pilots approved without ward input',
        realWorldCase:
          'Chicago Ald. Daniel La Spata blocked expansion in his ward after 83% of survey respondents opposed it.',
      },
    ],
    blackSwans: [
      {
        id: 'essential-infrastructure',
        name: 'Robots become essential-goods infrastructure',
        scenario:
          'After the courier workforce shrinks, homebound residents depend on robot and drone delivery for groceries and prescriptions. A fleet-wide outage, regulatory grounding or storm cuts deliveries for days.',
        whoImpacted: 'Homebound residents, pharmacies, grocers, social services',
        mostVulnerable: "Older and disabled residents who can't shop in person",
        whatMakesWorse: 'Couriers pushed out of the market; one or two dominant fleets',
      },
      {
        id: 'central-dispatch',
        name: 'Citywide central dispatch at scale',
        scenario:
          'Thousands of robots in one city run on one routing system. A bad update sends them into the same crosswalks, freezes them in intersections or blocks emergency routes across the city.',
        whoImpacted: 'Pedestrians, drivers, transit, EMS',
        mostVulnerable: 'People who need the blocked route: patients, wheelchair users',
        whatMakesWorse: 'Fleets of thousands per city; updates pushed fleet-wide at once',
      },
      {
        id: 'hijacked-fleet',
        name: 'Hijacked delivery fleet',
        scenario:
          'Robots or drones with cloud links and remote updates are hacked to block streets, steal cargo, carry dangerous payloads or surveil neighborhoods.',
        whoImpacted: 'Everyone on the route, police, operators',
        mostVulnerable: 'Pedestrians and residents near hijacked units',
        whatMakesWorse: 'Shared low-altitude traffic networks; weak device security',
      },
      {
        id: 'drone-corridors',
        name: 'Dense urban drone corridors',
        scenario:
          'Part 108 or "low-altitude economy" rules open busy corridors over downtowns. A drone hits a medical helicopter or falls into a crowd.',
        whoImpacted: 'Residents, event crowds, air-ambulance crews',
        mostVulnerable: 'Crowds, construction workers, aircrews',
        whatMakesWorse: 'Temporary obstacles missing from maps; more operators per corridor',
      },
      {
        id: 'lights-out-hubs',
        name: 'Lights-out robot hubs in neighborhoods',
        scenario:
          'Unstaffed micro-hubs and humanoid night-sort centers sit next to housing. A battery fire at a charging bank starts overnight with no one on site and spreads.',
        whoImpacted: 'Neighbors, firefighters, building owners',
        mostVulnerable: 'Residents of adjacent housing',
        whatMakesWorse: 'Hundreds of lithium batteries per site; no fire-code category for robot charging hubs',
      },
      {
        id: 'hybrid-bike-lanes',
        name: 'High-speed hybrid robots in bike lanes',
        scenario:
          '20-mph robots that switch between sidewalks, bike lanes and roads scale up. A shared perception flaw causes a string of cyclist injuries that goes unnoticed because nothing requires reporting.',
        whoImpacted: 'Cyclists, pedestrians, couriers',
        mostVulnerable: 'Cyclists, children on bikes',
        whatMakesWorse: 'State laws opening bike lanes; no public incident reporting',
      },
    ],
  },

  regulation: {
    intro:
      'In the US, states, not cities, set most of the rules for sidewalk robots. More than 30 states now have personal delivery device (PDD) laws, and many give robots pedestrian rights and limit what cities can do; Pennsylvania\'s law says a PDD "shall be regulated as a pedestrian" and allows 550-lb robots at up to 12 mph on sidewalks. Cities keep their strongest tools only where the state leaves room: permits, pilot zones and right-of-way rules.',
    laws: [
      {
        id: 'state-pdd',
        name: 'State PDD laws (30+ states; e.g., Pennsylvania Act 106 of 2020, Virginia, Florida, Tennessee 2026)',
        authority: 'State',
        levels: ['State'],
        covers: 'Size, weight, speed, where robots may operate, insurance, yield-to-pedestrians rules',
        fallsShort:
          "Limits vary widely (Washington's 120-lb cap vs. Pennsylvania's 550 lb); many restrict local bans; few require incident reporting or accessibility standards",
      },
      {
        id: 'city-row',
        name: 'City sidewalk & right-of-way ordinances and pilot permits (e.g., San Francisco 2017; Chicago PDD pilot 2022)',
        authority: 'City (where states allow)',
        levels: ['City'],
        covers:
          'San Francisco capped robots at 9 citywide, 3 mph, industrial areas, with human chaperones; Chicago runs a pilot overseen by its consumer protection and transportation departments',
        fallsShort: 'Pilots often lack public metrics; complaint data sits with 311, not the permit',
      },
      {
        id: 'local-bans',
        name: 'Outright local bans (Toronto 2021; Ottawa)',
        authority: 'City',
        levels: ['City'],
        covers: 'Toronto bans robots on sidewalks and cycle tracks pending provincial rules',
        fallsShort: 'Protects access but leaves no path to a safe, regulated version',
      },
      {
        id: 'nhtsa',
        name: 'NHTSA vehicle safety standards & exemptions',
        authority: 'Federal',
        levels: ['Federal'],
        covers:
          "Road vehicles; Nuro's R2 got the first exemption for a vehicle with no human controls, with reporting duties",
        fallsShort: 'Sidewalk robots fall outside; exemptions are case-by-case',
      },
      {
        id: 'state-av',
        name: 'State AV laws & DMV permits',
        authority: 'State',
        levels: ['State'],
        covers: 'Road-going autonomous vehicles',
        fallsShort: 'Hybrid robots that switch between sidewalk, bike lane and road fall between PDD and AV rules',
      },
      {
        id: 'faa',
        name: 'FAA rules (Part 107 waivers; Part 108 BVLOS pending)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Drone certification, operations, routes',
        fallsShort:
          "Cities can't regulate flight paths or noise; Part 108 still at White House review as of Nov 2026; Texas bars city drone ordinances",
      },
      {
        id: 'drone-zoning',
        name: 'City zoning for drone hubs',
        authority: 'City',
        levels: ['City'],
        covers: 'Where nests and launch pads can go',
        fallsShort: 'Hard to revisit after approval (Richardson, TX)',
      },
      {
        id: 'ada',
        name: 'ADA Title II & III',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Accessible public right-of-way and services',
        fallsShort:
          'No technical rule keeping robots out of curb ramps or setting minimum clear sidewalk width with robots present',
      },
      {
        id: 'tort',
        name: 'Tort & product liability',
        authority: 'State',
        levels: ['State'],
        covers: 'Injury claims',
        fallsShort:
          'Liability split across platform, robot maker, merchant and remote operator; robots may not stop or identify themselves after a crash',
      },
      {
        id: 'labor',
        name: 'Labor & employment law (incl. app-based worker pay rules)',
        authority: 'State / City',
        levels: ['State', 'City'],
        covers: 'Courier pay and conditions',
        fallsShort: "Doesn't address robot substitution or remote-operator working conditions",
      },
      {
        id: 'privacy',
        name: 'Privacy law (state consumer privacy, wiretap and biometric laws)',
        authority: 'State',
        levels: ['State'],
        covers: 'Data collection and use',
        fallsShort: 'Continuous public-space video is lightly regulated; no rules on footage retention or police access',
      },
      {
        id: 'china-low-altitude',
        name: "China's low-altitude economy policy & Shenzhen regulations",
        authority: 'National / City (China)',
        levels: ['International'],
        covers: 'Dedicated drone corridors, landing sites, operator training',
        fallsShort: 'A comparison point: cities plan the airspace as infrastructure rather than reacting to it',
      },
    ],
    gaps: [
      {
        title: 'Incident reporting',
        detail: 'No US rule requires sidewalk-robot operators to report collisions or near-misses publicly.',
      },
      {
        title: 'Stop-and-identify duty',
        detail: 'Nothing requires a robot to stop after contact and display who operates it.',
      },
      {
        title: 'Accessibility standards',
        detail: "There's no rule for robots at curb ramps, for clear sidewalk width, or for crosswalk behavior.",
      },
      {
        title: 'Responder override',
        detail: "There's no standard that lets police, fire or EMS stop or move a robot at a scene.",
      },
      {
        title: 'Hybrid robots',
        detail: 'Robots that move between sidewalks, bike lanes and roads fall between PDD and AV laws.',
      },
      {
        title: 'Density and curb management',
        detail:
          'There are no caps tied to sidewalk width or pedestrian volume, and no fees for commercial use of public sidewalks.',
      },
      {
        title: 'Data rules',
        detail: 'Nothing governs retention, police access or AI training for footage collected in public.',
      },
      {
        title: 'Labor transition',
        detail: "There's no plan for couriers and remote operators as fleets grow.",
      },
    ],
  },

  caseStudies: {
    intro:
      'Cities currently respond in one of three ways: permissive state law with weak city levers (most US states), local pilots that turn contentious (Chicago, Jersey City), or bans (Toronto, early San Francisco). Places that planned infrastructure first (Milton Keynes, Shenzhen) report the smoothest rollouts.',
    places: [
      {
        id: 'chicago',
        place: 'Chicago, IL',
        response: 'Pilot under pressure',
        note: 'PDD pilot since 2022; Coco (2024) and Serve (2025); 3,700+ signatures to end it; dedicated 311 category',
        locations: [{ label: 'Chicago', lat: 41.88, lng: -87.63 }],
        relatedTypeIds: ['sidewalk-robots'],
        relatedRegulationIds: ['city-row'],
      },
      {
        id: 'jersey-city',
        place: 'Jersey City, NJ',
        response: 'Pilot',
        note: 'First East Coast Uber Eats robot service (Feb 2025); cyclist injury lawsuit (2026)',
        locations: [{ label: 'Jersey City', lat: 40.72, lng: -74.08 }],
        relatedTypeIds: ['sidewalk-robots', 'hybrid-robots'],
        relatedRegulationIds: ['tort'],
      },
      {
        id: 'los-angeles',
        place: 'Los Angeles, CA',
        response: 'Largest US market',
        note: 'Serve and Coco fleets; 2022 crime-scene incident',
        locations: [{ label: 'Los Angeles', lat: 34.05, lng: -118.24 }],
        relatedTypeIds: ['sidewalk-robots'],
      },
      {
        id: 'toronto-ottawa',
        place: 'Toronto & Ottawa, ON',
        response: 'Ban',
        note: "Toronto banned sidewalk and cycle-track robots in Dec 2021; Ottawa told businesses robots aren't allowed",
        locations: [
          { label: 'Toronto', lat: 43.65, lng: -79.38 },
          { label: 'Ottawa', lat: 45.42, lng: -75.7 },
        ],
        relatedRegulationIds: ['local-bans'],
      },
      {
        id: 'san-francisco',
        place: 'San Francisco, CA',
        response: 'Restrictive permits',
        note: '2017 ordinance: 9 robots citywide, 3 mph, industrial zones, chaperones',
        locations: [{ label: 'San Francisco', lat: 37.77, lng: -122.42 }],
        relatedRegulationIds: ['city-row'],
      },
      {
        id: 'pennsylvania',
        place: 'Pennsylvania (statewide)',
        response: 'Permissive state law',
        note: 'Robots classed as pedestrians; 550 lb, 12 mph on sidewalks',
        locations: [{ label: 'Pennsylvania', lat: 40.9, lng: -77.8 }],
        relatedRegulationIds: ['state-pdd'],
      },
      {
        id: 'tennessee',
        place: 'Tennessee (statewide)',
        response: 'Expanded access',
        note: 'Robots allowed in bike lanes, road shoulders and parking lots from Jul 2026',
        locations: [{ label: 'Tennessee', lat: 35.86, lng: -86.66 }],
        relatedTypeIds: ['hybrid-robots'],
        relatedRegulationIds: ['state-pdd'],
      },
      {
        id: 'fremont',
        place: 'Fremont, CA',
        response: 'New vehicle type',
        note: 'DoorDash Dot, up to 20 mph across roads, bike lanes and sidewalks (Mar 2026)',
        locations: [{ label: 'Fremont', lat: 37.55, lng: -121.99 }],
        relatedTypeIds: ['hybrid-robots'],
        relatedRegulationIds: ['state-av'],
      },
      {
        id: 'houston',
        place: 'Houston, TX',
        response: 'Federal exemption',
        note: 'Nuro R2 occupant-less delivery vehicles',
        locations: [{ label: 'Houston', lat: 29.76, lng: -95.37 }],
        relatedTypeIds: ['road-av'],
        relatedRegulationIds: ['nhtsa'],
      },
      {
        id: 'drone-tx-az',
        place: 'Tolleson (AZ), College Station & Waco (TX), DFW',
        response: 'Drone delivery',
        note: 'Amazon, Wing, Zipline; crashes and noise complaints',
        locations: [
          { label: 'Tolleson', lat: 33.45, lng: -112.26 },
          { label: 'College Station', lat: 30.63, lng: -96.33 },
          { label: 'Waco', lat: 31.55, lng: -97.15 },
          { label: 'DFW', lat: 32.9, lng: -97.04 },
        ],
        relatedTypeIds: ['delivery-drones'],
        relatedRegulationIds: ['faa', 'drone-zoning'],
      },
      {
        id: 'shenzhen-shanghai',
        place: 'Shenzhen & Shanghai, China',
        response: 'Planned airspace',
        note: 'Meituan drone networks; 300+ Shenzhen logistics routes; humanoid night sorting',
        locations: [
          { label: 'Shenzhen', lat: 22.54, lng: 114.06 },
          { label: 'Shanghai', lat: 31.23, lng: 121.47 },
        ],
        relatedTypeIds: ['urban-drone-networks', 'humanoid-sorting', 'low-altitude-network'],
        relatedRegulationIds: ['china-low-altitude'],
      },
      {
        id: 'milton-keynes',
        place: 'Milton Keynes (UK), Finland, Tallinn',
        response: 'Mature service',
        note: "Starship's earliest commercial markets; about one in five Finnish grocery deliveries",
        locations: [
          { label: 'Milton Keynes', lat: 52.04, lng: -0.76 },
          { label: 'Helsinki', lat: 60.17, lng: 24.94 },
          { label: 'Tallinn', lat: 59.44, lng: 24.75 },
        ],
        relatedTypeIds: ['sidewalk-robots'],
      },
    ],
  },
};

export default urbanLogistics;
