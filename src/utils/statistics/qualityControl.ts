
export function calculateFileIntegrity(rawSnps: any[]) {
  const total = rawSnps.length;
  const missing = rawSnps.filter(s => s.genotype === '--' || s.genotype === '00').length;
  const callRate = total > 0 ? ((total - missing) / total) * 100 : 0;

  return {
    callRate: callRate.toFixed(2),
    // Standard bioinformatics threshold is 98% for professional research
    isReliable: callRate > 98,
    status: callRate > 99 ? "High-Fidelity" : "Low-Quality"
  };
}
