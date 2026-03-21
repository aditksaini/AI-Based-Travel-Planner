"use client";

import React, { useEffect, useState } from "react";

export default function WeatherWidget({ location = "Destination" }: { location?: string }) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      if (location === "Destination" || !location) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setWeatherData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [location]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-900/40 to-black/40 border border-violet/30 rounded-2xl p-6 mt-4 flex items-center justify-center shadow-[0_0_30px_rgba(138,43,226,0.1)] h-32 hover:border-violet/60 transition-colors">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-violet-400 animate-spin"></div>
      </div>
    );
  }

  const temp = weatherData?.main?.temp ? Math.round(weatherData.main.temp) : 24;
  const humidity = weatherData?.main?.humidity ? weatherData.main.humidity : 60;
  const description = weatherData?.weather?.[0]?.description 
    ? weatherData.weather[0].description.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : "Mostly Sunny & Clear";
  const displayLocation = weatherData?.name || location;

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/40 to-black/40 border border-violet/30 rounded-2xl p-6 mt-4 flex items-center justify-between shadow-[0_0_30px_rgba(138,43,226,0.1)] hover:border-violet/60 transition-colors cursor-default relative overflow-hidden">
      {/* subtle weather icon blur effect */}
      <div className="absolute top-0 right-10 w-24 h-24 bg-white/5 blur-xl rounded-full mix-blend-overlay"></div>
      
      <div className="relative z-10">
        <h4 className="text-white/60 font-outfit uppercase tracking-widest text-[10px] font-bold mb-1">Forecast Overview</h4>
        <h2 className="text-3xl font-black text-white">{displayLocation}</h2>
        <p className="text-violet-300 text-sm mt-1">{description}</p>
      </div>
      <div className="text-right relative z-10">
        <h1 className="text-5xl font-black text-white">{temp}°<span className="text-2xl text-white/50">C</span></h1>
        <p className="text-white/50 text-xs mt-2">Humidity: {humidity}%</p>
      </div>
    </div>
  );
}
