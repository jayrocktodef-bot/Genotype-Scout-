/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { get, set, del } from 'idb-keyval';

const OPFS_DIR = 'genotype_scout';
const DATASETS_DIR = 'datasets';
const IDB_FALLBACK_PREFIX = 'opfs_fallback_snp_';
const IDB_BIN_FALLBACK_PREFIX = 'opfs_fallback_bin_';

/**
 * Checks if the Origin Private File System (OPFS) API is supported in the current runtime.
 */
export async function isOPFSSupported(): Promise<boolean> {
  try {
    return (
      typeof navigator !== 'undefined' &&
      Boolean(navigator.storage && typeof navigator.storage.getDirectory === 'function')
    );
  } catch {
    return false;
  }
}

/**
 * Helper to get or create a subdirectory hierarchy in OPFS.
 */
async function getDirectoryRecursive(
  root: FileSystemDirectoryHandle,
  pathSegments: string[],
  create = true
): Promise<FileSystemDirectoryHandle | null> {
  let current = root;
  for (const segment of pathSegments) {
    try {
      current = await current.getDirectoryHandle(segment, { create });
    } catch {
      return null;
    }
  }
  return current;
}

/**
 * Stores a raw chromosome SNP map to the Origin Private File System (OPFS),
 * with graceful fallback to IndexedDB if OPFS is unavailable or encounters an error.
 */
export async function saveSnpMapToOPFS(
  datasetId: string,
  snpMap: Record<string, string>
): Promise<{ success: boolean; usedOPFS: boolean }> {
  const opfsAvailable = await isOPFSSupported();

  if (opfsAvailable) {
    try {
      const root = await navigator.storage.getDirectory();
      const datasetDir = await getDirectoryRecursive(root, [OPFS_DIR, DATASETS_DIR, datasetId], true);
      if (datasetDir) {
        const fileHandle = await datasetDir.getFileHandle('snp_map.json', { create: true });
        const writable = await (fileHandle as any).createWritable();
        try {
          const jsonString = JSON.stringify(snpMap);
          await writable.write(jsonString);
        } finally {
          try {
            await writable.close();
          } catch {
            // Already closed or aborted
          }
        }
        return { success: true, usedOPFS: true };
      }
    } catch (err) {
      console.warn(`[OPFS] Failed to write snp_map for ${datasetId}, falling back to IndexedDB:`, err);
    }
  }

  // Fallback to IndexedDB
  try {
    await set(`${IDB_FALLBACK_PREFIX}${datasetId}`, snpMap);
    return { success: true, usedOPFS: false };
  } catch (idbErr) {
    console.error(`[OPFS Fallback] Failed to save snp_map for ${datasetId} in IndexedDB:`, idbErr);
    return { success: false, usedOPFS: false };
  }
}

/**
 * Loads a raw chromosome SNP map from OPFS, checking fallback storage if not present in OPFS.
 */
export async function loadSnpMapFromOPFS(
  datasetId: string
): Promise<Record<string, string> | null> {
  const opfsAvailable = await isOPFSSupported();

  if (opfsAvailable) {
    try {
      const root = await navigator.storage.getDirectory();
      const datasetDir = await getDirectoryRecursive(root, [OPFS_DIR, DATASETS_DIR, datasetId], false);
      if (datasetDir) {
        try {
          const fileHandle = await datasetDir.getFileHandle('snp_map.json', { create: false });
          const file = await fileHandle.getFile();
          const text = await file.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              if (parsed && typeof parsed === 'object') {
                return parsed;
              }
            } catch (jsonErr) {
              console.warn(`[OPFS] Corrupted JSON in snp_map for ${datasetId}, attempting fallback:`, jsonErr);
            }
          }
        } catch {
          // File not found in OPFS, check fallback
        }
      }
    } catch (err) {
      console.warn(`[OPFS] Error reading snp_map for ${datasetId}:`, err);
    }
  }

  // Check IndexedDB fallback
  try {
    const fallback = await get<Record<string, string>>(`${IDB_FALLBACK_PREFIX}${datasetId}`);
    return fallback || null;
  } catch (err) {
    console.error(`[OPFS Fallback] Failed to retrieve fallback snp_map for ${datasetId}:`, err);
    return null;
  }
}

/**
 * Deletes the raw chromosome SNP map for a given dataset from both OPFS and fallback storage.
 */
export async function deleteSnpMapFromOPFS(datasetId: string): Promise<boolean> {
  let deletedFromOPFS = false;
  const opfsAvailable = await isOPFSSupported();

  if (opfsAvailable) {
    try {
      const root = await navigator.storage.getDirectory();
      const parentDir = await getDirectoryRecursive(root, [OPFS_DIR, DATASETS_DIR], false);
      if (parentDir) {
        // Remove dataset directory recursively
        await (parentDir as any).removeEntry(datasetId, { recursive: true });
        deletedFromOPFS = true;
      }
    } catch {
      // Ignored if directory did not exist
    }
  }

  // Also clean up fallback key in IndexedDB
  try {
    await del(`${IDB_FALLBACK_PREFIX}${datasetId}`);
  } catch (err) {
    console.warn(`[OPFS Fallback] Failed to delete fallback key for ${datasetId}:`, err);
  }

  return deletedFromOPFS;
}

/**
 * Saves an arbitrary binary buffer (e.g. packed GSR1 reference or BAM/BED slice) to OPFS.
 */
export async function saveBinaryBufferToOPFS(
  filename: string,
  buffer: ArrayBuffer | Uint8Array
): Promise<{ success: boolean; usedOPFS: boolean }> {
  const opfsAvailable = await isOPFSSupported();

  if (opfsAvailable) {
    try {
      const root = await navigator.storage.getDirectory();
      const baseDir = await getDirectoryRecursive(root, [OPFS_DIR], true);
      if (baseDir) {
        const fileHandle = await baseDir.getFileHandle(filename, { create: true });
        const writable = await (fileHandle as any).createWritable();
        try {
          await writable.write(buffer);
        } finally {
          await writable.close();
        }
        return { success: true, usedOPFS: true };
      }
    } catch (err) {
      console.warn(`[OPFS] Failed to write binary buffer ${filename}:`, err);
    }
  }

  // Fallback to IndexedDB
  try {
    await set(`${IDB_BIN_FALLBACK_PREFIX}${filename}`, buffer);
    return { success: true, usedOPFS: false };
  } catch (err) {
    console.error(`[OPFS Fallback] Failed to store binary buffer ${filename}:`, err);
    return { success: false, usedOPFS: false };
  }
}

/**
 * Loads an arbitrary binary buffer from OPFS with fallback.
 */
export async function loadBinaryBufferFromOPFS(
  filename: string
): Promise<ArrayBuffer | null> {
  const opfsAvailable = await isOPFSSupported();

  if (opfsAvailable) {
    try {
      const root = await navigator.storage.getDirectory();
      const baseDir = await getDirectoryRecursive(root, [OPFS_DIR], false);
      if (baseDir) {
        const fileHandle = await baseDir.getFileHandle(filename, { create: false });
        const file = await fileHandle.getFile();
        return await file.arrayBuffer();
      }
    } catch {
      // Not found in OPFS, fallback
    }
  }

  try {
    const fallback = await get<ArrayBuffer | Uint8Array>(`${IDB_BIN_FALLBACK_PREFIX}${filename}`);
    if (fallback) {
      if (fallback instanceof ArrayBuffer) return fallback;
      if (ArrayBuffer.isView(fallback)) {
        const copy = new Uint8Array(fallback.byteLength);
        copy.set(new Uint8Array(fallback.buffer, fallback.byteOffset, fallback.byteLength));
        return copy.buffer as ArrayBuffer;
      }
    }
    return null;
  } catch (err) {
    console.error(`[OPFS Fallback] Failed to load binary buffer ${filename}:`, err);
    return null;
  }
}
