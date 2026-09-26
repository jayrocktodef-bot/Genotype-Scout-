/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as idb from 'idb-keyval';
import {
  isOPFSSupported,
  saveSnpMapToOPFS,
  loadSnpMapFromOPFS,
  deleteSnpMapFromOPFS,
  saveBinaryBufferToOPFS,
  loadBinaryBufferFromOPFS
} from './opfsStorageService';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn()
}));

describe('opfsStorageService (Origin Private File System with Fallback)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isOPFSSupported', () => {
    it('returns false when navigator.storage.getDirectory is missing', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: {},
          configurable: true,
          writable: true
        });
        const supported = await isOPFSSupported();
        expect(supported).toBe(false);
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });

    it('returns true when navigator.storage.getDirectory is a function', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: { getDirectory: vi.fn() },
          configurable: true,
          writable: true
        });
        const supported = await isOPFSSupported();
        expect(supported).toBe(true);
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });
  });

  describe('Fallback behavior (OPFS unavailable)', () => {
    it('saves SNP map to IndexedDB when OPFS is unsupported', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: {},
          configurable: true,
          writable: true
        });

        const sampleSnps = { rs12345: 'AA', rs67890: 'CT' };
        const res = await saveSnpMapToOPFS('test-kit-001', sampleSnps);

        expect(res.success).toBe(true);
        expect(res.usedOPFS).toBe(false);
        expect(idb.set).toHaveBeenCalledWith('opfs_fallback_snp_test-kit-001', sampleSnps);
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });

    it('loads SNP map from IndexedDB when OPFS is unsupported', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: {},
          configurable: true,
          writable: true
        });

        const sampleSnps = { rs12345: 'AA' };
        vi.mocked(idb.get).mockResolvedValueOnce(sampleSnps);

        const loaded = await loadSnpMapFromOPFS('test-kit-001');
        expect(loaded).toEqual(sampleSnps);
        expect(idb.get).toHaveBeenCalledWith('opfs_fallback_snp_test-kit-001');
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });

    it('deletes fallback entry from IndexedDB', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: {},
          configurable: true,
          writable: true
        });

        await deleteSnpMapFromOPFS('test-kit-001');
        expect(idb.del).toHaveBeenCalledWith('opfs_fallback_snp_test-kit-001');
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });
  });

  describe('OPFS native operations', () => {
    it('writes SNP map to OPFS directory handle when supported', async () => {
      const mockWritable = {
        write: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined)
      };
      const mockFileHandle = {
        createWritable: vi.fn().mockResolvedValue(mockWritable)
      };
      const mockDatasetDir = {
        getFileHandle: vi.fn().mockResolvedValue(mockFileHandle)
      };
      const mockDatasetsDir = {
        getDirectoryHandle: vi.fn().mockResolvedValue(mockDatasetDir)
      };
      const mockGenotypeScoutDir = {
        getDirectoryHandle: vi.fn().mockResolvedValue(mockDatasetsDir)
      };
      const mockRoot = {
        getDirectoryHandle: vi.fn().mockResolvedValue(mockGenotypeScoutDir)
      };

      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: { getDirectory: vi.fn().mockResolvedValue(mockRoot) },
          configurable: true,
          writable: true
        });

        const sampleSnps = { rs111: 'GG', rs222: 'TT' };
        const res = await saveSnpMapToOPFS('kit-opfs-1', sampleSnps);

        expect(res.success).toBe(true);
        expect(res.usedOPFS).toBe(true);
        expect(mockWritable.write).toHaveBeenCalledWith(JSON.stringify(sampleSnps));
        expect(mockWritable.close).toHaveBeenCalled();
        expect(idb.set).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });

    it('reads SNP map from OPFS file handle when present', async () => {
      const sampleSnps = { rs333: 'AG' };
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(sampleSnps))
      };
      const mockFileHandle = {
        getFile: vi.fn().mockResolvedValue(mockFile)
      };
      const mockDatasetDir = {
        getFileHandle: vi.fn().mockResolvedValue(mockFileHandle)
      };
      const mockDatasetsDir = {
        getDirectoryHandle: vi.fn().mockResolvedValue(mockDatasetDir)
      };
      const mockGenotypeScoutDir = {
        getDirectoryHandle: vi.fn().mockResolvedValue(mockDatasetsDir)
      };
      const mockRoot = {
        getDirectoryHandle: vi.fn().mockResolvedValue(mockGenotypeScoutDir)
      };

      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: { getDirectory: vi.fn().mockResolvedValue(mockRoot) },
          configurable: true,
          writable: true
        });

        const loaded = await loadSnpMapFromOPFS('kit-opfs-1');
        expect(loaded).toEqual(sampleSnps);
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });

    it('falls back to IndexedDB if OPFS write throws an unexpected exception', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: {
            getDirectory: vi.fn().mockRejectedValue(new Error('QuotaExceeded in OPFS'))
          },
          configurable: true,
          writable: true
        });

        const sampleSnps = { rs555: 'CC' };
        const res = await saveSnpMapToOPFS('kit-failing', sampleSnps);

        expect(res.success).toBe(true);
        expect(res.usedOPFS).toBe(false);
        expect(idb.set).toHaveBeenCalledWith('opfs_fallback_snp_kit-failing', sampleSnps);
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });
  });

  describe('Binary buffer storage', () => {
    it('saves and loads binary buffers via fallback', async () => {
      const originalStorage = global.navigator.storage;
      try {
        Object.defineProperty(global.navigator, 'storage', {
          value: {},
          configurable: true,
          writable: true
        });

        const buffer = new Uint8Array([1, 2, 3, 4, 5]);
        const saveRes = await saveBinaryBufferToOPFS('reference.bin', buffer);
        expect(saveRes.success).toBe(true);
        expect(idb.set).toHaveBeenCalledWith('opfs_fallback_bin_reference.bin', buffer);

        vi.mocked(idb.get).mockResolvedValueOnce(buffer);
        const loaded = await loadBinaryBufferFromOPFS('reference.bin');
        expect(loaded).not.toBeNull();
        expect(new Uint8Array(loaded!)).toEqual(buffer);
      } finally {
        Object.defineProperty(global.navigator, 'storage', {
          value: originalStorage,
          configurable: true,
          writable: true
        });
      }
    });
  });
});
