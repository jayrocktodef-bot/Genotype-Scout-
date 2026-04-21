
import snps from './src/data/snps.json';
import aims from './src/aims.cleaned.json';

function findDuplicates(items: any[], idField: string, continentField: string, continentValue: string) {
  const seen = new Map<string, number>();
  const duplicates: string[] = [];
  
  items
    .filter(item => item[continentField] === continentValue)
    .forEach(item => {
      const id = item[idField];
      if (id) {
        const count = seen.get(id) || 0;
        if (count === 1) duplicates.push(id);
        seen.set(id, count + 1);
      }
    });
    
  return duplicates;
}

console.log('Duplicates in snps.json (European):', findDuplicates(snps, 'rsid', 'continent', 'European'));
console.log('Duplicates in aims.cleaned.json (European):', findDuplicates(aims, 'rsid', 'region', 'European'));
