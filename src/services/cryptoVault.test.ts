import { describe, it, expect } from 'vitest';
import { encryptGenomicData, decryptGenomicData } from './cryptoVault';

describe('WebCrypto Genomic Vault (AES-GCM-256)', () => {
  it('encrypts and decrypts genomic text accurately', async () => {
    const rawDnaSample = 'rs123\t1\t1000\tAA\nrs456\t1\t2000\tAG\n';
    const passphrase = 'UltraSecureResearcherPassphrase2026!';

    const encrypted = await encryptGenomicData(rawDnaSample, passphrase);

    expect(encrypted.version).toBe('1.0');
    expect(encrypted.algorithm).toBe('AES-GCM-256');
    expect(encrypted.ciphertextBase64).toBeDefined();
    expect(encrypted.ciphertextBase64).not.toContain('rs123');

    const decrypted = await decryptGenomicData(encrypted, passphrase);
    expect(decrypted).toBe(rawDnaSample);
  });

  it('rejects decryption when an incorrect passphrase is provided', async () => {
    const rawDnaSample = 'rs999\t2\t5000\tCC\n';
    const encrypted = await encryptGenomicData(rawDnaSample, 'CorrectPassword123');

    await expect(
      decryptGenomicData(encrypted, 'WrongPassword456')
    ).rejects.toThrow('Decryption failed');
  });
});
