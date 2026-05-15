import { get, set } from 'idb-keyval';

const DNA_KEY_NAME = 'genotype_scout_enc_key';
const STORED_DNA_PREFIX = 'dna_vault_';

/**
 * Generates or retrieves a local AES-GCM encryption key.
 * This key never leaves the browser.
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  const existingKey = await get(DNA_KEY_NAME);
  if (existingKey) return existingKey as CryptoKey;

  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // Extractable only for storage in IndexedDB
    ['encrypt', 'decrypt']
  );
  
  await set(DNA_KEY_NAME, key);
  return key;
}

/**
 * Encrypts and saves the parsed DNA data to local storage.
 */
export async function saveParsedDNA(datasetId: string, dna: any) {
  try {
    const key = await getOrCreateEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(dna));
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    await set(`${STORED_DNA_PREFIX}${datasetId}`, {
      encryptedBuffer,
      iv
    });
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

/**
 * Retrieves and decrypts the parsed DNA data from local storage.
 */
export async function getParsedDNA(datasetId: string): Promise<any | null> {
  try {
    const stored = await get(`${STORED_DNA_PREFIX}${datasetId}`);
    if (!stored) return null;

    const { encryptedBuffer, iv } = stored;
    const key = await getOrCreateEncryptionKey();
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );

    const decodedData = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
