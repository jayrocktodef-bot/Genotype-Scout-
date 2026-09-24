import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = "genotype_scout_results";

/**
 * Request persistent browser storage so Safari iOS (ITP 7-day rule) and Chrome
 * do not unexpectedly evict user genotype profiles under memory pressure.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        return await navigator.storage.persist();
      }
      return true;
    }
  } catch (err) {
    console.warn('Storage persistence request not supported or denied:', err);
  }
  return false;
}

export const MAX_STORED_PROFILES = 3;

export const saveResults = async (results: any[]) => {
  try {
    // Request persistent storage in the background
    requestPersistentStorage().catch(() => {});

    // LRU eviction: Cap stored analysis history to the most recent 3 profiles to prevent mobile quota crashes
    const toStore = Array.isArray(results) && results.length > MAX_STORED_PROFILES
      ? results.slice(-MAX_STORED_PROFILES)
      : results;

    await set(STORAGE_KEY, toStore);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      console.warn("IndexedDB QuotaExceededError: Local browser storage is full. Evicting older datasets to save current kit...", e);
      try {
        // Emergency single-dataset fallback: retain only the latest uploaded specimen
        const emergencyToStore = Array.isArray(results) ? results.slice(-1) : results;
        await set(STORAGE_KEY, emergencyToStore);
      } catch (fallbackErr) {
        console.error("IndexedDB Emergency Fallback Failed: Browser storage strictly exhausted.", fallbackErr);
      }
    } else {
      console.error("Failed to save results to IndexedDB", e);
    }
  }
};

export const loadResults = async () => {
  try {
    return await get(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to load results from IndexedDB", e);
    return null;
  }
};

export const clearResults = async () => {
  try {
    await del(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear IndexedDB", e);
  }
};
