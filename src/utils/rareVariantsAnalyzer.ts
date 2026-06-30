export interface RareVariant {
  rsid: string;
  genotype: string;
  type: 'internal' | 'unmapped' | 'rare_allele';
  description?: string;
  globalFrequency?: number;
  rarity?: 'ultra_rare' | 'rare' | 'low_frequency';
}

export function identifyRareAndNovelVariants(
  userSnpMap: Record<string, string>,
  knownDbKeys: Set<string>,
  aimsDatabase?: Record<string, any>
): RareVariant[] {
  const variants: RareVariant[] = [];
  let unmappedCount = 0;
  let rareCount = 0;
  
  const aimBaseMap = new Map<string, any>();
  if (aimsDatabase) {
    for (const [key, value] of Object.entries(aimsDatabase)) {
      const base = key.split('_')[0].toLowerCase();
      if (!aimBaseMap.has(base)) {
        aimBaseMap.set(base, value);
      }
    }
  }
  
  for (const [rsid, genotype] of Object.entries(userSnpMap)) {
    const cleanRsid = rsid.toLowerCase();
    
    // Skip no-calls
    if (genotype.includes('-') || genotype === '??' || genotype === 'II' || genotype === 'DD') continue;

    // 1. Internal commercial markers
    if (cleanRsid.match(/^i\d+$/) && variants.filter(v => v.type === 'internal').length < 100) {
      variants.push({
        rsid,
        genotype,
        type: 'internal',
        description: 'Internal microarray marker. Used by commercial tests when a dbSNP RSID was unavailable at chip design.'
      });
      continue;
    }
    
    // 2. Unmapped / Novel RSIDs (sample up to 50 for discovery)
    if (cleanRsid.startsWith('rs') && !knownDbKeys.has(cleanRsid) && unmappedCount < 50) {
       variants.push({
         rsid,
         genotype,
         type: 'unmapped',
         description: 'Variant detected in file but unmapped in local database. May be a newly assigned or rare clinical SNP.'
       });
       unmappedCount++;
       continue;
    }

    // 3. Globally Rare Alleles
    if (aimBaseMap.size > 0 && rareCount < 100) {
      const aim = aimBaseMap.get(cleanRsid);
      
      if (aim && aim.frequencies && aim.alleles && aim.alleles.length > 0) {
        const effectAllele = aim.alleles[0];
        const popFreqs = Object.values(aim.frequencies) as number[];
        if (popFreqs.length > 0) {
          const globalEffectFreq = popFreqs.reduce((a, b) => a + b, 0) / popFreqs.length;
          const userAlleles = genotype.split('');
          
          let isRare = false;
          let minFreq = 1.0;
          
          for (const a of userAlleles) {
            if (a === effectAllele) {
              if (globalEffectFreq < 0.05) {
                isRare = true;
                minFreq = Math.min(minFreq, globalEffectFreq);
              }
            } else {
              const altFreq = 1 - globalEffectFreq;
              if (altFreq < 0.05) {
                isRare = true;
                minFreq = Math.min(minFreq, altFreq);
              }
            }
          }
          
          if (isRare) {
            let rarity: 'ultra_rare' | 'rare' | 'low_frequency' = 'low_frequency';
            if (minFreq < 0.001) {
              rarity = 'ultra_rare';
            } else if (minFreq < 0.01) {
              rarity = 'rare';
            }

            variants.push({
              rsid,
              genotype,
              type: 'rare_allele',
              description: rarity === 'ultra_rare'
                ? `You carry an ultra-rare allele (estimated < 0.1% worldwide).`
                : rarity === 'rare'
                ? `You carry a globally rare allele (estimated < 1% worldwide).`
                : `You carry a low-frequency allele (estimated 1% to 5% worldwide).`,
              globalFrequency: minFreq,
              rarity
            });
            rareCount++;
          }
        }
      }
    }
  }
  
  return variants;
}
