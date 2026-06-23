import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = "genotype_scout_results";

export const saveResults = async (results: any[]) => {
  try {
    // We save the raw results to IndexedDB. 
    // Encryption not needed for local-only binary store, but keeping it simple.
    await set(STORAGE_KEY, results);
  } catch (e) {
    console.error("Failed to save results to IndexedDB", e);
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
