/**
 * Client-Side AES-GCM-256 Genomic Vault
 * Cryptographically seals raw genotype files and analysis results in browser storage
 * using PBKDF2 (100,000 iterations, SHA-256) and AES-GCM-256 authenticated encryption.
 * Zero plain-text data leaves the local client.
 */

export interface EncryptedVaultPayload {
  version: '1.0';
  algorithm: 'AES-GCM-256';
  kdf: 'PBKDF2-HMAC-SHA256';
  iterations: 100000;
  saltHex: string;
  ivHex: string;
  ciphertextBase64: string;
  timestamp: string;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts genomic raw content or session JSON using a user-specified passphrase.
 */
export async function encryptGenomicData(
  plaintext: string,
  passphrase: string
): Promise<EncryptedVaultPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const encodedData = enc.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    encodedData
  );

  return {
    version: '1.0',
    algorithm: 'AES-GCM-256',
    kdf: 'PBKDF2-HMAC-SHA256',
    iterations: 100000,
    saltHex: arrayBufferToHex(salt.buffer),
    ivHex: arrayBufferToHex(iv.buffer),
    ciphertextBase64: arrayBufferToBase64(ciphertext),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Decrypts an encrypted vault payload back to plain text using the passphrase.
 */
export async function decryptGenomicData(
  payload: EncryptedVaultPayload,
  passphrase: string
): Promise<string> {
  const salt = hexToArrayBuffer(payload.saltHex);
  const iv = hexToArrayBuffer(payload.ivHex);
  const ciphertext = base64ToArrayBuffer(payload.ciphertextBase64);

  const key = await deriveKey(passphrase, salt);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch {
    throw new Error('Decryption failed: Invalid passphrase or corrupted vault file.');
  }
}
