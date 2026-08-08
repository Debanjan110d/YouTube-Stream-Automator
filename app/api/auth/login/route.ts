import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';


export async function GET() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !clientSecret || !appUrl) {
    return NextResponse.json(
      { error: 'OAuth credentials or App URL is not configured in environment variables.' },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback`;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  // Cryptographically random state to defend against OAuth CSRF attacks
  const state = crypto.randomUUID();

  // Save the state in a short-lived HttpOnly secure cookie
  const cookieStore = await cookies();
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // Valid for 10 minutes
    path: '/',
  });

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Requests persistent refresh token
    prompt: 'consent',     // Forces consent consent screen to return fresh refresh token
    scope: scopes,
    state: state,           // State passed to Google OAuth endpoint
  });

  return NextResponse.redirect(authUrl);
}
