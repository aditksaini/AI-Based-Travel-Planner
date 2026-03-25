import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination');

    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const pexelsApiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY || process.env.PEXELS_API_KEY;

    if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }
    if (!pexelsApiKey) {
      return NextResponse.json({ error: 'Pexels API key is not configured' }, { status: 500 });
    }

    // Step 1: Call Gemini API ONLY for query generation
    const prompt = `For the travel destination '${destination}', return the name of the most famous landmark, monument, or iconic place.

Rules:
* Include the exact landmark name
* Include city/state if needed
* Include country name
* Keep it short (3-6 words)
* Be specific (NOT generic like 'beach' or 'mountains')
* DO NOT explain anything

Examples:
Input: Goa
Output: Baga Beach Goa India

Input: Paris
Output: Eiffel Tower Paris France

Input: Jaipur
Output: Hawa Mahal Jaipur India

Input: Agra
Output: Taj Mahal Agra India

Return ONLY the landmark name.`;

    let searchQuery = '';

    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResult) {
          searchQuery = textResult.trim().replace(/^["']|["']$/g, '');
        }
      } else {
        console.error('Gemini error status:', geminiRes.status);
      }
    } catch (err) {
      console.error('Gemini fetch error:', err);
    }

    // Step 2, 3: Fetch from Pexels manually
    const fetchPexels = async (query: string) => {
      try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=15`, {
          headers: { Authorization: pexelsApiKey as string }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            // Select first landscape image (width > height)
            const validPhotos = data.photos.filter((p: any) => p.width > p.height);
            if (validPhotos.length > 0) {
              return validPhotos[0];
            }
            return data.photos[0]; // fallback to first if no strict landscape available
          }
        }
      } catch (err) {
        console.error('Pexels fetch error:', err);
      }
      return null;
    };

    let photo = null;

    if (searchQuery) {
      photo = await fetchPexels(searchQuery);
    }

    // Step 4: Fallback
    // If Gemini fails or result is empty from Pexels
    let fallbackTriggered = false;
    
    if (!photo) {
      searchQuery = `${destination} famous landmark`;
      photo = await fetchPexels(searchQuery);
      fallbackTriggered = true;
    }

    let imageUrl = '';
    let photographer = '';

    if (photo) {
      imageUrl = photo.src.large2x || photo.src.large || photo.src.original;
      photographer = photo.photographer || 'Unknown';
    }

    // Response Format
    return NextResponse.json({
      destination,
      image: {
        url: imageUrl || '',
        photographer: photographer || ''
      }
    });

  } catch (error: any) {
    console.error('Error in /api/get-destination-image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
