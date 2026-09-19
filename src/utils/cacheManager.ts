import { clearResults } from '../services/storageService';

/**
 * Unique cache epoch identifier. Bumping this string forces all connecting clients
 * to automatically invalidate stale Service Workers, CacheStorage, and IndexedDB caches.
 */
export const APP_CACHE_EPOCH = 'v5.22.0_force_clean_20260919';

/**
 * Forcefully clears all Service Workers, CacheStorage, IndexedDB data,
 * and browser storage, then optionally reloads the application cleanly.
 */
export async function forceResetAndClearCache(reload: boolean = true): Promise<void> {
  console.warn('[CacheManager] Executing forced reset and cache purge...');

  // 1. Unregister all active Service Workers
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('[CacheManager] Unregistered SW:', registration.scope);
      }
    } catch (err) {
      console.error('[CacheManager] Failed to unregister SW:', err);
    }
  }

  // 2. Purge all CacheStorage entries
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cacheNames = await window.caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          console.log('[CacheManager] Deleting cache:', name);
          return window.caches.delete(name);
        })
      );
    } catch (err) {
      console.error('[CacheManager] Failed to purge CacheStorage:', err);
    }
  }

  // 3. Clear application IndexedDB results and stores
  try {
    await clearResults();
  } catch (err) {
    console.warn('[CacheManager] Error clearing storageService results:', err);
  }

  if (typeof indexedDB !== 'undefined') {
    try {
      indexedDB.deleteDatabase('genotype-scout-db');
      indexedDB.deleteDatabase('keyval-store');
    } catch (err) {
      console.warn('[CacheManager] Error deleting IndexedDB databases:', err);
    }
  }

  // 4. Clear Web Storage while maintaining the latest epoch and version tokens
  try {
    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem('genotype_scout_cache_epoch', APP_CACHE_EPOCH);
    localStorage.setItem('scout_version_lock', APP_CACHE_EPOCH);
  } catch (err) {
    console.warn('[CacheManager] Error clearing local storage:', err);
  }

  // 5. Hard reload the page without query parameters if requested
  if (reload && typeof window !== 'undefined') {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.location.replace(cleanUrl);
  }
}

/**
 * Enforces cache epoch integrity on startup.
 * Automatically flushes stale caches if a new build or explicit URL reset param is detected.
 */
export async function enforceCacheEpoch(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Manual URL override: e.g. ?reset=1, ?clear=1, ?cache_clear=1, ?force_reset=1
  const searchParams = new URLSearchParams(window.location.search);
  if (
    searchParams.has('reset') || 
    searchParams.has('clear') || 
    searchParams.has('cache_clear') ||
    searchParams.has('force_reset')
  ) {
    console.warn('[CacheManager] Manual reset query parameter detected. Purging all caches.');
    await forceResetAndClearCache(true);
    return true;
  }

  // Epoch mismatch check
  try {
    const currentEpoch = localStorage.getItem('genotype_scout_cache_epoch');
    if (currentEpoch !== APP_CACHE_EPOCH) {
      console.warn(
        `[CacheManager] Stale cache epoch detected (${currentEpoch ?? 'none'} vs ${APP_CACHE_EPOCH}). Performing one-time cache flush.`
      );
      await forceResetAndClearCache(true);
      return true;
    }
  } catch (err) {
    console.warn('[CacheManager] Could not read cache epoch from localStorage:', err);
  }

  return false;
}
