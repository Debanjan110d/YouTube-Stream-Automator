import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;
  const appUrl = new URL(request.url).origin;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Kick OAuth credentials are not configured in Vercel environment variables.' },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback/kick`;

  // 1. Generate PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // 2. Generate a secure random state parameter for CSRF defense
  const state = crypto.randomUUID();

  // 3. Save verifier and state in temporary HttpOnly cookies
  const cookieStore = await cookies();
  
  cookieStore.set('kick_oauth_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // Valid for 10 minutes
    path: '/',
  });

  cookieStore.set('kick_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // Valid for 10 minutes
    path: '/',
  });

  // 4. Construct Kick Auth URL
  // Required scope: channel:write to update title/category and user:read to fetch profile
  const scopes = 'user:read channel:read channel:write';
  
  const authUrl = new URL('https://id.kick.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  return NextResponse.redirect(authUrl.toString());
}
