import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // strict csrf cross-origin & referer validation just to be safe
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (origin && !origin.startsWith(appUrl)) {
    return NextResponse.json(
      { error: 'CORS policy blocks cross-origin retrieval of session token.' },
      { status: 403 }
    );
  }

  if (referer && !referer.startsWith(appUrl)) {
    return NextResponse.json(
      { error: 'Referer validation failed. Request originates from an untrusted source.' },
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
