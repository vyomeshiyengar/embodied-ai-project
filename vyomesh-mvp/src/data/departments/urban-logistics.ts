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
    layout: 'landscape',
    theme: 'city',
    ground: [36, 28],
    roads: [
      { from: [-18, 1], to: [18, 1], width: 3 },
      { from: [-5.5, -14], to: [-5.5, 14], width: 2.6 },
    ],
    zones: [
      { id: 'sidewalks', name: 'Sidewalks & crosswalks', setting: 'sidewalk', area: { x: 2, z: 3.5, w: 10, d: 1.8 } },
      { id: 'bike-lanes', name: 'Bike lanes & road shoulders', setting: 'bikelane', area: { x: 9, z: -1.5, w: 14, d: 1.4 } },
      { id: 'streets', name: 'Streets', setting: 'street', area: { x: -12, z: 1, w: 11, d: 3 } },
      { id: 'air-suburbs', name: 'Low airspace (suburbs)', setting: 'air', below: 'suburb', area: { x: -11.5, z: -8, w: 11, d: 9 } },
      { id: 'air-dense', name: 'Low airspace (dense cities)', setting: 'air', below: 'downtown', area: { x: 9, z: -8, w: 14, d: 9 } },
      { id: 'warehouses', name: 'Warehouses & distribution centers', setting: 'warehouse', area: { x: -12, z: 9, w: 10, d: 6 } },
      { id: 'dc-night', name: 'Distribution centers (night shift)', setting: 'warehouse', area: { x: 0, z: 9, w: 7, d: 6 } },
      { id: 'industrial', name: 'Industrial sites, cold storage, receiving docks', setting: 'industrial', area: { x: 8, z: 9, w: 6, d: 6 } },
      { id: 'network', name: 'Network layer', setting: 'network', area: { x: 14.5, z: 9, w: 5, d: 6 } },
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
        whoImpacted: "Pedestrians, cyclists, couriers and remote operators are affected.",
        mostVulnerable: "Cyclists, older adults, children and blind people are the most vulnerable.",
        whatMakesWorse: "Heavier and faster robots make collisions worse (Pennsylvania allows 550-lb robots at 12 mph on sidewalks), as does giving robots access to bike lanes.",
        realWorldCase: "In Jersey City in October 2025, a robot darted into a bike lane, and the cyclist it hit suffered a concussion and a broken clavicle; bystanders had to stop the robot. A 2021 study logged 40 dangerous near-misses in five days on one campus.",
      },
      {
        id: 'accessibility',
        name: 'Accessibility blockage: robots in curb ramps, narrow sidewalks, crosswalks',
        whoImpacted: "Pedestrians, people using mobility aids and parents with strollers are affected.",
        mostVulnerable: "Wheelchair users and blind and low-vision people are the most vulnerable.",
        whatMakesWorse: "Fleet growth on already narrow sidewalks makes this worse, as do snow and construction.",
        realWorldCase: "Toronto banned sidewalk robots in December 2021 after its Accessibility Advisory Committee called them a new disability barrier.",
      },
      {
        id: 'accountability',
        name: 'Unclear accountability after crashes',
        whoImpacted: "Injured people, insurers and city 311 staff are affected.",
        mostVulnerable: "People without lawyers or insurance are the most vulnerable.",
        whatMakesWorse: "Contracts between platforms, vendors and merchants that shift liability make this worse, as do robots that don't stop after contact.",
        realWorldCase: "The Jersey City cyclist is suing both Uber and Avride, and his lawyer says residents are \"unwitting crash test dummies.\"",
      },
      {
        id: 'congestion',
        name: 'Sidewalk congestion & property damage',
        whoImpacted: "Pedestrians, transit riders and businesses are affected.",
        mostVulnerable: "People waiting at bus stops are the most vulnerable.",
        whatMakesWorse: "Software changes rolled out across a whole fleet make this worse, as do more operators per block.",
        realWorldCase: "In Chicago in March 2026, two robots damaged CTA bus shelters, and the city created a dedicated 311 category for robot complaints.",
      },
      {
        id: 'emergency-interference',
        name: 'Interference with police & emergency response',
        whoImpacted: "Police, EMS and firefighters are affected.",
        mostVulnerable: "People at emergency scenes are the most vulnerable.",
        whatMakesWorse: "Remote operators who follow bystanders' cues make this worse, and responders have no way to override the robots.",
        realWorldCase: "In Los Angeles in September 2022, a delivery robot crossed police tape at a suspected school shooting after a bystander lifted the tape; a human operator made the call.",
      },
      {
        id: 'surveillance',
        name: 'Surveillance: every robot and drone is a moving camera',
        whoImpacted: "All passersby and residents under drone routes are affected.",
        mostVulnerable: "People avoiding police contact are the most vulnerable.",
        whatMakesWorse: "Sharing footage with police or using it for AI training makes this worse, and there are no limits on how long footage is kept.",
        realWorldCase: "Chicago residents raised surveillance concerns alongside safety and job loss.",
      },
      {
        id: 'drone-noise',
        name: 'Drone noise & privacy',
        whoImpacted: "Residents who live under drone routes and near hubs are affected.",
        mostVulnerable: "Wildlife is the most vulnerable.",
        whatMakesWorse: "More operators make this worse, as does federal preemption of city rules.",
        realWorldCase: "Residents in Richardson, Texas logged a drone every few minutes, and the city had few legal tools to respond.",
      },
      {
        id: 'unequal-burden',
        name: 'Unequal burden: robots go where profitable while others bear the sidewalk cost',
        whoImpacted: "Neighborhood residents and small merchants are affected.",
        mostVulnerable: "Residents of dense, walkable neighborhoods who get no vote on deployment are the most vulnerable.",
        whatMakesWorse: "Citywide pilots approved without ward input make this worse.",
        realWorldCase: "Chicago Alderman Daniel La Spata blocked expansion in his ward after 83% of survey respondents opposed it.",
      },
    ],
    blackSwans: [
      {
        id: 'essential-infrastructure',
        name: 'Robots become essential-goods infrastructure',
        scenario:
          'After the courier workforce shrinks, homebound residents depend on robot and drone delivery for groceries and prescriptions. A fleet-wide outage, regulatory grounding or storm cuts deliveries for days.',
        whoImpacted: "Homebound residents, pharmacies, grocers and social services are affected.",
        mostVulnerable: "Older and disabled residents who can't shop in person are the most vulnerable.",
        whatMakesWorse: "Couriers being pushed out of the market would make this worse, as would one or two fleets dominating.",
      },
      {
        id: 'central-dispatch',
        name: 'Citywide central dispatch at scale',
        scenario:
          'Thousands of robots in one city run on one routing system. A bad update sends them into the same crosswalks, freezes them in intersections or blocks emergency routes across the city.',
        whoImpacted: "Pedestrians, drivers, transit and EMS are affected.",
        mostVulnerable: "People who need the blocked routes, such as patients and wheelchair users, are the most vulnerable.",
        whatMakesWorse: "Fleets of thousands of robots per city would make this worse, as would updates pushed to the whole fleet at once.",
      },
      {
        id: 'hijacked-fleet',
        name: 'Hijacked delivery fleet',
        scenario:
          'Robots or drones with cloud links and remote updates are hacked to block streets, steal cargo, carry dangerous payloads or surveil neighborhoods.',
        whoImpacted: "Everyone on the route, police and operators are affected.",
        mostVulnerable: "Pedestrians and residents near hijacked units are the most vulnerable.",
        whatMakesWorse: "Shared low-altitude traffic networks would make this worse, as would weak device security.",
      },
      {
        id: 'drone-corridors',
        name: 'Dense urban drone corridors',
        scenario:
          'Part 108 or "low-altitude economy" rules open busy corridors over downtowns. A drone hits a medical helicopter or falls into a crowd.',
        whoImpacted: "Residents, event crowds and air-ambulance crews are affected.",
        mostVulnerable: "Crowds, construction workers and aircrews are the most vulnerable.",
        whatMakesWorse: "Temporary obstacles missing from maps would make this worse, as would more operators per corridor.",
      },
      {
        id: 'lights-out-hubs',
        name: 'Lights-out robot hubs in neighborhoods',
        scenario:
          'Unstaffed micro-hubs and humanoid night-sort centers sit next to housing. A battery fire at a charging bank starts overnight with no one on site and spreads.',
        whoImpacted: "Neighbors, firefighters and building owners are affected.",
        mostVulnerable: "Residents of adjacent housing are the most vulnerable.",
        whatMakesWorse: "Hundreds of lithium batteries per site would make this worse, and fire codes have no category for robot charging hubs.",
      },
      {
        id: 'hybrid-bike-lanes',
        name: 'High-speed hybrid robots in bike lanes',
        scenario:
          '20-mph robots that switch between sidewalks, bike lanes and roads scale up. A shared perception flaw causes a string of cyclist injuries that goes unnoticed because nothing requires reporting.',
        whoImpacted: "Cyclists, pedestrians and couriers are affected.",
        mostVulnerable: "Cyclists, including children on bikes, are the most vulnerable.",
        whatMakesWorse: "State laws opening bike lanes to robots would make this worse, and there is no public incident reporting.",
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
        covers: "These laws set robots' size, weight and speed, where they may operate, insurance requirements and rules for yielding to pedestrians.",
        fallsShort: "Limits vary widely, from Washington's 120-lb cap to Pennsylvania's 550 lb. Many of these laws restrict local bans, and few require incident reporting or accessibility standards.",
      },
      {
        id: 'city-row',
        name: 'City sidewalk & right-of-way ordinances and pilot permits (e.g., San Francisco 2017; Chicago PDD pilot 2022)',
        authority: 'City (where states allow)',
        levels: ['City'],
        covers: "San Francisco capped robots at 9 citywide, limited them to 3 mph in industrial areas and required human chaperones. Chicago runs a pilot overseen by its consumer protection and transportation departments.",
        fallsShort: "Pilots often lack public metrics, and complaint data sits with 311 rather than with the permit.",
      },
      {
        id: 'local-bans',
        name: 'Outright local bans (Toronto 2021; Ottawa)',
        authority: 'City',
        levels: ['City'],
        covers: "Toronto bans robots on sidewalks and cycle tracks until provincial rules are in place.",
        fallsShort: "Bans protect access but leave no path to a safe, regulated version of the service.",
      },
      {
        id: 'nhtsa',
        name: 'NHTSA vehicle safety standards & exemptions',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "These standards cover road vehicles. Nuro's R2 received the first exemption for a vehicle with no human controls, with reporting duties attached.",
        fallsShort: "Sidewalk robots fall outside these standards, and exemptions are granted case by case.",
      },
      {
        id: 'state-av',
        name: 'State AV laws & DMV permits',
        authority: 'State',
        levels: ['State'],
        covers: "These laws cover autonomous vehicles that drive on public roads.",
        fallsShort: "Hybrid robots that switch between sidewalks, bike lanes and roads fall between PDD laws and AV rules.",
      },
      {
        id: 'faa',
        name: 'FAA rules (Part 107 waivers; Part 108 BVLOS pending)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "These rules cover drone certification, operations and routes.",
        fallsShort: "Cities can't regulate flight paths or noise. Part 108 was still under White House review as of November 2026, and Texas bars cities from passing drone ordinances.",
      },
      {
        id: 'drone-zoning',
        name: 'City zoning for drone hubs',
        authority: 'City',
        levels: ['City'],
        covers: "Zoning decides where drone nests and launch pads can go.",
        fallsShort: "Zoning decisions are hard to revisit after approval, as Richardson, Texas found.",
      },
      {
        id: 'ada',
        name: 'ADA Title II & III',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "The ADA requires accessible public rights-of-way and services.",
        fallsShort: "No technical rule keeps robots out of curb ramps or sets a minimum clear sidewalk width when robots are present.",
      },
      {
        id: 'tort',
        name: 'Tort & product liability',
        authority: 'State',
        levels: ['State'],
        covers: "Tort and product liability law governs injury claims.",
        fallsShort: "Liability is split across the platform, robot maker, merchant and remote operator, and robots may not stop or identify themselves after a crash.",
      },
      {
        id: 'labor',
        name: 'Labor & employment law (incl. app-based worker pay rules)',
        authority: 'State / City',
        levels: ['State', 'City'],
        covers: "These laws govern courier pay and working conditions.",
        fallsShort: "They don't address robots replacing couriers or the working conditions of remote operators.",
      },
      {
        id: 'privacy',
        name: 'Privacy law (state consumer privacy, wiretap and biometric laws)',
        authority: 'State',
        levels: ['State'],
        covers: "These laws govern how personal data is collected and used.",
        fallsShort: "Continuous video of public spaces is lightly regulated, and there are no rules on how long footage is kept or when police can access it.",
      },
      {
        id: 'china-low-altitude',
        name: "China's low-altitude economy policy & Shenzhen regulations",
        authority: 'National / City (China)',
        levels: ['International'],
        covers: "China's policy creates dedicated drone corridors, landing sites and operator training.",
        fallsShort: "This regime is a comparison point: these cities plan airspace as infrastructure instead of reacting to it.",
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
        detail: {
          title: "Chicago: a pilot that became a political fight",
          deployed:
            "Coco (from late 2024) and Serve (from September 2025) run sidewalk delivery robots under a personal delivery device pilot that the City Council created in 2022.",
          whatHappened:
            "Residents reported robots pushing people off sidewalks, hitting cyclists and blocking emergency vehicles. Robots damaged CTA bus shelters in March 2026, and in September 2026 a routing error sent about a dozen robots to the same Lincoln Park sidewalk.",
          impact:
            "A petition to end the pilot passed 3,700 signatures, and lawsuits followed. Residents also raised concerns about surveillance and job loss.",
          response:
            "The city added a dedicated 311 complaint category. Alderman Daniel La Spata blocked expansion in his ward after 83% of survey respondents opposed it.",
          whatChanged:
            "Ward-by-ward politics now shape where robots can operate, and companies negotiate block by block.",
        },
        place: 'Chicago, IL',
        response: 'Pilot under pressure',
        note: "Chicago has run a personal delivery device pilot since 2022, with Coco joining in 2024 and Serve in 2025. More than 3,700 people signed a petition to end it, and the city created a dedicated 311 category for robot complaints.",
        locations: [{ label: 'Chicago', lat: 41.88, lng: -87.63 }],
        relatedTypeIds: ['sidewalk-robots'],
        relatedRegulationIds: ['city-row'],
      },
      {
        id: 'jersey-city',
        detail: {
          title: "Jersey City: the accountability gap",
          deployed:
            "Avride sidewalk robots began delivering for Uber Eats in February 2025, the first such service on the East Coast, and Grubhub and Coco later joined.",
          whatHappened:
            "In October 2025, a robot entered a bike lane and struck cyclist Conor Shannon, who suffered a concussion and a broken clavicle. The robot kept moving until bystanders stopped it.",
          impact:
            "Shannon is suing Uber and Avride, and his lawyer says residents are \"unwitting crash test dummies.\" Local bike and pedestrian advocates also raised safety concerns.",
          response:
            "The pilot continued, and Avride declined to comment, citing the litigation.",
          whatChanged:
            "The crash showed that robots in bike lanes create a new type of crash that no one is clearly required to report.",
        },
        place: 'Jersey City, NJ',
        response: 'Pilot',
        note: "Jersey City launched the first East Coast Uber Eats robot service in February 2025, and a cyclist injured by a robot sued in 2026.",
        locations: [{ label: 'Jersey City', lat: 40.72, lng: -74.08 }],
        relatedTypeIds: ['sidewalk-robots', 'hybrid-robots'],
        relatedRegulationIds: ['tort'],
      },
      {
        id: 'toronto',
        place: 'Toronto & Ottawa, ON',
        response: 'Ban',
        note: "Toronto banned sidewalk and cycle-track robots in December 2021, and Ottawa told businesses that robots aren't allowed.",
        locations: [
          { label: 'Toronto', lat: 43.65, lng: -79.38 },
          { label: 'Ottawa', lat: 45.42, lng: -75.7 },
        ],
        relatedTypeIds: ['sidewalk-robots'],
        relatedRegulationIds: ['local-bans'],
        detail: {
          title: 'Toronto: banning sidewalk robots',
          deployed:
            "Tiny Mile operated sidewalk delivery robots in Toronto from 2019 to 2021.",
          whatHappened:
            "Toronto's Accessibility Advisory Committee and disability groups argued that the robots created a new barrier for disabled residents.",
          impact:
            "Tiny Mile left Toronto.",
          response:
            "Toronto banned robots from sidewalks and cycle tracks in December 2021.",
          whatChanged:
            "Disability advocates became central to the debate, and companies moved to friendlier cities and states.",
        },
      },
      {
        id: 'san-francisco',
        place: 'San Francisco, CA',
        response: 'Restrictive permits',
        note: "San Francisco's 2017 ordinance allowed 9 robots citywide at 3 mph in industrial zones, with human chaperones.",
        locations: [{ label: 'San Francisco', lat: 37.77, lng: -122.42 }],
        relatedTypeIds: ['sidewalk-robots'],
        relatedRegulationIds: ['city-row'],
        detail: {
          title: 'San Francisco: capping sidewalk robots',
          deployed:
            "Starship, Marble and other companies tested sidewalk delivery robots in San Francisco in 2017.",
          whatHappened:
            "San Francisco's supervisors originally proposed an outright ban and then settled on strict permits.",
          impact:
            "The city's rules allowed 9 robots citywide and 3 per company, capped speed at 3 mph, limited robots to industrial areas and required human chaperones, which effectively restricted them to testing.",
          response:
            "San Francisco chose a cap-and-permit approach, which it later loosened into pilot zones.",
          whatChanged:
            "Robot companies moved to friendlier cities and states.",
        },
      },
      {
        id: 'shenzhen-shanghai',
        detail: {
          title: "Shenzhen: planning the sky as infrastructure",
          deployed:
            "Meituan has delivered by drone since 2021 and has run a commercial network since May 2026, with a second network in Shanghai's West Bund from September 2026. SF Express operates drone stations, and humanoid robots have sorted parcels on the night shift since November 2026.",
          whatHappened:
            "Shenzhen runs more than 300 low-altitude logistics routes and has planned 1,200 takeoff and landing sites. Meituan trained couriers as drone operators. Drone delivery was paused during the APEC summit in November 2026.",
          impact:
            "Deliveries to parks and dense areas became faster, and under good conditions orders can arrive in about 10 minutes.",
          response:
            "City legislation and national policy actively promote the \"low-altitude economy.\"",
          whatChanged:
            "Drone delivery became routine, and some couriers moved into operator roles.",
        },
        place: 'Shenzhen & Shanghai, China',
        response: 'Planned airspace',
        note: "Meituan runs drone delivery networks in both cities, Shenzhen has more than 300 low-altitude logistics routes, and humanoid robots sort parcels at night.",
        locations: [
          { label: 'Shenzhen', lat: 22.54, lng: 114.06 },
          { label: 'Shanghai', lat: 31.23, lng: 121.47 },
        ],
        relatedTypeIds: ['urban-drone-networks', 'humanoid-sorting', 'low-altitude-network'],
        relatedRegulationIds: ['china-low-altitude'],
      },
      {
        id: 'milton-keynes',
        detail: {
          title: "Milton Keynes and Finland: the mature model",
          deployed:
            "Starship robots have delivered groceries in Milton Keynes since 2018 and also operate in Finland and Tallinn.",
          whatHappened:
            "Starship has passed 10 million deliveries across 8 countries, and in Finland it handles about one in five grocery deliveries.",
          impact:
            "Residents of planned towns with wide paths largely embraced the robots, and children left notes and drawings for them.",
          response:
            "The council partnered with Starship and studied the service instead of restricting it.",
          whatChanged:
            "According to company and council studies, robot trips replaced short car trips.",
        },
        place: 'Milton Keynes (UK), Finland, Tallinn',
        response: 'Mature service',
        note: "These were Starship's earliest commercial markets, and Starship now handles about one in five grocery deliveries in Finland.",
        locations: [
          { label: 'Milton Keynes', lat: 52.04, lng: -0.76 },
          { label: 'Helsinki', lat: 60.17, lng: 24.94 },
          { label: 'Tallinn', lat: 59.44, lng: 24.75 },
        ],
        relatedTypeIds: ['sidewalk-robots'],
      },
      {
        id: 'los-angeles',
        place: 'Los Angeles, CA',
        response: 'Largest US market',
        note: "Serve and Coco both run fleets in Los Angeles, and in 2022 a delivery robot crossed police tape at a crime scene.",
        locations: [{ label: 'Los Angeles', lat: 34.05, lng: -118.24 }],
        relatedTypeIds: ['sidewalk-robots'],
      },
      {
        id: 'pennsylvania',
        place: 'Pennsylvania (statewide)',
        response: 'Permissive state law',
        note: "Pennsylvania classes delivery robots as pedestrians and allows robots of up to 550 lb to travel at 12 mph on sidewalks.",
        locations: [{ label: 'Pennsylvania', lat: 40.9, lng: -77.8 }],
        relatedRegulationIds: ['state-pdd'],
      },
      {
        id: 'tennessee',
        place: 'Tennessee (statewide)',
        response: 'Expanded access',
        note: "Since July 2026, Tennessee has allowed robots in bike lanes, on road shoulders and in parking lots.",
        locations: [{ label: 'Tennessee', lat: 35.86, lng: -86.66 }],
        relatedTypeIds: ['hybrid-robots'],
        relatedRegulationIds: ['state-pdd'],
      },
      {
        id: 'fremont',
        place: 'Fremont, CA',
        response: 'New vehicle type',
        note: "Since March 2026, DoorDash Dot has traveled at up to 20 mph across roads, bike lanes and sidewalks in Fremont.",
        locations: [{ label: 'Fremont', lat: 37.55, lng: -121.99 }],
        relatedTypeIds: ['hybrid-robots'],
        relatedRegulationIds: ['state-av'],
      },
      {
        id: 'houston',
        place: 'Houston, TX',
        response: 'Federal exemption',
        note: "Nuro operates its R2 occupant-less delivery vehicles in Houston under a federal exemption.",
        locations: [{ label: 'Houston', lat: 29.76, lng: -95.37 }],
        relatedTypeIds: ['road-av'],
        relatedRegulationIds: ['nhtsa'],
      },
      {
        id: 'drone-tx-az',
        place: 'Tolleson (AZ), College Station & Waco (TX), DFW',
        response: 'Drone delivery',
        note: "Amazon, Wing and Zipline fly delivery drones in these areas, which have seen crashes and noise complaints.",
        locations: [
          { label: 'Tolleson', lat: 33.45, lng: -112.26 },
          { label: 'College Station', lat: 30.63, lng: -96.33 },
          { label: 'Waco', lat: 31.55, lng: -97.15 },
          { label: 'DFW', lat: 32.9, lng: -97.04 },
        ],
        relatedTypeIds: ['delivery-drones'],
        relatedRegulationIds: ['faa', 'drone-zoning'],
      },
    ],
  },
};

export default urbanLogistics;
