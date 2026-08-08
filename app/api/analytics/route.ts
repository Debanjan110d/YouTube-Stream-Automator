import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';


export async function GET() {
  try {
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
