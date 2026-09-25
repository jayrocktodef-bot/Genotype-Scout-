import { describe, it, expect } from 'vitest';
import { resolveMarkerRegion } from './GeneticMarkersBrowser';
import { ALL_REGION_AIMS } from '../data/aims/index';

describe('GeneticMarkersBrowser Region Resolution & AIM Integrity', () => {
  it('correctly resolves Western Sahelian / Senegambian marker to African even if explicit region had container mismatch', () => {
    const corruptMarker = {
      rsid: 'rs7479005',
      region: 'East Asian', // container mismatch from old stub
      trait: 'Senegambian Sahelian AIM',
      description: 'Empirical marker distinguishing Western Sahelian / Senegambian (Fula, Wolof, Mandinka) lineages. (Contrast: 0.78, F_ST: 0.56).'
    };

    const resolved = resolveMarkerRegion(corruptMarker, corruptMarker);
    expect(resolved).toBe('African');
  });

  it('correctly resolves rs7479005 in ALL_REGION_AIMS to African with Senegambian Sahelian AIM trait', () => {
    const marker = ALL_REGION_AIMS['rs7479005'];
    expect(marker).toBeDefined();
    expect(marker.region).toBe('African');
    expect(marker.trait).toBe('Senegambian Sahelian AIM');
    expect(marker.description).toContain('Western Sahelian');
    expect(marker.frequencies.AFR).toBeGreaterThan(0.8);
    expect(marker.frequencies.EAS).toBeLessThan(0.2);
  });

  it('preserves correct regions across major continental diagnostic markers in ALL_REGION_AIMS', () => {
    // East Asian EDAR marker
    const edar = ALL_REGION_AIMS['rs3827760'];
    if (edar) {
      expect(['East Asian', 'Native American', 'Multi-Way Informative']).toContain(edar.region);
    }

    // European SLC24A5 / HERC2 marker
    const herc2 = ALL_REGION_AIMS['rs12913832'];
    if (herc2) {
      expect(['European', 'Multi-Way Informative']).toContain(herc2.region);
    }
  });

  it('correctly resolves various continental lineage keywords via resolveMarkerRegion', () => {
    expect(resolveMarkerRegion({ trait: 'Bantu Expansion Marker' }, null)).toBe('African');
    expect(resolveMarkerRegion({ description: 'Upper Guinean Mandinka ancestry' }, null)).toBe('African');
    expect(resolveMarkerRegion({ trait: 'Celtic Variant', description: 'Insular Celtic lineage' }, null)).toBe('European');
    expect(resolveMarkerRegion({ trait: 'Han Chinese Ancestry Tag' }, null)).toBe('East Asian');
    expect(resolveMarkerRegion({ description: 'Dravidian South Indian marker' }, null)).toBe('South Asian');
    expect(resolveMarkerRegion({ trait: 'Mayan Indigenous AIM' }, null)).toBe('Native American');
    expect(resolveMarkerRegion({ trait: 'Melanesian Specific Marker' }, null)).toBe('Oceanian');
    expect(resolveMarkerRegion({ description: 'Ashkenazi Jewish founder lineage' }, null)).toBe('Middle Eastern');
  });
});
