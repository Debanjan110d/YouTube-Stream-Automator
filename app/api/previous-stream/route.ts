import { NextResponse } from 'next/server';
import { getYouTubeClient } from '@/lib/youtube';

export async function GET() {
  try {
    const youtube = await getYouTubeClient();
    if (!youtube) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    // 1. Fetch the user's most recent live broadcast event
    const broadcastResponse = await youtube.liveBroadcasts.list({
      mine: true,
      maxResults: 1,
      broadcastType: 'all',
      part: ['id', 'snippet'],
    });

    const broadcasts = broadcastResponse.data.items;
    if (!broadcasts || broadcasts.length === 0) {
      return NextResponse.json(
        { message: 'No live stream broadcasts found on this channel.' },
        { status: 404 }
      );
    }

    const broadcast = broadcasts[0];
    const videoId = broadcast.id;

    if (!videoId) {
      return NextResponse.json(
        { message: 'Active video ID not found for the last broadcast.' },
        { status: 404 }
      );
    }

    // 2. Fetch specific details of the video (to extract tags and category)
    const videoResponse = await youtube.videos.list({
      id: [videoId],
      part: ['snippet', 'status'],
    });

    const videos = videoResponse.data.items;
    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { message: 'Could not fetch details for the previous stream video container.' },
        { status: 404 }
      );
    }

    const videoSnippet = videos[0].snippet;
    const videoStatus = videos[0].status;

    // 3. Return stream metadata back to the UI
    return NextResponse.json({
      title: videoSnippet?.title || '',
      description: videoSnippet?.description || '',
      tags: videoSnippet?.tags || [],
      categoryId: videoSnippet?.categoryId || '28', // Default to Science & Tech
      privacyStatus: videoStatus?.privacyStatus || 'public',
    });
  } catch (error: any) {
    console.error('Error fetching previous stream details:', error);
    
    const errMessage = error.message || '';
    const isLiveStreamingDisabled = errMessage.includes('not enabled for live streaming');

    if (isLiveStreamingDisabled) {
      return NextResponse.json(
        { error: 'Live streaming is not enabled on this YouTube channel. Please visit YouTube Studio to request activation (takes 24 hours to verify).' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch previous stream details.', details: error.message },
      { status: 500 }
    );
  }
}
