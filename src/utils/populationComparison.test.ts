import { describe, it, expect } from 'vitest';
import { calculatePopulationProximity } from './ancestry/populationComparison';

describe('calculatePopulationProximity', () => {
  it('should return a list of populations with similarity scores', () => {
    // rs2887286 is in the modern reference kernel population data
    const userSnps = { 'rs2887286': 'AA' };
    const results = calculatePopulationProximity(userSnps);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('similarityScore');
  });
});
