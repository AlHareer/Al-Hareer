import { cookies } from 'next/headers';
import ImageKit from 'imagekit';
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from '@/lib/adminSession';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

// Admin-only: issues short-lived signed-upload credentials for the ImageKit
// client SDK. Swaps SakPack-India's /api/cloudinary/sign route.
export async function GET() {
  const cookieStore = await cookies();
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  });
}
