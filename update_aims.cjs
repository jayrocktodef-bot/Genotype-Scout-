const fs = require('fs');

let content = fs.readFileSync('src/anchorAims.ts', 'utf8');

// We will use regex to add weight to all objects.
// An object looks like:
//   {
//     rsid: 'rs...',
//     region: '...',
//     alleles: ['...'],
//     frequencies: { ... },
//     description: '...'
//   }

// First, let's add weight: 1.0 to everything that doesn't have it.
// We can do this by finding `alleles: [...],` and adding `weight: 1.0,` after it, 
// UNLESS it already has weight.

let updatedContent = content.replace(/alleles:\s*\[.*?\],\n/g, (match) => {
  return match + "    weight: 1.0,\n";
});

// Now let's update tie-breakers to have weight 3.5
updatedContent = updatedContent.replace(/weight:\s*1\.0,\s*\n(\s*frequencies:[\s\S]*?description:\s*'.*?Tie-Breaker.*?')/g, "weight: 3.5,\n$1");

// Now let's update the specific ones the user mentioned.
// rs2814778
updatedContent = updatedContent.replace(
  /rsid:\s*'rs2814778',[\s\S]*?description:\s*'Duffy Null Phenotype.*?'\n\s*}/,
  `rsid: 'rs2814778',
    region: 'African',
    alleles: ['C'],
    weight: 4.0, // Highly diagnostic, so we give it a massive math multiplier
    frequencies: { AFR: 0.99, EUR: 0.01, EAS: 0.01, AMR: 0.1, SAS: 0.01, MENA: 0.05 },
    subFrequencies: { Yoruba: 0.99, Igbo: 0.98, Luhya: 0.95, Maasai: 0.85, Amhara: 0.35 }, 
    description: 'Duffy Null Phenotype - highly prevalent in West Africa, provides resistance to P. vivax malaria.'
  }`
);

// rs12913832
updatedContent = updatedContent.replace(
  /rsid:\s*'rs12913832',[\s\S]*?description:\s*'.*?HERC2.*?'\n\s*}/g,
  `rsid: 'rs12913832',
    region: 'European',
    alleles: ['G'],
    weight: 2.0,
    frequencies: { AFR: 0.05, EUR: 0.85, EAS: 0.05, AMR: 0.1, SAS: 0.2, MENA: 0.8 },
    subFrequencies: { Alpine: 0.88, Celtic: 0.85, Basque: 0.82, Andalusian: 0.70 },
    description: 'HERC2 variant - associated with eye color and European ancestry.'
  }`
);

// rs10456200
updatedContent = updatedContent.replace(
  /rsid:\s*'rs10456200',[\s\S]*?description:\s*'.*?'\n\s*}/g,
  `rsid: 'rs10456200',
    region: 'East Asian',
    alleles: ['A'],
    weight: 3.5, // Tie-breaker marker, so it gets a high weight
    frequencies: { AFR: 0.01, AMR: 0.01, EAS: 0.98, EUR: 0.01, SAS: 0.01, MENA: 0 },
    subFrequencies: { Korean: 0.98, Japanese: 0.85, Han_Chinese: 0.80 },
    description: 'Korean Ancestry Marker - informative for Korean populations.'
  }`
);

fs.writeFileSync('src/anchorAims.ts', updatedContent);
console.log("Done");
