import { google } from 'googleapis';
import { getSession, setSessionCookie } from './session';


/**
 * Retrieves an authenticated YouTube API client.
 * If the current access token is expired, it automatically uses the refresh token
 * to obtain a new access token, updates the session cookie, and returns the updated client.
 */
export async function getYouTubeClient() {
  const session = await getSession();
  
  if (!session || !session.accessToken) {
    return null;
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !clientSecret || !appUrl) {
    throw new Error('Google OAuth credentials are not properly configured.');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${appUrl}/api/auth/callback`
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
    expiry_date: session.expiryDate,
  });

  // Determine if the token is expired or within 60 seconds of expiring
  const isExpired = session.expiryDate
    ? Date.now() >= session.expiryDate - 60000
    : true;

  if (isExpired && session.refreshToken) {
    try {
      console.log('Access token expired or expiring soon, refreshing...');
      const { credentials } = await oauth2Client.refreshAccessToken();

      // Save new tokens to the session cookie
      await setSessionCookie({
        ...session,
        accessToken: credentials.access_token || session.accessToken,
        expiryDate: credentials.expiry_date || undefined,
        refreshToken: credentials.refresh_token || session.refreshToken, // keep existing refresh token if not returned
      });

      // Update current oauth2Client credentials
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Failed to refresh YouTube access token:', error);
      return null;
    }
  }

  return google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });
}
