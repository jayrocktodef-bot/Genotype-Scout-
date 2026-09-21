import { clearResults } from '../services/storageService';

/**
 * Unique cache epoch identifier. Bumping this string forces all connecting clients
 * to automatically invalidate stale Service Workers, CacheStorage, and IndexedDB caches.
 */
export const APP_CACHE_EPOCH = 'v5.22.1_nuclear_clean_20260920';

/**
 * Known IndexedDB database names used by Genotype Scout, workbox, or local storage wrappers.
 * Used as a deterministic fallback deletion list, particularly for browsers lacking indexedDB.databases() (e.g. Firefox).
 */
const KNOWN_INDEXEDDB_NAMES = [
  'genotype-scout-db',
  'keyval-store',
  'genotype_scout_db',
  'localforage',
  'idb-keyval',
  '_pouch_genotype_scout',
  'workbox-expiration-cache',
  'workbox-precaching'
];

/**
 * Forcefully clears all Service Workers, active background worker threads, CacheStorage,
 * IndexedDB data, web storage, and cookies, then optionally reloads the application cleanly.
 */
export async function forceResetAndClearCache(reload: boolean = true): Promise<void> {
  console.warn('[CacheManager] Executing nuclear reset and complete client cache purge...');

  // 1. Broadcast nuclear reset event to all other concurrent tabs/windows
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('scout-nuclear-reset');
      channel.postMessage({ type: 'FORCE_DISCONNECT_AND_RELOAD', timestamp: Date.now() });
      channel.close();
    } catch (err) {
      console.warn('[CacheManager] BroadcastChannel notify error:', err);
    }
  }

  // 2. Unregister all active Service Workers & post termination commands
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        try {
          if (registration.active) {
            registration.active.postMessage({ type: 'SKIP_WAITING' });
            registration.active.postMessage({ type: 'CLEAR_CACHES' });
          }
          await registration.unregister();
          console.log('[CacheManager] Unregistered SW:', registration.scope);
        } catch (e) {
          console.warn('[CacheManager] Error unregistering SW registration:', e);
        }
      }
    } catch (err) {
      console.error('[CacheManager] Failed to unregister SW:', err);
    }
  }

  // 3. Purge all CacheStorage entries
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cacheNames = await window.caches.keys();
      await Promise.allSettled(
        cacheNames.map(name => {
          console.log('[CacheManager] Deleting CacheStorage:', name);
          return window.caches.delete(name);
        })
      );
    } catch (err) {
      console.error('[CacheManager] Failed to purge CacheStorage:', err);
    }
  }

  // 4. Clear application IndexedDB stores via service and explicit database drops
  try {
    await clearResults();
  } catch (err) {
    console.warn('[CacheManager] Error clearing storageService results:', err);
  }

  if (typeof indexedDB !== 'undefined') {
    const dbsToDelete = new Set<string>(KNOWN_INDEXEDDB_NAMES);

    // Query databases dynamically on supported modern browsers (Chrome 88+, Safari 16.6+, Edge)
    if ('databases' in indexedDB && typeof indexedDB.databases === 'function') {
      try {
        const existingDbs = await indexedDB.databases();
        for (const db of existingDbs) {
          if (db.name) {
            dbsToDelete.add(db.name);
          }
        }
      } catch (e) {
        console.warn('[CacheManager] indexedDB.databases() error:', e);
      }
    }

    // Delete each discovered & known database
    for (const dbName of dbsToDelete) {
      try {
        await new Promise<void>((resolve) => {
          try {
            const req = indexedDB.deleteDatabase(dbName);
            req.onsuccess = () => resolve();
            req.onerror = () => resolve();
            req.onblocked = () => {
              console.warn(`[CacheManager] Database ${dbName} blocked, continuing...`);
              resolve();
            };
            // 500ms safety timeout to prevent hanging on blocked connections
            setTimeout(resolve, 500);
          } catch {
            resolve();
          }
        });
        console.log('[CacheManager] Deleted IndexedDB:', dbName);
      } catch (err) {
        console.warn(`[CacheManager] Failed to delete IndexedDB ${dbName}:`, err);
      }
    }
  }

  // 5. Clear Web Storage (localStorage, sessionStorage) while stamping latest epoch
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
      localStorage.setItem('genotype_scout_cache_epoch', APP_CACHE_EPOCH);
      localStorage.setItem('scout_version_lock', APP_CACHE_EPOCH);
    }
  } catch (err) {
    console.warn('[CacheManager] Error clearing web storage:', err);
  }

  // 6. Expire any client-accessible cookies
  if (typeof document !== 'undefined' && document.cookie) {
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          if (typeof window !== 'undefined' && window.location?.hostname) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        }
      }
    } catch (err) {
      console.warn('[CacheManager] Error clearing cookies:', err);
    }
  }

  // 7. Hard reload the page with a cache-busting timestamp parameter
  if (reload && typeof window !== 'undefined' && window.location) {
    const freshUrl = `${window.location.origin}${window.location.pathname}?__fresh=${Date.now()}`;
    window.location.replace(freshUrl);
  }
}

/**
 * Enforces cache epoch integrity on startup.
 * Automatically flushes stale caches if a new build or explicit URL reset param is detected.
 */
export async function enforceCacheEpoch(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Manual URL override: e.g. ?reset=1, ?clear=1, ?cache_clear=1, ?force_reset=1, ?__fresh=...
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
