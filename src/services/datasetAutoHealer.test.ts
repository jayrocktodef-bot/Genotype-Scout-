/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { healCachedDatasets, CURRENT_DATASET_SCHEMA_VERSION } from './datasetAutoHealer';
import * as opfs from './opfsStorageService';

vi.mock('./opfsStorageService', () => ({
  loadSnpMapFromOPFS: vi.fn(),
  saveSnpMapToOPFS: vi.fn()
}));

describe('datasetAutoHealer with OPFS integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips datasets that are already current and populated', async () => {
    const snpMapsRef: { current: Record<number, Record<string, string>> } = { current: {} };
    const dataset = {
      _schemaVersion: CURRENT_DATASET_SCHEMA_VERSION,
      mergedSnpMap: { rs1: 'AA' },
      analysis: {
        subpopulationOracle: {
          _engineVersion: 'v3-bayesian-deconv',
          admixtureMix: [{ label: 'PopA', percentage: 60 }, { label: 'PopB', percentage: 40 }]
        }
      }
    };

    const res = await healCachedDatasets([dataset], snpMapsRef);
    expect(res.hasChanges).toBe(false);
    expect(snpMapsRef.current[0]).toEqual({ rs1: 'AA' });
  });

  it('loads missing mergedSnpMap from OPFS when available', async () => {
    const dataset = {
      name: 'Kit_OPFS_User',
      results: []
    };

    const opfsMap = { rs123: 'CC', rs456: 'TT' };
    vi.mocked(opfs.loadSnpMapFromOPFS).mockResolvedValueOnce(opfsMap);

    const snpMapsRef: { current: Record<number, Record<string, string>> } = { current: {} };
    const res = await healCachedDatasets([dataset], snpMapsRef);

    expect(opfs.loadSnpMapFromOPFS).toHaveBeenCalledWith('Kit_OPFS_User');
    expect(res.updated[0].mergedSnpMap).toEqual(opfsMap);
    expect(res.hasChanges).toBe(true);
    expect(snpMapsRef.current[0]).toEqual(opfsMap);
  });

  it('falls back to reconstructing from results if OPFS has no map', async () => {
    const dataset = {
      name: 'Kit_Legacy_User',
      results: [
        { rsid: 'rs100', genotype: 'GG' },
        { rsid: 'rs200', genotype: '--' }
      ]
    };

    vi.mocked(opfs.loadSnpMapFromOPFS).mockResolvedValueOnce(null);

    const snpMapsRef: { current: Record<number, Record<string, string>> } = { current: {} };
    const res = await healCachedDatasets([dataset], snpMapsRef);

    expect(res.updated[0].mergedSnpMap).toEqual({ rs100: 'GG' });
    expect(res.hasChanges).toBe(true);
    expect(snpMapsRef.current[0]).toEqual({ rs100: 'GG' });
  });
});
