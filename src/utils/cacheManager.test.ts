import { describe, it, expect, vi, beforeEach } from 'vitest';
import { APP_CACHE_EPOCH, forceResetAndClearCache, enforceCacheEpoch } from './cacheManager';

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
};

describe('cacheManager', () => {
  let localMock: any;
  let sessionMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    localMock = createStorageMock();
    sessionMock = createStorageMock();

    Object.defineProperty(global, 'localStorage', {
      value: localMock,
      writable: true,
      configurable: true
    });
    Object.defineProperty(global, 'sessionStorage', {
      value: sessionMock,
      writable: true,
      configurable: true
    });
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          search: '',
          origin: 'http://localhost:3000',
          pathname: '/',
          replace: vi.fn(),
          reload: vi.fn()
        },
        caches: {
          keys: vi.fn().mockResolvedValue(['workbox-precache-v1', 'runtime-cache']),
          delete: vi.fn().mockResolvedValue(true)
        }
      },
      writable: true,
      configurable: true
    });
  });

  it('defines a valid APP_CACHE_EPOCH', () => {
    expect(APP_CACHE_EPOCH).toBeDefined();
    expect(typeof APP_CACHE_EPOCH).toBe('string');
    expect(APP_CACHE_EPOCH.length).toBeGreaterThan(5);
  });

  it('performs forceResetAndClearCache without throwing', async () => {
    // Mock navigator.serviceWorker
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: {
          getRegistrations: vi.fn().mockResolvedValue([
            { scope: 'http://localhost/', unregister: vi.fn().mockResolvedValue(true) }
          ])
        }
      },
      writable: true,
      configurable: true
    });

    // Mock caches
    Object.defineProperty(global, 'caches', {
      value: {
        keys: vi.fn().mockResolvedValue(['workbox-precache-v1', 'runtime-cache']),
        delete: vi.fn().mockResolvedValue(true)
      },
      writable: true,
      configurable: true
    });

    await expect(forceResetAndClearCache(false)).resolves.not.toThrow();
    expect(localStorage.getItem('genotype_scout_cache_epoch')).toBe(APP_CACHE_EPOCH);
  });

  it('enforces cache epoch when localStorage epoch is outdated', async () => {
    localStorage.setItem('genotype_scout_cache_epoch', 'old_epoch_v1');
    const resetTriggered = await enforceCacheEpoch();
    expect(resetTriggered).toBe(true);
    expect(localStorage.getItem('genotype_scout_cache_epoch')).toBe(APP_CACHE_EPOCH);
  });

  it('skips reset if cache epoch matches current epoch', async () => {
    localStorage.setItem('genotype_scout_cache_epoch', APP_CACHE_EPOCH);
    const resetTriggered = await enforceCacheEpoch();
    expect(resetTriggered).toBe(false);
  });
});
