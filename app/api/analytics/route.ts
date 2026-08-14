import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';

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

function cleanName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function GET(request: NextRequest) {
  try {
    if (!isRequestTrusted(request)) {
      return NextResponse.json(
        { error: 'CORS policy blocks cross-origin analytics access.' },
        { status: 403 }
      );
    }

    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    // Determine authorization permission using clean alpha-numeric matching
    const ownerChannel = process.env.OWNER_CHANNEL_NAME || "Gamer's Code Lab";
    const sessionChannel = session.channelName || '';
    const isOwner = cleanName(sessionChannel) === cleanName(ownerChannel);

    if (!isOwner) {
      return NextResponse.json(
        { error: `Forbidden. Access to analytics is restricted to the administrator channel ("${ownerChannel}").` },
        { status: 403 }
      );
    }

    // Read analytics logs from local storage
    const analyticsPath = path.join(process.cwd(), 'analytics.json');
    let analyticsData: any[] = [];

    try {
      const fileContent = await fs.readFile(analyticsPath, 'utf-8');
      analyticsData = JSON.parse(fileContent);
    } catch (readError) {
      // File does not exist yet; return empty array
    }

    // Return analytics log entries
    return NextResponse.json({
      success: true,
      ownerChannel,
      data: analyticsData.reverse(), // Show newest logs first
    });
  } catch (error: any) {
    console.error('Error fetching analytics details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics details.', details: error.message },
      { status: 500 }
    );
  }
}
