// ==========================================================================
// Generated dynamically via scripts/consolidate-markers.ts. DO NOT HAND EDIT.
// ==========================================================================

import africa from './africa.json';
import americas from './americas.json';
import centralAsia from './central-asia.json';
import eastAsia from './east-asia.json';
import europe from './europe.json';
import europeanSubstruct from './european_substruct.json';
import global from './global.json';
import keyAims from './key_aims.json';
import middleEast from './middle-east.json';
import oceania from './oceania.json';
import southAsia from './south-asia.json';

// Export individual collections for fine-grained engine access
export {
  africa,
  americas,
  centralAsia,
  eastAsia,
  europe,
  europeanSubstruct,
  global,
  keyAims,
  middleEast,
  oceania,
  southAsia
};

/**
 * A consolidated registry mapping geography/population names to their validated structural marker lists.
 */
export const AimsRegistry = {
  africa,
  americas,
  centralAsia,
  eastAsia,
  europe,
  europeanSubstruct,
  global,
  keyAims,
  middleEast,
  oceania,
  southAsia,
};

/**
 * Flattens all validated marker sets into a single continuous master array of all AIMs.
 */
export function getAllAims(): any[] {
  return [
    ...africa,
    ...americas,
    ...centralAsia,
    ...eastAsia,
    ...europe,
    ...europeanSubstruct,
    ...global,
    ...keyAims,
    ...middleEast,
    ...oceania,
    ...southAsia,
  ];
}
