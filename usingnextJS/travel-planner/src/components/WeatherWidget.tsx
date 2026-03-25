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

  const temp = weatherData?.temperature ? Math.round(weatherData.temperature) : 24;
  const humidity = weatherData?.humidity ? weatherData.humidity : 60;
  const description = weatherData?.weather 
    ? weatherData.weather.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : "Mostly Sunny & Clear";
  const displayLocation = weatherData?.city || location;
  const country = weatherData?.country ? `, ${weatherData.country}` : "";
  const feelsLike = weatherData?.feels_like ? Math.round(weatherData.feels_like) : null;
  const windSpeed = weatherData?.wind_speed || null;
  const icon = weatherData?.icon || null;
  const travelAdvice = weatherData?.travel_advice || "";

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/40 to-black/40 border border-violet/30 rounded-2xl p-6 mt-4 shadow-[0_0_30px_rgba(138,43,226,0.1)] hover:border-violet/60 transition-colors cursor-default relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* subtle weather blur effect */}
      <div className="absolute top-0 right-10 w-24 h-24 bg-white/5 blur-xl rounded-full mix-blend-overlay"></div>
      
      <div className="relative z-10">
        <h4 className="text-white/60 font-outfit uppercase tracking-widest text-[10px] font-bold mb-3">Forecast Overview</h4>
        
        <div className="flex items-center gap-3">
          {icon && (
            <div className="bg-white/10 rounded-full p-1 backdrop-blur-sm">
              <img src={icon} alt={description} className="w-10 h-10 object-contain drop-shadow" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-black text-white">{displayLocation}<span className="text-lg text-white/50">{country}</span></h2>
            <p className="text-violet-300 text-sm mt-0.5">{description}</p>
          </div>
        </div>
        
        {travelAdvice && (
          <div className="mt-4 bg-violet-900/40 border border-violet-500/30 rounded-lg py-1.5 px-3 inline-flex items-center backdrop-blur-sm">
            <span className="text-violet-200 text-xs font-medium tracking-wide">{travelAdvice}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 sm:text-right mt-2 sm:mt-0 flex flex-col sm:items-end w-full sm:w-auto">
        <h1 className="text-5xl font-black text-white tracking-tighter">{temp}°<span className="text-2xl text-white/50 ml-1">C</span></h1>
        
        {feelsLike && (
          <p className="text-white/60 text-xs mt-1 font-medium">Feels like: {feelsLike}°C</p>
        )}
        
        <div className="flex sm:justify-end gap-4 text-white/50 text-xs mt-3 bg-black/20 py-2 px-3 rounded-xl border border-white/5">
          <p className="flex items-center gap-1">
            <svg className="w-3 h-3 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            Humidity: <span className="text-white">{humidity}%</span>
          </p>
          {windSpeed && (
            <p className="flex items-center gap-1">
              <svg className="w-3 h-3 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Wind: <span className="text-white">{windSpeed} m/s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
