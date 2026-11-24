import type { Department } from '../schema';

const parks: Department = {
  id: 'parks',
  number: '08',
  name: 'Parks & Public Space Management',
  accent: '#4f8a3c',
  intro:
    'Physical AI has already begun to show up in parks, mostly as maintenance robots and drones. The governance questions that matter happen in three instances: where a robot or drone takes on work staff used to do (mowing, inspection, lifeguarding), where it watches the public (patrol robots, police drones), and where it shares space with wildlife and visitors who never agreed to it.',

  types: {
    intro:
      'Thirteen types are in use, from turf and tree canopy to beaches, water and airspace. The most mature are robotic mowing, line painting and lifesaving drones. Patrol and visitor-service humanoids are scaling fastest, led by China. Future uses include robotic wayfinding, tree-risk capture, weeding and wider autonomous mowing.',
    zones: [
      { id: 'sports-fields', name: 'Sports fields', setting: 'field' },
      { id: 'lawns', name: 'Lawns & sports fields', setting: 'park' },
      { id: 'golf', name: 'Public golf courses', setting: 'field' },
      { id: 'canopy', name: 'Tree canopy', setting: 'park' },
      { id: 'plazas', name: 'Plazas, paths & squares', setting: 'plaza' },
      { id: 'patrol', name: 'Paths, parking lots, plazas', setting: 'plaza' },
      { id: 'visitor', name: 'Visitor centers & walkways', setting: 'plaza' },
      { id: 'beaches', name: 'Beaches & shorelines', setting: 'beach' },
      { id: 'water', name: 'Lakes, rivers, harbors', setting: 'water' },
      { id: 'air-beach', name: 'Airspace over beaches & water', setting: 'air' },
      { id: 'air-parks', name: 'Airspace over parks', setting: 'air' },
      { id: 'trails', name: 'Trails & sidewalks through parks', setting: 'trail' },
      { id: 'back-end', name: 'Whole park (back end)', setting: 'network' },
    ],
    items: [
      {
        id: 'line-painting',
        name: 'Line-painting robots',
        zoneId: 'sports-fields',
        model: 'line-painter',
        howItOperates: 'GNSS-guided robots mark fields from a stored layout; one worker sets up.',
        examples: 'Turf Tank (Sioux Falls, SD; Chattanooga, TN; South Burlington, VT)',
        whatHappened: 'Sioux Falls has used one for two seasons; lining fields once took a team of five multiple days.',
      },
      {
        id: 'autonomous-mowers',
        name: 'Autonomous mowers',
        zoneId: 'lawns',
        model: 'mower',
        howItOperates:
          'Electric or gas mowers follow GPS or perimeter-wire boundaries, often overnight; staff monitor remotely.',
        examples: 'Sioux Falls, Mobile (AL), Calgary, Edmonton, Dallas, Richmond (BC) pilots',
        whatHappened:
          'Sioux Falls runs ~8 robotic mowers after starting at four sites in 2025; Mobile paid $85,247 for two. Cities say seasonal, not full-time, labor is affected.',
      },
      {
        id: 'rough-mowers',
        name: 'Robotic rough mowers',
        zoneId: 'golf',
        model: 'mower',
        howItOperates: 'Small battery mowers with GPS and sensors cut around greens.',
        examples: 'Kress mowers on Milwaukee County Parks courses',
        whatHappened: 'Crews see them as "a tool, not a threat."',
      },
      {
        id: 'tree-drones',
        name: 'Tree-inspection & forestry drones',
        zoneId: 'canopy',
        model: 'drone',
        howItOperates:
          'Small drones fly around and inside tree crowns; LiDAR builds 3D tree models for risk assessment.',
        examples: 'NParks Singapore (since 2017); Denver Parks with CU Denver and USGS (research, 2018–2021)',
        whatHappened:
          'Singapore arborists inspect upper branches without climbing; Denver tested drones for species inventory and health assessment.',
      },
      {
        id: 'cleaning-robots',
        name: 'Cleaning & sweeping robots',
        zoneId: 'plazas',
        model: 'cleaning-robot',
        howItOperates: 'Autonomous sweepers and litter pickers on paved areas.',
        examples: 'Temple of Heaven Park (Beijing)',
        whatHappened:
          'Cleaning robots drew crowds as attractions; Beijing planned 72 robots and smart devices across its municipal parks in 2026.',
      },
      {
        id: 'patrol-robots',
        name: 'Security / patrol robots',
        zoneId: 'patrol',
        model: 'patrol-robot',
        howItOperates:
          'Wheeled or legged robots on fixed routes with cameras, speakers, sometimes an emergency button.',
        examples: 'Knightscope K5 (Huntington Park, CA; NYC subway), Xavier (Singapore), Spot (Singapore)',
        whatHappened:
          "Huntington Park's K5 failed to summon help in 2019 but was renewed; NYC ended its K5 pilot in 2024; Singapore runs patrol robots alongside officers.",
      },
      {
        id: 'visitor-humanoids',
        name: 'Visitor-service & entertainment humanoids',
        zoneId: 'visitor',
        model: 'humanoid',
        howItOperates: 'Give directions, hand out water and first aid, answer policy questions, perform.',
        examples: 'Qianhai Stone Park robot volunteer station (Shenzhen); AGIBOT at Chimelong Spaceship Park (Zhuhai)',
        whatHappened:
          'Shenzhen replaced human volunteers with robots offering eight services; Chimelong runs 300+ humanoids in open walkways.',
      },
      {
        id: 'sand-sifting',
        name: 'Sand-sifting robots',
        zoneId: 'beaches',
        model: 'sand-rover',
        howItOperates: 'Remote-controlled rovers sift buried litter and microplastics.',
        examples: 'BeBot (Detroit Belle Isle, Lake Tahoe, Muskegon)',
        whatHappened: 'Found 6,315 hidden pieces on Tahoe beaches after volunteers had already cleaned them.',
      },
      {
        id: 'waterway-boats',
        name: 'Waterway cleaning boats',
        zoneId: 'water',
        model: 'boat',
        howItOperates: 'Solar autonomous boats scoop floating trash and log it with cameras.',
        examples: 'Clearbot (Hong Kong, Bengaluru, Shillong)',
        whatHappened: 'About a dozen boats for government and corporate clients; data shows where waste enters.',
      },
      {
        id: 'lifesaving-drones',
        name: 'Lifesaving & shark-spotting drones',
        zoneId: 'air-beach',
        model: 'drone',
        howItOperates:
          'Lifeguards or police launch drones to spot sharks and rip currents and drop self-inflating flotation.',
        examples: 'NYC (40+ drones), Atlantic City and Ocean County (NJ), NY State parks (46), Little Ripper (NSW)',
        whatHappened:
          "First drone rescue at Lennox Head, Australia, 2018; a NJ sheriff's drone kept a rip-current swimmer afloat in July 2026.",
      },
      {
        id: 'monitoring-drones',
        name: 'Monitoring & enforcement drones',
        zoneId: 'air-parks',
        model: 'drone',
        howItOperates:
          'Survey crowds, wildlife and invasive species; police drone-as-first-responder (DFR) programs respond to calls.',
        examples: 'NPS administrative use; police DFR programs (Chula Vista, Oceanside, Tucson)',
        whatHappened: 'National parks ban public drones; ~1,500 US police departments have some drone program.',
      },
      {
        id: 'mobility-robots',
        name: 'Mobility robots & micromobility',
        zoneId: 'trails',
        model: 'quadruped',
        howItOperates: 'Delivery bots, robotic wheelchairs, robot dogs sharing paths with people.',
        examples: 'Simulated in MetaUrban (UCLA)',
        whatHappened:
          'Best simulated navigation success is only 66% for point-to-point and 36% for socially aware navigation.',
      },
      {
        id: 'sensor-ops',
        name: 'Sensor-driven operations',
        zoneId: 'back-end',
        model: 'sensor-pole',
        howItOperates: 'Moisture, vibration and occupancy sensors trigger mowing, repairs and staffing.',
        examples: 'Carlsbad (CA), Seattle, Des Moines',
        whatHappened:
          "Carlsbad's GeoAI cut inspection costs 44%; this is the data layer future robots will act on.",
      },
    ],
  },

  risks: {
    intro:
      'The most likely harm lands on the people with the least power to opt out: children, older adults, people who live in parks, and wildlife. The worst-case harms come from fleets and networks that could do mass harm at once.',
    current: [
      {
        id: 'false-safety',
        name: "False sense of safety: patrol robots that look like police but can't get help",
        whoImpacted: 'Park visitors, police dispatch, victims of violence',
        mostVulnerable: 'People without phones, non-English speakers, children',
        whatMakesWorse: 'Cities replacing patrol hours with robots; "POLICE" branding on leased devices',
        realWorldCase:
          "Huntington Park, CA, 2019: a woman pressed a K5's emergency button during a fight and it told her to step aside; the button wasn't yet connected to police.",
      },
      {
        id: 'surveillance',
        name: 'Surveillance & chilling of public life: cameras and analytics on mobile robots and drones',
        whoImpacted: 'All visitors, organizers, vendors',
        mostVulnerable: 'Unhoused people, protesters, people avoiding police contact',
        whatMakesWorse: 'Visual-recognition patrols; data shared with police; DFR drones over parks',
        realWorldCase:
          "Singapore's park Spot carried video analytics to count visitors (2020); Shenzhen's patrol robots use visual recognition.",
      },
      {
        id: 'crowd-contact',
        name: 'Physical contact with crowds: humanoids and robots in open walkways',
        whoImpacted: 'Visitors, performers, staff',
        mostVulnerable: 'Children, older adults',
        whatMakesWorse: 'Hundreds of humanoids moving among families outside fenced areas',
        realWorldCase:
          'Tianjin, Feb 2025: a humanoid lunged at festival-goers behind a barrier; Shaanxi, Mar 2026: a dancing robot struck a boy in the face.',
      },
      {
        id: 'wildlife',
        name: 'Wildlife harm: mowers and drones in habitats',
        whoImpacted: 'Wildlife, rehab centers, ecologists',
        mostVulnerable: 'Small nocturnal animals, nesting birds, juveniles',
        whatMakesWorse:
          "Night mowing (quiet machines can run when noisier ones can't); more drone traffic; no pre-deployment testing",
        realWorldCase:
          'All 18 robotic mowers tested had to touch a hedgehog to detect it; a drone separated bighorn sheep from their young at Zion National Park.',
      },
      {
        id: 'path-conflicts',
        name: 'Path conflicts & accessibility: robots on narrow trails and ramps',
        whoImpacted: 'Walkers, cyclists, maintenance crews',
        mostVulnerable: 'Wheelchair users, blind and low-vision visitors',
        whatMakesWorse: 'Mixed fleets (delivery bots, robot dogs, mowers) on the same paths; crowded events',
        realWorldCase:
          'Pittsburgh, 2019: a sidewalk robot blocked a curb cut; in simulation, navigation success fell sharply as pedestrian density rose.',
      },
      {
        id: 'unequal',
        name: 'Unequal deployment: robots land in flagship parks first',
        whoImpacted: 'Neighborhood parks, residents',
        mostVulnerable: 'Low-income neighborhoods, people without smartphones',
        whatMakesWorse: 'Pilot funding tied to showcase sites; app-based access',
        realWorldCase: 'Pilots cluster in signature parks (Temple of Heaven, Belle Isle).',
      },
      {
        id: 'terrain',
        name: 'Terrain & water failures: robots defeated by steps, fountains, mud, weather',
        whoImpacted: 'Visitors near the robot, maintenance staff',
        mostVulnerable: "People at the water's edge",
        whatMakesWorse: 'Robots moved from paved to natural terrain',
        realWorldCase:
          'Georgetown, DC, 2017: a 300-lb security robot rolled down steps into a fountain within days of starting.',
      },
    ],
    blackSwans: [
      {
        id: 'mass-events',
        name: 'Humanoid staff at mass events',
        scenario:
          'A city staffs a major festival or concert in a park with humanoid guides, first-aid stations and crowd marshals. During a crowd surge or evacuation, robots misread the crowd, freeze at exits or malfunction, triggering panic.',
        whoImpacted: 'Event crowds, police, EMS, organizers',
        mostVulnerable: 'Children, older adults, people with mobility aids',
        whatMakesWorse: 'Robots placed at gates and choke points; human staff reduced',
      },
      {
        id: 'surveillance-network',
        name: 'Park surveillance network',
        scenario:
          'DFR drones, patrol robots and fixed cameras feed facial and behavior recognition to a real-time crime center covering every park. Mass misidentification leads to wrongful stops, and protests and unhoused residents are tracked.',
        whoImpacted: 'Visitors, protesters, civil-liberties groups',
        mostVulnerable: 'Unhoused people, people of color, protesters',
        whatMakesWorse: 'Footage kept indefinitely; no council approval for new analytics',
      },
      {
        id: 'night-maintenance',
        name: 'Citywide autonomous night maintenance',
        scenario:
          'All parks switch to overnight robotic mowing, weeding and spraying. A fleet-wide update weakens obstacle detection, and robots kill wildlife across the city or strike a person sleeping in the grass.',
        whoImpacted: 'Wildlife, rehab centers, crews',
        mostVulnerable: 'Small nocturnal animals; unhoused people sleeping in parks',
        whatMakesWorse: 'Night operation chosen for quiet; no pre-deployment wildlife or human-contact testing',
      },
      {
        id: 'lifeguard-drones',
        name: 'Drones replace some lifeguard towers',
        scenario:
          'A city cuts staffed stands on lower-traffic beaches and relies on rescue drones. Wind, rain or a comms outage grounds the fleet on a peak day, and swimmers drown before staff arrive.',
        whoImpacted: 'Swimmers, lifeguards, beach patrol',
        mostVulnerable: 'Children and weak swimmers on unstaffed beaches',
        whatMakesWorse: 'Persistent lifeguard shortages; storms that ground drones when rip currents peak',
      },
      {
        id: 'wayfinding',
        name: 'Robotic wayfinding for blind visitors',
        scenario:
          'Guide robots lead blind and low-vision visitors through large parks. A stale map or sensor fault walks users into water, construction or traffic.',
        whoImpacted: 'Blind and low-vision visitors, park staff',
        mostVulnerable: 'Visitors who rely fully on the robot',
        whatMakesWorse: 'Maps not updated for closures; no human fallback',
      },
      {
        id: 'one-network',
        name: 'One network runs every park robot',
        scenario:
          'Mowers, patrol robots and humanoids share one city or vendor control platform. A hack turns them against visitors or disables them citywide during an emergency.',
        whoImpacted: 'All visitors, operators, police',
        mostVulnerable: 'Children near humanoids',
        whatMakesWorse: 'Central coordination over dedicated 5G; remote updates',
      },
    ],
  },

  regulation: {
    intro:
      'Parks are one of the few places where cities hold real power over physical AI, since they own the land, write the park rules and sign the contracts. The National Park Service has banned recreational drones in national parks since 2014, but most city rules target the public\'s devices rather than the city\'s own, and city parks rarely have an equivalent rule for city-operated drones even as drone-as-first-responder programs expand over them.',
    laws: [
      {
        id: 'faa',
        name: 'FAA airspace rules (Part 107 now; Part 108 BVLOS pending)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Who may fly, where, how high, beyond line of sight',
        fallsShort: 'Cities can regulate only takeoff and landing on public land, not flight paths or noise',
      },
      {
        id: 'nps-14-05',
        name: 'NPS Policy Memorandum 14-05 (2014)',
        authority: 'Federal (national parks only)',
        levels: ['Federal'],
        covers:
          'Bans launching, landing or operating drones in national parks; violations are a misdemeanor, up to 6 months in jail and a $5,000 fine',
        fallsShort:
          "Prompted by noise complaints and wildlife harassment. Doesn't reach city parks; agency drones still allowed with approval",
      },
      {
        id: 'city-park-rules',
        name: 'City park rules & takeoff/landing permits (e.g., NYC Rules Title 38, Ch. 24, July 2023)',
        authority: 'City',
        levels: ['City'],
        covers:
          'NYC requires a permit, insurance and FAA documents for most drone takeoffs; crashes must be reported to NYPD',
        fallsShort: "Written for the public's drones; ground robots and city-owned fleets mostly unaddressed",
      },
      {
        id: 'surveillance-ordinances',
        name: 'Surveillance-technology ordinances (e.g., Berkeley Municipal Code §2.99)',
        authority: 'City',
        levels: ['City'],
        covers: 'Council approval, community input and civilian oversight before police acquire drones or similar tech',
        fallsShort:
          "Often limited to police; a parks department's camera-equipped mower or patrol robot can fall outside",
      },
      {
        id: 'fourth-amendment',
        name: 'Fourth Amendment & state constitutional privacy (e.g., Calif. Art. I §1)',
        authority: 'Federal / State',
        levels: ['Federal', 'State'],
        covers: 'Limits on government searches',
        fallsShort:
          'Low expectation of privacy in public parks; little limit on mobile cameras or data retention. Chula Vista, CA lost a records lawsuit over its drone video in 2025',
      },
      {
        id: 'ada',
        name: 'ADA Title II',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Accessible public programs and facilities, including park paths',
        fallsShort:
          'No standard for robots blocking accessible routes or for accessible robot interfaces (buttons, voice-only prompts)',
      },
      {
        id: 'wildlife-law',
        name: 'Wildlife law (ESA, Migratory Bird Treaty Act, state wildlife codes)',
        authority: 'Federal / State',
        levels: ['Federal', 'State'],
        covers: 'Harming protected species',
        fallsShort: 'Applies after harm; no pre-deployment wildlife safety test (the Oxford hedgehog test is voluntary)',
      },
      {
        id: 'noise',
        name: 'Local noise ordinances',
        authority: 'City',
        levels: ['City'],
        covers: 'Limits on loud equipment by hour',
        fallsShort:
          'Quiet electric machines escape limits and can run at night, when wildlife is active (Germany allows robot mowers at night and on Sundays)',
      },
      {
        id: 'product-safety',
        name: 'Product safety standards for mowers and machinery (CPSC, UL/EN standards)',
        authority: 'Federal / industry',
        levels: ['Federal'],
        covers: 'Blade guards, stop functions',
        fallsShort:
          'Tested against people and objects, not small animals; humanoids and patrol robots have no public-space standard',
      },
      {
        id: 'procurement',
        name: 'Public procurement law & contracts',
        authority: 'City / State',
        levels: ['City', 'State'],
        covers: 'Bidding, leases, service agreements',
        fallsShort:
          'The key lever, but contracts rarely include labor provisions, evaluation standards or data terms. NYC kept paying for its K5 while it sat unused',
      },
      {
        id: 'labor',
        name: 'Public-sector labor law, civil service, union contracts',
        authority: 'State / City',
        levels: ['State', 'City'],
        covers: 'Contracting-out limits, job classifications',
        fallsShort: '"Robot-as-a-service" leases may count as contracting out; few contracts define it',
      },
      {
        id: 'tort',
        name: 'Tort law & sovereign immunity',
        authority: 'State',
        levels: ['State'],
        covers: 'Injury claims against cities and vendors',
        fallsShort: 'Municipal immunity caps; unclear who pays when a leased robot injures a visitor',
      },
    ],
    gaps: [
      {
        title: "Rules for the city's own drones over parks",
        detail:
          'NPS restricts drones in national parks, but most city parks have no equivalent for city-operated or DFR drones.',
      },
      {
        title: 'Pre-deployment wildlife testing',
        detail: "There's no requirement to test mowers, drones or ground robots against wildlife before use.",
      },
      {
        title: 'Human-contact edge cases',
        detail:
          "There's no required testing for robots that could touch people, including rare cases (a child reaching out, a crowd surge).",
      },
      {
        title: 'Working emergency features',
        detail: 'Nothing requires a "help" button to actually reach help before a robot is deployed.',
      },
      {
        title: 'Noise standards for quiet, always-on machines',
        detail: 'Nothing sets when they may run, including at night.',
      },
      {
        title: 'Accessibility',
        detail: 'There are no requirements for robots on paths or for their interfaces.',
      },
      {
        title: 'Data retention limits',
        detail: 'Nothing caps how long park robots and drones keep video, audio and location data.',
      },
      {
        title: 'Evaluation and labor metrics in contracts',
        detail:
          "There's no standard for what success means, how it's measured, and what happens to the work and workers it changes.",
      },
    ],
  },

  caseStudies: {
    intro:
      'Robots doing dull, dirty or dangerous maintenance work (painting lines, mowing, inspecting tree crowns, sifting sand, dropping flotation) tend to stick, while robots sold as a public safety presence tend to get pulled or stay without clear evidence they work. A Proof News review found at least 13 of 21 security-robot deployments since 2015 had ended.',
    places: [
      {
        id: 'sioux-falls',
        place: 'Sioux Falls, SD',
        response: 'Adopted',
        note: 'Turf Tank line-painting robot for two seasons; ~8 robotic mowers since 2025',
        locations: [{ label: 'Sioux Falls', lat: 43.54, lng: -96.73 }],
        relatedTypeIds: ['line-painting', 'autonomous-mowers'],
      },
      {
        id: 'milwaukee',
        place: 'Milwaukee County, WI',
        response: 'Adopted',
        note: 'Kress robotic mowers on county golf courses; crews call them a tool, not a threat',
        locations: [{ label: 'Milwaukee', lat: 43.04, lng: -87.91 }],
        relatedTypeIds: ['rough-mowers'],
      },
      {
        id: 'mower-pilots',
        place: 'Mobile, AL; Calgary, AB; Edmonton, AB; Dallas, TX',
        response: 'Mower pilots',
        note: 'Mobile bought two for $85,247; Calgary ran a 30-day single-site trial',
        locations: [
          { label: 'Mobile', lat: 30.69, lng: -88.04 },
          { label: 'Calgary', lat: 51.05, lng: -114.07 },
          { label: 'Edmonton', lat: 53.55, lng: -113.49 },
          { label: 'Dallas', lat: 32.78, lng: -96.8 },
        ],
        relatedTypeIds: ['autonomous-mowers'],
        relatedRegulationIds: ['procurement'],
      },
      {
        id: 'singapore',
        place: 'Singapore (NParks, HTX)',
        response: 'Adopted + trials',
        note: 'Tree-inspection drones since 2017; Spot distancing trial (2020); Xavier patrol robots with officers (2021)',
        locations: [{ label: 'Singapore', lat: 1.35, lng: 103.82 }],
        relatedTypeIds: ['tree-drones', 'patrol-robots'],
      },
      {
        id: 'denver',
        place: 'Denver, CO',
        response: 'Research partner',
        note: 'Denver Parks worked with CU Denver and USGS (2018–2021) to test drones for species inventory and tree health',
        locations: [{ label: 'Denver', lat: 39.74, lng: -104.99 }],
        relatedTypeIds: ['tree-drones'],
      },
      {
        id: 'nyc-beaches',
        place: 'New York City; NY State parks',
        response: 'Expanded',
        note: '40+ flotation-dropping drones at city beaches; state beaches up to 46 drones in 2026',
        locations: [
          { label: 'NYC beaches', lat: 40.58, lng: -73.82 },
          { label: 'Jones Beach', lat: 40.6, lng: -73.51 },
        ],
        relatedTypeIds: ['lifesaving-drones'],
        relatedRegulationIds: ['city-park-rules'],
      },
      {
        id: 'nj-beaches',
        place: 'Atlantic City & Ocean County, NJ',
        response: 'Adopted',
        note: 'Beach patrol drones drop flotation and spot rip currents',
        locations: [
          { label: 'Atlantic City', lat: 39.36, lng: -74.42 },
          { label: 'Ocean County', lat: 39.9, lng: -74.15 },
        ],
        relatedTypeIds: ['lifesaving-drones'],
      },
      {
        id: 'belle-isle',
        place: 'Detroit, MI (Belle Isle)',
        response: 'Pilot → recurring',
        note: 'BeBot sand-cleaning robot in its third summer (2026)',
        locations: [{ label: 'Belle Isle', lat: 42.34, lng: -82.98 }],
        relatedTypeIds: ['sand-sifting'],
      },
      {
        id: 'huntington-park',
        place: 'Huntington Park, CA',
        response: 'Kept',
        note: 'K5 patrol robot renewed for a 6th year despite the 2019 emergency-button failure',
        locations: [{ label: 'Huntington Park', lat: 33.98, lng: -118.22 }],
        relatedTypeIds: ['patrol-robots'],
        relatedRegulationIds: ['procurement'],
      },
      {
        id: 'nyc-k5',
        place: 'New York City (Times Square subway)',
        response: 'Ended',
        note: 'K5 pilot ended after ~4 months (Jan 2024)',
        locations: [{ label: 'Times Square', lat: 40.76, lng: -73.99 }],
        relatedTypeIds: ['patrol-robots'],
      },
      {
        id: 'shenzhen-beijing',
        place: 'Shenzhen & Beijing, China',
        response: 'Scaling',
        note: 'Robot volunteer station at Qianhai Stone Park; 72 robots across Beijing municipal parks',
        locations: [
          { label: 'Shenzhen', lat: 22.54, lng: 113.9 },
          { label: 'Beijing', lat: 39.88, lng: 116.41 },
        ],
        relatedTypeIds: ['visitor-humanoids', 'cleaning-robots'],
      },
      {
        id: 'national-parks',
        place: 'US national parks',
        response: 'Ban',
        note: 'Public drone ban since 2014',
        locations: [
          { label: 'Yellowstone', lat: 44.43, lng: -110.59 },
          { label: 'Zion', lat: 37.3, lng: -113.03 },
        ],
        relatedRegulationIds: ['nps-14-05'],
      },
      {
        id: 'dfr-debate',
        place: 'Berkeley, Oceanside (CA); Tucson (AZ)',
        response: 'Debating DFR',
        note: 'Police drone programs face privacy review before expansion',
        locations: [
          { label: 'Berkeley', lat: 37.87, lng: -122.27 },
          { label: 'Oceanside', lat: 33.2, lng: -117.38 },
          { label: 'Tucson', lat: 32.22, lng: -110.97 },
        ],
        relatedTypeIds: ['monitoring-drones'],
        relatedRegulationIds: ['surveillance-ordinances'],
      },
    ],
  },
};

export default parks;
