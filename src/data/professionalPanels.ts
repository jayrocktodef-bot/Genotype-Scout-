
export interface RawProfessionalMarker {
  rsid: string;
  panel: string;
  source: string;
}

// In a real scenario, this would have actual frequency data.
// Since we have the panels but might lack detailed frequencies for all, 
// we will assign strong weights and default frequencies.

export const formatProfessionalMarkers = (markers: any[] | Record<string, any>): any[] => {
  const markerArray = Array.isArray(markers) 
    ? markers 
    : Object.entries(markers).map(([rsid, data]) => {
        if (typeof data === 'object' && data !== null) {
          return { rsid, ...data };
        }
        return { rsid, frequencies: data };
      });

  return markerArray.map(m => ({
    rsid: m.rsid,
    region: m.region || 'Global',
    alleles: m.alleles || ['A', 'C', 'G', 'T'],
    weight: m.weight || 10.0,
    significance: 'High',
    frequencies: m.frequencies || { 'EUR': 0.5, 'AFR': 0.5, 'EAS': 0.5, 'SAS': 0.5, 'AMR': 0.5 },
    description: `Professional panel marker: ${m.panel || 'Unknown'} from ${m.source || 'Unknown'}`
  }));
};
