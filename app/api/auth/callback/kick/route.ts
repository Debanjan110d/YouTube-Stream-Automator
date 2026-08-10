import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession, setSessionCookie } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;
  const appUrl = new URL(request.url).origin;

  // Retrieve and delete state and PKCE verifier cookies
  const cookieStore = await cookies();
  const savedState = cookieStore.get('kick_oauth_state')?.value;
  const codeVerifier = cookieStore.get('kick_oauth_verifier')?.value;
  
  cookieStore.delete('kick_oauth_state');
  cookieStore.delete('kick_oauth_verifier');

  if (error) {
    console.error('Kick OAuth Callback Error:', error);
    return NextResponse.redirect(`${appUrl}/dashboard?error=${encodeURIComponent(error)}`);
  }

  // 1. Validate CSRF State parameter
  if (!savedState || !state || savedState !== state) {
    console.warn('Kick OAuth State validation failed. Potential CSRF attempt.');
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=${encodeURIComponent('Security Warning: Kick OAuth state mismatch.')}`
    );
  }

  if (!code || !codeVerifier) {
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=${encodeURIComponent('Verification parameters are missing.')}`
    );
  }

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=${encodeURIComponent('Kick OAuth secret keys are not configured.')}`
    );
  }

  try {
    const redirectUri = `${appUrl}/api/auth/callback/kick`;

    // 2. Exchange authorization code + code_verifier for OAuth tokens
    const tokenParams = new URLSearchParams();
    tokenParams.set('grant_type', 'authorization_code');
    tokenParams.set('client_id', clientId);
    tokenParams.set('client_secret', clientSecret);
    tokenParams.set('code', code);
    tokenParams.set('redirect_uri', redirectUri);
    tokenParams.set('code_verifier', codeVerifier);

    const tokenRes = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Token exchange failed: ${errText}`);
    }

    const tokens = await tokenRes.json();

    // 3. Fetch creator profile details from Kick public API
    // Fetch user details (name, avatar)
    const userRes = await fetch('https://api.kick.com/public/v1/users', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json',
      },
    });

    // Fetch channel slug
    const channelRes = await fetch('https://api.kick.com/public/v1/channels', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json',
      },
    });

    let channelSlug = '';
    let userName = 'Kick Streamer';
    let userAvatar = '';

    if (userRes.ok) {
      const userPayload = await userRes.json();
      const userData = userPayload.data?.[0];
      if (userData) {
        userName = userData.name || userName;
        userAvatar = userData.profile_picture || userAvatar;
      }
    } else {
      console.warn('Failed to retrieve Kick user profile info:', await userRes.text());
    }

    if (channelRes.ok) {
      const channelPayload = await channelRes.json();
      const channelData = channelPayload.data?.[0];
      if (channelData) {
        channelSlug = channelData.slug || channelSlug;
      }
    } else {
      console.warn('Failed to retrieve Kick channel slug:', await channelRes.text());
    }

    // 4. Merge new Kick credentials with existing YouTube session variables
    const currentSession = await getSession() || {};
    
    await setSessionCookie({
      ...currentSession,
      kickAccessToken: tokens.access_token,
      kickRefreshToken: tokens.refresh_token,
      kickExpiryDate: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
      kickChannelSlug: channelSlug || userName.toLowerCase().replace(/\s+/g, '-'),
      kickChannelName: userName,
      kickChannelAvatar: userAvatar,
    });

    return NextResponse.redirect(`${appUrl}/dashboard?success=kick_connected`);
  } catch (err: any) {
    console.error('Kick OAuth exchange exception:', err);
    return NextResponse.redirect(
      `${appUrl}/dashboard?error=${encodeURIComponent(err.message || 'Kick authorization error')}`
    );
  }
}
