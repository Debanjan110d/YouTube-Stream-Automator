import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeClient } from '@/lib/youtube';
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

export async function POST(request: NextRequest) {
  try {
    if (!isRequestTrusted(request)) {
      return NextResponse.json(
        { error: 'CORS policy blocks cross-origin stream creation requests.' },
        { status: 403 }
      );
    }

    // Retrieve secure session to log channel stats
    const session = await getSession();
    
    const youtube = await getYouTubeClient();
    if (!youtube || !session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    // Parse incoming form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string || '28'; // Default: Science & Technology
    const privacyStatus = formData.get('privacyStatus') as string || 'public';
    const scheduledTime = formData.get('scheduledTime') as string;
    const tagsJson = formData.get('tags') as string; // Expecting a JSON array string
    const thumbnailFile = formData.get('thumbnail') as File | null;

    // Kick parameters
    const kickSync = formData.get('kickSync') === 'true';
    const gameName = formData.get('gameName') as string || 'Just Chatting';

    // Validate inputs
    if (!title || !scheduledTime) {
      return NextResponse.json(
        { error: 'Title and Scheduled Time are required fields.' },
        { status: 400 }
      );
    }

    // Parse tags array safely
    let tags: string[] = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        tags = tagsJson.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    console.log('Initiating stream creation pipeline...');

    // 1. Insert YouTube Live Broadcast
    const broadcastResponse = await youtube.liveBroadcasts.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          scheduledStartTime: new Date(scheduledTime).toISOString(),
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
    });

    const videoId = broadcastResponse.data.id;
    if (!videoId) {
      throw new Error('YouTube Broadcast creation succeeded but no video ID was returned.');
    }

    // 2. Set Category and Search Tags
    await youtube.videos.update({
      part: ['snippet'],
      requestBody: {
        id: videoId,
        snippet: {
          title,
          description,
          categoryId,
          tags,
        },
      },
    });

    // 3. Upload Thumbnail (if provided)
    if (thumbnailFile) {
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await youtube.thumbnails.set({
        videoId,
        media: {
          mimeType: thumbnailFile.type,
          body: buffer,
        },
      });
    }

    // 4. Find active ingest stream key and bind it to broadcast
    let boundStream = false;
    try {
      const streamListRes = await youtube.liveStreams.list({
        part: ['snippet', 'cdn'],
        mine: true,
      });

      const activeStream = streamListRes.data.items?.[0];
      if (activeStream && activeStream.id) {
        await youtube.liveBroadcasts.bind({
          id: videoId,
          part: ['id', 'snippet'],
          streamId: activeStream.id,
        });
        boundStream = true;
        console.log(`Successfully bound stream ${activeStream.id} to broadcast.`);
      }
    } catch (streamError) {
      console.warn('Failed to bind active default ingest stream key. Creator must bind OBS manually:', streamError);
    }

    // 5. Sync metadata to Kick (if checked and authenticated)
    let kickSynced = false;
    let kickError: string | null = null;

    if (kickSync && session.kickAccessToken) {
      try {
        console.log(`Syncing Kick category lookup for: ${gameName}`);
        
        let kickCategoryId: number | null = null;
        
        // 5a. Lookup Kick Category by Game name
        const catRes = await fetch(`https://api.kick.com/public/v1/categories?q=${encodeURIComponent(gameName)}`, {
          headers: {
            'Authorization': `Bearer ${session.kickAccessToken}`,
            'Accept': 'application/json',
          }
        });
        
        if (catRes.ok) {
          const catData = await catRes.json();
          kickCategoryId = catData.data?.[0]?.id || null;
        } else {
          console.warn('Failed to query categories from Kick API:', await catRes.text());
        }

        // 5b. Update channel title & category
        const patchRes = await fetch('https://api.kick.com/public/v1/channels', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.kickAccessToken}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            stream_title: title,
            category_id: kickCategoryId || undefined,
          }),
        });

        if (patchRes.ok || patchRes.status === 204) {
          kickSynced = true;
          console.log('Kick channel metadata updated successfully.');
        } else {
          const errBody = await patchRes.text();
          kickError = `Status ${patchRes.status}: ${errBody}`;
          console.warn('Kick channel update rejected:', kickError);
        }
      } catch (kickErr: any) {
        kickError = kickErr.message || String(kickErr);
        console.error('Failed to sync to Kick channel:', kickErr);
      }
    }

    // 6. Append scheduling action to Server-Side Analytics (Stored locally in analytics.json)
    try {
      const analyticsPath = path.join(process.cwd(), 'analytics.json');
      let analyticsData: any[] = [];
      
      try {
        const fileContent = await fs.readFile(analyticsPath, 'utf-8');
        analyticsData = JSON.parse(fileContent);
      } catch (readError) {
        // Fallback if file doesn't exist yet
      }

      analyticsData.push({
        timestamp: new Date().toISOString(),
        channelName: session.channelName || 'Unknown Creator',
        channelAvatar: session.channelAvatar || '',
        videoId,
        title,
        categoryId,
        privacyStatus,
        kickSynced,
      });

      await fs.writeFile(analyticsPath, JSON.stringify(analyticsData, null, 2), 'utf-8');
      console.log('Analytics logged successfully.');
    } catch (analyticsError) {
      console.error('Failed to write to analytics file:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      videoId,
      boundStream,
      kickSynced,
      kickError,
      message: kickSync 
        ? (kickSynced ? 'YouTube & Kick broadcasts synced successfully!' : `YouTube scheduled, but Kick sync failed: ${kickError}`)
        : 'Live stream scheduled and configured successfully!',
    });
  } catch (error: any) {
    console.error('Pipeline Error:', error);

    const errMessage = error.message || '';
    const isLiveStreamingDisabled = errMessage.includes('not enabled for live streaming');

    if (isLiveStreamingDisabled) {
      return NextResponse.json(
        { error: 'Live streaming is not enabled on this YouTube channel. Please visit YouTube Studio to request activation (takes 24 hours to verify).' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to complete stream configuration pipeline.', details: error.message },
      { status: 500 }
    );
  }
}
