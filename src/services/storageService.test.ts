import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as idb from 'idb-keyval';
import { saveResults, loadResults, clearResults, MAX_STORED_PROFILES } from './storageService';
import { checkStorageQuota } from '../utils/cacheManager';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn()
}));

describe('storageService & cacheManager quota governance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('defines MAX_STORED_PROFILES as 3 for mobile RAM and quota protection', () => {
    expect(MAX_STORED_PROFILES).toBe(3);
  });

  it('caps stored analysis history to the most recent 3 datasets (LRU eviction)', async () => {
    const fiveDatasets = [
      { id: 'kit1', name: 'Kit 1' },
      { id: 'kit2', name: 'Kit 2' },
      { id: 'kit3', name: 'Kit 3' },
      { id: 'kit4', name: 'Kit 4' },
      { id: 'kit5', name: 'Kit 5' }
    ];

    await saveResults(fiveDatasets);

    expect(idb.set).toHaveBeenCalledTimes(1);
    const savedData = (vi.mocked(idb.set).mock.calls[0] as any)[1];
    expect(savedData).toHaveLength(3);
    expect(savedData[0].id).toBe('kit3');
    expect(savedData[1].id).toBe('kit4');
    expect(savedData[2].id).toBe('kit5');
  });

  it('performs emergency eviction down to the single latest kit on QuotaExceededError', async () => {
    const quotaError = new Error('QuotaExceeded');
    quotaError.name = 'QuotaExceededError';

    // First attempt rejects with QuotaExceededError, second attempt succeeds
    vi.mocked(idb.set)
      .mockRejectedValueOnce(quotaError)
      .mockResolvedValueOnce(undefined);

    const datasets = [
      { id: 'kit1', name: 'Kit 1' },
      { id: 'kit2', name: 'Kit 2' },
      { id: 'kit3', name: 'Kit 3' }
    ];

    await saveResults(datasets);

    expect(idb.set).toHaveBeenCalledTimes(2);
    // Second call should contain only the latest dataset
    const emergencySavedData = (vi.mocked(idb.set).mock.calls[1] as any)[1];
    expect(emergencySavedData).toHaveLength(1);
    expect(emergencySavedData[0].id).toBe('kit3');
  });

  it('checkStorageQuota returns quota metrics when navigator.storage is available', async () => {
    const originalNavigator = global.navigator;
    try {
      const mockStorage = {
        estimate: vi.fn().mockResolvedValue({
          usage: 40_000_000,
          quota: 100_000_000
        })
      };

      Object.defineProperty(global, 'navigator', {
        value: { storage: mockStorage },
        configurable: true,
        writable: true
      });

      const info = await checkStorageQuota();
      expect(info).not.toBeNull();
      expect(info?.usage).toBe(40_000_000);
      expect(info?.quota).toBe(100_000_000);
      expect(info?.percentUsed).toBe(40);
      expect(info?.isNearQuota).toBe(false);
    } finally {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true
      });
    }
  });

  it('flags isNearQuota when usage exceeds 80%', async () => {
    const originalNavigator = global.navigator;
    try {
      const mockStorage = {
        estimate: vi.fn().mockResolvedValue({
          usage: 85_000_000,
          quota: 100_000_000
        })
      };

      Object.defineProperty(global, 'navigator', {
        value: { storage: mockStorage },
        configurable: true,
        writable: true
      });

      const info = await checkStorageQuota();
      expect(info?.isNearQuota).toBe(true);
    } finally {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true
      });
    }
  });
});
