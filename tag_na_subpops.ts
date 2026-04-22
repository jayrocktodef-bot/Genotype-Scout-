
import fs from 'fs';
import snps from './src/data/snps.json';

const updatedSnps = snps.map(snp => {
  if (snp.continent === 'Native American' && (!snp.subPopulation || snp.subPopulation === 'Native American')) {
    // Try to infer subpopulation from trait or description
    const trait = snp.trait?.toLowerCase() || '';
    const desc = snp.description?.toLowerCase() || '';
    
    if (trait.includes('mayan') || desc.includes('mayan')) return { ...snp, subPopulation: 'Mayan' };
    if (trait.includes('quechua') || desc.includes('quechua')) return { ...snp, subPopulation: 'Quechua' };
    if (trait.includes('inuit') || desc.includes('inuit')) return { ...snp, subPopulation: 'Inuit' };
    if (trait.includes('navajo') || desc.includes('navajo')) return { ...snp, subPopulation: 'Navajo' };
    if (trait.includes('cherokee') || desc.includes('cherokee')) return { ...snp, subPopulation: 'Cherokee' };
    
    return { ...snp, subPopulation: 'Indigenous American' }; // General fallback
  }
  return snp;
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(updatedSnps, null, 2));
console.log('Successfully updated Native American subpopulations.');
