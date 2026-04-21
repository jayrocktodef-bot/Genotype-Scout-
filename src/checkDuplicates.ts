import aimsData from './aims.cleaned.json' with { type: 'json' };

const findDuplicates = (aims: any[]) => {
  const seenRsids = new Set<string>();
  const duplicateRsids = new Set<string>();
  const seenTraits = new Set<string>();
  const duplicateTraits = new Set<string>();

  aims.forEach(aim => {
    if (seenRsids.has(aim.rsid)) {
      duplicateRsids.add(aim.rsid);
    } else {
      seenRsids.add(aim.rsid);
    }
    if (seenTraits.has(aim.trait)) {
      duplicateTraits.add(aim.trait);
    } else {
      seenTraits.add(aim.trait);
    }
  });

  return { duplicateRsids: Array.from(duplicateRsids), duplicateTraits: Array.from(duplicateTraits) };
};

const { duplicateRsids, duplicateTraits } = findDuplicates(aimsData);

if (duplicateRsids.length > 0) {
  console.log("Duplicate RSIDs found:", duplicateRsids);
}
if (duplicateTraits.length > 0) {
  console.log("Duplicate Trait names found (could be intentional if multiple markers define one trait):", duplicateTraits);
}
if (duplicateRsids.length === 0 && duplicateTraits.length === 0) {
  console.log("No duplicates found. The dataset is clean.");
}