import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: !!session.accessToken,
    youtube: session.accessToken ? {
      name: session.channelName,
      avatar: session.channelAvatar,
    } : null,
    kick: session.kickAccessToken ? {
      slug: session.kickChannelSlug,
      name: session.kickChannelName,
      avatar: session.kickChannelAvatar,
    } : null,
  });
}
