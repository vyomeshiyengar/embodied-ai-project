# Global regulations: notable rules outside the US

**Added by Claude Code, Nov 27, 2026, for sector owner review.** Not part of the team's Drive research. Each rule below was found with web search and kept only if a cited source supports it. Sector owners should check each entry, then keep it, correct it, or move it into their sector doc on Drive.

Why: Chris asked for a global layer in the Regulations step, with notable examples from outside the US, next to the federal, state and city rules the sector docs already cover. Sectors that already list non-US rules (03, 06, 07, 09, 10) get none here. 

How the app uses this file: the YAML block below was imported (in Chris's research repo) and adds each entry as a rule in its sector's **Global** layer, with its sources and a "Pending team review" tag.

Rules followed:
- Only rules a source confirms. `covers` and `falls_short` stay close to what the sources say; where a gap is our reading, it says so plainly.
- `status`: `in_force`, `pending` (adopted but not fully in force), `proposed`.
- No people are named. No interview material. "As of" for the whole file is Nov 27, 2026.

## Open questions for reviewers
- **UK Automated Vehicles Act 2024:** several parts were not yet in force when the sources were written; check which are in force now.
- **Shenzhen:** reports differ on whether a safety operator must still be on board for fully driverless cars.
- **EU AI Act sandboxes:** a 2026 implementing regulation appears to move the date to 2027; see the toolkit file.

```yaml
- id: gr01-uk-av-act
  sector: "01"
  name: Automated Vehicles Act 2024
  jurisdiction: United Kingdom
  status: pending
  covers: A legal framework for automated vehicles on roads and other public places, including authorisation of vehicles for automated use, criminal liability, civil sanctions and permits for automated passenger services.
  falls_short: Several provisions are prospective, so much of the framework depends on secondary legislation that was still to come when the sources were written.
  sources:
    - { publisher: legislation.gov.uk, title: "Automated Vehicles Act 2024 (c. 10)", url: "https://www.legislation.gov.uk/ukpga/2024/10", published: "2024-05-20" }

- id: gr01-germany-level4
  sector: "01"
  name: Act on Autonomous Driving (Level 4 in approved areas)
  jurisdiction: Germany
  status: in_force
  covers: Allows driverless (Level 4) vehicles on public roads within approved operating areas, with an implementing ordinance in force since July 2022. In force since July 28, 2021.
  falls_short: Operation is limited to approved areas and is not unrestricted inside them; the law required a federal evaluation by the end of 2023.
  sources:
    - { publisher: German Federal Ministry for Digital and Transport, title: "Act on autonomous driving", url: "https://www.bmv.de/SharedDocs/EN/Articles/DG/act-on-autonomous-driving.html" }
    - { publisher: Library of Congress, title: "Germany: Road Traffic Act Amendment Allows Driverless Vehicles on Public Roads", url: "https://www.loc.gov/item/global-legal-monitor/2021-08-09/germany-road-traffic-act-amendment-allows-driverless-vehicles-on-public-roads/", published: "2021-08-09" }

- id: gr01-japan-level4
  sector: "01"
  name: Road Traffic Act amendment (Level 4 permission system)
  jurisdiction: Japan
  status: in_force
  covers: From April 1, 2023, driverless operation under specific conditions needs a permit, and operators must appoint supervisors for operation and emergencies. The first Level 4 service was approved in Eiheiji Town, Fukui, in 2023.
  falls_short: Covers services on defined routes and conditions; it does not open driverless operation to private cars.
  sources:
    - { publisher: National Police Agency of Japan, title: "Automated Driving", url: "https://www.npa.go.jp/english/bureau/traffic/selfdriving.html" }
    - { publisher: Ministry of Economy, Trade and Industry, title: "Approval of the first Level 4 automated driving in Japan (Eiheiji Town)", url: "https://www.meti.go.jp/english/press/2023/0331_003.html", published: "2023-03-31" }

- id: gr01-shenzhen-icv
  sector: "01"
  name: Shenzhen Special Economic Zone Intelligent Connected Vehicle Management Regulations
  jurisdiction: Shenzhen, China
  status: in_force
  covers: In force since August 1, 2022, the first rules in mainland China on driverless liability. Driverless cars may run on roads designated by local transport authorities; with no driver, the owner or manager pays compensation when the vehicle is at fault.
  falls_short: Reports differ on whether a safety operator must still be present, so how far fully driverless operation is allowed is unclear from the sources.
  sources:
    - { publisher: TechCrunch, title: "Real driverless cars are now legal in China's Shenzhen", url: "https://techcrunch.com/2022/07/25/real-driverless-cars-legal-in-chinas-shenzhen", published: "2022-07-25" }
    - { publisher: South China Morning Post, title: "China's southern tech hub Shenzhen becomes first city on mainland to regulate driverless cars", url: "https://www.scmp.com/tech/policy/article/3187483/chinas-southern-tech-hub-shenzhen-becomes-first-city-mainland-regulate" }

- id: gr02-eu-ai-act-rbi
  sector: "02"
  name: EU AI Act ban on real-time remote biometric identification by police
  jurisdiction: European Union
  status: in_force
  covers: Since February 2, 2025, police may not use real-time remote biometric identification in publicly accessible spaces, apart from narrow exceptions (targeted searches for victims or missing persons, preventing specific threats, locating suspects of serious crimes). Applies to cameras on drones and robots as much as fixed cameras.
  falls_short: The exceptions are broad enough to need national rules and authorisations; the ban covers use, not placing such systems on the market.
  sources:
    - { publisher: European Commission, title: "Guidelines on prohibited artificial intelligence practices", url: "https://digital-strategy.ec.europa.eu/en/pages/ai-act-guidelines-prohibitions", published: "2025-02-04" }
    - { publisher: Bundesnetzagentur, title: "Prohibited practices", url: "https://bundesnetzagentur.de/EN/Areas/Digitalisation/AI/08_ProhibitedPractices/start.html" }

- id: gr04-eu-machinery
  sector: "04"
  name: EU Machinery Regulation 2023/1230
  jurisdiction: European Union
  status: pending
  covers: Replaces the Machinery Directive and is written to cover new technologies such as autonomous mobile machinery, including robots like autonomous sweepers and refuse machines. Applies from January 20, 2027.
  falls_short: A product-safety rule for manufacturers; it does not say where or how cities may let such machines operate.
  sources:
    - { publisher: European Agency for Safety and Health at Work, title: "Regulation (EU) 2023/1230 on machinery", url: "https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery" }

- id: gr05-korea-robots-act
  sector: "05"
  name: Intelligent Robots Act amendment (outdoor mobile robots)
  jurisdiction: South Korea
  status: in_force
  covers: Since November 17, 2023, outdoor mobile robots up to 500 kg and 15 km/h that pass safety certification can be treated as pedestrians and use sidewalks; operators must carry insurance.
  falls_short: National certification and insurance; the sources do not describe a role for cities in routes or sidewalk capacity.
  sources:
    - { publisher: Korea JoongAng Daily, title: "Robots can now legally roam Korea's sidewalks", url: "https://www.koreajoongangdaily.com/business/robots-can-now-legally-roam-koreas-sidewalks/11561458", published: "2023-11-17" }

- id: gr05-japan-delivery-robots
  sector: "05"
  name: Road Traffic Act notification system for delivery robots
  jurisdiction: Japan
  status: in_force
  covers: From April 1, 2023, small low-speed delivery robots may use sidewalks at up to 6 km/h after the operator files a notification; robots must show they are remotely operated and carry an emergency stop button.
  falls_short: A notification, not a permit, so local authorities get limited say over where robots run.
  sources:
    - { publisher: National Police Agency of Japan, title: "Automated Driving", url: "https://www.npa.go.jp/english/bureau/traffic/selfdriving.html" }

- id: gr05-eu-u-space
  sector: "05"
  name: EU U-space Regulation 2021/664
  jurisdiction: European Union
  status: in_force
  covers: Since January 26, 2023, member states can designate U-space airspace where certified service providers manage drone traffic, including network identification of drones. The basis for routine delivery drone flights in European cities.
  falls_short: U-space airspace must be designated by each country; the sources describe a gradual rollout with some services not available from day one.
  sources:
    - { publisher: European Commission, title: "Drones: Commission adopts new rules and conditions for safe, secure and green drone operations", url: "https://transport.ec.europa.eu/news-events/news/drones-commission-adopts-new-rules-and-conditions-safe-secure-and-green-drone-operations-2021-04-22_en", published: "2021-04-22" }
    - { publisher: EUR-Lex, title: "Commission Implementing Regulation (EU) 2021/664", url: "https://eur-lex.europa.eu/eli/reg/2021/664/oj/eng" }

- id: gr08-eu-machinery
  sector: "08"
  name: EU Machinery Regulation 2023/1230
  jurisdiction: European Union
  status: pending
  covers: Covers autonomous mobile machinery such as robotic mowers and cleaning robots used in parks. Applies from January 20, 2027.
  falls_short: Sets product safety for manufacturers; park rules on where machines may run stay with local authorities.
  sources:
    - { publisher: European Agency for Safety and Health at Work, title: "Regulation (EU) 2023/1230 on machinery", url: "https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery" }

- id: gr08-eu-u-space
  sector: "08"
  name: EU U-space Regulation 2021/664
  jurisdiction: European Union
  status: in_force
  covers: Lets countries designate airspace where drone traffic is managed by certified providers, relevant to monitoring, lifesaving and inspection drones over parks and beaches. In force since January 26, 2023.
  falls_short: Depends on each country designating U-space airspace.
  sources:
    - { publisher: EUR-Lex, title: "Commission Implementing Regulation (EU) 2021/664", url: "https://eur-lex.europa.eu/eli/reg/2021/664/oj/eng" }
```
