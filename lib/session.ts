import { EncryptJWT, jwtDecrypt } from 'jose';
import { cookies } from 'next/headers';


// Define the session cookie name
const COOKIE_NAME = 'youtube_stream_session';


// Define the session payload structure
export interface SessionPayload {
  accessToken: string;
  refreshToken?: string;
  expiryDate?: number; // timestamp in milliseconds when access token expires
  channelName?: string;
  channelAvatar?: string;
}


/**
 * Derives a secure 256-bit (32-byte) key from the SESSION_SECRET using Web Crypto API.
 * This ensures compatibility with both standard Node.js and Edge/Serverless runtimes.
 */
async function getEncryptionKey(): Promise<Uint8Array> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET environment variable is missing or too short (must be at least 32 characters).');
  }
  
  const encoder = new TextEncoder();
  const secretData = encoder.encode(secret);
  
  // Use Web Crypto SHA-256 to hash the secret into a consistent 32-byte (256-bit) array
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretData);
  return new Uint8Array(hashBuffer);
}


/**
 * Encrypts session payload into a JWE (JSON Web Encryption) token using AES-256-GCM.
 * This keeps the tokens completely opaque (encrypted) on the client-side.
 */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  const secretKey = await getEncryptionKey();
  
  return await new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }) // Direct encryption with AES-GCM
    .setIssuedAt()
    .setExpirationTime('30d') // Session is valid for 30 days
    .encrypt(secretKey);
}


/**
 * Decrypts and decrypts a JWE token. Returns null if invalid or expired.
 */
export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = await getEncryptionKey();
    const { payload } = await jwtDecrypt(token, secretKey, {
      contentEncryptionAlgorithms: ['A256GCM'],
      keyManagementAlgorithms: ['dir'],
    });
    
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error('Failed to decrypt session cookie (token might be tampered or expired):', error);
    return null;
  }
}


/**
 * Helper to encrypt and set the session cookie on the response.
 * Uses secure cookie flags: HttpOnly, Secure (prod only), SameSite=Lax.
 */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // Prevents client-side scripts from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Forces HTTPS in production
    sameSite: 'lax', // CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}


/**
 * Helper to retrieve and decrypt the current session payload from cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) {
    return null;
  }
  return await decryptSession(cookie.value);
}


/**
 * Helper to clear the session cookie.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
