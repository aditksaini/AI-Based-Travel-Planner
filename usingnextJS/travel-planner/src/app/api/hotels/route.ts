import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination') || 'Indore';
  const passengers = searchParams.get('passengers') || '1';
  const days = parseInt(searchParams.get('days') || '5', 10);
  const budget = parseFloat(searchParams.get('budget') || '50000');

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST || 'booking-com15.p.rapidapi.com';
  const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  // Pre-calculate realistic fallback data in case RapidAPI fails
  let fallbackImages: string[] = [];
  try {
    if (pexelsKey) {
      const pexRes = await fetch(`https://api.pexels.com/v1/search?query=luxury+hotel+room&per_page=6`, {
        headers: { Authorization: pexelsKey }
      });
      if (pexRes.ok) {
        const pexData = await pexRes.json();
        fallbackImages = pexData.photos?.map((p: any) => p.src.large) || [];
      }
    }
  } catch (e) {
    console.error("Pexels fallback image fetch failed", e);
  }

  const generateFallbackHotels = (dest: string, basePrice: number, images: string[]) => {
    const defaultImages = [
      "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];
    
    // Capitalize destination for names
    const city = dest.charAt(0).toUpperCase() + dest.slice(1);
    
    const names = [
      `Grand ${city} Palace`,
      `The ${city} Residency`,
      `${city} Marriott Hotel`,
      `Radisson Blu ${city}`,
      `Crown Plaza ${city}`,
      `Lemon Tree Premium ${city}`
    ];

    return Array.from({ length: 6 }).map((_, i) => ({
      id: `fallback-${i}`,
      name: names[i] || `Premium Hotel ${city}`,
      image: images[i] || defaultImages[i],
      price: Math.max(1500, Math.round(basePrice * (1 + (Math.random() * 0.4 - 0.2)))), // Add some realistic price variance
      rating: 8 + Math.floor(Math.random() * 2), // 8 or 9 out of 10 usually
      link: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`
    }));
  };

  const basePriceAllocation = Math.max(2500, Math.round((budget * 0.3) / days));

  try {
    // 1. Search for destination ID
    const destRes = await fetch(`https://${apiHost}/api/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    });

    if (!destRes.ok) {
      const errText = await destRes.text();
      throw new Error(`RapidAPI Destination Error: ${errText}`);
    }

    const destData = await destRes.json();
    let destId = '';
    let searchType = 'CITY';
    
    // Attempt to locate standard booking_com dest_id
    if (destData && destData.data && destData.data.length > 0) {
      destId = destData.data[0].dest_id;
      searchType = destData.data[0].search_type || 'CITY';
    }

    if (!destId) {
       throw new Error(`Could not locate destination ID for ${destination}`);
    }

    // 2. Fetch hotels
    const today = new Date();
    const arrivalDate = today.toISOString().split('T')[0];
    const departureDateObj = new Date(today);
    departureDateObj.setDate(today.getDate() + days);
    const departureDate = departureDateObj.toISOString().split('T')[0];

    const hotelsRes = await fetch(`https://${apiHost}/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${searchType}&arrival_date=${arrivalDate}&departure_date=${departureDate}&adults=${passengers}&room_qty=1&languagecode=en-us&currency_code=INR`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    });

    if (!hotelsRes.ok) {
      const errText = await hotelsRes.text();
      throw new Error(`RapidAPI Hotels Error: ${errText}`);
    }

    const hotelsData = await hotelsRes.json();
    
    // Parse results
    const results = (hotelsData.data?.hotels || hotelsData.data || []).slice(0, 6);
    
    if (results.length === 0) {
       throw new Error("API returned an empty hotel list.");
    }

    const hotelsList = results.map((hotel: any) => {
      const hotelName = hotel.property?.name || hotel.hotel_name || 'Premium Resort';
      const hotelImageRaw = hotel.property?.photoUrls?.[0] || hotel.max_photo_url || null;
      let hotelPrice = hotel.property?.priceBreakdown?.grossPrice?.value || hotel.min_total_price || basePriceAllocation;
      
      const rating = hotel.property?.reviewScore || hotel.review_score || 8.5;

      return {
        id: hotel.hotel_id || hotel.property?.id || Math.random().toString(),
        name: hotelName,
        image: hotelImageRaw ? hotelImageRaw.replace('square60', 'square500') : fallbackImages[0] || null,
        price: hotelPrice,
        rating: rating,
        link: hotel.share_url || hotel.url || '#'
      };
    });

    // Provide 6 items exactly
    while (hotelsList.length < 6) {
        hotelsList.push(generateFallbackHotels(destination, basePriceAllocation, fallbackImages)[hotelsList.length]);
    }

    return NextResponse.json({
      hotels: hotelsList.slice(0, 6)
    });

  } catch (error: any) {
    console.warn('Handling RapidAPI Error gracefully:', error.message);
    
    // If the error includes quota messages, we still return HTTP 200 so the frontend gets the realistic data
    // but we can append an informational boolean
    const isQuotaExceeded = error.message?.toLowerCase().includes('quota') || error.message?.toLowerCase().includes('429');
    
    const realisticMockData = generateFallbackHotels(destination, basePriceAllocation, fallbackImages);
    
    return NextResponse.json({
      hotels: realisticMockData,
      warning: isQuotaExceeded 
         ? "Your RapidAPI free plan has exceeded its monthly quota! Displaying realistic generated mock data for demo purposes." 
         : `API Issue encountered (${error.message}). Displaying generated mock data.`
    });
  }
}
