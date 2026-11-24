import type { Department } from '../schema';

const healthcare: Department = {
  id: 'healthcare',
  number: '09',
  name: 'Healthcare & Social Services',
  accent: '#8e3a8f',
  intro:
    'Physical AI has already begun to be implemented in this space. The governance questions that matter happen in three instances: where a hospital robot leaves the building (sidewalks, airspace, homes), where a care device becomes a public service (agency-funded companions), and where it touches emergency response.',

  types: {
    intro:
      'Ten types are in real use today, across five city zones. The most mature are hospital logistics robots and medical delivery drones. Home companion robots are the fastest-growing type bought with public money.',
    zones: [
      { id: 'hospitals', name: 'Hospitals & clinics', setting: 'hospital' },
      { id: 'homes', name: 'Homes (aging in place)', setting: 'home' },
      { id: 'homes-clinics', name: 'Homes & clinics', setting: 'home' },
      { id: 'ltc', name: 'Long-term care facilities', setting: 'care-home' },
      { id: 'airspace', name: 'Airspace', setting: 'air' },
      { id: 'sidewalks', name: 'Sidewalks & streets', setting: 'sidewalk' },
    ],
    items: [
      {
        id: 'logistics-robots',
        name: 'Autonomous logistics robots',
        zoneId: 'hospitals',
        model: 'hospital-cart',
        howItOperates:
          'Carry meds, lab samples and linens; ride elevators and open doors over hospital Wi-Fi or 5G; badge into restricted areas.',
        examples: 'Diligent Moxi, Aethon TUG, NEURA bed mover',
        whatHappened:
          'Moxi passed 1.25M deliveries across ~25 US hospitals; maker bought by sidewalk-robot firm Serve in Jan 2026. TUG fleet was found remotely hijackable in 2022.',
      },
      {
        id: 'surgical-robots',
        name: 'Surgical robots',
        zoneId: 'hospitals',
        model: 'surgical-robot',
        howItOperates:
          'Surgeon-teleoperated arms inside the OR; research moving toward autonomous sub-tasks learned from surgical video.',
        examples: 'Intuitive da Vinci, Surgical Robot Transformer (research)',
        whatHappened:
          '14 years of FDA reports (2000–2013): 144 deaths and 1,391 injuries among 10,624 adverse-event reports.',
      },
      {
        id: 'telepresence',
        name: 'Telepresence / triage robots',
        zoneId: 'hospitals',
        model: 'telepresence',
        howItOperates: 'Mobile screen or legged robot carries a remote clinician to the bedside or triage tent.',
        examples: "Boston Dynamics Spot (Brigham and Women's), InTouch-style carts",
        whatHappened:
          'Spot cut staff COVID exposure at Boston triage tents (2020). A Fremont Kaiser robot used to tell a patient he was dying (2019) triggered public backlash.',
      },
      {
        id: 'disinfection',
        name: 'Disinfection robots',
        zoneId: 'hospitals',
        model: 'uv-robot',
        howItOperates: 'UV-C units sweep empty rooms between patients.',
        examples: 'Various UV-C vendors',
        whatHappened: 'Scaled during COVID; low public-facing risk, mainly worker-exposure and scheduling issues.',
      },
      {
        id: 'companions',
        name: 'Companion / social robots',
        zoneId: 'homes',
        model: 'companion',
        howItOperates:
          'Tabletop or doll device starts conversations, reminds about meds and meals, alerts family or case managers when inactive.',
        examples: 'ElliQ, Hyodol, PARO seal',
        whatHappened:
          'New York State funded ElliQ for 900+ seniors; ~14,500 Hyodol dolls in Korea, many issued by municipalities.',
      },
      {
        id: 'rehab',
        name: 'Rehabilitation & assistive robots',
        zoneId: 'homes-clinics',
        model: 'exoskeleton',
        howItOperates: 'Exoskeletons and gait trainers for stroke/spinal injury; feeding and transfer assist.',
        examples: 'Robot-assisted gait trainers, exoskeletons, Robear (Japan)',
        whatHappened:
          'Japan subsidized care robots since 2015, yet only ~10% of 9,000+ elder-care sites had any by 2019.',
      },
      {
        id: 'monitoring',
        name: 'Monitoring & therapy robots',
        zoneId: 'ltc',
        model: 'sensor-pole',
        howItOperates: 'Bed and fall sensors, therapy pets, group-exercise humanoids.',
        examples: 'PARO, Pepper, monitoring sensors',
        whatHappened:
          'Monitoring was the most common Japanese care robot (14.9% of nursing homes); adopters had 3–8% more staff, not fewer.',
      },
      {
        id: 'medical-drones',
        name: 'Medical delivery drones',
        zoneId: 'airspace',
        model: 'drone',
        howItOperates:
          'Fly beyond line of sight from hospital or pharmacy hubs; lower packages by tether to yards and porches.',
        examples: 'Zipline P2 (Cleveland Clinic, Mayo, Intermountain, Advocate)',
        whatHappened:
          'Cleveland Clinic made home prescription delivery permanent in Aug 2026; Advocate plans the largest US network from 2027.',
      },
      {
        id: 'aed-drones',
        name: 'Emergency drones (AED)',
        zoneId: 'airspace',
        model: 'drone',
        howItOperates: 'Dispatched with the ambulance from 911; hover at ~30 m and winch down a defibrillator.',
        examples: 'Everdrone (Gothenburg region)',
        whatHappened: 'Beat the ambulance in about two-thirds of cases, by ~3 minutes; first life saved Dec 2021.',
      },
      {
        id: 'ground-delivery',
        name: 'Ground delivery robots carrying health goods',
        zoneId: 'sidewalks',
        model: 'sidewalk-robot',
        howItOperates: 'Sidewalk robots or AVs moving pharmacy orders, lab samples or meals to patients.',
        examples: 'Serve, Starship, robotaxis sharing roads with ambulances',
        whatHappened:
          'Not yet health-specific at scale, but the same fleets have blocked curb ramps and emergency vehicles (see Risks).',
      },
    ],
  },

  risks: {
    intro:
      'The most likely harm lands on the people with the least power to opt out: frail patients, wheelchair users, and isolated seniors with cognitive decline. The worst-case harms come from fleets that could do mass harm at once.',
    current: [
      {
        id: 'accessibility',
        name: 'Accessibility blockage: robots parked in curb cuts, corridors, elevator lobbies',
        whoImpacted: 'Pedestrians, patients on gurneys, porters, EMS crews',
        mostVulnerable: 'Wheelchair users, blind and low-vision people',
        whatMakesWorse: 'More units per site; sidewalk fleets moving into health delivery',
        realWorldCase:
          'Pittsburgh, Oct 2019: a Starship robot sat in a Forbes Ave curb cut, leaving a wheelchair user in traffic; Pitt paused the program.',
      },
      {
        id: 'privacy',
        name: 'Privacy & surveillance: always-on mics/cameras in homes and wards; drone cameras over yards',
        whoImpacted: 'Patients, family, visitors, neighbours, staff',
        mostVulnerable: "Seniors with dementia who can't meaningfully consent",
        whatMakesWorse:
          'Conversational data shared with families, clinicians and vendors; fleet data used to train models; agency-funded devices tied to case files',
        realWorldCase:
          'TUG management portal exposed hospital maps and robot video feeds (2022); Richardson, TX asked Amazon to bolster drone privacy measures (2026).',
      },
      {
        id: 'dehumanized',
        name: 'Dehumanized or degraded care: robot used where a human was needed',
        whoImpacted: 'Patients, families, nurses',
        mostVulnerable: 'Dying patients, people with dementia, isolated seniors',
        whatMakesWorse: 'Staffing shortages and cost pressure making robots the default, not the supplement',
      },
      {
        id: 'dependency',
        name: 'Emotional dependency & deception: anthropomorphic companions replacing human contact',
        whoImpacted: 'Seniors, families, case managers',
        mostVulnerable: 'Socially isolated older adults, people with cognitive decline',
        whatMakesWorse: 'Generative AI making companions more persuasive; vendors paid per active user',
        realWorldCase:
          'In Korea a 78-year-old said she prefers her municipality-issued Hyodol doll to people; the doll tells her it loves her.',
      },
      {
        id: 'physical-harm',
        name: 'Physical harm in clinical use: device malfunction, operator error',
        whoImpacted: 'Patients, surgeons, OR staff',
        mostVulnerable: 'Patients in complex surgeries',
        whatMakesWorse: 'Autonomy shifting from surgeon to model; under-reporting to FDA',
        realWorldCase:
          '144 deaths and 1,391 injuries reported for robotic surgery, 2000–2013; complex specialties had ~2.2x the injury/death rate.',
      },
      {
        id: 'unequal-access',
        name: 'Unequal access: tech lands first in wealthy suburbs and systems',
        whoImpacted: 'Patients, safety-net hospitals, rural residents',
        mostVulnerable: 'Low-income urban and rural patients',
        whatMakesWorse: 'Subscription pricing; drone services launching where airspace and yards are easy',
        realWorldCase:
          "Cleveland Clinic's home drone delivery started in suburban Beachwood; Everdrone's AED model works best in suburbs, away from city-centre hospitals.",
      },
    ],
    blackSwans: [
      {
        id: 'drone-first',
        name: 'Drone-first emergency response',
        scenario:
          'A metro area combines AED and medication drones into 911 and trims ambulance coverage on the assumption drones arrive first. A bad routing update or GPS outage grounds the whole fleet during a heat wave.',
        whoImpacted: '911 dispatchers, paramedics, bystanders',
        mostVulnerable: 'Cardiac-arrest patients in areas where ambulance coverage was cut',
        whatMakesWorse: 'Fewer ambulances; one drone vendor; storms that ground drones exactly when calls spike',
      },
      {
        id: 'welfare-check',
        name: 'Robots as the primary welfare check',
        scenario:
          'A county replaces some in-person case-manager visits with companion robots that report "all fine." A vendor outage, bankruptcy or false-normal signal means seniors die unnoticed.',
        whoImpacted: 'Older residents, case managers, families',
        mostVulnerable: 'Seniors living alone with cognitive decline',
        whatMakesWorse: 'Single-vendor contracts; budgets cut on the strength of self-reported results',
      },
      {
        id: 'one-cloud',
        name: "One cloud controls a health system's robots",
        scenario:
          'Robots with badge, elevator, door and pharmacy access across many hospitals run on one platform. Ransomware seizes the fleet, locks medication deliveries and parks robots in corridors during an evacuation.',
        whoImpacted: 'Patients, staff, fire marshals',
        mostVulnerable: "ICU patients and patients who can't self-evacuate",
        whatMakesWorse: 'Fleet-learning platforms shared across hospitals; robots tied into fire alarms and private 5G',
      },
      {
        id: 'patient-transport',
        name: 'Autonomous patient transport on city streets',
        scenario:
          'Robotic wheelchairs and driverless non-emergency medical vans move patients between home, clinic and hospital. A regional network failure strands them mid-route during a disaster evacuation.',
        whoImpacted: 'Patients, EMS, emergency managers',
        mostVulnerable: 'Wheelchair users and dialysis or chemo patients who rely on scheduled transport',
        whatMakesWorse: "No manual override for responders; vehicles that can't read hand signals",
      },
      {
        id: 'home-humanoids',
        name: 'Home-care humanoids doing physical care',
        scenario:
          'Robots lift patients, help with toileting and hand out medication in thousands of homes. One over-the-air model update changes grip or balance behavior and causes falls across the fleet before anyone spots the pattern.',
        whoImpacted: 'Home-care patients, family caregivers, aides',
        mostVulnerable: 'Frail older adults, people with disabilities',
        whatMakesWorse: 'Marketed as "wellness" devices outside FDA review; no incident-reporting duty',
      },
      {
        id: 'benefits-data',
        name: 'Care-robot data used to decide benefits',
        scenario:
          'In-home movement and conversation data is sold to or demanded by insurers, Medicaid agencies or guardianship courts and used to deny care or remove independence.',
        whoImpacted: 'Seniors, people with disabilities, families',
        mostVulnerable: 'People whose decline the device records',
        whatMakesWorse:
          "HIPAA doesn't cover many consumer or agency-distributed devices; no limits on secondary use",
      },
    ],
  },

  regulation: {
    intro:
      'US law regulates healthcare physical AI by what the product claims to do, not by where it operates or who it touches. Surgical robots face FDA review, but hospital logistics robots and home companion robots largely do not, and in January 2026 the FDA widened its hands-off "general wellness" category. Cities hold the fewest levers, and airspace and AV operations are mostly preempted.',
    laws: [
      {
        id: 'fda-device',
        name: 'FDA medical device law (FD&C Act: 510(k), De Novo, PMA; MAUDE reporting; premarket cybersecurity rules)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Surgical robots, devices that diagnose or treat; adverse-event reporting',
        fallsShort:
          'Logistics, telepresence and most companion robots are not "devices." Fleet-learning models change after clearance. MAUDE relies on voluntary, often incomplete reports.',
      },
      {
        id: 'fda-wellness',
        name: 'FDA General Wellness policy (revised Jan 2026)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Excludes low-risk products that promote healthy habits from device rules',
        fallsShort:
          'A companion that reminds about pills, tracks routines and alerts family can sit outside FDA review if it avoids disease claims',
      },
      {
        id: 'hipaa',
        name: 'HIPAA Privacy & Security Rules',
        authority: 'Federal (HHS)',
        levels: ['Federal'],
        covers: 'Health data held by providers, insurers and their business associates',
        fallsShort: 'Does not cover data on consumer devices or many agency-distributed companions',
      },
      {
        id: 'ftc',
        name: 'FTC Act §5 + Health Breach Notification Rule (amended 2024)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Deceptive practices; breach notice for non-HIPAA health apps and connected devices',
        fallsShort: 'Notice after a breach, not limits on collection; enforcement only after harm',
      },
      {
        id: 'state-mental-health',
        name: 'State AI-in-mental-health laws (Illinois WOPR Act 2025; Nevada; Utah disclosure law)',
        authority: 'State',
        levels: ['State'],
        covers:
          'Illinois bans AI therapy and AI that detects emotions or mental states without licensed oversight; fines up to $10,000 per use',
        fallsShort:
          'Wellness apps are carved out; unclear whether an embodied companion that "checks in" on mood is covered; a Dec 2025 federal executive order targets state AI laws for litigation',
      },
      {
        id: 'state-health-privacy',
        name: "State health-data privacy laws (e.g., Washington's My Health My Data Act)",
        authority: 'State',
        levels: ['State'],
        covers: 'Consent for consumer health data outside HIPAA',
        fallsShort: 'Patchwork; most states have none',
      },
      {
        id: 'faa',
        name: 'FAA Part 107 waivers → Part 108 (BVLOS)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: 'Drone certification, operations, routes; Part 108 would standardize beyond-line-of-sight flights',
        fallsShort:
          'Final rule still at White House review as of Nov 2026; statutory deadline Dec 7, 2026. Cities cannot regulate flight paths, noise or altitude.',
      },
      {
        id: 'state-drone-preemption',
        name: "State drone preemption (e.g., Texas Gov't Code 423.009)",
        authority: 'State',
        levels: ['State'],
        covers: 'Bars city ordinances on drone operation',
        fallsShort: 'Leaves cities with only land-use control of hubs',
      },
      {
        id: 'drone-zoning',
        name: 'City zoning for drone hubs',
        authority: 'City',
        levels: ['City'],
        covers: 'Where nests and launch pads can go (Plano created a new land-use category in 2024)',
        fallsShort: 'Once zoning is granted, cities found it legally risky to revoke (Richardson, 2026)',
      },
      {
        id: 'state-av',
        name: 'State AV laws + DMV/utility commission permits',
        authority: 'State',
        levels: ['State'],
        covers: 'Testing and deployment of robotaxis and delivery AVs',
        fallsShort:
          'Cities like San Francisco could not directly limit fleets; no binding standard for yielding to emergency vehicles',
      },
      {
        id: 'pdd',
        name: 'State personal-delivery-device laws + city right-of-way permits',
        authority: 'State / City',
        levels: ['State', 'City'],
        covers: 'Sidewalk robot weight, speed, operating areas; city permit conditions',
        fallsShort:
          'Rarely require curb-cut or accessible-route rules; Pittsburgh required community meetings but not technical accessibility standards',
      },
      {
        id: 'ada',
        name: 'Americans with Disabilities Act',
        authority: 'Federal (enforced via complaints, DOJ)',
        levels: ['Federal'],
        covers: 'Accessible public right-of-way and facilities',
        fallsShort: 'No standard for robots that obstruct accessible routes; relief comes after the fact',
      },
      {
        id: 'product-liability',
        name: 'Product liability (state tort law)',
        authority: 'State',
        levels: ['State'],
        covers: 'Defective design, manufacturing, warnings',
        fallsShort:
          'Hard to assign fault across hardware maker, AI model, hospital, network carrier and integrator; learning systems blur "defect"',
      },
      {
        id: 'osha',
        name: 'OSHA (General Duty Clause; voluntary ISO 13482 for personal care robots)',
        authority: 'Federal / state plans',
        levels: ['Federal', 'State'],
        covers: 'Worker safety around equipment',
        fallsShort: 'No OSHA standard for mobile service robots sharing corridors with staff',
      },
      {
        id: 'licensure',
        name: 'Professional licensure (medical and nursing boards)',
        authority: 'State',
        levels: ['State'],
        covers: 'Who may diagnose, treat, deliver care',
        fallsShort: 'No rule on what must be said in person (e.g., end-of-life news)',
      },
      {
        id: 'public-funding',
        name: 'Public funding programs (Older Americans Act, state aging budgets, Medicaid waivers)',
        authority: 'Federal / State / County',
        levels: ['Federal', 'State', 'City'],
        covers: 'Who pays for in-home support',
        fallsShort: "No outcome, consent or data standards attached when funds buy robots; NY's results are self-reported",
      },
      {
        id: 'eu',
        name: 'EU AI Act + Medical Device Regulation + Machinery Regulation',
        authority: 'EU',
        levels: ['International'],
        covers:
          'AI-enabled medical devices are "high-risk"; Machinery Regulation applies from Jan 2027; device AI rules from Aug 2028',
        fallsShort: 'Legal scholars argue neither the MDR nor the AI Act adequately covers care robots and companions',
      },
    ],
    gaps: [
      {
        title: 'Non-device care robots',
        detail: 'Logistics and companion robots get no premarket safety or efficacy review.',
      },
      {
        title: 'Home health data',
        detail: 'Conversations and routines captured by companions often fall outside HIPAA.',
      },
      {
        title: 'Emergency override',
        detail: "There's no standard that lets paramedics, firefighters or police move or stop a robot, drone or AV on scene.",
      },
      {
        title: 'Accessibility in the right-of-way',
        detail: 'No technical rule keeps robots out of curb cuts, ramps or accessible routes.',
      },
      {
        title: 'Fleet-update governance',
        detail: "Outside FDA devices, there's no requirement for staged rollouts, kill switches, or public incident reporting.",
      },
      {
        title: 'Human-in-the-loop for sensitive moments',
        detail: 'Nothing says which conversations (a terminal diagnosis, a child-welfare visit) must happen in person.',
      },
      {
        title: 'Public procurement terms',
        detail:
          'When agencies buy robots for residents, no standard covers consent, data ownership, independent evaluation, or vendor-exit plans.',
      },
      {
        title: 'City voice in preempted domains',
        detail: 'Cities absorb noise, blocked streets and emergency delays but cannot set drone or AV operating rules.',
      },
    ],
  },

  caseStudies: {
    intro:
      "Governments are already buying care robots for residents, while cities mostly react to robots others deploy. Where a public body owned the deployment (New York, Korean districts, Gothenburg's 911 system), it could shape it. Where it didn't (North Texas drones, San Francisco robotaxis), it could only complain.",
    places: [
      {
        id: 'new-york-state',
        place: 'New York State',
        response: 'Publicly funded program',
        note: 'State aging office gives ElliQ companions to isolated seniors; 3,500+ applied in 2025',
        locations: [{ label: 'Albany, NY', lat: 42.65, lng: -73.76 }],
        detail: {
          title: 'New York State: publicly funded AI companions',
          deployed:
            'ElliQ tabletop companions, statewide through county Offices for the Aging, starting May 2022 with 800 units.',
          whatHappened:
            'The state reports a 95% drop in loneliness and 30+ interactions per user per day (NYSOFA). Caveat: self-reported, no control group, announced jointly with the vendor.',
          impact:
            "Reached rural seniors who can't get to in-person programs. The state aging office runs on about $100 per senior (Boston Globe).",
          response:
            'Pilot → budget-funded program, expanding. Dutchess County uses case-manager assessments to decide who is a good match.',
          whatChanged:
            'Public reaction mostly positive; demand outstrips supply. No published data on jobs or on whether human contact rose or fell.',
          lesson:
            'Buy robots as part of a case-management service, not instead of one. Require independent evaluation and data terms in the contract.',
        },
        relatedTypeIds: ['companions'],
        relatedRegulationIds: ['public-funding'],
      },
      {
        id: 'korea',
        place: 'Seoul (Seocho), Yongin, Chuncheon, Goesan — South Korea',
        response: 'Municipal procurement',
        note: 'Districts issue Hyodol care dolls to seniors living alone, partly to detect "lonely deaths"',
        detail: {
          title: 'Korean municipalities: care dolls against "lonely deaths"',
          deployed:
            'Hyodol AI dolls (and similar devices) issued by Seoul districts, Yongin, Chuncheon and rural counties. About 14,500 are in use.',
          whatHappened:
            'A Chuncheon study of 42 seniors found average depression scores fell from 5.76 to 4.69 (out of 15) over six months (Korea Times). Dolls flag inactivity to family or caseworkers. Korea recorded 3,920+ lonely deaths in 2024.',
          impact: 'Older women living alone became the main users. Some say they now prefer the doll to people.',
          response: 'Municipal procurement, often framed as a safety-net service.',
          whatChanged: 'Faster detection of seniors in trouble; new questions about dependency and in-home monitoring.',
          lesson: 'Inactivity alerts are a real safety gain; the companionship script needs limits and a human on the other end.',
        },
        locations: [
          { label: 'Seoul', lat: 37.48, lng: 127.03 },
          { label: 'Yongin', lat: 37.24, lng: 127.18 },
          { label: 'Chuncheon', lat: 37.88, lng: 127.73 },
          { label: 'Goesan', lat: 36.82, lng: 127.79 },
        ],
        relatedTypeIds: ['companions'],
      },
      {
        id: 'japan',
        place: 'Japan (36 of 47 prefectures, FY2018)',
        response: 'Subsidy',
        note: '~50% of robot cost, up to ¥100,000 per robot, for nursing homes',
        locations: [{ label: 'Japan', lat: 35.68, lng: 139.69 }],
        detail: {
          title: 'Japan: a national bet on care robots',
          deployed:
            'National and prefectural subsidies since 2015 for monitoring, transfer and companion robots in nursing homes.',
          whatHappened:
            'By 2019 only ~10% of 9,000+ elder-care facilities had any care robot. Ethnographic work found robots often created more work for caregivers (MIT Tech Review).',
          impact: 'Robot-adopting nursing homes had 3–8% more staff, and some saw lower turnover (WEF / Eggleston).',
          response: 'Subsidy, R&D funding, no ban.',
          whatChanged: 'Monitoring sensors stuck; lifting and companion robots mostly did not.',
          lesson:
            'Fund what care workers ask for (monitoring, admin relief), not what engineers find impressive. Robots complemented staff rather than replacing them.',
        },
        relatedTypeIds: ['rehab', 'monitoring'],
      },
      {
        id: 'gothenburg',
        place: 'Gothenburg region, Sweden',
        response: 'Integrated into 911',
        note: 'AED drones dispatched alongside ambulances by SOS Alarm',
        locations: [
          { label: 'Gothenburg', lat: 57.71, lng: 11.97 },
          { label: 'Trollhättan', lat: 58.28, lng: 12.29 },
        ],
        detail: {
          title: 'Gothenburg region, Sweden: AED drones in the 911 system',
          deployed:
            'Everdrone drones carrying defibrillators, dispatched by the national emergency operator in semi-urban areas around Gothenburg, from 2020.',
          whatHappened:
            "Drones beat the ambulance in about two-thirds of cases, by ~3 minutes; in confirmed cardiac arrests the drone's AED was used in most cases (Lancet Digital Health via ScienceDaily). First life saved in Trollhättan, Dec 2021.",
          impact: 'Covered ~200,000 residents by 2022. Works best in suburbs, far from hospitals.',
          response: 'Integrated pilot run by public health and emergency agencies with a university.',
          whatChanged: 'Faster defibrillation; bystanders became part of the response chain. No reported job losses.',
          lesson: 'Put drones inside emergency dispatch rather than beside it, and measure against ambulance times.',
        },
        relatedTypeIds: ['aed-drones'],
      },
      {
        id: 'advocate',
        place: 'Charlotte, NC → Chicago, Milwaukee',
        response: 'Planned (2027)',
        note: "Advocate Health's hospital drone network",
        locations: [
          { label: 'Charlotte', lat: 35.23, lng: -80.84 },
          { label: 'Chicago', lat: 41.88, lng: -87.63 },
          { label: 'Milwaukee', lat: 43.04, lng: -87.91 },
        ],
        relatedTypeIds: ['medical-drones'],
      },
      {
        id: 'cleveland-north-texas',
        place: 'Cleveland and North Texas',
        response: 'Permanent service; zoning pushback',
        note: 'Beachwood (Cleveland), OH made hospital prescription drone delivery permanent (Aug 2026); Richardson, Plano and North Richland Hills, TX created hub zoning categories and Richardson asked Amazon for a new noise study after complaints',
        locations: [
          { label: 'Beachwood', lat: 41.46, lng: -81.51 },
          { label: 'Richardson', lat: 32.95, lng: -96.73 },
          { label: 'Plano', lat: 33.02, lng: -96.7 },
          { label: 'North Richland Hills', lat: 32.83, lng: -97.23 },
        ],
        relatedTypeIds: ['medical-drones'],
        relatedRegulationIds: ['faa', 'drone-zoning', 'state-drone-preemption'],
        detail: {
          title: 'Cleveland and North Texas: prescription drones meet residents',
          deployed:
            'Zipline P2 drones lowering prescriptions to homes in Beachwood, OH (Cleveland Clinic, Aug 2026); Zipline, Wing and Amazon drones across 30+ North Texas suburbs.',
          whatHappened:
            'Cleveland Clinic made the service permanent, with pharmacists loading the drop boxes (DroneXL). In Richardson, TX, residents complained of a drone every few minutes, and an Amazon drone hit an apartment building.',
          impact: 'Faster medication access for eligible patients; noise and privacy complaints near hubs.',
          response:
            "Cities used zoning (Plano's hub land-use category) but state law bars them from regulating flights. Richardson found undoing its zoning too legally risky.",
          whatChanged: 'Prescription delivery times fell to minutes; public trust became the binding constraint.',
          lesson: 'Set noise, route and data conditions at the zoning stage. After approval, a city has little leverage.',
        },
      },
      {
        id: 'pittsburgh',
        place: 'Pittsburgh, PA',
        response: 'Pause',
        note: 'Pitt paused Starship robots after a curb-cut blockage (2019); city had required community meetings first',
        locations: [{ label: 'Pittsburgh', lat: 40.44, lng: -79.96 }],
        relatedTypeIds: ['ground-delivery'],
        relatedRegulationIds: ['pdd', 'ada'],
      },
      {
        id: 'san-francisco',
        place: 'San Francisco, CA',
        response: 'State-level fleet cut',
        note: 'After AV–emergency incidents, California DMV asked Cruise to halve its fleet (2023)',
        locations: [{ label: 'San Francisco', lat: 37.77, lng: -122.42 }],
        relatedRegulationIds: ['state-av'],
      },
      {
        id: 'boston',
        place: 'Boston, MA',
        response: 'Pilot',
        note: "Spot quadruped used for COVID triage at Brigham and Women's (2020)",
        locations: [{ label: 'Boston', lat: 42.34, lng: -71.11 }],
        relatedTypeIds: ['telepresence'],
      },
      {
        id: 'state-ai-laws',
        place: 'Illinois, Nevada, Utah',
        response: 'State law',
        note: 'Ban or restrict AI therapy and emotion detection',
        locations: [
          { label: 'Illinois', lat: 40.0, lng: -89.2 },
          { label: 'Nevada', lat: 39.3, lng: -116.6 },
          { label: 'Utah', lat: 39.3, lng: -111.7 },
        ],
        relatedRegulationIds: ['state-mental-health'],
      },
      {
        id: 'eu',
        place: 'European Union',
        response: 'Regulation',
        note: 'AI Act high-risk rules for medical AI from Aug 2028',
        locations: [{ label: 'Brussels', lat: 50.85, lng: 4.35 }],
        relatedRegulationIds: ['eu'],
      },
    ],
  },
};

export default healthcare;
