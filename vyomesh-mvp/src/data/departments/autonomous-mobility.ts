import type { Department } from '../schema';

const autonomousMobility: Department = {
  id: 'autonomous-mobility',
  number: '01',
  name: 'Autonomous Mobility',
  accent: '#c0562f',
  intro:
    'Robotaxis change who is responsible on the street: there is no driver to ticket, question or direct. Cities feel this first through police and fire interactions, curb space, school zones, special events, labor fights and incident data they do not control. A human driver is one person making one mistake, while a robotaxi fleet is one software system driving thousands of cars. That makes the average trip safer, as the evidence so far suggests for Waymo, but it creates a new kind of failure: the whole fleet can fail at once, in the same way, at the same time.',

  types: {
    intro:
      'Autonomous mobility is in early commercial deployment and scaling fast in a handful of metros, which makes it the most mature embodied AI sector that cities deal with on public streets. Waymo had public riders in 14 US cities by September 2026 and says it will pass 1 million paid trips a week by the end of 2026. Sidewalk delivery robots and delivery drones are covered under Urban Logistics & Delivery.',
    layout: 'landscape',
    theme: 'city',
    ground: [36, 28],
    roads: [
      { from: [-18, 2.8], to: [18, 2.8], width: 2.2 },
      { from: [-2, -8], to: [-2, 14], width: 2.2 },
    ],
    zones: [
      { id: 'city-streets', name: 'City streets & curb pickup', setting: 'street', area: { x: -10, z: -2, w: 14, d: 4 } },
      { id: 'airport', name: 'Defined urban zones & airports', setting: 'airport', area: { x: 9, z: -2.5, w: 14, d: 6 } },
      { id: 'highway', name: 'Interstates & transfer yards', setting: 'highway', area: { x: 0, z: -10.5, w: 36, d: 5 } },
      { id: 'transit', name: 'Downtown transit corridors', setting: 'transit-corridor', area: { x: -10, z: 8, w: 14, d: 6 } },
      { id: 'residential', name: 'Residential & commercial streets', setting: 'residential-street', area: { x: 4.5, z: 8, w: 10, d: 6 } },
      { id: 'remote-ops', name: 'Remote operations centers', setting: 'office', area: { x: 14, z: 8, w: 6, d: 6 } },
    ],
    items: [
      {
        id: 'robotaxis',
        name: 'Robotaxis (Level 4, retrofitted cars)',
        zoneId: 'city-streets',
        model: 'robotaxi',
        howItOperates:
          'Robotaxis drive city streets, mostly under 45 mph, with some freeway and airport service. Riders book on-demand trips through the operator\'s own app or through Uber.',
        examples:
          'Waymo runs in Phoenix, San Francisco, Los Angeles, Austin, Atlanta, Miami, Dallas, Houston, San Antonio, Orlando, Tampa, San Diego, Denver and more. Tesla runs in Austin, and Baidu Apollo Go runs in Wuhan, other Chinese cities and Dubai.',
        whatHappened:
          'Cities have seen stalled cars blocking traffic and fire scenes, school bus violations, curb crowding at bars and airports, and labor protests. Austin built a working group and an incident dashboard in response.',
        outlook:
          'Expect more cities each year, freeway and airport access, cheaper vehicles (Zeekr, Hyundai) and cars that understand hand signals and detours.',
      },
      {
        id: 'purpose-built',
        name: 'Purpose-built robotaxis (no wheel or pedals)',
        zoneId: 'airport',
        model: 'pod',
        howItOperates:
          'These vehicles run shared rides inside defined urban zones, with four passengers facing each other.',
        examples:
          'Zoox has run paid rides in Las Vegas since August 2026, including an airport route, and is testing in San Francisco. Tesla plans a Cybercab.',
        whatHappened:
          'Zoox needed a federal exemption to carry paying riders, and the first one was granted in July 2026.',
        outlook: 'Federal exemption caps are loosening, and more vehicles are being designed for fleets rather than owners.',
      },
      {
        id: 'driverless-trucks',
        name: 'Driverless trucks (Class 8)',
        zoneId: 'highway',
        model: 'truck',
        howItOperates:
          'Driverless trucks haul long-haul freight on interstates between logistics hubs, with transfer yards at the edges of cities.',
        examples:
          'Aurora runs driverless trucks from Dallas to Houston and from Fort Worth to El Paso, and is expanding across the Sun Belt.',
        whatHappened:
          'Cities mostly see traffic around the hubs, while unions push bills requiring human operators. California opened a permit path for heavy-duty autonomous trucks in 2026.',
        outlook:
          'Aurora expects hundreds of driverless trucks by the end of 2026, with hub-to-hub networks and a possible federal rulebook through the BUILD America 250 Act.',
      },
      {
        id: 'transit-shuttles',
        name: 'Autonomous transit shuttles and buses',
        zoneId: 'transit',
        model: 'shuttle',
        howItOperates:
          'Shuttles and buses run fixed downtown routes, campuses and rural towns, providing first- and last-mile service and circulators and filling driver shortages.',
        examples:
          'Jacksonville runs NAVI on the 3.5-mile Bay Street corridor, and Malung-Sälen, Sweden runs the SIKTA bus with a safety driver. Oslo, Hamburg and Stockholm are running trials.',
        whatHappened:
          'Jacksonville made NAVI ADA-accessible and part of its transit system, and is exploring expansion to the Beaches. In rural Sweden, regulation and the business model are the main blockers.',
        outlook: 'Full-size autonomous buses are coming, along with retrofits of existing transit fleets (JTA issued an RFP in 2026).',
      },
      {
        id: 'low-speed-delivery',
        name: 'Low-speed driverless delivery vehicles',
        zoneId: 'residential',
        model: 'delivery-van',
        howItOperates: 'These small vehicles carry groceries, food and parcels on residential and commercial streets at low speed.',
        examples: 'Nuro now licenses its technology, and Robomart is under NHTSA exemption review in 2026.',
        whatHappened: 'Vehicle law applies to them rather than sidewalk law, and they create parking and curb conflicts.',
        outlook: 'They will grow as exemptions are granted and overlap with the sidewalk robots covered under Urban Logistics.',
      },
      {
        id: 'remote-operations',
        name: 'Remote operations centers',
        zoneId: 'remote-ops',
        model: 'control-desk',
        howItOperates:
          'Humans in offices, sometimes overseas, answer cars\' questions, call 911, guide stuck vehicles and sometimes drive them remotely. Waymo has about 70 agents on duty for about 3,000 robotaxis.',
        examples: 'Waymo has centers in Arizona, Michigan and two in the Philippines, and Tesla has teleoperators in Texas.',
        whatHappened:
          'The Senate held a hearing in February 2026, and Senator Markey asked NHTSA to investigate. There are no rules on where operators sit, staffing ratios or qualifications.',
        outlook: 'Remote operations are likely the first target of federal or state rules, such as ratios, onshore requirements and licensing.',
      },
    ],
  },

  risks: {
    intro:
      'Likely risks come first, then black swans. Severity is the harm to people if the risk happens, and likelihood is over the next few years in a city with active deployment.',
    current: [
      {
        id: 'blocking-emergency',
        name: 'Blocking emergency vehicles and scenes (stalling, entering fire scenes, ignoring police directions)',
        likelihood: 'High',
        severity: 'High',
        whoImpacted: 'Firefighters, EMS and police are affected.',
        mostVulnerable: 'People waiting for emergency care are the most vulnerable.',
        whatMakesWorse:
          'More cars per city make this worse, as do untrained crews in each new city and heavy event days.',
        realWorldCase:
          "San Francisco's fire department logged dozens of interferences in 2023, and Austin's dashboard shows 7 cases of cars ignoring police direction in 2026. In response, Austin expects operators to keep cars 1,000 feet from emergencies, Texas requires First Responder Interaction Plans, and California created an emergency hotline and \"do not enter\" zones in July 2026.",
      },
      {
        id: 'school-zones',
        name: 'School zone and school bus failures',
        likelihood: 'Medium',
        severity: 'High',
        whoImpacted: 'Children, crossing guards and bus drivers are affected.',
        mostVulnerable: 'Children are the most vulnerable.',
        whatMakesWorse: 'Expansion into suburbs with more bus routes makes this worse, as do software updates that regress.',
        realWorldCase:
          'Austin ISD documented 19 to 20 illegal passes of stopped school buses in fall 2025, some after Waymo said the problem was fixed. Waymo recalled 3,067 vehicles in December 2025, violations continued, and NHTSA and the NTSB are investigating. A Waymo hit a 9-year-old near a Santa Monica school in January 2026, causing minor injuries.',
      },
      {
        id: 'pedestrian-collisions',
        name: 'Pedestrian and cyclist collisions',
        likelihood: 'Medium',
        severity: 'High',
        whoImpacted: 'Pedestrians and cyclists are affected.',
        mostVulnerable: 'People with disabilities and older adults are the most vulnerable.',
        whatMakesWorse: 'Faster speeds and freeways make this worse, as do denser downtowns and night operations.',
        realWorldCase:
          'In San Francisco in October 2023, a Cruise car dragged a pedestrian about 20 feet after a human driver hit her; California suspended Cruise and GM later shut it down. In Dallas in August 2026, there was a fatal crash in which police said Waymo was not at fault.',
      },
      {
        id: 'accountability-gap',
        name: 'Accountability gap (no one to ticket)',
        likelihood: 'High',
        severity: 'Medium',
        whoImpacted: 'Police, courts and crash victims are affected.',
        mostVulnerable: 'Crash victims seeking compensation are the most vulnerable.',
        whatMakesWorse: 'More operators, each with different procedures, make this worse.',
        realWorldCase:
          'Texas requires a signed ticket, so Austin must escalate to a Class A misdemeanor (GOV-02). California created "notices of noncompliance" from July 2026, and repeated notices can cost a company its permit.',
      },
      {
        id: 'curb-congestion',
        name: 'Curb and congestion effects (empty miles, pickup crowding)',
        likelihood: 'High',
        severity: 'Low to medium',
        whoImpacted: 'Transit riders and delivery drivers are affected.',
        mostVulnerable: 'Wheelchair users who need curb access are the most vulnerable.',
        whatMakesWorse: 'Fleet growth makes this worse, as does demand around airports and events.',
        realWorldCase:
          "DC's bill adds a 15-cents-per-mile fee to discourage empty driving, and Austin asks operators for event pickup zones.",
      },
      {
        id: 'job-loss',
        name: 'Job loss for drivers',
        likelihood: 'Medium now, high later',
        severity: 'Medium',
        whoImpacted: 'Taxi, rideshare and truck drivers are affected.',
        mostVulnerable: 'Drivers who are often immigrants are the most vulnerable.',
        whatMakesWorse: 'Cheaper vehicles make this worse, as does trucking scaling up.',
        realWorldCase:
          "Boston is pushing an ordinance that would require a human safety operator and a labor board. A Minneapolis council bill was vetoed by the mayor, and the Teamsters and other unions slowed DC's bill.",
      },
      {
        id: 'privacy',
        name: 'Privacy and surveillance (cars as roaming cameras)',
        likelihood: 'High',
        severity: 'Medium',
        whoImpacted: 'Everyone on the street is affected.',
        mostVulnerable: 'Protesters and immigrants are the most vulnerable.',
        whatMakesWorse: 'Police requests for footage make this worse, as do more cars on the road.',
        realWorldCase:
          'Police have requested robotaxi footage as evidence, and Waymo shares data with police case by case. Austin says Waymo does not share video with the city, while Tesla does (GOV-02).',
      },
      {
        id: 'weather',
        name: 'Weather and unusual conditions',
        likelihood: 'Medium',
        severity: 'Medium',
        whoImpacted: 'Stranded riders and other drivers are affected.',
        whatMakesWorse: 'Expansion into snow cities such as Denver, Pittsburgh, Boston and Detroit makes this worse.',
        realWorldCase:
          'Tesla paused its Austin service for several days during an ice storm in January 2026. Malung-Sälen is testing in snow with a safety driver.',
      },
      {
        id: 'hidden-data',
        name: 'Hidden or redacted safety data',
        likelihood: 'High',
        severity: 'Medium',
        whoImpacted: 'Regulators, researchers and the public are affected.',
        whatMakesWorse: 'More operators make this worse, as do weak reporting rules.',
        realWorldCase:
          "Tesla redacted every crash narrative in NHTSA's database until May 2026, when it revealed two crashes that happened during remote driving.",
      },
      {
        id: 'accessibility',
        name: "Accessibility gaps (riders who can't use the app or vehicle)",
        likelihood: 'Medium',
        severity: 'Medium',
        whoImpacted: 'Riders with disabilities are affected.',
        mostVulnerable: 'Blind and Deaf riders and wheelchair users are the most vulnerable.',
        whatMakesWorse: 'Purpose-built vehicles that are not designed for wheelchairs make this worse.',
        realWorldCase:
          "Most robotaxis are not wheelchair accessible, while Jacksonville's NAVI is ADA accessible. GOV-02 noted that blind and Deaf riders gain independence when the service works.",
      },
    ],
    blackSwans: [
      {
        id: 'fleet-freeze',
        name: 'Fleet-wide freeze',
        likelihood: 'Low to medium',
        severity: 'High',
        scenario: 'A software bug or lost connection stops hundreds of cars in the middle of traffic at the same time.',
        whoImpacted: 'Riders stranded on highways, all road users and people needing ambulances are affected.',
        whatMakesWorse: 'Bigger fleets per city would make this worse, as would heavier reliance on cloud and cell networks.',
        realWorldCase:
          'In Wuhan on March 31, 2026, more than 100 Apollo Go robotaxis froze, some on elevated roads, and riders could not reach customer service. Police blamed a system failure, and China then paused new robotaxi licenses.',
      },
      {
        id: 'outage-cascade',
        name: 'City-wide outage cascade',
        likelihood: 'Medium',
        severity: 'High',
        scenario: "The power or cell network goes down, so cars can't read signals or reach remote help.",
        whoImpacted: 'The whole city and first responders are affected during a disaster.',
        whatMakesWorse: 'Climate disasters, grid stress and large events would make this worse.',
        realWorldCase:
          "In San Francisco on December 20, 2025, a substation fire cut power to about 130,000 customers. Waymos stalled at dark intersections, and because cell networks were overloaded, the cars couldn't get remote confirmation. Waymo suspended service and pushed a fleet-wide update in January.",
      },
      {
        id: 'bad-update',
        name: 'Bad update across the fleet',
        likelihood: 'Medium',
        severity: 'High',
        scenario: 'A recall fix creates new failures everywhere at once.',
        whoImpacted: 'Everyone in every city the fleet serves is affected.',
        whatMakesWorse: 'Fast release cycles would make this worse, as would end-to-end models that are harder to test.',
        realWorldCase:
          "After Waymo's school bus fix, Austin ISD reported that violations continued, and NHTSA opened an inquiry into whether the recall worked.",
      },
      {
        id: 'hijacked-fleet',
        name: 'Hijacked fleet or remote operations center',
        likelihood: 'Low',
        severity: 'Very high',
        scenario: 'A cyberattack or an insider takes control of the fleet.',
        whoImpacted: 'Riders, pedestrians and critical sites are affected.',
        whatMakesWorse: 'Overseas remote centers would make this worse, as would foreign-made vehicles and more remote driving.',
        realWorldCase:
          "There is no public case yet. Senators raised the risk at the February 2026 hearing and asked about Waymo's Philippines centers and China-built vehicles, and Senator Markey asked NHTSA to investigate.",
      },
      {
        id: 'evacuation-failure',
        name: 'Evacuation failure',
        likelihood: 'Low',
        severity: 'Very high',
        scenario:
          'During a wildfire, flood or hurricane, the fleet blocks roads or refuses to enter risk zones.',
        whoImpacted: 'People without cars are affected.',
        mostVulnerable: 'Older adults and disabled residents who rely on rides are the most vulnerable.',
        whatMakesWorse: 'Cities becoming dependent on robotaxis for car-free residents would make this worse.',
        realWorldCase:
          'This has not happened yet, but the Palisades fire (2025) and the San Francisco blackout show the ingredients: dead signals, crowded roads and overloaded networks.',
      },
      {
        id: 'mass-casualty',
        name: 'Mass-casualty misuse',
        likelihood: 'Very low',
        severity: 'Very high',
        scenario: 'A vehicle is used to carry explosives or is rammed into a crowd.',
        whoImpacted: 'Crowds and events are affected.',
        whatMakesWorse: 'Cars that will take any passenger or package would make this worse.',
        realWorldCase:
          "In December 2025, a Waymo drove a passenger into an apparent police standoff, showing that the cars can't read danger the way people do.",
      },
      {
        id: 'legal-whiplash',
        name: 'Legal whiplash',
        likelihood: 'Medium',
        severity: 'Medium to high',
        scenario: 'Federal preemption wipes out city and state safeguards overnight.',
        whoImpacted: 'Cities, first responders and crash victims are affected.',
        whatMakesWorse: 'Congress folding AV rules into must-pass bills would make this worse.',
        realWorldCase:
          'The SELF DRIVE Act passed committee 12–11 in February 2026 with broad preemption, and counties (NACo) and insurers oppose it.',
      },
    ],
  },

  regulation: {
    intro:
      'The federal government regulates the vehicle (design standards, recalls, crash reporting and exemptions) and interstate trucking, but there is no federal law written specifically for AVs yet. States decide who can operate, licensing and permits, traffic law, insurance and often whether cities can regulate at all, and most states with deployments preempt cities. Cities control curbs, parking, street design, airports and city property, their own police and fire procedures, data requests and business licenses where they are not preempted. Cities that are not preempted, such as DC and Boston, can decide whether robotaxis operate at all.',
    laws: [
      {
        id: 'nhtsa-framework',
        name: 'NHTSA AV Framework (April 2025) and July 2026 package',
        authority: 'Federal',
        levels: ['Federal'],
        covers:
          'The framework speeds up exemptions for vehicles without manual controls (Zoox got the first on July 30, 2026), adds an interim rule letting already-built vehicles qualify, streamlines crash reporting and plans ADS performance standards.',
        fallsShort:
          'There is no minimum "driving test" for the software yet, exemptions rely on company data, and the AV STEP oversight program was withdrawn.',
      },
      {
        id: 'sgo',
        name: 'NHTSA Standing General Order (crash reporting)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Operators must report crashes.',
        fallsShort:
          'Companies can redact crash narratives, and there is no mileage data, so crash rates are hard to compare. Reporting was also streamlined in 2025.',
      },
      {
        id: 'recalls',
        name: 'Vehicle safety recalls',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Recalls cover defects, including software defects.',
        fallsShort: "Recalls are self-reported, and Waymo's school bus recall did not end the violations.",
      },
      {
        id: 'self-drive-act',
        name: 'SELF DRIVE Act (H.R., 2026)',
        authority: 'Federal, pending',
        levels: ['Federal'],
        covers: 'The bill would create AV safety standards by September 2027 and preempt state and local rules.',
        fallsShort:
          'Cities, counties and insurers oppose the preemption, and critics say its data reporting is weak.',
      },
      {
        id: 'build-america',
        name: 'BUILD America 250 Act, AV subtitle (House passed June 2026)',
        authority: 'Federal, pending',
        levels: ['Federal'],
        covers:
          'The subtitle would create the first federal framework for driverless trucks, with a safety case requirement and review-based preemption.',
        fallsShort: 'It covers trucks only, and the Senate has not acted on it yet.',
      },
      {
        id: 'ca-ab1777',
        name: 'California AB 1777 + DMV regulations (April 28, 2026; in force July 1, 2026)',
        authority: 'State',
        levels: ['State'],
        covers:
          'Police can issue "notices of AV noncompliance" to the company, which must report within 72 hours (24 for serious incidents). The law adds a dedicated emergency phone line, lets local emergency officials order temporary "do not enter" zones, allows permit suspension after repeated notices and creates new heavy-duty truck permits.',
        fallsShort: 'No fines are attached to the notices, and cities still cannot license robotaxis themselves; the CPUC and DMV do.',
      },
      {
        id: 'tx-sb2807',
        name: 'Texas SB 2807 (effective September 2025; enforced May 28, 2026)',
        authority: 'State',
        levels: ['State'],
        covers:
          'Commercial AVs need TxDMV authorization, insurance and a First Responder Interaction Plan filed with DPS. The law also creates a public complaint portal (42 complaints in about three months) and an advisory committee with two Austin seats.',
        fallsShort:
          'It bars "discriminatory" local rules and fees, the DMV cannot immediately suspend a company after a fatality (which Austin wants), and ticketing is still awkward.',
      },
      {
        id: 'pa-act130',
        name: 'Pennsylvania Act 130 of 2022 (Title 75, Ch. 85) + PennDOT Pub. 950',
        authority: 'State',
        levels: ['State'],
        covers:
          'PennDOT certifies testers and deployers, with or without a safety driver, and runs an HAV Advisory Committee. There were 7 certificate holders (GOV-04).',
        fallsShort:
          'The law moved authority away from cities like Pittsburgh, and there was no fully driverless operation on Pennsylvania roads as of March 2026.',
      },
      {
        id: 'nyc-permit',
        name: 'NYC testing permit',
        authority: 'City',
        levels: ['City'],
        covers: 'A safety driver is required at all times, and only experienced companies may test.',
        fallsShort: 'Commercial driverless service would need a change in state law.',
      },
      {
        id: 'dc-act',
        name: 'DC AV Deployment Authorization Amendment Act of 2026 (pending)',
        authority: 'City (DC acts as a state)',
        levels: ['City', 'State'],
        covers:
          'The bill creates a permit program, data reporting to DDOT and a 15-cents-per-mile fee split between Metro and driver workforce support, with the earliest passengers around January 2028.',
        fallsShort: 'It has been delayed, and the mayor-elect and council members want more worker protections.',
      },
      {
        id: 'boston-ordinance',
        name: 'Boston proposed ordinance',
        authority: 'City',
        levels: ['City'],
        covers: 'The ordinance would require a human safety operator and a labor and small business advisory board.',
        fallsShort: 'Waymo calls it a ban, and state law may override it.',
      },
      {
        id: 'traffic-law',
        name: 'Traffic law (school buses, yielding, police directions)',
        authority: 'State and local',
        levels: ['State', 'City'],
        covers: 'All 50 states require drivers to stop for school buses.',
        fallsShort: 'Traffic law was written for human drivers, and a ticket requires a person.',
      },
      {
        id: 'liability',
        name: 'Product liability and insurance',
        authority: 'State',
        levels: ['State'],
        covers: 'These laws decide who pays after a crash.',
        fallsShort:
          'The split between operator, vehicle maker, software supplier and remote assistant is unclear, and insurers want states to keep authority.',
      },
      {
        id: 'airports',
        name: 'Airports',
        authority: 'Airport authority (city/county) + FAA',
        levels: ['City', 'Federal'],
        covers: 'Airports control curb access and permits.',
        fallsShort:
          'Each airport negotiates separately, such as Zoox at Harry Reid and Waymo at Phoenix Sky Harbor.',
      },
      {
        id: 'international',
        name: "International: UK Automated Vehicles Act 2024; Japan Level 4 law (2023); Germany Level 4 law (2021); EU rules expected around 2028; Dubai Self-Driving Transport Strategy; Chinese city permits",
        authority: 'National / city',
        levels: ['International'],
        covers:
          'These laws create clear authorization paths, and the UK names the company as legally responsible when the car is driving itself.',
        fallsShort: 'The pace varies, and China paused new licenses after the Wuhan freeze.',
      },
    ],
    gaps: [
      {
        title: 'A software driving test',
        detail: 'There is no minimum performance test for the software before it gets on public streets, although NHTSA says one is coming.',
      },
      {
        title: 'Remote assistance rules',
        detail: 'Nothing sets where remote operators sit, how many cars each one watches, or their training and response times.',
      },
      {
        title: 'Fleet-level emergency rules',
        detail: 'Nothing says what happens when the whole fleet must stop or clear roads, or who can order it.',
      },
      {
        title: 'City access to incident data',
        detail: 'Cities have no right to incident data and video in a standard format.',
      },
      {
        title: 'Meaningful penalties',
        detail: "There are no penalties that matter to a company; a $200 ticket doesn't.",
      },
      {
        title: 'Notice before fleet-wide updates',
        detail: 'Cities get no notice before fleet-wide software updates.',
      },
      {
        title: 'Evacuation and disaster duties',
        detail: 'Fleets have no evacuation or disaster duties.',
      },
      {
        title: 'Labor transition',
        detail: 'There is no labor transition support for drivers.',
      },
    ],
  },

  caseStudies: {
    intro:
      'Cities respond very differently depending on what their state allows. Preempted cities like Austin shape outcomes through working groups, data and evidence, while unpreempted cities like DC and Boston can decide whether robotaxis operate at all. Public agencies that run the service themselves, like Jacksonville, control data, accessibility and routes.',
    places: [
      {
        id: 'austin',
        place: 'Austin, TX',
        response: 'Working group and dashboard',
        note: 'Waymo and Tesla run robotaxis in Austin. The city formed an AV working group and publishes an incident dashboard, but state law (SB 2807) preempts it, and school bus violations led to a federal investigation.',
        locations: [{ label: 'Austin', lat: 30.27, lng: -97.74 }],
        relatedTypeIds: ['robotaxis'],
        relatedRegulationIds: ['tx-sb2807', 'recalls'],
        detail: {
          title: 'Austin, Texas: the working group model',
          deployed: 'Waymo (fully driverless, booked through Uber) and Tesla run robotaxis across central Austin.',
          whatHappened:
            "The city's Citywide AV Working Group runs repeated trainings for police and fire, documents incidents and gives operators maps of fire stations, school zones and valet zones, and it is treated as a national best practice. The city also publishes an incident dashboard, which logged 75 incidents in 2026 by mid-year, including one collision, eight near misses and seven cases of ignoring police direction. On the other hand, Austin ISD logged about 20 illegal school bus passes in fall 2025, some after Waymo said it had fixed the problem, and Tesla's fleet reported 14 crashes in its first 8 months with all details redacted.",
          response:
            "The city relied on the working group and dashboard, school district letters and stop-arm camera evidence sent to NHTSA, and its two seats on the state's AV advisory committee. It cannot license or ban operators because Texas preempts it.",
          whatChanged:
            "The city's evidence led to a federal investigation, a software recall of 3,067 vehicles and Texas's first real authorization system in May 2026.",
        },
      },
      {
        id: 'san-francisco',
        place: 'San Francisco, CA',
        response: 'State permit (DMV + CPUC); AB 1777',
        note: 'Waymo and Zoox operate in San Francisco, where Cruise was shut down. During a December 2025 blackout, Waymo robotaxis stalled at dark intersections.',
        locations: [{ label: 'San Francisco', lat: 37.77, lng: -122.42 }],
        relatedTypeIds: ['robotaxis'],
        relatedRegulationIds: ['ca-ab1777'],
        detail: {
          title: 'San Francisco: the blackout stall',
          deployed: 'About 1,000 Waymo robotaxis operate citywide.',
          whatHappened:
            'On December 20, 2025, a substation fire knocked out power to about 130,000 PG&E customers and traffic signals went dark. Waymos treated the dark signals cautiously and waited for remote confirmation, but cell networks were overloaded, so many sat in intersections. Waymo suspended service until the next day, and no injuries were reported.',
          response:
            'City officials coordinated with Waymo during the outage, and the state DMV met with the city afterward.',
          whatChanged:
            'Waymo pushed fleet-wide updates in January 2026 to handle region-wide outages. It is the clearest US example of a correlated failure.',
        },
      },
      {
        id: 'wuhan',
        place: 'Wuhan, China',
        response: 'National pause on new licenses',
        note: 'Wuhan has more than 1,000 Apollo Go robotaxis, and more than 100 of them froze on March 31, 2026.',
        locations: [{ label: 'Wuhan', lat: 30.59, lng: 114.31 }],
        relatedTypeIds: ['robotaxis'],
        relatedRegulationIds: ['international'],
        detail: {
          title: 'Wuhan, China: fleet freeze at scale',
          deployed: "More than 1,000 Baidu Apollo Go driverless cars operate in Wuhan, China's largest single-city robotaxi fleet.",
          whatHappened:
            'On the evening of March 31, 2026, more than 100 cars stopped in the middle of traffic at the same time, some on elevated ring roads. Riders could not reach customer service, which said it could only look into individual car numbers, and police attributed the event to a system failure.',
          response:
            'The government opened an investigation and paused new robotaxi licenses nationally (reported in late April 2026). This followed a car falling into a construction pit in Chongqing in 2025 and a crash that led Zhuzhou to suspend operations.',
        },
      },
      {
        id: 'jacksonville',
        place: 'Jacksonville, FL',
        response: 'Public transit agency deployment',
        note: 'NAVI is the first autonomous service inside a US public transit system, and it carried more than 15,200 riders in its first year.',
        locations: [{ label: 'Jacksonville', lat: 30.33, lng: -81.66 }],
        relatedTypeIds: ['transit-shuttles'],
        detail: {
          title: 'Jacksonville, Florida: robotaxi tech inside public transit',
          deployed:
            'The Jacksonville Transportation Authority launched NAVI autonomous shuttles (9 seats, ADA accessible) on a 3.5-mile downtown corridor on June 30, 2025.',
          whatHappened:
            'NAVI carried more than 15,200 riders and drove 61,000 autonomous miles in its first year, and Holon is building a shuttle factory in the city. Ridership is modest, so the case for scaling still has to be made.',
          response:
            'The city owns the service, and JTA is now exploring expansion to the Beaches and retrofitting regular buses.',
          whatChanged:
            'Because the public agency is the operator, it controls data, accessibility and routes, which makes it a useful contrast to private robotaxis.',
        },
      },
      {
        id: 'malung-salen',
        place: 'Malung-Sälen, Sweden',
        response: 'Public pilot with safety driver',
        note: 'The SIKTA self-driving bus serves a ski resort town, supported by a network of Nordic regulators.',
        locations: [{ label: 'Malung-Sälen', lat: 60.68, lng: 13.72 }],
        relatedTypeIds: ['transit-shuttles'],
        detail: {
          title: 'Malung-Sälen, Sweden: rural test, regional network',
          deployed:
            'A self-driving bus with a safety driver serves a town of about 2,000 residents that gets about 100,000 visitors, to cover a bus driver shortage (GOV-07).',
          whatHappened:
            'The bus is being tested in mountains, snow and rural roads. Regulation (EU rules are expected around 2028) and the business model are the main blockers.',
          response:
            'The town helped start a Nordic arena where transport authorities meet to adjust regulations together, working at local, regional, national and Nordic levels.',
        },
      },
      {
        id: 'pittsburgh',
        place: 'Pittsburgh, PA',
        response: 'State certification (PennDOT)',
        note: 'Pittsburgh hosts Waymo supervised testing, Aurora\'s headquarters and CMU, after earlier Uber and Argo testing, but the city has little say over AVs.',
        locations: [{ label: 'Pittsburgh', lat: 40.44, lng: -80.0 }],
        relatedTypeIds: ['robotaxis', 'driverless-trucks'],
        relatedRegulationIds: ['pa-act130'],
        detail: {
          title: 'Pittsburgh: from testing capital to a city with no veto',
          deployed:
            'Pittsburgh hosted Uber, Argo AI, Aurora and Motional testing in the late 2010s. Waymo began testing in December 2025 and got PennDOT certification in early 2026 to test autonomously with a specialist behind the wheel.',
          whatHappened:
            "Pittsburgh has a strong university and industry base and a state test track for first responders, but it lacks city authority. The city's delivery robot pilots showed poor community engagement and robots getting stuck on curb ramps (GOV-03).",
          response:
            "The city adopted Shared + Autonomous Mobility Principles and runs DOMI's Emerging Tech Roundtable with other cities, but Act 130 (2022) moved authority to PennDOT. PennDOT runs a web app listing AV technology in the state and is building PennSTART, a $20 million test track that will also train first responders.",
          whatChanged:
            "The city's tools are now principles, roundtables and data requests rather than permits (GOV-03, GOV-04).",
        },
      },
      {
        id: 'santa-monica',
        place: 'Santa Monica / Los Angeles, CA',
        response: 'NTSB and NHTSA investigation',
        note: 'A Waymo hit a child near a school in January 2026.',
        locations: [{ label: 'Santa Monica', lat: 34.02, lng: -118.49 }],
        relatedTypeIds: ['robotaxis'],
      },
      {
        id: 'phoenix',
        place: 'Phoenix, AZ',
        response: 'Permissive state; early first-responder playbooks',
        note: 'Phoenix is the longest-running robotaxi market and includes airport service.',
        locations: [{ label: 'Phoenix', lat: 33.45, lng: -112.07 }],
        relatedTypeIds: ['robotaxis'],
        relatedRegulationIds: ['airports'],
      },
      {
        id: 'dallas',
        place: 'Dallas, TX',
        response: 'State authorization',
        note: 'Waymo launched in Dallas in February 2026, and a fatal crash in August 2026 was found not to be Waymo\'s fault. Aurora runs driverless truck lanes from the area.',
        locations: [{ label: 'Dallas', lat: 32.78, lng: -96.8 }],
        relatedTypeIds: ['robotaxis', 'driverless-trucks'],
      },
      {
        id: 'houston',
        place: 'Houston, TX',
        response: 'State authorization',
        note: 'Waymo launched in Houston, which is also an endpoint of Aurora\'s truck route. The city has no incident dashboard.',
        locations: [{ label: 'Houston', lat: 29.76, lng: -95.37 }],
        relatedTypeIds: ['robotaxis', 'driverless-trucks'],
      },
      {
        id: 'atlanta',
        place: 'Atlanta, GA',
        response: 'Federal investigation',
        note: 'Waymo operates in Atlanta through Uber, and a school bus incident there started an NHTSA probe.',
        locations: [{ label: 'Atlanta', lat: 33.75, lng: -84.39 }],
        relatedTypeIds: ['robotaxis'],
        relatedRegulationIds: ['recalls'],
      },
      {
        id: 'las-vegas',
        place: 'Las Vegas, NV',
        response: 'Federal exemption; county airport permit',
        note: 'Zoox runs paid rides and airport service in Las Vegas.',
        locations: [{ label: 'Las Vegas', lat: 36.17, lng: -115.14 }],
        relatedTypeIds: ['purpose-built'],
        relatedRegulationIds: ['nhtsa-framework', 'airports'],
      },
      {
        id: 'boston',
        place: 'Boston, MA',
        response: 'Proposed restriction',
        note: 'Waymo is mapping Boston, and a union-backed ordinance has been proposed.',
        locations: [{ label: 'Boston', lat: 42.36, lng: -71.06 }],
        relatedRegulationIds: ['boston-ordinance'],
      },
      {
        id: 'washington-dc',
        place: 'Washington, DC',
        response: 'Permit program proposed; delayed',
        note: 'Waymo is testing in DC, and a deployment bill is pending.',
        locations: [{ label: 'Washington', lat: 38.91, lng: -77.04 }],
        relatedRegulationIds: ['dc-act'],
      },
      {
        id: 'minneapolis',
        place: 'Minneapolis, MN',
        response: 'Vetoed by mayor',
        note: 'A council bill requiring human safety supervisors was vetoed by the mayor.',
        locations: [{ label: 'Minneapolis', lat: 44.98, lng: -93.27 }],
      },
      {
        id: 'new-york',
        place: 'New York, NY',
        response: 'City testing permit',
        note: 'New York issues testing permits that require a safety driver.',
        locations: [{ label: 'New York', lat: 40.71, lng: -74.01 }],
        relatedRegulationIds: ['nyc-permit'],
      },
      {
        id: 'dubai',
        place: 'Dubai, UAE',
        response: 'Government-led rollout',
        note: 'Commercial robotaxis have run in Dubai since March 30, 2026, with 100 vehicles from Apollo Go and WeRide (through Uber), and the city aims for 25% of trips to be autonomous by 2030.',
        locations: [{ label: 'Dubai', lat: 25.2, lng: 55.27 }],
        relatedTypeIds: ['robotaxis'],
      },
      {
        id: 'tokyo',
        place: 'Tokyo, Japan',
        response: 'National Level 4 law',
        note: 'Waymo is working with Nihon Kotsu and GO, with a launch targeted for 2027.',
        locations: [{ label: 'Tokyo', lat: 35.68, lng: 139.69 }],
        relatedRegulationIds: ['international'],
      },
      {
        id: 'london',
        place: 'London, UK',
        response: 'Automated Vehicles Act 2024',
        note: "Waymo is testing in London for the UK's pilot scheme.",
        locations: [{ label: 'London', lat: 51.51, lng: -0.13 }],
        relatedRegulationIds: ['international'],
      },
    ],
    scenarios: [
      {
        horizon: '1 year (2027)',
        best: 'Robotaxis run in 20+ US cities with standard first-responder plans, and NHTSA publishes a draft ADS performance standard.',
        worst: 'A robotaxi kills a child near a school, leading to a national backlash and a patchwork of bans.',
        surprise: 'Federal preemption passes inside a transportation bill and voids city and state rules overnight.',
        whatToDo:
          'Start a working group before launch, sign data and emergency contact agreements, and map school zones, fire stations and event zones for operators.',
      },
      {
        horizon: '5 years (2031)',
        best: 'Robotaxis cut serious crashes in the areas they serve, transit agencies run autonomous shuttles that fill coverage gaps, and drivers are retrained.',
        worst: 'Empty-mile congestion grows, transit ridership falls, curbs become chaotic, and a fleet-wide freeze hits during a hurricane evacuation.',
        surprise: 'Remote assistance becomes the bottleneck: a cyberattack on an overseas operations center grounds fleets in several cities.',
        whatToDo:
          'Price curbs and empty miles, require outage and evacuation plans, ask for onshore or audited remote operations, and build a shared incident database with peer cities.',
      },
      {
        horizon: '10 years (2036)',
        best: 'Most ride-hail and much freight is autonomous, parking lots are redeveloped and traffic deaths drop sharply.',
        worst: 'Two or three companies control city mobility, cities are dependent with no leverage, and job losses are concentrated in immigrant communities.',
        surprise: 'Car ownership collapses faster than expected, and gas tax and parking revenue disappear, creating a budget crisis.',
        whatToDo:
          'Plan replacement revenue such as per-mile fees, keep public transit as the backbone, and negotiate public data rights early.',
      },
    ],
  },

  sources: [
    { title: 'TechCrunch: Waymo now in 10 US cities (Feb 24, 2026)', url: 'https://www.techcrunch.com/2026/02/24/waymo-robotaxis-are-now-operating-in-10-us-cities/' },
    { title: 'CleanTechnica: Waymo invites riders in 3 new cities, now 14 (Sept 1, 2026)', url: 'https://cleantechnica.com/2026/09/01/waymo-invites-riders-in-3-new-cities' },
    { title: 'TT News / Bloomberg: Waymo targets 1M weekly rides', url: 'https://www.ttnews.com/articles/waymo-eyes-1-million-rides' },
    { title: 'Holland & Knight: NHTSA July 2026 AV package', url: 'https://www.hklaw.com/en/insights/publications/2026/07/green-lights-and-red-flags-autonomous-vehicles-rule-the-roads' },
    { title: 'Baker Donelson: Zoox first Part 555 exemption', url: 'https://www.bakerdonelson.com/nhtsa-signals-flexible-approach-to-av-regulation-what-manufacturers-need-to-know' },
    { title: 'Federal Register: AV STEP withdrawal', url: 'https://public-inspection.federalregister.gov/2026-12980.pdf' },
    { title: 'Smart Cities Dive: SELF DRIVE Act committee vote', url: 'https://www.smartcitiesdive.com/news/av-federal-legislation-city-state-regulatory-authority/809954/' },
    { title: 'Holland & Knight: House passes BUILD America 250 AV framework', url: 'https://www.hklaw.com/en/insights/publications/2026/06/house-passes-autonomous-vehicles-framework' },
    { title: 'NACo on federal preemption', url: 'https://www.naco.org/news/congress-nears-agreement-comprehensive-framework-autonomous-vehicles' },
    { title: 'CA DMV: new AV regulations (Apr 28, 2026)', url: 'https://www.dmv.ca.gov/portal/?p=321530' },
    { title: 'CA DMV: Notice of AV Noncompliance memo', url: 'https://www.dmv.ca.gov/portal/file/avim-2026-002-notice-of-autonomous-vehicles-noncompliance-pdf/' },
    { title: "Covington on California's AV rules", url: 'https://www.cov.com/en/news-and-insights/insights/2026/05/californias-new-av-rules-open-door-to-heavy-duty-deployment-while-imposing-significant-new-compliance-obligations' },
    { title: 'TxDMV AV program (SB 2807)', url: 'https://www.txdmv.gov/AVprogram' },
    { title: 'CBS Austin: SB 2807 and Austin dashboard', url: 'https://cbsaustin.com/news/local/story/new-texas-law-tightens-rules-for-autonomous-vehicle-companies-including-waymo' },
    { title: 'Community Impact: Texas Senate hearing (42 complaints)', url: 'https://communityimpact.com/central-austin/texas-legislature/texas-senators-weigh-impact-of-driverless-vehicles-amid-recent-state-regulations/' },
    { title: 'City of Austin AV dashboard', url: 'https://austin.maps.arcgis.com/apps/dashboards/dbd59d9b20634de1afad32a8267b739b' },
    { title: 'KXAN: NHTSA probing Waymo recall', url: 'https://www.kxan.com/investigations/nhtsa-probing-waymo-software-recall-after-bus-violations/amp/' },
    { title: 'CBS: Waymo recalls 3,000+ vehicles', url: 'https://www.cbsnews.com/amp/news/waymo-recall-3000-vehicles-software-school-bus' },
    { title: 'NTSB: Santa Monica child pedestrian (HWY26FH008)', url: 'https://www.ntsb.gov/investigations/Pages/HWY26FH008.aspx' },
    { title: 'EVwire: Dallas fatal crash', url: 'https://evwire.com/p/waymo-fatal-accident-dallas-pedestrian-everything-we-know' },
    { title: 'Axios: SF power outage', url: 'https://www.axios.com/2025/12/22/waymo-robotaxi-san-francisco-risk' },
    { title: 'Fast Company: why Waymo went down', url: 'https://www.fastcompany.com/91465377/waymo-san-francisco-outage-robotaxi' },
    { title: 'WardsAuto: Waymo fleet-wide update after blackout', url: 'https://www.wardsauto.com/news/waymo-san-francisco-blackout-robotaxi-suspended/808529/' },
    { title: 'The Next Web: Wuhan fleet freeze', url: 'https://thenextweb.com/news/baidu-apollo-go-robotaxi-wuhan-mass-malfunction' },
    { title: 'Semafor: China slows robotaxi rollout', url: 'https://www.semafor.com/article/04/29/2026/china-slows-robotaxi-rollout-after-system-failure' },
    { title: 'CarNewsChina: Wuhan stranding', url: 'https://carnewschina.com/2026/04/01/apollo-gos-robotaxi-fleet-suffers-mass-paralysis-stranding-passengers-on-elevated-highways/' },
    { title: 'CBS: Tesla 14 crashes in Austin', url: 'https://www.cbsnews.com/news/tesla-robotaxi-austin-14-crashes-nhtsa' },
    { title: 'TechCrunch: Tesla teleoperator crashes', url: 'https://www.techcrunch.com/2026/05/15/tesla-reveals-two-robotaxi-crashes-involving-teleoperators/' },
    { title: 'Axios: Markey on remote assistance (70 agents, 3,000 cars)', url: 'https://www.axios.com/2026/03/31/autonomous-vehicles-remote-av-federal-markey' },
    { title: "Automotive World: Waymo's four remote centers", url: 'https://www.automotiveworld.com/?p=461128' },
    { title: 'Fox: Zoox airport service', url: 'https://www.fox5atlanta.com/news/zoox-las-vegas-airport' },
    { title: 'Dallas Innovates: Aurora El Paso lane', url: 'https://dallasinnovates.com/?p=281356' },
    { title: 'Arizona Tech Council: Aurora 200 trucks', url: 'https://www.aztechcouncil.org/?p=26066' },
    { title: 'Sustainable Bus: NAVI first year', url: 'https://www.sustainable-bus.com/news/jta-navi-project-one-year-jacksonville/' },
    { title: 'Dubai Media Office: commercial robotaxis', url: 'https://mediaoffice.ae/en/news/2026/march/30-3/rta-launches-commercial-operations-involving-autonomous-taxis' },
    { title: 'Khaleej Times: 100 robotaxis in Dubai', url: 'https://www.khaleejtimes.com/uae/transport/dubai-launches-self-driving-taxi-service-in-umm-suqeim-jumeirah' },
    { title: 'Automotive World: Waymo Tokyo 2027', url: 'https://www.automotiveworld.com/news/waymo-targets-a-2027-tokyo-launch-with-two-local-partners/' },
    { title: 'Axios Pittsburgh: Waymo expands push', url: 'https://www.axios.com/local/pittsburgh/2026/03/06/waymo-expands-robotaxi-push-in-pittsburgh' },
    { title: 'City of Pittsburgh: Autonomous Technology', url: 'https://www.pittsburghpa.gov/Resident-Services/Road-Maintenance/Road-Safety/Autonomous-Technology' },
    { title: 'Axios Pittsburgh: PennSTART', url: 'https://www.axios.com/local/pittsburgh/2025/05/06/pittsburgh-aurora-driverless-trucks-texas' },
    { title: 'Boston.com: Boston ordinance debate', url: 'https://www.boston.com/news/local-news/2025/10/30/attack-on-our-way-of-life-debate-around-autonomous-vehicles-heats-up-in-boston' },
    { title: 'Bloomberg Government: unions and DC bill (Minneapolis veto)', url: 'https://news.bgov.com/new-york-brief/unions-raise-job-loss-issue-in-fight-to-limit-waymo-cars-in-dc' },
    { title: 'WTOP: DC bill and VMT fee', url: 'https://wtop.com/dc/2026/07/future-of-driverless-vehicles-robotaxis-to-be-debated-by-dc-council/' },
    { title: 'WJLA: DC timeline and delay', url: 'https://wjla.com/news/local/will-driverless-robotaxis-operate-in-dc-their-fate-could-be-decided-thursday' },
    { title: 'PopSci: NYC testing permit', url: 'https://www.popsci.com/technology/nyc-robotaxis-driverless/' },
  ],
};

export default autonomousMobility;
