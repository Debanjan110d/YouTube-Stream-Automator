import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function isRequestTrusted(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  const host = request.headers.get('host');
  const xForwardedHost = request.headers.get('x-forwarded-host');
  const targetHost = xForwardedHost || host;
  if (!targetHost) return false;

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host === targetHost) return true;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (appUrl && originUrl.host === new URL(appUrl).host) return true;
    } catch {
      return false;
    }
    return false;
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === targetHost) return true;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (appUrl && refererUrl.host === new URL(appUrl).host) return true;
    } catch {
      return false;
    }
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  if (!isRequestTrusted(request)) {
    return NextResponse.json(
      { error: 'CORS policy blocks cross-origin retrieval of session token.' },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('youtube_stream_session')?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'No active session found. Please connect your YouTube account first.' },
      { status: 401 }
    );
  }

  // returning raw token for mcp config mapping
  return NextResponse.json({token: sessionCookie});
}
