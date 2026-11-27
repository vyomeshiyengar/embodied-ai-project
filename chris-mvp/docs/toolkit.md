# Toolkit: what cities and governments already do

**Added by Claude Code, Nov 27, 2026, for team review.** Not part of the team's Drive research. Each tool below has at least one real example, found with web search and kept only if a cited source supports it. The team should check each entry, then keep it, correct it or drop it.

Why: Chris asked to turn the Recommendations page into a **Toolkit**: the team's mental model as a cycle, plus tools city staff can browse to see what is possible and what others have tried. The mental model is the team's "Mental Model/Embodied AI Response Checklist" on Drive ([doc](https://docs.google.com/document/d/1MiyM2dC5uk3m3n6nzH7uT3Nz9KvucKk3aYKK3W_AnQY/edit)), read Nov 27, 2026.

How the app uses this file: the YAML block below became `src/data/toolkit.json` (generated in Chris's research repo). The three tools with `status: proposed` are the team's own recommendations; their text comes from the sector YAML (`recommendation_candidate`, sectors 01, 02, 10) at import time.

Rules followed:
- `status`: `in_place` (a real example is running or in force), `piloting` (in a trial or not yet fully in force), `proposed` (the team's proposals).
- `steps` lists which steps of the cycle a tool serves: 1 Understand, 2 Assess, 3 Experiment, 4 Decide.
- Examples say only what the sources say. No people are named. No interview material. "As of" for the whole file is Nov 27, 2026.

## Open questions for reviewers
- **EU AI Act sandboxes:** the Act says national sandboxes by August 2, 2026; a 2026 implementing regulation mentions 2027.
- **California AB 1777:** the emergency provisions took effect July 1, 2026; how they work in practice is not yet reported.
- **Mobility Data Specification:** covers delivery robots, but no source confirms a city requiring it for robots yet.

```yaml
steps:
  - n: 1
    id: understand
    name: Understand the tech
    points:
      - How does it function?
      - How does it play with other city systems?
      - What cities have already responded to this technology?
  - n: 2
    id: assess
    name: Assess risks and reversibility
    points:
      - Speak with communities affected, with a particular focus on those most vulnerable.
      - Low-risk versus high-risk actions.
      - What would failure look like, likely and black swan?
  - n: 3
    id: experiment
    name: Run a small time-boxed experiment
    points:
      - Test the tech on a narrow, low-stakes problem.
      - Limit testing to one technology at a time.
      - Gather user feedback.
  - n: 4
    id: decide
    name: Decide, adapt or roll back
    points:
      - Compare against the baseline.
      - Support transition and learning.
      - Drop sunk costs if needed.

tools:
  - id: test-bed
    name: Test bed or regulatory sandbox
    oneliner: A defined place and set of rules where new machines can be tried under supervision before wider use.
    steps: [1, 3]
    status: in_place
    examples:
      - place: Singapore
        year: "2015"
        what: one-north became Singapore's first test site for self-driving vehicles in 2015 and later expanded to nearby districts. Vehicles must pass a safety assessment run by the Land Transport Authority and Traffic Police before entering trial areas.
        sources:
          - { publisher: Land Transport Authority, title: "Autonomous vehicles must pass safety test before being allowed in trial areas", url: "https://www.lta.gov.sg/content/ltagov/en/newsroom/2018/11/3/autonomous-vehicles-must-pass-safety-test-before-being-allowed-in-trial-areas.html", published: "2018-11-03" }
      - place: European Union
        year: "2026"
        what: The EU AI Act requires every member state to set up at least one national AI regulatory sandbox. In August 2025 only Spain had one running.
        sources:
          - { publisher: European Commission AI Act Service Desk, title: "Article 57: AI regulatory sandboxes", url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-57" }
          - { publisher: European Parliament Think Tank, title: "AI regulatory sandboxes: State of play and implementation challenges", url: "https://epthinktank.eu/2026/04/01/ai-regulatory-sandboxes-state-of-play-and-implementation-challenges/", published: "2026-04-01" }

  - id: approved-areas
    name: Approved operating areas
    oneliner: Driverless operation allowed only in areas and routes an authority has approved.
    steps: [3]
    status: in_place
    examples:
      - place: Germany
        year: "2021"
        what: Germany's Act on Autonomous Driving allows Level 4 vehicles on public roads only within approved operating areas.
        sources:
          - { publisher: German Federal Ministry for Digital and Transport, title: "Act on autonomous driving", url: "https://www.bmv.de/SharedDocs/EN/Articles/DG/act-on-autonomous-driving.html" }
      - place: Eiheiji, Japan
        year: "2023"
        what: Japan's first Level 4 driverless service was approved for a set route in Eiheiji Town, Fukui, under the new permit system.
        sources:
          - { publisher: Ministry of Economy, Trade and Industry, title: "Approval of the first Level 4 automated driving in Japan", url: "https://www.meti.go.jp/english/press/2023/0331_003.html", published: "2023-03-31" }

  - id: emergency-geofencing
    name: Emergency geofencing and a first-responder line
    oneliner: First responders can order driverless vehicles out of an area and reach a human at the company right away.
    steps: [2, 3]
    status: in_place
    examples:
      - place: California, US
        year: "2026"
        what: Under AB 1777, from July 1, 2026, companies must move their vehicles out of an emergency zone within two minutes of a geofencing message, keep a dedicated emergency phone line, and let responders talk to a remote operator from the vehicle.
        sources:
          - { publisher: California State Assembly, title: "Public safety to improve when autonomous vehicles operate on CA streets under Ting's legislation", url: "https://a19.asmdc.org/press-releases/20240927-public-safety-improve-when-autonomous-vehicles-operate-ca-streets-under", published: "2024-09-27" }

  - id: incident-reporting
    name: Mandatory incident reporting
    oneliner: Operators must report crashes and incidents quickly, so problems show up early.
    steps: [3, 4]
    status: in_place
    examples:
      - place: United States
        year: "2021"
        what: NHTSA's Standing General Order 2021-01 requires companies running automated driving systems, including test prototypes, to report qualifying crashes, some within one day.
        sources:
          - { publisher: National Highway Traffic Safety Administration, title: "Standing General Order on Crash Reporting", url: "https://www.nhtsa.gov/SGOCrashReporting" }

  - id: activity-log
    name: Public activity log
    oneliner: Publish where and why each machine operated, so residents can see how it is used.
    steps: [2, 4]
    status: in_place
    examples:
      - place: Chula Vista, California, US
        year: "2021"
        what: Since April 2021 the police department publishes information on every drone flight, including flight paths, through an online portal.
        sources:
          - { publisher: City of Chula Vista, title: "UAS Drone Program", url: "https://chulavistaca.gov/departments/police-department/programs/uas-drone-program" }

  - id: impact-use-policy
    name: Impact and use policy with public comment
    oneliner: Publish what a technology can do and the rules for using it, and take public comment before use.
    steps: [2]
    status: in_place
    examples:
      - place: New York City, US
        year: "2020"
        what: The POST Act requires the police department to publish an impact and use policy at least 90 days before using a new surveillance technology, with 45 days for public comment. The Inspector General's 2024 review covered the Digidog robot and the K5 security robot.
        sources:
          - { publisher: NYPD, title: "POST Act", url: "https://www.nyc.gov/site/nypd/about/about-nypd/policy/post-act.page" }
          - { publisher: NYC Department of Investigation, title: "Assessment of NYPD's compliance with the POST Act", url: "https://www.nyc.gov/assets/doi/reports/pdf/2024/25PostActRelease_Rpt_05_30_2024.pdf", published: "2024-05-30" }

  - id: council-approval
    name: Council approval of use policies
    oneliner: Elected officials approve or limit how agencies may use robots, with time for the public to weigh in.
    steps: [2, 4]
    status: in_place
    examples:
      - place: San Francisco, California, US
        year: "2022"
        what: After a public outcry, the Board of Supervisors reversed a week-old approval and banned police robots from using deadly force, while still allowing robots to check dangerous scenes.
        sources:
          - { publisher: NPR, title: "San Francisco supervisors vote to ban police robots from using deadly force", url: "https://www.npr.org/2022/12/06/1141129944/san-francisco-deadly-robots-police", published: "2022-12-06" }

  - id: procurement-terms
    name: Shared procurement terms and fact sheets
    oneliner: Standard contract clauses and vendor fact sheets that cities can reuse when buying AI systems.
    steps: [1, 2]
    status: in_place
    examples:
      - place: San José, California, US
        year: "2023"
        what: The GovAI Coalition, started by San José, publishes a vendor agreement template and an AI FactSheet that agencies can adopt. The templates are written for AI software, not physical robots.
        sources:
          - { publisher: City of San José, title: "GovAI Coalition", url: "https://sanjoseca.gov/your-government/departments-offices/information-technology/ai-reviews-algorithm-register/govai-coalition" }

  - id: time-boxed-pilot
    name: Time-boxed pilot with an end date
    oneliner: A pilot that ends on a set date unless the city decides to continue, so the decision is made on evidence.
    steps: [3, 4]
    status: in_place
    examples:
      - place: Washington, DC, US
        year: "2016"
        what: The District ran a sidewalk delivery robot pilot from September 2016 to December 2017, with up to five devices per company, then extended it and replaced it with a permanent program in 2018.
        sources:
          - { publisher: Council of the District of Columbia, title: "D.C. Code Chapter 15C: Personal Delivery Devices", url: "https://code.dccouncil.gov/us/dc/council/code/titles/50/chapters/15C/index.full.html" }

  - id: device-limits
    name: Speed, size and supervision limits
    oneliner: Simple caps on weight and speed, and a human monitoring each machine.
    steps: [3]
    status: in_place
    examples:
      - place: Virginia, US
        year: "2017"
        what: Virginia's 2017 law let delivery robots use sidewalks if they weighed under 50 pounds, went no faster than 10 mph, and an operator was actively controlling or monitoring them.
        sources:
          - { publisher: LegiScan, title: "VA HB2016, 2017 Regular Session (chaptered)", url: "https://legiscan.com/VA/text/HB2016/2017" }
      - place: Japan
        year: "2023"
        what: Delivery robots may use sidewalks at up to 6 km/h after the operator files a notification, and must show they are remotely operated and carry an emergency stop button.
        sources:
          - { publisher: National Police Agency of Japan, title: "Automated Driving", url: "https://www.npa.go.jp/english/bureau/traffic/selfdriving.html" }

  - id: safety-certification
    name: Safety certification before access
    oneliner: Machines must pass a safety test before they get access to public space.
    steps: [1, 3]
    status: in_place
    examples:
      - place: South Korea
        year: "2023"
        what: Since November 2023, outdoor robots up to 500 kg and 15 km/h can use sidewalks only after safety certification, and operators must carry insurance.
        sources:
          - { publisher: Korea JoongAng Daily, title: "Robots can now legally roam Korea's sidewalks", url: "https://www.koreajoongangdaily.com/business/robots-can-now-legally-roam-koreas-sidewalks/11561458", published: "2023-11-17" }
      - place: Singapore
        year: "2019"
        what: TR 68, a provisional national standard published in 2019 and revised in 2021, sets requirements for fully autonomous vehicles, including vehicle behaviour, safety and cybersecurity.
        sources:
          - { publisher: Land Transport Authority, title: "Enhanced national standards for the safe deployment of autonomous vehicles", url: "https://www.lta.gov.sg/content/ltagov/en/newsroom/2021/9/news-releases/enhanced-national-standards-for-the-safe-deployment-of-autonomou.html", published: "2021-09-03" }

  - id: liability-rules
    name: Clear liability when there is no driver
    oneliner: Rules that say who pays when a driverless machine causes harm.
    steps: [2]
    status: in_place
    examples:
      - place: Shenzhen, China
        year: "2022"
        what: Since August 2022, when a fully driverless car is at fault, its owner or manager must pay compensation.
        sources:
          - { publisher: TechCrunch, title: "Real driverless cars are now legal in China's Shenzhen", url: "https://techcrunch.com/2022/07/25/real-driverless-cars-legal-in-chinas-shenzhen", published: "2022-07-25" }

  - id: accessibility-review
    name: Accessibility review before sidewalk access
    oneliner: Disability advocates review sidewalk machines before they are allowed.
    steps: [2]
    status: in_place
    examples:
      - place: Toronto, Canada
        year: "2021"
        what: After the city's Accessibility Advisory Committee raised safety concerns for people with low mobility or vision, seniors and children, City Council voted in December 2021 to keep delivery robots off sidewalks and bike lanes.
        sources:
          - { publisher: Global News, title: "Toronto committee pushes to ban robots from sidewalks, bike paths", url: "https://globalnews.ca/news/8429563/toronto-committee-pushes-ban-robots-sidewalks-bike-paths" }

  - id: roll-back
    name: Pause or roll back
    oneliner: End a program early when it is not working or loses public trust.
    steps: [4]
    status: in_place
    examples:
      - place: New York City, US
        year: "2021"
        what: The police department ended its lease of the Digidog robot four months early in April 2021, after public criticism.
        sources:
          - { publisher: CBS New York, title: "NYPD ends contract with 'Digidog' early after public backlash", url: "https://www.cbsnews.com/newyork/news/nypd-ends-contract-with-digidog" }

  - id: data-standard
    name: Shared data standard
    oneliner: One data format for operators to report where machines are and what they do.
    steps: [1, 4]
    status: piloting
    examples:
      - place: Los Angeles, California, US
        year: "2018"
        what: The Mobility Data Specification began at LA's transportation department for scooters and is now run by the Open Mobility Foundation. It includes delivery robots as a mode, but support for them is optional.
        sources:
          - { publisher: Open Mobility Foundation, title: "Mobility Data Specification", url: "https://github.com/openmobilityfoundation/mobility-data-specification" }

  - id: fleet-emergency-protocol
    name: A shared fleet emergency protocol
    status: proposed
    sector: "01"
    steps: [2, 3]

  - id: robotics-charter
    name: A public safety robotics charter
    status: proposed
    sector: "02"
    steps: [2]

  - id: procurement-addendum
    name: A common robot procurement addendum
    status: proposed
    sector: "10"
    steps: [1, 2]
```
