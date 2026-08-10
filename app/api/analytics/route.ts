import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';


export async function GET(request: NextRequest) {
  try {
    // 1. Strict CSRF Cross-Origin & Referer validation
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (origin && !origin.startsWith(appUrl)) {
      return NextResponse.json(
        { error: 'CORS policy blocks cross-origin analytics access.' },
        { status: 403 }
      );
    }

    if (referer && !referer.startsWith(appUrl)) {
      return NextResponse.json(
        { error: 'Referer validation failed. Request originates from an untrusted source.' },
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

    // Determine authorization permission
    const ownerChannel = process.env.OWNER_CHANNEL_NAME || "Gamer's Code Lab";
    const isOwner = session.channelName?.toLowerCase().trim() === ownerChannel.toLowerCase().trim();

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
