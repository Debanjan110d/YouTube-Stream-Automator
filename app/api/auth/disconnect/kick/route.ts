import { NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  const session = await getSession();
  
  if (session) {
    // Destructure to remove all Kick variables, keeping YouTube session active
    const {
      kickAccessToken,
      kickRefreshToken,
      kickExpiryDate,
      kickChannelSlug,
      kickChannelName,
      kickChannelAvatar,
      ...youtubeSession
    } = session;
    
    await setSessionCookie(youtubeSession);
  }
  
  const appUrl = new URL(request.url).origin;
  return NextResponse.json({ success: true });
}
export async function GET(request: Request) {
  const session = await getSession();
  
  if (session) {
    const {
      kickAccessToken,
      kickRefreshToken,
      kickExpiryDate,
      kickChannelSlug,
      kickChannelName,
      kickChannelAvatar,
      ...youtubeSession
    } = session;
    
    await setSessionCookie(youtubeSession);
  }
  
  const appUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${appUrl}/dashboard`);
}
