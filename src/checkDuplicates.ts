import aimsData from './aims.json';

const findDuplicates = (aims: any[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  aims.forEach(aim => {
    if (seen.has(aim.rsid)) {
      duplicates.add(aim.rsid);
    } else {
      seen.add(aim.rsid);
    }
  });

  return Array.from(duplicates);
};

const duplicateRsids = findDuplicates(aimsData);

if (duplicateRsids.length > 0) {
  console.log("Duplicate markers found:", duplicateRsids);
} else {
  console.log("No duplicates found. The dataset is clean.");
}