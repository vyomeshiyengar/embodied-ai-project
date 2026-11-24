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
        whoImpacted: "Pedestrians, patients on gurneys, porters and EMS crews are affected.",
        mostVulnerable: "Wheelchair users and blind and low-vision people are the most vulnerable.",
        whatMakesWorse: "More robots per site make this worse, as do sidewalk fleets moving into health delivery.",
        realWorldCase: "In Pittsburgh in October 2019, a Starship robot sat in a Forbes Avenue curb cut and left a wheelchair user stuck in traffic, and the University of Pittsburgh paused the program.",
      },
      {
        id: 'privacy',
        name: 'Privacy & surveillance: always-on mics/cameras in homes and wards; drone cameras over yards',
        whoImpacted: "Patients, families, visitors, neighbours and staff are affected.",
        mostVulnerable: "Seniors with dementia who can't meaningfully consent are the most vulnerable.",
        whatMakesWorse: "Sharing conversation data with families, clinicians and vendors makes this worse, as do using fleet data to train models and tying agency-funded devices to case files.",
        realWorldCase: "In 2022, TUG's management portal exposed hospital maps and robot video feeds, and in 2026, Richardson, Texas asked Amazon to strengthen its drone privacy measures.",
      },
      {
        id: 'dehumanized',
        name: 'Dehumanized or degraded care: robot used where a human was needed',
        whoImpacted: "Patients, families and nurses are affected.",
        mostVulnerable: "Dying patients, people with dementia and isolated seniors are the most vulnerable.",
        whatMakesWorse: "Staffing shortages and cost pressure make this worse by turning robots into the default rather than a supplement.",
      },
      {
        id: 'dependency',
        name: 'Emotional dependency & deception: anthropomorphic companions replacing human contact',
        whoImpacted: "Seniors, families and case managers are affected.",
        mostVulnerable: "Socially isolated older adults and people with cognitive decline are the most vulnerable.",
        whatMakesWorse: "Generative AI that makes companions more persuasive makes this worse, as do vendors being paid per active user.",
        realWorldCase: "In Korea, a 78-year-old said she prefers her municipality-issued Hyodol doll to people, and the doll tells her it loves her.",
      },
      {
        id: 'physical-harm',
        name: 'Physical harm in clinical use: device malfunction, operator error',
        whoImpacted: "Patients, surgeons and operating room staff are affected.",
        mostVulnerable: "Patients undergoing complex surgeries are the most vulnerable.",
        whatMakesWorse: "Shifting autonomy from the surgeon to the model makes this worse, as does under-reporting to the FDA.",
        realWorldCase: "From 2000 to 2013, 144 deaths and 1,391 injuries were reported for robotic surgery, and complex specialties had about 2.2 times the injury and death rate.",
      },
      {
        id: 'unequal-access',
        name: 'Unequal access: tech lands first in wealthy suburbs and systems',
        whoImpacted: "Patients, safety-net hospitals and rural residents are affected.",
        mostVulnerable: "Low-income urban and rural patients are the most vulnerable.",
        whatMakesWorse: "Subscription pricing makes this worse, as do drone services launching where airspace and yards are easy to serve.",
        realWorldCase: "Cleveland Clinic's home drone delivery started in suburban Beachwood, and Everdrone's AED model works best in suburbs, away from city-centre hospitals.",
      },
    ],
    blackSwans: [
      {
        id: 'drone-first',
        name: 'Drone-first emergency response',
        scenario:
          'A metro area combines AED and medication drones into 911 and trims ambulance coverage on the assumption drones arrive first. A bad routing update or GPS outage grounds the whole fleet during a heat wave.',
        whoImpacted: "911 dispatchers, paramedics and bystanders are affected.",
        mostVulnerable: "Cardiac-arrest patients in areas where ambulance coverage was cut are the most vulnerable.",
        whatMakesWorse: "Fewer ambulances would make this worse, as would relying on one drone vendor and storms that ground drones exactly when calls spike.",
      },
      {
        id: 'welfare-check',
        name: 'Robots as the primary welfare check',
        scenario:
          'A county replaces some in-person case-manager visits with companion robots that report "all fine." A vendor outage, bankruptcy or false-normal signal means seniors die unnoticed.',
        whoImpacted: "Older residents, case managers and families are affected.",
        mostVulnerable: "Seniors living alone with cognitive decline are the most vulnerable.",
        whatMakesWorse: "Single-vendor contracts would make this worse, as would budget cuts justified by self-reported results.",
      },
      {
        id: 'one-cloud',
        name: "One cloud controls a health system's robots",
        scenario:
          'Robots with badge, elevator, door and pharmacy access across many hospitals run on one platform. Ransomware seizes the fleet, locks medication deliveries and parks robots in corridors during an evacuation.',
        whoImpacted: "Patients, staff and fire marshals are affected.",
        mostVulnerable: "ICU patients and patients who can't evacuate on their own are the most vulnerable.",
        whatMakesWorse: "Fleet-learning platforms shared across hospitals would make this worse, as would robots tied into fire alarms and private 5G networks.",
      },
      {
        id: 'patient-transport',
        name: 'Autonomous patient transport on city streets',
        scenario:
          'Robotic wheelchairs and driverless non-emergency medical vans move patients between home, clinic and hospital. A regional network failure strands them mid-route during a disaster evacuation.',
        whoImpacted: "Patients, EMS and emergency managers are affected.",
        mostVulnerable: "Wheelchair users and dialysis or chemotherapy patients who rely on scheduled transport are the most vulnerable.",
        whatMakesWorse: "Having no manual override for responders would make this worse, as would vehicles that can't read hand signals.",
      },
      {
        id: 'home-humanoids',
        name: 'Home-care humanoids doing physical care',
        scenario:
          'Robots lift patients, help with toileting and hand out medication in thousands of homes. One over-the-air model update changes grip or balance behavior and causes falls across the fleet before anyone spots the pattern.',
        whoImpacted: "Home-care patients, family caregivers and aides are affected.",
        mostVulnerable: "Frail older adults and people with disabilities are the most vulnerable.",
        whatMakesWorse: "Marketing the robots as \"wellness\" devices outside FDA review would make this worse, as would the lack of any duty to report incidents.",
      },
      {
        id: 'benefits-data',
        name: 'Care-robot data used to decide benefits',
        scenario:
          'In-home movement and conversation data is sold to or demanded by insurers, Medicaid agencies or guardianship courts and used to deny care or remove independence.',
        whoImpacted: "Seniors, people with disabilities and their families are affected.",
        mostVulnerable: "People whose decline the device records are the most vulnerable.",
        whatMakesWorse: "HIPAA doesn't cover many consumer or agency-distributed devices, and there are no limits on secondary use of the data.",
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
        covers: "This law covers surgical robots and devices that diagnose or treat, and it requires adverse-event reporting.",
        fallsShort: "Logistics, telepresence and most companion robots are not legally \"devices.\" Fleet-learning models change after clearance, and MAUDE relies on voluntary, often incomplete reports.",
      },
      {
        id: 'fda-wellness',
        name: 'FDA General Wellness policy (revised Jan 2026)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "This policy exempts low-risk products that promote healthy habits from device rules.",
        fallsShort: "A companion that reminds people about pills, tracks routines and alerts family can sit outside FDA review if it avoids disease claims.",
      },
      {
        id: 'hipaa',
        name: 'HIPAA Privacy & Security Rules',
        authority: 'Federal (HHS)',
        levels: ['Federal'],
        covers: "HIPAA covers health data held by providers, insurers and their business associates.",
        fallsShort: "It does not cover data on consumer devices or on many agency-distributed companions.",
      },
      {
        id: 'ftc',
        name: 'FTC Act §5 + Health Breach Notification Rule (amended 2024)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "The FTC polices deceptive practices and requires breach notices from health apps and connected devices that HIPAA doesn't cover.",
        fallsShort: "The rule requires notice after a breach but doesn't limit data collection, and enforcement comes only after harm.",
      },
      {
        id: 'state-mental-health',
        name: 'State AI-in-mental-health laws (Illinois WOPR Act 2025; Nevada; Utah disclosure law)',
        authority: 'State',
        levels: ['State'],
        covers: "Illinois bans AI therapy and AI that detects emotions or mental states without licensed oversight, with fines of up to $10,000 per use.",
        fallsShort: "Wellness apps are carved out, and it is unclear whether an embodied companion that \"checks in\" on mood is covered. A December 2025 federal executive order also targets state AI laws for litigation.",
      },
      {
        id: 'state-health-privacy',
        name: "State health-data privacy laws (e.g., Washington's My Health My Data Act)",
        authority: 'State',
        levels: ['State'],
        covers: "These laws require consent for consumer health data that falls outside HIPAA.",
        fallsShort: "They form a patchwork, and most states have none.",
      },
      {
        id: 'faa',
        name: 'FAA Part 107 waivers → Part 108 (BVLOS)',
        authority: 'Federal',
        levels: ['Federal'],
        covers: "These rules cover drone certification, operations and routes, and Part 108 would standardize beyond-line-of-sight flights.",
        fallsShort: "The final rule was still under White House review as of November 2026, with a statutory deadline of December 7, 2026. Cities cannot regulate flight paths, noise or altitude.",
      },
      {
        id: 'state-drone-preemption',
        name: "State drone preemption (e.g., Texas Gov't Code 423.009)",
        authority: 'State',
        levels: ['State'],
        covers: "These laws bar cities from passing ordinances on drone operations.",
        fallsShort: "They leave cities with only land-use control over drone hubs.",
      },
      {
        id: 'drone-zoning',
        name: 'City zoning for drone hubs',
        authority: 'City',
        levels: ['City'],
        covers: "Zoning decides where drone nests and launch pads can go, and Plano created a new land-use category for them in 2024.",
        fallsShort: "Once zoning is granted, cities have found it legally risky to revoke, as Richardson did in 2026.",
      },
      {
        id: 'state-av',
        name: 'State AV laws + DMV/utility commission permits',
        authority: 'State',
        levels: ['State'],
        covers: "These laws govern the testing and deployment of robotaxis and autonomous delivery vehicles.",
        fallsShort: "Cities like San Francisco could not directly limit fleets, and there is no binding standard for yielding to emergency vehicles.",
      },
      {
        id: 'pdd',
        name: 'State personal-delivery-device laws + city right-of-way permits',
        authority: 'State / City',
        levels: ['State', 'City'],
        covers: "These laws set sidewalk robots' weight, speed and operating areas, and cities can add permit conditions.",
        fallsShort: "They rarely require rules on curb cuts or accessible routes. Pittsburgh required community meetings but not technical accessibility standards.",
      },
      {
        id: 'ada',
        name: 'Americans with Disabilities Act',
        authority: 'Federal (enforced via complaints, DOJ)',
        levels: ['Federal'],
        covers: "The ADA requires accessible public rights-of-way and facilities.",
        fallsShort: "There is no standard for robots that obstruct accessible routes, and relief comes only after the fact.",
      },
      {
        id: 'product-liability',
        name: 'Product liability (state tort law)',
        authority: 'State',
        levels: ['State'],
        covers: "Product liability law covers defective design, manufacturing and warnings.",
        fallsShort: "It is hard to assign fault across the hardware maker, AI model, hospital, network carrier and integrator, and learning systems blur what counts as a \"defect.\"",
      },
      {
        id: 'osha',
        name: 'OSHA (General Duty Clause; voluntary ISO 13482 for personal care robots)',
        authority: 'Federal / state plans',
        levels: ['Federal', 'State'],
        covers: "OSHA protects worker safety around equipment.",
        fallsShort: "There is no OSHA standard for mobile service robots that share corridors with staff.",
      },
      {
        id: 'licensure',
        name: 'Professional licensure (medical and nursing boards)',
        authority: 'State',
        levels: ['State'],
        covers: "Licensing boards decide who may diagnose, treat and deliver care.",
        fallsShort: "No rule says what must be said in person, such as end-of-life news.",
      },
      {
        id: 'public-funding',
        name: 'Public funding programs (Older Americans Act, state aging budgets, Medicaid waivers)',
        authority: 'Federal / State / County',
        levels: ['Federal', 'State', 'City'],
        covers: "These programs pay for in-home support.",
        fallsShort: "No outcome, consent or data standards apply when these funds buy robots, and New York's results are self-reported.",
      },
      {
        id: 'eu',
        name: 'EU AI Act + Medical Device Regulation + Machinery Regulation',
        authority: 'EU',
        levels: ['International'],
        covers: "AI-enabled medical devices are classed as \"high-risk.\" The Machinery Regulation applies from January 2027, and the device AI rules apply from August 2028.",
        fallsShort: "Legal scholars argue that neither the MDR nor the AI Act adequately covers care robots and companions.",
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
        note: "The state aging office gives ElliQ companions to isolated seniors, and more than 3,500 people applied in 2025.",
        locations: [{ label: 'Albany, NY', lat: 42.65, lng: -73.76 }],
        detail: {
          title: 'New York State: publicly funded AI companions',
          deployed:
            "New York State began deploying ElliQ tabletop companions statewide in May 2022, starting with 800 units distributed through county Offices for the Aging.",
          whatHappened:
            "The state reports a 95% drop in loneliness and more than 30 interactions per user per day (NYSOFA). These results are self-reported, have no control group and were announced jointly with the vendor.",
          impact:
            "The program reached rural seniors who can't get to in-person programs. The state aging office runs on about $100 per senior (Boston Globe).",
          response:
            "The pilot became a budget-funded program that is still expanding. Dutchess County uses case-manager assessments to decide which seniors are a good match.",
          whatChanged:
            "Public reaction has been mostly positive, and demand outstrips supply. There is no published data on jobs or on whether seniors' human contact rose or fell.",
        },
        relatedTypeIds: ['companions'],
        relatedRegulationIds: ['public-funding'],
      },
      {
        id: 'korea',
        place: 'Seoul (Seocho), Yongin, Chuncheon, Goesan — South Korea',
        response: 'Municipal procurement',
        note: "Districts issue Hyodol care dolls to seniors who live alone, partly to detect \"lonely deaths.\"",
        detail: {
          title: 'Korean municipalities: care dolls against "lonely deaths"',
          deployed:
            "Seoul districts, Yongin, Chuncheon and several rural counties issue Hyodol AI dolls and similar devices to seniors. About 14,500 are now in use.",
          whatHappened:
            "A Chuncheon study of 42 seniors found that average depression scores fell from 5.76 to 4.69 (out of 15) over six months (Korea Times). The dolls flag inactivity to family members or caseworkers. Korea recorded more than 3,920 lonely deaths in 2024.",
          impact:
            "Older women living alone became the main users, and some say they now prefer the doll to people.",
          response:
            "Municipalities buy the dolls through public procurement and often frame them as a safety-net service.",
          whatChanged:
            "Seniors in trouble are detected faster, but the program has raised new questions about dependency and in-home monitoring.",
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
        id: 'gothenburg',
        place: 'Gothenburg region, Sweden',
        response: 'Integrated into 911',
        note: "SOS Alarm dispatches AED drones alongside ambulances.",
        locations: [
          { label: 'Gothenburg', lat: 57.71, lng: 11.97 },
          { label: 'Trollhättan', lat: 58.28, lng: 12.29 },
        ],
        detail: {
          title: 'Gothenburg region, Sweden: AED drones in the 911 system',
          deployed:
            "Since 2020, the national emergency operator has dispatched Everdrone drones carrying defibrillators (AEDs) to semi-urban areas around Gothenburg.",
          whatHappened:
            "The drones beat the ambulance in about two-thirds of cases, arriving roughly three minutes earlier, and in confirmed cardiac arrests the drone's AED was used in most cases (Lancet Digital Health via ScienceDaily). The first life was saved in Trollhättan in December 2021.",
          impact:
            "The service covered about 200,000 residents by 2022. It works best in suburbs that are far from hospitals.",
          response:
            "Public health and emergency agencies run it as an integrated pilot together with a university.",
          whatChanged:
            "Patients are defibrillated sooner, and bystanders have become part of the response chain. No job losses have been reported.",
        },
        relatedTypeIds: ['aed-drones'],
      },
      {
        id: 'cleveland-north-texas',
        place: 'Cleveland and North Texas',
        response: 'Permanent service; zoning pushback',
        note: "Cleveland Clinic made hospital prescription drone delivery permanent in Beachwood, Ohio in August 2026. In North Texas, cities created zoning categories for drone hubs, and Richardson asked Amazon for a new noise study after complaints.",
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
            "Since August 2026, Cleveland Clinic has used Zipline P2 drones to lower prescriptions to homes in Beachwood, Ohio. In North Texas, Zipline, Wing and Amazon drones fly across more than 30 suburbs.",
          whatHappened:
            "Cleveland Clinic made the service permanent, with pharmacists loading the drop boxes (DroneXL). In Richardson, Texas, residents complained of a drone passing every few minutes, and an Amazon drone hit an apartment building.",
          impact:
            "Eligible patients get their medication faster, but residents near drone hubs have raised noise and privacy complaints.",
          response:
            "Cities turned to zoning, such as Plano's land-use category for drone hubs, because state law bars them from regulating flights. Richardson found that undoing its zoning approval would be too legally risky.",
          whatChanged:
            "Prescription delivery times fell to minutes, and public trust became the main constraint on growth.",
        },
      },
      {
        id: 'japan',
        place: 'Japan (36 of 47 prefectures, FY2018)',
        response: 'Subsidy',
        note: "Prefectures cover about 50% of the cost of each robot, up to ¥100,000, for nursing homes.",
        locations: [{ label: 'Japan', lat: 35.68, lng: 139.69 }],
        detail: {
          title: 'Japan: a national bet on care robots',
          deployed:
            "Since 2015, Japan's national and prefectural governments have subsidized monitoring, transfer and companion robots for nursing homes.",
          whatHappened:
            "By 2019, only about 10% of more than 9,000 elder-care facilities had any care robot. Ethnographic research found that the robots often created more work for caregivers (MIT Tech Review).",
          impact:
            "Nursing homes that adopted robots had 3–8% more staff, and some saw lower turnover (WEF / Eggleston).",
          response:
            "The government chose subsidies and R&D funding, and it has not banned any type of care robot.",
          whatChanged:
            "Monitoring sensors stuck, while lifting and companion robots mostly did not.",
        },
        relatedTypeIds: ['rehab', 'monitoring'],
      },
      {
        id: 'advocate',
        place: 'Charlotte, NC → Chicago, Milwaukee',
        response: 'Planned (2027)',
        note: "Advocate Health plans to launch a hospital drone network in 2027.",
        locations: [
          { label: 'Charlotte', lat: 35.23, lng: -80.84 },
          { label: 'Chicago', lat: 41.88, lng: -87.63 },
          { label: 'Milwaukee', lat: 43.04, lng: -87.91 },
        ],
        relatedTypeIds: ['medical-drones'],
      },
      {
        id: 'pittsburgh',
        place: 'Pittsburgh, PA',
        response: 'Pause',
        note: "The University of Pittsburgh paused Starship robots in 2019 after one blocked a curb cut. The city had required community meetings before the robots launched.",
        locations: [{ label: 'Pittsburgh', lat: 40.44, lng: -79.96 }],
        relatedTypeIds: ['ground-delivery'],
        relatedRegulationIds: ['pdd', 'ada'],
      },
      {
        id: 'san-francisco',
        place: 'San Francisco, CA',
        response: 'State-level fleet cut',
        note: "After incidents involving autonomous vehicles and emergency responders, the California DMV asked Cruise to halve its fleet in 2023.",
        locations: [{ label: 'San Francisco', lat: 37.77, lng: -122.42 }],
        relatedRegulationIds: ['state-av'],
      },
      {
        id: 'boston',
        place: 'Boston, MA',
        response: 'Pilot',
        note: "Brigham and Women's Hospital used a Spot quadruped robot for COVID triage in 2020.",
        locations: [{ label: 'Boston', lat: 42.34, lng: -71.11 }],
        relatedTypeIds: ['telepresence'],
      },
      {
        id: 'state-ai-laws',
        place: 'Illinois, Nevada, Utah',
        response: 'State law',
        note: "These states ban or restrict AI therapy and AI that detects emotions.",
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
        note: "The AI Act's high-risk rules for medical AI apply from August 2028.",
        locations: [{ label: 'Brussels', lat: 50.85, lng: 4.35 }],
        relatedRegulationIds: ['eu'],
      },
    ],
  },
};

export default healthcare;
