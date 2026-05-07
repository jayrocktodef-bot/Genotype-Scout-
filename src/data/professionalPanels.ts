
export interface RawProfessionalMarker {
  rsid: string;
  panel: string;
  source: string;
}

// In a real scenario, this would have actual frequency data.
// Since we have the panels but might lack detailed frequencies for all, 
// we will assign strong weights and default frequencies.

export const formatProfessionalMarkers = (markers: any[]): any[] => {
  return markers.map(m => ({
    rsid: m.rsid,
    region: 'Global',
    alleles: ['A', 'C', 'G', 'T'],
    weight: 10.0, // Forensic grade, strong weight
    significance: 'High',
    frequencies: { 'EUR': 0.5, 'AFR': 0.5, 'EAS': 0.5, 'SAS': 0.5, 'AMR': 0.5 },
    description: `Professional panel marker: ${m.panel} from ${m.source}`
  }));
};
