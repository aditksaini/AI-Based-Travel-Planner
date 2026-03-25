import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenWeather API key is not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 3600 } } // revalidate every 1 hour
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || 'Failed to fetch weather data' }, { status: res.status });
    }

    const data = await res.json();

    // Determine travel advice
    const weatherMain = data.weather[0].main;
    const temp = data.main.temp;
    let travel_advice = "Weather looks good for travel 🌤️";

    if (weatherMain === "Rain") {
      travel_advice = "Carry an umbrella ☔";
    } else if (temp > 35) {
      travel_advice = "Stay hydrated 🥵";
    }

    // Format the response
    const formattedData = {
      city: data.name,
      country: data.sys.country,
      temperature: temp,
      feels_like: data.main.feels_like,
      weather: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      travel_advice
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Internal server error while fetching weather data' }, { status: 500 });
  }
}
