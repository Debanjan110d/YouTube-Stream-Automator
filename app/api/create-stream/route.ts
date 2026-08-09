import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeClient } from '@/lib/youtube';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';


export async function POST(request: NextRequest) {
  try {
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


    // 1. Create the Live Broadcast event (setting selfDeclaredMadeForKids to false as requested)
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
          selfDeclaredMadeForKids: false, // Forces NOT FOR KIDS (normal stream)
        },
      },
    });

    const videoId = broadcastResponse.data.id;
    if (!videoId) {
      throw new Error('YouTube failed to return a valid Broadcast ID.');
    }
    console.log(`Step 1 Complete: Broadcast created with Video ID: ${videoId}`);


    // 2. Set Category and Tags (belong to the Video object container)
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
    console.log(`Step 2 Complete: Applied category (${categoryId}) and tags to Video: ${videoId}`);


    // 3. Upload Thumbnail (if provided)
    if (thumbnailFile && thumbnailFile.size > 0) {
      try {
        const arrayBuffer = await thumbnailFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await youtube.thumbnails.set({
          videoId,
          media: {
            mimeType: thumbnailFile.type || 'image/jpeg',
            body: buffer,
          },
        });
        console.log('Step 3 Complete: Thumbnail uploaded successfully.');
      } catch (thumbError: any) {
        console.error('Warning: Failed to upload thumbnail:', thumbError);
      }
    } else {
      console.log('Step 3 Skipped: No thumbnail provided.');
    }


    // 4. Bind the broadcast to the user's default ingest Stream Key (Optional but highly recommended for OBS)
    let boundStream = false;
    try {
      console.log('Attempting to bind stream to default ingest key...');
      const streamsResponse = await youtube.liveStreams.list({
        mine: true,
        part: ['id', 'snippet'],
        maxResults: 1,
      });

      const streamId = streamsResponse.data.items?.[0]?.id;
      if (streamId) {
        await youtube.liveBroadcasts.bind({
          id: videoId,
          part: ['id', 'snippet'],
          streamId,
        });
        boundStream = true;
        console.log(`Step 4 Complete: Broadcast bound successfully to Stream Key ID: ${streamId}`);
      } else {
        console.log('Step 4 Warn: No active Stream Key found on YouTube. Stream is scheduled but unbound.');
      }
    } catch (bindError) {
      console.error('Warning: Could not bind broadcast to a stream key automatically:', bindError);
    }


    // 5. Append scheduling action to Server-Side Analytics (Stored locally in analytics.json)
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
      message: 'Live stream scheduled and configured successfully!',
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
