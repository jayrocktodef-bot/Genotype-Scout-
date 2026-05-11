import { describe, it, expect } from 'vitest';
import { calculatePopulationProximity } from './ancestry/populationComparison';

describe('calculatePopulationProximity', () => {
  it('should return a list of populations with similarity scores', () => {
    // rs1426654 has AA, AG, GG in population data
    const userSnps = { 'rs1426654': 'AA' };
    const results = calculatePopulationProximity(userSnps);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('similarity');
  });
});
