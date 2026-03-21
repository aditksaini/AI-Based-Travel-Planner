import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Example required points checking, but we'll accept any valid graphhopper request
  const points = searchParams.getAll('point');
  if (points.length < 2 && searchParams.has('point')) {
    return NextResponse.json({ error: 'At least two points are required for routing' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GraphHopper API key is not configured' }, { status: 500 });
  }

  try {
    // Construct the query parameters for GraphHopper
    const query = new URLSearchParams(searchParams);
    query.set('key', apiKey);

    // Support Geocoding if 'q' is provided
    if (query.has('q')) {
      const res = await fetch(
        `https://graphhopper.com/api/1/geocode?${query.toString()}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default to car profile if not provided for routing
    if (!query.has('profile')) {
      query.set('profile', 'car');
    }

    const res = await fetch(
      `https://graphhopper.com/api/1/route?${query.toString()}`,
      { next: { revalidate: 3600 } } // revalidate every 1 hour to match weather/pexel api pattern
    );

    if (!res.ok) {
      // Safely try to parse error data from GraphHopper
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: 'Failed to fetch routing data from GraphHopper' };
      }
      return NextResponse.json({ error: errorData.message || 'Failed to fetch routing data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching GraphHopper data:', error);
    return NextResponse.json({ error: 'Internal server error while fetching routing data' }, { status: 500 });
  }
}
