import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination");

  if (!destination) {
    return NextResponse.json({ error: "Destination is required" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
  }

  const query = encodeURIComponent(`${destination} travel guide`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=4&videoCategoryId=19&relevanceLanguage=en&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "YouTube API error", detail: errText }, { status: res.status });
    }
    const data = await res.json();
    // Return only the fields we need to keep payload small
    const videos = (data.items || []).map((item: any) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
      channelTitle: item.snippet?.channelTitle,
    }));
    return NextResponse.json({ videos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch YouTube videos" }, { status: 500 });
  }
}
