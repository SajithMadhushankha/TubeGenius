// This service handles YouTube API calls.
// Note: In a production environment, sensitive operations like token exchange should happen server-side.
// Here we assume client-side usage with API Key for public data, and OAuth token for private data.

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const getVideoDetails = async (videoId: string, apiKey: string) => {
  if (!apiKey) throw new Error("YouTube API Key required");
  
  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`YouTube API Error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.items?.[0] || null;
};

// Requires OAuth Access Token
export const getCaptionsList = async (videoId: string, accessToken: string) => {
  if (!accessToken) throw new Error("OAuth Access Token required for captions");

  const url = `${YOUTUBE_API_BASE}/captions?part=snippet&videoId=${videoId}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Failed to fetch captions list");
  }

  return await response.json();
};

export const downloadCaptionTrack = async (captionId: string, accessToken: string, tfmt: 'srt' | 'vtt' = 'vtt') => {
  const url = `${YOUTUBE_API_BASE}/captions/${captionId}?tfmt=${tfmt}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) throw new Error("Failed to download caption track");
  return await response.text();
};

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
