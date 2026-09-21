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

export const saveResults = async (results: any[]) => {
  try {
    // Request persistent storage in the background
    requestPersistentStorage().catch(() => {});
    await set(STORAGE_KEY, results);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      console.error("IndexedDB QuotaExceededError: Local browser storage is full. Please clear old datasets.", e);
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
