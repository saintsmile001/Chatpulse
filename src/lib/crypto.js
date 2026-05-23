/**
 * ChatPulse - Client-side AES-GCM encryption for Supabase keys
 * Uses Web Crypto API to encrypt/decrypt user credentials before storage.
 */

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12

/**
 * Derive a CryptoKey from a passphrase using PBKDF2.
 * Uses the platform Supabase URL as a salt for simplicity in v1.
 */
async function deriveKey(passphrase) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  const salt = encoder.encode(import.meta.env.VITE_PLATFORM_SUPABASE_URL || 'chatpulse-default-salt')

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt a plaintext string. Returns a base64 string containing IV + ciphertext.
 */
export async function encryptKey(plaintext, passphrase = 'chatpulse-v1-key') {
  const encoder = new TextEncoder()
  const key = await deriveKey(passphrase)
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plaintext)
  )

  // Combine IV + ciphertext into a single array, then base64 encode
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)

  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypt a base64 string containing IV + ciphertext. Returns the original plaintext.
 */
export async function decryptKey(ciphertext, passphrase = 'chatpulse-v1-key') {
  const decoder = new TextDecoder()
  const key = await deriveKey(passphrase)

  // Decode base64
  const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0))

  // Extract IV and encrypted data
  const iv = combined.slice(0, IV_LENGTH)
  const data = combined.slice(IV_LENGTH)

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  )

  return decoder.decode(decrypted)
}
