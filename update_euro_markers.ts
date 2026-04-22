
import fs from 'fs';

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));

const updatedSnps = snps.map((snp: any) => {
  if (snp.rsid === 'rs12203592') {
    return { 
      ...snp, 
      subPopulation: 'Northern European', 
      subRegion: 'Northern Europe' 
    };
  }
  if (snp.rsid === 'rs16891985') {
    return { 
      ...snp, 
      continent: 'European',
      subPopulation: 'Northern European', 
      subRegion: 'Northern Europe' 
    };
  }
  return snp;
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(updatedSnps, null, 2));
console.log('Successfully updated rs12203592 and rs16891985.');
