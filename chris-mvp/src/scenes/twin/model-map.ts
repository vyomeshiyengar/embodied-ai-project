/**
 * Which 3D model stands for each technology type, matched on the type's name (first match wins).
 * Kept as one readable table so sector owners can check it, like scripts/risk-types.mjs.
 */
import type { ModelKind } from './models';

const RULES: [RegExp, ModelKind][] = [
  [/remote operations|control|operations center/i, 'control-center'],
  [/dock|lockers?|hub/i, 'drone-dock'],
  [/network|platform|low-altitude|5g|tower/i, 'network-tower'],
  [/eod|bomb/i, 'crawler'],
  [/inspection robots|ai-powered inspection/i, 'quadruped'],
  [/drone|uas|uav|aerial/i, 'drone'],
  [/truck|class 8/i, 'truck'],
  [/shuttle|bus|transit/i, 'shuttle'],
  [/purpose-built|pod|no wheel/i, 'pod'],
  [/robotaxi|self-driving|consumer|car\b|cars\b/i, 'robotaxi'],
  [/sensor-equipped|sensor vehicle|street vehicles|municipal vehicles|noise-monitoring|mobile units|road-maintenance|sensor-driven/i, 'sensor-van'],
  [/road-going|delivery vehicle|waste truck|self driving waste|van/i, 'delivery-van'],
  [/sidewalk|delivery robot|hybrid|ground delivery|bin bot|roaming trash|logistics robot|cart|in-building delivery/i, 'sidewalk-robot'],
  [/dog|quadruped|legged|spot\b/i, 'quadruped'],
  [/humanoid|exoskeleton|visitor-service/i, 'humanoid'],
  [/mower|line-painting|sand/i, 'mower'],
  [/boat|vessel|surface|interceptor|collector|waterway|underwater|rov|auv|swimming/i, 'boat'],
  [/pipe|sewer|crawler|climbing|in-pipe|confined|gas|soil|radiation|rail inspection|power-line/i, 'crawler'],
  [/patrol|security/i, 'patrol-robot'],
  [/clean|sweep|floor|recycling|sorting/i, 'cleaning-robot'],
  [/disinfection|uv\b/i, 'uv-robot'],
  [/arm|surgical|printing|3d|robotic arms|mobile robots and robot arms/i, 'robot-arm'],
  [/companion|social|telepresence|triage|reception|therapy|monitoring|rehabilitation|assistive/i, 'companion'],
  [/inspection|wildfire|flood|heat|biodiversity|air-quality|methane|tree|forestry|lifesaving|shark|enforcement/i, 'drone'],
  [/firefighting|search and rescue|emergency service|façade|fa.ade|high-rise|mobility robots|autonomous mobile/i, 'patrol-robot'],
];

export function modelFor(typeName: string): ModelKind {
  for (const [re, kind] of RULES) if (re.test(typeName)) return kind;
  return 'patrol-robot';
}
