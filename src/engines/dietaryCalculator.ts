
export const dietLogic = {
  caffeine: {
    rsid: 'rs762551',
    interpret: (geno: string) => {
      if (geno === 'AA') return { desc: 'Fast Metabolizer', advice: 'Caffeine may provide ergogenic benefits.' };
      if (geno === 'CC') return { desc: 'Slow Metabolizer', advice: 'Limit intake to <200mg to avoid cardiac stress.' };
      return { desc: 'Intermediate', advice: 'Moderate intake is generally safe.' };
    }
  },
  saturatedFat: {
    rsid: 'rs5082',
    interpret: (geno: string) => {
      if (geno === 'CC') return { desc: 'High Sensitivity', advice: 'High saturated fat intake is strongly linked to weight gain.' };
      return { desc: 'Normal', advice: 'Standard healthy fat guidelines apply.' };
    }
  }
};
