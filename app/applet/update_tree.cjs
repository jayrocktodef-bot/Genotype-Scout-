const fs = require('fs');
const content = fs.readFileSync('src/genotypeData.ts', 'utf8');

// Extract SNP_DB
const snpMatch = content.match(/export const SNP_DB: SNP\[\] = \[([\s\S]*?)\];/);
const haploToRsid = {};
if (snpMatch) {
  const snps = snpMatch[1].split('},');
  snps.forEach(s => {
    if (s.includes('Haplogroup')) {
      const traitMatch = s.match(/trait:\s*\"([^\"]+)\"/);
      const rsidMatch = s.match(/rsid:\s*\"([^\"]+)\"/);
      if (traitMatch && rsidMatch) {
        let trait = traitMatch[1].replace(' (root)', '').replace(' (root, parallel)', '').replace(' subclade', '').trim();
        if (!haploToRsid[trait]) {
          haploToRsid[trait] = [];
        }
        haploToRsid[trait].push(rsidMatch[1]);
      }
    }
  });
}

console.log("Found RSIDs for Haplogroups:", haploToRsid);

// Now we need to update Y_DNA_TREE in the file
// We can do this by finding the Y_DNA_TREE object and replacing it, or just doing a regex replace for each branchName.

let newContent = content;
for (const [haplo, rsids] of Object.entries(haploToRsid)) {
  // Find the branchName in Y_DNA_TREE
  // e.g. branchName: "Haplogroup C2", snp: ["M217"]
  // We want to add rsids to the snp array.
  
  const regex = new RegExp(`(branchName:\\s*"${haplo}"(?:[\\s\\S]*?)snp:\\s*\\[)([^\\]]+)(\\])`);
  newContent = newContent.replace(regex, (match, p1, p2, p3) => {
    let existingSnps = p2.split(',').map(s => s.trim().replace(/"/g, ''));
    let added = false;
    for (const rsid of rsids) {
      if (!existingSnps.includes(rsid)) {
        existingSnps.push(rsid);
        added = true;
      }
    }
    if (added) {
      return `${p1}${existingSnps.map(s => `"${s}"`).join(', ')}${p3}`;
    }
    return match;
  });
}

fs.writeFileSync('src/genotypeData.ts', newContent);
console.log("Updated src/genotypeData.ts");
