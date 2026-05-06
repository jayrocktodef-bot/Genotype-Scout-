import africa from './africa.json' with { type: 'json' };
import europe from './europe.json' with { type: 'json' };
import eastAsia from './east-asia.json' with { type: 'json' };
import southAsia from './south-asia.json' with { type: 'json' };
import middleEast from './middle-east.json' with { type: 'json' };
import americas from './americas.json' with { type: 'json' };
import oceania from './oceania.json' with { type: 'json' };
import centralAsia from './central-asia.json' with { type: 'json' };
import globalMarkers from './global.json' with { type: 'json' };
import keyAims from './key_aims.json' with { type: 'json' };

export const ANCESTRY_MARKERS = [
  ...africa,
  ...europe,
  ...eastAsia,
  ...southAsia,
  ...middleEast,
  ...americas,
  ...oceania,
  ...centralAsia,
  ...globalMarkers,
  ...keyAims
];
