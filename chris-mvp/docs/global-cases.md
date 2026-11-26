# Global cases and sample-city deployments

**Added by Claude Code, Nov 25, 2026, for sector owner review.** Not part of the team's Drive research. Each case below was found with web search and is kept only if a cited source supports it. Sector owners should check each entry, then either keep it, correct it, or move it into their sector doc on Drive.

Why: the team's sector docs are mostly about the US. Chris asked to keep that and add notable cases from around the world, plus documented deployments in the ten sample cities used by the 3D city twin (San Francisco, Boston, San Antonio, London, Madrid, Kyiv, Nairobi, Bogotá, Buenos Aires, Tokyo).

How the app uses this file: the content importer (in Chris's research repo) reads the YAML block below and adds each entry as a map pin and case study to its sector, with its sources. Pins inside a twin neighborhood show there at their real location; others within 25 km of a sample city are listed as documented in that city.

Rules followed:
- No people are named. No interview material.
- `precision: site` means the coordinates are the named site (a park, a station, a building). `approximate` means a city or district centre.
- Media is included only if it is openly licensed (CC0, CC BY, CC BY-SA) and clearly shows the case. Most entries have none yet.
- Dates are the source's publication date or the event month. "As of" for the whole file is Nov 25, 2026.

## Gaps found
- **Nairobi:** no documented embodied AI deployment inside the city found yet. Kenya's drone rules (Civil Aviation (Unmanned Aircraft Systems) Regulations, 2020) are national; the nearest medical drone operations are in Kisumu and the Lake region.
- **Buenos Aires:** the city has authorised testing of driverless cars and delivery robots on public roads, but no named company or route was found.
- **Kyiv:** demining robots and drones are documented for the State Emergency Service nationally and in the Kyiv region, not at a specific city site.
- **Boston:** no city ordinance on police robots found; the state police bomb squad tested Spot, and a state bill on weaponized robots was proposed in 2023 (status not confirmed).
- **Media:** Wikimedia Commons search is rate-limited from the build sandbox and often returns unrelated files, so only one verified image is attached so far.

## Cases

```yaml
- id: g01-wuhan-apollo-go
  sector: "01"
  title: Fully driverless robotaxis at city scale
  place: Wuhan, China
  lat: 30.5928
  lng: 114.3055
  precision: approximate
  date: "2024-07"
  what: Baidu's Apollo Go ran about 300 fully driverless robotaxis in Wuhan in 2024, with some reports giving close to 500, covering a large share of the city's road network.
  response: Wuhan allowed fully driverless commercial rides in designated areas. Human taxi drivers complained about lost income as the service grew.
  sources:
    - { publisher: People's Daily, title: "Baidu's robotaxis orders surge, paving way for large-scale autonomous ride-hailing services", url: "https://en.people.cn/n3/2024/0711/c90000-20192499.html", published: "2024-07-11" }
    - { publisher: ADAS & Autonomous Vehicle International, title: "Baidu's Apollo Go robotaxi fleet in Wuhan goes from 5 to 300 vehicles in one year", url: "https://www.autonomousvehicleinternational.com/news/robotaxis/baidus-apollo-go-robotaxi-fleet-in-wuhan-goes-from-5-to-300-vehicles-in-one-year.html" }
  media: { kind: image, url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/%28CHN-Hubei%29_Apollo_Go_Apollo_RT6_Temporary-%E9%84%82A1395%E8%AF%95_2025-12-17.jpg/1280px-%28CHN-Hubei%29_Apollo_Go_Apollo_RT6_Temporary-%E9%84%82A1395%E8%AF%95_2025-12-17.jpg", alt: "An Apollo Go RT6 robotaxi on Heping Avenue, Wuhan", credit: "S5A-0043, CC BY 4.0, via Wikimedia Commons", page: "https://commons.wikimedia.org/wiki/File:(CHN-Hubei)_Apollo_Go_Apollo_RT6_Temporary-%E9%84%82A1395%E8%AF%95_2025-12-17.jpg" }

- id: g01-tokyo-waymo
  sector: "01"
  title: First robotaxi tests outside the US, with a local taxi fleet
  place: Central Tokyo, Japan
  lat: 35.6812
  lng: 139.7671
  precision: approximate
  date: "2025-04"
  what: Waymo began driving on Tokyo's public roads in April 2025, at first driven manually by trained Nihon Kotsu drivers across seven central wards to map the city, working with Tokyo's largest taxi company and the GO app.
  response: Nihon Kotsu manages and services the vehicles. Waymo set up first-responder training with its partners. No commercial launch date was announced.
  sources:
    - { publisher: Waymo, title: "Partnering with Nihon Kotsu and GO on our first international road trip", url: "https://waymo.com/blog/2024/12/partnering-with-nihon-kotsu-and-go-on-our-first-international-road-trip", published: "2024-12-16" }
    - { publisher: Waymo, title: "New beginnings in Japan", url: "https://waymo.com/blog/2025/04/new-beginnings-in-japan/", published: "2025-04" }

- id: g01-london-wayve-uber
  sector: "01"
  title: Supervised robotaxi rides under a fast-tracked national pilot
  place: London, United Kingdom
  lat: 51.5072
  lng: -0.1276
  precision: approximate
  date: "2026-09"
  what: Uber launched rides in London using Wayve's driving software on Sept 3, 2026, with licensed safety drivers on board at first.
  response: Transport for London granted private hire licences in August 2026. The UK government brought pilots forward to spring 2026; full deployment under the Automated Vehicles Act 2024 is expected around 2027.
  sources:
    - { publisher: The Star (Reuters), title: "Uber and AI-firm Wayve launch London's first robotaxis", url: "https://www.thestar.com.my/tech/tech-news/2026/09/03/uber-and-ai-firm-wayve-launch-london039s-first-robotaxis", published: "2026-09-03" }
    - { publisher: TechCrunch, title: "Wayve and Uber plan London robotaxi launch after UK speeds up autonomous vehicle rollout", url: "https://techcrunch.com/2025/06/10/wayve-and-uber-plan-london-robotaxi-launch-after-uk-speeds-up-autonomous-vehicle-rollout/", published: "2025-06-10" }

- id: g01-madrid-casa-de-campo-bus
  sector: "01"
  title: A free driverless minibus pilot in a city park
  place: Casa de Campo, Madrid, Spain
  lat: 40.4194
  lng: -3.7480
  precision: site
  date: "2025-09"
  what: Madrid's city bus company EMT ran an electric driverless minibus on a 1.8 km loop with six stops in Casa de Campo from Sept 15 to Oct 24, 2025, carrying up to 12 passengers. More than 2,600 people rode it.
  response: The next step EMT described is buses that can drive themselves to the depot.
  sources:
    - { publisher: CTAG, title: "CTAG collaborates with EMT Madrid on the first autonomous bus running in Casa de Campo", url: "https://ctag.com/en/ctag-collaborates-with-emt-madrid-on-the-first-autonomous-bus-running-in-casa-de-campo/", published: "2025-09" }
    - { publisher: Euronews, title: "Is this the transport of the future? Madrid tests first driverless bus made in Spain", url: "https://www.euronews.com/2025/09/25/is-this-the-transport-of-the-future-madrid-tests-first-driverless-bus-made-in-spain", published: "2025-09-25" }

- id: g01-madrid-mercamadrid-bus
  sector: "01"
  title: Spain's first on-demand autonomous bus in regular service
  place: Mercamadrid, Madrid, Spain
  lat: 40.3742
  lng: -3.6619
  precision: site
  date: "2026-07"
  what: An autonomous on-demand bus run by Alsa with the city and Mercamadrid began regular service in July 2026 for workers and visitors of the wholesale food market, on a loop between the commercial zone and the parking lot.
  response: Timetables were coordinated with the EMT city bus lines that serve Mercamadrid.
  sources:
    - { publisher: Alsa, title: "Autonomous bus of Mercamadrid", url: "https://www.alsa.com/en/mobility/autonomous-bus-mercamadrid" }
    - { publisher: idw / Research in Germany, title: "Spain's first autonomous on-demand bus begins regular passenger service at Mercamadrid", url: "https://www.research-in-germany.org/idw-news/en_US/2026/7/2026-07-08_Spain_s_First_Autonomous_On-Demand_Bus_Begins_Regular_Passenger_Service_at_Mercamadrid_Through_MOBILITIES_FOR_EU.html", published: "2026-07-08" }

- id: g01-buenos-aires-testing-rule
  sector: "01"
  title: City rule opens public roads to driverless car and delivery robot tests
  place: Buenos Aires, Argentina
  lat: -34.6037
  lng: -58.3816
  precision: approximate
  date: "2026"
  what: The city government authorised tests of driverless cars and delivery robots on public roads, classing robots as automated delivery devices, with uses beyond delivery allowed.
  response: No named operator or route was found in the sources.
  sources:
    - { publisher: El Economista, title: "El gobierno porteño habilitó autos sin conductor y robots de delivery", url: "https://eleconomista.com.ar/politica/el-gobierno-porteo-habilito-autos-conductor-robots-delivery-n97582" }
    - { publisher: Autoweb, title: "La Ciudad de Buenos Aires habilitó las pruebas de autos autónomos y robots de delivery en la vía pública", url: "https://www.autoweb.com.ar/?p=59867" }

- id: g01-san-antonio-waymo
  sector: "01"
  title: Driverless rides start downtown, surface streets only
  place: Downtown San Antonio, Texas, US
  lat: 29.4241
  lng: -98.4936
  precision: approximate
  date: "2026-02"
  what: Waymo began driverless rides for invited riders in San Antonio on Feb 24, 2026, starting downtown and kept off highways; service later opened to everyone, including airport trips.
  response: The city published guidance for residents on sharing the road with driverless cars as part of Vision Zero.
  sources:
    - { publisher: KSAT, title: "Waymo's driverless cars begin limited service in San Antonio for invited riders", url: "https://ksat.com/news/local/2026/02/24/waymos-driverless-cars-begin-limited-service-in-san-antonio-for-invited-riders", published: "2026-02-24" }
    - { publisher: City of San Antonio, title: "Driverless cars have come to San Antonio. Here's how to share the road", url: "https://www.sa.gov/Directory/Departments/Transportation/Initiatives/Vision-Zero/News/Driverless-Car-Safety" }

- id: g02-singapore-xavier
  sector: "02"
  title: Patrol robot trial watches for "undesirable behaviour"
  place: Toa Payoh Central, Singapore
  lat: 1.3324
  lng: 103.8478
  precision: site
  date: "2021-09"
  what: For three weeks from Sept 5, 2021, the government's ground robot Xavier patrolled Toa Payoh Central to spot smoking in banned areas, illegal hawking and badly parked bicycles, with officers able to speak through it remotely.
  response: Five agencies ran the trial. The government said the robot would not be used for enforcement during the trial.
  sources:
    - { publisher: HTX (Home Team Science and Technology Agency), title: "HTX ground robot on trial at Toa Payoh Central to support public officers in enhancing public health and safety", url: "https://www.htx.gov.sg/news/media-release-htx-ground-robot-on-trial-at-toa-payoh-central-to-support-public-officers-in-enhancing-public-health-and-safety", published: "2021-09" }

- id: g02-bogota-police-drones
  sector: "02"
  title: Police drone patrols linked to the city's command centre
  place: Bogotá, Colombia
  lat: 4.5981
  lng: -74.0760
  precision: approximate
  date: "2024-08"
  what: Bogotá's metropolitan police fly drones over the city centre and other areas, linked to the C4 command centre and street cameras, mainly against street drug sales. Police reported more than 100 arrests after aerial patrols by August 2024.
  response: The city bought the first five drones in 2019 and added more in 2023. Public sources found say little about privacy rules.
  sources:
    - { publisher: Alcaldía de Bogotá, title: "Cinco drones de última tecnología ayudarán a cuidar la vida en Bogotá", url: "https://bogota.gov.co/asi-vamos/drones-de-ultima-tecnologia-refuerzan-seguridad-de-bogota" }
    - { publisher: El Tiempo, title: "La estrategia de patrullaje aéreo con drones de la Policía de Bogotá", url: "https://www.eltiempo.com/bogota/la-estrategia-de-patrullaje-aereo-con-drones-con-la-que-la-policia-de-bogota-ha-logrado-mas-de-160-capturas-3423126" }

- id: g02-kyiv-sesu-robot-dog
  sector: "02"
  title: Robot dog and drones for bomb disposal and demining
  place: Kyiv region, Ukraine
  lat: 50.4501
  lng: 30.5234
  precision: approximate
  date: "2024"
  what: Ukraine's State Emergency Service uses mechanized demining machines, robotic systems and drones, and a rapid response unit in the Kyiv region planned to use a robot dog to deal with explosive devices remotely.
  response: Equipment came largely from EU and UNDP support, with Ukrainian companies testing new remote demining systems.
  sources:
    - { publisher: Ministry of Internal Affairs of Ukraine, title: "The State Emergency Service operates 19 mechanized demining machines, robotic complexes and drones", url: "https://mvs.gov.ua/en/news/u-dsns-praciuiut-19-masin-mexanizovanogo-rozminuvannia-robotizovani-kompleksi-i-droni", published: "2023-11" }
    - { publisher: Ukrinform, title: "Cutting-edge robotic dog to assist sappers in Kyiv region", url: "https://ukrinform.net/rubric-ato/4029516-cuttingedge-robotic-dog-to-assist-sappers-in-kyiv-region.html" }

- id: g02-massachusetts-state-police-spot
  sector: "02"
  title: State police bomb squad tests a robot dog
  place: Massachusetts, US
  lat: 42.3601
  lng: -71.0589
  precision: approximate
  date: "2019"
  what: The Massachusetts State Police bomb squad tested Boston Dynamics' Spot as a mobile observation device for suspected bombs and dangerous scenes.
  response: A state bill proposed in 2023 would ban weapons on robots; its status was not confirmed.
  sources:
    - { publisher: Police Magazine, title: "Massachusetts State Police briefly tested robot dog", url: "https://www.policemag.com/news/massachusetts-state-police-briefly-tested-robot-dog" }
    - { publisher: Northeastern University, title: "Mass. bill proposed to ban sales and operation of weaponized robots", url: "https://cssh.northeastern.edu/mass-bill-proposed-to-ban-sales-and-operation-of-weaponized-robots/", published: "2023" }

- id: g03-singapore-pub-drain-drones
  sector: "03"
  title: Drones inspect closed drains so workers don't go in
  place: Singapore
  lat: 1.3521
  lng: 103.8198
  precision: approximate
  date: "2024"
  what: Singapore's water agency PUB flies autonomous drones through dark, GPS-denied closed drains to take images without sending people in, and is seeking robots to inspect the Deep Tunnel Sewerage System.
  response: PUB runs open innovation challenges for drain and tunnel inspection and says it will use a mix of robot types.
  sources:
    - { publisher: PUB, title: "Smart Drain Inspector (Global Innovation Challenge 2023)", url: "https://pub.gov.sg/Industry/Events%20and%20Programmes/Global%20Innovation%20Challenge/Challenges/2023/Smart%20Drain%20Inspector" }
    - { publisher: PUB, title: "Condition Assessment of Deep Tunnel Sewerage System Tunnel (Global Innovation Challenge 2024)", url: "https://pub.gov.sg/Industry/Events%20and%20Programmes/Global%20Innovation%20Challenge/Challenges/2024/Condition%20Assessment%20of%20Deep%20Tunnel%20Sewerage%20System%20Tunnel" }

- id: g04-helsinki-zenrobotics
  sector: "04"
  title: AI robot arms sort construction waste
  place: Tattarisuo, Helsinki, Finland
  lat: 60.2533
  lng: 25.0217
  precision: approximate
  date: "2021"
  what: Recycling plants in and near Helsinki use ZenRobotics' AI-guided robot arms to pick wood, plastic, metal and stone from construction and demolition waste; one plant near Helsinki uses 12 arms on about 120,000 tonnes a year.
  response: The arms run inside safety cages. Reports said robots replaced some sorting jobs at recycling centres.
  sources:
    - { publisher: ZenRobotics (Terex), title: "Kuljetusrinki Ltd invests in fully autonomous robot sorting station", url: "https://www.terex.com/zenrobotics/about-us/news/kuljetusrinki-ltd-invests-in-fully-autonomous-robot-sorting-station" }
    - { publisher: Recycling Today, title: "Stadler, Remeo and ZenRobotics sorting plant in Finland", url: "https://www.recyclingtoday.com/news/finland-recycling-stadler-remeo-zenrobotics-sorting" }

- id: g05-shenzhen-meituan-drones
  sector: "05"
  title: Food delivery drones over city parks
  place: Lianhua Hill Park, Shenzhen, China
  lat: 22.5531
  lng: 114.0567
  precision: site
  date: "2024-07"
  what: Meituan drones deliver food to pickup kiosks in Shenzhen, including routes opened in 2024 in Central Park, Shenzhen Bay Park and Lianhua Hill Park. By the end of 2024 the company reported 53 routes and more than 400,000 deliveries across Chinese cities.
  response: China's aviation regulator granted Meituan the country's first nationwide drone delivery licence in April 2025. Deliveries in parts of Shenzhen were paused at the regulator's request during the November 2026 APEC summit.
  sources:
    - { publisher: Shenzhen Government Online, title: "Low-altitude economy: logistics", url: "https://www.sz.gov.cn/en_szgov/news/infocus/LowAltitudeEconomy/Areasofapplication/logistics/index.html" }
    - { publisher: TechNode, title: "Meituan secures China's first nationwide drone delivery license", url: "https://technode.com/2025/04/23/meituan-secures-chinas-first-nationwide-drone-delivery-license-ramping-up-competition-with-google-wing/", published: "2025-04-23" }

- id: g05-tokyo-nihonbashi-robots
  sector: "05"
  title: Sidewalk delivery robots under Japan's new road rules
  place: Nihonbashi, Tokyo, Japan
  lat: 35.6838
  lng: 139.7745
  precision: site
  date: "2024-03"
  what: Uber Eats began robot food deliveries in central Tokyo with Cartken robots supervised by Mitsubishi Electric staff, starting in a small area around Nihonbashi on weekdays.
  response: Revised traffic rules from April 2023 let remotely monitored delivery robots use sidewalks across Japan as a type of sidewalk vehicle.
  sources:
    - { publisher: Kyodo via MarketScreener, title: "Uber Eats to start robot deliveries in central Tokyo", url: "https://ca.marketscreener.com/quote/stock/THE-KODENSHA-CO-LTD-6494498/news/Uber-Eats-to-start-robot-deliveries-in-central-Tokyo-from-Wed-46093151/", published: "2024-03" }
    - { publisher: Taipei Times (AFP), title: "Japan rolls out delivery robots", url: "https://taipeitimes.com/News/biz/archives/2023/02/09/2003793995", published: "2023-02-09" }

- id: g06-dubai-office-of-the-future
  sector: "06"
  title: A 3D printed office building
  place: Emirates Towers, Dubai, United Arab Emirates
  lat: 25.2172
  lng: 55.2830
  precision: site
  date: "2016-05"
  what: The Office of the Future, about 250 square metres, was printed in 17 days with a large printer and robotic arm and opened in May 2016 as the Dubai Future Foundation's office.
  response: Part of Dubai's 3D Printing Strategy to make the emirate a centre of 3D printing by 2030.
  sources:
    - { publisher: Dubai Media Office, title: "World's first 3D printed office building inaugurated", url: "https://www.mediaoffice.ae/en/news/2016/5/mohammed-inaugurates-world-s-first-3d-printed-office-building", published: "2016-05-23" }
    - { publisher: Thornton Tomasetti, title: "Office of the Future", url: "https://www.thorntontomasetti.com/project/office-future" }

- id: g07-jakarta-interceptor
  sector: "07"
  title: A solar-powered river trash interceptor
  place: Cengkareng Drain, Jakarta, Indonesia
  lat: -6.1027
  lng: 106.7336
  precision: approximate
  date: "2019"
  what: The Ocean Cleanup's first Interceptor, an automated solar-powered barge, collected floating plastic near the mouth of Jakarta's Cengkareng Drain from 2019.
  response: Indonesia and the Netherlands endorsed further deployments. Independent reporters found it stalled after heavy rain in early 2020.
  sources:
    - { publisher: The Ocean Cleanup, title: "Indonesia enters new agreement with the Netherlands and The Ocean Cleanup to reduce marine debris from rivers", url: "https://theoceancleanup.com/press/press-releases/indonesia-enters-new-agreement-with-the-netherlands-and-the-ocean-cleanup-to-reduce-marine-debris-from-rivers/" }
    - { publisher: Mongabay, title: "This solar-powered device aims to clean 1,000 rivers. Will it work?", url: "https://news.mongabay.com/2020/03/this-solar-powered-device-aims-to-clean-1000-rivers-will-it-work", published: "2020-03" }

- id: g08-singapore-spot-park
  sector: "08"
  title: Robot dog reminds park visitors to keep their distance
  place: Bishan-Ang Mo Kio Park, Singapore
  lat: 1.3627
  lng: 103.8435
  precision: site
  date: "2020-05"
  what: For two weeks from May 8, 2020, Spot walked a 3 km stretch of Bishan-Ang Mo Kio Park playing a recorded safe-distancing message and counting visitors with video analytics.
  response: The government said the robot was not for enforcement and was meant to reduce patrol staff and contact.
  sources:
    - { publisher: GovTech Singapore, title: "NParks and SNDGG trial SPOT robot for safe distancing operations at Bishan-Ang Mo Kio Park", url: "https://www.tech.gov.sg/media/media-releases/spot-robot-trial-for-safe-distancing-operations", published: "2020-05-08" }

- id: g09-rwanda-zipline
  sector: "09"
  title: A national drone delivery service for blood
  place: Muhanga, Rwanda
  lat: -2.0845
  lng: 29.7559
  precision: approximate
  date: "2016-10"
  what: Rwanda launched a national drone delivery service with Zipline on Oct 14, 2016, flying blood from a hub in Muhanga to clinics that order by text message.
  response: The service grew to cover almost the whole country. A 2026 report found it helps, but only so much, as health needs go beyond delivery.
  sources:
    - { publisher: Gavi, title: "Rwanda launches world's first national drone delivery service powered by Zipline", url: "https://www.gavi.org/news/media-room/rwanda-launches-worlds-first-national-drone-delivery-service-powered-zipline", published: "2016-10" }
    - { publisher: NPR, title: "Drone delivery helps in Rwanda, but only so much", url: "https://npr.org/2026/07/31/nx-s1-5867626/drone-delivery-helps-in-rwanda-but-only-so-much", published: "2026-07-31" }

- id: g09-kenya-zipline
  sector: "09"
  title: Medical drone deliveries under national drone rules
  place: Kisumu, Kenya
  lat: -0.0917
  lng: 34.7680
  precision: approximate
  date: "2022-02"
  what: Zipline opened its first Kenyan hub in Kisumu County in 2022 for on-demand deliveries of blood, vaccines and other medical supplies, later serving four counties in the Lake region.
  response: Drones in Kenya fall under the Civil Aviation (Unmanned Aircraft Systems) Regulations, 2020. Operators say some approvals are still slow.
  sources:
    - { publisher: DroneDJ, title: "Zipline expands drone deliveries of medical supplies to Kenya", url: "https://dronedj.com/2022/02/18/zipline-expands-drone-deliveries-of-medical-supplies-to-kenya/", published: "2022-02-18" }
    - { publisher: The Star (Kenya), title: "The silent aircrafts behind Kenya's fastest medical deliveries", url: "https://www.the-star.co.ke/health/2025-11-15-the-silent-aircrafts-behind-kenyas-fastest-medical-deliveries", published: "2025-11-15" }

- id: g10-changi-cleaning-robots
  sector: "10"
  title: Autonomous floor cleaners across airport terminals
  place: Changi Airport, Singapore
  lat: 1.3389
  lng: 103.9837
  precision: site
  date: "2017"
  what: Changi Airport started with 11 autonomous cleaning robots in Terminals 3 and 4 in 2017 to raise cleaners' productivity, with plans for 32 units across all terminals.
  response: A 2025 university study looked at how the robots changed cleaning jobs at the airport.
  sources:
    - { publisher: Changi Airport Group, title: "Keeping Changi spick and span", url: "https://www.changiairport.com/corporate/media-centre/changijourneys/the-changi-experience/keeping-changi-spick-and-span.html" }
```
