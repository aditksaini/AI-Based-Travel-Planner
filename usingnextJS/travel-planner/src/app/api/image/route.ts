import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Pexels API key is not configured' }, { status: 500 });
  }

  try {
    // We add "architecture" or "city" to force Pexels to avoid returning generic tags like 'weddings' or 'people' that happen to be taken in that city.
    const searchQuery = `${query} architecture city landmark`;
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&orientation=landscape&size=large&per_page=1`,
      {
        headers: {
          Authorization: apiKey,
        },
        next: { revalidate: 86400 } // revalidate every 24 hours
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch image data from Pexels' }, { status: res.status });
    }

    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return NextResponse.json({ imageUrl: data.photos[0].src.large2x || data.photos[0].src.large });
    } else {
      return NextResponse.json({ error: 'No images found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error fetching image data:', error);
    return NextResponse.json({ error: 'Internal server error while fetching image data' }, { status: 500 });
  }
}
