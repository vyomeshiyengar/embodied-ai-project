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
    layout: 'landscape',
    ground: [36, 28],
    zones: [
      { id: 'sports-fields', name: 'Sports fields', setting: 'field', area: { x: -12, z: 8, w: 9, d: 7 } },
      { id: 'lawns', name: 'Lawns & sports fields', setting: 'park', area: { x: -3.5, z: 5, w: 6, d: 5 } },
      { id: 'golf', name: 'Public golf courses', setting: 'golf', area: { x: 12, z: 7.5, w: 10, d: 7 } },
      { id: 'canopy', name: 'Tree canopy', setting: 'forest', area: { x: -11, z: -9, w: 11, d: 8 } },
      { id: 'plazas', name: 'Plazas, paths & squares', setting: 'plaza', area: { x: 0, z: -1.5, w: 7, d: 6, shape: 'ellipse' } },
      { id: 'patrol', name: 'Paths, parking lots, plazas', setting: 'parking', area: { x: 2.5, z: 9.5, w: 6, d: 4 } },
      { id: 'visitor', name: 'Visitor centers & walkways', setting: 'visitor-center', area: { x: -1, z: -9, w: 7, d: 5 } },
      { id: 'beaches', name: 'Beaches & shorelines', setting: 'beach', area: { x: 11, z: -2, w: 10, d: 2.6 } },
      { id: 'water', name: 'Lakes, rivers, harbors', setting: 'water', area: { x: 11.5, z: -8, w: 11, d: 9, shape: 'ellipse' } },
      { id: 'air-beach', name: 'Airspace over beaches & water', setting: 'air', area: { x: 8, z: -5, w: 4, d: 3 } },
      { id: 'air-parks', name: 'Airspace over parks', setting: 'air', area: { x: -3, z: 1.5, w: 4, d: 3 } },
      { id: 'trails', name: 'Trails & sidewalks through parks', setting: 'trail', area: { x: -12, z: -1, w: 9, d: 5 } },
      { id: 'back-end', name: 'Whole park (back end)', setting: 'network', area: { x: 4.5, z: 4, w: 4, d: 3.5 } },
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
        whoImpacted: "Park visitors, police dispatchers and victims of violence are affected.",
        mostVulnerable: "People without phones, non-English speakers and children are the most vulnerable.",
        whatMakesWorse: "Cities replacing patrol hours with robots make this worse, as does \"POLICE\" branding on leased devices.",
        realWorldCase: "In Huntington Park, California in 2019, a woman pressed a K5's emergency button during a fight and the robot told her to step aside; the button wasn't yet connected to police.",
      },
      {
        id: 'surveillance',
        name: 'Surveillance & chilling of public life: cameras and analytics on mobile robots and drones',
        whoImpacted: "All visitors, organizers and vendors are affected.",
        mostVulnerable: "Unhoused people, protesters and people avoiding police contact are the most vulnerable.",
        whatMakesWorse: "Patrols with visual recognition make this worse, as do sharing data with police and police drone-as-first-responder flights over parks.",
        realWorldCase: "Singapore's park Spot robot carried video analytics to count visitors in 2020, and Shenzhen's patrol robots use visual recognition.",
      },
      {
        id: 'crowd-contact',
        name: 'Physical contact with crowds: humanoids and robots in open walkways',
        whoImpacted: "Visitors, performers and staff are affected.",
        mostVulnerable: "Children and older adults are the most vulnerable.",
        whatMakesWorse: "Hundreds of humanoids moving among families outside fenced areas would make this worse.",
        realWorldCase: "In Tianjin in February 2025, a humanoid lunged at festival-goers behind a barrier, and in Shaanxi in March 2026, a dancing robot struck a boy in the face.",
      },
      {
        id: 'wildlife',
        name: 'Wildlife harm: mowers and drones in habitats',
        whoImpacted: "Wildlife, wildlife rehabilitation centers and ecologists are affected.",
        mostVulnerable: "Small nocturnal animals, nesting birds and juvenile animals are the most vulnerable.",
        whatMakesWorse: "Night mowing makes this worse, because quiet machines can run when noisier ones can't, as do more drone traffic and the lack of testing before deployment.",
        realWorldCase: "All 18 robotic mowers in one test had to touch a hedgehog to detect it, and a drone separated bighorn sheep from their young at Zion National Park.",
      },
      {
        id: 'path-conflicts',
        name: 'Path conflicts & accessibility: robots on narrow trails and ramps',
        whoImpacted: "Walkers, cyclists and maintenance crews are affected.",
        mostVulnerable: "Wheelchair users and blind and low-vision visitors are the most vulnerable.",
        whatMakesWorse: "Mixed fleets of delivery bots, robot dogs and mowers on the same paths make this worse, as do crowded events.",
        realWorldCase: "In Pittsburgh in 2019, a sidewalk robot blocked a curb cut, and in simulations, robots' navigation success fell sharply as pedestrian density rose.",
      },
      {
        id: 'unequal',
        name: 'Unequal deployment: robots land in flagship parks first',
        whoImpacted: "Neighborhood parks and their residents are affected.",
        mostVulnerable: "Low-income neighborhoods and people without smartphones are the most vulnerable.",
        whatMakesWorse: "Tying pilot funding to showcase sites makes this worse, as does app-based access.",
        realWorldCase: "Pilots cluster in signature parks such as the Temple of Heaven and Belle Isle.",
      },
      {
        id: 'terrain',
        name: 'Terrain & water failures: robots defeated by steps, fountains, mud, weather',
        whoImpacted: "Visitors near the robot and maintenance staff are affected.",
        mostVulnerable: "People at the water's edge are the most vulnerable.",
        whatMakesWorse: "Moving robots from paved surfaces to natural terrain makes this worse.",
        realWorldCase: "In Georgetown, Washington, DC in 2017, a 300-lb security robot rolled down steps into a fountain within days of starting work.",
      },
    ],
    blackSwans: [
      {
        id: 'mass-events',
        name: 'Humanoid staff at mass events',
        scenario:
          'A city staffs a major festival or concert in a park with humanoid guides, first-aid stations and crowd marshals. During a crowd surge or evacuation, robots misread the crowd, freeze at exits or malfunction, triggering panic.',
        whoImpacted: "Event crowds, police, EMS and organizers are affected.",
        mostVulnerable: "Children, older adults and people with mobility aids are the most vulnerable.",
        whatMakesWorse: "Placing robots at gates and choke points would make this worse, as would reducing human staff.",
      },
      {
        id: 'surveillance-network',
        name: 'Park surveillance network',
        scenario:
          'DFR drones, patrol robots and fixed cameras feed facial and behavior recognition to a real-time crime center covering every park. Mass misidentification leads to wrongful stops, and protests and unhoused residents are tracked.',
        whoImpacted: "Visitors, protesters and civil-liberties groups are affected.",
        mostVulnerable: "Unhoused people, people of color and protesters are the most vulnerable.",
        whatMakesWorse: "Keeping footage indefinitely would make this worse, as would adding new analytics without council approval.",
      },
      {
        id: 'night-maintenance',
        name: 'Citywide autonomous night maintenance',
        scenario:
          'All parks switch to overnight robotic mowing, weeding and spraying. A fleet-wide update weakens obstacle detection, and robots kill wildlife across the city or strike a person sleeping in the grass.',
        whoImpacted: "Wildlife, rehabilitation centers and maintenance crews are affected.",
        mostVulnerable: "Small nocturnal animals and unhoused people sleeping in parks are the most vulnerable.",
        whatMakesWorse: "Choosing night operation because the machines are quiet would make this worse, as would skipping wildlife and human-contact testing before deployment.",
      },
      {
        id: 'lifeguard-drones',
        name: 'Drones replace some lifeguard towers',
        scenario:
          'A city cuts staffed stands on lower-traffic beaches and relies on rescue drones. Wind, rain or a comms outage grounds the fleet on a peak day, and swimmers drown before staff arrive.',
        whoImpacted: "Swimmers, lifeguards and beach patrols are affected.",
        mostVulnerable: "Children and weak swimmers on unstaffed beaches are the most vulnerable.",
        whatMakesWorse: "Persistent lifeguard shortages would make this worse, as would storms that ground drones just as rip currents peak.",
      },
      {
        id: 'wayfinding',
        name: 'Robotic wayfinding for blind visitors',
        scenario:
          'Guide robots lead blind and low-vision visitors through large parks. A stale map or sensor fault walks users into water, construction or traffic.',
        whoImpacted: "Blind and low-vision visitors and park staff are affected.",
        mostVulnerable: "Visitors who rely entirely on the robot are the most vulnerable.",
        whatMakesWorse: "Maps that aren't updated for closures would make this worse, as would having no human fallback.",
      },
      {
        id: 'one-network',
        name: 'One network runs every park robot',
        scenario:
          'Mowers, patrol robots and humanoids share one city or vendor control platform. A hack turns them against visitors or disables them citywide during an emergency.',
        whoImpacted: "All visitors, operators and police are affected.",
        mostVulnerable: "Children near humanoid robots are the most vulnerable.",
        whatMakesWorse: "Central coordination over dedicated 5G would make this worse, as would remote software updates.",
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
        covers: "These rules set who may fly drones, where, how high and whether beyond line of sight.",
        fallsShort: "Cities can regulate only takeoff and landing on public land, not flight paths or noise.",
      },
      {
        id: 'nps-14-05',
        name: 'NPS Policy Memorandum 14-05 (2014)',
        authority: 'Federal (national parks only)',
        levels: ['Federal'],
        covers: "The memo bans launching, landing or operating drones in national parks, and violations are a misdemeanor punishable by up to 6 months in jail and a $5,000 fine.",
        fallsShort: "The ban was prompted by noise complaints and wildlife harassment. It doesn't reach city parks, and agency drones are still allowed with approval.",
      },
      {
        id: 'city-park-rules',
        name: 'City park rules & takeoff/landing permits (e.g., NYC Rules Title 38, Ch. 24, July 2023)',
        authority: 'City',
        levels: ['City'],
        covers: "NYC requires a permit, insurance and FAA documents for most drone takeoffs, and crashes must be reported to the NYPD.",
        fallsShort: "These rules were written for the public's drones and mostly don't address ground robots or city-owned fleets.",
      },
      {
        id: 'surveillance-ordinances',
        name: 'Surveillance-technology ordinances (e.g., Berkeley Municipal Code §2.99)',
        authority: 'City',
        levels: ['City'],
        covers: "These ordinances require council approval, community input and civilian oversight before police acquire drones or similar technology.",
        fallsShort: "They often apply only to police, so a parks department's camera-equipped mower or patrol robot can fall outside them.",
      },
      {
        id: 'fourth-amendment',
        name: 'Fourth Amendment & state constitutional privacy (e.g., Calif. Art. I §1)',
        authority: 'Federal / State',
        levels: ['Federal', 'State'],
        covers: "These provisions limit government searches.",
        fallsShort: "People have a low expectation of privacy in public parks, so there is little limit on mobile cameras or data retention. Chula Vista, California lost a records lawsuit over its drone video in 2025.",
      },
      {
        id: 'ada',
        name: 'ADA Title II',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "Title II requires accessible public programs and facilities, including park paths.",
        fallsShort: "There is no standard for robots that block accessible routes or for accessible robot interfaces, such as buttons and voice-only prompts.",
      },
      {
        id: 'wildlife-law',
        name: 'Wildlife law (ESA, Migratory Bird Treaty Act, state wildlife codes)',
        authority: 'Federal / State',
        levels: ['Federal', 'State'],
        covers: "These laws prohibit harming protected species.",
        fallsShort: "They apply only after harm is done, and there is no required wildlife safety test before deployment; the Oxford hedgehog test is voluntary.",
      },
      {
        id: 'noise',
        name: 'Local noise ordinances',
        authority: 'City',
        levels: ['City'],
        covers: "These ordinances limit loud equipment by time of day.",
        fallsShort: "Quiet electric machines escape these limits and can run at night, when wildlife is active. Germany, for example, allows robot mowers to run at night and on Sundays.",
      },
      {
        id: 'product-safety',
        name: 'Product safety standards for mowers and machinery (CPSC, UL/EN standards)',
        authority: 'Federal / industry',
        levels: ['Federal'],
        covers: "These standards require blade guards and stop functions.",
        fallsShort: "Machines are tested against people and objects, not small animals, and there is no public-space standard for humanoids or patrol robots.",
      },
      {
        id: 'procurement',
        name: 'Public procurement law & contracts',
        authority: 'City / State',
        levels: ['City', 'State'],
        covers: "Procurement law governs bidding, leases and service agreements.",
        fallsShort: "Contracts are the key lever, but they rarely include labor provisions, evaluation standards or data terms. NYC kept paying for its K5 while it sat unused.",
      },
      {
        id: 'labor',
        name: 'Public-sector labor law, civil service, union contracts',
        authority: 'State / City',
        levels: ['State', 'City'],
        covers: "These rules limit contracting out and define job classifications.",
        fallsShort: "\"Robot-as-a-service\" leases may count as contracting out, but few contracts define them.",
      },
      {
        id: 'tort',
        name: 'Tort law & sovereign immunity',
        authority: 'State',
        levels: ['State'],
        covers: "Tort law governs injury claims against cities and vendors.",
        fallsShort: "Municipal immunity caps damages, and it is unclear who pays when a leased robot injures a visitor.",
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
        id: 'security-robots',
        detail: {
          title: "Huntington Park and New York City: security robots",
          deployed:
            "Both cities used Knightscope K5 patrol robots. Huntington Park, California placed one in Salt Lake Park in June 2019, and the NYPD placed one in the Times Square subway station in September 2023.",
          whatHappened:
            "In Huntington Park, the robot's \"POLICE\"-branded emergency button routed calls to the vendor rather than to police, and it failed during a fight in 2019. In New York, the K5 needed officers to accompany it, required frequent charging and couldn't handle stairs.",
          impact:
            "Huntington Park leased the robot for about $60,000–70,000 a year. In New York, privacy advocates warned that the robot could later be fitted with facial recognition.",
          response:
            "Huntington Park renewed its lease for a sixth year in 2024. New York ended its pilot after about four months (January 2024) but kept paying for the idle robot under its six-month contract.",
          whatChanged:
            "Neither city has published evidence that the robots reduced crime, and public reaction ranged from novelty to ridicule. A Proof News review found that at least 13 of 21 security-robot deployments since 2015 had ended.",
        },
        place: 'Huntington Park, CA and New York City',
        response: 'Kept vs. ended',
        note: "Huntington Park renewed its K5 patrol robot for a sixth year despite a 2019 emergency-button failure, while New York ended its Times Square subway pilot after about four months (January 2024).",
        locations: [
          { label: 'Huntington Park', lat: 33.98, lng: -118.22 },
          { label: 'Times Square', lat: 40.76, lng: -73.99 },
        ],
        relatedTypeIds: ['patrol-robots'],
        relatedRegulationIds: ['procurement'],
      },
      {
        id: 'singapore',
        detail: {
          title: "Singapore: inspection drones and patrol robots",
          deployed:
            "NParks has used microdrones to inspect trees since 2017. Boston Dynamics' Spot patrolled Bishan-Ang Mo Kio Park in 2020, and HTX's Xavier patrol robots were trialed at Toa Payoh Central in 2021.",
          whatHappened:
            "The drones let arborists inspect tree crowns without climbing. Spot broadcast distancing reminders and carried video analytics to count visitors. Over three weeks, Xavier detected smoking, illegal hawking and badly parked bikes, and sent alerts to a command center.",
          impact:
            "Tree risk checks became safer and faster across about 1.5 million managed trees, while everyday public behavior came under more automated monitoring.",
          response:
            "Government agencies led the pilots with staff working alongside the robots, and the tree drones became part of routine operations.",
          whatChanged:
            "Drone tree inspection became standard practice. The patrol robots drew surveillance concerns, mostly from outside Singapore.",
        },
        place: 'Singapore (NParks, HTX)',
        response: 'Adopted + trials',
        note: "Singapore has used tree-inspection drones since 2017, ran a Spot distancing trial in 2020 and deployed Xavier patrol robots alongside officers in 2021.",
        locations: [{ label: 'Singapore', lat: 1.35, lng: 103.82 }],
        relatedTypeIds: ['tree-drones', 'patrol-robots'],
      },
      {
        id: 'ny-nj-lifeguard-drones',
        detail: {
          title: "New York and New Jersey: lifeguard drones",
          deployed:
            "The NYPD and NYC Parks fly more than 40 flotation-dropping drones over 14 miles of city beaches, and New York State parks will use up to 46 drones in 2026. In New Jersey, the Atlantic City Beach Patrol and the Ocean County Sheriff's Office also use drones.",
          whatHappened:
            "The drones scan for sharks and rip currents and drop self-inflating tubes to swimmers. In July 2026, an Ocean County sheriff's drone dropped a flotation device to a swimmer caught in a rip current off Long Beach Island and kept them afloat until lifeguards arrived. Shorebirds have also attacked the drones.",
          impact:
            "NYC beaches drew more than 7.4 million visitors in 2024 amid lifeguard shortages, and five people drowned at city beaches that summer.",
          response:
            "The programs have expanded and are framed as supporting lifeguards rather than replacing them.",
          whatChanged:
            "Rescuers now reach swimmers faster, but there are also more police-operated cameras over beaches.",
        },
        place: 'New York and New Jersey beaches',
        response: 'Expanded',
        note: "New York City uses more than 40 flotation-dropping drones at its beaches, and state beaches will use up to 46 in 2026. In New Jersey, the Atlantic City and Ocean County beach patrols use drones to drop flotation and spot rip currents.",
        locations: [
          { label: 'NYC beaches', lat: 40.58, lng: -73.82 },
          { label: 'Jones Beach', lat: 40.6, lng: -73.51 },
          { label: 'Long Beach Island', lat: 39.66, lng: -74.18 },
          { label: 'Atlantic City', lat: 39.36, lng: -74.42 },
        ],
        relatedTypeIds: ['lifesaving-drones'],
        relatedRegulationIds: ['city-park-rules'],
      },
      {
        id: 'belle-isle',
        detail: {
          title: "Detroit and Lake Tahoe: beach-cleaning robots",
          deployed:
            "BeBot sand-sifting robots have cleaned Belle Isle Beach in Detroit since 2024 and Lake Tahoe beaches since 2022.",
          whatHappened:
            "The robot clears 100–150 yards of shoreline in about 20 minutes, but volunteers then spend nearly an hour sorting what it collects. At Lake Tahoe, it found 6,315 hidden pieces of litter on beaches that volunteers had already cleaned.",
          impact:
            "The robots removed more microplastic, and the litter data helped trace where waste comes from.",
          response:
            "The program runs as a public–nonprofit partnership that is renewed each year. The robot is remote-controlled rather than fully autonomous.",
          whatChanged:
            "Volunteer work shifted from picking up litter to sorting it and logging data, and no jobs were lost.",
        },
        place: 'Detroit (Belle Isle) and Lake Tahoe',
        response: 'Pilot → recurring',
        note: "BeBot sand-cleaning robots work Lake Tahoe beaches and are in their third summer at Belle Isle (2026).",
        locations: [
          { label: 'Belle Isle', lat: 42.34, lng: -82.98 },
          { label: 'Lake Tahoe', lat: 39.1, lng: -120.04 },
        ],
        relatedTypeIds: ['sand-sifting'],
      },
      {
        id: 'maintenance-robotics',
        detail: {
          title: "Sioux Falls and Milwaukee County: maintenance robotics",
          deployed:
            "Sioux Falls, South Dakota uses a Turf Tank line-painting robot and about eight robotic mowers, and Milwaukee County uses Kress robotic mowers on its golf courses. Mobile (Alabama), Calgary and Edmonton ran smaller mower pilots.",
          whatHappened:
            "In Sioux Falls, lining fields used to take a team of five several days. Milwaukee crews call the mowers \"a tool, not a threat\" and nicknamed one after a co-worker. Mobile paid $85,247 for two mowers.",
          impact:
            "Staff time moved to other maintenance work. Cities say the robots affect seasonal jobs rather than permanent ones.",
          response:
            "Cities have expanded gradually after starting with small pilots.",
          whatChanged:
            "Labor was reallocated and park operations became quieter. The wildlife effects of night mowing have not been measured, and in one study all 18 robotic mowers tested had to touch a hedgehog before detecting it.",
        },
        place: 'Sioux Falls and Milwaukee County (plus mower pilots)',
        response: 'Adopted; gradual expansion',
        note: "Sioux Falls uses a line-painting robot and about eight robotic mowers, and Milwaukee County uses robotic mowers on its golf courses. Mobile, Calgary, Edmonton and Dallas ran smaller mower pilots.",
        locations: [
          { label: 'Sioux Falls', lat: 43.54, lng: -96.73 },
          { label: 'Milwaukee', lat: 43.04, lng: -87.91 },
          { label: 'Mobile', lat: 30.69, lng: -88.04 },
          { label: 'Calgary', lat: 51.05, lng: -114.07 },
          { label: 'Edmonton', lat: 53.55, lng: -113.49 },
          { label: 'Dallas', lat: 32.78, lng: -96.8 },
        ],
        relatedTypeIds: ['line-painting', 'autonomous-mowers', 'rough-mowers'],
        relatedRegulationIds: ['procurement', 'wildlife-law'],
      },
      {
        id: 'denver',
        place: 'Denver, CO',
        response: 'Research partner',
        note: "Denver Parks worked with CU Denver and USGS from 2018 to 2021 to test drones for species inventory and tree health.",
        locations: [{ label: 'Denver', lat: 39.74, lng: -104.99 }],
        relatedTypeIds: ['tree-drones'],
      },
      {
        id: 'shenzhen-beijing',
        place: 'Shenzhen & Beijing, China',
        response: 'Scaling',
        note: "Shenzhen runs a robot volunteer station at Qianhai Stone Park, and Beijing planned 72 robots across its municipal parks.",
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
        note: "The National Park Service has banned public drones in national parks since 2014.",
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
        note: "Police drone programs in these cities face privacy review before they can expand.",
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
