// src/services/dbHydrator.ts

const DB_NAME = 'genotype-scout-db';
const DB_VERSION = 4;
const STORE_NAME = 'aims';

let dbInstance: IDBDatabase | null = null;
let cachedKeys: string[] | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not defined in this environment.'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      db.createObjectStore(STORE_NAME);
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Hydrates the local IndexedDB database with Master AIMs if not already populated.
 * Runs asynchronously in the background.
 */
export async function hydrateReferenceDatabase(): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    console.warn('IndexedDB not supported in this environment (likely Node.js/Vitest). Skipping hydration.');
    return;
  }

  try {
    const db = await getDB();
    
    // Check if already seeded
    const isSeeded = await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('__seeded');
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });

    if (isSeeded) {
      console.log('📡 IndexedDB Genomic DB already hydrated.');
      return;
    }

    console.log('🚀 Hydrating IndexedDB Genomic Reference Database (17,000+ markers)...');
    
    // Dynamically import reference JSON to save RAM on normal startup
    const { loadMasterAims } = await import('../data/index');
    const masterAims = loadMasterAims();
    
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Batch write markers (write both the suffixed key and standard base key)
    const seenBases = new Set<string>();

    // Pass 1: Insert all exact keys
    for (const [rsid, markerData] of Object.entries(masterAims)) {
      const lower = rsid.toLowerCase();
      store.put(markerData, lower);
      if (lower.indexOf('_') === -1) {
        seenBases.add(lower);
      }
    }

    // Pass 2: Insert base aliases only if the base key does not natively exist
    for (const [rsid, markerData] of Object.entries(masterAims)) {
      const lower = rsid.toLowerCase();
      const base = lower.split('_')[0];
      if (base !== lower && !seenBases.has(base)) {
        store.put(markerData, base);
        seenBases.add(base); // Prevent another suffix from overwriting it
      }
    }
    
    // Set seed complete flag
    store.put(true, '__seeded');

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log('📡 IndexedDB Genomic DB hydration successful. ✓');
        resolve();
      };
      tx.onerror = () => {
        console.error('IndexedDB hydration failed:', tx.error);
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error('Failed to open database for hydration:', error);
  }
}

/**
 * Retrieves all RSID keys from IndexedDB.
 */
export async function getIndexedDBKeys(): Promise<string[]> {
  if (cachedKeys) return cachedKeys;

  if (typeof indexedDB === 'undefined') {
    // Node.js/Vitest environment fallback
    const { loadMasterAims } = await import('../data/index');
    const masterAims = loadMasterAims();
    cachedKeys = Object.keys(masterAims).map(k => k.toLowerCase());
    return cachedKeys;
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      
      req.onsuccess = () => {
        const keys = (req.result as string[]).filter(k => k !== '__seeded');
        cachedKeys = keys;
        resolve(keys);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    console.error('Error fetching IndexedDB keys:', err);
    // Dynamic fallback
    const { loadMasterAims } = await import('../data/index');
    const masterAims = loadMasterAims();
    cachedKeys = Object.keys(masterAims).map(k => k.toLowerCase());
    return cachedKeys;
  }
}

/**
 * Queries IndexedDB for a specific set of RSIDs and returns a map of matches.
 */
export async function getAimsByRsids(rsids: string[]): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  if (rsids.length === 0) {
    return results;
  }

  if (typeof indexedDB === 'undefined') {
    // Node.js/Vitest environment fallback
    const { loadMasterAims } = await import('../data/index');
    const masterAims = loadMasterAims() as Record<string, any>;
    
    // First pass: exact matches
    const baseMap = new Map<string, any>();
    for (const [key, val] of Object.entries(masterAims)) {
      baseMap.set(key.toLowerCase(), val);
    }
    
    // Second pass: base fallbacks
    for (const [key, val] of Object.entries(masterAims)) {
      const base = key.toLowerCase().split('_')[0];
      if (!baseMap.has(base)) {
        baseMap.set(base, val);
      }
    }

    for (const rsid of rsids) {
      const cleanRsid = rsid.toLowerCase();
      const match = baseMap.get(cleanRsid);
      if (match) {
        results[cleanRsid] = match;
      }
    }
    return results;
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      let completed = 0;
      const total = rsids.length;

      for (const rsid of rsids) {
        const cleanRsid = rsid.toLowerCase();
        const req = store.get(cleanRsid);
        
        req.onsuccess = () => {
          if (req.result) {
            results[cleanRsid] = req.result;
          }
          completed++;
          if (completed === total) {
            resolve(results);
          }
        };

        req.onerror = () => {
          completed++;
          if (completed === total) {
            resolve(results);
          }
        };
      }

      tx.onerror = () => {
        reject(tx.error);
      };
    });
  } catch (err) {
    console.error('Error in getAimsByRsids:', err);
    // Dynamic fallback
    const { loadMasterAims } = await import('../data/index');
    const masterAims = loadMasterAims() as Record<string, any>;
    
    const baseMap = new Map<string, any>();
    
    // First pass: exact matches
    for (const [key, val] of Object.entries(masterAims)) {
      baseMap.set(key.toLowerCase(), val);
    }
    
    // Second pass: base fallbacks
    for (const [key, val] of Object.entries(masterAims)) {
      const base = key.toLowerCase().split('_')[0];
      if (!baseMap.has(base)) {
        baseMap.set(base, val);
      }
    }

    for (const rsid of rsids) {
      const cleanRsid = rsid.toLowerCase();
      const match = baseMap.get(cleanRsid);
      if (match) {
        results[cleanRsid] = match;
      }
    }
    return results;
  }
}

