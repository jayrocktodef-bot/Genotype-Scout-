
export const dietLogic = {
  caffeine: {
    rsid: 'rs762551',
    interpret: (geno: string) => {
      const g = geno ? geno.trim().toUpperCase().replace(/[\s\/_]/g, '') : '';
      if (!g || g === '--' || g === '00' || g === 'NN' || g === '??' || g.length < 2) {
        return { desc: 'Unknown', advice: 'Marker not genotyped in this raw DNA sample.' };
      }
      if (g === 'AA' || g === 'TT') return { desc: 'Fast Metabolizer', advice: 'Caffeine may provide ergogenic benefits.' };
      if (g === 'CC' || g === 'GG') return { desc: 'Slow Metabolizer', advice: 'Limit intake to <200mg to avoid cardiac stress.' };
      return { desc: 'Intermediate', advice: 'Moderate intake is generally safe.' };
    }
  },
  saturatedFat: {
    rsid: 'rs5082',
    interpret: (geno: string) => {
      const g = geno ? geno.trim().toUpperCase().replace(/[\s\/_]/g, '') : '';
      if (!g || g === '--' || g === '00' || g === 'NN' || g === '??' || g.length < 2) {
        return { desc: 'Unknown', advice: 'Marker not genotyped in this raw DNA sample.' };
      }
      if (g === 'CC' || g === 'TT') return { desc: 'High Sensitivity', advice: 'High saturated fat intake is strongly linked to weight gain.' };
      return { desc: 'Normal', advice: 'Standard healthy fat guidelines apply.' };
    }
  }
};
