import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { setSessionCookie } from '@/lib/session';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const returnedState = searchParams.get('state');

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  
  // Dynamically resolve origin from request
  const appUrl = new URL(request.url).origin;

  // Retrieve and delete the saved OAuth state cookie to verify origin
  const cookieStore = await cookies();
  const savedState = cookieStore.get('oauth_state')?.value;
  cookieStore.delete('oauth_state');

  if (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(`${appUrl}/dashboard?error=${encodeURIComponent(error)}`);
  }

  // 1. Verify OAuth State parameter to protect against CSRF attacks
  if (!savedState || !returnedState || savedState !== returnedState) {
    console.warn('OAuth State validation failed. Potential CSRF attempt.');
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=${encodeURIComponent('Security Warning: OAuth state mismatch.')}`
    );
  }

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing.' }, { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Google Client ID or Client Secret environment values are missing.' },
      { status: 500 }
    );
  }

  try {
    const redirectUri = `${appUrl}/api/auth/callback`;
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Exchange authorization code server-side for access/refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user's channel details
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    const channelResponse = await youtube.channels.list({
      mine: true,
      part: ['snippet'],
    });

    const channel = channelResponse.data.items?.[0];
    const channelName = channel?.snippet?.title || 'YouTube Creator';
    const channelAvatar = channel?.snippet?.thumbnails?.default?.url || '';

    // Encrypt and save token session inside secure JWE HttpOnly cookie
    await setSessionCookie({
      accessToken: tokens.access_token || '',
      refreshToken: tokens.refresh_token || undefined,
      expiryDate: tokens.expiry_date || undefined,
      channelName,
      channelAvatar,
    });

    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch (err: any) {
    console.error('Error during token exchange:', err);
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=${encodeURIComponent(err.message || 'Token exchange failed')}`
    );
  }
}
