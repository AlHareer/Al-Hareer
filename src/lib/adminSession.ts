// Self-contained, HMAC-signed admin session cookie — independent of Supabase Auth.
// Built on Web Crypto (not Node's `crypto` module) so it also works from
// middleware, which runs in the Edge runtime. Ported from SakPack-India's
// lib/adminSession.js.
export const COOKIE_NAME = 'admin_session';
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}

function fromBase64Url(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'base64url'));
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const encodedPayload = Buffer.from(JSON.stringify({ email, expires })).toString('base64url');
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload));
  return `${encodedPayload}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

export async function verifyAdminSessionToken(token?: string | null): Promise<{ email: string } | null> {
  if (!token) return null;
  const [encodedPayload, sig] = token.split('.');
  if (!encodedPayload || !sig) return null;

  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(sig) as BufferSource,
      new TextEncoder().encode(encodedPayload)
    );
    if (!valid) return null;

    const { email, expires } = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!email || !expires || Date.now() > expires) return null;
    return { email };
  } catch {
    return null;
  }
}
