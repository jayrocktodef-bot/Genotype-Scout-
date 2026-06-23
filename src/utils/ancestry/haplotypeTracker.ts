/**
 * Historical Haplotype Tracking for Sickle Cell (rs334)
 * Distinguishes between Benin and Senegal migration paths based on surrounding markers.
 */

export interface HaplotypeMigration {
  type: 'Benin' | 'Senegal' | null;
  path: string;
  narrative: string;
}

export function trackSickleCellHaplotype(userSnps: Record<string, string>): HaplotypeMigration | null {
  // rs334 is the primary Sickle Cell mutation
  const hbb = userSnps['rs334'];
  if (!hbb || hbb === 'AA') return null; // No mutation detected

  // Diagnostic surrounding markers for Benin vs Senegal haplotypes
  // Benin: Associated with G at rs11542041 and C at rs11542042
  // Senegal: Associated with A at rs11542041 and T at rs11542042
  // (Simplified for this forensic implementation)
  
  const m1 = userSnps['rs11542041'];
  const m2 = userSnps['rs11542042'];

  if (m1?.includes('G') || m2?.includes('C')) {
    return {
      type: 'Benin',
      path: 'Nigeria → NE Africa → Arabia → Iraq',
      narrative: 'Your HBB variant matches the Benin haplotype, which originated in the bight of Benin and historically migrated through Northeast Africa entering the Middle East.'
    };
  }

  if (m1?.includes('A') || m2?.includes('T')) {
    return {
      type: 'Senegal',
      path: 'Senegal → Mauritania → Trans-Sahara → S. Europe',
      narrative: 'Your HBB variant matches the Senegal haplotype, historically associated with West African groups (Mende/Wolof) that migrated across the Sahara into Southern Europe.'
    };
  }

  return null;
}
