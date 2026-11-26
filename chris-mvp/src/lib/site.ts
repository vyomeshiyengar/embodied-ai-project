/**
 * Site-wide names and demo settings. Change the tool's name here, in one place.
 */
export const SITE_NAME = 'Embodied AI City Playbook';
export const SITE_SHORT = 'EACP';
export const SITE_TAGLINE = 'A playbook on robots, drones and driverless vehicles for city staff.';
export const SITE_DESCRIPTION =
  'A playbook that gives city staff a shared mental model of embodied AI across 10 city sectors: types, likely and black swan risks, regulations, and what places are doing.';

/** Risk category labels (fixed project vocabulary: likely | black_swan). */
export const RISK_LABEL = { likely: 'Likely', black_swan: 'Black swan' } as const;

/**
 * DEMO SIGN-IN, NOT SECURITY. These credentials ship to every visitor's browser.
 * Sign-in is optional: guests browse everything; signing in unlocks Share, saving and MyEACP.
 */
export const DEMO_LOGIN = { username: 'demo', password: 'demo' } as const;
